import plantsDatabase from '@/data/plants-database.json'

export interface LocalPlant {
  id: string
  name: string
  scientificName: string
  category: string
  daysToGermination?: { min: number; max: number }
  daysToHarvest?: { min: number; max: number }
  yearsToFruit?: { min: number; max: number }
  sunRequirements: string
  temperature: { min: number; max: number; unit: string }
  growingNotes: string
  wateringNeeds: string
  height: string
  spacing: string
  perennial?: boolean
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
}

export class LocalPlantService {
  private plants: LocalPlant[] = plantsDatabase.plants

  searchPlants(query: string): PlantInfo[] {
    const searchTerm = query.toLowerCase()
    
    const results = this.plants.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm) ||
      plant.scientificName.toLowerCase().includes(searchTerm) ||
      plant.category.toLowerCase().includes(searchTerm)
    )

    return results.map(plant => this.formatPlant(plant))
  }

  getPlantById(id: string): PlantInfo | null {
    const plant = this.plants.find(p => p.id === id)
    return plant ? this.formatPlant(plant) : null
  }

  private formatPlant(plant: LocalPlant): PlantInfo {
    return {
      id: plant.id,
      name: plant.name,
      scientificName: plant.scientificName,
      description: plant.growingNotes,
      daysToGermination: plant.daysToGermination 
        ? Math.round((plant.daysToGermination.min + plant.daysToGermination.max) / 2)
        : undefined,
      daysToHarvest: plant.daysToHarvest
        ? Math.round((plant.daysToHarvest.min + plant.daysToHarvest.max) / 2)
        : undefined,
      sunRequirements: plant.sunRequirements,
      overview: plant.growingNotes
    }
  }

  formatPlantNotes(plant: PlantInfo): string {
    const fullPlant = this.plants.find(p => p.id === plant.id)
    if (!fullPlant) return ''

    let notes = ''
    
    notes += '📊 Growing Information:\n'
    
    if (fullPlant.daysToGermination) {
      notes += `• Germination: ${fullPlant.daysToGermination.min}-${fullPlant.daysToGermination.max} days\n`
    }
    
    if (fullPlant.daysToHarvest) {
      notes += `• Days to harvest: ${fullPlant.daysToHarvest.min}-${fullPlant.daysToHarvest.max} days\n`
    }
    
    if (fullPlant.yearsToFruit) {
      notes += `• Years to fruit: ${fullPlant.yearsToFruit.min}-${fullPlant.yearsToFruit.max} years\n`
    }
    
    notes += `• Sun: ${fullPlant.sunRequirements}\n`
    notes += `• Temperature: ${fullPlant.temperature.min}-${fullPlant.temperature.max}°${fullPlant.temperature.unit}\n`
    notes += `• Height: ${fullPlant.height}\n`
    notes += `• Spacing: ${fullPlant.spacing}\n`
    
    if (fullPlant.perennial) {
      notes += `• Perennial: Yes\n`
    }
    
    notes += `\n💧 Watering:\n${fullPlant.wateringNeeds}\n`
    
    notes += `\n🌱 Growing Notes:\n${fullPlant.growingNotes}`
    
    return notes.trim()
  }
}