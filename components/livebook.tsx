'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpIcon, BookOpen, Sparkles, Loader2, Check } from "lucide-react"
import { useI18n } from '@/i18n/context'
import { ScriptViewer } from './livebook/script-viewer'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import ReactCanvasConfetti from 'react-canvas-confetti'

// 添加 Confetti 样式
const confettiStyle = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 999
} as const

export function LiveBook() {
  const { t } = useI18n()
  const [storyText, setStoryText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<any>(null)
  const [generatingProgress, setGeneratingProgress] = useState<{
    status: 'idle' | 'generating' | 'done'
    scenes: string[]
    currentScene: number
  }>({
    status: 'idle',
    scenes: [],
    currentScene: 0
  })
  const [isConfettiActive, setIsConfettiActive] = useState(false)

  // 添加 Confetti 实例引用
  const [confettiInstance, setConfettiInstance] = useState<((opts: any) => void) | null>(null)

  const handleConfettiInstance = useCallback((instance: any) => {
    setConfettiInstance(instance)
  }, [])

  // 触发 Confetti 效果
  const fireConfetti = useCallback(() => {
    if (!confettiInstance) return
    
    setIsConfettiActive(true)
    confettiInstance({
      spread: 90,
      startVelocity: 45,
      particleCount: 100,
      origin: { y: 0.6 }
    })

    // 0.5秒后再次触发
    setTimeout(() => {
      confettiInstance({
        spread: 70,
        startVelocity: 35,
        particleCount: 50,
        origin: { y: 0.7 }
      })
    }, 500)
  }, [confettiInstance])

  const handleGenerateScript = async () => {
    if (!storyText.trim()) return

    setLoading(true)
    setGeneratingProgress({
      status: 'generating',
      scenes: [],
      currentScene: 0
    })

    try {
      const response = await fetch('/api/livebook/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: storyText }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate script')
      }

      const scriptData = await response.json()
      
      // 模拟场景生成过程
      for (const scene of scriptData.scenes) {
        if (scene.type === 'scene') {
          setGeneratingProgress(prev => ({
            ...prev,
            scenes: [...prev.scenes, scene.content],
            currentScene: prev.scenes.length
          }))
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      setGeneratingProgress(prev => ({
        ...prev,
        status: 'done'
      }))
      
      // 触发完成动画
      fireConfetti()
      
      // 延迟显示聊天界面
      setTimeout(() => {
        setScript(scriptData)
        setLoading(false)
        setIsConfettiActive(false)
      }, 2000)

    } catch (error) {
      console.error('Error generating script:', error)
      setLoading(false)
    }
  }

  if (script) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-white"
      >
        <ScriptViewer title={script.title} scenes={script.scenes} />
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full hover:scale-110 transition-transform"
          onClick={() => setScript(null)}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <ReactCanvasConfetti
        refConfetti={handleConfettiInstance}
        style={confettiStyle}
      />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            {t('livebook.title')}
          </h1>
        </motion.div>

        {loading ? (
          <motion.div 
            className="max-w-4xl mx-auto p-8 rounded-lg border border-gray-200 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              {generatingProgress.status === 'done' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-green-600">生成完成！</h2>
                </motion.div>
              ) : (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <h2 className="text-xl font-semibold">剧本生成中...</h2>
                </>
              )}
            </div>
            <div className="space-y-4">
              {generatingProgress.scenes.map((scene, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded bg-gray-50"
                >
                  <TypeAnimation
                    sequence={[scene]}
                    wrapper="p"
                    speed={50}
                    cursor={index === generatingProgress.currentScene}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                      {t('livebook.pasteStory')}
                    </h2>
                    <div className="flex flex-col flex-1">
                      <Textarea 
                        placeholder={t('livebook.pasteHere')}
                        className="flex-1 mb-4 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                      />
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors h-10 text-base font-medium"
                        onClick={handleGenerateScript}
                      >
                        {loading ? t('livebook.generating') : t('livebook.liveButton')}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                      <ArrowUpIcon className="w-5 h-5 mr-2 text-green-500" />
                      {t('livebook.uploadFile')}
                    </h2>
                    <div className="flex flex-col flex-1">
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg mb-4 hover:border-blue-500/50 transition-colors group">
                        <Input
                          type="file"
                          accept=".txt,.pdf"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors">
                            <ArrowUpIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="text-base text-gray-900 mb-1">{t('livebook.chooseFile')}</p>
                          <p className="text-sm text-gray-500">{t('livebook.supportedFormats')}</p>
                        </label>
                      </div>
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 transition-colors h-10 text-base font-medium"
                      >
                        {t('livebook.liveButton')}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-[420px]">
                <div className="h-[200px] relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <img 
                    src="/placeholders/space_war.png"
                    alt="星际殖民战争"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">星际殖民与巨猿之战</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      一个关于人类星际扩张、殖民统治，以及遭遇强大对手的史诗故事...
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    参军那一年，我刚好17岁。我经历过地球所谓黄金的十年。随着达尔文先驱号探险队成功发现了第一颗类地星球开始，人类进入了星际殖民时代...
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setStoryText(`参军那一年，我刚好17岁。我经历过地球所谓黄金的十年。随着达尔文先驱号探险队成功发现了第一颗类地星球开始，人类进入了星际殖民时代。星球代表着资源，而资源代表着财富。人类为财富而疯狂，而掠夺恢复了人类的天性！越来越多的星球被发现，人类消灭了贫困，夜夜狂欢，地球从此没有了黑夜。殖民的过程不会一帆风顺，谁会心甘情愿被外来物种殖民，即使是最原始的种族。但是人类的科技轻而易举地就震慑住了殖民星球的原住民，他们在武力之下屈服，反抗在人来看来显得可笑而幼稚。人类被接二连三地胜利冲昏了头脑，各种歌颂人类殖民行动的艺术作品层出不久，连哲学家们也开始出来吹捧。我们不是万物之灵，我们是宇宙之灵，小小的银河系将是宇宙的中心。直到遇到了更加强大的对手，我们称他们为巨猿。他们嗜血而残忍，我们也称他们阴险且狡诈，不懂建立友谊，以为武力可以征服一切。他们经过改造的身体异常强大，甚至可以在真空中生存。他们的战斗风格勇猛和蛮横，像中世纪的维京海盗。他们手中的巨斧可以劈开地球最坚硬的物质，人类的舰队不是被他们的炮火击毁，而是被他们的战士撕碎！从他们开始侵占第一颗殖民星球开始，人类开始尝试与敌人谈判。得到的答复却是一段十秒钟的吼叫！令人吃惊的是，我们的语言专家在人类失去了一大半殖民星球之后，竟然破译了那段吼叫。"你们将变成宇宙的尘埃，我们要夺回地球！"`)
                    }}
                  >
                    点击使用这个故事
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-[420px]">
                <div className="h-[200px] relative bg-gradient-to-br from-green-500/10 to-yellow-500/10">
                  <img 
                    src="/placeholders/animal_farm.png"
                    alt="动物农场"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">动物农场</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      一个关于农场动物们追求平等与自由的寓言故事...
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    农场的琼斯先生，过夜前倒是把鸡舍一一上了锁，可实在因为酒喝得太多，还有好些旁门小洞却忘了关上...
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setStoryText(`农场的琼斯先生，过夜前倒是把鸡舍一一上了锁，可实在因为酒喝得太多，还有好些旁门小洞却忘了关上。他打着趔趄走过院子，手里提的一盏灯的环状光影也跟着晃来荡去。一进后门，赶紧甩腿踢掉脚上的靴子，先从洗碗间的啤酒桶里汲取了这天的最后一杯，然后往琼斯太太已经在那儿打呼噜的床上走去。
卧室里的灯光刚一熄灭，一阵轻微的响动顿时席卷农场里所有的圈棚厩舍。日间就已有所传闻，说是老少校——也就是那头曾经获奖的公猪——头天夜里做了个奇怪的梦，想要讲给别的动物听听。此前已经约定，但等拿得稳琼斯先生不会来搅局了，所有的动物马上到大谷仓集合。老少校（大伙一直都这么叫他，虽然昔年他参展时的报名是维林敦帅哥）在农场里真可谓德高望重，每一只动物都不惜少睡个把小时，十分乐意来听听他要讲些什么。
大谷仓的一端有个稍显隆起的平台，少校已然给安置在那儿铺了干草的一张床上，从梁上挂下来的一盏灯就在他上边，挺舒坦。他有一十二岁了，近来颇有些发福，但他仍不失为一头相貌堂堂的猪，俨然一位睿智的忠厚长者，尽管事实上他的犬牙始终没有长出来。过不多久，其余的动物也开始陆续到场，并按各自不同的习惯安顿停当。最先来的是三条狗，分别叫做蓝铃铛、杰茜和钳爪；接着到的几头猪当即在平台前安营扎寨。一些个母鸡栖留在窗台上；有几只鸽子扑棱棱飞上了椽子；牛羊们在猪后面趴下来，开始倒嚼。两匹拉套干重活的马，一匹叫拳击手，一匹叫紫苜蓿，是齐头并进一起来的。他俩走得非常慢，毛茸茸的大蹄子踩到地上时十分小心翼翼，生怕干草里会藏着什么小动物似的。紫苜蓿是一匹母性洋溢的壮实雌马，现在步入其中年期，在生育过四胎之后，她再也没能重塑自己昔日的体态风韵。拳击手则是个庞然大物，几乎有六英尺高，论力气顶得上寻常的马两匹合起来那么大。顺着他鼻梁长就白白的一道毛色，使他的相貌总有那么点儿傻里傻气，而他的智能也确实算不上出类拔萃，不过凭着其坚忍不拔的性格和惊天动地的干劲，他还是到处赢得大家的尊敬。继两匹拉套马之后到达的是白山羊慕莉尔和驴子本杰明。后者在农场里算得上最资深的动物，脾气也是最坏的。他难得说话，一旦开口通常会发表一些冷嘲热讽的怪论，例如他会说上帝赐给他尾巴以便驱赶苍蝇，然而他宁愿尾巴和苍蝇都不要。在农场的动物中，唯独他从来不笑。倘若被问到这是为什么，他会说他看不出来有什么值得一笑。不过，他对拳击手倒是佩服得五体投地，尽管并不公开承认这一点；他俩每每一块儿到果园后面的一小块牧地去共度星期天，互相紧挨着吃草，可就是从不搭话。`)
                    }}
                  >
                    点击使用这个故事
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-[420px]">
                <div className="h-[200px] relative bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <img 
                    src="/placeholder.svg?height=200&width=400&text=Modern+Stories" 
                    alt="Modern Stories Example"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('livebook.examples.modern.title')}</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {t('livebook.examples.modern.description')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    {/* 添加示例文本 */}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                  >
                    点击使用这个故事
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpIcon className="h-3 w-3" />
        </Button>
      </main>
    </div>
  )
}