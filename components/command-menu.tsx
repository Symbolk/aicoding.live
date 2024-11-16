"use client"

import {
  BookOpen,
  Bot,
  Github
} from "lucide-react"
import * as React from "react"

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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSelect: (value: string) => void
}

export function CommandMenu({ open, setOpen, onSelect }: CommandMenuProps) {
  const { t } = useI18n()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  const projects = [
    {
      icon: Bot,
      name: t('projects.huggingdog.name'),
      value: "huggingdog",
    },
    {
      icon: Github,
      name: t('projects.askgithub.name'),
      value: "askgithub",
    },
    {
      icon: BookOpen, 
      name: t('projects.livebook.name'),
      value: "livebook",
    }
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('commandMenu.searchPlaceholder')} />
      <CommandList>
        <CommandEmpty>{t('commandMenu.noResults')}</CommandEmpty>
        <CommandGroup heading={t('commandMenu.projectsHeading')}>
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