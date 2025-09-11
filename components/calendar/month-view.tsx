'use client'

import { useState, useEffect } from 'react'
import { getMilestone, getWeeklySummary } from './celebrations'

interface Milestone {
  type: string
  message: string
  emoji: string
  subtle?: boolean
}

interface CalendarEvent {
  id: string
  date: string
  type: 'water' | 'harvest' | 'planted' | 'germination' | 'photo' | 'photo-reminder' | 'status'
  plantId: string
  plantName: string
  description: string
  status?: string
}

const eventColors = {
  water: 'bg-blue-500',
  harvest: 'bg-orange-500',
  planted: 'bg-green-500',
  germination: 'bg-lime-500',
  photo: 'bg-pink-500',
  'photo-reminder': 'bg-purple-500',
  status: 'bg-yellow-500'
}

const getPlantEmoji = (plantName: string) => {
  const name = plantName.toLowerCase()
  if (name.includes('tomato')) return '🍅'
  if (name.includes('pepper')) return '🌶️'
  if (name.includes('lettuce')) return '🥬'
  if (name.includes('carrot')) return '🥕'
  if (name.includes('cucumber')) return '🥒'
  if (name.includes('basil')) return '🌿'
  if (name.includes('herb')) return '🌿'
  return '🌱'
}

export default function CalendarMonthView({ date }: { date: Date }) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const year = date.getFullYear()
  const month = date.getMonth()
  
  // Get first day of month and how many days in month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  // Fetch events when date changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const start = new Date(year, month, 1).toISOString()
      const end = new Date(year, month + 1, 0).toISOString()
      
      try {
        const response = await fetch(`/api/calendar?start=${start}&end=${end}`)
        const data = await response.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [year, month])
  
  // Generate calendar days
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }
  
  const today = new Date()
  const isToday = (day: number) => {
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate()
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }
  
  // Check for milestones
  const getDayMilestones = (day: number) => {
    const dayEvents = getEventsForDay(day)
    const milestones: Milestone[] = []
    
    dayEvents.forEach(event => {
      const milestone = getMilestone(event, events)
      if (milestone) {
        milestones.push(milestone)
      }
    })
    
    return milestones
  }
  
  // Calculate stats
  const waterCount = events.filter(e => e.type === 'water').length
  const harvestCount = events.filter(e => e.type === 'harvest').length
  const photoCount = events.filter(e => e.type === 'photo' || e.type === 'photo-reminder').length
  const plantedCount = events.filter(e => e.type === 'planted').length
  
  // Get monthly achievements
  const monthlyAchievements = getWeeklySummary(events)

  return (
    <div className="space-y-4">
      {/* Monthly Achievements - Subtle celebration */}
      {!loading && monthlyAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-sm font-medium text-green-800 italic">
                {monthlyAchievements[0].message}
              </p>
              {monthlyAchievements.length > 1 && (
                <p className="text-xs text-green-600 mt-1">
                  + {monthlyAchievements.length - 1} more achievement{monthlyAchievements.length > 2 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-900 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const events = day ? getEventsForDay(day) : []
          const milestones = day ? getDayMilestones(day) : []
          const hasMany = events.length > 2
          const hasMilestone = milestones.length > 0
          
          return (
            <div
              key={index}
              className={`
                min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2
                ${day ? 'bg-gray-50 hover:bg-green-50' : ''}
                ${isToday(day || 0) ? 'bg-green-100 ring-2 ring-green-500' : ''}
                ${hasMilestone ? 'bg-gradient-to-br from-green-50 to-emerald-50' : ''}
                rounded-lg transition-colors cursor-pointer relative
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start">
                    <div className={`text-xs sm:text-sm font-medium ${isToday(day) ? 'text-green-700' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    {hasMilestone && (
                      <div className="hidden sm:block">
                        <span className="text-xs" title={milestones[0].message}>
                          {milestones[0].emoji}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Events */}
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="flex items-center gap-0.5"
                        title={`${event.type}: ${event.plantName}`}
                      >
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${eventColors[event.type]}`}></div>
                        <span className="text-[10px] sm:text-xs truncate hidden sm:block">
                          {getPlantEmoji(event.plantName)} {event.plantName}
                        </span>
                        <span className="text-[10px] sm:hidden">{getPlantEmoji(event.plantName)}</span>
                      </div>
                    ))}
                    {hasMany && (
                      <div className="text-[10px] text-gray-500 font-medium">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Mobile: Show dot indicators */}
                  <div className="flex gap-0.5 mt-1 sm:hidden">
                    {events.map(event => (
                      <div
                        key={event.id}
                        className={`w-1.5 h-1.5 rounded-full ${eventColors[event.type]}`}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Quick Stats */}
      {!loading && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl mb-1">💧</div>
            <div className="text-sm font-semibold text-gray-900">{waterCount} waterings</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl mb-1">🌾</div>
            <div className="text-sm font-semibold text-gray-900">{harvestCount} harvests</div>
            <div className="text-xs text-gray-500">Expected</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-sm font-semibold text-gray-900">{plantedCount} planted</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl mb-1">📸</div>
            <div className="text-sm font-semibold text-gray-900">{photoCount} photos</div>
            <div className="text-xs text-gray-500">Scheduled</div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}