import Image from 'next/image'
import Link from 'next/link'
import { 
  Bot, 
  Code2, 
  Palette, 
  Box, 
  Image as ImageIcon 
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

const contributorsByRole = {
  development: {
    icon: <Code2 className="h-4 w-4" />,
    nameZh: '开发',
    nameEn: 'Development',
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
    nameZh: '架构',
    nameEn: 'Architecture',
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
    nameZh: '设计',
    nameEn: 'Design',
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
    nameZh: '图像生成',
    nameEn: 'Text2Image',
    items: [
      {
        name: 'KlingAI',
        avatar: '/contributors/kling.png',
        url: 'https://www.klingai.com'
      }
    ]
  }
}

function ContributorGroup({ 
  items, 
  icon, 
  name 
}: { 
  items: typeof contributorsByRole[keyof typeof contributorsByRole]['items']
  icon: React.ReactNode
  name: string 
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
        {icon}
        <span>{name}</span>
      </div>
      {items.map((contributor) => (
        <Link
          key={contributor.name}
          href={contributor.url}
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
        >
          <Image
            src={contributor.avatar}
            alt={contributor.name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span>{contributor.name}</span>
        </Link>
      ))}
    </div>
  )
}

export function Contributors() {
  const pathname = usePathname() || ''
  const isEnglish = pathname.startsWith('/en')

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          size="lg"
          className="relative h-9 w-full justify-between px-3 font-normal"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>{isEnglish ? 'AI Contributors' : 'AI贡献者'}</span>
          </div>
          <span className="text-muted-foreground">→</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        align="start"
        className="w-[240px] p-2"
      >
        <div className="space-y-4">
          {Object.entries(contributorsByRole).map(([role, { items, icon, nameZh, nameEn }]) => (
            <ContributorGroup
              key={role}
              items={items}
              icon={icon}
              name={isEnglish ? nameEn : nameZh}
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 