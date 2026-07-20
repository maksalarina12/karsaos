import type { KarsaState } from './types'

/**
 * Repository Pattern.
 *
 * The rest of the app only depends on this interface, never on the
 * concrete storage mechanism. Today it is backed by localStorage, but
 * swapping in a REST/Supabase/Neon backed implementation later only
 * requires providing another class that satisfies `KarsaRepository`.
 */
export interface KarsaRepository {
  load(): KarsaState
  save(state: KarsaState): void
  clear(): void
}

export const EMPTY_STATE: KarsaState = {
  transactions: [],
  businessBriefs: [],
  businessHealth: 'Sehat',
}

const STORAGE_KEY = 'karsa-os-state:v1'

export class LocalStorageRepository implements KarsaRepository {
  private key: string

  constructor(key: string = STORAGE_KEY) {
    this.key = key
  }

  load(): KarsaState {
    if (typeof window === 'undefined') return EMPTY_STATE
    try {
      const raw = window.localStorage.getItem(this.key)
      if (!raw) return EMPTY_STATE
      const parsed = JSON.parse(raw) as Partial<KarsaState>
      return {
        transactions: parsed.transactions ?? [],
        businessBriefs: parsed.businessBriefs ?? [],
        businessHealth: parsed.businessHealth ?? 'Sehat',
      }
    } catch {
      return EMPTY_STATE
    }
  }

  save(state: KarsaState): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(this.key, JSON.stringify(state))
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(this.key)
  }
}

// Default singleton used across the app.
export const karsaRepository: KarsaRepository = new LocalStorageRepository()
