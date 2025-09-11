'use client'

import { useState } from 'react'

// More organic, earthy palettes
const palettes = {
  'Garden Party': {
    light: {
      primary: '#10b981',
      secondary: '#3b82f6', 
      accent: '#f59e0b',
      background: '#f4f1e8',  // Warm cream/beige - like parchment
      foreground: '#1a1a0a',
      card: '#fefdf8',       // Slightly warmer white
      muted: '#8b7355',      // Earthy brown
    },
    dark: {
      primary: '#34d399',
      secondary: '#60a5fa',
      accent: '#fbbf24',
      background: '#1a1815',  // Dark brown/green - like rich soil
      foreground: '#f5f2e8',
      card: '#252320',       // Dark earth
      muted: '#7c6f5d',      // Muted brown
    }
  }
}

export default function OrganicThemeDemo() {
  const [isDark, setIsDark] = useState(false)
  const palette = palettes['Garden Party'][isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: palette.background, 
      color: palette.foreground,
      minHeight: '100vh',
      // Organic texture - like paper or canvas
      backgroundImage: isDark 
        ? `radial-gradient(circle at 20% 80%, #34d39910, transparent 50%),
           radial-gradient(circle at 80% 20%, #60a5fa08, transparent 50%),
           radial-gradient(circle at 40% 40%, #fbbf2405, transparent 50%)`
        : `radial-gradient(circle at 20% 80%, #10b98110, transparent 50%),
           radial-gradient(circle at 80% 20%, #3b82f608, transparent 50%),
           radial-gradient(circle at 40% 40%, #f59e0b05, transparent 50%)`
    }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Playful Header */}
        <div className="mb-8 relative">
          <div className="absolute -top-2 -left-2 text-6xl opacity-20 rotate-12">🌱</div>
          <h1 className="text-4xl font-black mb-4 relative">
            Plant Tracker
            <span className="text-sm font-normal ml-3 px-3 py-1 rounded-full inline-block rotate-2 shadow-lg"
              style={{
                backgroundColor: palette.accent,
                color: '#ffffff',
                boxShadow: `4px 4px 0 ${palette.primary}40`
              }}>
              Theme Explorer
            </span>
          </h1>

          {/* Organic Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 hover:rotate-1"
            style={{
              backgroundColor: palette.secondary,
              color: '#ffffff',
              boxShadow: `6px 6px 0 ${palette.primary}40, 6px 6px 20px ${palette.secondary}20`
            }}
          >
            {isDark ? '🌙 Night Garden' : '☀️ Day Garden'}
          </button>
        </div>

        {/* Thick Border Cards with Personality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Plant Card - Chunky & Fun */}
          <div className="rounded-3xl p-6 transform hover:-rotate-1 transition-transform" style={{ 
            backgroundColor: palette.card,
            border: `4px solid ${palette.primary}`,
            boxShadow: `8px 8px 0 ${palette.primary}30, 12px 12px 30px ${palette.primary}10`
          }}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black">Tomato Plant</h2>
              <span className="text-3xl transform rotate-12 inline-block">🍅</span>
            </div>
            
            <div className="flex gap-3 mb-4 flex-wrap">
              <span className="px-4 py-2 rounded-full text-sm font-bold transform rotate-2 inline-block" style={{
                backgroundColor: palette.primary + '20',
                color: palette.primary,
                border: `2px dashed ${palette.primary}`
              }}>
                🌱 Growing Strong!
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-bold transform -rotate-1 inline-block" style={{
                backgroundColor: palette.accent + '20',
                color: palette.accent,
                border: `2px solid ${palette.accent}`
              }}>
                🎉 14 days to harvest!
              </span>
            </div>
            
            <div className="space-y-2 mb-4 p-4 rounded-2xl" style={{
              backgroundColor: palette.background,
              border: `2px dotted ${palette.muted}40`
            }}>
              <p className="font-medium">📅 Planted 3 weeks ago</p>
              <p className="font-medium">💧 Last watered yesterday</p>
              <p className="font-medium">📸 12 photos taken</p>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-xl font-bold text-white transform hover:scale-110 transition-all" style={{
                backgroundColor: palette.primary,
                boxShadow: `4px 4px 0 ${palette.primary}60`
              }}>
                Water Now! 💧
              </button>
              <button className="px-6 py-3 rounded-xl font-bold transform hover:scale-110 transition-all" style={{
                backgroundColor: 'transparent',
                color: palette.secondary,
                border: `3px solid ${palette.secondary}`,
              }}>
                📸 Snap!
              </button>
            </div>
          </div>

          {/* Calendar Preview - Playful */}
          <div className="rounded-3xl p-6 transform hover:rotate-1 transition-transform" style={{ 
            backgroundColor: palette.card,
            border: `4px solid ${palette.secondary}`,
            boxShadow: `8px 8px 0 ${palette.secondary}30, 12px 12px 30px ${palette.secondary}10`
          }}>
            <h2 className="text-2xl font-black mb-4">This Week 🗓️</h2>
            
            <div className="space-y-3">
              <div className="p-3 rounded-2xl flex items-center gap-3" style={{
                backgroundColor: palette.primary + '15',
                border: `2px solid ${palette.primary}40`
              }}>
                <span className="text-2xl">💧</span>
                <div>
                  <div className="font-bold">Today - Water Day!</div>
                  <div className="text-sm opacity-70">5 plants thirsty</div>
                </div>
              </div>
              
              <div className="p-3 rounded-2xl flex items-center gap-3" style={{
                backgroundColor: palette.accent + '15',
                border: `2px solid ${palette.accent}40`
              }}>
                <span className="text-2xl">🌾</span>
                <div>
                  <div className="font-bold">Thursday - Harvest!</div>
                  <div className="text-sm opacity-70">Lettuce ready</div>
                </div>
              </div>
              
              <div className="p-3 rounded-2xl flex items-center gap-3" style={{
                backgroundColor: palette.secondary + '15',
                border: `2px solid ${palette.secondary}40`
              }}>
                <span className="text-2xl">📸</span>
                <div>
                  <div className="font-bold">Saturday - Photo Day</div>
                  <div className="text-sm opacity-70">Document growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Banner - Celebratory */}
        <div className="rounded-3xl p-6 mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-transform" style={{
          background: `linear-gradient(135deg, ${palette.primary}15 0%, ${palette.accent}15 100%)`,
          border: `3px solid ${palette.primary}`,
          boxShadow: `0 10px 40px ${palette.primary}20`
        }}>
          <div className="absolute -top-6 -right-6 text-8xl opacity-10 rotate-12">🏆</div>
          <div className="relative">
            <h3 className="text-xl font-black mb-2">🎉 Garden Milestone!</h3>
            <p className="text-lg italic">"First tomato flowers appearing - harvest season approaches!"</p>
            <div className="flex gap-4 mt-4">
              <span className="font-bold">🌱 12 plants growing</span>
              <span className="font-bold">📸 48 photos this month</span>
              <span className="font-bold">💧 Never missed watering</span>
            </div>
          </div>
        </div>

        {/* Status Pills - More Fun */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Seedling', emoji: '🌱', color: palette.primary },
            { label: 'Flowering', emoji: '🌸', color: '#ec4899' },
            { label: 'Fruiting', emoji: '🍅', color: palette.accent },
            { label: 'Harvest', emoji: '🌾', color: '#84cc16' }
          ].map(status => (
            <div key={status.label} 
              className="rounded-2xl p-4 text-center font-bold transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer"
              style={{
                backgroundColor: status.color + '20',
                border: `3px solid ${status.color}`,
                boxShadow: `4px 4px 0 ${status.color}40`
              }}>
              <div className="text-3xl mb-2">{status.emoji}</div>
              <div style={{ color: status.color }}>{status.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}