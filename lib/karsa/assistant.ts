import { computeTotals, formatRupiah } from './logic'
import type { KarsaState, Transaction } from './types'

interface CategoryAgg {
  category: string
  revenue: number
  expense: number
}

function aggregateByCategory(transactions: Transaction[]): CategoryAgg[] {
  const map = new Map<string, CategoryAgg>()
  for (const t of transactions) {
    const agg = map.get(t.category) ?? { category: t.category, revenue: 0, expense: 0 }
    if (t.type === 'revenue') agg.revenue += t.amount
    else agg.expense += t.amount
    map.set(t.category, agg)
  }
  return [...map.values()]
}

/**
 * Deterministic financial analysis engine. Responds in clear, professional Indonesian.
 * All numbers are computed directly from actual transaction records.
 */
export function answerQuestion(question: string, state: KarsaState): string {
  const q = question.toLowerCase()
  const { transactions } = state

  if (transactions.length === 0) {
    return 'Belum ada data transaksi tersimpan. Silakan muat contoh data warung atau catat beberapa transaksi untuk melihat analisis keuangan.'
  }

  const totals = computeTotals(transactions)
  const cats = aggregateByCategory(transactions)

  // Profit trend question.
  if (q.includes('turun') || (q.includes('profit') && q.includes('minggu')) || q.includes('margin')) {
    const topExpense = [...cats].sort((a, b) => b.expense - a.expense)[0]
    return [
      `Laba bersih saat ini tercatat ${formatRupiah(totals.laba)} dari total omzet ${formatRupiah(totals.omset)}.`,
      topExpense
        ? `Pengeluaran terbesar berada pada kategori "${topExpense.category}" sebesar ${formatRupiah(topExpense.expense)}.`
        : '',
      'Penurunan margin umumnya dipengaruhi oleh peningkatan biaya operasional atau harga bahan baku. Disarankan mengevaluasi penyesuaian harga jual.',
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Most profitable product question.
  if (q.includes('untung') || q.includes('produk') || q.includes('paling')) {
    const best = [...cats].sort(
      (a, b) => b.revenue - b.expense - (a.revenue - a.expense),
    )[0]
    if (!best) return 'Data transaksi belum cukup untuk menganalisis kontribusi produk.'
    const laba = best.revenue - best.expense
    return `Kategori dengan kontribusi laba terbesar adalah "${best.category}" dengan estimasi laba ${formatRupiah(laba)} dari omzet ${formatRupiah(best.revenue)}.`
  }

  // Safe to buy stock question.
  if (q.includes('aman') || q.includes('stok') || q.includes('beli')) {
    if (totals.laba > 0) {
      const budget = Math.round(totals.laba * 0.4)
      return `Laba operasional saat ini sebesar ${formatRupiah(totals.laba)}. Pembelian stok disarankan maksimal ${formatRupiah(budget)} (40% dari laba) agar arus kas tetap terjaga.`
    }
    return `Arus kas perlu diperhatikan karena total pengeluaran (${formatRupiah(totals.pengeluaran)}) melebihi omzet (${formatRupiah(totals.omset)}). Disarankan menunda alokasi stok besar.`
  }

  // Generic fallback grounded in data.
  return `Ringkasan posisi keuangan: Omzet ${formatRupiah(totals.omset)}, pengeluaran ${formatRupiah(totals.pengeluaran)}, dan laba bersih ${formatRupiah(totals.laba)}. Silakan tanyakan seputar margin, kategori paling menguntungkan, atau alokasi stok.`
}

export const SUGGESTIONS = [
  'Kenapa margin usaha turun minggu ini?',
  'Kategori produk mana yang paling menguntungkan?',
  'Apakah aman menambah stok bahan hari ini?',
]
