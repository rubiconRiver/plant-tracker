'use client'

interface DayEvent {
  id: string
  type: 'water' | 'harvest' | 'planted' | 'fertilize' | 'check' | 'photo'
  plantName: string
  emoji?: string
  time?: string
  completed?: boolean
}

// Mock weekly data
const mockWeekEvents: Record<string, DayEvent[]> = {
  'Mon': [
    { id: '1', type: 'water', plantName: 'Tomatoes', emoji: '🍅', time: 'Morning', completed: true },
    { id: '2', type: 'photo', plantName: 'Basil', emoji: '🌿', time: 'Afternoon' },
    { id: '3', type: 'check', plantName: 'Peppers', emoji: '🌶️', time: 'Evening' }
  ],
  'Tue': [
    { id: '4', type: 'water', plantName: 'Carrots', emoji: '🥕', time: 'Morning' }
  ],
  'Wed': [
    { id: '5', type: 'fertilize', plantName: 'Tomatoes', emoji: '🍅', time: 'Morning' },
    { id: '6', type: 'harvest', plantName: 'Lettuce', emoji: '🥬', time: 'Afternoon' }
  ],
  'Thu': [
    { id: '7', type: 'water', plantName: 'Cucumber', emoji: '🥒', time: 'Morning' },
    { id: '8', type: 'photo', plantName: 'All Plants', emoji: '📸', time: 'Afternoon' }
  ],
  'Fri': [
    { id: '9', type: 'check', plantName: 'Seedlings', emoji: '🌱', time: 'Morning' }
  ],
  'Sat': [
    { id: '10', type: 'water', plantName: 'All Plants', emoji: '💧', time: 'Morning' },
    { id: '11', type: 'harvest', plantName: 'Herbs', emoji: '🌿', time: 'Afternoon' }
  ],
  'Sun': [
    { id: '12', type: 'planted', plantName: 'New Seeds', emoji: '🌰', time: 'Morning' }
  ]
}

const eventStyles = {
  water: 'bg-blue-100 border-blue-300 text-blue-900',
  harvest: 'bg-orange-100 border-orange-300 text-orange-900',
  planted: 'bg-green-100 border-green-300 text-green-900',
  fertilize: 'bg-purple-100 border-purple-300 text-purple-900',
  check: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  photo: 'bg-pink-100 border-pink-300 text-pink-900'
}

export default function CalendarWeekView({ date }: { date: Date }) {
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
  const today = new Date()
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const events = mockWeekEvents[day] || []
            const date = weekDates[index]
            const isTodayCol = isToday(date)
            
            return (
              <div key={day} className="space-y-2">
                <div className={`text-center pb-2 border-b-2 ${isTodayCol ? 'border-green-500' : 'border-gray-200'}`}>
                  <div className="text-sm font-semibold text-gray-600">{day}</div>
                  <div className={`text-lg font-bold ${isTodayCol ? 'text-green-600' : 'text-gray-800'}`}>
                    {date.getDate()}
                  </div>
                  {isTodayCol && (
                    <div className="text-xs text-green-600 font-medium">Today</div>
                  )}
                </div>
                
                <div className="space-y-2 min-h-[300px]">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className={`
                        p-2 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md
                        ${eventStyles[event.type]}
                        ${event.completed ? 'opacity-50 line-through' : ''}
                      `}
                    >
                      <div className="text-lg text-center mb-1">{event.emoji}</div>
                      <div className="text-xs font-medium">{event.plantName}</div>
                      <div className="text-[10px] opacity-75">{event.time}</div>
                    </div>
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
          const events = mockWeekEvents[day] || []
          const date = weekDates[index]
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
                    <div className="text-lg font-bold text-gray-800">{day}</div>
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
                  {events.length} task{events.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${eventStyles[event.type]}
                        ${event.completed ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="text-xl">{event.emoji}</div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${event.completed ? 'line-through' : ''}`}>
                          {event.plantName}
                        </div>
                        <div className="text-xs opacity-75">{event.type} • {event.time}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={event.completed || false}
                        className="w-5 h-5 text-green-600 rounded"
                        onChange={() => {}}
                      />
                    </div>
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
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Week at a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl">💧</div>
            <div>
              <div className="text-xl font-bold text-blue-900">5</div>
              <div className="text-xs text-blue-700">Waterings</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl">🌾</div>
            <div>
              <div className="text-xl font-bold text-orange-900">2</div>
              <div className="text-xs text-orange-700">Harvests</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-pink-50 p-3 rounded-lg">
            <div className="text-2xl">📸</div>
            <div>
              <div className="text-xl font-bold text-pink-900">2</div>
              <div className="text-xs text-pink-700">Photos Due</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
            <div className="text-2xl">🌱</div>
            <div>
              <div className="text-xl font-bold text-green-900">1</div>
              <div className="text-xs text-green-700">New Planting</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl">🌿</div>
            <div>
              <div className="text-xl font-bold text-purple-900">1</div>
              <div className="text-xs text-purple-700">Fertilizing</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl">👀</div>
            <div>
              <div className="text-xl font-bold text-yellow-900">2</div>
              <div className="text-xs text-yellow-700">Check-ups</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}