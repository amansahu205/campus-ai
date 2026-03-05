'use client'

import { motion } from 'framer-motion'
import WidgetCards from './widget-cards'
import type { University } from '@/lib/uip-data'

type Page = 'dining' | 'events' | 'athletics' | 'nightlife' | 'news'

interface BrowseDataTabProps {
  university: University
  onNavigate: (page: Page) => void
}

export default function BrowseDataTab({ university, onNavigate }: BrowseDataTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto pb-6"
    >
      <WidgetCards university={university} onNavigate={onNavigate} />
    </motion.div>
  )
}
