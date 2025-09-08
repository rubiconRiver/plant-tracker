'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Plant {
  id: string
  name: string
  species: string | null
  location: string | null
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
  
  const plantedDateString = new Date(plant.plantedDate).toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      species: formData.get('species') || null,
      location: formData.get('location') || null,
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
    <>
      <div className="mb-6">
        <Link href={`/plants/${plant.id}`} className="text-green-600 hover:text-green-700">
          ← Back to Plant Details
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Plant Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={plant.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
            Species/Variety
          </label>
          <input
            type="text"
            id="species"
            name="species"
            defaultValue={plant.species || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={plant.location || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700 mb-2">
            Planted Date *
          </label>
          <input
            type="date"
            id="plantedDate"
            name="plantedDate"
            required
            defaultValue={plantedDateString}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={plant.status}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="seedling">Seedling</option>
            <option value="growing">Growing</option>
            <option value="mature">Mature</option>
            <option value="harvested">Harvested</option>
            <option value="dead">Dead</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={plant.notes || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href={`/plants/${plant.id}`}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}