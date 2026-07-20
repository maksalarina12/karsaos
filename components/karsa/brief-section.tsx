'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Search,
  Terminal,
  TrendingUp,
  TriangleAlert,
  Zap,
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
    code: string
    icon: React.ReactNode
    badgeBg: string
    badgeText: string
    cardBorder: string
    accentGlow: string
    impactText: string
  }
> = {
  opportunity: {
    label: 'Peluang Growth',
    code: 'INTEL-OPP',
    icon: <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-800/60',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    cardBorder: 'border-l-2 border-l-emerald-500',
    accentGlow: 'hover:shadow-emerald-500/5',
    impactText: 'text-emerald-600 dark:text-emerald-400',
  },
  risk: {
    label: 'Risiko Operasional',
    code: 'INTEL-RISK',
    icon: <TriangleAlert className="size-4 text-rose-600 dark:text-rose-400" />,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200/60 dark:border-rose-800/60',
    badgeText: 'text-rose-700 dark:text-rose-400',
    cardBorder: 'border-l-2 border-l-rose-500',
    accentGlow: 'hover:shadow-rose-500/5',
    impactText: 'text-rose-600 dark:text-rose-400',
  },
  insight: {
    label: 'Insight Strategis',
    code: 'INTEL-INSIGHT',
    icon: <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-800/60',
    badgeText: 'text-amber-700 dark:text-amber-400',
    cardBorder: 'border-l-2 border-l-amber-500',
    accentGlow: 'hover:shadow-amber-500/5',
    impactText: 'text-amber-600 dark:text-amber-400',
  },
}

export function BriefSection({ briefs, onSetStatus, stack }: BriefSectionProps) {
  const { toast } = useToast()
  const [openBrief, setOpenBrief] = React.useState<BusinessBrief | null>(null)
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  const [animatingId, setAnimatingId] = React.useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleApply = (brief: BusinessBrief) => {
    setAnimatingId(brief.id)
    setTimeout(() => {
      onSetStatus(brief.id, 'applied')
      setAnimatingId(null)
      celebrate()
      toast({
        variant: 'success',
        title: 'Rekomendasi Dieksekusi!',
        description: brief.estimated_impact,
      })
    }, 400)
  }

  const handleResolve = (brief: BusinessBrief) => {
    setAnimatingId(brief.id)
    setTimeout(() => {
      onSetStatus(brief.id, 'applied')
      setAnimatingId(null)
      celebrate()
      toast({
        variant: 'success',
        title: 'Risiko Teratasi!',
        description: 'Status inteligensi telah diperbarui.',
      })
    }, 400)
  }

  if (briefs.length === 0) {
    return (
      <Card className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <FileText className="size-8 text-slate-400" />
          <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Belum Ada Executive Brief</p>
          <p className="max-w-sm text-xs text-slate-500 leading-relaxed font-mono">
            Muat contoh data warung atau catat beberapa transaksi untuk mengaktifkan AI Intelligence Agent.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className={stack ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 gap-4 md:grid-cols-3'}>
        {briefs.map((brief, i) => {
          const meta = TYPE_META[brief.type]
          const applied = brief.status === 'applied'
          const isExpanded = expandedIds.has(brief.id)
          const isAnimating = animatingId === brief.id

          return (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
            >
              <Card
                className={`group relative flex h-full flex-col overflow-hidden transition-all duration-200 border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-2xs hover:shadow-md ${
                  meta.cardBorder
                } ${applied ? 'opacity-75 bg-slate-50/50 dark:bg-slate-950/50' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${meta.badgeBg} ${meta.badgeText}`}>
                        {meta.icon}
                        <span>{meta.code}</span>
                      </span>
                    </div>
                    {applied ? (
                      <Badge variant="neutral" className="gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 font-mono text-[10px]">
                        <CheckCheck className="size-3" />
                        Selesai
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">STATUS: ACTIVE</span>
                    )}
                  </div>
                  <h3 className="mt-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {brief.title}
                  </h3>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {brief.description}
                  </p>

                  {/* Sleek Markdown-styled Analytical Breakdown Accordion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="reasoning"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 flex flex-col gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80 p-3 text-xs">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <Terminal className="size-3 text-indigo-500" />
                            <span>Analysis & Root Cause:</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                            {brief.reasoning}
                          </p>
                          <div className="mt-1 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between font-mono text-[11px]">
                            <span className="text-slate-400">Est. Impact:</span>
                            <span className={`font-bold tabular-nums ${meta.impactText}`}>{brief.estimated_impact}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => toggleExpand(brief.id)}
                        className="flex-1 cursor-pointer font-mono text-[11px] gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                        aria-expanded={isExpanded}
                      >
                        <Search className="size-3 text-indigo-500" />
                        <span>[Kenapa?]</span>
                        {isExpanded ? (
                          <ChevronUp className="size-3 text-slate-400 ml-auto" />
                        ) : (
                          <ChevronDown className="size-3 text-slate-400 ml-auto" />
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setOpenBrief(brief)}
                        className="cursor-pointer font-mono text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        Detail
                      </Button>
                    </div>

                    {!applied ? (
                      <div className="flex gap-2">
                        {brief.type === 'risk' ? (
                          <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              type="button"
                              size="xs"
                              className="w-full cursor-pointer font-mono text-xs gap-1.5 bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
                              onClick={() => handleResolve(brief)}
                              disabled={isAnimating}
                            >
                              {isAnimating ? (
                                <span className="flex items-center gap-1.5">
                                  <Check className="size-3.5" /> Memproses...
                                </span>
                              ) : (
                                <>
                                  <Terminal className="size-3.5" />
                                  <span>Execute: Mitigasi Risiko</span>
                                </>
                              )}
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              type="button"
                              size="xs"
                              className="w-full cursor-pointer font-mono text-xs gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                              onClick={() => handleApply(brief)}
                              disabled={isAnimating}
                            >
                              {isAnimating ? (
                                <span className="flex items-center gap-1.5">
                                  <Check className="size-3.5" /> Memproses...
                                </span>
                              ) : (
                                <>
                                  <Zap className="size-3.5 text-indigo-200 fill-indigo-200" />
                                  <span>Execute: Terapkan Saran</span>
                                </>
                              )}
                            </Button>
                          </motion.div>
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
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-mono font-semibold ${TYPE_META[openBrief.type].badgeBg} ${TYPE_META[openBrief.type].badgeText}`}>
                  {TYPE_META[openBrief.type].icon}
                  <span>{TYPE_META[openBrief.type].code}</span>
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{openBrief.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              {openBrief.reasoning}
            </DialogDescription>
            <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 p-3.5">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Proyeksi Dampak Finansial
              </p>
              <p className={`mt-1 text-sm font-mono font-bold ${TYPE_META[openBrief.type].impactText}`}>
                {openBrief.estimated_impact}
              </p>
            </div>
          </>
        ) : null}
      </Dialog>
    </>
  )
}
