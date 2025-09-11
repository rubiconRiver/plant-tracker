'use client'

import Link from 'next/link'

const themes = [
  { 
    id: 'v5', 
    name: 'Modern Botanical',
    description: 'Clean, professional, subtle nature',
    colors: ['#059669', '#0891b2', '#f97316'],
  },
  { 
    id: 'v6', 
    name: 'Earthy Minimal',
    description: 'Understated elegance with warm browns',
    colors: ['#65a30d', '#8b5a3c', '#ea580c'],
  },
  { 
    id: 'v7', 
    name: 'Fresh Market',
    description: 'Vibrant but professional, farmers market feel',
    colors: ['#16a34a', '#7c3aed', '#dc2626'],
  },
  { 
    id: 'v8', 
    name: 'Garden Journal',
    description: 'Sophisticated paper texture, timeless',
    colors: ['#15803d', '#6366f1', '#be123c'],
  },
  { 
    id: 'v9', 
    name: 'Nordic Garden',
    description: 'Minimalist, muted, Scandinavian',
    colors: ['#4d7c0f', '#475569', '#b45309'],
  },
  // Previous versions
  { 
    id: 'organic', 
    name: 'v1 - Original',
    description: 'Playful with thick borders',
    colors: ['#059669', '#0891b2', '#ea580c'],
  },
  { 
    id: 'v2', 
    name: 'v2 - Forest',
    description: 'Deep forest green',
    colors: ['#15803d', '#1e40af', '#dc2626'],
  },
  { 
    id: 'v3', 
    name: 'v3 - Sage',
    description: 'Herb/botanical green',
    colors: ['#65a30d', '#7c3aed', '#c2410c'],
  },
  { 
    id: 'v4', 
    name: 'v4 - Stardew',
    description: 'Game-inspired brown borders',
    colors: ['#16a34a', '#2563eb', '#8b5a3c'],
  },
]

export default function ThemeSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Plant Tracker Themes
          </h1>
          <p className="text-xl text-gray-600">
            Choose your perfect garden aesthetic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/theme-demo/${theme.id}`}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 block"
            >
              <div className="flex gap-2 mb-4">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {theme.name}
              </h2>
              <p className="text-gray-600 text-sm">
                {theme.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}