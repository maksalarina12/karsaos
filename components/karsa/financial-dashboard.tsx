'use client'

import * as React from 'react'
import Image from 'next/image'
import { animate, AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Pencil,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatRupiah, formatTanggal, type Totals } from '@/lib/karsa/logic'
import type { Transaction } from '@/lib/karsa/types'

interface FinancialDashboardProps {
  transactions: Transaction[]
  totals: Totals
  onDelete: (id: string) => void
  onUpdate: (id: string, patch: Partial<Transaction>) => void
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
      duration: 0.85,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayVal(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [value, prefersReducedMotion])

  return <span className="font-mono tabular-nums">{formatRupiah(displayVal)}</span>
}

export function FinancialDashboard({
  transactions,
  totals,
  onDelete,
  onUpdate,
}: FinancialDashboardProps) {
  const [query, setQuery] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set())
  const [draftName, setDraftName] = React.useState('')
  const [draftAmount, setDraftAmount] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? transactions.filter(
          (t) =>
            t.item_name.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q),
        )
      : transactions
    return [...rows].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [transactions, query])

  const startEdit = (t: Transaction) => {
    setEditingId(t.id)
    setDraftName(t.item_name)
    setDraftAmount(String(t.amount))
  }

  const saveEdit = (id: string) => {
    const amount = Number(draftAmount.replace(/[^\d]/g, ''))
    onUpdate(id, {
      item_name: draftName.trim() || 'Tanpa nama',
      amount: Number.isFinite(amount) ? amount : 0,
    })
    setEditingId(null)
  }

  const handleSmoothDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      onDelete(id)
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const labaLabel = totals.laba >= 0 ? 'Laba Bersih (Untung)' : 'Laba Bersih (Boncos)'
  const marginPercent = totals.omset > 0 ? Math.round((totals.laba / totals.omset) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Bento Grid Financial Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Omset Card */}
        <Card className="border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Total Omset
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                <AnimatedCounter value={totals.omset} />
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Target Harian</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Tercapai</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran Card */}
        <Card className="border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Total Pengeluaran
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                <AnimatedCounter value={totals.pengeluaran} />
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Beban Operasional</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Terkendali</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${totals.omset > 0 ? Math.min(100, Math.round((totals.pengeluaran / totals.omset) * 100)) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Laba Bersih Card */}
        <Card
          className={`border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all ${
            totals.laba >= 0
              ? 'border-emerald-500/40 dark:border-emerald-500/30'
              : 'border-rose-500/40 dark:border-rose-500/30'
          }`}
        >
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                {labaLabel}
              </span>
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${
                  totals.laba >= 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                <Wallet className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <p
                className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${
                  totals.laba >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                <AnimatedCounter value={totals.laba} />
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Margin Profit</span>
                <span
                  className={`font-semibold ${
                    totals.laba >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {marginPercent}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${totals.laba >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.max(0, Math.min(100, Math.abs(marginPercent)))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Terminal Table Card */}
      <Card className="border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Jurnal Transaksi</span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                  {filtered.length} Entri
                </span>
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pencatatan real-time arus kas warung
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari transaksi atau kategori..."
                className="pl-9 h-9 text-xs cursor-pointer border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center font-mono text-xs text-slate-500">
              <Image
                src="/karsaos.png"
                alt="KarsaOS Logo"
                width={36}
                height={36}
                className="object-contain opacity-50 mb-1"
              />
              <p>
                {transactions.length === 0
                  ? 'Belum ada data transaksi. Gunakan tombol "Muat Contoh Data Warung" atau rekam cerita bisnis.'
                  : 'Tidak ada transaksi yang sesuai dengan filter pencarian.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Data-Dense Terminal Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-left font-mono font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 pr-3 text-[10px]">Waktu</th>
                      <th className="py-3 pr-3 text-[10px]">Item / Deskripsi</th>
                      <th className="py-3 pr-3 text-[10px]">Kategori</th>
                      <th className="py-3 pr-3 text-right text-[10px]">Nominal (IDR)</th>
                      <th className="py-3 pl-3 text-right text-[10px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    <AnimatePresence>
                      {filtered.map((t, idx) => {
                        const editing = editingId === t.id
                        const isDeleting = deletingIds.has(t.id)

                        if (isDeleting) return null

                        return (
                          <motion.tr
                            key={t.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -16, height: 0 }}
                            transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                            className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 pr-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {formatTanggal(t.date)}
                            </td>
                            <td className="py-3 pr-3 font-medium text-slate-900 dark:text-slate-100">
                              {editing ? (
                                <Input
                                  value={draftName}
                                  onChange={(e) => setDraftName(e.target.value)}
                                  className="h-7 text-xs border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-500"
                                />
                              ) : (
                                <span>{t.item_name}</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              <Badge
                                variant="neutral"
                                className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 font-mono text-[10px] px-2 py-0.5"
                              >
                                {t.category}
                              </Badge>
                            </td>
                            <td className="py-3 pr-3 text-right">
                              {editing ? (
                                <Input
                                  value={draftAmount}
                                  onChange={(e) => setDraftAmount(e.target.value)}
                                  inputMode="numeric"
                                  className="h-7 text-xs text-right font-mono border-slate-200 focus-visible:ring-1 focus-visible:ring-indigo-500"
                                />
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1 font-mono font-bold tabular-nums text-xs px-2 py-0.5 rounded-md border ${
                                    t.type === 'revenue'
                                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60'
                                      : 'text-rose-700 bg-rose-50 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60'
                                  }`}
                                >
                                  {t.type === 'revenue' ? '+' : '-'}
                                  {formatRupiah(t.amount)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 pl-3">
                              <div className="flex justify-end gap-1 opacity-90 group-hover:opacity-100">
                                {editing ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      aria-label="Simpan perubahan"
                                      onClick={() => saveEdit(t.id)}
                                      className="cursor-pointer hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400"
                                    >
                                      <Check className="size-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      aria-label="Batal edit"
                                      onClick={() => setEditingId(null)}
                                      className="cursor-pointer hover:bg-rose-100 text-rose-700 dark:text-rose-400"
                                    >
                                      <X className="size-3.5" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      aria-label="Edit transaksi"
                                      onClick={() => startEdit(t)}
                                      className="cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-xs"
                                      aria-label="Hapus transaksi"
                                      onClick={() => handleSmoothDelete(t.id)}
                                      className="cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card-List Layout (< sm) */}
              <div className="block sm:hidden space-y-2.5 pt-1">
                <AnimatePresence>
                  {filtered.map((t, idx) => {
                    const editing = editingId === t.id
                    const isDeleting = deletingIds.has(t.id)

                    if (isDeleting) return null

                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400">
                            {formatTanggal(t.date)}
                          </span>
                          <Badge
                            variant="neutral"
                            className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono text-[9px] px-1.5"
                          >
                            {t.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {editing ? (
                              <Input
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                className="h-7 text-xs"
                              />
                            ) : (
                              <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
                                {t.item_name}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            {editing ? (
                              <Input
                                value={draftAmount}
                                onChange={(e) => setDraftAmount(e.target.value)}
                                inputMode="numeric"
                                className="h-7 w-24 text-right font-mono text-xs"
                              />
                            ) : (
                              <span
                                className={`inline-flex items-center text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md border ${
                                  t.type === 'revenue'
                                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'text-rose-700 bg-rose-50 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400'
                                }`}
                              >
                                {t.type === 'revenue' ? '+' : '-'}
                                {formatRupiah(t.amount)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 mt-0.5">
                          {editing ? (
                            <>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => saveEdit(t.id)}
                                className="cursor-pointer gap-1 text-[11px] text-emerald-600 border-emerald-300"
                              >
                                <Check className="size-3" /> Simpan
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="cursor-pointer text-[11px]"
                              >
                                Batal
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => startEdit(t)}
                                className="cursor-pointer text-[11px] text-indigo-600 gap-1"
                              >
                                <Pencil className="size-3" /> Edit
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => handleSmoothDelete(t.id)}
                                className="cursor-pointer text-[11px] text-rose-600 gap-1"
                              >
                                <Trash2 className="size-3" /> Hapus
                              </Button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
