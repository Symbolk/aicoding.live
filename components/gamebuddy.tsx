import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Github, ExternalLink, Gamepad, MessageCircle, Brain, Share2 } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 功能特点数据
const features = [
  {
    icon: <Users className="h-5 w-5" />,
    title: {
      en: "AI Assistants",
      zh: "AI助手抽卡"
    },
    description: {
      en: "Shake to randomly draw 1-3 AI model assistants, each with unique personality and analysis style.",
      zh: "摇一摇随机抽取1-3个AI模型助手，每个助手都有独特的性格和分析风格，如思维缜密型、战略分析型、情感洞察型等。"
    }
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: {
      en: "Real-time Recording",
      zh: "实时录音转文字"
    },
    description: {
      en: "Record in-game conversations via microphone, automatically converting speech to text in chat format.",
      zh: "通过麦克风录制游戏中的对话，自动将语音转换为文字并以A/B/C/D/E等头像将参与者发言在聊天室中以对话形式显示。"
    }
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: {
      en: "Strategic Suggestions",
      zh: "策略性发言建议"
    },
    description: {
      en: "Get personalized speaking suggestions from AI assistants based on your identity and game context.",
      zh: "根据你的身份和游戏上下文，从AI助手获取个性化的发言建议，包括具体的发言内容以及表情、语气等注意事项。"
    }
  },
  {
    icon: <Share2 className="h-5 w-5" />,
    title: {
      en: "Game Summary",
      zh: "游戏总结分享"
    },
    description: {
      en: "Generate shareable game summaries with highlights, evaluations and memorable quotes.",
      zh: "游戏结束后自动生成可分享的游戏总结，包含精彩片段回顾、对每个角色的评价和金句总结，可一键分享到小红书。"
    }
  }
];

// 技术栈数据
const techStack = [
  {
    name: "React Native",
    description: {
      en: "For cross-platform mobile development",
      zh: "用于跨平台移动应用开发"
    }
  },
  {
    name: "Web Speech API",
    description: {
      en: "For speech recognition and conversion",
      zh: "用于语音识别和转换"
    }
  },
  {
    name: "LLM API",
    description: {
      en: "Connected to multiple LLM models",
      zh: "连接多个大语言模型API"
    }
  },
  {
    name: "TailwindCSS",
    description: {
      en: "For responsive UI design",
      zh: "用于响应式界面设计"
    }
  },
  {
    name: "WeChat Mini Program SDK",
    description: {
      en: "For WeChat integration",
      zh: "用于微信小程序集成"
    }
  }
];

export function GameBuddy() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src="/screenshots/dazi.png" 
            alt="GameBuddy Logo" 
            width={96} 
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{locale === 'zh' ? "搭子 GameBuddy" : "GameBuddy"}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            {locale === 'zh' 
              ? '狼人杀游戏AI助手，为内向玩家提供融入支持，为老手带来新玩法' 
              : 'Werewolf game AI assistant, helping introverts integrate and bringing new gameplay to veterans'}
          </p>
          <div className="flex gap-3">
            <Link href="https://github.com" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
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
              <CardTitle>{locale === 'zh' ? '什么是搭子GameBuddy？' : 'What is GameBuddy?'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="mb-4">
                    {locale === 'zh' 
                      ? '搭子(GameBuddy)是一款为线下桌游爱好者设计的AI助手，专注于狼人杀等社交推理游戏。线下的剧本杀、狼人杀等角色扮演类游戏虽然非常流行，但很多性格内向的人不擅长这类游戏，却又想融入朋友的圈子；同时，一些擅长这类游戏的人也希望有一些新的玩法、不确定性和花样。搭子正是为解决这些问题而生。' 
                      : 'GameBuddy is an AI assistant designed for offline board game enthusiasts, focusing on social deduction games like Werewolf. While offline role-playing games like script murders and Werewolf are very popular, many introverted people are not good at these games but want to fit into their friend groups. Meanwhile, some skilled players are looking for new gameplay mechanics, uncertainties, and variations. GameBuddy was created to address these needs.'}
                  </p>
                  <p className="mb-4">
                    {locale === 'zh'
                      ? '通过语音识别技术，搭子能够实时记录游戏对话，并利用多个大语言模型为用户提供量身定制的游戏建议和策略。无论你是缺乏经验的新手，还是寻求新玩法的老手，搭子都能帮助你更好地融入游戏。'
                      : 'Using speech recognition technology, GameBuddy can record game conversations in real-time and provide tailored game suggestions and strategies through multiple large language models. Whether you\'re an inexperienced beginner or a veteran looking for new ways to play, GameBuddy can help you better immerse yourself in the game.'}
                  </p>
                  <p className="mb-4">
                    {locale === 'zh'
                      ? '用户打开小程序后，可以通过摇一摇以模拟抽卡的方式随机抽取1~3张卡片，每个翻开后代表一个AI助手，有独特的个性和分析风格。输入自己的身份后，用户可以通过麦克风记录游戏发言，并在轮到自己时获取AI的建议。不同AI助手会根据当前对话历史给出不同风格的发言建议，而最常被用户采纳的助手会获得更多展示机会。'
                      : 'After opening the mini program, users can shake to randomly draw 1-3 cards, each representing an AI assistant with a unique personality and analysis style. After entering their identity, users can record game speeches through the microphone and receive AI suggestions when it\'s their turn. Different AI assistants provide suggestions in various styles based on the current conversation history, and the assistants whose advice is adopted most frequently by the user will get more opportunities to be featured.'}
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold">{locale === 'zh' ? '主要使用场景' : 'Key Use Cases'}</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <span className={`text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>1</span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '新手入门' : 'Beginners Guide'}</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '为不擅长狼人杀的内向玩家提供发言建议，帮助他们不感到社交焦虑，提供发言策略的同时也会给出语气和表情上的指导，帮助新手更自然地表达。' : 'Provides speech suggestions for introverted players who are not good at Werewolf, helping them quickly integrate into the game without social anxiety. While providing speech strategies, it also gives guidance on tone and expression, helping newcomers express themselves more naturally.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <span className={`text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>2</span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '老手创新' : 'Veterans Innovation'}</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '为有经验的玩家提供新的思路和创意，打破常规策略。AI可能会提出人类玩家没想到的逻辑关系或推理角度，为游戏增添不确定性和新鲜感。' : 'Provides new ideas and creativity for experienced players, breaking conventional strategies. AI may propose logical relationships or reasoning angles that human players haven\'t thought of, adding uncertainty and freshness to the game.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <span className={`text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>3</span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '游戏记录与分享' : 'Game Recording & Sharing'}</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '自动记录游戏精彩瞬间，生成可分享的总结，包含每个角色的评价和金句。游戏结束后可直接分享到小红书等社交平台，方便朋友圈展示和回顾。' : 'Automatically records game highlights and generates shareable summaries, including evaluations of each character and golden quotes. After the game, summaries can be shared directly to social platforms like Xiaohongshu, making it easy to showcase in friend circles and review later.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 rounded-full p-1 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                        <span className={`text-lg ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>4</span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">{locale === 'zh' ? '团队建设活动' : 'Team Building'}</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '适用于公司团建活动，帮助不擅长社交的同事更好地参与互动。通过AI辅助降低参与门槛，让更多同事愿意加入游戏，促进团队成员的了解和交流。' : 'Suitable for company team-building activities, helping colleagues who are not good at socializing to better participate in interactions. By lowering the participation threshold through AI assistance, more colleagues are willing to join the game, promoting understanding and communication between team members.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/3 rounded-lg overflow-hidden shadow-lg self-start">
                  <Image 
                    src="/screenshots/dazi.gif" 
                    alt="GameBuddy Screenshot" 
                    width={300} 
                    height={550}
                    className="w-full h-auto"
                  />
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
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} flex items-center justify-center mb-3`}>
                      <div className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>
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

          <Card>
            <CardHeader>
              <CardTitle>{locale === 'zh' ? '用户故事' : 'User Story'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '用户打开小程序后，通过摇一摇以模拟抽卡的方式随机抽取1~3张AI助手卡片' 
                    : 'After opening the mini program, users shake to randomly draw 1-3 AI assistant cards in a simulated card drawing manner'}
                </li>
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '用户选择自己在游戏中的身份（如狼人、预言家、女巫等）' 
                    : 'Users select their identity in the game (such as Werewolf, Seer, Witch, etc.)'}
                </li>
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '游戏开始后，小程序通过设备的麦克风听取线下游戏参与者的发言，自动转为文字' 
                    : 'When the game starts, the mini program listens to the speeches of offline game participants through the device\'s microphone and automatically converts them to text'}
                </li>
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '轮到用户发言时，每个AI助手会给出针对性的发言建议和表情语气提示' 
                    : 'When it\'s the user\'s turn to speak, each AI assistant will provide targeted speech suggestions and expression/tone prompts'}
                </li>
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '用户可以选择喜欢的建议，被选中次数最多的AI助手会获得更多展示机会' 
                    : 'Users can choose the suggestions they like, and the AI assistant chosen the most times will get more display opportunities'}
                </li>
                <li className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' 
                    ? '游戏结束后，自动生成游戏摘要和回顾，对每个角色评价，并可一键分享到社交平台' 
                    : 'After the game ends, it automatically generates game summaries and reviews, evaluates each character, and allows one-click sharing to social platforms'}
                </li>
              </ol>
            </CardContent>
          </Card>
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
                    <div className={`mt-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-pink-400' : 'bg-pink-600'}`}></div>
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
              <CardTitle>{locale === 'zh' ? '开发流程' : 'Development Process'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} font-mono text-sm overflow-x-auto`}>
                <pre>
                  <code>
{`# 微信小程序开发流程
1. 设计UI/UX
2. 实现语音识别模块
3. 接入多模型LLM API
4. 实现游戏建议生成
5. 开发结果分享功能
6. 小程序审核与发布`}
                  </code>
                </pre>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {locale === 'zh' 
                  ? '搭子GameBuddy通过微信小程序形式发布，用户无需下载额外应用，直接扫码即可使用。支持iOS和Android平台，针对移动设备的麦克风和摇一摇功能进行了专门优化。' 
                  : 'GameBuddy is released as a WeChat Mini Program, allowing users to access it directly by scanning a QR code without downloading additional applications. It supports both iOS and Android platforms, with specific optimizations for mobile device microphones and shake functionality.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 底部链接 */}
      <Card className={`${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-50'} border-none`}>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'zh' ? '对搭子GameBuddy感兴趣？' : 'Interested in GameBuddy?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {locale === 'zh' 
                ? '扫描微信小程序码立即体验，无需下载额外应用，随时随地享受狼人杀AI助手的陪伴。' 
                : 'Scan the WeChat Mini Program code to experience it immediately, no need to download additional applications, enjoy the companionship of Werewolf AI assistant anytime, anywhere.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="https://www.gamifyai.ai" target="_blank">
              <Button size="lg" className="flex items-center gap-2">
                <Gamepad className="h-5 w-5" />
                {locale === 'zh' ? '立即体验' : 'Try it Now'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 