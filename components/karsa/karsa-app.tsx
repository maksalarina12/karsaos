'use client'

import * as React from 'react'
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
      title: 'Contoh data warung dimuat!',
      description: '7 hari transaksi + 3 Business Brief siap kamu jelajahi.',
    })
  }

  if (!karsa.hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Menyiapkan KarsaOS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Mic className="size-4" />
              Catat
            </TabsTrigger>
            <TabsTrigger value="brief">
              <Lightbulb className="size-4" />
              Business Brief
            </TabsTrigger>
            <TabsTrigger value="keuangan">
              <BarChart3 className="size-4" />
              Keuangan
            </TabsTrigger>
            <TabsTrigger value="tanya">
              <MessageCircle className="size-4" />
              Ask Karsa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catat">
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
          </TabsContent>

          <TabsContent value="brief">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Business Brief Hari Ini
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tiga saran yang bisa langsung kamu ambil: Peluang, Risiko, dan
                  Insight — lengkap dengan alasan datanya.
                </p>
              </div>
              <BriefSection
                briefs={karsa.businessBriefs}
                onSetStatus={karsa.setBriefStatus}
              />
            </div>
          </TabsContent>

          <TabsContent value="keuangan">
            <FinancialDashboard
              transactions={karsa.transactions}
              totals={karsa.totals}
              onDelete={karsa.deleteTransaction}
              onUpdate={karsa.updateTransaction}
            />
          </TabsContent>

          <TabsContent value="tanya">
            <div className="mx-auto max-w-2xl">
              <AskKarsa state={karsa} />
            </div>
          </TabsContent>
        </Tabs>

        <footer className="border-t border-border pt-5 text-center text-xs text-muted-foreground">
          KarsaOS — Business Copilot untuk UMKM Indonesia. Data tersimpan aman di
          perangkatmu (localStorage).
        </footer>
      </main>
    </div>
  )
}

// Compact preview shown alongside the capture form.
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
        <h2 className="text-base font-bold tracking-tight">Brief Terbaru</h2>
        {briefs.length > 0 ? (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-medium text-primary hover:underline"
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
