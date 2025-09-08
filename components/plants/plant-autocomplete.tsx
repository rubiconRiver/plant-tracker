'use client'

import { useState, useEffect, useRef } from 'react'
import { PlantInfo } from '@/lib/services/local-plants'

interface PlantAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlantSelect: (plant: PlantInfo | null) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export default function PlantAutocomplete({ 
  value, 
  onChange, 
  onPlantSelect,
  label = "Plant Type *",
  placeholder = "e.g., Basil, Tomato, Lettuce...",
  required = false 
}: PlantAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlantInfo[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Search for plants when input changes
  useEffect(() => {
    const searchPlants = async () => {
      if (value.length < 1) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/plants/search?q=${encodeURIComponent(value)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setShowSuggestions(data.length > 0)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchPlants, 300)
    return () => clearTimeout(debounce)
  }, [value])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (plant: PlantInfo) => {
    onChange(plant.name)
    onPlantSelect(plant)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // If user is typing manually, clear the plant selection
    // This allows custom entries
    if (newValue !== value) {
      onPlantSelect(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor="plantName" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="text"
          id="plantName"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-gray-400 text-sm">Searching...</span>
          </div>
        )}
      </div>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((plant, index) => (
            <button
              key={plant.id}
              type="button"
              onMouseDown={() => handleSelect(plant)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-gray-100' : ''
              } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="font-medium text-gray-900">{plant.name}</div>
              {plant.scientificName && (
                <div className="text-sm text-gray-500 italic">{plant.scientificName}</div>
              )}
              {(plant.daysToGermination || plant.daysToHarvest) && (
                <div className="text-xs text-gray-400 mt-1">
                  {plant.daysToGermination && `Germination: ${plant.daysToGermination}d`}
                  {plant.daysToGermination && plant.daysToHarvest && ' • '}
                  {plant.daysToHarvest && `Harvest: ${plant.daysToHarvest}d`}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-1">
        Start typing to search our plant database, or enter a custom plant name
      </p>
    </div>
  )
}