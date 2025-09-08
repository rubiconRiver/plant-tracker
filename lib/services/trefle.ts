export interface TreflePlant {
  id: number
  common_name: string | null
  scientific_name: string
  family_common_name: string | null
  image_url: string | null
  year: number
  bibliography: string
  author: string
  status: string
  rank: string
  synonyms: string[]
  genus: string
  family: string
}

export interface TreflePlantDetails {
  id: number
  common_name: string | null
  scientific_name: string
  main_species: {
    id: number
    common_name: string | null
    scientific_name: string
    growth: {
      days_to_harvest: number | null
      description: string | null
      sowing_description: string | null
      sun_requirements: string | null
      row_spacing: {
        cm: number | null
      } | null
      spread: {
        cm: number | null
      } | null
      minimum_precipitation: {
        mm: number | null
      } | null
      maximum_precipitation: {
        mm: number | null
      } | null
      minimum_temperature: {
        deg_c: number | null
      } | null
      maximum_temperature: {
        deg_c: number | null
      } | null
      soil_nutriments: number | null
      soil_humidity: number | null
      light: number | null
      atmospheric_humidity: number | null
    }
    specifications: {
      average_height: {
        cm: number | null
      } | null
      maximum_height: {
        cm: number | null
      } | null
      growth_rate: string | null
      growth_months: string | null
      growth_habit: string | null
      growth_form: string | null
      edible: boolean | null
      edible_part: string[] | null
      toxicity: string | null
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
  imageUrl?: string
  edible?: boolean
  edibleParts?: string[]
  growthMonths?: string
  growthRate?: string
  light?: number
  minTemp?: number
  maxTemp?: number
}

export class TrefleService {
  private baseUrl = 'https://trefle.io/api/v1'
  private token = process.env.TREFLE_API_TOKEN

  async searchPlants(query: string): Promise<PlantInfo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/plants/search?token=${this.token}&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.error('Trefle API error:', response.status)
        return []
      }

      const data = await response.json()
      
      if (!data.data) {
        return []
      }

      return data.data.map((plant: TreflePlant) => this.formatPlant(plant))
    } catch (error) {
      console.error('Error searching Trefle:', error)
      return []
    }
  }

  async getPlantDetails(id: number): Promise<PlantInfo | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/plants/${id}?token=${this.token}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data: TreflePlantDetails = await response.json()
      return this.formatPlantDetails(data)
    } catch (error) {
      console.error('Error fetching plant details:', error)
      return null
    }
  }

  private formatPlant(plant: TreflePlant): PlantInfo {
    return {
      id: `trefle_${plant.id}`,
      name: plant.common_name || plant.scientific_name,
      scientificName: plant.scientific_name,
      imageUrl: plant.image_url || undefined
    }
  }

  private formatPlantDetails(plant: TreflePlantDetails): PlantInfo {
    const specs = plant.main_species?.specifications || {}
    const growth = plant.main_species?.growth || {}
    
    return {
      id: `trefle_${plant.id}`,
      name: plant.common_name || plant.scientific_name,
      scientificName: plant.scientific_name,
      daysToHarvest: growth.days_to_harvest || undefined,
      sunRequirements: growth.sun_requirements || undefined,
      sowingMethod: growth.sowing_description || undefined,
      overview: growth.description || undefined,
      edible: specs.edible || false,
      edibleParts: specs.edible_part || [],
      growthMonths: specs.growth_months || undefined,
      growthRate: specs.growth_rate || undefined,
      light: growth.light || undefined,
      minTemp: growth.minimum_temperature?.deg_c || undefined,
      maxTemp: growth.maximum_temperature?.deg_c || undefined
    }
  }

  formatPlantNotes(plant: PlantInfo): string {
    let notes = ''
    
    if (plant.overview) {
      notes += `${plant.overview}\n\n`
    }
    
    notes += '📊 Growing Information:\n'
    
    if (plant.daysToHarvest) {
      notes += `• Days to harvest: ${plant.daysToHarvest} days\n`
    }
    
    if (plant.sunRequirements) {
      notes += `• Sun: ${plant.sunRequirements}\n`
    }
    
    if (plant.light) {
      const lightLevels = ['Deep shade', 'Shade', 'Part shade', 'Part sun', 'Full sun']
      notes += `• Light requirement: ${lightLevels[plant.light] || `Level ${plant.light}`}\n`
    }
    
    if (plant.growthRate) {
      notes += `• Growth rate: ${plant.growthRate}\n`
    }
    
    if (plant.growthMonths) {
      notes += `• Growing months: ${plant.growthMonths}\n`
    }
    
    if (plant.minTemp !== undefined || plant.maxTemp !== undefined) {
      notes += `• Temperature range: ${plant.minTemp || '?'}°C to ${plant.maxTemp || '?'}°C\n`
    }
    
    if (plant.edible) {
      notes += `• Edible: Yes`
      if (plant.edibleParts && plant.edibleParts.length > 0) {
        notes += ` (${plant.edibleParts.join(', ')})`
      }
      notes += '\n'
    }
    
    if (plant.sowingMethod) {
      notes += `\n🌱 Sowing Instructions:\n${plant.sowingMethod}\n`
    }
    
    return notes.trim()
  }
}