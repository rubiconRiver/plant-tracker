'use client'

import { useState } from 'react'

// Color Palette Options
const palettes = {
  'Fresh Garden': {
    light: {
      primary: '#10b981',     // emerald-500 - bright, fun green
      secondary: '#3b82f6',   // blue-500
      accent: '#f59e0b',      // amber-500
      background: '#ffffff',
      foreground: '#0a0a0a',
      card: '#f9fafb',
      muted: '#9ca3af',
    },
    dark: {
      primary: '#34d399',     // emerald-400
      secondary: '#60a5fa',   // blue-400
      accent: '#fbbf24',      // amber-400
      background: '#0a0a0a',
      foreground: '#fafafa',
      card: '#18181b',
      muted: '#71717a',
    }
  },
  'Vibrant Spring': {
    light: {
      primary: '#22c55e',     // green-500 - vivid, energetic
      secondary: '#8b5cf6',   // violet-500
      accent: '#ec4899',      // pink-500
      background: '#fefffe',
      foreground: '#09090b',
      card: '#f8fafc',
      muted: '#94a3b8',
    },
    dark: {
      primary: '#4ade80',     // green-400
      secondary: '#a78bfa',   // violet-400
      accent: '#f472b6',      // pink-400
      background: '#09090b',
      foreground: '#f8fafc',
      card: '#18181b',
      muted: '#64748b',
    }
  },
  'Botanical': {
    light: {
      primary: '#16a34a',     // green-600 - natural, earthy
      secondary: '#0891b2',   // cyan-600
      accent: '#ea580c',      // orange-600
      background: '#fafaf9',
      foreground: '#171717',
      card: '#f5f5f4',
      muted: '#737373',
    },
    dark: {
      primary: '#22c55e',     // green-500
      secondary: '#06b6d4',   // cyan-500
      accent: '#fb923c',      // orange-400
      background: '#0c0a09',
      foreground: '#e5e5e5',
      card: '#1c1917',
      muted: '#78716c',
    }
  }
}

export default function ThemeDemo() {
  const [selectedPalette, setSelectedPalette] = useState('Fresh Garden')
  const [isDark, setIsDark] = useState(false)
  const palette = palettes[selectedPalette][isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: palette.background, 
      color: palette.foreground,
      minHeight: '100vh'
    }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Plant Tracker Theme Explorer</h1>
          
          {/* Palette Selector */}
          <div className="flex gap-4 mb-4">
            {Object.keys(palettes).map(name => (
              <button
                key={name}
                onClick={() => setSelectedPalette(name)}
                className="px-4 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: name === selectedPalette ? palette.primary : palette.card,
                  color: name === selectedPalette ? '#ffffff' : palette.foreground,
                  border: `2px solid ${palette.primary}`
                }}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: palette.secondary,
              color: '#ffffff'
            }}
          >
            {isDark ? '🌙 Dark' : '☀️ Light'} Mode
          </button>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg p-4 text-white" style={{ backgroundColor: palette.primary }}>
            <div className="font-bold">Primary</div>
            <div className="text-sm opacity-90">{palette.primary}</div>
            <div className="text-xs mt-2">Buttons, links, success</div>
          </div>
          <div className="rounded-lg p-4 text-white" style={{ backgroundColor: palette.secondary }}>
            <div className="font-bold">Secondary</div>
            <div className="text-sm opacity-90">{palette.secondary}</div>
            <div className="text-xs mt-2">Info, water, calendar</div>
          </div>
          <div className="rounded-lg p-4 text-white" style={{ backgroundColor: palette.accent }}>
            <div className="font-bold">Accent</div>
            <div className="text-sm opacity-90">{palette.accent}</div>
            <div className="text-xs mt-2">Harvest, achievements</div>
          </div>
          <div className="rounded-lg p-4" style={{ 
            backgroundColor: palette.card,
            border: `1px solid ${palette.muted}`,
            color: palette.foreground
          }}>
            <div className="font-bold">Card</div>
            <div className="text-sm opacity-70">{palette.card}</div>
            <div className="text-xs mt-2">Content areas</div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="space-y-6">
          {/* Card Example */}
          <div className="rounded-lg p-6" style={{ 
            backgroundColor: palette.card,
            border: `1px solid ${palette.muted}30`
          }}>
            <h2 className="text-xl font-bold mb-4">Tomato Plant</h2>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-sm" style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary
              }}>
                🌱 Growing
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{
                backgroundColor: palette.accent + '20',
                color: palette.accent
              }}>
                🌾 Ready in 14 days
              </span>
            </div>
            <p style={{ color: palette.muted }}>
              Planted 3 weeks ago • Last watered yesterday
            </p>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 rounded-lg text-white" style={{
                backgroundColor: palette.primary
              }}>
                Water Plant
              </button>
              <button className="px-4 py-2 rounded-lg text-white" style={{
                backgroundColor: palette.secondary
              }}>
                Take Photo
              </button>
            </div>
          </div>

          {/* Calendar Day Example */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-sm font-bold mb-2" style={{ color: palette.muted }}>
                  {day}
                </div>
                <div className="rounded-lg p-4" style={{
                  backgroundColor: i === 3 ? palette.primary + '10' : palette.card,
                  border: i === 3 ? `2px solid ${palette.primary}` : `1px solid ${palette.muted}30`
                }}>
                  <div className="font-bold">{15 + i}</div>
                  {i === 3 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs" style={{ color: palette.primary }}>💧 Water</div>
                      <div className="text-xs" style={{ color: palette.accent }}>🌾 Harvest</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Text Hierarchy */}
          <div className="rounded-lg p-6" style={{ 
            backgroundColor: palette.card,
            border: `1px solid ${palette.muted}30`
          }}>
            <h1 className="text-2xl font-bold mb-2">Heading Text</h1>
            <h2 className="text-lg font-semibold mb-2" style={{ color: palette.foreground + 'ee' }}>
              Subheading Text
            </h2>
            <p className="mb-2">
              Regular body text looks like this. It should be clearly readable.
            </p>
            <p style={{ color: palette.muted }}>
              Secondary text for less important information.
            </p>
          </div>
        </div>

        {/* Color Values */}
        <div className="mt-8 rounded-lg p-4" style={{ 
          backgroundColor: palette.card,
          border: `1px solid ${palette.muted}30`
        }}>
          <h3 className="font-bold mb-2">Current Palette: {selectedPalette} ({isDark ? 'Dark' : 'Light'})</h3>
          <pre className="text-xs" style={{ color: palette.muted }}>
            {JSON.stringify(palette, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}