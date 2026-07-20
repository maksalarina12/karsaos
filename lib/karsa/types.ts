export type TransactionType = 'revenue' | 'expense'

export interface Transaction {
  id: string
  date: string // ISO string
  type: TransactionType
  category: string
  item_name: string
  amount: number
  confidence_score: number // 0..1
  raw_input: string
}

export type BriefType = 'opportunity' | 'risk' | 'insight'
export type BriefStatus = 'active' | 'applied' | 'dismissed'

export interface BusinessBrief {
  id: string
  type: BriefType
  title: string
  description: string
  reasoning: string // why this happened, in plain Indonesian
  estimated_impact: string
  status: BriefStatus
}

export type HealthStatus = 'Sehat' | 'Waspada' | 'Perlu Perhatian'

export interface KarsaState {
  transactions: Transaction[]
  businessBriefs: BusinessBrief[]
  businessHealth: HealthStatus
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}
