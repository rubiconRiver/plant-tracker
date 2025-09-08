import { NextRequest, NextResponse } from 'next/server'
import { OpenFarmService } from '@/lib/services/openfarm'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }
  
  try {
    const openFarm = new OpenFarmService()
    const results = await openFarm.searchCrops(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('OpenFarm search error:', error)
    return NextResponse.json({ error: 'Failed to search plants' }, { status: 500 })
  }
}