'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, SendHorizontal, Sparkles } from 'lucide-react'

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
        'Halo! Aku Karsa, copilot warungmu. Tanya apa saja soal kondisi bisnismu — jawabanku selalu berdasarkan data yang tersimpan.',
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
    }, 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <Card className="flex h-[540px] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" />
          Ask Karsa
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tanya jawab santai soal bisnismu, dijawab berdasarkan datamu.
        </p>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-muted text-foreground'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <AnimatePresence>
            {thinking ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Karsa lagi mikir...
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={thinking}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pertanyaanmu di sini..."
          />
          <Button
            size="icon-lg"
            aria-label="Kirim pertanyaan"
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
