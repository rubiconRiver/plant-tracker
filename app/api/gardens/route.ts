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
            workspace: true
          }
        }
      }
    })

    if (!user?.workspaces[0]) {
      return NextResponse.json([])
    }

    const workspaceId = user.workspaces[0].workspace.id
    console.log('Fetching gardens for workspace:', workspaceId)
    
    const gardens = await db.garden.findMany({
      where: {
        workspaceId
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { plants: true }
        }
      }
    })
    console.log('Gardens fetched:', gardens)
    return NextResponse.json(gardens)
  } catch (error) {
    console.error('Failed to fetch gardens - Full error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: 'Failed to fetch gardens',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    console.log('Received garden creation request:', data)
    
    // Validate input
    if (!data.name || !data.rows || !data.columnsPerRow) {
      console.error('Missing required fields:', { name: data.name, rows: data.rows, columnsPerRow: data.columnsPerRow })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    console.log('Creating garden with:', {
      name: data.name,
      rows: data.rows,
      columnsPerRow: data.columnsPerRow
    })
    
    // Get user's workspace
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          include: {
            workspace: true
          }
        }
      }
    })

    if (!user?.workspaces[0]) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 400 })
    }

    const workspaceId = user.workspaces[0].workspace.id
    console.log('Creating garden in workspace:', workspaceId)
    
    const garden = await db.garden.create({
      data: {
        name: data.name,
        rows: data.rows,
        columnsPerRow: data.columnsPerRow,
        workspaceId
      }
    })
    
    console.log('Garden created successfully:', garden)
    return NextResponse.json(garden)
  } catch (error) {
    console.error('Failed to create garden - Full error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: 'Failed to create garden',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}