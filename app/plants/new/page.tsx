'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlantAutocomplete from '@/components/plants/plant-autocomplete'
import LocationPicker from '@/components/gardens/location-picker'
import { PlantInfo, LocalPlantService } from '@/lib/services/local-plants'
import { getRandomPlantName } from '@/lib/plant-names'
import { plantStatuses } from '@/lib/plant-status'

export default function NewPlantPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [plantName, setPlantName] = useState('')
  const [species, setSpecies] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState<{
    gardenId: string | null
    row: number | null
    column: number | null
  }>({ gardenId: null, row: null, column: null })
  interface ExistingPlant {
    id: string
    gardenId: string | null
    gardenRow: number | null
    gardenColumn: number | null
  }
  const [existingPlants, setExistingPlants] = useState<ExistingPlant[]>([])

  // Load existing plants to show occupied positions
  useEffect(() => {
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => setExistingPlants(data || []))
      .catch(err => {
        console.error('Failed to load existing plants:', err)
        setExistingPlants([])
      })
  }, [])

  const handlePlantSelect = (plant: PlantInfo | null) => {
    if (plant) {
      setSelectedPlant(plant)
      setSpecies(plant.name)
      
      // Generate formatted notes from plant database
      const plantService = new LocalPlantService()
      const formattedNotes = plantService.formatPlantNotes(plant)
      setNotes(formattedNotes)
      
      // Generate a fun name suggestion
      const funName = getRandomPlantName(plant.name)
      setPlantName(funName)
    } else {
      // User is typing a custom plant name
      setSelectedPlant(null)
      // Don't clear species - user is typing it
      // Don't clear notes - user might want to keep them
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      species: formData.get('species'),
      location: formData.get('location'),
      gardenId: location.gardenId,
      gardenRow: location.row,
      gardenColumn: location.column,
      plantedDate: formData.get('plantedDate'),
      status: formData.get('status'),
      notes: formData.get('notes'),
      openFarmId: selectedPlant?.id || null,
      openFarmData: selectedPlant ? JSON.stringify(selectedPlant) : null,
      daysToGermination: selectedPlant?.daysToGermination || null,
      daysToHarvest: selectedPlant?.daysToHarvest || null
    }

    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        alert('Failed to create plant')
      }
    } catch {
      alert('Error creating plant')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-green-600 hover:text-green-700">
            ← Back to Plants
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Plant</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Species/Variety Autocomplete */}
          <PlantAutocomplete
            value={species}
            onChange={setSpecies}
            onPlantSelect={handlePlantSelect}
            label="Species/Variety *"
            placeholder="e.g., Basil, Tomato, Lettuce..."
            required
          />

          {selectedPlant && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✓ Selected from database: <strong>{selectedPlant.name}</strong>
                {selectedPlant.scientificName && (
                  <span className="ml-2 text-green-600 italic">
                    ({selectedPlant.scientificName})
                  </span>
                )}
                {selectedPlant.daysToHarvest && (
                  <span className="ml-2 text-green-600">
                    • Harvest in ~{selectedPlant.daysToHarvest} days
                  </span>
                )}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Plant Name/Nickname *
              {plantName && selectedPlant && (
                <button
                  type="button"
                  onClick={() => setPlantName(getRandomPlantName(selectedPlant.name))}
                  className="ml-2 text-xs text-green-600 hover:text-green-700 underline"
                >
                  🎲 Generate new name
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                placeholder={species ? `${species} #1` : "Give your plant a unique name"}
              />
            </div>
          </div>

          {/* Location Grid Picker */}
          <LocationPicker
            value={location}
            onChange={setLocation}
            existingPlants={existingPlants}
          />

          {/* Legacy text location field (hidden but preserved for backwards compatibility) */}
          <input
            type="hidden"
            name="location"
            value=""
          />

          <div>
            <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700 mb-2">
              Planted Date *
            </label>
            <input
              type="date"
              id="plantedDate"
              name="plantedDate"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="seed"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            >
              {plantStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label} - {status.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
              {selectedPlant && (
                <span className="text-xs text-green-600 ml-2">
                  (Auto-filled growing guide from database)
                </span>
              )}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm text-black"
              placeholder="Any additional notes about this plant..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Plant'}
            </button>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}