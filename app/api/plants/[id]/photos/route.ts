import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('photo') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${id}_${timestamp}.jpg`
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', id)
    await mkdir(uploadDir, { recursive: true })
    
    // Save file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Save to database
    const photo = await db.photo.create({
      data: {
        url: `/uploads/${id}/${filename}`,
        plantId: id,
        takenAt: new Date()
      }
    })
    
    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const photos = await db.photo.findMany({
      where: { plantId: id },
      orderBy: { takenAt: 'desc' }
    })
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}