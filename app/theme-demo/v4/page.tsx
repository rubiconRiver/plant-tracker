'use client'

import { useState } from 'react'

// Version 4 - Stardew Valley inspired - brown borders, cozy farm aesthetic
const palettes = {
  'v4': {
    light: {
      primary: '#16a34a',     // Green-600 - healthy plant green
      secondary: '#2563eb',   // Blue-600 - water/sky
      accent: '#dc2626',      // Red-600 - ripe produce
      background: '#fef6e4',  // Warm cream - like old paper
      foreground: '#3d2914',  // Dark brown text
      card: '#fffef7',        // Off-white
      border: '#8b5a3c',      // Brown wood border
      borderDark: '#5c3a29',  // Darker brown for emphasis
      muted: '#a0826d',       // Muted brown
    },
    dark: {
      primary: '#22c55e',     
      secondary: '#3b82f6',   
      accent: '#ef4444',      
      background: '#1a1611',  // Very dark brown
      foreground: '#f5f2e8',
      card: '#2d2419',        // Dark brown card
      border: '#8b5a3c',      // Same brown border
      borderDark: '#a0826d',  // Lighter in dark mode
      muted: '#7c6555',
    }
  }
}

export default function V4ThemeDemo() {
  const [isDark, setIsDark] = useState(false)
  const palette = palettes['v4'][isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: palette.background, 
      color: palette.foreground,
      minHeight: '100vh',
      // Aged parchment with lines and stains
      backgroundImage: !isDark ? `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 30px,
          ${palette.border}20 30px,
          ${palette.border}20 31px
        ),
        radial-gradient(ellipse at 20% 30%, ${palette.border}05, transparent 40%),
        radial-gradient(ellipse at 80% 70%, ${palette.accent}03, transparent 40%),
        radial-gradient(ellipse at 50% 50%, ${palette.primary}02, transparent 60%)
      ` : `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 30px,
          ${palette.border}15 30px,
          ${palette.border}15 31px
        )
      `
    }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header with wooden frame style */}
        <div className="mb-8 p-6 rounded-xl" style={{
          backgroundColor: palette.card,
          border: `4px solid ${palette.border}`,
          boxShadow: `
            inset 0 2px 4px ${palette.borderDark}30,
            0 4px 8px ${palette.border}20
          `
        }}>
          <h1 className="text-4xl font-black mb-4">
            🌻 Plant Tracker
            <span className="text-sm font-bold ml-3 px-3 py-1 rounded-md inline-block"
              style={{
                backgroundColor: palette.background,
                color: palette.border,
                border: `2px solid ${palette.border}`
              }}>
              v4 - Stardew Style
            </span>
          </h1>

          <button
            onClick={() => setIsDark(!isDark)}
            className="px-5 py-2 rounded-md font-bold transition-all transform hover:scale-105"
            style={{
              backgroundColor: palette.border,
              color: palette.card,
              border: `2px solid ${palette.borderDark}`,
              boxShadow: `2px 2px 0 ${palette.borderDark}`
            }}
          >
            {isDark ? '🌙 Night Farm' : '☀️ Day Farm'}
          </button>
        </div>

        {/* Main Cards - Stardew UI style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Plant Card with wooden frame */}
          <div className="rounded-lg p-6" style={{ 
            backgroundColor: palette.card,
            border: `3px solid ${palette.border}`,
            boxShadow: `
              inset 0 1px 0 ${palette.borderDark}40,
              inset 0 -1px 0 ${palette.borderDark}40,
              0 4px 6px ${palette.border}20
            `,
            position: 'relative'
          }}>
            {/* Corner decorations */}
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              width: '12px',
              height: '12px',
              backgroundColor: palette.borderDark,
              borderRadius: '2px'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '12px',
              height: '12px',
              backgroundColor: palette.borderDark,
              borderRadius: '2px'
            }}></div>
            
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">🍅 Tomato Plant</h2>
              <span className="text-sm px-2 py-1 rounded font-bold" style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary,
                border: `2px solid ${palette.primary}`
              }}>
                Summer Crop
              </span>
            </div>
            
            <div className="space-y-2 mb-4 p-3 rounded" style={{
              backgroundColor: palette.background,
              border: `2px dashed ${palette.muted}`
            }}>
              <div className="flex justify-between">
                <span>💧 Water:</span>
                <span className="font-bold">Daily</span>
              </div>
              <div className="flex justify-between">
                <span>📅 Planted:</span>
                <span className="font-bold">Spring 15</span>
              </div>
              <div className="flex justify-between">
                <span>🌾 Harvest:</span>
                <span className="font-bold">Summer 2</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 rounded font-bold text-white transform hover:scale-105 transition-all" style={{
                backgroundColor: palette.primary,
                border: `2px solid ${palette.borderDark}`,
                boxShadow: `2px 2px 0 ${palette.borderDark}`
              }}>
                💧 Water
              </button>
              <button className="px-4 py-2 rounded font-bold transform hover:scale-105 transition-all" style={{
                backgroundColor: palette.card,
                color: palette.secondary,
                border: `2px solid ${palette.secondary}`,
                boxShadow: `2px 2px 0 ${palette.secondary}60`
              }}>
                📸 Photo
              </button>
            </div>
          </div>

          {/* Calendar/Schedule - Stardew style */}
          <div className="rounded-lg p-6" style={{ 
            backgroundColor: palette.card,
            border: `3px solid ${palette.border}`,
            boxShadow: `
              inset 0 1px 0 ${palette.borderDark}40,
              inset 0 -1px 0 ${palette.borderDark}40,
              0 4px 6px ${palette.border}20
            `
          }}>
            <h2 className="text-2xl font-bold mb-4">📅 Today's Tasks</h2>
            
            <div className="space-y-3">
              <div className="p-3 rounded flex items-center gap-3" style={{
                backgroundColor: palette.background,
                border: `2px solid ${palette.border}`
              }}>
                <span className="text-xl">💧</span>
                <div className="flex-1">
                  <div className="font-bold">Water Crops</div>
                  <div className="text-sm" style={{ color: palette.muted }}>5 plants need water</div>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              
              <div className="p-3 rounded flex items-center gap-3" style={{
                backgroundColor: palette.accent + '10',
                border: `2px solid ${palette.accent}60`
              }}>
                <span className="text-xl">🌾</span>
                <div className="flex-1">
                  <div className="font-bold">Harvest Ready!</div>
                  <div className="text-sm" style={{ color: palette.muted }}>Lettuce is ready</div>
                </div>
                <span className="px-2 py-1 bg-white rounded font-bold text-xs" style={{
                  color: palette.accent,
                  border: `1px solid ${palette.accent}`
                }}>NEW</span>
              </div>
              
              <div className="p-3 rounded flex items-center gap-3" style={{
                backgroundColor: palette.background,
                border: `2px solid ${palette.border}`
              }}>
                <span className="text-xl">🌱</span>
                <div className="flex-1">
                  <div className="font-bold">Plant Seeds</div>
                  <div className="text-sm" style={{ color: palette.muted }}>Carrots in bed 2</div>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats bar - Stardew valley style */}
        <div className="rounded-lg p-4" style={{
          backgroundColor: palette.card,
          border: `3px solid ${palette.border}`,
          boxShadow: `inset 0 2px 4px ${palette.borderDark}20`
        }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">🌱</div>
              <div className="font-bold text-lg">12</div>
              <div className="text-sm" style={{ color: palette.muted }}>Growing</div>
            </div>
            <div>
              <div className="text-2xl mb-1">💧</div>
              <div className="font-bold text-lg">5</div>
              <div className="text-sm" style={{ color: palette.muted }}>Need Water</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🌾</div>
              <div className="font-bold text-lg">2</div>
              <div className="text-sm" style={{ color: palette.muted }}>Ready</div>
            </div>
            <div>
              <div className="text-2xl mb-1">📸</div>
              <div className="font-bold text-lg">48</div>
              <div className="text-sm" style={{ color: palette.muted }}>Photos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}