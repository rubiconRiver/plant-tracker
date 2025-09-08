'use client'

import { useState, useEffect } from 'react'
import { PlantInfo } from '@/lib/services/local-plants'

interface PlantSearchProps {
  onSelect: (plant: PlantInfo) => void
  initialValue?: string
}

export default function PlantSearch({ onSelect, initialValue = '' }: PlantSearchProps) {
  const [query, setQuery] = useState(initialValue)
  const [results, setResults] = useState<PlantInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)

  useEffect(() => {
    const searchPlants = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/plants/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchPlants, 500)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSelect = (plant: PlantInfo) => {
    setSelectedPlant(plant)
    setQuery(plant.name)
    setShowResults(false)
    onSelect(plant)
  }

  const handleClear = () => {
    setSelectedPlant(null)
    setQuery('')
    setResults([])
    onSelect({ id: '', name: '', scientificName: undefined })
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search Plant Database
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for tomato, lettuce, basil..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-20"
        />
        
        {selectedPlant && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2"
          >
            Clear
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className="text-gray-400">Searching...</span>
          </div>
        )}
      </div>

      {selectedPlant && (
        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800">Selected: {selectedPlant.name}</p>
          {selectedPlant.scientificName && (
            <p className="text-xs text-green-600 italic">{selectedPlant.scientificName}</p>
          )}
          {(selectedPlant.daysToGermination || selectedPlant.daysToHarvest) && (
            <p className="text-xs text-green-600 mt-1">
              {selectedPlant.daysToGermination && `Germination: ${selectedPlant.daysToGermination} days`}
              {selectedPlant.daysToGermination && selectedPlant.daysToHarvest && ' • '}
              {selectedPlant.daysToHarvest && `Harvest: ${selectedPlant.daysToHarvest} days`}
            </p>
          )}
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {results.map((plant) => (
            <button
              key={plant.id}
              type="button"
              onClick={() => handleSelect(plant)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{plant.name}</div>
              {plant.scientificName && (
                <div className="text-sm text-gray-500 italic">{plant.scientificName}</div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {plant.daysToGermination && `Germination: ${plant.daysToGermination}d`}
                {plant.daysToGermination && plant.daysToHarvest && ' • '}
                {plant.daysToHarvest && `Harvest: ${plant.daysToHarvest}d`}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">No plants found. You can still enter custom details below.</p>
        </div>
      )}
    </div>
  )
}