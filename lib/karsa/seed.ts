import { uid } from './logic'
import type { BusinessBrief, Transaction, TransactionType } from './types'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9 + (n % 6), 15, 0, 0)
  return d.toISOString()
}

interface SeedRow {
  day: number
  type: TransactionType
  category: string
  item_name: string
  amount: number
  raw_input: string
}

// 7 days of realistic Indonesian warung activity.
const SEED_ROWS: SeedRow[] = [
  { day: 6, type: 'revenue', category: 'Minuman', item_name: 'Kopi 20 gelas', amount: 300_000, raw_input: 'Jual kopi 20 gelas Rp300.000' },
  { day: 6, type: 'expense', category: 'Bahan Baku', item_name: 'Susu kaleng', amount: 150_000, raw_input: 'Beli susu kaleng Rp150.000' },
  { day: 6, type: 'expense', category: 'Utilitas', item_name: 'Bayar listrik', amount: 50_000, raw_input: 'Bayar listrik Rp50.000' },

  { day: 5, type: 'revenue', category: 'Makanan', item_name: 'Nasi goreng 15 porsi', amount: 225_000, raw_input: 'Laku nasi goreng 15 porsi Rp225.000' },
  { day: 5, type: 'revenue', category: 'Minuman', item_name: 'Es teh 18 gelas', amount: 108_000, raw_input: 'Jual es teh 18 gelas Rp108.000' },
  { day: 5, type: 'expense', category: 'Operasional', item_name: 'Gas elpiji', amount: 30_000, raw_input: 'Beli gas elpiji Rp30.000' },

  { day: 4, type: 'revenue', category: 'Minuman', item_name: 'Kopi 24 gelas', amount: 360_000, raw_input: 'Jual kopi 24 gelas Rp360.000' },
  { day: 4, type: 'expense', category: 'Bahan Baku', item_name: 'Beras 10 kg', amount: 130_000, raw_input: 'Belanja beras 10 kg Rp130.000' },

  { day: 3, type: 'revenue', category: 'Makanan', item_name: 'Gorengan 100 biji', amount: 200_000, raw_input: 'Laku gorengan 100 biji Rp200.000' },
  { day: 3, type: 'revenue', category: 'Minuman', item_name: 'Kopi 22 gelas', amount: 330_000, raw_input: 'Jual kopi 22 gelas Rp330.000' },
  { day: 3, type: 'expense', category: 'Bahan Baku', item_name: 'Susu kaleng (harga naik)', amount: 180_000, raw_input: 'Beli susu kaleng Rp180.000' },

  { day: 2, type: 'revenue', category: 'Makanan', item_name: 'Nasi goreng 12 porsi', amount: 180_000, raw_input: 'Laku nasi goreng 12 porsi Rp180.000' },
  { day: 2, type: 'expense', category: 'Utilitas', item_name: 'Bayar air', amount: 40_000, raw_input: 'Bayar air Rp40.000' },

  { day: 1, type: 'revenue', category: 'Minuman', item_name: 'Kopi 26 gelas', amount: 390_000, raw_input: 'Jual kopi 26 gelas Rp390.000' },
  { day: 1, type: 'revenue', category: 'Makanan', item_name: 'Nasi goreng 14 porsi', amount: 210_000, raw_input: 'Laku nasi goreng 14 porsi Rp210.000' },
  { day: 1, type: 'expense', category: 'Bahan Baku', item_name: 'Susu kaleng (harga naik)', amount: 180_000, raw_input: 'Beli susu kaleng Rp180.000' },

  { day: 0, type: 'revenue', category: 'Minuman', item_name: 'Kopi 28 gelas', amount: 420_000, raw_input: 'Jual kopi 28 gelas Rp420.000' },
  { day: 0, type: 'revenue', category: 'Makanan', item_name: 'Gorengan 120 biji', amount: 240_000, raw_input: 'Laku gorengan 120 biji Rp240.000' },
  { day: 0, type: 'expense', category: 'Operasional', item_name: 'Gas elpiji', amount: 30_000, raw_input: 'Beli gas elpiji Rp30.000' },
]

export function seedTransactions(): Transaction[] {
  return SEED_ROWS.map((row) => ({
    id: uid('trx'),
    date: daysAgo(row.day),
    type: row.type,
    category: row.category,
    item_name: row.item_name,
    amount: row.amount,
    confidence_score: 0.96,
    raw_input: row.raw_input,
  }))
}

export function seedBriefs(): BusinessBrief[] {
  return [
    {
      id: uid('brief'),
      type: 'opportunity',
      title: 'Kopi jadi mesin cuan warungmu',
      description:
        'Kopi menyumbang omzet paling stabil dan terus naik 3 hari terakhir. Coba tambah 5 gelas stok per hari.',
      reasoning:
        'Analisis AI: Dari 7 hari terakhir, penjualan kopi naik dari 20 gelas menjadi 28 gelas per hari (+40%). Margin kopi juga paling sehat dibanding menu lain, jadi menambah porsi kopi punya risiko paling kecil untuk untung lebih banyak.',
      estimated_impact: 'Potensi tambahan untung ~Rp75.000/hari',
      status: 'active',
    },
    {
      id: uid('brief'),
      type: 'risk',
      title: 'Harga susu naik, untung kopi tergerus',
      description:
        'Biaya bahan baku susu naik. Kalau dibiarkan, margin kopi bisa terus menipis minggu depan.',
      reasoning:
        'Analisis AI: Profit kopi turun 12% karena harga bahan baku susu naik dari Rp15.000 ke Rp18.000 dalam 3 hari terakhir. Pengeluaran susu naik dari Rp150.000 menjadi Rp180.000 per pembelian, sementara harga jual kopi belum kamu sesuaikan.',
      estimated_impact: 'Risiko kehilangan untung ~Rp30.000/hari',
      status: 'active',
    },
    {
      id: uid('brief'),
      type: 'insight',
      title: 'Jam ramai kamu ada di pagi hari',
      description:
        'Sebagian besar transaksi tercatat pagi hari. Siapkan stok lebih awal biar tidak kehabisan.',
      reasoning:
        'Analisis AI: 70% transaksi tercatat sebelum jam 12 siang. Pola ini konsisten selama 7 hari. Menyiapkan bahan sejak pagi membuat kamu tidak kehilangan pembeli di jam tersibuk.',
      estimated_impact: 'Menjaga omzet tetap stabil di jam ramai',
      status: 'active',
    },
  ]
}
