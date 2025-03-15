'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/i18n/context'
import { useTheme } from '@/components/theme-provider'
import { motion } from 'framer-motion'
import { Code, ExternalLink, Github, MessageSquare, MousePointer, PenTool, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// 功能特点数据
const features = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: {
      en: "Natural Language Editing",
      zh: "自然语言编辑"
    },
    description: {
      en: "Edit web pages using natural language commands. Simply describe what you want to change.",
      zh: "使用自然语言命令编辑网页。只需描述您想要更改的内容。"
    }
  },
  {
    icon: <MousePointer className="h-5 w-5" />,
    title: {
      en: "Point and Edit",
      zh: "指点编辑"
    },
    description: {
      en: "Click on any element and describe how you want to modify it. No coding required.",
      zh: "点击任何元素并描述您想如何修改它。无需编码。"
    }
  },
  {
    icon: <PenTool className="h-5 w-5" />,
    title: {
      en: "Visual Design Tools",
      zh: "可视化设计工具"
    },
    description: {
      en: "Adjust colors, spacing, and layout with intuitive visual controls.",
      zh: "使用直观的可视化控件调整颜色、间距和布局。"
    }
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: {
      en: "AI-Powered Suggestions",
      zh: "AI 驱动的建议"
    },
    description: {
      en: "Get intelligent design and content suggestions based on your website's context.",
      zh: "根据您网站的上下文获取智能设计和内容建议。"
    }
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: {
      en: "Code Generation",
      zh: "代码生成"
    },
    description: {
      en: "Automatically generates clean HTML, CSS, and JavaScript code for your changes.",
      zh: "自动为您的更改生成干净的 HTML、CSS 和 JavaScript 代码。"
    }
  }
];

// 使用场景数据
const useCases = [
  {
    title: {
      en: "Web Designers",
      zh: "网页设计师"
    },
    description: {
      en: "Quickly prototype and iterate on designs without writing code.",
      zh: "无需编写代码即可快速原型设计并迭代。"
    },
    image: "/screenshots/chateditor.gif"
  },
  {
    title: {
      en: "Content Creators",
      zh: "内容创作者"
    },
    description: {
      en: "Update website content easily without technical knowledge.",
      zh: "无需技术知识即可轻松更新网站内容。"
    },
    image: "/screenshots/chateditor.gif"
  },
  {
    title: {
      en: "Developers",
      zh: "开发人员"
    },
    description: {
      en: "Speed up development by using AI to handle repetitive UI tasks.",
      zh: "使用 AI 处理重复性 UI 任务，加快开发速度。"
    },
    image: "/screenshots/chateditor.gif"
  }
];

export function ChatEditor() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src="/logos/chateditor.png" 
            alt="ChatEditor Logo" 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">ChatEditor</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            {locale === 'zh' 
              ? '一个 AI 驱动的网页编辑器，让任何人都能轻松编辑网页' 
              : 'An AI-powered web editor that makes editing web pages easy for everyone'}
          </p>
          <div className="flex gap-3">
            <Link href="https://github.com/Symbolk/ChatEditor" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link href="https://github.com/Symbolk/ChatEditor#demo" target="_blank">
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {locale === 'zh' ? '查看演示' : 'View Demo'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="overview">
            {locale === 'zh' ? '概述' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="features">
            {locale === 'zh' ? '功能' : 'Features'}
          </TabsTrigger>
          <TabsTrigger value="use-cases">
            {locale === 'zh' ? '使用场景' : 'Use Cases'}
          </TabsTrigger>
        </TabsList>

        {/* 概述标签内容 */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '什么是 ChatEditor？' : 'What is ChatEditor?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="mb-4">
                    {locale === 'zh' 
                      ? 'ChatEditor 是一个AI 驱动网页编辑工具，它使用自然语言处理和计算机视觉技术，让用户能够通过简单的对话和指点来编辑网页。无论您是专业开发人员还是没有技术背景的内容创作者，ChatEditor 都能让网页编辑变得简单直观。' 
                      : 'ChatEditor is an AI-powered web editing tool that uses natural language processing and computer vision to allow users to edit web pages through simple conversations and pointing. Whether you\'re a professional developer or a content creator with no technical background, ChatEditor makes web editing simple and intuitive.'}
                  </p>
                  <p>
                    {locale === 'zh'
                      ? '只需指向您想要修改的元素并描述您想要的更改，ChatEditor 就会为您处理其余部分。它可以生成干净的代码，提供智能设计建议，并帮助您创建响应式、美观的网页，而无需深入了解 HTML、CSS 或 JavaScript。'
                      : 'Simply point to the element you want to modify and describe the changes you want, and ChatEditor will handle the rest. It can generate clean code, provide intelligent design suggestions, and help you create responsive, beautiful web pages without deep knowledge of HTML, CSS, or JavaScript.'}
                  </p>
                </div>
                <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/screenshots/chateditor.png" 
                    alt="ChatEditor Screenshot" 
                    width={600} 
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '主要优势' : 'Key Benefits'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className={`mt-1 rounded-full p-1 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                    <svg className={`h-3 w-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{locale === 'zh' ? '无需编码知识 - 任何人都可以编辑网页' : 'No coding knowledge required - anyone can edit web pages'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`mt-1 rounded-full p-1 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                    <svg className={`h-3 w-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{locale === 'zh' ? '节省时间 - 快速实现设计更改和内容更新' : 'Save time - quickly implement design changes and content updates'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`mt-1 rounded-full p-1 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                    <svg className={`h-3 w-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{locale === 'zh' ? 'AI 驱动的建议 - 获取智能设计和内容建议' : 'AI-powered suggestions - get intelligent design and content recommendations'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`mt-1 rounded-full p-1 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                    <svg className={`h-3 w-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{locale === 'zh' ? '干净的代码输出 - 生成高质量、可维护的代码' : 'Clean code output - generates high-quality, maintainable code'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 功能标签内容 */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mb-3`}>
                      <div className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle>{locale === 'zh' ? feature.title.zh : feature.title.en}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? feature.description.zh : feature.description.en}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* 使用场景标签内容 */}
        <TabsContent value="use-cases" className="space-y-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {locale === 'zh' ? useCase.title.zh : useCase.title.en}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {locale === 'zh' ? useCase.description.zh : useCase.description.en}
                      </p>
                    </div>
                    <div className="md:w-2/3 bg-gray-100 dark:bg-gray-800 rounded-r-lg overflow-hidden">
                      <Image 
                        src={useCase.image} 
                        alt={locale === 'zh' ? useCase.title.zh : useCase.title.en}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* 底部 GitHub 链接 */}
      <Card className={`${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border-none`}>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'zh' ? '对 ChatEditor 感兴趣？' : 'Interested in ChatEditor?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {locale === 'zh' 
                ? '查看 GitHub 仓库了解更多信息，或者尝试在线演示。' 
                : 'Check out the GitHub repository for more information or try the online demo.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="https://github.com/Symbolk/ChatEditor" target="_blank">
              <Button size="lg" className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                {locale === 'zh' ? '访问 GitHub 仓库' : 'Visit GitHub Repository'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 