'use client'

interface CalendarEvent {
  id: string
  type: 'water' | 'harvest' | 'planted' | 'fertilize' | 'check'
  plantName: string
  emoji?: string
}

// Mock data - will be replaced with real data
const mockEvents: Record<string, CalendarEvent[]> = {
  '2025-01-15': [
    { id: '1', type: 'water', plantName: 'Tomatoes', emoji: '🍅' },
    { id: '2', type: 'check', plantName: 'Basil', emoji: '🌿' }
  ],
  '2025-01-20': [
    { id: '3', type: 'harvest', plantName: 'Lettuce', emoji: '🥬' }
  ],
  '2025-01-25': [
    { id: '4', type: 'planted', plantName: 'Peppers', emoji: '🌶️' }
  ],
  '2025-01-28': [
    { id: '5', type: 'fertilize', plantName: 'Tomatoes', emoji: '🍅' },
    { id: '6', type: 'water', plantName: 'Carrots', emoji: '🥕' },
    { id: '7', type: 'water', plantName: 'Cucumber', emoji: '🥒' }
  ]
}

const eventColors = {
  water: 'bg-blue-500',
  harvest: 'bg-orange-500',
  planted: 'bg-green-500',
  fertilize: 'bg-purple-500',
  check: 'bg-yellow-500'
}

export default function CalendarMonthView({ date }: { date: Date }) {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  // Get first day of month and how many days in month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
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
    return mockEvents[dateStr] || []
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const events = day ? getEventsForDay(day) : []
          const hasMany = events.length > 2
          
          return (
            <div
              key={index}
              className={`
                min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] p-1 sm:p-2
                ${day ? 'bg-gray-50 hover:bg-green-50' : ''}
                ${isToday(day || 0) ? 'bg-green-100 ring-2 ring-green-500' : ''}
                rounded-lg transition-colors cursor-pointer relative
              `}
            >
              {day && (
                <>
                  <div className={`text-xs sm:text-sm font-medium ${isToday(day) ? 'text-green-700' : 'text-gray-700'}`}>
                    {day}
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
                          {event.emoji} {event.plantName}
                        </span>
                        <span className="text-[10px] sm:hidden">{event.emoji}</span>
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
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl mb-1">💧</div>
          <div className="text-sm font-semibold text-gray-700">3 plants</div>
          <div className="text-xs text-gray-500">Need water this week</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-2xl mb-1">🌾</div>
          <div className="text-sm font-semibold text-gray-700">2 harvests</div>
          <div className="text-xs text-gray-500">Expected this month</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl mb-1">🌱</div>
          <div className="text-sm font-semibold text-gray-700">5 seedlings</div>
          <div className="text-xs text-gray-500">In germination</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-2xl mb-1">📸</div>
          <div className="text-sm font-semibold text-gray-700">8 photos</div>
          <div className="text-xs text-gray-500">Due this week</div>
        </div>
      </div>
    </div>
  )
}