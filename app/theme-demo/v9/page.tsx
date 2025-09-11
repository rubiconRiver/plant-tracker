'use client'

import { useState } from 'react'

// v9: Nordic Garden - Minimalist, muted, Scandinavian design
const palette = {
  light: {
    primary: '#4d7c0f',      // Lime-700 - Muted moss green
    secondary: '#475569',    // Slate-600 - Nordic grey
    accent: '#b45309',       // Amber-700 - Warm wood
    background: '#f8fafc',   // Cool white
    surface: '#ffffff',
    border: '#e2e8f0',       // Slate-200
    text: '#0f172a',         // Slate-900
    textSecondary: '#64748b', // Slate-500
  },
  dark: {
    primary: '#65a30d',
    secondary: '#64748b',
    accent: '#d97706',
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
  }
}

export default function NordicGarden() {
  const [isDark, setIsDark] = useState(false)
  const colors = palette[isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text,
      minHeight: '100vh',
      fontFamily: '-apple-system, system-ui, sans-serif',
      // Minimal Scandinavian grid
      backgroundImage: !isDark ? `
        linear-gradient(to right, ${colors.border}20 1px, transparent 1px)
      ` : 'none',
      backgroundSize: '40px 100%',
      backgroundPosition: '0 0'
    }}>
      {/* Minimal Header */}
      <header className="px-8 py-6" style={{
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl tracking-tight">
              planttracker
              <span className="text-xs ml-2" style={{ color: colors.textSecondary }}>v9</span>
            </h1>
            <nav className="flex gap-6 text-sm">
              {['Overview', 'Plants', 'Calendar'].map(item => (
                <a key={item} href="#" style={{ color: colors.textSecondary }} className="hover:underline">
                  {item.toLowerCase()}
                </a>
              ))}
            </nav>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="text-sm" style={{ color: colors.textSecondary }}>
            {isDark ? 'light' : 'dark'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Status Grid - Very Minimal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'plants', value: '12', subtext: 'active' },
            { label: 'water', value: '3', subtext: 'today' },
            { label: 'harvest', value: '2', subtext: 'ready' },
            { label: 'photos', value: '47', subtext: 'total' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-light mb-1">{stat.value}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary, opacity: 0.7 }}>
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Plant List - Minimal Table */}
        <div className="mb-16">
          <h2 className="text-sm font-medium mb-6" style={{ color: colors.textSecondary }}>
            CURRENT PLANTS
          </h2>
          <div className="space-y-0" style={{
            borderTop: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`
          }}>
            {[
              { name: 'Tomato', latin: 'Solanum lycopersicum', status: 'growing', age: '45 days' },
              { name: 'Lettuce', latin: 'Lactuca sativa', status: 'ready', age: '28 days' },
              { name: 'Basil', latin: 'Ocimum basilicum', status: 'growing', age: '21 days' },
              { name: 'Pepper', latin: 'Capsicum annuum', status: 'flowering', age: '38 days' },
            ].map((plant, i) => (
              <div key={plant.name} className="flex items-center justify-between py-4" style={{
                borderTop: i > 0 ? `1px solid ${colors.border}` : 'none'
              }}>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="font-medium">{plant.name}</div>
                    <div className="text-xs italic" style={{ color: colors.textSecondary }}>
                      {plant.latin}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <span style={{ color: colors.textSecondary }}>{plant.age}</span>
                  <span className="px-3 py-1 rounded-full text-xs" style={{
                    backgroundColor: plant.status === 'ready' ? colors.primary + '20' : 'transparent',
                    color: plant.status === 'ready' ? colors.primary : colors.textSecondary,
                    border: `1px solid ${plant.status === 'ready' ? colors.primary + '40' : colors.border}`
                  }}>
                    {plant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week View - Minimal Calendar */}
        <div>
          <h2 className="text-sm font-medium mb-6" style={{ color: colors.textSecondary }}>
            THIS WEEK
          </h2>
          <div className="grid grid-cols-7 gap-4">
            {[
              { day: 'mon', date: 9, tasks: [] },
              { day: 'tue', date: 10, tasks: [] },
              { day: 'wed', date: 11, tasks: ['water'] },
              { day: 'thu', date: 12, tasks: [] },
              { day: 'fri', date: 13, tasks: ['photo'] },
              { day: 'sat', date: 14, tasks: ['harvest'] },
              { day: 'sun', date: 15, tasks: [] },
            ].map(item => (
              <div key={item.day} className="text-center">
                <div className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                  {item.day}
                </div>
                <div className="aspect-square flex flex-col items-center justify-center rounded-lg" style={{
                  backgroundColor: item.date === 11 ? colors.primary + '10' : colors.surface,
                  border: `1px solid ${item.date === 11 ? colors.primary + '30' : colors.border}`
                }}>
                  <div className="text-lg font-light">{item.date}</div>
                  {item.tasks.length > 0 && (
                    <div className="text-xs mt-1" style={{ color: colors.primary }}>
                      •
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 flex gap-4" style={{
          borderTop: `1px solid ${colors.border}`
        }}>
          <button className="px-6 py-2 text-sm rounded" style={{
            backgroundColor: colors.primary,
            color: '#ffffff'
          }}>
            Add Plant
          </button>
          <button className="px-6 py-2 text-sm rounded" style={{
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`
          }}>
            Take Photo
          </button>
        </div>
      </div>
    </div>
  )
}