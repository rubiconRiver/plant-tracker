'use client'

import { useState } from 'react'

// v5: Modern Botanical - Professional, clean, mass-market ready
const palette = {
  light: {
    primary: '#059669',      // Emerald-600 - Professional green
    secondary: '#0891b2',    // Cyan-600 - Water/tech
    accent: '#f97316',       // Orange-500 - Warm accent
    success: '#22c55e',      // Green-500
    warning: '#eab308',      // Yellow-500
    danger: '#ef4444',       // Red-500
    background: '#fafafa',   // Clean grey
    surface: '#ffffff',      
    surfaceHover: '#f9fafb',
    border: '#e5e7eb',       // Grey-200
    borderHover: '#d1d5db',  // Grey-300
    text: '#111827',         // Grey-900
    textSecondary: '#6b7280', // Grey-500
    textMuted: '#9ca3af',    // Grey-400
  },
  dark: {
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#fb923c',
    success: '#4ade80',
    warning: '#facc15',
    danger: '#f87171',
    background: '#0a0a0a',
    surface: '#171717',
    surfaceHover: '#262626',
    border: '#404040',
    borderHover: '#525252',
    text: '#f3f4f6',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
  }
}

export default function ModernBotanical() {
  const [isDark, setIsDark] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const colors = palette[isDark ? 'dark' : 'light']

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      // Subtle grid paper background
      backgroundImage: !isDark ? `
        linear-gradient(${colors.border}40 1px, transparent 1px),
        linear-gradient(90deg, ${colors.border}40 1px, transparent 1px)
      ` : 'none',
      backgroundSize: '20px 20px',
      backgroundPosition: '-1px -1px'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '1rem'
      }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span style={{ color: colors.primary }}>🌿</span>
              PlantTracker
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: colors.primary + '20',
                color: colors.primary,
                border: `1px solid ${colors.primary}40`
              }}>v5</span>
            </h1>
            <div className="flex gap-1">
              {['Dashboard', 'Calendar', 'Plants'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view.toLowerCase())}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: activeView === view.toLowerCase() ? colors.primary + '15' : 'transparent',
                    color: activeView === view.toLowerCase() ? colors.primary : colors.textSecondary,
                    border: activeView === view.toLowerCase() ? `1px solid ${colors.primary}30` : '1px solid transparent'
                  }}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: colors.surfaceHover,
              border: `1px solid ${colors.border}`
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Plants', value: '24', icon: '🌱', color: colors.primary },
                { label: 'Ready to Harvest', value: '3', icon: '🌾', color: colors.accent },
                { label: 'Need Water', value: '8', icon: '💧', color: colors.secondary },
                { label: 'Photos This Week', value: '12', icon: '📸', color: colors.warning }
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-4" style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: stat.color + '15',
                      color: stat.color
                    }}>
                      +12%
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl p-6" style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}>
              <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {[
                  { time: '9:00 AM', task: 'Water tomatoes and peppers', status: 'completed', icon: '💧' },
                  { time: '2:00 PM', task: 'Take weekly photos', status: 'pending', icon: '📸' },
                  { time: '4:00 PM', task: 'Check lettuce for harvest', status: 'pending', icon: '🌾' },
                ].map(task => (
                  <div key={task.time} className="flex items-center gap-4 p-3 rounded-lg" style={{
                    backgroundColor: task.status === 'completed' ? colors.success + '10' : colors.surfaceHover,
                    border: `1px solid ${task.status === 'completed' ? colors.success + '30' : colors.border}`
                  }}>
                    <span className="text-xl">{task.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium" style={{
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        opacity: task.status === 'completed' ? 0.6 : 1
                      }}>{task.task}</div>
                      <div className="text-sm" style={{ color: colors.textMuted }}>{task.time}</div>
                    </div>
                    {task.status === 'completed' && (
                      <span style={{ color: colors.success }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="rounded-xl p-6" style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`
          }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">September 2025</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg" style={{
                  backgroundColor: colors.surfaceHover,
                  border: `1px solid ${colors.border}`
                }}>←</button>
                <button className="px-4 py-2 rounded-lg font-medium" style={{
                  backgroundColor: colors.primary,
                  color: '#ffffff'
                }}>Today</button>
                <button className="p-2 rounded-lg" style={{
                  backgroundColor: colors.surfaceHover,
                  border: `1px solid ${colors.border}`
                }}>→</button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium" style={{ 
                  color: colors.textSecondary 
                }}>
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3 // Start on Thursday
                const isToday = day === 11
                const hasEvent = [5, 11, 15, 20, 25].includes(day)
                
                return (
                  <div key={i} className="aspect-square p-2 rounded-lg border transition-all cursor-pointer hover:shadow-sm" style={{
                    backgroundColor: isToday ? colors.primary + '10' : colors.surface,
                    border: `1px solid ${isToday ? colors.primary : colors.border}`,
                    opacity: day < 1 || day > 30 ? 0.3 : 1
                  }}>
                    {day > 0 && day <= 30 && (
                      <>
                        <div className="text-sm font-medium" style={{
                          color: isToday ? colors.primary : colors.text
                        }}>
                          {day}
                        </div>
                        {hasEvent && (
                          <div className="mt-1 space-y-0.5">
                            {day === 11 && (
                              <div className="text-xs truncate" style={{ color: colors.secondary }}>
                                💧 Water
                              </div>
                            )}
                            {day === 15 && (
                              <div className="text-xs truncate" style={{ color: colors.accent }}>
                                🌾 Harvest
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeView === 'plants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Tomato', status: 'Fruiting', planted: '45 days ago', icon: '🍅' },
              { name: 'Lettuce', status: 'Ready', planted: '30 days ago', icon: '🥬' },
              { name: 'Basil', status: 'Growing', planted: '20 days ago', icon: '🌿' },
              { name: 'Peppers', status: 'Flowering', planted: '38 days ago', icon: '🌶️' },
              { name: 'Carrots', status: 'Seedling', planted: '10 days ago', icon: '🥕' },
              { name: 'Cucumber', status: 'Growing', planted: '25 days ago', icon: '🥒' },
            ].map(plant => (
              <div key={plant.name} className="rounded-xl p-5 transition-all hover:shadow-lg cursor-pointer" style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{plant.icon}</div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                    backgroundColor: plant.status === 'Ready' ? colors.success + '20' : colors.primary + '15',
                    color: plant.status === 'Ready' ? colors.success : colors.primary
                  }}>
                    {plant.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{plant.name}</h3>
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  {plant.planted}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-lg text-sm font-medium" style={{
                    backgroundColor: colors.primary + '15',
                    color: colors.primary
                  }}>
                    💧 Water
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg text-sm font-medium" style={{
                    backgroundColor: colors.surfaceHover,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`
                  }}>
                    📸 Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}