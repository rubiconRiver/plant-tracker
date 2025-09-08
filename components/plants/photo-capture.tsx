'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PhotoCaptureProps {
  plantId: string
  plantName: string
  onPhotoTaken?: () => void
}

export default function PhotoCapture({ plantId, plantName, onPhotoTaken }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch(`/api/plants/${plantId}/photos`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        router.refresh()
        if (onPhotoTaken) {
          onPhotoTaken()
        }
      } else {
        alert('Failed to upload photo')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo')
    } finally {
      setIsUploading(false)
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Take photo"
      />
      
      <button
        onClick={handleCapture}
        disabled={isUploading}
        className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-lg font-semibold"
      >
        {isUploading ? (
          <>
            <span className="animate-spin">⏳</span>
            Uploading...
          </>
        ) : (
          <>
            📸 Take Photo of {plantName}
          </>
        )}
      </button>
    </>
  )
}