'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tv } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { athleticsData } from '@/lib/uip-data'

type SportFilter = 'All Sports' | 'Football' | 'Basketball' | 'Soccer' | 'Baseball' | 'Lacrosse'
const SPORT_FILTERS: SportFilter[] = ['All Sports', 'Football', 'Basketball', 'Soccer', 'Baseball', 'Lacrosse']

const SPORT_ICONS: Record<string, string> = {
  Football: '🏈',
  Basketball: '🏀',
  Soccer: '⚽',
  Baseball: '⚾',
  Lacrosse: '🥍',
  Hockey: '🏒',
}

export default function AthleticsPage({ university }: { university: University }) {
  const [sportFilter, setSportFilter] = useState<SportFilter>('All Sports')
  const data = athleticsData[university]
  const live = data.live

  const filteredUpcoming = data.upcoming.filter((g) =>
    sportFilter === 'All Sports' || g.sport === sportFilter
  )

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>
          Athletics — {university === 'UMD' ? 'University of Maryland' : 'University of Michigan'}
        </h1>
      </div>

      {/* Sport filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {SPORT_FILTERS.map((f) => (
          <motion.button
            key={f}
            onClick={() => setSportFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{
              background: sportFilter === f ? '#E03A3E' : 'rgba(255,255,255,0.7)',
              color: sportFilter === f ? '#fff' : '#555',
              border: sportFilter === f ? '1px solid #E03A3E' : '1px solid rgba(0,0,0,0.10)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={sportFilter === f}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Live game */}
      {live && (sportFilter === 'All Sports' || sportFilter === live.sport as SportFilter) && (
        <motion.div
          className="glass rounded-2xl p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderLeft: '4px solid #E03A3E' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: '#E03A3E', color: '#fff' }}
              >
                <span className="w-2 h-2 rounded-full bg-white live-pulse" aria-hidden="true" />
                LIVE
              </span>
              <span className="text-base font-bold" style={{ color: '#0d0d0d' }}>
                {live.sport} — {live.quarter}
              </span>
            </div>
            <span className="text-sm" style={{ color: '#999' }}>{live.date}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold" style={{ color: '#0d0d0d' }}>{live.homeTeam}</span>
                <span className="text-3xl font-black score-glow" style={{ color: '#E03A3E' }}>{live.homeScore}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold" style={{ color: '#555' }}>{live.awayTeam}</span>
                <span className="text-2xl font-bold" style={{ color: '#555' }}>{live.awayScore}</span>
              </div>
              <p className="text-sm" style={{ color: '#999' }}>Last play: {live.lastPlay}</p>
            </div>
            <div className="text-right flex flex-col gap-1">
              <div className="flex items-center gap-2 justify-end">
                <Tv size={16} style={{ color: '#666' }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: '#333' }}>{live.network}</span>
              </div>
              <span className="text-xs" style={{ color: '#bbb' }}>Updated {live.updatedAgo}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming games */}
      <div className="flex flex-col gap-3">
        {filteredUpcoming.map((game, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-4 flex items-center gap-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
          >
            {/* Sport icon */}
            <span className="text-xl flex-shrink-0" aria-hidden="true">
              {SPORT_ICONS[game.sport] || '🏅'}
            </span>

            {/* Team logo placeholder */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: game.logoColor || '#888' }}
              aria-hidden="true"
            >
              {game.opponent.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>

            {/* Opponent */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold" style={{ color: '#0d0d0d' }}>{game.opponent}</p>
            </div>

            {/* Details */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#555', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {game.date}, {game.time}
              </span>
              {game.isToday && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: '#3b82f6', color: '#fff' }}
                >
                  Today
                </span>
              )}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#555', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {game.location}
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#555', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {game.network}
              </span>
              {game.result && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                  style={{
                    background: game.result === 'W' ? '#16a34a' : '#dc2626',
                    color: '#fff',
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-black"
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    {game.result}
                  </span>
                  Final: {(game as any).finalScore}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
