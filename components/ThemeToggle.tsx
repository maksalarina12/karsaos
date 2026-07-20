'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-500 cursor-pointer"
        aria-label="Toggle theme"
        disabled
      >
        <span className="size-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        className="relative size-8 cursor-pointer rounded-lg border border-slate-200/80 bg-white/50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Sun
          className={`size-4 transition-all duration-300 ${
            isDark ? 'scale-0 rotate-90 opacity-0 absolute' : 'scale-100 rotate-0 opacity-100 text-amber-500'
          }`}
        />
        <Moon
          className={`size-4 transition-all duration-300 ${
            isDark ? 'scale-100 rotate-0 opacity-100 text-indigo-400' : 'scale-0 -rotate-90 opacity-0 absolute'
          }`}
        />
      </Button>
    </motion.div>
  )
}
