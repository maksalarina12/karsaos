'use client'

import { Sparkles, Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HEALTH_META } from '@/lib/karsa/health-meta'
import type { HealthStatus } from '@/lib/karsa/types'

interface TopNavProps {
  health: HealthStatus
  onSeed: () => void
}

export function TopNav({ health, onSeed }: TopNavProps) {
  const meta = HEALTH_META[health]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-base font-bold leading-none tracking-tight">KarsaOS</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Business Copilot untuk UMKM Indonesia
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={meta.badgeVariant} className="px-3 py-1 text-sm">
            <span aria-hidden>{meta.emoji}</span>
            Kondisi Hari Ini: {meta.label}
          </Badge>
          <Button size="lg" onClick={onSeed} className="gap-1.5">
            <Zap className="size-4" />
            Muat Contoh Data Warung
          </Button>
        </div>
      </div>
    </header>
  )
}
