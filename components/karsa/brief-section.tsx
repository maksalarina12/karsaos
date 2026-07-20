'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  CheckCheck,
  Lightbulb,
  Search,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { celebrate } from '@/lib/karsa/confetti'
import type { BusinessBrief, BriefStatus, BriefType } from '@/lib/karsa/types'

interface BriefSectionProps {
  briefs: BusinessBrief[]
  onSetStatus: (id: string, status: BriefStatus) => void
  stack?: boolean
}

const TYPE_META: Record<
  BriefType,
  {
    label: string
    emoji: string
    icon: React.ReactNode
    badge: 'success' | 'risk' | 'warning'
    ring: string
  }
> = {
  opportunity: {
    label: 'Peluang',
    emoji: '📈',
    icon: <TrendingUp className="size-5 text-success" />,
    badge: 'success',
    ring: 'border-success/30',
  },
  risk: {
    label: 'Risiko',
    emoji: '⚠️',
    icon: <TriangleAlert className="size-5 text-risk" />,
    badge: 'risk',
    ring: 'border-risk/30',
  },
  insight: {
    label: 'Insight',
    emoji: '💡',
    icon: <Lightbulb className="size-5 text-warning" />,
    badge: 'warning',
    ring: 'border-warning/30',
  },
}

export function BriefSection({ briefs, onSetStatus, stack }: BriefSectionProps) {
  const { toast } = useToast()
  const [openBrief, setOpenBrief] = React.useState<BusinessBrief | null>(null)

  const handleApply = (brief: BusinessBrief) => {
    onSetStatus(brief.id, 'applied')
    celebrate()
    toast({
      variant: 'success',
      title: 'Mantap, sarannya diterapkan!',
      description: brief.estimated_impact,
    })
  }

  const handleResolve = (brief: BusinessBrief) => {
    onSetStatus(brief.id, 'applied')
    celebrate()
    toast({
      variant: 'success',
      title: 'Sudah diatasi, kerja bagus!',
      description: 'Kartu ini ditandai selesai untuk hari ini.',
    })
  }

  if (briefs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Search className="size-8 text-muted-foreground" />
          <p className="font-medium">Belum ada Business Brief</p>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Muat contoh data atau catat beberapa transaksi, lalu KarsaOS akan
            menyiapkan 3 saran harian: Peluang, Risiko, dan Insight.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className={stack ? 'grid gap-4' : 'grid gap-4 md:grid-cols-3'}>
        {briefs.map((brief, i) => {
          const meta = TYPE_META[brief.type]
          const applied = brief.status === 'applied'
          return (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={`h-full ${meta.ring} ${applied ? 'opacity-70' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={meta.badge}>
                      <span aria-hidden>{meta.emoji}</span>
                      {meta.label}
                    </Badge>
                    {applied ? (
                      <Badge variant="neutral">
                        <CheckCheck className="size-3" />
                        Selesai
                      </Badge>
                    ) : (
                      meta.icon
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-balance">
                    {brief.title}
                  </h3>
                </CardHeader>
                <CardContent className="flex h-full flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {brief.description}
                  </p>
                  <div className="mt-auto flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenBrief(brief)}
                      className="gap-1.5"
                    >
                      <Search className="size-3.5" />
                      Kenapa?
                    </Button>
                    {!applied ? (
                      <div className="flex gap-2">
                        {brief.type === 'risk' ? (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleResolve(brief)}
                          >
                            Sudah Diatasi
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleApply(brief)}
                          >
                            Terapkan Saran
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={openBrief !== null} onOpenChange={(o) => !o && setOpenBrief(null)}>
        {openBrief ? (
          <>
            <DialogHeader>
              <Badge variant={TYPE_META[openBrief.type].badge} className="w-fit">
                <span aria-hidden>{TYPE_META[openBrief.type].emoji}</span>
                {TYPE_META[openBrief.type].label}
              </Badge>
              <DialogTitle>{openBrief.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-foreground">
              {openBrief.reasoning}
            </DialogDescription>
            <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Perkiraan dampak
              </p>
              <p className="mt-1 text-sm font-semibold">
                {openBrief.estimated_impact}
              </p>
            </div>
          </>
        ) : null}
      </Dialog>
    </>
  )
}
