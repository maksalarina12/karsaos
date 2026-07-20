'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

interface TabsProps {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/80 p-1 backdrop-blur-xs',
        className,
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ComponentProps<'button'> {
  value: string
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: active, setValue } = useTabs()
  const selected = active === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-mono font-semibold transition-all duration-200 ease-in-out outline-none whitespace-nowrap',
        selected
          ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20 ring-1 ring-indigo-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.ComponentProps<'div'> {
  value: string
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { value: active } = useTabs()
  if (active !== value) return null
  return <div role="tabpanel" className={cn('mt-5', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
