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
        'inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1',
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
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none whitespace-nowrap',
        selected
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
  return <div role="tabpanel" className={cn('mt-6', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
