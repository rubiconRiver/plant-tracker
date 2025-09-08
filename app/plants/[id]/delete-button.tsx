'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePlantButtonProps {
  plantId: string
  plantName: string
}

export default function DeletePlantButton({ plantId, plantName }: DeletePlantButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${plantName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/plants/${plantId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        alert('Failed to delete plant')
      }
    } catch (error) {
      alert('Error deleting plant')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}