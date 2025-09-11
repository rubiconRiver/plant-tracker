export const locationTypes = [
  { value: 'garden', label: 'Garden Bed', icon: '🌻', description: 'Outdoor garden plot or raised bed' },
  { value: 'hydroponics', label: 'Hydroponics', icon: '💧', description: 'Hydroponic system (DWC, NFT, etc.)' },
  { value: 'indoor', label: 'Indoor', icon: '🏠', description: 'Indoor pots or containers' },
  { value: 'greenhouse', label: 'Greenhouse', icon: '🏡', description: 'Greenhouse or polytunnel' },
  { value: 'balcony', label: 'Balcony/Patio', icon: '🪴', description: 'Balcony or patio containers' },
  { value: 'windowsill', label: 'Windowsill', icon: '🪟', description: 'Window boxes or sill planters' }
] as const

export type LocationType = typeof locationTypes[number]['value']