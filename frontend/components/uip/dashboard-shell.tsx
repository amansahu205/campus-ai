'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Sidebar from './sidebar'
import TopNav from './top-nav'
import StatusBar from './status-bar'
import AskUIPTab from './ask-uip-tab'
import BrowseDataTab from './browse-data-tab'
import DiningPage from './pages/dining-page'
import EventsPage from './pages/events-page'
import AthleticsPage from './pages/athletics-page'
import NightlifePage from './pages/nightlife-page'
import NewsPage from './pages/news-page'
import AdminDashboard from './admin/admin-dashboard'
import type { University } from '@/lib/uip-data'

const BackgroundScene = dynamic(() => import('./background-scene'), { ssr: false })

type Page = 'home' | 'dining' | 'events' | 'athletics' | 'nightlife' | 'news'
type HomeTab = 'ask' | 'browse'

interface DashboardShellProps {
  initialUniversity?: University
}

export default function DashboardShell({ initialUniversity = 'UMD' }: DashboardShellProps) {
  const [page, setPage] = useState<Page>('home')
  const [homeTab, setHomeTab] = useState<HomeTab>('ask')
  const [university, setUniversity] = useState<University>(initialUniversity)
  const [showAdmin, setShowAdmin] = useState(false)

  const handleNavigate = (p: Page) => {
    setPage(p)
  }

  const handleStatusClick = (p: string) => {
    if (p === 'dining' || p === 'events' || p === 'athletics' || p === 'nightlife' || p === 'news') {
      setPage(p as Page)
    }
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />
  }

  return (
    <>
      <BackgroundScene />
      <Sidebar
        currentPage={page}
        onNavigate={(p) => setPage(p)}
        university={university}
      />
      <TopNav university={university} onUniversityChange={setUniversity} />

      <main
        className="fixed top-[52px] left-[180px] right-0 bottom-0 overflow-hidden flex flex-col"
        style={{ padding: '20px 24px 0' }}
      >
        {/* Status bar */}
        <StatusBar university={university} onSegmentClick={handleStatusClick} />

        {/* Main content area */}
        <div className="flex-1 overflow-hidden mt-4">
          <AnimatePresence mode="wait">
            {page === 'home' && (
              <motion.div
                key="home"
                className="h-full flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Tab switcher */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="glass flex items-center p-1 rounded-2xl gap-1"
                    style={{ width: 320 }}
                  >
                    {(['ask', 'browse'] as HomeTab[]).map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => setHomeTab(tab)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors relative"
                        style={{ color: homeTab === tab ? '#fff' : '#888' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {homeTab === tab && (
                          <motion.div
                            layoutId="tab-bg"
                            className="absolute inset-0 rounded-xl"
                            style={{ background: tab === 'ask' ? '#E03A3E' : '#1a1a1a' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          {tab === 'ask' ? (
                            <><span>✦</span> Ask Campus AI</>
                          ) : (
                            <><span>▐</span> Browse Data</>
                          )}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {homeTab === 'ask' ? (
                      <motion.div
                        key="ask"
                        className="h-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AskUIPTab university={university} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="browse"
                        className="h-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BrowseDataTab university={university} onNavigate={handleNavigate as any} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {page === 'dining' && (
              <motion.div
                key="dining"
                className="h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <DiningPage university={university} />
              </motion.div>
            )}

            {page === 'events' && (
              <motion.div
                key="events"
                className="h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <EventsPage university={university} />
              </motion.div>
            )}

            {page === 'athletics' && (
              <motion.div
                key="athletics"
                className="h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AthleticsPage university={university} />
              </motion.div>
            )}

            {page === 'nightlife' && (
              <motion.div
                key="nightlife"
                className="h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <NightlifePage university={university} />
              </motion.div>
            )}

            {page === 'news' && (
              <motion.div
                key="news"
                className="h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <NewsPage university={university} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Admin access */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 z-50 text-xs px-3 py-1.5 rounded-xl"
        style={{ background: 'rgba(0,0,0,0.07)', color: '#bbb', border: '1px solid rgba(0,0,0,0.08)' }}
        aria-label="Open admin dashboard"
      >
        Admin
      </button>
    </>
  )
}
