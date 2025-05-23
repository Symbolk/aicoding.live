"use client";

import { useState, useCallback } from "react";
import { 
  Dog, 
  Github, 
  BookOpen, 
  Network, 
  Code,
  Cpu,
  MessageSquare,
  Star,
  Users,
  BrainCircuit,
  Bot,
  Box,
  Palette,
  Image as ImageIcon,
  Code2,
  Clock,
  Book,
  GamepadIcon
} from "lucide-react";
import { Dashboard as DashboardLayout, AgentCard, StatsCard, ScheduleCard } from "./ui/dashboard";
import { HuggingDog } from "./huggingdog";
import { AskGitHub } from "./askgithub";
import { LiveBook } from "./livebook";
import { InterviewCards } from "./playground/interview-cards";
import { ChatEditor } from "./chateditor";
import { EmojiLock } from "./emojilock";
import { BookNote } from "./booknote";
import { GameBuddy } from "./gamebuddy";
import { useI18n } from "@/i18n/context";
import { motion } from "framer-motion";
import { AvatarGroup } from "./ui/avatar-group";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

// 定义Agent类型
export type AgentType = "huggingdog" | "askgithub" | "livebook" | "playground" | "chateditor" | "emojilock" | "booknote" | "gamebuddy";


// 从contributors.tsx导入的贡献者数据
const contributorsByRole = {
  development: {
    icon: <Code2 className="h-4 w-4" />,
    items: [
      {
        name: 'Cursor',
        avatar: '/contributors/cursor.png',
        url: 'https://cursor.sh'
      },
      {
        name: 'Claude',
        avatar: 'https://www.appengine.ai/uploads/images/profile/logo/Anthropic-AI.png',
        url: 'https://claude.ai'
      }
    ]
  },
  architecture: {
    icon: <Box className="h-4 w-4" />,
    items: [
      {
        name: 'v0.dev',
        avatar: '/contributors/v0.png',
        url: 'https://v0.dev'
      }
    ]
  },
  design: {
    icon: <Palette className="h-4 w-4" />,
    items: [
      {
        name: 'Motiff',
        avatar: '/contributors/motiff.png',
        url: 'https://www.motiff.cn'
      }
    ]
  },
  image: {
    icon: <ImageIcon className="h-4 w-4" />,
    items: [
      {
        name: 'KlingAI',
        avatar: '/contributors/kling.png',
        url: 'https://www.klingai.com'
      }
    ]
  },
  text: {
    icon: <Bot className="h-4 w-4" />,
    items: [
      {
        name: 'Yi-lightning',
        avatar: '/contributors/01ai.png',
        url: 'https://www.01.ai'
      }
    ]
  }
};

// 将贡献者数据转换为AvatarGroup可用的格式
const contributorsAvatars = Object.values(contributorsByRole)
  .flatMap(role => role.items.map(item => ({
    alt: item.name,
    fallback: item.name.charAt(0),
    src: item.avatar
  })));

export function DashboardComponent() {
  const { t, locale } = useI18n();
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState("home");
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);

  // 处理页面切换
  const handlePageChange = useCallback((page: string) => {
    if (page === "profile") {
      window.location.href = "/profile";
      return;
    }
    
    setActivePage(page);
    setActiveAgent(null);
  }, []);

  // 处理Agent切换
  const handleAgentSelect = useCallback((agent: AgentType) => {
    setActiveAgent(agent);
  }, []);

  // 渲染Agent内容
  const renderAgentContent = () => {
    switch (activeAgent) {
      case "huggingdog":
        return <HuggingDog />;
      case "askgithub":
        return <AskGitHub />;
      case "livebook":
        return <LiveBook />;
      case "playground":
        return <InterviewCards />;
      case "chateditor":
        return <ChatEditor />;
      case "emojilock":
        return <EmojiLock />;
      case "booknote":
        return <BookNote />;
      case "gamebuddy":
        return <GameBuddy />;
      default:
        return null;
    }
  };

  // 如果选中了特定Agent，则显示该Agent的内容
  if (activeAgent) {
    return (
      <DashboardLayout activePage={activePage} onPageChange={handlePageChange}>
        <div className="mb-6">
          <button 
            onClick={() => setActiveAgent(null)}
            className="text-blue-500 flex items-center gap-2 hover:underline"
          >
            <span>{locale === 'zh' ? '← 返回仪表盘' : '← Back to Dashboard'}</span>
          </button>
        </div>
        {renderAgentContent()}
      </DashboardLayout>
    );
  }

  // 否则显示Dashboard内容
  return (
    <DashboardLayout activePage={activePage} onPageChange={handlePageChange}>
      <div>
        {/* AI Agents区域 */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{locale === 'zh' ? '我的智能助手' : 'MY AGENTS'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AgentCard
              title={locale === 'zh' ? "抱抱狗 HuggingDog" : "HuggingDog"}
              description={locale === 'zh' ? "HuggingFace的金毛寻回犬" : "HuggingFace golden retrieval dog"}
              imageSrc="/logos/huggingdog.png"
              bgColor={theme === 'dark' ? "bg-blue-900/30" : "bg-blue-50/80"}
              bgImage="/screenshots/huggingdog.png"
              visits={20}
              onClick={() => window.location.href = "https://www.gamifyai.ai" }
            />
            <AgentCard
              title={locale === 'zh' ? "问问GitHub" : "AskGitHub"}
              description={locale === 'zh' ? "语义化搜索你想要的开源项目" : "Semantically Search GitHub repositories"}
              imageSrc="/logos/askgithub.svg"
              bgColor={theme === 'dark' ? "bg-gray-800/30" : "bg-gray-50/80"}
              bgImage="/screenshots/askgithub.png"
              visits={15}
              onClick={() => handleAgentSelect("askgithub")}
            />
            <AgentCard
              title={locale === 'zh' ? "活书 LiveBook" : "LiveBook"}
              description={locale === 'zh' ? "一本书或一段话产生交互式剧本" : "Smart documents with real-time interaction"}
              imageSrc="/logos/livebook.png"
              bgColor={theme === 'dark' ? "bg-green-900/30" : "bg-green-50/80"}
              bgImage="/screenshots/livebook.png"
              visits={32}
              onClick={() => handleAgentSelect("livebook")}
            />
            <AgentCard
              title={locale === 'zh' ? "翻牌问答 Flip-QA" : "Flip-QA"}
              description={locale === 'zh' ? "每天随机复习下大模型知识" : "Test your knowledge about large language models"}
              imageSrc="/logos/flipqa.png"
              bgColor={theme === 'dark' ? "bg-purple-900/30" : "bg-purple-50/80"}
              bgImage="/screenshots/qa.png"
              visits={18}
              onClick={() => handleAgentSelect("playground")}
            />
            <AgentCard
              title={locale === 'zh' ? "指手画脚 ChatEditor" : "ChatEditor"}
              description={locale === 'zh' ? "指手画脚即可改这改那" : "Edit any web page with AI"}
              imageSrc="/logos/chateditor.png"
              bgColor={theme === 'dark' ? "bg-yellow-900/30" : "bg-yellow-50/80"}
              bgImage="/screenshots/chateditor.gif"
              visits={18}
              onClick={() => handleAgentSelect("chateditor")}
            />
            <AgentCard
              title={locale === 'zh' ? "Emoji 时钟锁屏" : "Emoji Clock"}
              description={locale === 'zh' ? "仿 HarmonyOS 的互动锁屏" : "HarmonyOS-style interactive lockscreen"}
              imageSrc="/logos/emojilock.jpg"
              bgColor={theme === 'dark' ? "bg-orange-900/30" : "bg-orange-50/80"}
              bgImage="/screenshots/emojilock.gif"
              visits={12}
              onClick={() => handleAgentSelect("emojilock")}
            />
            <AgentCard
              title={locale === 'zh' ? "书记 BookNote" : "BookNote-LLM"}
              description={locale === 'zh' ? "好记性不如智能笔头" : "Remaster your notes with LLM"}
              imageSrc="/logos/booknote.png"
              bgColor={theme === 'dark' ? "bg-teal-900/30" : "bg-teal-50/80"}
              bgImage="/screenshots/booknote.png"
              visits={25}
              onClick={() => handleAgentSelect("booknote")}
            />
            <AgentCard
              title={locale === 'zh' ? "搭子 GameBuddy" : "GameBuddy"}
              description={locale === 'zh' ? "I人的线下游戏AI辅助" : "Werewolf game AI assistants"}
              imageSrc="/screenshots/dazi.png"
              bgColor={theme === 'dark' ? "bg-indigo-900/30" : "bg-indigo-50/80"}
              bgImage="/screenshots/dazi.gif"
              visits={37}
              onClick={() => handleAgentSelect("gamebuddy")}
            />
          </div>
        </div>

        {/* 统计区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatsCard
            title={locale === 'zh' ? "活跃Agents" : "ACTIVE AGENTS"}
            value="8"
            icon={<BrainCircuit className={theme === 'dark' ? "text-blue-400" : "text-blue-500"} />}
            bgColor={theme === 'dark' ? "bg-gray-800/80" : "bg-white/80 backdrop-blur-sm shadow-md"}
          />
          <StatsCard
            title={locale === 'zh' ? "总交互次数" : "TOTAL INTERACTIONS"}
            value="1276"
            icon={<MessageSquare className={theme === 'dark' ? "text-green-400" : "text-green-500"} />}
            bgColor={theme === 'dark' ? "bg-gray-800/80" : "bg-white/80 backdrop-blur-sm shadow-md"}
          />
          <div className="lg:col-span-1 md:col-span-2">
            <ScheduleCard
              days={["mon", "wed", "fri"]}
              bgColor={theme === 'dark' ? "bg-gray-800/80" : "bg-white/80 backdrop-blur-sm shadow-md"}
            />
          </div>
        </div>

        {/* 其他功能区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className={`${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700/20' : 'border-white/20'}`}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold mb-2">{locale === 'zh' ? '我的团队' : 'MY TEAM'}</h3>
            {/* <div className="mb-3">
              <AvatarGroup 
                avatars={teamMembers}
                max={5}
                size="md"
              />
            </div> */}
            <div className="mb-3">
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{locale === 'zh' ? 'AI 贡献者' : 'AI Contributors'}</h4>
              <AvatarGroup 
                avatars={contributorsAvatars}
                max={8}
                size="lg"
              />
            </div>
          </motion.div>

          <motion.div 
            className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-[#f6f8fa]/90'} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700/20' : 'border-[#d0d7de]/50'}`}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold mb-4">GitHub</h3>
            <div className="flex items-center gap-3 mb-4">
              <Github className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-[#24292f]'}`} />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#24292f]'}`}>@ababdotai</span>
            </div>
            <Link 
              href="https://github.com/ababdotai" 
              target="_blank"
              className="mt-auto pt-2 block"
            >
              <div className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-[#2da44e] hover:bg-[#2c974b]'} text-white rounded-lg py-2 px-3 text-sm text-center shadow-sm transition-colors`}>
                {locale === 'zh' ? '访问' : 'Visit'}
              </div>
            </Link>
          </motion.div>

          <motion.div 
            className={`${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700/20' : 'border-white/20'} flex items-center justify-between`}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="text-lg font-semibold">{locale === 'zh' ? 'API 设置' : 'API Settings'}</h3>
            </div>
            <div className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center shadow-md`}>
              →
            </div>
          </motion.div>

          <motion.div 
            className={`md:col-span-2 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700/20' : 'border-white/20'} flex items-center justify-between`}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="text-lg font-semibold">{locale === 'zh' ? '通知' : 'Notifications'}</h3>
            </div>
            <div className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center shadow-md`}>
              →
            </div>
          </motion.div>

          <motion.div 
            className={`${theme === 'dark' ? 'bg-blue-800/90' : 'bg-blue-500/90'} backdrop-blur-sm text-white rounded-2xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700/20' : 'border-white/20'}`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center shadow-md">
                <Star className="text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">{locale === 'zh' ? '每一个小点子都值得闪闪发光' : 'Every spark lights the sky'}</h3>
            <div className="flex justify-center mt-4">
              <button className={`bg-white ${theme === 'dark' ? 'text-blue-800' : 'text-blue-500'} px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md`}>
                <span>+</span> {locale === 'zh' ? '新建IDEA' : 'What`s up today?'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
} 