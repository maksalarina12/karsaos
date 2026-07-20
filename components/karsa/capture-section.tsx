'use client'

import * as React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Cpu,
  Loader2,
  Mic,
  MicOff,
  Pencil,
  Sparkles,
  Terminal,
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

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
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
  const baseTextRef = React.useRef<string>('')
  const countdownRef = React.useRef<number | null>(null)

  // Check browser Web Speech API availability on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const Ctor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!Ctor) {
      setSupported(false)
    }
  }, [])

  // Cleanup speech recognition on unmount
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // Ignore abort errors on cleanup
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (typeof window === 'undefined') return

    const Ctor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!Ctor) {
      setSupported(false)
      toast({
        variant: 'warning',
        title: 'Browser Tidak Mendukung',
        description: 'Fitur rekam suara memerlukan Google Chrome atau browser berbasis Chromium.',
      })
      return
    }

    // If currently recording, stop it manually
    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        setListening(false)
      }
      return
    }

    // Save initial text baseline before recording starts
    baseTextRef.current = text.trim()

    try {
      const recognition: SpeechRecognitionLike = new Ctor()
      recognition.lang = 'id-ID'
      recognition.continuous = false
      recognition.interimResults = true

      // Lifecycle Handlers
      recognition.onstart = () => {
        setListening(true)
      }

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        
        const base = baseTextRef.current
        const newText = base
          ? `${base} ${transcript}`.replace(/\s+/g, ' ')
          : transcript.trim()
        
        setText(newText)
      }

      recognition.onerror = (event: any) => {
        setListening(false)
        const error = event?.error

        if (error === 'not-allowed' || error === 'service-not-allowed') {
          toast({
            variant: 'destructive',
            title: 'Akses Mikrofon Ditolak',
            description: 'Izinkan akses mikrofon di pengaturan browser untuk menggunakan rekam suara.',
          })
        } else if (error === 'no-speech') {
          toast({
            variant: 'warning',
            title: 'Suara Tidak Terdeteksi',
            description: 'Tidak ada suara terdengar. Coba bicara lebih dekat ke mikrofon.',
          })
        } else if (error === 'network') {
          toast({
            variant: 'destructive',
            title: 'Koneksi Terputus',
            description: 'Fitur suara memerlukan koneksi internet aktif.',
          })
        } else if (error === 'audio-capture') {
          toast({
            variant: 'destructive',
            title: 'Mikrofon Tidak Ditemukan',
            description: 'Perangkat mikrofon tidak terdeteksi atau terputus.',
          })
        } else if (error !== 'aborted') {
          toast({
            variant: 'warning',
            title: 'Perekaman Terhenti',
            description: `Terjadi kendala pada pengenalan suara (${error}).`,
          })
        }
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      setListening(false)
      toast({
        variant: 'destructive',
        title: 'Gagal Memulai Rekaman',
        description: err?.message || 'Pastikan izin mikrofon telah diberikan.',
      })
    }
  }

  const handleProcess = () => {
    if (!text.trim() || processing) return
    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        setListening(false)
      }
    }
    setProcessing(true)
    window.setTimeout(() => {
      const parsed = parseStory(text)
      setProcessing(false)
      if (parsed.length === 0) {
        toast({
          variant: 'warning',
          title: 'Format Angka Tidak Terdeteksi',
          description:
            'Sebutkan nominal dengan jelas, cth: “Laku nasi goreng 3 porsi 45rb, beli minyak 20rb”.',
        })
        return
      }
      setPreview(parsed)
      setCountdown(UNDO_SECONDS)
    }, 1200)
  }

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
      title: 'Transaksi berhasil dicatat',
      description: `${preview.length} transaksi berhasil dicatat.`,
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
      description: 'Teks transaksi tetap tersimpan untuk diedit kembali.',
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
    <Card className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
          <Image
            src="/karsaos.png"
            alt="KarsaOS Brand"
            width={20}
            height={20}
            className="object-contain"
          />
          <span>Pencatatan Transaksi</span>
        </CardTitle>
        <p className="text-xs text-slate-500">
          Input transaksi melalui rekaman suara atau pengetikan teks untuk dicatat otomatis ke jurnal.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Futuristic Waveform & Mic Capture UI */}
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-950/50 p-6 text-center">
          <div className="relative">
            {listening && (
              <>
                <motion.span
                  className="absolute -inset-3 rounded-full bg-indigo-500/25 blur-md"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.95, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  className="absolute -inset-6 rounded-full border border-indigo-500/50"
                  animate={{ scale: [1, 1.45, 1], opacity: [0.9, 0, 0.9] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            )}
            <motion.button
              type="button"
              onClick={toggleListening}
              disabled={!supported}
              whileTap={{ scale: 0.94 }}
              aria-pressed={listening}
              aria-label={listening ? 'Berhenti merekam suara' : 'Mulai merekam suara'}
              className={`relative flex size-16 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                listening
                  ? 'bg-rose-600 ring-4 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-500/20'
              }`}
            >
              {listening ? (
                <MicOff className="size-7" />
              ) : (
                <Mic className="size-7" />
              )}
            </motion.button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">
              {listening ? (
                <span className="text-rose-600 dark:text-rose-400 animate-pulse">
                  🔴 Sedang Mendengarkan... (Klik untuk berhenti)
                </span>
              ) : (
                'Klik Mic untuk Rekam Suara'
              )}
            </p>
            <p className="text-[11px] font-mono text-slate-400">
              Contoh: “Barusan laku nasi goreng 3 porsi 45rb, beli es batu 10rb”
            </p>
          </div>

          {!supported ? (
            <Badge variant="neutral" className="text-[10px] font-mono border-amber-300/80 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
              Gunakan Chrome untuk fitur suara
            </Badge>
          ) : null}
        </div>

        {/* Sleek Command Bar Text Input */}
        <div className="relative">
          <div className="absolute left-3 top-3.5 text-slate-400">
            <Terminal className="size-4 text-indigo-500" />
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Atau ketik perintah / cerita bisnis di sini..."
            className="min-h-24 pl-9 text-xs font-mono cursor-pointer border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 focus-visible:ring-2 focus-visible:ring-indigo-500 placeholder:text-slate-400"
          />
        </div>

        <Button
          size="sm"
          onClick={handleProcess}
          disabled={!text.trim() || processing}
          className="gap-2 self-start cursor-pointer font-mono text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
        >
          {processing ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              AI Memproses Transaksi...
            </>
          ) : (
            <>
              <Sparkles className="size-3.5 text-indigo-200" />
              Ekstrak Transaksi dengan AI
            </>
          )}
        </Button>

        {/* AI Parsed Confirmation Preview */}
        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/60 dark:border-indigo-800/60 pb-2.5">
                  <p className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200">
                    <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Ekstraksi AI Berhasil ({preview.length} Entri)</span>
                  </p>
                  <span className="rounded-md bg-indigo-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                    Auto-commit in {countdown}s
                  </span>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                  {preview.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-2.5 shadow-2xs text-xs font-mono"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {t.item_name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t.category} · Confidence: {Math.round(t.confidence_score * 100)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tabular-nums border ${
                            t.type === 'revenue'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'text-rose-700 bg-rose-50 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400'
                          }`}
                        >
                          {t.type === 'revenue' ? '+' : '-'}
                          {formatRupiah(t.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Hapus baris"
                          onClick={() => removePreviewRow(t.id)}
                          className="cursor-pointer text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap gap-2 pt-1">
                  <Button onClick={confirmPreview} size="xs" className="gap-1.5 cursor-pointer font-mono text-xs bg-indigo-600 text-white">
                    <Check className="size-3.5" />
                    Simpan Sekarang
                  </Button>
                  <Button variant="outline" size="xs" onClick={undoPreview} className="gap-1.5 cursor-pointer font-mono text-xs border-slate-300">
                    <Undo2 className="size-3.5" />
                    Edit Cerita
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
