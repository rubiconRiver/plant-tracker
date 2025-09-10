'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface GrowthTimelapseProps {
  photos: Array<{
    id: string
    url: string
    takenAt: Date
  }>
  plantName: string
}

export default function GrowthTimelapse({ photos, plantName }: GrowthTimelapseProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(500) // milliseconds between frames
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sort photos chronologically (oldest first)
  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime()
  )

  useEffect(() => {
    if (isPlaying && sortedPhotos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % sortedPhotos.length)
      }, speed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, sortedPhotos.length])

  const handlePlay = () => {
    setCurrentIndex(0) // Start from beginning
    setIsPlaying(true)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  if (sortedPhotos.length < 2) {
    return null // Don't show if less than 2 photos
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Growth Timelapse</h2>
      
      {!isPlaying ? (
        <div className="space-y-4">
          <button
            onClick={handlePlay}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
          >
            🌱 Watch {plantName} Grow! ({sortedPhotos.length} photos)
          </button>
          
          <div className="text-sm text-gray-600 text-center">
            <p>Shows {sortedPhotos.length} photos from {new Date(sortedPhotos[0].takenAt).toLocaleDateString()} to {new Date(sortedPhotos[sortedPhotos.length - 1].takenAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Photo Display */}
          <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
            <Image
              key={sortedPhotos[currentIndex].id} // Force re-render
              src={sortedPhotos[currentIndex].url}
              alt={`${plantName} - Photo ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />
            
            {/* Photo counter overlay */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {sortedPhotos.length}
            </div>
            
            {/* Date overlay */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              {new Date(sortedPhotos[currentIndex].takenAt).toLocaleDateString()}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sortedPhotos.length) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Speed control */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Speed:</span>
              <button
                onClick={() => setSpeed(1000)}
                className={`px-3 py-1 rounded ${speed === 1000 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Slow
              </button>
              <button
                onClick={() => setSpeed(500)}
                className={`px-3 py-1 rounded ${speed === 500 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setSpeed(250)}
                className={`px-3 py-1 rounded ${speed === 250 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Fast
              </button>
              <button
                onClick={() => setSpeed(100)}
                className={`px-3 py-1 rounded ${speed === 100 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Very Fast
              </button>
            </div>

            {/* Stop button */}
            <button
              onClick={handleStop}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  )
}