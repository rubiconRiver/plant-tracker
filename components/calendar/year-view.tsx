'use client'

import { useState, useEffect } from 'react'

interface MonthData {
  harvests: number
  plantings: number
  photos: number
  waterings: number
  events: any[]
}

export default function CalendarYearView({ date }: { date: Date }) {
  const [yearData, setYearData] = useState<Record<number, MonthData>>({})
  const [loading, setLoading] = useState(true)
  
  const year = date.getFullYear()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Fetch year data
  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true)
      const start = new Date(year, 0, 1).toISOString()
      const end = new Date(year, 11, 31).toISOString()
      
      try {
        const response = await fetch(`/api/calendar?start=${start}&end=${end}`)
        const data = await response.json()
        
        // Process events by month
        const monthlyData: Record<number, MonthData> = {}
        
        for (let i = 0; i < 12; i++) {
          monthlyData[i] = {
            harvests: 0,
            plantings: 0,
            photos: 0,
            waterings: 0,
            events: []
          }
        }
        
        data.events?.forEach((event: any) => {
          const eventDate = new Date(event.date)
          const month = eventDate.getMonth()
          
          if (!monthlyData[month]) {
            monthlyData[month] = {
              harvests: 0,
              plantings: 0,
              photos: 0,
              waterings: 0,
              events: []
            }
          }
          
          monthlyData[month].events.push(event)
          
          switch(event.type) {
            case 'harvest':
              monthlyData[month].harvests++
              break
            case 'planted':
              monthlyData[month].plantings++
              break
            case 'photo':
            case 'photo-reminder':
              monthlyData[month].photos++
              break
            case 'water':
              monthlyData[month].waterings++
              break
          }
        })
        
        setYearData(monthlyData)
      } catch (error) {
        console.error('Failed to fetch year data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchYearData()
  }, [year])

  const getMonthActivity = (month: number) => {
    const data = yearData[month]
    if (!data) return 'bg-gray-100'
    
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
  
  // Calculate totals
  const totals = {
    harvests: 0,
    plantings: 0,
    photos: 0,
    waterings: 0
  }
  
  Object.values(yearData).forEach(data => {
    totals.harvests += data.harvests
    totals.plantings += data.plantings
    totals.photos += data.photos
    totals.waterings += data.waterings
  })

  return (
    <div className="space-y-6">
      {/* Year Overview Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading year data...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((monthName, index) => {
              const data = yearData[index] || { harvests: 0, plantings: 0, photos: 0, waterings: 0, events: [] }
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
                    <h3 className="font-semibold text-gray-900">
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
                    {data.waterings > 0 && (
                      <div className="flex items-center gap-1">
                        <span>💧</span>
                        <span className="text-gray-600">{data.waterings} waterings</span>
                      </div>
                    )}
                    {data.events.length === 0 && (
                      <div className="text-gray-400 italic">No activity</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Year Statistics */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Year {year} Statistics</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totals.harvests}</div>
              <div className="text-sm text-gray-600">Total Harvests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totals.plantings}</div>
              <div className="text-sm text-gray-600">Plants Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totals.photos}</div>
              <div className="text-sm text-gray-600">Photos Taken</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">{totals.waterings}</div>
              <div className="text-sm text-gray-600">Waterings</div>
            </div>
          </div>

          {/* Growing Season Chart */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Growing Activity</h4>
            <div className="flex items-end gap-1 h-32">
              {months.map((_, index) => {
                const data = yearData[index] || { harvests: 0, plantings: 0, photos: 0, waterings: 0, events: [] }
                const height = Math.min(100, (data.harvests + data.plantings) * 10)
                
                return (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t hover:from-green-600 hover:to-green-400 transition-colors"
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
      )}

      {/* Seasonal Highlights */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4">
            <div className="text-2xl mb-2">🌸</div>
            <h4 className="font-semibold text-gray-900">Spring</h4>
            <p className="text-sm text-gray-600 mt-1">Peak planting season</p>
            <p className="text-xs text-gray-500 mt-2">
              {(yearData[2]?.plantings || 0) + (yearData[3]?.plantings || 0) + (yearData[4]?.plantings || 0)} plants started
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4">
            <div className="text-2xl mb-2">☀️</div>
            <h4 className="font-semibold text-gray-900">Summer</h4>
            <p className="text-sm text-gray-600 mt-1">Maximum growth period</p>
            <p className="text-xs text-gray-500 mt-2">
              {(yearData[5]?.harvests || 0) + (yearData[6]?.harvests || 0) + (yearData[7]?.harvests || 0)} harvests
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4">
            <div className="text-2xl mb-2">🍂</div>
            <h4 className="font-semibold text-gray-900">Fall</h4>
            <p className="text-sm text-gray-600 mt-1">Final harvest rush</p>
            <p className="text-xs text-gray-500 mt-2">
              {(yearData[8]?.harvests || 0) + (yearData[9]?.harvests || 0) + (yearData[10]?.harvests || 0)} harvests
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4">
            <div className="text-2xl mb-2">❄️</div>
            <h4 className="font-semibold text-gray-900">Winter</h4>
            <p className="text-sm text-gray-600 mt-1">Planning & prep</p>
            <p className="text-xs text-gray-500 mt-2">
              {(yearData[11]?.plantings || 0) + (yearData[0]?.plantings || 0) + (yearData[1]?.plantings || 0)} started
            </p>
          </div>
        </div>
      )}
    </div>
  )
}