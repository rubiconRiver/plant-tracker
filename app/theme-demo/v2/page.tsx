'use client'

import { useState } from 'react'

// Version 2 - Forest/botanical green - more natural
const palettes = {
  'v2': {
    light: {
      primary: '#15803d',     // Green-700 - deep forest green
      secondary: '#1e40af',   // Blue-800 - deep water
      accent: '#dc2626',      // Red-600 - ripe tomato
      background: '#fafaf9',  // Neutral-50
      foreground: '#0a0a0a',
      card: '#ffffff',
      muted: '#6b7280',
    },
    dark: {
      primary: '#22c55e',     // Green-500 - living plant green
      secondary: '#3b82f6',   // Blue-500
      accent: '#ef4444',      // Red-500
      background: '#171717',  // Neutral-900
      foreground: '#f5f5f5',
      card: '#262626',
      muted: '#737373',
    }
  }
}

export default function V2ThemeDemo() {
  const [isDark, setIsDark] = useState(false)
  const palette = palettes['v2'][isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: palette.background, 
      color: palette.foreground,
      minHeight: '100vh',
      // Classic notebook lines
      backgroundImage: !isDark ? `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 28px,
          ${palette.primary}10 28px,
          ${palette.primary}10 29px
        ),
        linear-gradient(90deg, ${palette.secondary}08 1px, transparent 1px)
      ` : 'none',
      backgroundSize: !isDark ? '100% 100%, 50px 100%' : 'auto',
      backgroundPosition: !isDark ? '0 0, 60px 0' : 'auto'
    }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with Version */}
        <div className="mb-8 relative">
          <h1 className="text-4xl font-black mb-4">
            Plant Tracker
            <span className="text-sm font-normal ml-3 px-3 py-1 rounded-full inline-block"
              style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary,
                border: `2px solid ${palette.primary}`
              }}>
              v2
            </span>
          </h1>

          <button
            onClick={() => setIsDark(!isDark)}
            className="px-6 py-3 rounded-xl font-bold transition-all"
            style={{
              backgroundColor: palette.secondary,
              color: '#ffffff',
            }}
          >
            {isDark ? '🌙 Night' : '☀️ Day'} Mode
          </button>
        </div>

        {/* Clean Cards - Less playful, more sophisticated */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl p-6" style={{ 
            backgroundColor: palette.card,
            border: `2px solid ${palette.primary}`,
            boxShadow: `0 4px 6px -1px ${palette.primary}20`
          }}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Tomato Plant</h2>
              <span className="text-2xl">🍅</span>
            </div>
            
            <div className="flex gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 rounded-lg text-sm font-medium" style={{
                backgroundColor: palette.primary + '15',
                color: palette.primary,
              }}>
                Growing
              </span>
              <span className="px-3 py-1 rounded-lg text-sm font-medium" style={{
                backgroundColor: palette.accent + '15',
                color: palette.accent,
              }}>
                14 days to harvest
              </span>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-lg font-semibold text-white" style={{
                backgroundColor: palette.primary,
              }}>
                Water Plant
              </button>
              <button className="px-5 py-2 rounded-lg font-semibold" style={{
                backgroundColor: 'transparent',
                color: palette.secondary,
                border: `2px solid ${palette.secondary}`,
              }}>
                Take Photo
              </button>
            </div>
          </div>

          {/* Color Showcase */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg p-4 text-white" style={{ backgroundColor: palette.primary }}>
                <div className="font-bold">Primary</div>
                <div className="text-xs opacity-90">{palette.primary}</div>
              </div>
              <div className="flex-1 rounded-lg p-4 text-white" style={{ backgroundColor: palette.secondary }}>
                <div className="font-bold">Secondary</div>
                <div className="text-xs opacity-90">{palette.secondary}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg p-4 text-white" style={{ backgroundColor: palette.accent }}>
                <div className="font-bold">Accent</div>
                <div className="text-xs opacity-90">{palette.accent}</div>
              </div>
              <div className="flex-1 rounded-lg p-4" style={{ 
                backgroundColor: palette.card,
                border: `1px solid ${palette.muted}40`
              }}>
                <div className="font-bold">Card</div>
                <div className="text-xs opacity-70">{palette.card}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}