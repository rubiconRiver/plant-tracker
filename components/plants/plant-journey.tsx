'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PlantJourneyProps {
  plantedDate: Date
  daysToGermination: number | null
  daysToHarvest: number | null
  currentStatus: string
  photos: Array<{
    id: string
    url: string
    takenAt: Date
  }>
  statusHistory: Array<{
    id: string
    status: string
    changedAt: Date
    notes: string | null
  }>
}

const statusColors: Record<string, string> = {
  seedling: 'bg-green-100 text-green-800 border-green-300',
  growing: 'bg-blue-100 text-blue-800 border-blue-300',
  mature: 'bg-purple-100 text-purple-800 border-purple-300',
  harvested: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  dead: 'bg-gray-100 text-gray-800 border-gray-300'
}

export default function PlantJourney({
  plantedDate,
  daysToGermination,
  daysToHarvest,
  currentStatus,
  photos,
  statusHistory
}: PlantJourneyProps) {
  const [showDetails, setShowDetails] = useState(false)

  const today = new Date()
  const plantedDateObj = new Date(plantedDate)
  const daysSincePlanting = Math.floor((today.getTime() - plantedDateObj.getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate milestone dates
  const germinationDate = daysToGermination 
    ? new Date(plantedDateObj.getTime() + daysToGermination * 24 * 60 * 60 * 1000)
    : null
  
  const harvestDate = daysToHarvest
    ? new Date(plantedDateObj.getTime() + daysToHarvest * 24 * 60 * 60 * 1000)
    : new Date(plantedDateObj.getTime() + 90 * 24 * 60 * 60 * 1000) // Default 90 days if not specified
  
  // Calculate progress percentage
  const totalDays = daysToHarvest || 90
  const progressPercent = Math.min(100, (daysSincePlanting / totalDays) * 100)
  
  // Define milestones
  const milestones = [
    {
      label: 'Planted',
      date: plantedDateObj,
      icon: '🌱',
      position: 0,
      reached: true
    },
    ...(germinationDate ? [{
      label: 'Germination',
      date: germinationDate,
      icon: '🌿',
      position: daysToGermination! / totalDays * 100,
      reached: today >= germinationDate
    }] : []),
    {
      label: 'Ready to Harvest',
      date: harvestDate,
      icon: '🌾',
      position: 100,
      reached: today >= harvestDate || currentStatus === 'harvested'
    }
  ]
  
  // Get actual events (photos and status changes)
  const actualEvents = [
    ...photos.map(photo => ({
      id: photo.id,
      type: 'photo' as const,
      date: new Date(photo.takenAt),
      daysSincePlanting: Math.floor((new Date(photo.takenAt).getTime() - plantedDateObj.getTime()) / (1000 * 60 * 60 * 24)),
      data: { photoUrl: photo.url }
    })),
    ...statusHistory.map(status => ({
      id: status.id,
      type: 'status' as const,
      date: new Date(status.changedAt),
      daysSincePlanting: Math.floor((new Date(status.changedAt).getTime() - plantedDateObj.getTime()) / (1000 * 60 * 60 * 24)),
      data: { status: status.status, notes: status.notes }
    }))
  ].filter(event => event.daysSincePlanting >= 0 && event.daysSincePlanting <= totalDays)
   .sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Plant Journey</h2>
            <p className="text-sm text-gray-500 mt-1">
              Day {daysSincePlanting} of {totalDays} 
              {daysToHarvest && daysSincePlanting > totalDays && ` (${daysSincePlanting - totalDays} days past expected harvest)`}
            </p>
          </div>
          <button
            onClick={() => setShowDetails(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View Timeline Details →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          {/* Background track */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          {/* Today marker */}
          <div 
            className="absolute top-0 w-1 h-3 bg-red-500"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-600 font-medium whitespace-nowrap">
              Today
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="relative mb-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="absolute -top-2 flex flex-col items-center"
              style={{ left: `${milestone.position}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                milestone.reached 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <span className="text-sm">{milestone.icon}</span>
              </div>
              <div className="mt-2 text-xs text-center">
                <div className="font-medium text-gray-700">{milestone.label}</div>
                <div className="text-gray-500">
                  {milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actual Events on Timeline */}
        {actualEvents.length > 0 && (
          <div className="relative h-12 mt-12">
            {actualEvents.slice(-5).map((event) => {
              const position = (event.daysSincePlanting / totalDays) * 100
              return (
                <div
                  key={event.id}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${Math.min(100, Math.max(0, position))}%`, transform: 'translateX(-50%)' }}
                >
                  {event.type === 'photo' ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <Image
                        src={event.data.photoUrl!}
                        alt="Plant photo"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      statusColors[event.data.status!] || 'bg-gray-100 border-gray-300'
                    } shadow-sm flex items-center justify-center`}>
                      <span className="text-xs">●</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Status Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Current Status:</span>
              <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                statusColors[currentStatus] || 'bg-gray-100 text-gray-800'
              }`}>
                {currentStatus}
              </span>
            </div>
            {daysToHarvest && daysSincePlanting < daysToHarvest && (
              <div className="text-sm text-gray-600">
                {daysToHarvest - daysSincePlanting} days until harvest
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Details Modal */}
      {showDetails && (
        <TimelineDetails 
          plantedDate={plantedDateObj}
          photos={photos}
          statusHistory={statusHistory}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  )
}

function TimelineDetails({ 
  plantedDate, 
  photos, 
  statusHistory, 
  onClose 
}: { 
  plantedDate: Date
  photos: Array<{ id: string; url: string; takenAt: Date }>
  statusHistory: Array<{ id: string; status: string; changedAt: Date; notes: string | null }>
  onClose: () => void 
}) {
  // Combine all events
  const allEvents = [
    {
      id: 'planted',
      type: 'milestone' as const,
      date: plantedDate,
      data: { label: 'Planted', icon: '🌱' }
    },
    ...photos.map(photo => ({
      id: photo.id,
      type: 'photo' as const,
      date: new Date(photo.takenAt),
      data: { photoUrl: photo.url }
    })),
    ...statusHistory.map(status => ({
      id: status.id,
      type: 'status' as const,
      date: new Date(status.changedAt),
      data: { status: status.status, notes: status.notes }
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Group by month
  const eventsByMonth = allEvents.reduce((acc, event) => {
    const monthKey = event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, typeof allEvents>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Timeline Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">{month}</h3>
              <div className="space-y-3">
                {monthEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {event.type === 'photo' ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={event.data.photoUrl!}
                            alt="Plant photo"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : event.type === 'milestone' ? (
                        <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-2xl">{event.data.icon}</span>
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                          statusColors[event.data.status!] || 'bg-gray-100'
                        }`}>
                          <span className="text-sm font-medium">{event.data.status}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {event.type === 'photo' ? 'Photo added' : 
                           event.type === 'milestone' ? event.data.label :
                           `Status: ${event.data.status}`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {event.type === 'status' && event.data.notes && (
                        <p className="text-sm text-gray-600 mt-1">{event.data.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}