import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')

  try {
    // Fetch all plants with their photos and status history
    const plants = await db.plant.findMany({
      include: {
        photos: {
          where: {
            takenAt: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            }
          },
          orderBy: { takenAt: 'asc' }
        },
        statusHistory: {
          where: {
            changedAt: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            }
          },
          orderBy: { changedAt: 'asc' }
        }
      }
    })

    // Generate calendar events
    const events = []

    for (const plant of plants) {
      // Planting events
      events.push({
        id: `planted-${plant.id}`,
        date: plant.plantedDate.toISOString().split('T')[0],
        type: 'planted',
        plantId: plant.id,
        plantName: plant.name,
        description: `${plant.name} planted`
      })

      // Expected germination
      if (plant.daysToGermination) {
        const germinationDate = new Date(plant.plantedDate)
        germinationDate.setDate(germinationDate.getDate() + plant.daysToGermination)
        events.push({
          id: `germination-${plant.id}`,
          date: germinationDate.toISOString().split('T')[0],
          type: 'germination',
          plantId: plant.id,
          plantName: plant.name,
          description: `${plant.name} expected to germinate`
        })
      }

      // Expected harvest
      if (plant.daysToHarvest) {
        const harvestDate = new Date(plant.plantedDate)
        harvestDate.setDate(harvestDate.getDate() + plant.daysToHarvest)
        events.push({
          id: `harvest-${plant.id}`,
          date: harvestDate.toISOString().split('T')[0],
          type: 'harvest',
          plantId: plant.id,
          plantName: plant.name,
          description: `${plant.name} ready to harvest`
        })
      }

      // Photo events
      plant.photos.forEach(photo => {
        events.push({
          id: `photo-${photo.id}`,
          date: new Date(photo.takenAt).toISOString().split('T')[0],
          type: 'photo',
          plantId: plant.id,
          plantName: plant.name,
          description: `Photo of ${plant.name}`
        })
      })

      // Status changes
      plant.statusHistory.forEach(status => {
        events.push({
          id: `status-${status.id}`,
          date: new Date(status.changedAt).toISOString().split('T')[0],
          type: 'status',
          plantId: plant.id,
          plantName: plant.name,
          description: `${plant.name} changed to ${status.status}`,
          status: status.status
        })
      })

      // Watering reminders (every 3 days for active plants)
      if (plant.status === 'seedling' || plant.status === 'vegetative' || plant.status === 'flowering') {
        const today = new Date()
        
        for (let i = 0; i < 30; i += 3) { // Next 30 days of watering
          const waterDate = new Date()
          waterDate.setDate(waterDate.getDate() + i)
          if (waterDate >= (startDate ? new Date(startDate) : new Date()) && 
              waterDate <= (endDate ? new Date(endDate) : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000))) {
            events.push({
              id: `water-${plant.id}-${i}`,
              date: waterDate.toISOString().split('T')[0],
              type: 'water',
              plantId: plant.id,
              plantName: plant.name,
              description: `Water ${plant.name}`
            })
          }
        }
      }

      // Photo reminders (weekly for active plants)
      if (plant.status === 'seedling' || plant.status === 'vegetative' || plant.status === 'flowering') {
        for (let i = 7; i <= 28; i += 7) { // Weekly photos for next month
          const photoDate = new Date()
          photoDate.setDate(photoDate.getDate() + i)
          if (photoDate >= (startDate ? new Date(startDate) : new Date()) && 
              photoDate <= (endDate ? new Date(endDate) : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000))) {
            events.push({
              id: `photo-reminder-${plant.id}-${i}`,
              date: photoDate.toISOString().split('T')[0],
              type: 'photo-reminder',
              plantId: plant.id,
              plantName: plant.name,
              description: `Take photo of ${plant.name}`
            })
          }
        }
      }
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 })
  }
}