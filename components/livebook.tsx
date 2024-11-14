'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpIcon, BookOpen, Sparkles, Loader2, Check } from "lucide-react"
import { useI18n } from '@/i18n/context'
import { ScriptViewer } from './livebook/script-viewer'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Confetti } from '@/components/ui/confetti'

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
  const confettiRef = useRef<any>(null)

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

  const fireConfetti = useCallback(() => {
    if (!confettiRef.current) return
    
    setIsConfettiActive(true)
    confettiRef.current.fire({
      spread: 90,
      startVelocity: 45,
      particleCount: 100,
      origin: { y: 0.6 }
    })

    // 0.5秒后再次触发
    setTimeout(() => {
      confettiRef.current.fire({
        spread: 70,
        startVelocity: 35,
        particleCount: 50,
        origin: { y: 0.7 }
      })
    }, 500)
  }, [])

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
      <Confetti
        ref={confettiRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 999
        }}
        manualstart
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
                    src={t('livebook.examples.spaceWar.image')}
                    alt={t('livebook.examples.spaceWar.title')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('livebook.examples.spaceWar.title')}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {t('livebook.examples.spaceWar.description')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    {t('livebook.examples.spaceWar.preview')}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                    onClick={() => setStoryText(t('livebook.examples.spaceWar.content'))}
                  >
                    {t('livebook.useThisStory')}
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-[420px]">
                <div className="h-[200px] relative bg-gradient-to-br from-green-500/10 to-yellow-500/10">
                  <img 
                    src={t('livebook.examples.animalFarm.image')}
                    alt={t('livebook.examples.animalFarm.title')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('livebook.examples.animalFarm.title')}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {t('livebook.examples.animalFarm.description')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    {t('livebook.examples.animalFarm.preview')}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                    onClick={() => setStoryText(t('livebook.examples.animalFarm.content'))}
                  >
                    {t('livebook.useThisStory')}
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-[420px]">
                <div className="h-[200px] relative bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <img 
                    src={t('livebook.examples.moonlightForest.image')}
                    alt={t('livebook.examples.moonlightForest.title')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('livebook.examples.moonlightForest.title')}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {t('livebook.examples.moonlightForest.description')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm text-gray-600 line-clamp-4 mb-auto">
                    {t('livebook.examples.moonlightForest.preview')}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setStoryText(t('livebook.examples.moonlightForest.content'))
                    }}
                  >
                    {t('livebook.useThisStory')}
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