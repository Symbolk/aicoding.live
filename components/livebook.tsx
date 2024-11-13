'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpIcon, BookOpen, Sparkles, Loader2 } from "lucide-react"
import { useI18n } from '@/i18n/context'
import { ScriptViewer } from './livebook/script-viewer'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

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
          // 等待一段时间再显示下一个场景
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      setGeneratingProgress(prev => ({
        ...prev,
        status: 'done'
      }))
      
      // 短暂延迟后显示聊天界面
      setTimeout(() => {
        setScript(scriptData)
        setLoading(false)
      }, 1000)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center justify-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="w-10 h-10 mr-3" />
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {t('livebook.title')}
          </h1>
        </motion.div>

        {loading ? (
          <motion.div 
            className="max-w-4xl mx-auto p-8 rounded-lg bg-white/10 backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <h2 className="text-xl font-semibold">剧本生成中...</h2>
            </div>
            <div className="space-y-4">
              {generatingProgress.scenes.map((scene, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded bg-white/5"
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
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8 mb-16 relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-none p-8 hover:bg-white/15 transition-colors">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
                    {t('livebook.pasteStory')}
                  </h2>
                  <div className="flex flex-col h-[calc(100%-theme(spacing.16))]">
                    <Textarea 
                      placeholder={t('livebook.pasteHere')}
                      className="flex-1 min-h-[300px] mb-6 resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                      value={storyText}
                      onChange={(e) => setStoryText(e.target.value)}
                    />
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 h-14 text-lg font-semibold" 
                      onClick={handleGenerateScript}
                    >
                      {loading ? t('livebook.generating') : t('livebook.liveButton')}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <span className="bg-transparent px-6 py-3 text-xl font-medium text-white/70">
                  {t('common.or')}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-none p-8 hover:bg-white/15 transition-colors">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <ArrowUpIcon className="w-6 h-6 mr-3 text-green-400" />
                    {t('livebook.uploadFile')}
                  </h2>
                  <div className="flex flex-col h-[calc(100%-theme(spacing.16))]">
                    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg mb-6 hover:border-purple-400/50 transition-colors group">
                      <Input
                        type="file"
                        accept=".txt,.pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload" 
                        className="cursor-pointer text-center p-8 w-full h-full flex flex-col items-center justify-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:bg-purple-400/20 transition-colors">
                          <ArrowUpIcon className="w-8 h-8 text-white/70 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <p className="text-lg text-white/90 mb-2">{t('livebook.chooseFile')}</p>
                        <p className="text-sm text-white/50">{t('livebook.supportedFormats')}</p>
                      </label>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 h-14 text-lg font-semibold"
                    >
                      {t('livebook.liveButton')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none hover:bg-white/15 transition-colors">
                <div className="aspect-video relative bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <img 
                    src="/placeholder.svg?height=200&width=400&text=Fantasy+Adventure" 
                    alt="Fantasy Adventure Example"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{t('livebook.examples.fantasy.title')}</h3>
                  <p className="text-white/70">{t('livebook.examples.fantasy.description')}</p>
                </div>
              </Card>

              <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none hover:bg-white/15 transition-colors">
                <div className="aspect-video relative bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <img 
                    src="/placeholder.svg?height=200&width=400&text=Shakespeare+Interactive" 
                    alt="Shakespeare Interactive Example"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{t('livebook.examples.shakespeare.title')}</h3>
                  <p className="text-white/70">{t('livebook.examples.shakespeare.description')}</p>
                </div>
              </Card>

              <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none hover:bg-white/15 transition-colors">
                <div className="aspect-video relative bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <img 
                    src="/placeholder.svg?height=200&width=400&text=Modern+Stories" 
                    alt="Modern Stories Example"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-white">{t('livebook.examples.modern.title')}</h3>
                  <p className="text-white/70">{t('livebook.examples.modern.description')}</p>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 right-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </main>
    </div>
  )
}