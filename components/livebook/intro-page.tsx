'use client'

import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

export function IntroPage() {
  const { t, locale } = useI18n()

  return (
    <motion.div 
      className="p-6 max-w-4xl mx-auto space-y-6 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4">
        <Image
          src="/logos/livebook.png"
          alt="LiveBook"
          width={80}
          height={80}
          className="mx-auto rounded-full"
        />
        <h1 className="text-3xl font-bold">LiveBook</h1>
        <p className="text-gray-500">
          {locale === 'zh' 
            ? "让静态书籍焕发生机，使用 AIGC。"
            : "Bring static book into life, with AIGC."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'zh' ? "故事转换" : "Story Transformation"}
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• {locale === 'zh' ? "文本内容智能分析" : "Smart text content analysis"}</li>
            <li>• {locale === 'zh' ? "场景自动生成" : "Automatic scene generation"}</li>
            <li>• {locale === 'zh' ? "角色对话重现" : "Character dialogue recreation"}</li>
            <li>• {locale === 'zh' ? "情节动态展示" : "Dynamic plot presentation"}</li>
          </ul>
        </motion.div>

        <motion.div 
          className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'zh' ? "交互体验" : "Interactive Experience"}
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• {locale === 'zh' ? "多种输入方式" : "Multiple input methods"}</li>
            <li>• {locale === 'zh' ? "实时渲染反馈" : "Real-time rendering feedback"}</li>
            <li>• {locale === 'zh' ? "示例故事参考" : "Example story references"}</li>
            <li>• {locale === 'zh' ? "沉浸式阅读体验" : "Immersive reading experience"}</li>
          </ul>
        </motion.div>
      </div>

      <div className="text-center text-gray-500 mt-8">
        <p>
          {locale === 'zh' 
            ? "开始创作，让你的故事活起来 📚"
            : "Start creating, bring your story to life 📚"
          }
        </p>
      </div>
    </motion.div>
  )
} 