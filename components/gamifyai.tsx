"use client"

import {
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  Github,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Gamepad2,
  CreditCard,
  Folder,
  Frame,
  LifeBuoy,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Send,
  Settings2,
  Share,
  Sparkles,
  SquareTerminal,
  Trash2,
  Globe,
  Dog,
  Network,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { HuggingDog } from "./huggingdog"
import { AskGitHub } from "./askgithub"
import { LiveBook } from "./livebook"
import { useState, useRef, useCallback } from "react"
import { useI18n } from "@/i18n/context"
import { CommandMenu } from "./command-menu"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Confetti } from '@/components/ui/confetti'

// 定义页面类型
type PageType = 'playground' | 'huggingdog' | 'askgithub' | 'livebook'

const data = {
  user: {
    name: "Symbolk",
    email: "symbolk@163.com",
    avatar: "/avatars/duck.png",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Network,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    }
  ],
  projects: [
    {
      name: "HuggingDog",
      url: "huggingdog",
      icon: Dog,
    },
    {
      name: "AskGitHub",
      url: "askgithub",
      icon: Github,
    },
    {
      name: "LiveBook",
      url: "livebook",
      icon: BookOpen,
    }
  ],
}

export function GamifyAI() {
  const [currentPage, setCurrentPage] = useState<PageType>('huggingdog')
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const confettiRef = useRef<any>(null)

  // 触发 Confetti 效果的函数
  const fireConfetti = useCallback(() => {
    if (!confettiRef.current) return
    
    // 随机生成位置
    const randomX = 0.2 + Math.random() * 0.6 // 在 0.2-0.8 之间，避免太靠边
    const randomY = 0.2 + Math.random() * 0.3 // 在 0.2-0.5 之间，避免太靠上或太靠下
    
    // 第一波粒子
    confettiRef.current.fire({
      spread: 70,
      startVelocity: 30,
      particleCount: 100,
      origin: { x: randomX, y: randomY }
    })

    // 延迟发射第二波粒子
    setTimeout(() => {
      confettiRef.current.fire({
        spread: 90,
        startVelocity: 45,
        particleCount: 50,
        origin: { x: randomX + 0.1, y: randomY - 0.1 }
      })
    }, 200)
  }, [])

  // 处理页面切换
  const handlePageChange = useCallback((newPage: PageType) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
      fireConfetti()
    }
  }, [currentPage, fireConfetti])

  // 修改命令选择处理函数
  const handleCommandSelect = (value: string) => {
    if (value === 'huggingdog' || value === 'askgithub' || value === 'livebook') {
      handlePageChange(value as PageType)
    }
  }

  // 渲染当前页面内容
  const renderContent = () => {
    switch (currentPage) {
      case 'huggingdog':
        return <HuggingDog />
      case 'askgithub':
        return <AskGitHub />
      case 'livebook':
        return <LiveBook />
      case 'playground':
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Playground</h1>
          </div>
        )
    }
  }

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    switch (currentPage) {
      case 'huggingdog':
        return 'HuggingDog'
      case 'askgithub':
        return 'AskGitHub'
      case 'livebook':
        return 'LiveBook'
      case 'playground':
      default:
        return 'Playground'
    }
  }

  return (
    <>
      <CommandMenu 
        open={open} 
        setOpen={setOpen} 
        onSelect={handleCommandSelect} 
      />
      <Confetti
        ref={confettiRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 999
        }}
        manualstart
      />
      <SidebarProvider>
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="#">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Gamepad2 className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">GamifyAI</span>
                      <span className="truncate text-xs">{t('common.enterprise')}</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('common.projects')}</SidebarGroupLabel>
              <SidebarMenu>
                {data.projects.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild
                      className={cn(
                        "cursor-pointer",
                        currentPage === item.url ? 'bg-sidebar-accent' : ''
                      )}
                      onClick={() => handlePageChange(item.url as PageType)}
                    >
                      <a>
                        <item.icon />
                        <span>{t(`projects.${item.url}`)}</span>
                      </a>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover className="cursor-pointer">
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48"
                        side="bottom"
                        align="end"
                      >
                        <DropdownMenuItem>
                          <Folder className="text-muted-foreground" />
                          <span>{t('common.viewProject')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="text-muted-foreground" />
                          <span>{t('common.shareProject')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash2 className="text-muted-foreground" />
                          <span>{t('common.deleteProject')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton className="cursor-pointer">
                    <MoreHorizontal />
                    <span>{t('common.more')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>{t('common.platform')}</SidebarGroupLabel>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={t(`${item.title.toLowerCase()}.title`)}
                        className={currentPage === 'playground' && item.title === 'Playground' ? 'bg-sidebar-accent' : ''}
                        onClick={() => item.title === 'Playground' && handlePageChange('playground')}
                      >
                        <a>
                          <item.icon />
                          <span>{t(`${item.title.toLowerCase()}.title`)}</span>
                        </a>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRight />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                      <span>{t(`${item.title.toLowerCase()}.${subItem.title.toLowerCase()}`)}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="sm">
                      <a 
                        href="https://github.com/Symbolk"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild size="sm">
                      <a 
                        href="https://github.com/Symbolk/gamifyai/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{t(`common.feedback`)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      size="sm"
                      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                    >
                      <Globe className="w-4 h-4" />
                      <span>{locale === 'en' ? '中文' : 'English'}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {data.user.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between backdrop-blur-sm bg-white/75 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => handlePageChange('playground')}>
                      {currentPage === 'playground' ? t('common.platform') : t('common.projects')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t(`projects.${currentPage}`)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="px-4">
              <Button
                variant="outline"
                className="relative h-9 justify-start text-sm text-muted-foreground"
                onClick={() => setOpen(true)}
              >
                <div className="relative flex items-center justify-between w-full">
                  <span className="hidden lg:inline-flex">{t('common.commandTip')}</span>
                  <span className="inline-flex lg:hidden">{t('common.typeTip')}</span>
                  <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-3 font-mono text-[10px] font-medium opacity-100 sm:flex min-w-[40px] justify-center">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </Button>
            </div>
          </header>
          <main className="flex-1 flex-col gap-4 p-4">
            {renderContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
