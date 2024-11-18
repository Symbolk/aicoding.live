"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n/context'
import { InterviewQA } from '@/pages/api/interview-questions'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Image from 'next/image'

// 默认问题，作为初始状态
const defaultQuestions: InterviewQA[] = [
  {
    question: "什么是大语言模型(LLM)?",
    answer: "大语言模型是一种基于深度学习的AI模型，能够理解和生成人类语言。它通过海量文本数据训练，可以执行翻译、问答、摘要等多种自然语言处理任务。"
  },
  {
    question: "GPT-4与GPT-3.5的主要区别是什么?", 
    answer: "GPT-4相比GPT-3.5有更强的推理能力、更好的多模态理解能力，并且在准确性和安全性方面都有显著提升。它可以处理更长的上下文，并能更好地理解细微的指令。"
  }
]

export function InterviewCards() {
  const { t, locale } = useI18n()
  const [questions, setQuestions] = useState<InterviewQA[]>(defaultQuestions) // 使用默认问题作为初始状态
  const [remainingCards, setRemainingCards] = useState<number>(10)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [exitingCard, setExitingCard] = useState<number | null>(null)
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`/api/interview-questions?lang=${locale}`)
        const data = await response.json()
        if (data && Array.isArray(data) && data.length > 0) {
          setQuestions(data)
          setRemainingCards(Math.min(10, data.length))
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading questions:', error)
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [locale])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          setCurrentIndex(prev => (prev - 1 + questions.length) % questions.length)
          setFlippedIndex(null)
          break
        case 'ArrowRight':
        case 'ArrowDown':
          setCurrentIndex(prev => (prev + 1) % questions.length)
          setFlippedIndex(null)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [questions.length])

  if (isLoading) {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-purple-300 animate-gradient" />
        <div className="relative z-10">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">{t('playground.interview.loading')}</p>
        </div>
      </div>
    )
  }

  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      setFlippedIndex(flippedIndex === index ? null : index)
    } else {
      setExitingCard(currentIndex)
      setTimeout(() => {
        setCurrentIndex(index)
        setFlippedIndex(null)
        setRemainingCards(prev => Math.max(1, prev - 1))
        setExitingCard(null)
      }, 300) // 等待退出动画完成
    }
  }

  const getRandomExit = () => {
    const exits = [
      { x: -300, y: 0 },
      { x: 300, y: 0 },
      { x: 0, y: -300 },
      { x: 0, y: 300 },
    ]
    return exits[Math.floor(Math.random() * exits.length)]
  }

  const visibleIndexes = Array.from({ length: remainingCards }, (_, i) => 
    (currentIndex + i) % questions.length
  )

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-purple-200/50 to-purple-300/50" />
      
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-20">
        <Image
          src="/illustrations/organizing_files.svg"
          alt="Organizing Files"
          width={256}
          height={256}
          priority
        />
      </div>
      
      <div className="relative w-[400px] h-[300px]">
        <AnimatePresence mode="wait">
          {visibleIndexes.map((questionIndex, displayIndex) => {
            const isExiting = questionIndex === exitingCard
            const exitAnimation = getRandomExit()
            
            return (
              <motion.div
                key={`card-${questionIndex}-${displayIndex}`}
                animate={{ 
                  y: 20 * displayIndex,
                  x: 20 * displayIndex,
                  rotate: 5 * displayIndex,
                  scale: 1 - (displayIndex * 0.05),
                  zIndex: 50 - displayIndex
                }}
                exit={isExiting ? {
                  opacity: 0,
                  x: exitAnimation.x,
                  y: exitAnimation.y,
                  rotate: [-5, 5][Math.floor(Math.random() * 2)] * 15,
                  transition: { duration: 0.3 }
                } : undefined}
                transition={{ duration: 0.3 }}
                className="absolute w-full h-full cursor-pointer"
                onClick={() => handleCardClick(questionIndex)}
                style={{ zIndex: 50 - displayIndex }}
              >
                {flippedIndex === questionIndex ? (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-full h-full"
                  >
                    <div className="w-full h-full p-8 rounded-3xl bg-white/85 backdrop-blur-md shadow-xl border border-white/50 flex flex-col justify-between hover:bg-white/95 transition-colors duration-300">
                      <div>
                        <p className="text-lg text-gray-800">
                          {questions[questionIndex].answer}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {questionIndex + 1}/{questions.length}
                        </div>
                        <div className="text-sm font-medium px-4 py-2 
                                    bg-purple-600/90 text-white rounded-full shadow-md
                                    transition-all duration-300 
                                    hover:scale-110 hover:bg-purple-600 active:scale-95">
                          {t('playground.interview.backToQuestion')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-full h-full"
                  >
                    <div className="w-full h-full p-8 rounded-3xl bg-white/85 backdrop-blur-md shadow-xl border border-white/50 flex flex-col justify-between hover:bg-white/95 transition-colors duration-300">
                      <div>
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                          {questions[questionIndex].question}
                        </h2>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {questionIndex + 1}/{questions.length}
                        </div>
                        <div className="text-sm font-medium px-4 py-2 
                                    bg-purple-600/90 text-white rounded-full shadow-md
                                    transition-all duration-300 
                                    hover:scale-110 hover:bg-purple-600 active:scale-95">
                          {t('playground.interview.showAnswer')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
} 