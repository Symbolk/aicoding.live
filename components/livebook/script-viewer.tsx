"use client"

import React, { useEffect, useRef, useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { generateImageWithProgress, type ImageGenerationProgress } from '@/lib/klingai'
import { XCircle, Check, Loader2, Circle } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'

interface ScriptItem {
  id: string
  type: 'scene' | 'dialogue' | 'narration' | 'action'
  content: string
  character?: string
  timestamp: string
}

interface ChatScene {
  id: string
  title: string
  messages: ScriptItem[]
}

// 从场景描述中提取场景标题
function extractSceneTitle(content: string): string {
  // 提取第一个句号前的内容作为标题
  const title = content.split('。')[0]
  return title.length > 20 ? title.slice(0, 20) + '...' : title
}

// 将消息按场景分组
function groupMessagesIntoScenes(scenes: ScriptItem[]): ChatScene[] {
  const chatScenes: ChatScene[] = []
  let currentScene: ScriptItem[] = []
  let sceneId = 1

  scenes.forEach((item, index) => {
    if (item.type === 'scene' && currentScene.length > 0) {
      chatScenes.push({
        id: `scene_${sceneId++}`,
        title: extractSceneTitle(currentScene[0].content),
        messages: [...currentScene]
      })
      currentScene = [item]
    } else {
      currentScene.push(item)
    }

    if (index === scenes.length - 1 && currentScene.length > 0) {
      chatScenes.push({
        id: `scene_${sceneId}`,
        title: extractSceneTitle(currentScene[0].content),
        messages: currentScene
      })
    }
  })

  return chatScenes
}

// 度指示器组件
const ExecutionStatus = ({ status, progress }: { 
  status: ImageGenerationProgress['status'],
  progress: ImageGenerationProgress
}) => {
  const stages = [
    { key: 'submitting' as const, text: '场景渲染启动！' },
    { key: 'generating' as const, text: '场景渲染中...' },
    { key: 'success' as const, text: '场景渲染完成!' }
  ]
  
  const getStageStatus = (stageKey: typeof stages[number]['key']) => {
    switch (status) {
      case 'submitting':
        return stageKey === 'submitting' ? 'current' : 'pending'
      case 'generating':
        return stageKey === 'submitting' ? 'completed' 
          : stageKey === 'generating' ? 'current'
          : 'pending'
      case 'success':
        // 当状态为 success 时，所有阶段都显示为已完成
        return 'completed'
      case 'error':
        // 当发生错误时，当前阶段显示错误，之前的阶段显示完成
        return stageKey === 'generating' ? 'error' 
          : stageKey === 'submitting' ? 'completed'
          : 'pending'
      default:
        return 'pending'
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.key}>
          <div className="flex items-center gap-2">
            <div 
              className={`w-4 h-4 rounded-full flex items-center justify-center
                ${getStageStatus(stage.key) === 'error' ? 'bg-red-200 text-red-700'
                : getStageStatus(stage.key) === 'completed' ? 'bg-green-200 text-green-700'
                : getStageStatus(stage.key) === 'current' ? 'bg-blue-200 text-blue-700'
                : 'bg-gray-200 text-gray-700'}`}
            >
              {getStageStatus(stage.key) === 'error' ? (
                <XCircle className="w-3 h-3" />
              ) : getStageStatus(stage.key) === 'completed' ? (
                <Check className="w-3 h-3" />
              ) : getStageStatus(stage.key) === 'current' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
            <span className={`
              ${getStageStatus(stage.key) === 'error' ? 'text-red-600'
              : getStageStatus(stage.key) === 'completed' ? 'text-green-600'
              : getStageStatus(stage.key) === 'current' ? 'text-blue-600'
              : 'text-gray-600'}`}
            >
              {stage.text}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div className={`w-8 h-px ${
              getStageStatus(stage.key) === 'completed' ? 'bg-green-200'
              : getStageStatus(stage.key) === 'current' ? 'bg-blue-200'
              : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// 背景图片组件
const SceneBackground = memo(({ content, onProgress }: { 
  content: string,
  onProgress: (progress: ImageGenerationProgress) => void
}) => {
  const [imageProgress, setImageProgress] = useState<ImageGenerationProgress>({
    status: 'idle',
    progress: 0
  })
  const isGeneratingRef = useRef(false)

  useEffect(() => {
    let isActive = true

    const generateImage = async () => {
      if (isGeneratingRef.current || !content) return
      
      try {
        isGeneratingRef.current = true
        setImageProgress({ status: 'submitting', progress: 0 })
        onProgress({ status: 'submitting', progress: 0 })
        
        const prompt = `${content}, cinematic scene, detailed environment, atmospheric lighting, 4k quality`
        
        // 立即开始生成图片
        await generateImageWithProgress(prompt, (progress) => {
          if (!isActive) return
          setImageProgress(progress)
          onProgress(progress)
        })
      } catch (error) {
        if (isActive) {
          const errorProgress: ImageGenerationProgress = {
            status: 'error',
            progress: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
          setImageProgress(errorProgress)
          onProgress(errorProgress)
          console.error('Error generating image:', error)
        }
      } finally {
        isGeneratingRef.current = false
      }
    }

    // 立即执行图片生成
    generateImage()

    return () => {
      isActive = false
    }
  }, [content, onProgress]) // 依赖项保持不变

  // 添加加载状态的显示
  if (!imageProgress.url) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">生成场景图片中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0">
      <img
        src={imageProgress.url}
        alt="Scene background"
        className="w-full h-full object-cover opacity-60"
      />
    </div>
  )
})

SceneBackground.displayName = 'SceneBackground'

const ChatBubble = memo(({ message }: { message: ScriptItem }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [hasTyped, setHasTyped] = useState(false)

  const getBubbleStyle = () => {
    switch (message.type) {
      case 'scene':
        return 'bg-gray-100 text-gray-800'
      case 'dialogue':
        if (message.character === '麦哲') {
          return 'bg-blue-50 text-blue-800'
        }
        return 'bg-green-50 text-green-800'
      case 'narration':
        return 'bg-gray-50 text-gray-700 italic text-sm'
      case 'action':
        return 'bg-yellow-50 text-yellow-800 italic text-sm'
      default:
        return 'bg-white text-gray-800'
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="flex items-start gap-3"
    >
      {message.character && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-md border border-white/20 flex-shrink-0 flex items-center justify-center text-sm font-medium text-white shadow-lg">
          {message.character[0]}
        </div>
      )}
      
      <div className={`flex-1 ${!message.character && 'ml-13'}`}>
        {message.character && (
          <div className="text-sm font-medium text-white/90 mb-1 ml-1">
            {message.character}
          </div>
        )}
        <div className={`p-4 rounded-lg border shadow-lg ${getBubbleStyle()}`}>
          {inView ? (
            <TypeAnimation
              sequence={[
                message.content,
                () => setHasTyped(true)
              ]}
              wrapper="div"
              speed={50}
              cursor={!hasTyped}
              className="whitespace-pre-wrap"
            />
          ) : (
            message.content
          )}
        </div>
      </div>
    </motion.div>
  )
})

ChatBubble.displayName = 'ChatBubble'

const SceneContent = memo(({ scene, onProgressChange }: { 
  scene: ChatScene,
  onProgressChange: (progress: ImageGenerationProgress) => void
}) => {
  const sceneMessage = scene.messages.find(msg => msg.type === 'scene')
  const [visibleMessages, setVisibleMessages] = useState<ScriptItem[]>([])
  
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    setVisibleMessages([])
    
    if (sceneMessage) {
      // 立即显示场景描述并触发图片生成
      setVisibleMessages([sceneMessage])
      
      const otherMessages = scene.messages.filter(msg => msg !== sceneMessage)
      otherMessages.forEach((message, index) => {
        const timeout = setTimeout(() => {
          setVisibleMessages(prev => [...prev, message])
        }, (index + 1) * 1000)
        timeouts.push(timeout)
      })
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [scene.id, sceneMessage])

  if (!sceneMessage) {
    console.warn('No scene description found in:', scene)
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <SceneBackground 
        key={`${scene.id}-${sceneMessage.id}`} // 添加更具体的 key
        content={sceneMessage.content} 
        onProgress={onProgressChange}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
      <div 
        className="absolute inset-x-0 bottom-0 h-1/3 overflow-y-auto overscroll-contain"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%)',
        }}
      >
        <div className="relative z-10 p-4 space-y-4 min-h-full">
          {visibleMessages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
    </motion.div>
  )
})

SceneContent.displayName = 'SceneContent'

// 修改 SceneThumbnail 组件
const SceneThumbnail = memo(({ scene }: { scene: ChatScene }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      const sceneMessage = scene.messages.find(msg => msg.type === 'scene')
      if (!sceneMessage) {
        console.log('No scene message found for thumbnail:', scene.id)
        setIsLoading(false)
        return
      }

      // 尝试从缓存获取图片URL
      const cacheKey = `image_cache_${sceneMessage.content}`
      const cachedResult = sessionStorage.getItem(cacheKey)
      
      if (cachedResult) {
        try {
          const cached = JSON.parse(cachedResult)
          console.log('Found cached image for scene:', scene.id, cached.url)
          setImageUrl(cached.url)
        } catch (error) {
          console.error('Error parsing cached image:', error)
        }
      } else {
        console.log('No cached image found for scene:', scene.id)
        // 如果没有缓存，生成新的图片
        try {
          const prompt = `${sceneMessage.content}, cinematic scene, detailed environment, atmospheric lighting, 4k quality`
          await generateImageWithProgress(prompt, (progress) => {
            if (progress.status === 'success' && progress.url) {
              console.log('Generated new image for scene:', scene.id, progress.url)
              setImageUrl(progress.url)
            }
          })
        } catch (error) {
          console.error('Error generating thumbnail:', error)
        }
      }
      setIsLoading(false)
    }

    loadImage()
  }, [scene])

  if (isLoading) {
    return (
      <div className="w-12 h-12 rounded bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!imageUrl) {
    return (
      <div className="w-12 h-12 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-white/30" />
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-white/20 shadow-lg backdrop-blur-sm">
      <img
        src={imageUrl}
        alt={scene.title}
        className="w-full h-full object-cover"
        onLoad={() => console.log('Thumbnail loaded:', scene.id)}
        onError={(e) => {
          console.error('Thumbnail load error:', scene.id, e)
          setImageUrl(null)
        }}
      />
    </div>
  )
})

SceneThumbnail.displayName = 'SceneThumbnail'

export function ScriptViewer({ title, scenes }: { title: string, scenes: ScriptItem[] }) {
  const [chatScenes, setChatScenes] = useState<ChatScene[]>([])
  const [currentSceneId, setCurrentSceneId] = useState<string>('')
  const [generationStatus, setGenerationStatus] = useState<ImageGenerationProgress>({
    status: 'idle',
    progress: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const groupedScenes = groupMessagesIntoScenes(scenes)
    setChatScenes(groupedScenes)
    if (groupedScenes.length > 0) {
      setCurrentSceneId(groupedScenes[0].id)
    }
  }, [scenes])

  const handleProgressChange = (progress: ImageGenerationProgress) => {
    setGenerationStatus(progress)
  }

  const currentScene = chatScenes.find(scene => scene.id === currentSceneId)

  const handleSceneChange = useCallback((sceneId: string) => {
    console.log('Changing scene to:', sceneId)
    setCurrentSceneId(sceneId)
    // 重置生成状态
    setGenerationStatus({
      status: 'idle',
      progress: 0
    })
  }, [])

  // 添加 ref 用于事件监听
  const chatContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="h-[calc(100vh-2rem)] bg-white p-4 pb-2 overflow-hidden">
      <div className="h-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-md border border-gray-200">
        {/* 窗口标题栏 */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <h1 className="text-sm font-medium text-gray-700">{title}</h1>
          <div className="flex-1 max-w-2xl ml-4">
            {generationStatus.status !== 'idle' && (
              <ExecutionStatus 
                status={generationStatus.status}
                progress={generationStatus}
              />
            )}
          </div>
        </div>

        <div className="flex h-[calc(100%-2.5rem)]">
          {/* 场景列表侧边栏 */}
          <div className="w-72 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {chatScenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(scene.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3
                  ${currentSceneId === scene.id 
                    ? 'bg-gray-100 border-l-4 border-blue-500' 
                    : 'border-l-4 border-transparent'}`}
              >
                <SceneThumbnail scene={scene} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate text-gray-700">
                    {scene.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>

          {/* 聊天内容区域 */}
          <div 
            ref={chatContainerRef}
            className="flex-1 relative isolate bg-white"
          >
            <AnimatePresence mode="wait">
              {currentScene && (
                <SceneContent 
                  key={currentScene.id} 
                  scene={currentScene}
                  onProgressChange={handleProgressChange}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 