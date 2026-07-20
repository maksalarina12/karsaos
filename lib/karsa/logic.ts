import type { HealthStatus, Transaction, TransactionType } from './types'

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTanggal(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export interface Totals {
  omset: number
  pengeluaran: number
  laba: number
}

/**
 * Pure TypeScript math — the AI never calculates numbers, it only
 * structures the story. All arithmetic happens here deterministically.
 */
export function computeTotals(transactions: Transaction[]): Totals {
  let omset = 0
  let pengeluaran = 0
  for (const t of transactions) {
    if (t.type === 'revenue') omset += t.amount
    else pengeluaran += t.amount
  }
  return { omset, pengeluaran, laba: omset - pengeluaran }
}

/**
 * Simple 7-day profit rule to derive an empathetic health status.
 */
export function computeHealth(transactions: Transaction[]): HealthStatus {
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const recent = transactions.filter(
    (t) => now - new Date(t.date).getTime() <= sevenDays,
  )
  if (recent.length === 0) return 'Sehat'
  const { omset, laba } = computeTotals(recent)
  if (omset === 0) return 'Perlu Perhatian'
  const margin = laba / omset
  if (laba > 0 && margin >= 0.2) return 'Sehat'
  if (laba > 0 || margin >= 0) return 'Waspada'
  return 'Perlu Perhatian'
}

const REVENUE_WORDS = [
  'jual',
  'laku',
  'terjual',
  'laris',
  'dapat',
  'pemasukan',
  'masuk',
  'omset',
  'omzet',
  'bayar dp',
  'pesan',
]

const EXPENSE_WORDS = [
  'beli',
  'bayar',
  'belanja',
  'stok',
  'kulakan',
  'listrik',
  'gas',
  'sewa',
  'gaji',
  'ongkos',
  'modal',
  'keluar',
]

const CATEGORY_HINTS: Array<{ words: string[]; category: string }> = [
  { words: ['kopi', 'teh', 'minum', 'gelas', 'es'], category: 'Minuman' },
  { words: ['nasi', 'goreng', 'makan', 'porsi', 'gorengan', 'mie'], category: 'Makanan' },
  { words: ['susu', 'gula', 'beras', 'telur', 'bahan', 'kulakan', 'stok'], category: 'Bahan Baku' },
  { words: ['listrik', 'air', 'internet', 'wifi'], category: 'Utilitas' },
  { words: ['gas', 'elpiji', 'lpg'], category: 'Operasional' },
  { words: ['sewa', 'kontrak'], category: 'Sewa' },
  { words: ['gaji', 'karyawan', 'pegawai'], category: 'Gaji' },
]

/**
 * Parse a free-form Indonesian business story into structured transactions.
 * Handles amounts like "300.000", "45rb", "150 ribu", "1,5jt".
 */
export function parseStory(text: string): Transaction[] {
  const clean = text.trim()
  if (!clean) return []

  // Split on connectors so multiple events in one story become multiple rows.
  const segments = clean
    .split(/(?:,|\.|\bdan\b|\blalu\b|\bterus\b|\bkemudian\b|;|\n)/i)
    .map((s) => s.trim())
    .filter(Boolean)

  const results: Transaction[] = []

  for (const segment of segments) {
    const amount = extractAmount(segment)
    if (amount <= 0) continue

    const lower = segment.toLowerCase()
    const type = detectType(lower)
    const category = detectCategory(lower, type)
    const itemName = buildItemName(segment)

    results.push({
      id: uid('trx'),
      date: new Date().toISOString(),
      type,
      category,
      item_name: itemName,
      amount,
      confidence_score: computeConfidence(lower, amount),
      raw_input: segment,
    })
  }

  return results
}

function detectType(lower: string): TransactionType {
  const rev = REVENUE_WORDS.some((w) => lower.includes(w))
  const exp = EXPENSE_WORDS.some((w) => lower.includes(w))
  if (exp && !rev) return 'expense'
  if (rev && !exp) return 'revenue'
  // "beli"/"bayar" are stronger expense signals than generic revenue words.
  if (exp) return 'expense'
  return 'revenue'
}

function detectCategory(lower: string, type: TransactionType): string {
  for (const hint of CATEGORY_HINTS) {
    if (hint.words.some((w) => lower.includes(w))) return hint.category
  }
  return type === 'revenue' ? 'Penjualan' : 'Pengeluaran Lain'
}

function buildItemName(segment: string): string {
  const cleaned = segment
    .replace(/rp\.?/gi, '')
    .replace(/[0-9][0-9.,]*\s*(rb|ribu|jt|juta|k)?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  const name = cleaned.length > 0 ? cleaned : segment
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function computeConfidence(lower: string, amount: number): number {
  let score = 0.6
  if (amount > 0) score += 0.2
  if (REVENUE_WORDS.some((w) => lower.includes(w)) || EXPENSE_WORDS.some((w) => lower.includes(w)))
    score += 0.15
  return Math.min(0.98, Number(score.toFixed(2)))
}

interface AmountCandidate {
  value: number
  hasUnit: boolean
}

/**
 * Words that appear right after a number but signal a quantity/count, not
 * money (e.g. "3 porsi", "5 gelas"). Amounts tied to these are de-prioritized.
 */
const COUNT_WORDS = [
  'porsi',
  'gelas',
  'biji',
  'buah',
  'bungkus',
  'pcs',
  'potong',
  'orang',
  'liter',
  'kg',
  'kilo',
]

/**
 * Extract a rupiah amount from a text segment.
 *
 * A segment can contain several numbers (e.g. "nasi goreng 3 porsi 45rb").
 * We scan every number, score each candidate, and choose the one most likely
 * to be money: explicit units (rb/ribu/jt/juta/k) or "Rp" win, bare counts
 * like "3 porsi" lose.
 */
export function extractAmount(text: string): number {
  const lower = text.toLowerCase()
  const regex = /(rp\.?\s*)?(\d[\d.,]*)\s*(jt|juta|rb|ribu|k)?/gi
  const candidates: AmountCandidate[] = []

  let match: RegExpExecArray | null
  while ((match = regex.exec(lower)) !== null) {
    const hasRpPrefix = Boolean(match[1])
    let numStr = match[2]
    const unit = match[3]

    if (unit) {
      numStr = numStr.replace(/\./g, '').replace(',', '.')
    } else {
      numStr = numStr.replace(/\./g, '').replace(/,/g, '')
    }

    let value = parseFloat(numStr)
    if (Number.isNaN(value)) continue

    switch (unit) {
      case 'jt':
      case 'juta':
        value *= 1_000_000
        break
      case 'rb':
      case 'ribu':
      case 'k':
        value *= 1_000
        break
    }
    value = Math.round(value)
    if (value <= 0) continue

    // Is this number immediately followed by a counting word?
    const after = lower.slice(regex.lastIndex).trimStart()
    const isCount = COUNT_WORDS.some((w) => after.startsWith(w))

    candidates.push({ value, hasUnit: Boolean(unit) || hasRpPrefix || (!isCount && value >= 1000) })
  }

  if (candidates.length === 0) return 0

  // Prefer candidates that clearly represent money; among those, the largest.
  const monetary = candidates.filter((c) => c.hasUnit)
  const pool = monetary.length > 0 ? monetary : candidates
  return pool.reduce((max, c) => (c.value > max ? c.value : max), 0)
}
