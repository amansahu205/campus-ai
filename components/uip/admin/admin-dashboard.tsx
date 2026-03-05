'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, GitBranch, ClipboardList, Database, BarChart3,
  Settings, Users, FileText, User, Settings2, ArrowRight, RefreshCw
} from 'lucide-react'

type Pipeline = {
  name: string
  status: 'Healthy' | 'Warning' | 'Failed'
  lastRun: string
  recordCount: string
}

const STATUS_COLORS = {
  Healthy: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
  Warning: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  Failed: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
}

const umdPipelines: Pipeline[] = [
  { name: 'Dining - UMD', status: 'Healthy', lastRun: '2 min ago', recordCount: '1,243 records' },
  { name: 'Events - UMD', status: 'Warning', lastRun: '10 min ago', recordCount: '850 records' },
  { name: 'Athletics - UMD', status: 'Failed', lastRun: '1 hour ago', recordCount: '0 records' },
  { name: 'Nightlife - UMD', status: 'Healthy', lastRun: '3 min ago', recordCount: '45 records' },
  { name: 'News - UMD', status: 'Healthy', lastRun: '4 min ago', recordCount: '120 records' },
]

const michiganPipelines: Pipeline[] = [
  { name: 'Dining - Michigan', status: 'Healthy', lastRun: '5 min ago', recordCount: '1,567 records' },
  { name: 'Events - Michigan', status: 'Healthy', lastRun: '12 min ago', recordCount: '1,100 records' },
  { name: 'Athletics - Michigan', status: 'Healthy', lastRun: '1 hour ago', recordCount: '250 records' },
  { name: 'Nightlife - Michigan', status: 'Warning', lastRun: '8 min ago', recordCount: '60 records' },
  { name: 'News - Michigan', status: 'Healthy', lastRun: '7 min ago', recordCount: '150 records' },
]

const reviewQueue = [
  { similarity: '92%', reason: 'Events have very similar titles, dates, and locations. Likely duplicates.' },
  { similarity: '88%', reason: 'Titles and descriptions are nearly identical, but start times differ by 30 minutes. Needs manual review.' },
  { similarity: '81%', reason: 'Same venue and time, but different organizer names. Possible duplicate.' },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch, active: true },
  { id: 'reviews', label: 'Reviews', icon: ClipboardList },
  { id: 'sources', label: 'Sources', icon: Database },
  { id: 'quality', label: 'Data Quality', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'logs', label: 'Logs', icon: FileText },
]

function PipelineCard({ pipeline, delay }: { pipeline: Pipeline; delay: number }) {
  const colors = STATUS_COLORS[pipeline.status]
  const [running, setRunning] = useState(false)

  return (
    <motion.div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: '#f9fafb' }}>{pipeline.name}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ background: colors.bg, color: colors.text }}
        >
          {pipeline.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs" style={{ color: '#9ca3af' }}>
        <div>
          <p className="text-[10px] mb-0.5">Status</p>
          <p style={{ color: '#d1d5db' }}>{pipeline.lastRun}</p>
        </div>
        <div>
          <p className="text-[10px] mb-0.5">Last Run</p>
          <p style={{ color: '#d1d5db' }}>{pipeline.lastRun}</p>
        </div>
        <div>
          <p className="text-[10px] mb-0.5">Record Count</p>
          <p style={{ color: '#d1d5db' }}>{pipeline.recordCount}</p>
        </div>
      </div>
      <motion.button
        onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 2000) }}
        className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
        style={{ background: 'rgba(255,255,255,0.08)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.12)' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <RefreshCw size={11} className={running ? 'animate-spin' : ''} aria-hidden="true" />
        Trigger re-run
      </motion.button>
    </motion.div>
  )
}

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeNav, setActiveNav] = useState('pipelines')

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div
      className="fixed inset-0 flex"
      style={{ background: '#0f1117' }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col w-[220px] flex-shrink-0"
        style={{ background: '#1a1d27', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <span className="text-xl font-black" style={{ color: '#f9fafb' }}>Campus AI</span>
          <span className="text-lg font-medium" style={{ color: '#6b7280' }}>Admin</span>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1" role="navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left w-full transition-colors"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: isActive ? '#f9fafb' : '#9ca3af',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-5 py-4">
          <button
            onClick={onBack}
            className="text-xs font-medium"
            style={{ color: '#6b7280' }}
          >
            ← Back to Campus AI
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top nav */}
        <header
          className="flex items-center gap-4 px-6 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#1a1d27' }}
        >
          {['Pipeline Status', 'Review Queue', 'Sources', 'Data Quality'].map((tab) => (
            <button
              key={tab}
              className="text-sm font-medium pb-1 border-b-2 transition-colors"
              style={{
                color: tab === 'Pipeline Status' ? '#f9fafb' : '#6b7280',
                borderColor: tab === 'Pipeline Status' ? '#f9fafb' : 'transparent',
              }}
            >
              {tab}
              {tab === 'Review Queue' && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: '#E03A3E', color: '#fff' }}
                >
                  3
                </span>
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <button aria-label="User profile">
              <User size={18} style={{ color: '#9ca3af' }} aria-hidden="true" />
            </button>
            <button aria-label="Settings">
              <Settings2 size={18} style={{ color: '#9ca3af' }} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Pipeline header */}
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2 gap-6 flex-1">
              <h2 className="text-base font-bold" style={{ color: '#f9fafb' }}>
                UMD (University of Maryland)
              </h2>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ color: '#f9fafb' }}>
                  Michigan (University of Michigan)
                </h2>
                <span className="text-xs" style={{ color: '#9ca3af' }}>
                  {dateStr}, {timeStr} EST
                </span>
              </div>
            </div>
          </div>

          {/* Pipeline grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              {umdPipelines.map((p, i) => (
                <PipelineCard key={p.name} pipeline={p} delay={i * 0.05} />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {michiganPipelines.map((p, i) => (
                <PipelineCard key={p.name} pipeline={p} delay={i * 0.05 + 0.25} />
              ))}
            </div>
          </div>

          {/* Review Queue */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold" style={{ color: '#f9fafb' }}>Review Queue (Preview)</h3>
              <button className="flex items-center gap-1 text-sm" style={{ color: '#E03A3E' }}>
                View All <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className="grid grid-cols-[140px_1fr_120px] gap-4 px-4 py-2 text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#6b7280', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span>Similarity Score</span>
                <span>LLM Reason Snippet</span>
                <span />
              </div>
              {reviewQueue.map((item, i) => (
                <motion.div
                  key={i}
                  className="grid grid-cols-[140px_1fr_120px] gap-4 px-4 py-3 items-center text-sm"
                  style={{ borderBottom: i < reviewQueue.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                >
                  <span className="font-bold" style={{ color: '#f9fafb' }}>{item.similarity} Similarity</span>
                  <p style={{ color: '#9ca3af' }}>{item.reason}</p>
                  <motion.button
                    className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.12)' }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Review <ArrowRight size={11} aria-hidden="true" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
