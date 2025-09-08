import { NextRequest, NextResponse } from 'next/server'
import { LocalPlantService } from '@/lib/services/local-plants'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }
  
  try {
    const plantService = new LocalPlantService()
    const results = plantService.searchPlants(query)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Plant search error:', error)
    return NextResponse.json({ error: 'Failed to search plants' }, { status: 500 })
  }
}