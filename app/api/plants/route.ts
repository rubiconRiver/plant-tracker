import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's workspace
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          include: {
            workspace: {
              include: {
                gardens: true
              }
            }
          }
        }
      }
    })

    if (!user?.workspaces[0]) {
      return NextResponse.json([])
    }

    const gardenIds = user.workspaces[0].workspace.gardens.map(g => g.id)

    const plants = await db.plant.findMany({
      where: {
        gardenId: {
          in: gardenIds
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        garden: true
      }
    })
    return NextResponse.json(plants)
  } catch (error) {
    console.error('Error fetching plants:', error)
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const initialStatus = body.status || 'seedling'
    
    const plant = await db.plant.create({
      data: {
        name: body.name,
        species: body.species || null,
        location: body.location || null,
        gardenId: body.gardenId || null,
        gardenRow: body.gardenRow !== undefined ? body.gardenRow : null,
        gardenColumn: body.gardenColumn !== undefined ? body.gardenColumn : null,
        plantedDate: new Date(body.plantedDate),
        status: initialStatus,
        notes: body.notes || null,
        openFarmId: body.openFarmId || null,
        openFarmData: body.openFarmData || null,
        daysToGermination: body.daysToGermination || null,
        daysToHarvest: body.daysToHarvest || null,
        statusHistory: {
          create: {
            status: initialStatus,
            notes: 'Plant created'
          }
        }
      }
    })
    
    return NextResponse.json(plant, { status: 201 })
  } catch (error) {
    console.error('Error creating plant:', error)
    return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 })
  }
}