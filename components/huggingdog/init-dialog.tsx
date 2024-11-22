'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from '@/i18n/context'
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { enUS, zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface InitDialogProps {
  onDateSelect: (range: DateRange) => void
}

export function InitDialog({ onDateSelect }: InitDialogProps) {
  const { t, locale } = useI18n()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(true)
  const dateLocale = locale === 'zh' ? zhCN : enUS

  const handleSelectToday = () => {
    const today = new Date()
    const range = {
      from: today,
      to: today
    }
    onDateSelect(range)
    setOpen(false)
  }

  const handleDateRangeSelect = () => {
    if (dateRange?.from && dateRange?.to) {
      onDateSelect(dateRange)
      setOpen(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false)
    }
  }

  const isConfirmDisabled = !dateRange?.from || !dateRange?.to

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('huggingdog.welcomeTitle')}</DialogTitle>
          <DialogDescription>
            {t('huggingdog.welcomeDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={{ 
              after: new Date(),
              before: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }}
            className="rounded-md border"
            locale={dateLocale}
          />
          <div className="flex w-full justify-between">
            <Button 
              variant="outline" 
              onClick={handleSelectToday}
              className="flex items-center space-x-1"
            >
              <span>📅</span>
              <span>{t('huggingdog.selectToday')}</span>
            </Button>
            <Button 
              onClick={handleDateRangeSelect}
              disabled={isConfirmDisabled}
              className={cn(
                "flex items-center space-x-1",
                isConfirmDisabled 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#FF4B4B] hover:bg-[#FF4B4B] text-white"
              )}
            >
              <span>✨</span>
              <span>{t('huggingdog.confirm')}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 