'use client'

import * as React from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Pencil,
  Search,
  Trash2,
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

export function FinancialDashboard({
  transactions,
  totals,
  onDelete,
  onUpdate,
}: FinancialDashboardProps) {
  const [query, setQuery] = React.useState('')
  const [editingId, setEditingId] = React.useState<string | null>(null)
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

  const labaLabel = totals.laba >= 0 ? 'Laba Bersih (Untung)' : 'Laba Bersih (Boncos)'

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Omset"
          value={formatRupiah(totals.omset)}
          icon={<ArrowUpRight className="size-5 text-success" />}
          accent="bg-success/10"
        />
        <MetricCard
          label="Total Pengeluaran"
          value={formatRupiah(totals.pengeluaran)}
          icon={<ArrowDownRight className="size-5 text-risk" />}
          accent="bg-risk/10"
        />
        <MetricCard
          label={labaLabel}
          value={formatRupiah(totals.laba)}
          icon={<Wallet className="size-5 text-primary" />}
          accent="bg-primary/10"
          highlight
          valueClass={totals.laba >= 0 ? 'text-success' : 'text-risk'}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari item atau kategori..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {transactions.length === 0
                ? 'Belum ada transaksi. Mulai catat lewat suara atau muat contoh data.'
                : 'Tidak ada transaksi yang cocok dengan pencarianmu.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Tanggal</th>
                    <th className="py-2 pr-3 font-medium">Item</th>
                    <th className="py-2 pr-3 font-medium">Kategori</th>
                    <th className="py-2 pr-3 text-right font-medium">Nominal</th>
                    <th className="py-2 pl-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const editing = editingId === t.id
                    return (
                      <tr
                        key={t.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-3 pr-3 text-muted-foreground whitespace-nowrap">
                          {formatTanggal(t.date)}
                        </td>
                        <td className="py-3 pr-3">
                          {editing ? (
                            <Input
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            <span className="font-medium">{t.item_name}</span>
                          )}
                        </td>
                        <td className="py-3 pr-3">
                          <Badge variant="neutral">{t.category}</Badge>
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {editing ? (
                            <Input
                              value={draftAmount}
                              onChange={(e) => setDraftAmount(e.target.value)}
                              inputMode="numeric"
                              className="h-8 text-right"
                            />
                          ) : (
                            <span
                              className={`font-semibold tabular-nums ${
                                t.type === 'revenue' ? 'text-success' : 'text-risk'
                              }`}
                            >
                              {t.type === 'revenue' ? '+' : '-'}
                              {formatRupiah(t.amount)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-3">
                          <div className="flex justify-end gap-1">
                            {editing ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Simpan perubahan"
                                  onClick={() => saveEdit(t.id)}
                                >
                                  <Check className="size-4 text-success" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Batal edit"
                                  onClick={() => setEditingId(null)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Edit transaksi"
                                  onClick={() => startEdit(t)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Hapus transaksi"
                                  onClick={() => onDelete(t.id)}
                                >
                                  <Trash2 className="size-4 text-risk" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  accent,
  highlight,
  valueClass,
}: {
  label: string
  value: string
  icon: React.ReactNode
  accent: string
  highlight?: boolean
  valueClass?: string
}) {
  return (
    <Card className={highlight ? 'border-primary/30' : ''}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex size-11 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className={`mt-1 text-xl font-bold tabular-nums ${valueClass ?? ''}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
