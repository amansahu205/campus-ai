'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, ExternalLink, ChevronUp } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { nightlifeData } from '@/lib/uip-data'

type TimeFilter = 'Tonight' | 'This Weekend' | 'Next Week'
const TIME_FILTERS: TimeFilter[] = ['Tonight', 'This Weekend', 'Next Week']

const VENUE_TYPE_COLORS: Record<string, string> = {
  Bar: '#6b7280',
  Club: '#8b5cf6',
  Lounge: '#3b82f6',
  Restaurant: '#f59e0b',
}

function VenueCard({ event }: { event: (typeof nightlifeData.UMD.tonight)[0] }) {
  const [expanded, setExpanded] = useState(false)
  const vtColor = VENUE_TYPE_COLORS[event.venueType] || '#6b7280'
  const isFree = event.cost === 'No Cover' || event.cost.toLowerCase().includes('free')

  return (
    <motion.div
      className="glass-night rounded-2xl p-5 flex flex-col gap-3 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,80,200,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      role="button"
      aria-expanded={expanded}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>{event.venue}</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: `${vtColor}28`, color: vtColor }}
            >
              {event.venueType}
            </span>
            {expanded && <ChevronUp size={14} style={{ color: '#6b7280' }} aria-hidden="true" />}
          </div>
          <h3 className="text-lg font-bold" style={{ color: '#f9fafb' }}>{event.eventName}</h3>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(139,92,246,0.18)', color: '#a78bfa' }}
        >
          {event.time.split(', ').slice(1).join(', ')}
        </span>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: isFree ? 'rgba(34,197,94,0.18)' : 'rgba(139,92,246,0.18)',
            color: isFree ? '#4ade80' : '#a78bfa',
          }}
        >
          {event.cost}
        </span>
      </div>

      {!expanded && (
        <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
          {event.description}
        </p>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              {event.description}
            </p>
            {(event as any).hours && (
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Venue operating hours tonight: {(event as any).hours}
              </p>
            )}
            <div className="flex gap-2 mt-1">
              <motion.button
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ background: '#7c3aed', color: '#fff' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                aria-label="Get directions"
              >
                <Navigation size={13} aria-hidden="true" />
                Get directions
              </motion.button>
              <motion.button
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.10)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.12)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                aria-label="View venue"
              >
                <ExternalLink size={13} aria-hidden="true" />
                View venue
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: '#6b7280' }} aria-hidden="true" />
          <span className="text-xs" style={{ color: '#6b7280' }}>{event.address}</span>
        </div>
        <span className="text-sm font-semibold" style={{ color: '#9ca3af' }}>{event.priceRange}</span>
      </div>
    </motion.div>
  )
}

export default function NightlifePage({ university }: { university: University }) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Tonight')

  const events =
    timeFilter === 'Tonight'
      ? nightlifeData[university].tonight
      : timeFilter === 'This Weekend'
      ? nightlifeData[university].thisWeekend
      : []

  return (
    <div
      className="flex flex-col gap-5 pb-8 min-h-full rounded-3xl p-6"
      style={{ background: 'rgba(10,8,30,0.6)', backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight">
          <span style={{ color: '#a78bfa' }}>Nightlife</span>
          <span style={{ color: '#e5e7eb' }}> near {university === 'UMD' ? 'UMD' : 'Michigan'}</span>
        </h1>
      </div>

      {/* Time tabs */}
      <div className="flex items-center justify-center border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {TIME_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className="px-6 py-2 text-sm font-medium relative"
            style={{ color: timeFilter === f ? '#e5e7eb' : '#6b7280' }}
            aria-selected={timeFilter === f}
          >
            {f}
            {timeFilter === f && (
              <motion.div
                layoutId="nightlife-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: '#8b5cf6' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Events grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: '#6b7280' }}>No events found for this time period.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {events.map((ev) => (
            <VenueCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  )
}
