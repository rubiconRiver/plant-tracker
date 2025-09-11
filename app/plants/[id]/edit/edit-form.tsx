'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRandomPlantName } from '@/lib/plant-names'
import { plantStatuses } from '@/lib/plant-status'
import { locationTypes } from '@/lib/location-types'
import LocationPicker from '@/components/gardens/location-picker'

interface Plant {
  id: string
  name: string
  species: string | null
  location: string | null
  locationType: string | null
  quantity: number
  gardenId: string | null
  gardenRow: number | null
  gardenColumn: number | null
  plantedDate: Date
  status: string
  notes: string | null
}

interface EditPlantFormProps {
  plant: Plant
}

export default function EditPlantForm({ plant }: EditPlantFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentName, setCurrentName] = useState(plant.name)
  const [currentSpecies, setCurrentSpecies] = useState(plant.species || '')
  const [quantity, setQuantity] = useState(plant.quantity || 1)
  const [locationType, setLocationType] = useState(plant.locationType || 'garden')
  const [locationText, setLocationText] = useState(plant.location || '')
  const [location, setLocation] = useState({
    gardenId: plant.gardenId,
    row: plant.gardenRow,
    column: plant.gardenColumn
  })
  interface ExistingPlant {
    id: string
    gardenId: string | null
    gardenRow: number | null
    gardenColumn: number | null
  }
  const [existingPlants, setExistingPlants] = useState<ExistingPlant[]>([])
  
  const plantedDateString = new Date(plant.plantedDate).toISOString().split('T')[0]

  // Load existing plants for location picker
  useEffect(() => {
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => {
        // Filter out current plant from occupied positions
        setExistingPlants(data?.filter((p: ExistingPlant) => p.id !== plant.id) || [])
      })
      .catch(() => setExistingPlants([]))
  }, [plant.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      species: formData.get('species') || null,
      location: formData.get('location') || null,
      locationType: formData.get('locationType'),
      quantity: parseInt(formData.get('quantity') as string) || 1,
      gardenId: location.gardenId,
      gardenRow: location.row,
      gardenColumn: location.column,
      plantedDate: formData.get('plantedDate'),
      status: formData.get('status'),
      notes: formData.get('notes') || null
    }

    try {
      const response = await fetch(`/api/plants/${plant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push(`/plants/${plant.id}`)
        router.refresh()
      } else {
        alert('Failed to update plant')
      }
    } catch {
      alert('Error updating plant')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <nav>
        <div className="container flex items-center">
          <Link href={`/plants/${plant.id}`} style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🌱</span>
          </Link>
          <a href={`/plants/${plant.id}`}>← Back to Plant Details</a>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '42rem' }}>
        <header className="mb-4">
          <h1>Edit Plant</h1>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Plant Name *
              {currentSpecies && (
                <button
                  type="button"
                  onClick={() => {
                    const newName = getRandomPlantName(currentSpecies)
                    setCurrentName(newName)
                  }}
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
                  🎲 Generate fun name
                </button>
              )}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label htmlFor="species" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Species/Variety
            </label>
            <input
              type="text"
              id="species"
              name="species"
              value={currentSpecies}
              onChange={(e) => setCurrentSpecies(e.target.value)}
              style={{ width: '100%' }}
            />
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

          {/* Text location field for non-garden types or additional notes */}
          <div>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              {locationType === 'garden' ? 'Additional Location Notes' : 'Location Details'}
              {locationType === 'garden' && (
                <span className="text-small text-muted" style={{ marginLeft: '0.5rem' }}>(optional)</span>
              )}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder={
                locationType === 'hydroponics' ? 'e.g., Tower A, Channel 3' : 
                locationType === 'garden' ? 'e.g., Near fence, Corner spot' :
                'e.g., Living room, South window'
              }
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label htmlFor="plantedDate" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Planted Date *
            </label>
            <input
              type="date"
              id="plantedDate"
              name="plantedDate"
              required
              defaultValue={plantedDateString}
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
              defaultValue={plant.status}
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
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={plant.notes || ''}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href={`/plants/${plant.id}`}
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