"use client"

import { useEffect, useRef, useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface ScriptItem {
  id: string
  type: 'scene' | 'dialogue' | 'narration' | 'action'
  content: string
  character?: string
  timestamp: string
}

interface ScriptViewerProps {
  title: string
  scenes: ScriptItem[]
}

const ScriptItemContent = memo(({ item, inView }: { item: ScriptItem; inView: boolean }) => {
  switch (item.type) {
    case 'scene':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="bg-gray-100 p-4 rounded-lg my-4 w-full"
        >
          <p className="text-gray-600 italic">{item.content}</p>
        </motion.div>
      )
    case 'dialogue':
      return (
        <motion.div
          initial={{ opacity: 0, x: item.character === 'User' ? 20 : -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          className={`flex ${item.character === 'User' ? 'justify-end' : 'justify-start'} my-2`}
        >
          <div
            className={`max-w-[70%] p-4 rounded-lg ${
              item.character === 'User'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <div className="font-bold mb-1">{item.character}</div>
            <TypewriterText text={item.content} />
          </div>
        </motion.div>
      )
    case 'narration':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-center text-gray-500 my-4 italic"
        >
          <TypewriterText text={item.content} />
        </motion.div>
      )
    case 'action':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="text-sm text-gray-400 my-2 text-center"
        >
          <TypewriterText text={item.content} />
        </motion.div>
      )
    default:
      return null
  }
})

ScriptItemContent.displayName = 'ScriptItemContent'

const SceneItem = memo(({ scene }: { scene: ScriptItem }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      key={scene.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <ScriptItemContent item={scene} inView={inView} />
    </motion.div>
  )
})

SceneItem.displayName = 'SceneItem'

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text])

  return <span>{displayText}</span>
}

export function ScriptViewer({ title, scenes }: ScriptViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedScenes, setDisplayedScenes] = useState<ScriptItem[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let currentScene = scenes[currentIndex]
    if (currentScene) {
      setDisplayedScenes(prev => [...prev, currentScene])
      const timer = setTimeout(() => {
        if (currentIndex < scenes.length - 1) {
          setCurrentIndex(prev => prev + 1)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, scenes])

  return (
    <div 
      ref={containerRef}
      className="max-w-4xl mx-auto p-4 overflow-y-auto h-[calc(100vh-4rem)]"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8"
      >
        {title}
      </motion.h1>
      <div className="space-y-4">
        <AnimatePresence>
          {displayedScenes.map((scene) => (
            <SceneItem key={scene.id} scene={scene} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 