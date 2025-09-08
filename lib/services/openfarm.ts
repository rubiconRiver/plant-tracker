interface OpenFarmCrop {
  id: string
  attributes: {
    name: string
    binomial_name: string
    description: string
    sun_requirements: string
    sowing_method: string
    spread: number
    days_to_maturity: number
    row_spacing: number
    height: number
  }
}

interface OpenFarmGuide {
  id: string
  attributes: {
    name: string
    overview: string
    location: string
    stages: Array<{
      name: string
      order: number
      environment?: Array<{
        light?: string
      }>
      stage_length?: number
      instructions?: string
    }>
  }
  relationships?: {
    crop?: {
      data?: {
        id: string
      }
    }
  }
}

export interface PlantInfo {
  id: string
  name: string
  scientificName?: string
  description?: string
  daysToGermination?: number
  daysToHarvest?: number
  sunRequirements?: string
  sowingMethod?: string
  overview?: string
  stages?: Array<{
    name: string
    order: number
    days?: number
    instructions?: string
  }>
}

export class OpenFarmService {
  private baseUrl = 'https://openfarm.cc/api/v1'

  async searchCrops(query: string): Promise<PlantInfo[]> {
    try {
      // Search both crops and guides for better results
      const [cropsResponse, guidesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/crops?filter=${encodeURIComponent(query)}`),
        fetch(`${this.baseUrl}/guides?filter=${encodeURIComponent(query)}`)
      ])

      if (!cropsResponse.ok && !guidesResponse.ok) {
        throw new Error('Failed to search OpenFarm')
      }

      const plants: PlantInfo[] = []

      // Process crops
      if (cropsResponse.ok) {
        const cropsData = await cropsResponse.json()
        if (cropsData.data) {
          for (const crop of cropsData.data) {
            plants.push(this.formatCrop(crop))
          }
        }
      }

      // Process guides (they often have more detailed info)
      if (guidesResponse.ok) {
        const guidesData = await guidesResponse.json()
        if (guidesData.data) {
          for (const guide of guidesData.data) {
            const plantInfo = this.formatGuide(guide)
            // Avoid duplicates
            if (!plants.find(p => p.name === plantInfo.name)) {
              plants.push(plantInfo)
            }
          }
        }
      }

      return plants
    } catch (error) {
      console.error('Error searching OpenFarm:', error)
      return []
    }
  }

  async getGuideById(id: string): Promise<PlantInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/guides/${id}`)
      if (!response.ok) return null
      
      const data = await response.json()
      return this.formatGuide(data.data)
    } catch (error) {
      console.error('Error fetching guide:', error)
      return null
    }
  }

  private formatCrop(crop: OpenFarmCrop): PlantInfo {
    const attrs = crop.attributes
    return {
      id: `crop_${crop.id}`,
      name: attrs.name,
      scientificName: attrs.binomial_name,
      description: attrs.description,
      daysToHarvest: attrs.days_to_maturity,
      sunRequirements: attrs.sun_requirements,
      sowingMethod: attrs.sowing_method
    }
  }

  private formatGuide(guide: OpenFarmGuide): PlantInfo {
    const attrs = guide.attributes
    const stages = attrs.stages || []
    
    // Extract germination and harvest info from stages
    const germinationStage = stages.find(s => 
      s.name?.toLowerCase().includes('germination') || 
      s.name?.toLowerCase().includes('sprouting')
    )
    // const harvestStage = stages.find(s => 
    //   s.name?.toLowerCase().includes('harvest') ||
    //   s.name?.toLowerCase().includes('maturity')
    // )

    // Calculate total days from stages
    const totalDays = stages.reduce((sum, stage) => sum + (stage.stage_length || 0), 0)

    return {
      id: `guide_${guide.id}`,
      name: attrs.name,
      overview: attrs.overview,
      daysToGermination: germinationStage?.stage_length,
      daysToHarvest: totalDays > 0 ? totalDays : undefined,
      stages: stages.map(s => ({
        name: s.name,
        order: s.order,
        days: s.stage_length,
        instructions: s.instructions
      }))
    }
  }

  formatPlantNotes(plant: PlantInfo): string {
    let notes = ''
    
    if (plant.overview) {
      notes += `${plant.overview}\n\n`
    }
    
    notes += '📊 Growing Timeline:\n'
    
    if (plant.daysToGermination) {
      notes += `• Germination: ${plant.daysToGermination} days\n`
    }
    
    if (plant.daysToHarvest) {
      notes += `• Days to harvest: ${plant.daysToHarvest} days\n`
    }
    
    if (plant.sunRequirements) {
      notes += `• Sun: ${plant.sunRequirements}\n`
    }
    
    if (plant.sowingMethod) {
      notes += `• Sowing: ${plant.sowingMethod}\n`
    }
    
    if (plant.stages && plant.stages.length > 0) {
      notes += '\n🌱 Growth Stages:\n'
      plant.stages
        .sort((a, b) => a.order - b.order)
        .forEach(stage => {
          notes += `${stage.order}. ${stage.name}`
          if (stage.days) notes += ` (${stage.days} days)`
          notes += '\n'
          if (stage.instructions) {
            notes += `   ${stage.instructions}\n`
          }
        })
    }
    
    return notes.trim()
  }
}