import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// Register a new NFC tag or link it to a plant
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { uuid, plantId } = data

    if (!uuid) {
      return NextResponse.json({ error: 'UUID required' }, { status: 400 })
    }

    // Check if tag already exists
    const existingTag = await db.nfcTag.findUnique({
      where: { uuid }
    })

    if (existingTag) {
      // Update existing tag with new plant assignment
      const updatedTag = await db.nfcTag.update({
        where: { uuid },
        data: { 
          plantId: plantId || null,
          label: data.label || existingTag.label
        }
      })
      return NextResponse.json(updatedTag)
    }

    // Create new tag
    const newTag = await db.nfcTag.create({
      data: {
        uuid,
        plantId: plantId || null,
        label: data.label || null
      }
    })

    return NextResponse.json(newTag, { status: 201 })
  } catch (error) {
    console.error('Error managing NFC tag:', error)
    return NextResponse.json({ 
      error: 'Failed to manage NFC tag',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get all tags for a plant
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const plantId = searchParams.get('plantId')

    if (!plantId) {
      return NextResponse.json({ error: 'Plant ID required' }, { status: 400 })
    }

    const tags = await db.nfcTag.findMany({
      where: { plantId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching NFC tags:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch NFC tags',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}