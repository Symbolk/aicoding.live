'use client'

import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Github } from 'lucide-react'

interface IntroPageProps {
  onSuggestionClick: (suggestion: string) => void
}

export function IntroPage({ onSuggestionClick }: IntroPageProps) {
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
          src="/logos/askgithub.svg"
          alt="AskGitHub"
          width={80}
          height={80}
          className="mx-auto rounded-full"
        />
        <h1 className="text-3xl font-bold">AskGitHub</h1>
        <p className="text-gray-500">
          {locale === 'zh' 
            ? "通过自然语言询问，AI 将进行搜索和匹配，找到合适的项目。"
            : "Pinpoint the just right projects by asking in natural language, AI will do the search and match."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'zh' ? "智能搜索" : "Smart Search"}
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• {locale === 'zh' ? "自然语言查询" : "Natural language queries"}</li>
            <li>• {locale === 'zh' ? "多维度项目匹配" : "Multi-dimensional project matching"}</li>
            <li>• {locale === 'zh' ? "智能关键词提取" : "Smart keyword extraction"}</li>
            <li>• {locale === 'zh' ? "上下文理解与分析" : "Context understanding and analysis"}</li>
          </ul>
        </motion.div>

        <motion.div 
          className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'zh' ? "项目推荐" : "Project Recommendations"}
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• {locale === 'zh' ? "精准的仓库匹配" : "Accurate repository matching"}</li>
            <li>• {locale === 'zh' ? "详细的项目分析" : "Detailed project analysis"}</li>
            <li>• {locale === 'zh' ? "相关性排序展示" : "Relevance-based sorting"}</li>
            <li>• {locale === 'zh' ? "实时的搜索反馈" : "Real-time search feedback"}</li>
          </ul>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center mb-8">
          <Github className="w-8 h-8 mr-2 text-[#24292f]" />
          <h1 className="text-4xl font-semibold text-[#24292f]">{t('askgithub.title')}</h1>
        </div>

        <h3 className="text-lg font-medium text-center text-gray-700">
          {locale === 'zh' ? "试试这些示例" : "Try these examples"}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(t('askgithub.suggestions')).map(([key, suggestion]) => (
            <Button
              key={key}
              variant="outline"
              className="text-[#24292f] hover:text-[#0969da] hover:border-[#0969da] bg-white border border-[#d0d7de] rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 