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
 * Grounded, deterministic answer engine. It reads the loaded state and
 * responds in warm, plain Indonesian. No numbers are invented — every
 * figure comes from computeTotals / real transactions.
 */
export function answerQuestion(question: string, state: KarsaState): string {
  const q = question.toLowerCase()
  const { transactions } = state

  if (transactions.length === 0) {
    return 'Aku belum punya data warungmu nih. Coba klik "Muat Contoh Data Warung" atau catat beberapa transaksi dulu, nanti aku bantu analisa ya!'
  }

  const totals = computeTotals(transactions)
  const cats = aggregateByCategory(transactions)

  // Profit trend question.
  if (q.includes('turun') || (q.includes('profit') && q.includes('minggu'))) {
    const topExpense = [...cats].sort((a, b) => b.expense - a.expense)[0]
    return [
      `Untung bersihmu sekarang ${formatRupiah(totals.laba)} dari omzet ${formatRupiah(totals.omset)}.`,
      topExpense
        ? `Pengeluaran terbesar ada di kategori "${topExpense.category}" sebesar ${formatRupiah(topExpense.expense)}.`
        : '',
      'Kalau untung terasa menipis, biasanya karena harga bahan baku naik. Coba cek harga jual apakah masih sepadan dengan modal.',
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Most profitable product question.
  if (q.includes('untung') || q.includes('produk') || q.includes('paling')) {
    const best = [...cats].sort(
      (a, b) => b.revenue - b.expense - (a.revenue - a.expense),
    )[0]
    if (!best) return 'Belum cukup data untuk menentukan produk paling untung.'
    const laba = best.revenue - best.expense
    return `Kategori paling cuan sejauh ini adalah "${best.category}" dengan kontribusi untung sekitar ${formatRupiah(laba)} (omzet ${formatRupiah(best.revenue)}). Fokuskan energi dan stok ke sini ya!`
  }

  // Safe to buy stock question.
  if (q.includes('aman') || q.includes('stok') || q.includes('beli')) {
    if (totals.laba > 0) {
      const budget = Math.round(totals.laba * 0.4)
      return `Kondisi kasmu sedang untung ${formatRupiah(totals.laba)}. Aman kok beli stok, tapi jaga jangan lebih dari ${formatRupiah(budget)} (sekitar 40% untung) biar arus kas tetap sehat.`
    }
    return `Hati-hati dulu ya, saat ini pengeluaran (${formatRupiah(totals.pengeluaran)}) lebih besar dari pemasukan (${formatRupiah(totals.omset)}). Sebaiknya tunda beli stok besar sampai penjualan naik lagi.`
  }

  // Generic fallback grounded in data.
  return `Dari catatanmu: omzet ${formatRupiah(totals.omset)}, pengeluaran ${formatRupiah(totals.pengeluaran)}, dan untung bersih ${formatRupiah(totals.laba)}. Coba tanya soal profit, produk paling untung, atau apakah aman beli stok — aku bantu analisa dari datamu.`
}

export const SUGGESTIONS = [
  'Kenapa profit saya turun minggu ini?',
  'Produk apa yang paling untung?',
  'Apakah aman beli stok bahan hari ini?',
]
