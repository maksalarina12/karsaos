'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { computeHealth, computeTotals } from '@/lib/karsa/logic'
import { EMPTY_STATE, karsaRepository } from '@/lib/karsa/repository'
import { seedBriefs, seedTransactions } from '@/lib/karsa/seed'
import type { BusinessBrief, KarsaState, Transaction } from '@/lib/karsa/types'

export function useKarsaState() {
  const [state, setState] = useState<KarsaState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted state on mount (client only).
  useEffect(() => {
    const loaded = karsaRepository.load()
    setState({ ...loaded, businessHealth: computeHealth(loaded.transactions) })
    setHydrated(true)
  }, [])

  // Persist whenever state changes after hydration.
  useEffect(() => {
    if (!hydrated) return
    karsaRepository.save(state)
  }, [state, hydrated])

  const commit = useCallback(
    (updater: (prev: KarsaState) => KarsaState) => {
      setState((prev) => {
        const next = updater(prev)
        return { ...next, businessHealth: computeHealth(next.transactions) }
      })
    },
    [],
  )

  const addTransactions = useCallback(
    (transactions: Transaction[]) => {
      commit((prev) => ({
        ...prev,
        transactions: [...transactions, ...prev.transactions],
      }))
    },
    [commit],
  )

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      commit((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      }))
    },
    [commit],
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      }))
    },
    [commit],
  )

  const setBriefStatus = useCallback(
    (id: string, status: BusinessBrief['status']) => {
      commit((prev) => ({
        ...prev,
        businessBriefs: prev.businessBriefs.map((b) =>
          b.id === id ? { ...b, status } : b,
        ),
      }))
    },
    [commit],
  )

  const seedDemo = useCallback(() => {
    commit(() => ({
      transactions: seedTransactions(),
      businessBriefs: seedBriefs(),
      businessHealth: 'Sehat',
    }))
  }, [commit])

  const clearAll = useCallback(() => {
    karsaRepository.clear()
    setState({ ...EMPTY_STATE })
  }, [])

  const totals = useMemo(
    () => computeTotals(state.transactions),
    [state.transactions],
  )

  return {
    ...state,
    hydrated,
    totals,
    addTransactions,
    updateTransaction,
    deleteTransaction,
    setBriefStatus,
    seedDemo,
    clearAll,
  }
}

export type KarsaController = ReturnType<typeof useKarsaState>
