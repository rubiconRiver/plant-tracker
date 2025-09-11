'use client'

import { useState } from 'react'

// v7: Fresh Market - Vibrant but professional, farmers market aesthetic
const palette = {
  light: {
    primary: '#16a34a',      // Green-600 - Fresh produce
    secondary: '#7c3aed',    // Violet-600 - Floral
    accent: '#dc2626',       // Red-600 - Ripe tomato
    background: '#fefefe',
    surface: '#ffffff',
    surfaceAlt: '#f0fdf4',   // Green tint
    border: '#e0e7ff',       // Violet tint border
    text: '#18181b',
    textSecondary: '#52525b',
  },
  dark: {
    primary: '#22c55e',
    secondary: '#a78bfa',
    accent: '#ef4444',
    background: '#09090b',
    surface: '#18181b',
    surfaceAlt: '#14532d',
    border: '#312e81',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
  }
}

export default function FreshMarket() {
  const [isDark, setIsDark] = useState(false)
  const colors = palette[isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text,
      minHeight: '100vh',
      // Playful dotted paper pattern
      backgroundImage: !isDark ? `
        radial-gradient(circle, ${colors.primary}15 1px, transparent 1px),
        radial-gradient(circle, ${colors.secondary}10 1px, transparent 1px)
      ` : `
        radial-gradient(circle, ${colors.primary}08 1px, transparent 1px)
      `,
      backgroundSize: !isDark ? '20px 20px, 20px 20px' : '30px 30px',
      backgroundPosition: !isDark ? '0 0, 10px 10px' : '0 0'
    }}>
      {/* Colorful Header Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
        borderBottom: `2px solid ${colors.border}`,
        padding: '2rem'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-black">
              🍃 Fresh Garden
              <span className="text-sm font-normal ml-3 px-2 py-1 rounded-full" style={{
                backgroundColor: colors.surface,
                color: colors.secondary,
                border: `2px solid ${colors.secondary}40`
              }}>v7</span>
            </h1>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full" style={{
              backgroundColor: colors.surface,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Growing', value: '18', color: colors.primary, icon: '🌱' },
              { label: 'Blooming', value: '6', color: colors.secondary, icon: '🌸' },
              { label: 'Ready', value: '3', color: colors.accent, icon: '🍅' },
              { label: 'This Week', value: '24°', color: colors.primary, icon: '☀️' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3" style={{
                backgroundColor: colors.surface,
                border: `2px solid ${stat.color}30`
              }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Market-style Plant Grid */}
        <h2 className="text-2xl font-bold mb-4">Your Garden Market</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Cherry Tomatoes', price: '3 ready', fresh: true, icon: '🍅' },
            { name: 'Fresh Basil', price: 'Growing', fresh: false, icon: '🌿' },
            { name: 'Bell Peppers', price: '2 weeks', fresh: false, icon: '🫑' },
            { name: 'Lettuce Mix', price: 'Tomorrow!', fresh: true, icon: '🥬' },
            { name: 'Strawberries', price: 'Flowering', fresh: false, icon: '🍓' },
            { name: 'Mint', price: 'Abundant', fresh: true, icon: '🌿' },
          ].map(item => (
            <div key={item.name} className="rounded-2xl p-4 transition-all hover:scale-105 cursor-pointer" style={{
              backgroundColor: item.fresh ? colors.surfaceAlt : colors.surface,
              border: `2px solid ${item.fresh ? colors.primary : colors.border}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-3xl">{item.icon}</span>
                {item.fresh && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{
                    backgroundColor: colors.accent,
                    color: '#ffffff'
                  }}>FRESH</span>
                )}
              </div>
              <h3 className="font-bold mb-1">{item.name}</h3>
              <p className="text-sm font-medium" style={{ color: item.fresh ? colors.primary : colors.textSecondary }}>
                {item.price}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Calendar - Market Board Style */}
        <div className="mt-8 rounded-2xl p-6" style={{
          backgroundColor: colors.surface,
          border: `3px solid ${colors.secondary}30`,
          background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.secondary}05 100%)`
        }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span style={{ color: colors.secondary }}>📅</span>
            Market Week Schedule
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-xs font-bold mb-2" style={{ color: colors.secondary }}>{day}</div>
                <div className="rounded-xl p-3" style={{
                  backgroundColor: i === 5 ? colors.accent + '10' : colors.background,
                  border: `2px solid ${i === 5 ? colors.accent + '40' : colors.border}`
                }}>
                  <div className="font-bold">{11 + i}</div>
                  {i === 5 && (
                    <div className="text-xs mt-1" style={{ color: colors.accent }}>
                      Harvest Day!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}