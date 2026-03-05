'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react'
import { chatSuggestions, getMockResponse } from '@/lib/uip-data'
import type { University } from '@/lib/uip-data'
import dynamic from 'next/dynamic'

const SparkleIcon = dynamic(() => import('./sparkle-icon'), { ssr: false })

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: string[]
}

interface AskUIPTabProps {
  university: University
}

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onDone?.()
      }
    }, 12)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse align-middle" aria-hidden="true" />}
    </span>
  )
}

export default function AskUIPTab({ university }: AskUIPTabProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 600))

    const { text: responseText, sources } = getMockResponse(text)
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: responseText,
      sources,
    }
    setMessages((prev) => [...prev, assistantMsg])
    setIsLoading(false)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full max-w-[760px] mx-auto">
      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center gap-3 py-16"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-balance leading-tight" style={{ color: '#0d0d0d' }}>
                What do you want to know about{' '}
                <span style={{ color: '#E03A3E' }}>
                  {university === 'UMD' ? 'UMD' : 'Michigan'}
                </span>?
              </h2>
              <p className="text-sm" style={{ color: '#888' }}>
                Ask about dining, events, scores, campus life — anything.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {msg.role === 'user' ? (
              <div
                className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium max-w-[80%]"
                style={{
                  background: 'rgba(224,58,62,0.10)',
                  border: '1px solid rgba(224,58,62,0.18)',
                  color: '#1a1a1a',
                }}
              >
                {msg.text}
              </div>
            ) : (
              <div
                className="glass rounded-2xl rounded-tl-sm p-4 max-w-[90%] flex flex-col gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <SparkleIcon isTyping={false} />
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#1a1a1a' }}>
                    <TypewriterText text={msg.text} />
                  </p>
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pl-9">
                    {msg.sources.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(224,58,62,0.09)',
                          border: '1px solid rgba(224,58,62,0.18)',
                          color: '#E03A3E',
                        }}
                      >
                        • {s}
                      </span>
                    ))}
                    <div className="ml-auto flex gap-1">
                      <button className="p-1 rounded-lg hover:bg-black/5 transition-colors" aria-label="Thumbs up">
                        <ThumbsUp size={13} style={{ color: '#bbb' }} aria-hidden="true" />
                      </button>
                      <button className="p-1 rounded-lg hover:bg-black/5 transition-colors" aria-label="Thumbs down">
                        <ThumbsDown size={13} style={{ color: '#bbb' }} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
              <SparkleIcon isTyping />
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#E03A3E' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="pb-4 flex flex-col gap-3">
        {/* Suggestion chips */}
        {messages.length === 0 && (
          <div className="flex items-center gap-2.5 flex-wrap justify-center px-1 pb-1">
            {chatSuggestions.map((s) => (
              <motion.button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(0,0,0,0.09)',
                  color: '#444',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.95)' }}
                whileTap={{ scale: 0.96 }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}
        {/* Input row with char count */}
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-xs ml-auto" style={{ color: '#ccc' }}>
            {input.length} / 500
          </span>
        </div>

        {/* Input field */}
        <motion.div
          className="glass-strong flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ border: isTyping ? '1px solid rgba(224,58,62,0.35)' : '1px solid rgba(255,255,255,0.55)' }}
          animate={{ boxShadow: isTyping ? '0 0 0 3px rgba(224,58,62,0.08)' : '0 0 0 0px rgba(224,58,62,0)' }}
          transition={{ duration: 0.2 }}
        >
          <SparkleIcon isTyping={isTyping} />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setIsTyping(e.target.value.length > 0)
            }}
            onBlur={() => setIsTyping(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
                setIsTyping(false)
              }
            }}
            placeholder={`Ask anything about ${university === 'UMD' ? 'UMD' : 'Michigan'}...`}
            maxLength={500}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            style={{ color: '#1a1a1a' }}
            aria-label="Ask Campus AI a question"
          />
          <motion.button
            onClick={() => { sendMessage(input); setIsTyping(false) }}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            style={{
              background: input.trim() ? '#E03A3E' : 'rgba(0,0,0,0.06)',
              color: input.trim() ? '#fff' : '#bbb',
            }}
            whileHover={input.trim() ? { scale: 1.08 } : {}}
            whileTap={input.trim() ? { scale: 0.94 } : {}}
            aria-label="Send message"
          >
            <ArrowRight size={16} aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
