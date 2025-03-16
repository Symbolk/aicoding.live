'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/i18n/context'
import { useTheme } from '@/components/theme-provider'
import { motion } from 'framer-motion'
import { Book, BookOpen, ExternalLink, FileText, Github, Smartphone, Sparkles, Tablet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// 功能特点数据
const features = [
  {
    icon: <Book className="h-5 w-5" />,
    title: {
      en: "Book Notes Remastering",
      zh: "书籍笔记重整"
    },
    description: {
      en: "Import highlights, annotations, and thoughts from Kindle, WeRead, and other e-readers for AI-powered organization.",
      zh: "从Kindle、微信读书等导入划线、标注、想法，使用AI智能整理和分享。"
    }
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: {
      en: "Article Clippings",
      zh: "文章摘录整理"
    },
    description: {
      en: "Organize and archive inspiring text from WeChat articles and web pages with automatic categorization.",
      zh: "整理微信文章中有启发的文字，自动归档和分类。"
    }
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: {
      en: "AI-Powered Organization",
      zh: "AI智能整理"
    },
    description: {
      en: "Automatically structure notes into markdown format and generate mind maps for better visualization.",
      zh: "自动将笔记结构化为markdown格式，生成思维导图便于可视化。"
    }
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: {
      en: "Cross-Platform Support",
      zh: "跨平台支持"
    },
    description: {
      en: "Available on web, Android, iOS, and as a browser extension for seamless note-taking.",
      zh: "支持网页版、Android、iOS应用和浏览器插件，无缝记录笔记。"
    }
  }
];

// 客户端支持数据
const clientSupport = [
  {
    name: {
      en: "Web Version",
      zh: "网页版"
    },
    description: {
      en: "Upload exported note text to get structured notes in markdown format and mind maps.",
      zh: "上传导出的笔记文本，得到markdown格式的结构化笔记、思维导图。"
    },
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    name: {
      en: "Android App",
      zh: "Android应用"
    },
    description: {
      en: "Floating ball monitors clipboard, automatically records new content, and supports web upload.",
      zh: "悬浮球打开时开始监控剪贴版，有新内容时自动记录；同时支持网页端上传功能。"
    },
    icon: <Smartphone className="h-5 w-5" />
  },
  {
    name: {
      en: "iOS App",
      zh: "iOS应用"
    },
    description: {
      en: "Floating ball monitors clipboard, automatically records new content, and supports web upload.",
      zh: "悬浮球打开时开始监控剪贴版，有新内容时自动记录；同时支持网页端上传功能。"
    },
    icon: <Tablet className="h-5 w-5" />
  },
  {
    name: {
      en: "Browser Extension",
      zh: "浏览器插件"
    },
    description: {
      en: "Select text and press copy shortcut to automatically record; includes shortcut button to open web version.",
      zh: "鼠标选中并按下复制快捷键，即可自动记录；同时包含打开网页端的快捷按钮。"
    },
    icon: <FileText className="h-5 w-5" />
  }
];

export function BookNote() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src="/logos/booknote.png" 
            alt="BookNote Logo" 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">BookNote-LLM</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            {locale === 'zh' 
              ? '好记性不如智能笔头，通过复制卸载大脑负担' 
              : 'Remaster your notes from book readers with LLM, offload your brain through smart copying'}
          </p>
          <div className="flex gap-3">
            <Link href="https://github.com/ababdotai/booknote-llm" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link href="https://github.com/ababdotai/booknote-llm#客户端支持" target="_blank">
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {locale === 'zh' ? '查看详情' : 'View Details'}
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
          <TabsTrigger value="clients">
            {locale === 'zh' ? '客户端' : 'Clients'}
          </TabsTrigger>
        </TabsList>

        {/* 概述标签内容 */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '什么是 BookNote-LLM？' : 'What is BookNote-LLM?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="mb-4">
                    {locale === 'zh' 
                      ? 'BookNote-LLM 是一款智能笔记整理工具，它利用大型语言模型（LLM）帮助用户整理和结构化从各种阅读平台收集的笔记和摘录。无论是从Kindle、微信读书导出的划线和标注，还是从微信文章或网页中复制的精彩段落，BookNote-LLM都能帮助你将这些零散的信息整理成结构化的笔记。' 
                      : 'BookNote-LLM is an intelligent note organization tool that uses Large Language Models (LLMs) to help users organize and structure notes and excerpts collected from various reading platforms. Whether it\'s highlights and annotations exported from Kindle, WeRead, or brilliant passages copied from WeChat articles or web pages, BookNote-LLM can help you organize these scattered pieces of information into structured notes.'}
                  </p>
                  <p>
                    {locale === 'zh'
                      ? '这款工具的核心理念是"好记性不如智能笔头"，通过将记忆和整理的负担转移到AI上，让用户能够专注于阅读和思考。BookNote-LLM不仅能够整理笔记，还能生成思维导图，帮助用户更好地理解和记忆知识点之间的联系。'
                      : 'The core philosophy of this tool is "a smart pen is better than a good memory," transferring the burden of memorization and organization to AI, allowing users to focus on reading and thinking. BookNote-LLM not only organizes notes but also generates mind maps to help users better understand and remember the connections between knowledge points.'}
                  </p>
                </div>
                <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/screenshots/booknote.png" 
                    alt="BookNote Screenshot" 
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
              <CardTitle>{locale === 'zh' ? '主要应用场景' : 'Key Use Cases'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>1</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '电子书笔记整理' : 'E-book Note Organization'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' 
                        ? '读过一遍的书却无从整理笔记？从Kindle、微信读书中导出划线、标注、想法等，然后使用BookNote-LLM帮助你梳理和分享！' 
                        : 'Read a book but don\'t know how to organize your notes? Export highlights, annotations, and thoughts from Kindle, WeRead, etc., and let BookNote-LLM help you organize and share!'}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>2</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '文章摘录归档' : 'Article Excerpt Archiving'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' 
                        ? '微信文章中有启发的文字难以归档？尽管复制，使用BookNote-LLM帮助你整理！' 
                        : 'Inspired text in WeChat articles difficult to archive? Just copy it, and let BookNote-LLM help you organize it!'}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>3</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '网页内容备忘' : 'Web Content Memo'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' 
                        ? '浏览网页时看到的内容想要备忘？直接复制即可自动记录，自由选择一个或多个网页的复制内容生成笔记！' 
                        : 'Want to remember content you see while browsing the web? Just copy it for automatic recording, and freely choose to generate notes from copied content from one or multiple web pages!'}
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 功能标签内容 */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center mb-3`}>
                      <div className={theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}>
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

        {/* 客户端标签内容 */}
        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientSupport.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center`}>
                      <div className={theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}>
                        {client.icon}
                      </div>
                    </div>
                    <CardTitle>{locale === 'zh' ? client.name.zh : client.name.en}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? client.description.zh : client.description.en}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '工作流程' : 'Workflow'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-medium ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>1</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p>{locale === 'zh' ? '从阅读平台导出笔记或直接复制内容' : 'Export notes from reading platforms or directly copy content'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-medium ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>2</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p>{locale === 'zh' ? '上传到BookNote-LLM或通过客户端自动记录' : 'Upload to BookNote-LLM or automatically record via client'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-medium ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>3</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p>{locale === 'zh' ? 'AI自动整理、分类和结构化笔记内容' : 'AI automatically organizes, categorizes, and structures note content'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-teal-900' : 'bg-teal-100'} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-medium ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>4</span>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p>{locale === 'zh' ? '获取markdown格式的笔记和思维导图' : 'Get notes in markdown format and mind maps'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 底部 GitHub 链接 */}
      <Card className={`${theme === 'dark' ? 'bg-teal-900/30' : 'bg-teal-50'} border-none`}>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'zh' ? '对 BookNote-LLM 感兴趣？' : 'Interested in BookNote-LLM?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {locale === 'zh' 
                ? '查看 GitHub 仓库了解更多信息，或者尝试在线演示。' 
                : 'Check out the GitHub repository for more information or try the online demo.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="https://github.com/ababdotai/booknote-llm" target="_blank">
              <Button size="lg" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
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