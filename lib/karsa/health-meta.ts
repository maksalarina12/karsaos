import type { HealthStatus } from './types'

interface HealthMeta {
  label: string
  helper: string
  badgeVariant: 'success' | 'warning' | 'risk'
}

export const HEALTH_META: Record<HealthStatus, HealthMeta> = {
  Sehat: {
    label: 'Sehat',
    helper: 'Arus kas usaha stabil dan mencatat laba positif mingguan.',
    badgeVariant: 'success',
  },
  Waspada: {
    label: 'Waspada',
    helper: 'Margin usaha menipis. Perhatikan peningkatan pengeluaran operasional.',
    badgeVariant: 'warning',
  },
  'Perlu Perhatian': {
    label: 'Perlu Perhatian',
    helper: 'Total pengeluaran melebihi pemasukan. Diperlukan penyesuaian strategi.',
    badgeVariant: 'risk',
  },
}
