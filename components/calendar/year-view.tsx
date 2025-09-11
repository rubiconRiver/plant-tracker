'use client'

interface MonthSummary {
  harvests: number
  plantings: number
  photos: number
}

// Mock yearly data
const mockYearData: Record<number, MonthSummary> = {
  0: { harvests: 0, plantings: 2, photos: 15 },  // Jan
  1: { harvests: 1, plantings: 3, photos: 28 },  // Feb
  2: { harvests: 2, plantings: 5, photos: 35 },  // Mar
  3: { harvests: 4, plantings: 8, photos: 42 },  // Apr
  4: { harvests: 6, plantings: 10, photos: 50 }, // May
  5: { harvests: 8, plantings: 7, photos: 48 },  // Jun
  6: { harvests: 12, plantings: 4, photos: 45 }, // Jul
  7: { harvests: 15, plantings: 3, photos: 40 }, // Aug
  8: { harvests: 10, plantings: 5, photos: 38 }, // Sep
  9: { harvests: 6, plantings: 8, photos: 35 },  // Oct
  10: { harvests: 3, plantings: 2, photos: 20 }, // Nov
  11: { harvests: 1, plantings: 1, photos: 10 }  // Dec
}

export default function CalendarYearView({ date }: { date: Date }) {
  const year = date.getFullYear()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getMonthActivity = (month: number) => {
    const data = mockYearData[month] || { harvests: 0, plantings: 0, photos: 0 }
    const total = data.harvests + data.plantings + data.photos
    
    if (total === 0) return 'bg-gray-100'
    if (total < 10) return 'bg-green-100'
    if (total < 30) return 'bg-green-200'
    if (total < 50) return 'bg-green-300'
    return 'bg-green-400'
  }

  const isCurrentMonth = (month: number) => {
    return year === currentYear && month === currentMonth
  }

  return (
    <div className="space-y-6">
      {/* Year Overview Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((monthName, index) => {
            const data = mockYearData[index] || { harvests: 0, plantings: 0, photos: 0 }
            const isCurrent = isCurrentMonth(index)
            
            return (
              <div
                key={monthName}
                className={`
                  ${getMonthActivity(index)} rounded-lg p-4 cursor-pointer
                  hover:shadow-lg transition-all
                  ${isCurrent ? 'ring-2 ring-green-500' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {monthName.substring(0, 3)}
                  </h3>
                  {isCurrent && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Now
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-xs">
                  {data.harvests > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🌾</span>
                      <span className="text-gray-600">{data.harvests} harvests</span>
                    </div>
                  )}
                  {data.plantings > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🌱</span>
                      <span className="text-gray-600">{data.plantings} planted</span>
                    </div>
                  )}
                  {data.photos > 0 && (
                    <div className="flex items-center gap-1">
                      <span>📸</span>
                      <span className="text-gray-600">{data.photos} photos</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Year Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Year {year} Statistics</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">72</div>
            <div className="text-sm text-gray-600">Total Harvests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">58</div>
            <div className="text-sm text-gray-600">Plants Started</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">456</div>
            <div className="text-sm text-gray-600">Photos Taken</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">24</div>
            <div className="text-sm text-gray-600">Active Plants</div>
          </div>
        </div>

        {/* Growing Season Chart */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Growing Activity</h4>
          <div className="flex items-end gap-1 h-32">
            {months.map((_, index) => {
              const data = mockYearData[index] || { harvests: 0, plantings: 0, photos: 0 }
              const height = Math.min(100, (data.harvests + data.plantings) * 5)
              
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${months[index]}: ${data.harvests + data.plantings} activities`}
                ></div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Seasonal Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4">
          <div className="text-2xl mb-2">🌸</div>
          <h4 className="font-semibold text-gray-800">Spring</h4>
          <p className="text-sm text-gray-600 mt-1">Peak planting season</p>
          <p className="text-xs text-gray-500 mt-2">15 varieties started</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4">
          <div className="text-2xl mb-2">☀️</div>
          <h4 className="font-semibold text-gray-800">Summer</h4>
          <p className="text-sm text-gray-600 mt-1">Maximum growth period</p>
          <p className="text-xs text-gray-500 mt-2">35 harvests completed</p>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4">
          <div className="text-2xl mb-2">🍂</div>
          <h4 className="font-semibold text-gray-800">Fall</h4>
          <p className="text-sm text-gray-600 mt-1">Final harvest rush</p>
          <p className="text-xs text-gray-500 mt-2">19 plants winterized</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4">
          <div className="text-2xl mb-2">❄️</div>
          <h4 className="font-semibold text-gray-800">Winter</h4>
          <p className="text-sm text-gray-600 mt-1">Indoor growing focus</p>
          <p className="text-xs text-gray-500 mt-2">3 herbs maintained</p>
        </div>
      </div>
    </div>
  )
}