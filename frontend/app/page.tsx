'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { University } from '@/lib/uip-data'

const LandingPage = dynamic(() => import('@/components/uip/landing-page'), { ssr: false })
const DashboardShell = dynamic(() => import('@/components/uip/dashboard-shell'), { ssr: false })

export default function Home() {
  const [university, setUniversity] = useState<University | null>(null)

  if (!university) {
    return <LandingPage onSelectUniversity={setUniversity} />
  }

  return <DashboardShell initialUniversity={university} />
}
