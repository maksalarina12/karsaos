'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Loader2,
  Mic,
  MicOff,
  Pencil,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { formatRupiah, parseStory } from '@/lib/karsa/logic'
import type { Transaction } from '@/lib/karsa/types'

interface CaptureSectionProps {
  onCommit: (transactions: Transaction[]) => void
}

// Minimal typing for the vendor-prefixed Web Speech API.
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

const UNDO_SECONDS = 5

export function CaptureSection({ onCommit }: CaptureSectionProps) {
  const { toast } = useToast()
  const [text, setText] = React.useState('')
  const [listening, setListening] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [preview, setPreview] = React.useState<Transaction[] | null>(null)
  const [countdown, setCountdown] = React.useState(UNDO_SECONDS)
  const [supported, setSupported] = React.useState(true)

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null)
  const countdownRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const Ctor =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!Ctor) {
      setSupported(false)
      return
    }
    const recognition: SpeechRecognitionLike = new Ctor()
    recognition.lang = 'id-ID'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText((prev) => {
        // Replace only the interim tail for a clean live transcript.
        const base = prev.endsWith(' ') || prev === '' ? prev : prev + ' '
        return (base + transcript).replace(/\s+/g, ' ').trimStart()
      })
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    return () => recognition.stop()
  }, [])

  const toggleListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    if (listening) {
      recognition.stop()
      setListening(false)
      return
    }
    try {
      recognition.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }

  const handleProcess = () => {
    if (!text.trim() || processing) return
    if (listening) toggleListening()
    setProcessing(true)
    // Simulate AI understanding the story.
    window.setTimeout(() => {
      const parsed = parseStory(text)
      setProcessing(false)
      if (parsed.length === 0) {
        toast({
          variant: 'warning',
          title: 'Belum kebaca angkanya',
          description:
            'Coba sebutkan nominalnya, cth: “laku nasi goreng 3 porsi 45rb”.',
        })
        return
      }
      setPreview(parsed)
      setCountdown(UNDO_SECONDS)
    }, 1500)
  }

  // Auto-commit countdown while preview is showing.
  React.useEffect(() => {
    if (!preview) return
    if (countdown <= 0) {
      confirmPreview()
      return
    }
    countdownRef.current = window.setTimeout(
      () => setCountdown((c) => c - 1),
      1000,
    )
    return () => {
      if (countdownRef.current) window.clearTimeout(countdownRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, countdown])

  const confirmPreview = () => {
    if (!preview) return
    onCommit(preview)
    toast({
      variant: 'success',
      title: 'Tersimpan!',
      description: `${preview.length} transaksi masuk ke catatan warungmu.`,
    })
    setPreview(null)
    setText('')
    setCountdown(UNDO_SECONDS)
  }

  const undoPreview = () => {
    if (countdownRef.current) window.clearTimeout(countdownRef.current)
    setPreview(null)
    setCountdown(UNDO_SECONDS)
    toast({
      variant: 'info',
      title: 'Dibatalkan',
      description: 'Ceritamu masih tersimpan di kotak teks untuk diedit.',
    })
  }

  const removePreviewRow = (id: string) => {
    setPreview((prev) => {
      if (!prev) return prev
      const next = prev.filter((t) => t.id !== id)
      return next.length > 0 ? next : null
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="size-5 text-primary" />
          Cerita Bisnis Tanpa Ribet
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ceritakan aktivitas warung pakai suara atau ketik santai. KarsaOS yang
          rapikan jadi catatan.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-6 text-center">
          <motion.button
            type="button"
            onClick={toggleListening}
            disabled={!supported}
            whileTap={{ scale: 0.94 }}
            aria-pressed={listening}
            className={`relative flex size-20 items-center justify-center rounded-full text-primary-foreground transition-colors disabled:opacity-50 ${
              listening ? 'bg-risk' : 'bg-primary'
            }`}
          >
            {listening ? (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-risk/40" />
                <MicOff className="size-8" />
              </>
            ) : (
              <Mic className="size-8" />
            )}
          </motion.button>
          <p className="text-sm font-medium">
            {listening
              ? 'Mendengarkan... ceritakan transaksimu'
              : 'Mulai Rekam Cerita Bisnis'}
          </p>
          {!supported ? (
            <Badge variant="warning">
              Browser belum dukung rekam suara — silakan ketik di bawah
            </Badge>
          ) : null}
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Atau ketik santai di sini (cth: barusan laku nasi goreng 3 porsi 45rb, beli gas elpiji 30rb)..."
          className="min-h-28"
        />

        <Button
          size="lg"
          onClick={handleProcess}
          disabled={!text.trim() || processing}
          className="gap-2 self-start"
        >
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              AI sedang memahami cerita bisnismu...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Proses dengan AI
            </>
          )}
        </Button>

        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" />
                    Cek dulu, sudah benar?
                  </p>
                  <Badge variant="default">
                    Simpan otomatis dalam {countdown}s
                  </Badge>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                  {preview.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {t.item_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.category} · keyakinan{' '}
                          {Math.round(t.confidence_score * 100)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={t.type === 'revenue' ? 'success' : 'risk'}>
                          {t.type === 'revenue' ? 'Masuk' : 'Keluar'}{' '}
                          {formatRupiah(t.amount)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Hapus baris"
                          onClick={() => removePreviewRow(t.id)}
                        >
                          <Trash2 className="size-4 text-risk" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button onClick={confirmPreview} className="gap-1.5">
                    <Check className="size-4" />
                    Simpan Sekarang
                  </Button>
                  <Button variant="outline" onClick={undoPreview} className="gap-1.5">
                    <Undo2 className="size-4" />
                    Batalkan / Edit
                  </Button>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Pencil className="size-3" />
                    Batalkan untuk mengubah teks
                  </span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
