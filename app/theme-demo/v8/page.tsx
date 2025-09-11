'use client'

import { useState } from 'react'

// v8: Garden Journal - Sophisticated, paper-like, timeless
const palette = {
  light: {
    primary: '#15803d',      // Green-700 - Ink green
    secondary: '#6366f1',    // Indigo-500 - Ink blue
    accent: '#be123c',       // Rose-700 - Pressed flower
    background: '#fffbf5',   // Antique paper
    surface: '#ffffff',
    border: '#d4c5b9',       // Aged paper edge
    text: '#292524',         // Ink black
    textSecondary: '#57534e',
  },
  dark: {
    primary: '#22c55e',
    secondary: '#818cf8',
    accent: '#fb7185',
    background: '#1c1917',
    surface: '#292524',
    border: '#57534e',
    text: '#fef3c7',
    textSecondary: '#d6d3d1',
  }
}

export default function GardenJournal() {
  const [isDark, setIsDark] = useState(false)
  const colors = palette[isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text,
      minHeight: '100vh',
      fontFamily: 'Georgia, serif',
      backgroundImage: !isDark ? `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 28px,
          ${colors.border}40 28px,
          ${colors.border}40 29px
        )
      ` : 'none'
    }}>
      {/* Journal Header */}
      <header className="p-8 text-center" style={{
        borderBottom: `3px double ${colors.border}`
      }}>
        <h1 className="text-4xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Garden Journal
        </h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Season 2025 • Entry v8
        </p>
        <button onClick={() => setIsDark(!isDark)} className="mt-4 px-3 py-1 rounded text-sm" style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}>
          {isDark ? '☀️ Day' : '🌙 Night'} Reading
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        {/* Today's Entry */}
        <div className="mb-8 p-6 rounded" style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: '2px 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                Wednesday, September 11th
              </h2>
              <p className="text-sm italic" style={{ color: colors.textSecondary }}>
                Clear skies, 72°F, gentle breeze
              </p>
            </div>
            <span className="text-3xl">🌤️</span>
          </div>
          
          <div className="space-y-4" style={{ lineHeight: '1.8' }}>
            <div className="flex gap-4">
              <span style={{ color: colors.primary, fontWeight: 'bold' }}>Morning:</span>
              <p>The tomatoes are showing excellent progress. Three fruits ripening nicely.</p>
            </div>
            <div className="flex gap-4">
              <span style={{ color: colors.secondary, fontWeight: 'bold' }}>Afternoon:</span>
              <p>Planted new row of lettuce seedlings. Watered all beds thoroughly.</p>
            </div>
            <div className="flex gap-4">
              <span style={{ color: colors.accent, fontWeight: 'bold' }}>Notes:</span>
              <p className="italic">Aphids spotted on roses - treat tomorrow morning.</p>
            </div>
          </div>
        </div>

        {/* Plant Registry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded" style={{
            backgroundColor: colors.surface,
            border: `1px dashed ${colors.border}`
          }}>
            <h3 className="text-lg mb-3 pb-2" style={{
              borderBottom: `1px solid ${colors.border}`,
              fontFamily: 'Georgia, serif'
            }}>
              Active Plantings
            </h3>
            <div className="space-y-2 text-sm">
              {[
                'Beefsteak Tomato - Day 45',
                'Romaine Lettuce - Day 21',
                'Sweet Basil - Day 18',
                'Bell Pepper - Day 38'
              ].map(plant => (
                <div key={plant} className="flex items-center gap-2">
                  <span style={{ color: colors.primary }}>•</span>
                  <span>{plant}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-5 rounded" style={{
            backgroundColor: colors.accent + '08',
            border: `1px dashed ${colors.accent}40`
          }}>
            <h3 className="text-lg mb-3 pb-2" style={{
              borderBottom: `1px solid ${colors.accent}40`,
              fontFamily: 'Georgia, serif'
            }}>
              Upcoming Harvests
            </h3>
            <div className="space-y-2 text-sm">
              {[
                'Sept 15 - Lettuce (3 heads)',
                'Sept 20 - Tomatoes (6-8)',
                'Sept 22 - Basil (pruning)',
                'Sept 28 - Peppers (first)'
              ].map(harvest => (
                <div key={harvest} className="flex items-center gap-2">
                  <span style={{ color: colors.accent }}>→</span>
                  <span>{harvest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Calendar Sketch */}
        <div className="p-6 rounded" style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}>
          <h3 className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            September Garden Calendar
          </h3>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center p-1 font-bold" style={{ color: colors.textSecondary }}>
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="aspect-square p-1 text-center border rounded" style={{
                borderColor: colors.border,
                backgroundColor: i === 10 ? colors.primary + '10' : 'transparent'
              }}>
                <div>{i + 1}</div>
                {[4, 10, 14, 19, 27].includes(i) && (
                  <div className="text-xs">•</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}