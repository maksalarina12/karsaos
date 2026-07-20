'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

import { KarsaLogo } from '@/components/KarsaLogo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { HEALTH_META } from '@/lib/karsa/health-meta'
import type { HealthStatus } from '@/lib/karsa/types'

interface TopNavProps {
  health: HealthStatus
  onSeed: () => void
}

const HEALTH_PILL_STYLE: Record<
  HealthStatus,
  {
    bg: string
    border: string
    text: string
    dot: string
  }
> = {
  Sehat: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Waspada: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  'Perlu Perhatian': {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
}

export function TopNav({ health, onSeed }: TopNavProps) {
  const meta = HEALTH_META[health]
  const pill = HEALTH_PILL_STYLE[health]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-slate-950/85 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <KarsaLogo width={32} height={32} priority href="/" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Karsa<span className="text-indigo-600 dark:text-indigo-400">OS</span>
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Strategi & Keuangan
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analisis Keuangan & Manajemen Usaha
            </p>
          </div>
        </div>

        {/* Live Status Pill & Seed Data Action & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${pill.bg} ${pill.border} ${pill.text} transition-all duration-200`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${pill.dot} animate-pulse`} />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Status:</span>
            <span>{meta.label}</span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="sm"
              onClick={onSeed}
              className="cursor-pointer gap-1.5 rounded-lg bg-slate-900 font-medium text-white shadow-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-xs px-3.5"
            >
              <Zap className="size-3.5 fill-indigo-400 text-indigo-400 dark:fill-indigo-600 dark:text-indigo-600" />
              <span>Muat Contoh Data Warung</span>
            </Button>
          </motion.div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
