'use client'

import { useState } from 'react'
import CalendarWeekView from '@/components/calendar/week-view'
import CalendarMonthView from '@/components/calendar/month-view'
import CalendarYearView from '@/components/calendar/year-view'

type ViewType = 'week' | 'month' | 'year'

export default function CalendarPage() {
  const [view, setView] = useState<ViewType>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">🌱</span>
              Garden Calendar
            </h1>
            
            {/* View Switcher */}
            <div className="flex items-center gap-2 bg-green-50 p-1 rounded-lg">
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md transition-all ${
                  view === 'week' 
                    ? 'bg-white text-green-700 shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-md transition-all ${
                  view === 'month' 
                    ? 'bg-white text-green-700 shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('year')}
                className={`px-4 py-2 rounded-md transition-all ${
                  view === 'year' 
                    ? 'bg-white text-green-700 shadow-sm font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => navigate('prev')}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-lg font-semibold text-gray-800">
              {view === 'year' && currentDate.getFullYear()}
              {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {view === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </h2>
            
            <button
              onClick={() => navigate('next')}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === 'week' && <CalendarWeekView date={currentDate} />}
        {view === 'month' && <CalendarMonthView date={currentDate} />}
        {view === 'year' && <CalendarYearView date={currentDate} />}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Watering Due</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Check Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Expected Harvest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Planted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Fertilize</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}