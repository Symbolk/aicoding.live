"use client"

import * as React from "react"
import {
  Bot,
  Github,
  BookOpen,
  Frame,
  PieChart,
  Map,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useI18n } from "@/i18n/context"

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSelect: (value: string) => void
}

export function CommandMenu({ open, setOpen, onSelect }: CommandMenuProps) {
  const { t } = useI18n()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  const projects = [
    {
      icon: Bot,
      name: t('projects.huggingdog'),
      value: "huggingdog",
    },
    {
      icon: Github,
      name: t('projects.askgithub'),
      value: "askgithub",
    },
    {
      icon: BookOpen,
      name: t('projects.livebook'),
      value: "livebook",
    },
    {
      icon: Frame,
      name: t('projects.designEngineering'),
      value: "designEngineering",
    },
    {
      icon: PieChart,
      name: t('projects.salesMarketing'),
      value: "salesMarketing",
    },
    {
      icon: Map,
      name: t('projects.travel'),
      value: "travel",
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.value}
              value={project.value}
              onSelect={() => {
                onSelect(project.value)
                setOpen(false)
              }}
            >
              <project.icon className="mr-2 h-4 w-4" />
              <span>{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 