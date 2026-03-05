'use client'

import { motion } from 'framer-motion'
import { ArrowRight, UtensilsCrossed, Calendar, Trophy, Moon, Newspaper, MapPin } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { diningHalls, eventsData, athleticsData, nightlifeData, newsData } from '@/lib/uip-data'

type Page = 'dining' | 'events' | 'athletics' | 'nightlife' | 'news'

interface WidgetCardsProps {
  university: University
  onNavigate: (page: Page) => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, type: 'spring', stiffness: 280, damping: 26 },
  }),
}

function SectionHeader({ label, page, onNavigate, icon: Icon }: {
  label: string
  page: Page
  onNavigate: (p: Page) => void
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <Icon size={11} style={{ color: '#999' }} aria-hidden="true" />
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#999' }}>{label}</span>
      </div>
      <motion.button
        onClick={() => onNavigate(page)}
        className="flex items-center gap-1 text-xs font-medium"
        style={{ color: '#E03A3E' }}
        whileHover={{ x: 2 }}
        aria-label={`See all ${label}`}
      >
        See all <ArrowRight size={11} aria-hidden="true" />
      </motion.button>
    </div>
  )
}

// ---- DINING WIDGET ----
function DiningWidget({ university, onNavigate }: { university: University; onNavigate: (p: Page) => void }) {
  const halls = diningHalls[university].slice(0, 3)
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex flex-col gap-3"
      variants={cardVariants}
      custom={0}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <SectionHeader label="Dining" page="dining" onNavigate={onNavigate} icon={UtensilsCrossed} />
      <p className="text-xs" style={{ color: '#999' }}>{halls.filter(h => h.status === 'open').length} halls tracked · Updated {halls[0]?.updatedAgo}</p>
      <div className="flex flex-col gap-2">
        {halls.map((hall) => (
          <div key={hall.id} className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate" style={{ color: '#1a1a1a' }}>{hall.name}</span>
              <span className="text-xs" style={{ color: '#888' }}>
                {hall.stations.length > 0 ? `${hall.stations[0].name} · ${hall.stations[0].items[0]?.name}` : hall.highlights.slice(0, 2).join(' · ')}
              </span>
            </div>
            <span
              className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: hall.status === 'open' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)',
                color: hall.status === 'open' ? '#16a34a' : '#dc2626',
              }}
            >
              {hall.status === 'open' ? `Open · Closes ${hall.closesAt}` : `Closed`}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ---- EVENTS WIDGET ----
function EventsWidget({ university, onNavigate }: { university: University; onNavigate: (p: Page) => void }) {
  const events = eventsData[university].slice(0, 4)
  const total = eventsData[university].length
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex flex-col gap-3"
      variants={cardVariants}
      custom={1}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <SectionHeader label="Events" page="events" onNavigate={onNavigate} icon={Calendar} />
      <p className="text-xs" style={{ color: '#999' }}>{total} events this week</p>
      <div className="flex flex-col gap-2.5">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center min-w-[3rem]">
              <span className="text-[10px] font-bold" style={{ color: '#E03A3E' }}>{ev.date}</span>
              <span className="text-[10px]" style={{ color: '#999' }}>{ev.time.split(' - ')[0]}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-snug" style={{ color: '#1a1a1a' }}>{ev.title}</span>
              <span className="text-[10px]" style={{ color: '#888' }}>{ev.location}</span>
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block w-fit"
                style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6' }}
              >
                {ev.source}
              </span>
            </div>
          </div>
        ))}
        {total > 4 && (
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-medium text-center pt-1"
            style={{ color: '#E03A3E' }}
          >
            {total - 4} more today →
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ---- ATHLETICS WIDGET ----
function AthleticsWidget({ university, onNavigate }: { university: University; onNavigate: (p: Page) => void }) {
  const data = athleticsData[university]
  const live = data.live
  const upcoming = data.upcoming.slice(0, 3)
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex flex-col gap-3"
      variants={cardVariants}
      custom={2}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <SectionHeader label="Athletics" page="athletics" onNavigate={onNavigate} icon={Trophy} />

      {live && (
        <div
          className="rounded-xl p-3 flex flex-col gap-1"
          style={{
            background: 'rgba(224,58,62,0.06)',
            border: '1px solid rgba(224,58,62,0.20)',
            borderLeft: '3px solid #E03A3E',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
              style={{ background: '#E03A3E', color: '#fff' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" aria-hidden="true" />
              LIVE
            </span>
            <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{live.sport} — {live.quarter}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className="text-xs font-bold score-glow" style={{ color: '#E03A3E' }}>{live.homeTeam} <span className="text-base">{live.homeScore}</span></p>
              <p className="text-xs font-medium" style={{ color: '#555' }}>{live.awayTeam} <span className="text-sm font-bold">{live.awayScore}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px]" style={{ color: '#999' }}>{live.network}</p>
              <p className="text-[10px]" style={{ color: '#bbb' }}>Updated {live.updatedAgo}</p>
            </div>
          </div>
          <p className="text-[10px]" style={{ color: '#999' }}>TD — {live.lastPlay}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#bbb' }}>Upcoming</p>
        {upcoming.map((game, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span style={{ color: '#555' }}>vs. {game.opponent.split(' ').slice(-1)[0]}</span>
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#999' }}>{game.date}</span>
              <span style={{ color: '#999' }}>{game.time}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{ background: 'rgba(0,0,0,0.05)', color: '#666' }}
              >
                {game.network}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ---- NIGHTLIFE WIDGET ---- (dark tinted)
function NightlifeWidget({ university, onNavigate }: { university: University; onNavigate: (p: Page) => void }) {
  const events = nightlifeData[university].tonight.slice(0, 3)
  return (
    <motion.div
      className="glass-night rounded-2xl p-4 flex flex-col gap-3"
      variants={cardVariants}
      custom={3}
      whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(120,80,200,0.2)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Moon size={11} style={{ color: '#8b5cf6' }} aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#8b5cf6' }}>Nightlife Tonight</span>
        </div>
        <motion.button
          onClick={() => onNavigate('nightlife')}
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: '#a78bfa' }}
          whileHover={{ x: 2 }}
          aria-label="See all nightlife"
        >
          See all <ArrowRight size={11} aria-hidden="true" />
        </motion.button>
      </div>
      <p className="text-xs" style={{ color: '#6b7280' }}>{nightlifeData[university].tonight.length} events near campus</p>
      <div className="flex flex-col gap-2.5">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#e5e7eb' }}>{ev.eventName}</p>
              <p className="text-[11px]" style={{ color: '#9ca3af' }}>{ev.venue}</p>
              <p className="text-[10px]" style={{ color: '#6b7280' }}>{ev.time.split(', ')[1]?.split(' - ')[0]}</p>
            </div>
            <span
              className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: ev.cost === 'No Cover' || ev.cost.toLowerCase().includes('free') ? 'rgba(34,197,94,0.18)' : 'rgba(139,92,246,0.18)',
                color: ev.cost === 'No Cover' || ev.cost.toLowerCase().includes('free') ? '#4ade80' : '#a78bfa',
              }}
            >
              {ev.cost}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center" style={{ color: '#6b7280' }}>College Park after dark →</p>
    </motion.div>
  )
}

// ---- NEWS WIDGET ----
function NewsWidget({ university, onNavigate }: { university: University; onNavigate: (p: Page) => void }) {
  const articles = newsData[university].slice(0, 3)
  const categoryColors: Record<string, string> = {
    Research: '#3b82f6',
    Athletics: '#E03A3E',
    'Student Life': '#8b5cf6',
    Administration: '#6b7280',
    Arts: '#f59e0b',
    Career: '#10b981',
  }
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex flex-col gap-3"
      variants={cardVariants}
      custom={4}
      whileHover={{ y: -3, boxShadow: '0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <SectionHeader label="News" page="news" onNavigate={onNavigate} icon={Newspaper} />
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col gap-1">
            <p className="text-xs font-semibold leading-snug text-balance" style={{ color: '#1a1a1a' }}>{article.title}</p>
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${categoryColors[article.category] || '#6b7280'}18`,
                  color: categoryColors[article.category] || '#6b7280',
                }}
              >
                {article.category}
              </span>
              <span className="text-[10px]" style={{ color: '#bbb' }}>By {article.author} · {article.date}</span>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs font-medium self-start"
              style={{ color: '#E03A3E' }}
            >
              Read full article →
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ---- MAP PLACEHOLDER ----
function MapWidget() {
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[160px]"
      variants={cardVariants}
      custom={5}
      style={{ opacity: 0.7 }}
    >
      <MapPin size={28} style={{ color: '#bbb' }} aria-hidden="true" />
      <p className="text-sm font-semibold" style={{ color: '#999' }}>Campus Map</p>
      <p className="text-xs" style={{ color: '#bbb' }}>Coming in v1.1</p>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ background: 'rgba(0,0,0,0.05)', color: '#bbb' }}
      >
        Soon
      </span>
    </motion.div>
  )
}

// ---- MAIN WIDGET GRID ----
export default function WidgetCards({ university, onNavigate }: WidgetCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#0d0d0d' }}>Live Campus Data</h2>
        <span className="text-xs" style={{ color: '#bbb' }}>All data updates automatically</span>
      </div>
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <DiningWidget university={university} onNavigate={onNavigate} />
        <EventsWidget university={university} onNavigate={onNavigate} />
        <AthleticsWidget university={university} onNavigate={onNavigate} />
        <NightlifeWidget university={university} onNavigate={onNavigate} />
        <NewsWidget university={university} onNavigate={onNavigate} />
        <MapWidget />
      </motion.div>
    </div>
  )
}
