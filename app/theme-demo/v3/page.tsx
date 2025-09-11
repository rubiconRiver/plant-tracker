'use client'

import { useState } from 'react'

// Version 3 - Sage/herb green - sophisticated, muted
const palettes = {
  'v3': {
    light: {
      primary: '#65a30d',     // Lime-600 - fresh herb green
      secondary: '#7c3aed',   // Violet-600 - lavender
      accent: '#c2410c',      // Orange-700 - autumn harvest
      background: '#fafafa',  // Pure neutral
      foreground: '#171717',
      card: '#ffffff',
      muted: '#78716c',       // Stone-500
    },
    dark: {
      primary: '#84cc16',     // Lime-500
      secondary: '#8b5cf6',   // Violet-500
      accent: '#f97316',      // Orange-500
      background: '#0a0a0a',
      foreground: '#fafafa',
      card: '#171717',
      muted: '#a8a29e',
    }
  }
}

export default function V3ThemeDemo() {
  const [isDark, setIsDark] = useState(false)
  const palette = palettes['v3'][isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: palette.background, 
      color: palette.foreground,
      minHeight: '100vh',
      // Subtle crosshatch pattern
      backgroundImage: !isDark ? `
        linear-gradient(45deg, ${palette.primary}05 25%, transparent 25%),
        linear-gradient(-45deg, ${palette.primary}05 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, ${palette.primary}05 75%),
        linear-gradient(-45deg, transparent 75%, ${palette.primary}05 75%)
      ` : 'none',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with Version */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-4">
            Plant Tracker
            <span className="text-sm font-normal ml-3 px-3 py-1 rounded-md inline-block"
              style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary,
                border: `1px solid ${palette.primary}`
              }}>
              v3
            </span>
          </h1>

          <button
            onClick={() => setIsDark(!isDark)}
            className="px-5 py-2 rounded-md font-medium transition-all"
            style={{
              backgroundColor: palette.secondary,
              color: '#ffffff',
            }}
          >
            {isDark ? '🌙' : '☀️'} Toggle Mode
          </button>
        </div>

        {/* Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-lg p-6" style={{ 
            backgroundColor: palette.card,
            boxShadow: `0 1px 3px 0 ${palette.foreground}10`
          }}>
            <h2 className="text-2xl font-bold mb-4">Tomato Plant</h2>
            
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 rounded text-xs font-medium" style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary,
              }}>
                Growing
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium" style={{
                backgroundColor: palette.accent + '20',
                color: palette.accent,
              }}>
                Harvest Soon
              </span>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded font-medium text-white" style={{
                backgroundColor: palette.primary,
              }}>
                Water
              </button>
              <button className="px-4 py-2 rounded font-medium" style={{
                color: palette.secondary,
                border: `1px solid ${palette.secondary}`,
              }}>
                Photo
              </button>
            </div>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-4 text-white text-center" style={{ backgroundColor: palette.primary }}>
              <div className="font-bold text-sm">Primary</div>
              <div className="text-xs mt-1">{palette.primary}</div>
            </div>
            <div className="rounded-lg p-4 text-white text-center" style={{ backgroundColor: palette.secondary }}>
              <div className="font-bold text-sm">Secondary</div>
              <div className="text-xs mt-1">{palette.secondary}</div>
            </div>
            <div className="rounded-lg p-4 text-white text-center" style={{ backgroundColor: palette.accent }}>
              <div className="font-bold text-sm">Accent</div>
              <div className="text-xs mt-1">{palette.accent}</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ 
              backgroundColor: palette.card,
              border: `1px solid ${palette.muted}30`
            }}>
              <div className="font-bold text-sm">Card</div>
              <div className="text-xs mt-1">{palette.card}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}