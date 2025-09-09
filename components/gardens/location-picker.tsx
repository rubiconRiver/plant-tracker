'use client'

import { useState, useEffect } from 'react'
import GardenCreator from './garden-creator'

interface Garden {
  id: string
  name: string
  rows: number
  columnsPerRow: number
  _count?: {
    plants: number
  }
}

interface LocationPickerProps {
  value?: {
    gardenId: string | null
    row: number | null
    column: number | null
  }
  onChange: (location: {
    gardenId: string | null
    row: number | null
    column: number | null
  }) => void
  existingPlants?: Array<{
    gardenId: string | null
    gardenRow: number | null
    gardenColumn: number | null
  }>
}

export default function LocationPicker({ 
  value = { gardenId: null, row: null, column: null },
  onChange,
  existingPlants = []
}: LocationPickerProps) {
  const [gardens, setGardens] = useState<Garden[]>([])
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadGardens = async () => {
    try {
      const response = await fetch('/api/gardens')
      if (response.ok) {
        const data = await response.json()
        setGardens(data)
        
        // If a garden is already selected, maintain that selection
        if (value.gardenId) {
          const garden = data.find((g: Garden) => g.id === value.gardenId)
          if (garden) setSelectedGarden(garden)
        }
      }
    } catch (error) {
      console.error('Failed to load gardens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGardens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGardenSelect = (garden: Garden) => {
    setSelectedGarden(garden)
    onChange({ gardenId: garden.id, row: null, column: null })
  }

  const handlePositionSelect = (row: number, column: number) => {
    if (!selectedGarden) return
    
    // Toggle selection
    if (value.row === row && value.column === column) {
      onChange({ gardenId: selectedGarden.id, row: null, column: null })
    } else {
      onChange({ gardenId: selectedGarden.id, row, column })
    }
  }

  const isPositionOccupied = (gardenId: string, row: number, column: number) => {
    return existingPlants.some(p => 
      p.gardenId === gardenId && 
      p.gardenRow === row && 
      p.gardenColumn === column
    )
  }

  if (isLoading) {
    return <div className="text-gray-500">Loading gardens...</div>
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Location
      </label>

      {/* Garden Selection */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Select a garden:</p>
        <div className="grid gap-2">
          {gardens.map(garden => (
            <button
              key={garden.id}
              type="button"
              onClick={() => handleGardenSelect(garden)}
              className={`p-3 border rounded-lg text-left transition-colors ${
                selectedGarden?.id === garden.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{garden.name}</div>
              <div className="text-xs text-gray-500">
                {garden.rows} rows × {garden.columnsPerRow} columns
                {garden._count && garden._count.plants > 0 && (
                  <span className="ml-2">({garden._count.plants} plants)</span>
                )}
              </div>
            </button>
          ))}
          
          <GardenCreator onGardenCreated={loadGardens} />
        </div>
      </div>

      {/* Position Grid */}
      {selectedGarden && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Select position on {selectedGarden.name}:
            {value.row !== null && value.column !== null && (
              <span className="ml-2 font-medium text-green-600">
                Row {value.row + 1}, Column {value.column + 1}
              </span>
            )}
          </p>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div 
              className="grid gap-2"
              style={{ gridTemplateRows: `repeat(${selectedGarden.rows}, 1fr)` }}
            >
              {/* Reverse row order so row 1 is at bottom */}
              {Array.from({ length: selectedGarden.rows }).map((_, displayRowIndex) => {
                const rowIndex = selectedGarden.rows - 1 - displayRowIndex
                return (
                <div
                  key={rowIndex}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${selectedGarden.columnsPerRow}, 1fr)` }}
                >
                  {Array.from({ length: selectedGarden.columnsPerRow }).map((_, colIndex) => {
                    const isOccupied = isPositionOccupied(selectedGarden.id, rowIndex, colIndex)
                    const isSelected = value.row === rowIndex && value.column === colIndex
                    
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        onClick={() => !isOccupied && handlePositionSelect(rowIndex, colIndex)}
                        disabled={isOccupied}
                        className={`
                          h-12 rounded-lg border-2 transition-all text-xs font-medium
                          ${isSelected 
                            ? 'border-green-500 bg-green-100 text-green-700' 
                            : isOccupied
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-50'
                          }
                        `}
                        title={
                          isOccupied 
                            ? 'Position occupied' 
                            : `Row ${rowIndex + 1}, Column ${colIndex + 1}`
                        }
                      >
                        {isSelected ? '✓' : isOccupied ? '🌱' : ''}
                      </button>
                    )
                  })}
                </div>
                )
              })}
            </div>
            
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 border-2 border-gray-300 rounded"></span>
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></span>
                Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></span>
                Selected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}