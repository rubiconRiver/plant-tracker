// Plant status configuration
export const plantStatuses = [
  { value: 'seed', label: 'Seed', icon: '🟤', description: 'Planted but not sprouted' },
  { value: 'sprouted', label: 'Sprouted', icon: '🌱', description: 'First leaves visible!' },
  { value: 'seedling', label: 'Seedling', icon: '🌿', description: 'Young plant with true leaves' },
  { value: 'growing', label: 'Growing', icon: '🪴', description: 'Actively growing larger' },
  { value: 'mature', label: 'Mature', icon: '🌳', description: 'Full size, ready to harvest' },
  { value: 'flowering', label: 'Flowering', icon: '🌸', description: 'Producing flowers' },
  { value: 'fruiting', label: 'Fruiting', icon: '🍅', description: 'Producing fruit' },
  { value: 'harvested', label: 'Harvested', icon: '🌾', description: 'Harvested' },
  { value: 'dormant', label: 'Dormant', icon: '😴', description: 'Dormant for winter' },
  { value: 'dead', label: 'Dead', icon: '💀', description: 'No longer alive' }
] as const

export type PlantStatus = typeof plantStatuses[number]['value']

// Status colors for UI components
export const statusColors: Record<string, string> = {
  seed: 'bg-amber-100 text-amber-800 border-amber-300',
  sprouted: 'bg-lime-100 text-lime-800 border-lime-300',
  seedling: 'bg-green-100 text-green-800 border-green-300',
  growing: 'bg-blue-100 text-blue-800 border-blue-300',
  mature: 'bg-purple-100 text-purple-800 border-purple-300',
  flowering: 'bg-pink-100 text-pink-800 border-pink-300',
  fruiting: 'bg-orange-100 text-orange-800 border-orange-300',
  harvested: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  dormant: 'bg-gray-100 text-gray-600 border-gray-300',
  dead: 'bg-gray-100 text-gray-800 border-gray-300'
}

// Status icons for display
export const statusIcons: Record<string, string> = {
  seed: '🟤',
  sprouted: '🌱',
  seedling: '🌿',
  growing: '🪴',
  mature: '🌳',
  flowering: '🌸',
  fruiting: '🍅',
  harvested: '🌾',
  dormant: '😴',
  dead: '💀'
}

// Get status label from value
export function getStatusLabel(status: string): string {
  const found = plantStatuses.find(s => s.value === status)
  return found?.label || status
}

// Get status icon from value
export function getStatusIcon(status: string): string {
  return statusIcons[status] || '🌱'
}