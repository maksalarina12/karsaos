import type { HealthStatus } from './types'

interface HealthMeta {
  emoji: string
  label: string
  helper: string
  badgeVariant: 'success' | 'warning' | 'risk'
  dot: string
}

export const HEALTH_META: Record<HealthStatus, HealthMeta> = {
  Sehat: {
    emoji: '🟢',
    label: 'Sehat',
    helper: 'Warungmu lagi untung dan stabil. Pertahankan!',
    badgeVariant: 'success',
    dot: 'bg-success',
  },
  Waspada: {
    emoji: '🟡',
    label: 'Waspada',
    helper: 'Masih aman, tapi margin mulai menipis. Perhatikan pengeluaran.',
    badgeVariant: 'warning',
    dot: 'bg-warning',
  },
  'Perlu Perhatian': {
    emoji: '🔴',
    label: 'Perlu Perhatian',
    helper: 'Pengeluaran melebihi pemasukan. Ayo kita benahi bareng.',
    badgeVariant: 'risk',
    dot: 'bg-risk',
  },
}
