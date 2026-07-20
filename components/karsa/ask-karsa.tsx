'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cpu, Lightbulb, SendHorizontal, Sparkles, Terminal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { answerQuestion, SUGGESTIONS } from '@/lib/karsa/assistant'
import { uid } from '@/lib/karsa/logic'
import type { ChatMessage, KarsaState } from '@/lib/karsa/types'

interface AskKarsaProps {
  state: KarsaState
}

export function AskKarsa({ state }: AskKarsaProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Halo! Saya Karsa, Executive AI Financial Copilot. Tanyakan analisis bisnis, proyeksi laba, atau status stok — jawaban disusun secara real-time berdasarkan data warungmu.',
    },
  ])
  const [input, setInput] = React.useState('')
  const [thinking, setThinking] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    const userMsg: ChatMessage = { id: uid('msg'), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    window.setTimeout(() => {
      const reply = answerQuestion(trimmed, state)
      setMessages((prev) => [
        ...prev,
        { id: uid('msg'), role: 'assistant', content: reply },
      ])
      setThinking(false)
    }, 850)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <Card className="flex h-[540px] max-h-[85vh] flex-col border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
            <Cpu className="size-4" />
          </div>
          <span>Ask Karsa — AI Copilot</span>
          <span className="ml-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 border border-emerald-200/60">
            ONLINE
          </span>
        </CardTitle>
        <p className="text-xs text-slate-500 font-mono">
          Model: KarsaOS Grounded RAG Intelligence
        </p>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        {/* Messages Log */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[88%] sm:max-w-[82%]">
                {m.role === 'assistant' && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs mt-0.5">
                    <Sparkles className="size-3.5" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-tr-xs bg-indigo-600 text-white font-mono shadow-xs'
                      : 'rounded-tl-xs border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 shadow-2xs'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mb-1 border-b border-slate-200/40 dark:border-slate-800 pb-1">
                      <Terminal className="size-3" />
                      <span>KARSA AI EXECUTIVE REPORT:</span>
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}

          {/* 3 Animated Typing Indicator Dots */}
          <AnimatePresence>
            {thinking ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 rounded-xl rounded-tl-xs border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80 px-3.5 py-2.5 text-xs font-mono text-slate-500">
                  <div className="flex size-5 items-center justify-center rounded-md bg-indigo-600 text-white">
                    <Cpu className="size-3" />
                  </div>
                  <span>Karsa AI sedang menganalisis titik data</span>
                  <div className="flex items-center gap-1 ml-1">
                    {[0, 1, 2].map((dotIndex) => (
                      <motion.span
                        key={dotIndex}
                        className="size-1 rounded-full bg-indigo-500"
                        animate={{
                          y: [0, -4, 0],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: dotIndex * 0.16,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Suggested Command Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => send(s)}
              disabled={thinking}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 px-2.5 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 transition-all duration-200 hover:border-indigo-500/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
            >
              <Lightbulb className="size-3 text-indigo-500" />
              <span>{s}</span>
            </motion.button>
          ))}
        </div>

        {/* AI Command Bar Input */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan bisnis atau analisis..."
            className="cursor-pointer border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 text-xs font-mono transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              size="icon-lg"
              aria-label="Kirim pertanyaan"
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
