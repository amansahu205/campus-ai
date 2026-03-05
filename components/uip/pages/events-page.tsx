'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, CalendarPlus, ExternalLink } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { eventsData } from '@/lib/uip-data'

type DateFilter = 'Today' | 'Tomorrow' | 'This Week' | 'This Weekend'
type CategoryFilter = 'All' | 'Academic' | 'Social' | 'Athletics' | 'Arts' | 'Career'
type SourceFilter = 'All' | 'Main Calendar' | 'TerpLink'

const DATE_FILTERS: DateFilter[] = ['Today', 'Tomorrow', 'This Week', 'This Weekend']
const CATEGORY_FILTERS: CategoryFilter[] = ['All', 'Academic', 'Social', 'Athletics', 'Arts', 'Career']
const SOURCE_FILTERS: SourceFilter[] = ['All', 'Main Calendar', 'TerpLink']

const CATEGORY_COLORS: Record<string, string> = {
  Academic: '#3b82f6',
  Social: '#10b981',
  Athletics: '#E03A3E',
  Arts: '#f59e0b',
  Career: '#8b5cf6',
}

function EventCard({ event, selected, onSelect }: {
  event: (typeof eventsData.UMD)[0]
  selected: boolean
  onSelect: () => void
}) {
  const catColor = CATEGORY_COLORS[event.category] || '#6b7280'
  return (
    <motion.div
      className="glass rounded-2xl p-5 flex flex-col gap-3 cursor-pointer"
      onClick={onSelect}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{ outline: selected ? `2px solid ${catColor}` : 'none' }}
      role="button"
      aria-expanded={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-balance flex-1" style={{ color: '#0d0d0d' }}>
          {event.title}
        </h3>
        <motion.button
          onClick={(e) => { e.stopPropagation() }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0"
          style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.18)' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Add to calendar"
        >
          <CalendarPlus size={12} aria-hidden="true" />
          Add to calendar
        </motion.button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: catColor, color: '#fff' }}
        >
          {event.date}, {event.time}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{ background: 'rgba(0,0,0,0.05)', color: '#666' }}
        >
          {event.source}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#666' }}>
        <MapPin size={13} aria-hidden="true" />
        {event.location}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-col gap-3 pt-1"
        >
          <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{event.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs" style={{ color: '#888' }}>
                <span className="font-semibold">Category:</span> {event.category}
              </p>
            </div>
            <button
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: '#E03A3E' }}
              aria-label="View original event"
            >
              View original event <ExternalLink size={11} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function EventsPage({ university }: { university: University }) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('Today')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('All')
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const events = eventsData[university].filter((e) => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false
    if (sourceFilter === 'Main Calendar' && e.source !== 'Main Cal') return false
    if (sourceFilter === 'TerpLink' && e.source !== 'TerpLink') return false
    return true
  })

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>
          Events — {university === 'UMD' ? 'University of Maryland' : 'University of Michigan'}
        </h1>
        <p className="text-sm" style={{ color: '#999' }}>{eventsData[university].length} events this week</p>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-6">
        {/* Sidebar filters */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: '#333' }}>Date</p>
            {DATE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm mb-1 text-left"
                style={{
                  background: dateFilter === f ? 'rgba(59,130,246,0.10)' : 'transparent',
                  color: dateFilter === f ? '#3b82f6' : '#555',
                  fontWeight: dateFilter === f ? 600 : 400,
                }}
                aria-pressed={dateFilter === f}
              >
                {dateFilter === f && (
                  <span className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                )}
                {dateFilter !== f && <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" aria-hidden="true" />}
                {f}
              </button>
            ))}
          </div>

          <div>
            <p className="text-sm font-bold mb-2" style={{ color: '#333' }}>Category</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setCategoryFilter(f)}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    background: categoryFilter === f ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                    color: categoryFilter === f ? '#fff' : '#555',
                    border: categoryFilter === f ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)',
                  }}
                  aria-pressed={categoryFilter === f}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold mb-2" style={{ color: '#333' }}>Source</p>
            {SOURCE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setSourceFilter(f)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm mb-1 text-left"
                style={{
                  background: sourceFilter === f ? 'rgba(59,130,246,0.10)' : 'transparent',
                  color: sourceFilter === f ? '#3b82f6' : '#555',
                  fontWeight: sourceFilter === f ? 600 : 400,
                }}
                aria-pressed={sourceFilter === f}
              >
                {sourceFilter === f && (
                  <span className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                )}
                {sourceFilter !== f && <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" aria-hidden="true" />}
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-2 gap-4">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              selected={selectedEvent === ev.id}
              onSelect={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
