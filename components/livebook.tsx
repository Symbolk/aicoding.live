'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpIcon, BookOpen } from "lucide-react"
import { useI18n } from '@/i18n/context'
import { ScriptViewer } from './script-viewer'
import { motion, AnimatePresence } from 'framer-motion'

export function LiveBook() {
  const { t } = useI18n()
  const [storyText, setStoryText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<any>(null)

  const handleGenerateScript = async () => {
    if (!storyText.trim()) return

    setLoading(true)
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
      setScript(scriptData)
    } catch (error) {
      console.error('Error generating script:', error)
    } finally {
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
          className="fixed bottom-4 right-4 rounded-full"
          onClick={() => setScript(null)}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-8 h-8 mr-2 text-[#24292f]" />
          <h1 className="text-5xl font-bold text-[#24292f]">
            {t('livebook.title')}
          </h1>
        </div>

        <div className="flex gap-8 mb-16 relative">
          {/* Left side - Text input */}
          <Card className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">{t('livebook.pasteStory')}</h2>
            <div className="flex flex-col h-[calc(100%-theme(spacing.16))]">
              <Textarea 
                placeholder={t('livebook.pasteHere')}
                className="flex-1 min-h-[300px] mb-4 resize-none"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
              />
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleGenerateScript}
                disabled={loading}
              >
                {loading ? t('livebook.generating') : t('livebook.liveButton')}
              </Button>
            </div>
          </Card>

          {/* Center - OR */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="bg-white px-4 text-lg font-medium text-gray-400">
              {t('common.or')}
            </span>
          </div>

          {/* Right side - File upload */}
          <Card className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">{t('livebook.uploadFile')}</h2>
            <div className="flex flex-col h-[calc(100%-theme(spacing.16))]">
              <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg mb-4">
                <Input
                  type="file"
                  accept=".txt,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer text-center p-4"
                >
                  <p className="text-gray-600 mb-2">{t('livebook.chooseFile')}</p>
                  <p className="text-sm text-gray-400">{t('livebook.supportedFormats')}</p>
                </label>
              </div>
              <Button className="w-full" size="lg">
                {t('livebook.liveButton')}
              </Button>
            </div>
          </Card>
        </div>

        {/* Example Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              <img 
                src="/placeholder.svg?height=200&width=400&text=Fantasy+Adventure" 
                alt="Fantasy Adventure Example"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{t('livebook.examples.fantasy.title')}</h3>
              <p className="text-gray-600">{t('livebook.examples.fantasy.description')}</p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              <img 
                src="/placeholder.svg?height=200&width=400&text=Shakespeare+Interactive" 
                alt="Shakespeare Interactive Example"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{t('livebook.examples.shakespeare.title')}</h3>
              <p className="text-gray-600">{t('livebook.examples.shakespeare.description')}</p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              <img 
                src="/placeholder.svg?height=200&width=400&text=Modern+Stories" 
                alt="Modern Stories Example"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{t('livebook.examples.modern.title')}</h3>
              <p className="text-gray-600">{t('livebook.examples.modern.description')}</p>
            </div>
          </Card>
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 right-4 rounded-full"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </main>
    </div>
  )
}