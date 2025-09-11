'use client'

import { useState } from 'react'

// v6: Earthy Minimal - Warm, understated, sophisticated
const palette = {
  light: {
    primary: '#65a30d',      // Lime-600 - Natural green
    secondary: '#8b5a3c',    // Brown - Earth tone
    accent: '#ea580c',       // Orange-600 - Terracotta
    background: '#faf9f7',   // Warm off-white
    surface: '#ffffff',
    border: '#d6cfc7',       // Warm grey-brown
    text: '#3f3a36',         // Dark warm brown
    textSecondary: '#78716c',
    textMuted: '#a8a29e',
  },
  dark: {
    primary: '#84cc16',
    secondary: '#a0826d',
    accent: '#fb923c',
    background: '#1c1917',
    surface: '#292524',
    border: '#44403c',
    text: '#faf9f7',
    textSecondary: '#d6d3d1',
    textMuted: '#a8a29e',
  }
}

export default function EarthyMinimal() {
  const [isDark, setIsDark] = useState(false)
  const colors = palette[isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text,
      minHeight: '100vh',
      // Organic paper texture with subtle lines
      backgroundImage: !isDark ? `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 24px,
          ${colors.secondary}08 24px,
          ${colors.secondary}08 25px
        ),
        radial-gradient(ellipse at top left, ${colors.primary}03, transparent 60%),
        radial-gradient(ellipse at bottom right, ${colors.accent}03, transparent 60%)
      ` : `
        radial-gradient(ellipse at top left, ${colors.primary}05, transparent 60%)
      `,
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.surface,
        borderBottom: `2px solid ${colors.secondary}30`,
        padding: '1.5rem'
      }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-light tracking-wide">
            Plant<span style={{ color: colors.primary, fontWeight: 'bold' }}>Tracker</span>
            <span className="text-xs ml-3" style={{ color: colors.textMuted }}>v6</span>
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: colors.secondary + '20',
              color: colors.secondary,
              border: `1px solid ${colors.secondary}40`
            }}
          >
            {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plant Status */}
          <div className="lg:col-span-2 rounded-2xl p-6" style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`
          }}>
            <h2 className="text-xl mb-6" style={{ color: colors.secondary }}>
              Garden Overview
            </h2>
            
            <div className="space-y-4">
              {[
                { plant: 'Heirloom Tomatoes', status: 'Thriving', days: 42, water: 'Tomorrow' },
                { plant: 'Butter Lettuce', status: 'Ready', days: 28, water: 'Today' },
                { plant: 'Sweet Basil', status: 'Growing', days: 15, water: 'Today' },
              ].map(item => (
                <div key={item.plant} className="flex items-center justify-between p-4 rounded-xl" style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`
                }}>
                  <div>
                    <h3 className="font-medium mb-1">{item.plant}</h3>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Day {item.days} • Water {item.water}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm" style={{
                    backgroundColor: item.status === 'Ready' ? colors.accent + '20' : colors.primary + '20',
                    color: item.status === 'Ready' ? colors.accent : colors.primary
                  }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-6" style={{
            backgroundColor: colors.primary + '08',
            border: `1px solid ${colors.primary}20`
          }}>
            <h3 className="text-lg mb-4" style={{ color: colors.primary }}>
              Today&apos;s Tasks
            </h3>
            <div className="space-y-3">
              <button className="w-full p-3 rounded-xl text-left" style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}>
                <div className="flex items-center gap-3">
                  <span>💧</span>
                  <div>
                    <div className="font-medium">Water 3 plants</div>
                    <div className="text-xs" style={{ color: colors.textMuted }}>Due today</div>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl text-left" style={{
                backgroundColor: colors.accent + '10',
                border: `1px solid ${colors.accent}30`
              }}>
                <div className="flex items-center gap-3">
                  <span>🌾</span>
                  <div>
                    <div className="font-medium" style={{ color: colors.accent }}>Harvest lettuce</div>
                    <div className="text-xs" style={{ color: colors.textMuted }}>Ready now</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mt-8 rounded-2xl p-6" style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}>
          <h2 className="text-xl mb-4" style={{ color: colors.secondary }}>
            This Week
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-xs mb-2" style={{ color: colors.textMuted }}>{day}</div>
                <div className="aspect-square rounded-lg p-2" style={{
                  backgroundColor: i === 2 ? colors.primary + '15' : colors.background,
                  border: i === 2 ? `2px solid ${colors.primary}40` : `1px solid ${colors.border}`
                }}>
                  <div className="text-sm font-medium">{9 + i}</div>
                  {i === 2 && <div className="text-xs mt-1">💧📸</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}