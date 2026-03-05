'use client'

import { motion } from 'framer-motion'
import type { University } from '@/lib/uip-data'

interface LandingPageProps {
  onSelectUniversity: (u: University) => void
}

const UNIVERSITIES = [
  {
    id: 'UMD' as University,
    short: 'UMD',
    name: 'University of Maryland',
    logo: '/logos/umd-seal.png',
    logoBg: 'transparent',
    logoSize: 80,
  },
  {
    id: 'Michigan' as University,
    short: 'UMich',
    name: 'University of Michigan',
    logo: '/logos/umich-logo.png',
    logoBg: '#00274C',
    logoSize: 80,
  },
]

export default function LandingPage({ onSelectUniversity }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="flex flex-col items-center gap-6 w-full max-w-[700px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* App icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
        >
          <img
            src="/logos/campusai-logo.png"
            alt="Campus AI"
            className="rounded-[28px] shadow-2xl"
            style={{ width: 160, height: 160, objectFit: 'cover', display: 'block' }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          <h1 className="text-5xl font-black tracking-tight text-balance leading-tight">
            <span style={{ color: '#111' }}>Campus </span>
            <span style={{ color: '#E03A3E' }}>AI</span>
          </h1>
          <p className="text-base max-w-[380px] mx-auto text-balance leading-relaxed" style={{ color: '#777' }}>
            Your AI-powered university assistant. Select your campus to get started.
          </p>
        </motion.div>

        {/* University cards */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.45 }}
        >
          {UNIVERSITIES.map((u, i) => (
            <motion.button
              key={u.id}
              onClick={() => onSelectUniversity(u.id)}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl text-left"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 + i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.11)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  width: u.logoSize,
                  height: u.logoSize,
                  background: u.logoBg,
                  flexShrink: 0,
                }}
              >
                <img
                  src={u.logo}
                  alt={u.name}
                  width={u.logoSize}
                  height={u.logoSize}
                  className="object-contain"
                  style={{ width: u.logoSize, height: u.logoSize }}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold" style={{ color: '#111' }}>{u.short}</span>
                <span className="text-sm" style={{ color: '#888' }}>{u.name}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
