'use client'

import { motion } from 'framer-motion'
import { UtensilsCrossed, Calendar, Zap, Moon } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { statusBarData } from '@/lib/uip-data'

interface StatusBarProps {
  university: University
  onSegmentClick?: (page: string) => void
}

export default function StatusBar({ university, onSegmentClick }: StatusBarProps) {
  const data = statusBarData[university]

  const segments = [
    {
      icon: UtensilsCrossed,
      label: data.dining.label,
      detail: data.dining.detail,
      page: 'dining',
      color: '#22c55e',
      isLive: false,
    },
    {
      icon: Calendar,
      label: data.events.label,
      detail: data.events.detail,
      page: 'events',
      color: '#3b82f6',
      isLive: false,
    },
    ...(data.live
      ? [{
          icon: Zap,
          label: data.live.label,
          detail: null,
          page: 'athletics',
          color: '#E03A3E',
          isLive: true,
        }]
      : []),
    {
      icon: Moon,
      label: data.nightlife.label,
      detail: data.nightlife.detail,
      page: 'nightlife',
      color: '#8b5cf6',
      isLive: false,
    },
  ]

  return (
    <motion.div
      className="glass rounded-2xl p-3 flex items-center gap-2 flex-wrap"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {segments.map((seg, i) => {
        const Icon = seg.icon
        return (
          <motion.button
            key={i}
            onClick={() => onSegmentClick?.(seg.page)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex-shrink-0"
            style={{
              background: seg.isLive ? 'rgba(224,58,62,0.10)' : 'rgba(255,255,255,0.5)',
              border: seg.isLive ? '1px solid rgba(224,58,62,0.25)' : '1px solid rgba(255,255,255,0.5)',
              color: seg.isLive ? '#E03A3E' : '#333',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {seg.isLive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#E03A3E] live-pulse flex-shrink-0" aria-hidden="true" />
            )}
            <Icon size={12} style={{ color: seg.color }} aria-hidden="true" />
            <span>{seg.label}</span>
            {seg.detail && (
              <span style={{ color: '#999' }}>{seg.detail}</span>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
