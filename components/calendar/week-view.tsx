'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CalendarEvent {
  id: string
  date: string
  type: 'water' | 'harvest' | 'planted' | 'germination' | 'photo' | 'photo-reminder' | 'status'
  plantId: string
  plantName: string
  description: string
  status?: string
}

const eventStyles = {
  water: 'bg-blue-100 border-blue-300 text-blue-900',
  harvest: 'bg-orange-100 border-orange-300 text-orange-900',
  planted: 'bg-green-100 border-green-300 text-green-900',
  germination: 'bg-lime-100 border-lime-300 text-lime-900',
  photo: 'bg-pink-100 border-pink-300 text-pink-900',
  'photo-reminder': 'bg-purple-100 border-purple-300 text-purple-900',
  status: 'bg-yellow-100 border-yellow-300 text-yellow-900'
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

const getEventEmoji = (type: string) => {
  switch(type) {
    case 'water': return '💧'
    case 'harvest': return '🌾'
    case 'planted': return '🌰'
    case 'germination': return '🌱'
    case 'photo': return '📸'
    case 'photo-reminder': return '📷'
    case 'status': return '📊'
    default: return '🌿'
  }
}

export default function CalendarWeekView({ date }: { date: Date }) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Get the week dates
  const getWeekDates = () => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }
  
  const weekDates = getWeekDates()
  
  // Fetch events when date changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const start = weekDates[0].toISOString()
      const end = weekDates[6].toISOString()
      
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
  }, [date, weekDates])
  
  const today = new Date()
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }
  
  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  // Calculate week stats
  const waterCount = events.filter(e => e.type === 'water').length
  const harvestCount = events.filter(e => e.type === 'harvest').length
  const photoCount = events.filter(e => e.type === 'photo' || e.type === 'photo-reminder').length
  const plantedCount = events.filter(e => e.type === 'planted').length

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const date = weekDates[index]
            const dayEvents = getEventsForDay(date)
            const isTodayCol = isToday(date)
            
            return (
              <div key={day} className="space-y-2">
                <div className={`text-center pb-2 border-b-2 ${isTodayCol ? 'border-green-500' : 'border-gray-200'}`}>
                  <div className="text-sm font-semibold text-gray-900">{day}</div>
                  <div className={`text-lg font-bold ${isTodayCol ? 'text-green-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                  {isTodayCol && (
                    <div className="text-xs text-green-600 font-medium">Today</div>
                  )}
                </div>
                
                <div className="space-y-2 min-h-[300px]">
                  {dayEvents.map(event => (
                    <Link
                      key={event.id}
                      href={`/plants/${event.plantId}`}
                      className={`
                        block p-2 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md
                        ${eventStyles[event.type]}
                      `}
                    >
                      <div className="text-lg text-center mb-1">{getPlantEmoji(event.plantName)}</div>
                      <div className="text-xs font-medium">{event.plantName}</div>
                      <div className="text-[10px] opacity-75">{event.type.replace('-', ' ')}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile/Tablet View - List Style */}
      <div className="lg:hidden space-y-3">
        {weekDays.map((day, index) => {
          const date = weekDates[index]
          const dayEvents = getEventsForDay(date)
          const isTodayCard = isToday(date)
          
          return (
            <div
              key={day}
              className={`
                bg-white rounded-xl shadow-sm p-4
                ${isTodayCard ? 'ring-2 ring-green-500' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{day}</div>
                    <div className="text-sm text-gray-500">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  {isTodayCard && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {dayEvents.length} task{dayEvents.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <Link
                      key={event.id}
                      href={`/plants/${event.plantId}`}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${eventStyles[event.type]}
                      `}
                    >
                      <div className="text-xl">{getPlantEmoji(event.plantName)}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {event.plantName}
                        </div>
                        <div className="text-xs opacity-75">
                          {getEventEmoji(event.type)} {event.type.replace('-', ' ')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No tasks scheduled
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Week Summary */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Week at a Glance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl">💧</div>
              <div>
                <div className="text-xl font-bold text-blue-900">{waterCount}</div>
                <div className="text-xs text-blue-700">Waterings</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg">
              <div className="text-2xl">🌾</div>
              <div>
                <div className="text-xl font-bold text-orange-900">{harvestCount}</div>
                <div className="text-xs text-orange-700">Harvests</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-pink-50 p-3 rounded-lg">
              <div className="text-2xl">📸</div>
              <div>
                <div className="text-xl font-bold text-pink-900">{photoCount}</div>
                <div className="text-xs text-pink-700">Photos Due</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
              <div className="text-2xl">🌱</div>
              <div>
                <div className="text-xl font-bold text-green-900">{plantedCount}</div>
                <div className="text-xs text-green-700">New Plantings</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}