'use client'

interface Milestone {
  type: string
  message: string
  emoji: string
  subtle?: boolean
}

// Quiet, dignified celebrations
interface CalendarEvent {
  id: string
  type: string
  date: string | Date
  plantId?: string
  plantName?: string
  status?: string
}

export const getMilestone = (event: CalendarEvent, allEvents: CalendarEvent[]): Milestone | null => {
  const plantEvents = allEvents.filter(e => e.plantId === event.plantId)
  
  // First planting of the season
  if (event.type === 'planted') {
    const monthPlantings = allEvents.filter(e => 
      e.type === 'planted' && 
      new Date(e.date).getMonth() === new Date(event.date).getMonth()
    )
    if (monthPlantings[0]?.id === event.id) {
      const month = new Date(event.date).toLocaleDateString('en-US', { month: 'long' })
      return {
        type: 'first-planting',
        message: `First ${month} planting`,
        emoji: '🌱',
        subtle: true
      }
    }
  }
  
  // First harvest
  if (event.type === 'harvest') {
    const isFirstHarvest = !plantEvents.some(e => 
      e.type === 'harvest' && 
      new Date(e.date) < new Date(event.date)
    )
    if (isFirstHarvest) {
      return {
        type: 'first-harvest',
        message: 'First harvest!',
        emoji: '🌾'
      }
    }
  }
  
  // Garden expansion (multiple plantings same day)
  if (event.type === 'planted') {
    const sameDayPlantings = allEvents.filter(e => 
      e.type === 'planted' && 
      e.date === event.date
    )
    if (sameDayPlantings.length >= 3) {
      return {
        type: 'garden-expansion',
        message: 'New garden bed started',
        emoji: '🏡',
        subtle: true
      }
    }
  }
  
  // Photo milestone (every 10th photo)
  if (event.type === 'photo') {
    const photoCount = plantEvents.filter(e => 
      e.type === 'photo' && 
      new Date(e.date) <= new Date(event.date)
    ).length
    
    if (photoCount === 10) {
      return {
        type: 'photo-milestone',
        message: '10 growth photos',
        emoji: '📸',
        subtle: true
      }
    }
    if (photoCount === 25) {
      return {
        type: 'photo-milestone', 
        message: 'Dedicated documenter',
        emoji: '📷'
      }
    }
  }
  
  // Germination success
  if (event.type === 'germination') {
    return {
      type: 'germination',
      message: 'Seeds sprouted',
      emoji: '🌿',
      subtle: true
    }
  }
  
  // Status progression
  if (event.type === 'status' && event.status === 'flowering') {
    return {
      type: 'flowering',
      message: 'First flowers',
      emoji: '🌸'
    }
  }
  
  if (event.type === 'status' && event.status === 'fruiting') {
    return {
      type: 'fruiting',
      message: 'Fruit forming',
      emoji: '🍅'
    }
  }
  
  return null
}

// Weekly/monthly summaries
export const getWeeklySummary = (events: CalendarEvent[]) => {
  const stats = {
    plantings: events.filter(e => e.type === 'planted').length,
    harvests: events.filter(e => e.type === 'harvest').length,
    photos: events.filter(e => e.type === 'photo').length,
    waterings: events.filter(e => e.type === 'water').length
  }
  
  const achievements = []
  
  if (stats.plantings >= 5) {
    achievements.push({
      message: 'Productive planting week',
      emoji: '🌱'
    })
  }
  
  if (stats.harvests >= 3) {
    achievements.push({
      message: 'Bountiful harvest week',
      emoji: '🌾'
    })
  }
  
  if (stats.photos >= 7) {
    achievements.push({
      message: 'Daily documentation',
      emoji: '📸'
    })
  }
  
  if (stats.waterings >= 10) {
    achievements.push({
      message: 'Attentive caretaker',
      emoji: '💧'
    })
  }
  
  return achievements
}

export default function CelebrationBadge({ milestone }: { milestone: Milestone }) {
  if (!milestone) return null
  
  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
      ${milestone.subtle 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-300 font-medium'
      }
    `}>
      <span>{milestone.emoji}</span>
      <span className="italic">{milestone.message}</span>
    </div>
  )
}