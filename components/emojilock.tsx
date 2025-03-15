'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/i18n/context'
import { useTheme } from '@/components/theme-provider'
import { motion } from 'framer-motion'
import { Clock, Cloud, ExternalLink, Github, Moon, Smile, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// 功能特点数据
const features = [
  {
    icon: <Sun className="h-5 w-5" />,
    title: {
      en: "Dynamic Sky Background",
      zh: "动态天空背景"
    },
    description: {
      en: "Sky color changes automatically based on time, with sunrise and sunset effects.",
      zh: "根据时间自动变化天空颜色，日出日落效果，昼夜交替。"
    }
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: {
      en: "Time Display",
      zh: "时间显示"
    },
    description: {
      en: "Large digital clock display with date and weekday, automatic night mode with glow effect.",
      zh: "大字号数字时钟显示，日期和星期显示，夜间模式自动切换发光效果。"
    }
  },
  {
    icon: <Smile className="h-5 w-5" />,
    title: {
      en: "Interactive Emojis",
      zh: "互动表情"
    },
    description: {
      en: "Clickable bouncing emojis with physics collision effects and gravity sensor interaction.",
      zh: "可点击弹跳的表情符号，物理碰撞效果，重力感应互动，鼠标悬停光效。"
    }
  },
  {
    icon: <Cloud className="h-5 w-5" />,
    title: {
      en: "Dynamic Clouds",
      zh: "动态云朵"
    },
    description: {
      en: "Floating clouds with random sizes and smooth movement effects.",
      zh: "可添加浮动云朵，云朵大小随机，平滑移动效果。"
    }
  }
];

// 技术栈数据
const techStack = [
  {
    name: "Next.js 14",
    description: {
      en: "React framework for production",
      zh: "用于生产环境的 React 框架"
    }
  },
  {
    name: "React",
    description: {
      en: "JavaScript library for building user interfaces",
      zh: "用于构建用户界面的 JavaScript 库"
    }
  },
  {
    name: "TypeScript",
    description: {
      en: "Typed superset of JavaScript",
      zh: "JavaScript 的类型化超集"
    }
  },
  {
    name: "Tailwind CSS",
    description: {
      en: "Utility-first CSS framework",
      zh: "实用优先的 CSS 框架"
    }
  },
  {
    name: "Geist Font",
    description: {
      en: "Modern, minimal typeface",
      zh: "现代、简约的字体"
    }
  }
];

export function EmojiLock() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src="/logos/emojilock.jpg" 
            alt="Emoji Lock Logo" 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Emoji Clock</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            {locale === 'zh' 
              ? '仿 HarmonyOS-Next 的 Emoji 时钟锁屏，可通过移动设备或方向键互动' 
              : 'HarmonyOS-Next style Emoji clock lockscreen with device motion or arrow key interaction'}
          </p>
          <div className="flex gap-3">
            <Link href="https://github.com/Symbolk/HarmonyOS-Emoji-Lock" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link href="https://github.com/Symbolk/HarmonyOS-Emoji-Lock#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8" target="_blank">
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
          <TabsTrigger value="tech">
            {locale === 'zh' ? '技术栈' : 'Tech Stack'}
          </TabsTrigger>
        </TabsList>

        {/* 概述标签内容 */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '什么是 Emoji Clock？' : 'What is Emoji Clock?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="mb-4">
                    {locale === 'zh' 
                      ? 'Emoji Clock 是一个模仿 HarmonyOS-Next 系统的交互式锁屏应用，它结合了美观的视觉设计和有趣的互动元素。这个应用展示了动态天空背景、时间显示以及可互动的表情符号，为用户提供了一种全新的锁屏体验。' 
                      : 'Emoji Clock is an interactive lockscreen application inspired by the HarmonyOS-Next system, combining beautiful visual design with fun interactive elements. This application showcases dynamic sky backgrounds, time display, and interactive emojis, providing users with a fresh lockscreen experience.'}
                  </p>
                  <p>
                    {locale === 'zh'
                      ? '用户可以通过移动设备（利用重力感应）或使用键盘方向键与屏幕上的表情符号互动。天空背景会根据一天中的时间自动变化，呈现出日出、白天、日落和夜晚的不同效果，为用户创造沉浸式体验。'
                      : 'Users can interact with the emojis on screen by moving their device (using gravity sensors) or using keyboard arrow keys. The sky background automatically changes based on the time of day, presenting different effects for sunrise, daytime, sunset, and night, creating an immersive experience.'}
                  </p>
                </div>
                <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/screenshots/emojilock.gif" 
                    alt="Emoji Lock Screenshot" 
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
              <CardTitle>{locale === 'zh' ? '使用方法' : 'How to Use'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>1</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '安装依赖' : 'Install Dependencies'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? '克隆仓库并运行 npm install 安装所需依赖' : 'Clone the repository and run npm install to install required dependencies'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>2</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '启动应用' : 'Start the Application'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? '运行 npm run dev 启动开发服务器' : 'Run npm run dev to start the development server'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>3</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '访问应用' : 'Access the Application'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? '在浏览器中访问 http://localhost:3000 查看效果' : 'Visit http://localhost:3000 in your browser to see the application'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <span className={`text-lg ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>4</span>
                  </div>
                  <div>
                    <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '互动体验' : 'Interact with the App'}</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {locale === 'zh' ? '使用方向键模拟设备摇动，与表情符号互动' : 'Use arrow keys to simulate device movement and interact with emojis'}
                    </p>
                  </div>
                </div>
              </div>
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
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center mb-3`}>
                      <div className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
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

        {/* 技术栈标签内容 */}
        <TabsContent value="tech" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '技术栈' : 'Technology Stack'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-600'}`}></div>
                    <div>
                      <h4 className="text-base font-medium">{tech.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {locale === 'zh' ? tech.description.zh : tech.description.en}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '代码示例' : 'Code Example'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} font-mono text-sm overflow-x-auto`}>
                <pre>
                  <code>
{`cd emoji-lock
npm install
npm run dev
> emoji-lock@0.1.0 dev
> next dev

  ▲ Next.js 14.2.16
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 2.6s`}
                  </code>
                </pre>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {locale === 'zh' 
                  ? 'Chrome浏览器访问 http://localhost:3000 即可查看效果，通过方向键可以模拟设备摇动。' 
                  : 'Visit http://localhost:3000 in Chrome browser to see the effect. Use arrow keys to simulate device movement.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 底部 GitHub 链接 */}
      <Card className={`${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'} border-none`}>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'zh' ? '对 Emoji Clock 感兴趣？' : 'Interested in Emoji Clock?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {locale === 'zh' 
                ? '查看 GitHub 仓库了解更多信息，或者尝试在线演示。' 
                : 'Check out the GitHub repository for more information or try the online demo.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="https://github.com/Symbolk/HarmonyOS-Emoji-Lock" target="_blank">
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