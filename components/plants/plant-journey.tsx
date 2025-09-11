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

import { statusColors } from '@/lib/plant-status'

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
      <article style={{ marginBottom: '1.5rem' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3>Plant Journey</h3>
            <p className="text-small text-muted">
              Day {daysSincePlanting} of {totalDays} 
              {daysToHarvest && daysSincePlanting > totalDays && ` (${daysSincePlanting - totalDays} days past expected harvest)`}
            </p>
          </div>
          <button
            onClick={() => setShowDetails(true)}
            className="secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            View Timeline Details →
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          {/* Background track */}
          <div style={{ 
            height: '0.75rem', 
            background: 'var(--card-border)', 
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            {/* Progress fill */}
            <div 
              style={{ 
                height: '100%',
                background: 'linear-gradient(to right, var(--primary), var(--primary-hover))',
                transition: 'width 0.5s',
                width: `${progressPercent}%`
              }}
            />
          </div>
          
          {/* Today marker */}
          <div 
            style={{ 
              position: 'absolute',
              top: 0,
              width: '2px',
              height: '0.75rem',
              background: 'var(--accent)',
              left: `${progressPercent}%`
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.75rem',
              color: 'var(--accent)',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}>
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
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                borderColor: milestone.reached ? 'var(--primary)' : 'var(--card-border)',
                background: milestone.reached ? 'rgba(101, 163, 13, 0.1)' : 'var(--background)'
              }}>
                <span className="text-sm">{milestone.icon}</span>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 500 }}>{milestone.label}</div>
                <div className="text-muted">
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
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--card)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Image
                        src={event.data.photoUrl!}
                        alt="Plant photo"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      border: '2px solid var(--card-border)',
                      background: event.data.status === 'seedling' ? 'rgba(101, 163, 13, 0.2)' :
                                 event.data.status === 'growing' ? 'rgba(59, 130, 246, 0.2)' :
                                 event.data.status === 'flowering' || event.data.status === 'fruiting' ? 'rgba(234, 88, 12, 0.2)' :
                                 'var(--background)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="text-xs">●</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Status Summary */}
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'var(--background)',
          borderRadius: '0.5rem'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-small text-muted">Current Status:</span>
              <span className={`badge ${
                currentStatus === 'seedling' ? 'success' :
                currentStatus === 'growing' ? 'info' :
                currentStatus === 'flowering' || currentStatus === 'fruiting' ? 'warning' :
                'muted'
              }`} style={{ marginLeft: '0.5rem' }}>
                {currentStatus}
              </span>
            </div>
            {daysToHarvest && daysSincePlanting < daysToHarvest && (
              <div className="text-small text-muted">
                {daysToHarvest - daysSincePlanting} days until harvest
              </div>
            )}
          </div>
        </div>
      </article>

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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50
    }}>
      <div style={{
        background: 'var(--card)',
        borderRadius: '0.75rem',
        maxWidth: '56rem',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid var(--card-border)'
        }}>
          <h2>Timeline Details</h2>
          <button
            onClick={onClose}
            className="secondary"
            style={{ 
              padding: '0.25rem 0.5rem',
              fontSize: '1.5rem',
              background: 'transparent',
              color: 'var(--muted)'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          padding: '1rem',
          overflowY: 'auto',
          maxHeight: 'calc(80vh - 4rem)'
        }}>
          {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
            <div key={month} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>{month}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {monthEvents.map(event => (
                  <div key={event.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'var(--background)',
                    borderRadius: '0.5rem'
                  }}>
                    <div className="flex-shrink-0">
                      {event.type === 'photo' ? (
                        <div style={{
                          width: '4rem',
                          height: '4rem',
                          borderRadius: '0.5rem',
                          overflow: 'hidden'
                        }}>
                          <Image
                            src={event.data.photoUrl!}
                            alt="Plant photo"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : event.type === 'milestone' ? (
                        <div style={{
                          width: '4rem',
                          height: '4rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(101, 163, 13, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span className="text-2xl">{event.data.icon}</span>
                        </div>
                      ) : (
                        <div style={{
                          width: '4rem',
                          height: '4rem',
                          borderRadius: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: event.data.status === 'seedling' ? 'rgba(101, 163, 13, 0.1)' :
                                     event.data.status === 'growing' ? 'rgba(59, 130, 246, 0.1)' :
                                     event.data.status === 'flowering' || event.data.status === 'fruiting' ? 'rgba(234, 88, 12, 0.1)' :
                                     'var(--background)'
                        }}>
                          <span className="text-small" style={{ fontWeight: 500 }}>{event.data.status}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 500 }}>
                          {event.type === 'photo' ? 'Photo added' : 
                           event.type === 'milestone' ? event.data.label :
                           `Status: ${event.data.status}`}
                        </span>
                        <span className="text-small text-muted">
                          {event.date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {event.type === 'status' && event.data.notes && (
                        <p className="text-small text-muted" style={{ marginTop: '0.25rem' }}>{event.data.notes}</p>
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