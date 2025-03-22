import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  BarChart2,
  Calendar,
  Settings,
  LogOut,
  Home,
  Users,
  ChevronUp,
  ChevronDown,
  Moon,
  Sun,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AvatarGroup } from "./avatar-group";
import { Button } from "./button";
import { useI18n } from "@/i18n/context";
import { useTheme } from "@/components/theme-provider";

// AI贡献者数据
const aiContributors = [
  { alt: "Claude", fallback: "C" },
  { alt: "GPT-4", fallback: "G" },
  { alt: "Gemini", fallback: "G" },
  { alt: "Llama", fallback: "L" },
  { alt: "Mistral", fallback: "M" },
  { alt: "Anthropic", fallback: "A" },
];

// 侧边栏图标组件
interface SidebarIconProps {
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

const SidebarIcon = ({ icon: Icon, active, onClick, tooltip }: SidebarIconProps) => (
  <div className="relative group">
    <div
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all",
        active 
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
          : "hover:bg-gray-200 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <Icon
        size={22}
        className={cn(
          "transition-colors",
          active ? "text-white" : "text-gray-600"
        )}
      />
    </div>
    {tooltip && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
        {tooltip}
      </div>
    )}
  </div>
);

interface DashboardProps {
  children: React.ReactNode;
  activePage?: string;
  onPageChange: (page: string) => void;
}

export function Dashboard({
  children,
  activePage = "home",
  onPageChange,
}: DashboardProps) {
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  
  // 侧边栏菜单项的提示文字
  const menuTooltips = {
    home: locale === 'zh' ? '首页' : 'Home',
    stats: locale === 'zh' ? '统计' : 'Statistics',
    calendar: locale === 'zh' ? '日历' : 'Calendar',
    profile: locale === 'zh' ? '个人' : 'Profile',
    settings: locale === 'zh' ? '设置' : 'Settings'
  };

  // 导航到主页
  const goToHome = () => {
    window.location.href = "/";
  };

  // 导航到个人页面
  const goToProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
      {/* 左侧侧边栏 */}
      <div className="fixed left-0 h-full flex items-center z-10">
        <div className={`w-24 h-[85%] ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm flex flex-col items-center py-8 rounded-r-3xl shadow-xl ${theme === 'dark' ? 'shadow-gray-900/50 border-gray-700' : 'shadow-gray-200/50 border-gray-100'} border-r border-t border-b`}>
          {/* 修改布局结构，将Logo移到顶部 */}
          <div className="w-full flex flex-col items-center">
            {/* Logo - 移到顶部，添加点击事件 */}
            <div className="mb-8 cursor-pointer" onClick={goToHome}>
              <div className="flex flex-col items-center">
                <Image
                  src="/logos/icon.jpg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full shadow-md"
                />
                <div className={`text-xs font-medium mt-2 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div><b>abab.ai</b></div>
                </div>
              </div>
            </div>
          </div>

          {/* 导航图标容器 - 椭圆形灰色背景 */}
          <div className="flex-1 flex items-center justify-center">
            <div className={`${theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-100/80'} backdrop-blur-sm rounded-full py-6 px-3 flex flex-col items-center space-y-6 shadow-inner`}>
              <SidebarIcon
                icon={Home}
                active={activePage === "home"}
                onClick={goToHome}
                tooltip={menuTooltips.home}
              />
              <SidebarIcon
                icon={BarChart2}
                active={activePage === "stats"}
                onClick={() => onPageChange("stats")}
                tooltip={menuTooltips.stats}
              />
              <SidebarIcon
                icon={Calendar}
                active={activePage === "calendar"}
                onClick={() => onPageChange("calendar")}
                tooltip={menuTooltips.calendar}
              />
              <SidebarIcon
                icon={User}
                active={activePage === "profile"}
                onClick={goToProfile}
                tooltip={menuTooltips.profile}
              />
            </div>
          </div>

          {/* 底部头像区域 - 添加点击事件 */}
          <div className="mt-auto flex flex-col items-center space-y-4">
            {/* 用户头像 */}
            <div 
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md cursor-pointer"
              onClick={goToProfile}
            >
              <Image
                src="/avatars/myself.jpeg"
                alt="User"
                width={48}
                height={48}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className={`flex-1 overflow-auto p-8 pl-32 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'zh' ? '仪表盘' : 'Dashboard'}</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {locale === 'zh' ? '万物皆可智能化' : 'Everything can be Agentified'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 语言切换按钮 */}
              <Button
                variant="outline"
                size="icon"
                className={`h-9 w-9 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
              >
                <Languages className="h-4 w-4" />
                <span className="sr-only">
                  {locale === 'zh' ? 'Switch to English' : '切换到中文'}
                </span>
              </Button>
              
              {/* 主题切换按钮 */}
              <Button
                variant="outline"
                size="icon"
                className={`h-9 w-9 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
                </span>
              </Button>
            </div>
          </div>

          {/* 主要内容 */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

// 卡片组件 - 用于展示AI Agent
interface AgentCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  bgColor?: string;
  bgImage?: string;
  visits?: number;
  onClick?: () => void;
}

export function AgentCard({ 
  title, 
  description, 
  icon, 
  imageSrc, 
  bgColor = "bg-blue-50/80", 
  bgImage,
  visits,
  onClick 
}: AgentCardProps) {
  const { theme } = useTheme();
  
  // 根据背景色确定播放按钮颜色和背景色
  const getButtonColors = () => {
    if (bgColor.includes('blue')) {
      return {
        bg: theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('green')) {
      return {
        bg: theme === 'dark' ? 'bg-green-500' : 'bg-green-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('purple')) {
      return {
        bg: theme === 'dark' ? 'bg-purple-500' : 'bg-purple-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('gray')) {
      return {
        bg: theme === 'dark' ? 'bg-gray-500' : 'bg-gray-600',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('yellow')) {
      return {
        bg: theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('orange')) {
      return {
        bg: theme === 'dark' ? 'bg-orange-500' : 'bg-orange-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else if (bgColor.includes('red')) {
      return {
        bg: theme === 'dark' ? 'bg-red-500' : 'bg-red-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } else {
      return {
        bg: theme === 'dark' ? 'bg-teal-500' : 'bg-teal-500',
        text: 'text-white',
        stroke: theme === 'dark' ? 'stroke-white' : 'stroke-white'
      };
    } 
  };
  
  const buttonColors = getButtonColors();
  
  return (
    <motion.div
      className={cn(
        "aspect-square rounded-3xl p-6 cursor-pointer transition-all shadow-lg backdrop-blur-sm border relative overflow-hidden",
        theme === 'dark' ? 'border-gray-700/20' : 'border-white/20',
        bgColor
      )}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col h-full relative z-1">
        {/* 访问量标签 - 移到右上角且不与标题重叠 */}
        {visits !== undefined && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
            <span className="mr-1">★</span> +{visits}
          </div>
        )}
        
        <div className="flex items-center mb-4 pr-12">
          {imageSrc ? (
            <div className={`w-12 h-12 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center mr-3 shadow-md overflow-hidden`}>
              <Image
                src={imageSrc}
                alt={title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          ) : icon ? (
            <div className={`w-12 h-12 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center mr-3 shadow-md`}>
              {icon}
            </div>
          ) : null}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        {/* 背景图片 - 修改为只显示在标题栏下方 */}
        {bgImage && (
          <div className="absolute left-0 right-0 bottom-0 z-0 opacity-40" style={{ top: '100px' }}>
            <Image
              src={bgImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {/* 添加背景色到描述文字，提高可读性 */}
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex relative z-1 px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm`}>{description}</p>
        
        <div className="mt-auto pt-4 flex justify-center relative z-1">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${buttonColors.bg} shadow-md transition-all`}>
            {/* 修改为填充白色的三角形 */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="white" 
              stroke="white" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 进度卡片组件
interface ProgressCardProps {
  title?: string;
  days: number;
  points: number;
  image?: string;
  bgColor?: string;
}

export function ProgressCard({ title, days, points, image, bgColor = "bg-blue-50" }: ProgressCardProps) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={cn(
        "rounded-xl shadow-sm overflow-hidden", 
        bgColor
      )}
      whileHover={{ 
        scale: 1.03, 
        rotate: 1,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {days} Days
          </span>
          <span className="text-sm font-medium text-green-600">
            +{points}
          </span>
        </div>
      </div>
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title || "Progress"}
            fill
            className="object-cover"
          />
        </div>
      )}
    </motion.div>
  );
}

// 统计卡片组件
interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

export function StatsCard({ title, value, icon, bgColor = "bg-white" }: StatsCardProps) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 shadow-sm", 
        theme === 'dark' ? 'bg-gray-800' : bgColor
      )}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 } 
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium uppercase`}>{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </motion.div>
  );
}

// 日历卡片组件
interface ScheduleCardProps {
  days: string[];
  bgColor?: string;
}

export function ScheduleCard({ days, bgColor = "bg-white" }: ScheduleCardProps) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const { theme } = useTheme();
  const { locale } = useI18n();
  
  // 本地化星期几
  const localizedWeekDays = locale === 'zh' 
    ? ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    : weekDays;
  
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6 shadow-sm", 
        theme === 'dark' ? 'bg-gray-800' : bgColor
      )}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{locale === 'zh' ? '日程' : 'Schedule'}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{locale === 'zh' ? '按周' : 'By week'}</p>
      </div>
      <div className="flex justify-between">
        {localizedWeekDays.map((day, i) => (
          <div key={day} className="text-center">
            <div className="text-xs mb-2">{day}</div>
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                days.includes(weekDays[i].toLowerCase()) 
                  ? "bg-blue-500 text-white" 
                  : theme === 'dark' ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-400"
              )}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 