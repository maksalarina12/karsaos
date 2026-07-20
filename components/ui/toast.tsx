'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'info' | 'warning' | 'destructive'

interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-success" />,
  info: <Info className="size-5 text-primary" />,
  warning: <TriangleAlert className="size-5 text-warning" />,
  destructive: <TriangleAlert className="size-5 text-destructive" />,
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const remove = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((prev) => [...prev, { ...t, id }])
      window.setTimeout(() => remove(id), 4200)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg',
              )}
              role="status"
            >
              <span className="mt-0.5 shrink-0">{ICONS[t.variant]}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
