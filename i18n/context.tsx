"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import en from './locales/en'
import zh from './locales/zh'

type Locale = 'en' | 'zh'
type Translations = typeof en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Locale, Translations> = { en, zh }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase()
    const defaultLocale = browserLang.startsWith('zh') ? 'zh' : 'en'
    setLocale(defaultLocale)
  }, [])

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 