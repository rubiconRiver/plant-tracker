import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const plant = await db.plant.findUnique({
      where: { id },
      include: {
        garden: {
          include: {
            workspace: {
              include: {
                members: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    // Check if user has access to this plant's workspace
    const hasAccess = plant.garden?.workspace.members.some(
      member => member.user.email === session.user?.email
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    return NextResponse.json(plant)
  } catch (error) {
    console.error('Error fetching plant:', error)
    return NextResponse.json({ error: 'Failed to fetch plant' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const plant = await db.plant.update({
      where: { id },
      data: {
        name: body.name,
        species: body.species,
        location: body.location,
        plantedDate: body.plantedDate ? new Date(body.plantedDate) : undefined,
        status: body.status,
        notes: body.notes
      }
    })
    
    return NextResponse.json(plant)
  } catch (error) {
    console.error('Error updating plant:', error)
    return NextResponse.json({ error: 'Failed to update plant' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.plant.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Plant deleted successfully' })
  } catch (error) {
    console.error('Error deleting plant:', error)
    return NextResponse.json({ error: 'Failed to delete plant' }, { status: 500 })
  }
}