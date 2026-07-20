'use client'

import { motion } from 'framer-motion'

import { HEALTH_META } from '@/lib/karsa/health-meta'
import { formatRupiah, type Totals } from '@/lib/karsa/logic'
import type { HealthStatus } from '@/lib/karsa/types'

interface HeroStatusProps {
  health: HealthStatus
  totals: Totals
  transactionCount: number
}

export function HeroStatus({ health, totals, transactionCount }: HeroStatusProps) {
  const meta = HEALTH_META[health]
  const labaLabel = totals.laba >= 0 ? 'Untung' : 'Boncos'

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${meta.dot}`} aria-hidden />
            <span className="text-sm font-medium text-muted-foreground">
              Kondisi warung hari ini
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {meta.emoji} {meta.label}
          </h1>
          <p className="mt-2 text-base text-muted-foreground leading-relaxed text-pretty">
            {meta.helper}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto">
          <MiniStat label="Omset" value={formatRupiah(totals.omset)} tone="text-foreground" />
          <MiniStat
            label="Pengeluaran"
            value={formatRupiah(totals.pengeluaran)}
            tone="text-foreground"
          />
          <MiniStat
            label={labaLabel}
            value={formatRupiah(totals.laba)}
            tone={totals.laba >= 0 ? 'text-success' : 'text-risk'}
            highlight
          />
        </div>
      </div>

      <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
        {transactionCount > 0
          ? `Berdasarkan ${transactionCount} catatan transaksi yang sudah kamu simpan.`
          : 'Belum ada catatan. Klik “Muat Contoh Data Warung” untuk lihat KarsaOS beraksi.'}
      </p>
    </motion.section>
  )
}

function MiniStat({
  label,
  value,
  tone,
  highlight,
}: {
  label: string
  value: string
  tone: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
      }`}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  )
}
