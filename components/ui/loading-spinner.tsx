"use client"

import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'

export function LoadingSpinner() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <motion.div
        className="relative w-24 h-24"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-l-purple-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2
            }}
            style={{
              opacity: 1 - index * 0.2,
              scale: 1 - index * 0.1
            }}
          />
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      >
        {t('playground.questionLoading')}
      </motion.div>

      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-purple-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
} 