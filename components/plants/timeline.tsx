'use client'

import { useState } from 'react'
import Image from 'next/image'

type TimelineEvent = {
  id: string
  type: 'photo' | 'status'
  date: Date
  data: {
    status?: string
    notes?: string
    photoUrl?: string
  }
}

interface TimelineProps {
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

const statusIcons: Record<string, string> = {
  seedling: '🌱',
  growing: '🌿',
  mature: '🌳',
  harvested: '🌾',
  dead: '💀'
}

export default function Timeline({ photos, statusHistory }: TimelineProps) {
  const [showCalendar, setShowCalendar] = useState(false)

  // Combine photos and status changes into a single timeline
  const events: TimelineEvent[] = [
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
      data: { status: status.status, notes: status.notes || undefined }
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Get last 5 events for horizontal timeline
  const recentEvents = events.slice(0, 5)

  if (showCalendar) {
    return <CalendarView events={events} onClose={() => setShowCalendar(false)} />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Growth Timeline</h2>
        <button
          onClick={() => setShowCalendar(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View Full History →
        </button>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2" />
        <div className="flex justify-between relative">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              {/* Event Marker */}
              <div className="relative">
                {event.type === 'photo' ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                    <Image
                      src={event.data.photoUrl!}
                      alt="Plant photo"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md ${
                    statusColors[event.data.status!] || 'bg-gray-100 border-gray-300'
                  }`}>
                    <span className="text-lg">{statusIcons[event.data.status!] || '📌'}</span>
                  </div>
                )}
              </div>
              
              {/* Date Label */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                {event.date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              
              {/* Event Label */}
              {event.type === 'status' && (
                <div className="text-xs font-medium text-gray-700 capitalize">
                  {event.data.status}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No timeline events yet. Take a photo or update the status to start tracking progress!
        </p>
      )}
    </div>
  )
}

function CalendarView({ events, onClose }: { events: TimelineEvent[], onClose: () => void }) {
  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const monthKey = event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Complete Growth History</h2>
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
                    {/* Event Icon */}
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
                      ) : (
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                          statusColors[event.data.status!] || 'bg-gray-100'
                        }`}>
                          <span className="text-2xl">{statusIcons[event.data.status!] || '📌'}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {event.type === 'photo' ? 'Photo added' : `Status changed to ${event.data.status}`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {event.date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {event.data.notes && (
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