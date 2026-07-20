'use client'

import * as React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Lightbulb, MessageCircle, Mic } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { useKarsaState } from '@/hooks/use-karsa-state'
import { celebrate } from '@/lib/karsa/confetti'

import { AskKarsa } from './ask-karsa'
import { BriefSection } from './brief-section'
import { CaptureSection } from './capture-section'
import { FinancialDashboard } from './financial-dashboard'
import { HeroStatus } from './hero-status'
import { TopNav } from './top-nav'

function KarsaAppInner() {
  const karsa = useKarsaState()
  const { toast } = useToast()
  const [tab, setTab] = React.useState('catat')

  const handleSeed = () => {
    karsa.seedDemo()
    celebrate()
    toast({
      variant: 'success',
      title: 'Contoh Data Terisi!',
      description: '7 hari jurnal transaksi + 3 Executive Intelligence Brief siap dianalisis.',
    })
  }

  if (!karsa.hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 font-mono">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="size-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs">Menginisialisasi KarsaOS AI Copilot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <TopNav health={karsa.businessHealth} onSeed={handleSeed} />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <HeroStatus
          health={karsa.businessHealth}
          totals={karsa.totals}
          transactionCount={karsa.transactions.length}
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex w-full flex-wrap sm:w-auto">
            <TabsTrigger value="catat">
              <Mic className="size-3.5" />
              Catat
            </TabsTrigger>
            <TabsTrigger value="brief">
              <Lightbulb className="size-3.5" />
              Business Brief
            </TabsTrigger>
            <TabsTrigger value="keuangan">
              <BarChart3 className="size-3.5" />
              Keuangan
            </TabsTrigger>
            <TabsTrigger value="tanya">
              <MessageCircle className="size-3.5" />
              Ask Karsa
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {tab === 'catat' && (
              <TabsContent value="catat" key="catat">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                      <CaptureSection onCommit={karsa.addTransactions} />
                    </div>
                    <div className="lg:col-span-2">
                      <BriefSectionPreview
                        briefs={karsa.businessBriefs}
                        onSetStatus={karsa.setBriefStatus}
                        onSeeAll={() => setTab('brief')}
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            )}

            {tab === 'brief' && (
              <TabsContent value="brief" key="brief">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                      Executive Intelligence Briefing
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-mono">
                      Tiga rekomendasi strategis real-time: Peluang Growth, Mitigasi Risiko, dan Insight Operasional.
                    </p>
                  </div>
                  <BriefSection
                    briefs={karsa.businessBriefs}
                    onSetStatus={karsa.setBriefStatus}
                  />
                </motion.div>
              </TabsContent>
            )}

            {tab === 'keuangan' && (
              <TabsContent value="keuangan" key="keuangan">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <FinancialDashboard
                    transactions={karsa.transactions}
                    totals={karsa.totals}
                    onDelete={karsa.deleteTransaction}
                    onUpdate={karsa.updateTransaction}
                  />
                </motion.div>
              </TabsContent>
            )}

            {tab === 'tanya' && (
              <TabsContent value="tanya" key="tanya">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="mx-auto max-w-2xl"
                >
                  <AskKarsa state={karsa} />
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>

        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Image
              src="/karsaos.png"
              alt="KarsaOS Brand"
              width={20}
              height={20}
              className="object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="font-semibold text-slate-600 dark:text-slate-300">KarsaOS Executive AI Copilot</span>
          </div>
          <span>Enterprise Financial Intelligence. Local-first privacy architecture.</span>
        </footer>
      </main>
    </div>
  )
}

function BriefSectionPreview({
  briefs,
  onSetStatus,
  onSeeAll,
}: {
  briefs: ReturnType<typeof useKarsaState>['businessBriefs']
  onSetStatus: ReturnType<typeof useKarsaState>['setBriefStatus']
  onSeeAll: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight font-mono text-slate-900 dark:text-slate-100">
          Inteligensi Terbaru
        </h2>
        {briefs.length > 0 ? (
          <button
            type="button"
            onClick={onSeeAll}
            className="cursor-pointer font-mono text-xs font-semibold text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xs px-1"
          >
            Lihat semua
          </button>
        ) : null}
      </div>
      <BriefSection briefs={briefs.slice(0, 3)} onSetStatus={onSetStatus} stack />
    </div>
  )
}

export function KarsaApp() {
  return (
    <ToastProvider>
      <KarsaAppInner />
    </ToastProvider>
  )
}
