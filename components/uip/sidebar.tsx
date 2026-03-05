'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Home, UtensilsCrossed, Calendar, Trophy, Moon, Newspaper } from 'lucide-react'
import type { University } from '@/lib/uip-data'

type Page = 'home' | 'dining' | 'events' | 'athletics' | 'nightlife' | 'news'

const NAV_ITEMS: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'athletics', label: 'Athletics', icon: Trophy },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
  { id: 'news', label: 'News', icon: Newspaper },
]

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  syncedAgo?: string
  university: University
}

export default function Sidebar({ currentPage, onNavigate, syncedAgo = '2 min ago', university }: SidebarProps) {
  return (
    <aside
      className="glass fixed left-0 top-0 h-full w-[180px] z-40 flex flex-col"
      style={{ borderRight: '1px solid rgba(255,255,255,0.45)' }}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <img
          src="/logos/campusai-logo.png"
          alt="Campus AI logo"
          className="rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, objectFit: 'cover', display: 'block' }}
        />
        <span className="text-sm font-bold tracking-tight leading-none" style={{ color: '#1a1a1a' }}>
          campus<span style={{ color: '#E03A3E' }}>ai</span>
        </span>
      </div>

      {/* Red accent line */}
      <div className="mx-5 mb-4 h-0.5 rounded-full" style={{ background: '#E03A3E' }} />

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left"
              style={{
                color: isActive ? '#E03A3E' : '#555',
                background: isActive ? 'rgba(224,58,62,0.08)' : 'transparent',
              }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                    style={{ background: '#E03A3E' }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <Icon
                size={18}
                aria-hidden="true"
                style={{ color: isActive ? '#E03A3E' : '#888' }}
              />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Sync status */}
      <div className="px-5 py-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs" style={{ color: '#999' }}>Synced {syncedAgo}</span>
      </div>
    </aside>
  )
}
