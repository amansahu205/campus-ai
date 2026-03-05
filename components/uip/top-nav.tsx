'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Circle } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { UNIVERSITIES } from '@/lib/uip-data'

interface TopNavProps {
  university: University
  onUniversityChange: (u: University) => void
}

const UNIVERSITY_COLORS: Record<University, string> = {
  UMD: '#E03A3E',
  Michigan: '#00274C',
}

const UNIVERSITY_LABELS: Record<University, string> = {
  UMD: 'UMD',
  Michigan: 'Michigan',
}

export default function TopNav({ university, onUniversityChange }: TopNavProps) {
  const [open, setOpen] = useState(false)

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <header
      className="glass fixed top-0 left-[180px] right-0 z-30 flex items-center justify-between px-6"
      style={{
        height: '52px',
        borderBottom: '1px solid rgba(255,255,255,0.45)',
      }}
    >
      {/* Spacer */}
      <div className="flex-1" />

      {/* University picker — centered */}
      <div className="relative">
        <motion.button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.55)',
            color: '#1a1a1a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          whileTap={{ scale: 0.97 }}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <Circle
            size={8}
            className="fill-current"
            style={{ color: UNIVERSITY_COLORS[university] }}
            aria-hidden="true"
          />
          {UNIVERSITY_LABELS[university]}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} aria-hidden="true" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              className="glass-strong absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden min-w-[160px] z-50"
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              role="listbox"
              aria-label="Select university"
            >
              {UNIVERSITIES.map((u) => (
                <motion.button
                  key={u}
                  onClick={() => { onUniversityChange(u); setOpen(false) }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-white/40 transition-colors"
                  style={{ color: university === u ? UNIVERSITY_COLORS[u] : '#333' }}
                  whileHover={{ x: 2 }}
                  role="option"
                  aria-selected={university === u}
                >
                  <Circle
                    size={8}
                    className="fill-current flex-shrink-0"
                    style={{ color: UNIVERSITY_COLORS[u] }}
                    aria-hidden="true"
                  />
                  {UNIVERSITY_LABELS[u]}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date/time */}
      <div className="flex-1 flex justify-end">
        <div className="text-right">
          <p className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{dateStr}</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{timeStr} EST</p>
        </div>
      </div>
    </header>
  )
}
