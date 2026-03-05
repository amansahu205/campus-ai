'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { University } from '@/lib/uip-data'
import { newsData, mostReadNews } from '@/lib/uip-data'

type CategoryFilter = 'All' | 'Research' | 'Athletics' | 'Administration' | 'Student Life' | 'Events'
const CATEGORY_FILTERS: CategoryFilter[] = ['All', 'Research', 'Athletics', 'Administration', 'Student Life', 'Events']

const CATEGORY_COLORS: Record<string, string> = {
  Research: '#3b82f6',
  Athletics: '#E03A3E',
  Administration: '#6b7280',
  'Student Life': '#8b5cf6',
  Arts: '#f59e0b',
  Events: '#10b981',
}

export default function NewsPage({ university }: { university: University }) {
  const [filter, setFilter] = useState<CategoryFilter>('All')
  const [activeFilters, setActiveFilters] = useState<CategoryFilter[]>([])

  const articles = newsData[university].filter((a) =>
    filter === 'All' ? true : a.category === filter
  )

  const topRead = mostReadNews[university]
  const firstArticle = articles[0]
  const restArticles = articles.slice(1)

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>UMD News</h1>
        <p className="text-sm" style={{ color: '#999' }}>From the official UMD Newsroom</p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_FILTERS.map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{
              background: filter === f
                ? (f === 'All' ? '#E03A3E' : CATEGORY_COLORS[f] || '#E03A3E')
                : 'rgba(255,255,255,0.7)',
              color: filter === f ? '#fff' : '#555',
              border: filter === f
                ? `1px solid ${f === 'All' ? '#E03A3E' : CATEGORY_COLORS[f] || '#E03A3E'}`
                : '1px solid rgba(0,0,0,0.10)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={filter === f}
          >
            {f}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Articles */}
        <div className="flex flex-col gap-4">
          {/* Featured article */}
          {firstArticle && (
            <motion.div
              className="glass rounded-2xl p-5 flex gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
            >
              <div
                className="w-[240px] h-[160px] rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#bbb', fontSize: 12 }}
                aria-label="Article image placeholder"
              >
                Image Placeholder
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h2 className="text-xl font-bold leading-snug text-balance" style={{ color: '#0d0d0d' }}>
                  {firstArticle.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{firstArticle.excerpt}</p>
                <p className="text-xs" style={{ color: '#999' }}>By {firstArticle.author} | {firstArticle.date}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: CATEGORY_COLORS[firstArticle.category] || '#6b7280',
                      color: '#fff',
                    }}
                  >
                    {firstArticle.category}
                  </span>
                  <motion.button
                    className="flex items-center gap-1 text-sm font-semibold"
                    style={{ color: '#E03A3E' }}
                    whileHover={{ x: 2 }}
                  >
                    Read full article <ArrowRight size={14} aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rest of articles */}
          {restArticles.map((article, i) => (
            <motion.div
              key={article.id}
              className="glass rounded-2xl p-5 flex gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.06 }}
              whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
            >
              <div
                className="w-[120px] h-[90px] rounded-xl flex-shrink-0 flex items-center justify-center text-center"
                style={{ background: 'rgba(0,0,0,0.06)', color: '#bbb', fontSize: 11 }}
                aria-label="Article image placeholder"
              >
                120x120px
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <h3 className="text-base font-bold leading-snug" style={{ color: '#0d0d0d' }}>{article.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#666' }}>{article.excerpt}</p>
                <p className="text-xs" style={{ color: '#999' }}>By {article.author} | {article.date}</p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${CATEGORY_COLORS[article.category] || '#6b7280'}18`,
                      color: CATEGORY_COLORS[article.category] || '#6b7280',
                      border: `1px solid ${CATEGORY_COLORS[article.category] || '#6b7280'}30`,
                    }}
                  >
                    {article.category}
                  </span>
                  <motion.button
                    className="flex items-center gap-1 text-sm font-semibold"
                    style={{ color: '#E03A3E' }}
                    whileHover={{ x: 2 }}
                  >
                    Read full article <ArrowRight size={14} aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Most Read */}
        <div className="flex flex-col gap-3">
          <div
            className="glass rounded-2xl p-4 flex flex-col gap-3"
            style={{ position: 'sticky', top: 0 }}
          >
            <h3 className="text-sm font-bold" style={{ color: '#0d0d0d' }}>Most Read This Week</h3>
            <div
              className="w-full h-px"
              style={{ background: 'rgba(0,0,0,0.08)' }}
              aria-hidden="true"
            />
            <ol className="flex flex-col gap-3">
              {topRead.map((title, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span
                    className="text-lg font-black flex-shrink-0 w-5"
                    style={{ color: i === 0 ? '#E03A3E' : '#ccc' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold leading-snug" style={{ color: '#333' }}>{title}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
