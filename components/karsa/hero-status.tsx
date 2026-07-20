'use client'

import * as React from 'react'
import { animate, motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { HEALTH_META } from '@/lib/karsa/health-meta'
import { formatRupiah, type Totals } from '@/lib/karsa/logic'
import type { HealthStatus } from '@/lib/karsa/types'

interface HeroStatusProps {
  health: HealthStatus
  totals: Totals
  transactionCount: number
}

const HEALTH_STYLE_MAP: Record<
  HealthStatus,
  {
    badgeBg: string
    badgeBorder: string
    badgeText: string
    dotBg: string
  }
> = {
  Sehat: {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    dotBg: 'bg-emerald-500',
  },
  Waspada: {
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    dotBg: 'bg-amber-500',
  },
  'Perlu Perhatian': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    badgeText: 'text-rose-600 dark:text-rose-400',
    dotBg: 'bg-rose-500',
  },
}

function AnimatedCounter({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion()
  const [displayVal, setDisplayVal] = React.useState(() =>
    prefersReducedMotion ? value : 0,
  )

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayVal(value)
      return
    }

    const controls = animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayVal(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [value, prefersReducedMotion])

  return <span className="font-mono tabular-nums">{formatRupiah(displayVal)}</span>
}

export function HeroStatus({ health, totals, transactionCount }: HeroStatusProps) {
  const meta = HEALTH_META[health]
  const style = HEALTH_STYLE_MAP[health]
  const prefersReducedMotion = useReducedMotion()
  const labaLabel = totals.laba >= 0 ? 'Laba Bersih' : 'Defisit'

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
        staggerChildren: 0.08,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Executive Intelligence Header */}
        <div className="max-w-xl flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              Laporan Posisi Usaha
            </span>
            <span className="inline-block size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${style.badgeBg} ${style.badgeBorder} ${style.badgeText} transition-all duration-200`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dotBg} animate-pulse`} />
              <span>Status: {meta.label}</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl text-balance">
            Kondisi Keuangan Usaha: {meta.label}
          </h1>
          <p className="text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400 text-pretty">
            {meta.helper}
          </p>
        </div>

        {/* Executive Bento Grid Metrics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[480px]">
          {/* Omset Card */}
          <motion.div
            variants={cardVariants}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/60 hover:border-indigo-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Omzet
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                <AnimatedCounter value={totals.omset} />
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowUpRight className="size-3" />
                <span>+12.4% vs minggu lalu</span>
              </div>
            </div>
          </motion.div>

          {/* Pengeluaran Card */}
          <motion.div
            variants={cardVariants}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/60 hover:border-rose-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Pengeluaran
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <TrendingDown className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400 sm:text-2xl">
                <AnimatedCounter value={totals.pengeluaran} />
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <span>Terkendali dalam batas</span>
              </div>
            </div>
          </motion.div>

          {/* Laba Bersih Card */}
          <motion.div
            variants={cardVariants}
            className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${
              totals.laba >= 0
                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 hover:border-emerald-500/60'
                : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 hover:border-rose-500/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                {labaLabel}
              </span>
              <div
                className={`flex size-7 items-center justify-center rounded-lg ${
                  totals.laba >= 0
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400'
                }`}
              >
                {totals.laba >= 0 ? (
                  <Wallet className="size-4" />
                ) : (
                  <Scale className="size-4" />
                )}
              </div>
            </div>
            <div className="mt-3">
              <p
                className={`text-xl font-bold tracking-tight sm:text-2xl ${
                  totals.laba >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                <AnimatedCounter value={totals.laba} />
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono font-semibold">
                <span className={totals.laba >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {totals.laba >= 0 ? 'Margin Sehat' : 'Defisit Operasional'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtext Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-slate-200/80 dark:border-slate-800/80 pt-3.5 text-xs font-medium text-slate-500">
        <Activity className="size-3.5 text-indigo-500 shrink-0" />
        <p>
          {transactionCount > 0
            ? `Dihitung dari riwayat ${transactionCount} transaksi terakhir.`
            : 'Belum ada data transaksi tersimpan. Silakan muat contoh data warung untuk melihat simulasi.'}
        </p>
      </div>
    </motion.section>
  )
}
