'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PlantAutocomplete from '@/components/plants/plant-autocomplete'
import LocationPicker from '@/components/gardens/location-picker'
import { PlantInfo, LocalPlantService } from '@/lib/services/local-plants'
import { getRandomPlantName } from '@/lib/plant-names'
import { plantStatuses } from '@/lib/plant-status'
import { locationTypes } from '@/lib/location-types'

function NewPlantForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nfcUuid = searchParams.get('nfcUuid')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [plantName, setPlantName] = useState('')
  const [species, setSpecies] = useState('')
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [locationType, setLocationType] = useState('garden')
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
      locationType: formData.get('locationType'),
      quantity: parseInt(formData.get('quantity') as string) || 1,
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
        const plant = await response.json()
        
        // If we have an NFC UUID, link it to the new plant
        if (nfcUuid) {
          await fetch('/api/nfc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uuid: nfcUuid,
              plantId: plant.id
            })
          })
        }
        
        router.push(`/plants/${plant.id}`)
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
    <main>
      <nav>
        <div className="container flex items-center">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🌱</span>
          </Link>
          <Link href="/">← Back to Garden</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '42rem' }}>
        <header className="mb-4">
          <h1>Add New Plant</h1>
        </header>

        {nfcUuid && (
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🏷️</span>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>NFC Tag Ready</p>
              <p className="text-small text-muted" style={{ margin: 0 }}>
                This plant will be linked to tag: {nfcUuid.slice(0, 8)}...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <div style={{ 
              background: 'rgba(101, 163, 13, 0.1)', 
              border: '1px solid rgba(101, 163, 13, 0.3)',
              borderRadius: '0.5rem',
              padding: '0.75rem'
            }}>
              <p className="text-small" style={{ color: 'var(--primary)' }}>
                ✓ Selected from database: <strong>{selectedPlant.name}</strong>
                {selectedPlant.scientificName && (
                  <span style={{ marginLeft: '0.5rem', fontStyle: 'italic' }}>
                    ({selectedPlant.scientificName})
                  </span>
                )}
                {selectedPlant.daysToHarvest && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    • Harvest in ~{selectedPlant.daysToHarvest} days
                  </span>
                )}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Plant Name/Nickname *
              {plantName && selectedPlant && (
                <button
                  type="button"
                  onClick={() => setPlantName(getRandomPlantName(selectedPlant.name))}
                  className="secondary"
                  style={{ 
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    color: 'var(--primary)',
                    textDecoration: 'underline'
                  }}
                >
                  🎲 Generate new name
                </button>
              )}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                style={{ flex: 1 }}
                placeholder={species ? `${species} #1` : "Give your plant a unique name"}
              />
            </div>
          </div>

          <div className="grid grid-2 gap-3">
            <div>
              <label htmlFor="locationType" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Location Type *
              </label>
              <select
                id="locationType"
                name="locationType"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                {locationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              <p className="text-small text-muted" style={{ marginTop: '0.25rem' }}>
                {locationTypes.find(t => t.value === locationType)?.description}
              </p>
            </div>

            <div>
              <label htmlFor="quantity" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{ width: '100%' }}
              />
              <p className="text-small text-muted" style={{ marginTop: '0.25rem' }}>
                {quantity > 1 ? `Tracking ${quantity} plants together` : 'Single plant'}
              </p>
            </div>
          </div>

          {/* Location Grid Picker - only show for garden type */}
          {locationType === 'garden' && (
            <LocationPicker
              value={location}
              onChange={setLocation}
              existingPlants={existingPlants}
            />
          )}

          {/* Text location field for non-garden types */}
          {locationType !== 'garden' && (
            <div>
              <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Location Details
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder={locationType === 'hydroponics' ? 'e.g., Tower A, Channel 3' : 'e.g., Living room, South window'}
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Hidden location field for garden type */}
          {locationType === 'garden' && (
            <input
              type="hidden"
              name="location"
              value=""
            />
          )}

          <div>
            <label htmlFor="plantedDate" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Planted Date *
            </label>
            <input
              type="date"
              id="plantedDate"
              name="plantedDate"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="seed"
              style={{ width: '100%' }}
            >
              {plantStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label} - {status.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Notes
              {selectedPlant && (
                <span className="text-small" style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}>
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
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.875rem' }}
              placeholder="Any additional notes about this plant..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Plant'}
            </button>
            <Link
              href="/"
              style={{ flex: 1 }}
            >
              <button type="button" className="secondary" style={{ width: '100%' }}>
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function NewPlantPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPlantForm />
    </Suspense>
  )
}