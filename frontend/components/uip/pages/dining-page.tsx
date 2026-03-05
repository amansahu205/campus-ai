'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { diningHalls } from '@/lib/uip-data'

type Filter = 'All Halls' | 'Open Now' | 'Breakfast' | 'Lunch' | 'Dinner'
const FILTERS: Filter[] = ['All Halls', 'Open Now', 'Breakfast', 'Lunch', 'Dinner']

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  V: { bg: '#dcfce7', color: '#16a34a' },
  G: { bg: '#fef9c3', color: '#ca8a04' },
  D: { bg: '#dbeafe', color: '#2563eb' },
  S: { bg: '#fce7f3', color: '#db2777' },
  E: { bg: '#f3e8ff', color: '#9333ea' },
}

function DietaryTag({ tag }: { tag: string }) {
  const c = TAG_COLORS[tag] || { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold flex-shrink-0"
      style={{ background: c.bg, color: c.color }}
      title={tag}
    >
      {tag}
    </span>
  )
}

function HallCard({ hall }: { hall: (typeof diningHalls.UMD)[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="glass rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="text-base font-bold"
            style={{ color: '#E03A3E' }}
          >
            {hall.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: hall.status === 'open' ? '#16a34a' : '#dc2626',
                color: '#fff',
              }}
            >
              {hall.status === 'open' ? 'Open' : 'Closed'}
            </span>
            <span className="text-sm" style={{ color: '#555' }}>
              {hall.status === 'open' ? `Closes ${hall.closesAt}` : `Opens ${(hall as any).opensAt}`}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm" style={{ color: '#666' }}>{hall.currentMeal}</p>

      {/* Highlights */}
      {hall.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hall.highlights.map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#555' }}
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Expandable stations */}
      {hall.stations.length > 0 && (
        <>
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {hall.stations.map((station) => (
                  <div key={station.name}>
                    <p className="text-xs font-bold mb-1.5" style={{ color: '#333' }}>{station.name}</p>
                    <div className="flex flex-col gap-1">
                      {station.items.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: '#444' }}>{item.name}</span>
                          <div className="flex gap-1">
                            {item.tags.map((t) => <DietaryTag key={t} tag={t} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs" style={{ color: '#bbb' }}>Updated {hall.updatedAgo}</span>
        {hall.stations.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs"
            style={{ color: '#999' }}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function DiningPage({ university }: { university: University }) {
  const [filter, setFilter] = useState<Filter>('All Halls')
  const halls = diningHalls[university]

  const filtered = halls.filter((h) => {
    if (filter === 'All Halls') return true
    if (filter === 'Open Now') return h.status === 'open'
    if (filter === 'Lunch') return h.currentMeal.toLowerCase().includes('lunch')
    if (filter === 'Dinner') return h.currentMeal.toLowerCase().includes('dinner')
    return true
  })

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: '#999' }}>
        <span>Campus AI</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a', fontWeight: 600 }}>Dining</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            style={{
              background: filter === f ? '#E03A3E' : 'rgba(255,255,255,0.7)',
              color: filter === f ? '#fff' : '#555',
              border: filter === f ? '1px solid #E03A3E' : '1px solid rgba(0,0,0,0.10)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={filter === f}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((hall) => (
          <HallCard key={hall.id} hall={hall as any} />
        ))}
      </div>
    </div>
  )
}
