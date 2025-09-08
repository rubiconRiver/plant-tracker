import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  takenAt: string | Date
}

interface Plant {
  id: string
  name: string
  species: string | null
  location: string | null
  plantedDate: string | Date
  status: string
  photos?: Photo[]
}

interface PlantCardProps {
  plant: Plant
}

export function PlantCard({ plant }: PlantCardProps) {
  const plantedDate = new Date(plant.plantedDate).toLocaleDateString()
  const latestPhoto = plant.photos?.[0]
  
  const statusColors: Record<string, string> = {
    seedling: 'bg-green-100 text-green-800',
    growing: 'bg-blue-100 text-blue-800',
    mature: 'bg-purple-100 text-purple-800',
    harvested: 'bg-yellow-100 text-yellow-800',
    dead: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <Link href={`/plants/${plant.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {latestPhoto ? (
          <div className="relative aspect-square w-full">
            <Image
              src={latestPhoto.url}
              alt={plant.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-xl font-semibold text-white">{plant.name}</h3>
            </div>
          </div>
        ) : (
          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">🌱</span>
              <h3 className="text-xl font-semibold text-gray-900 mt-2">{plant.name}</h3>
            </div>
          </div>
        )}
        
        <div className="p-4">
          {plant.species && (
            <p className="text-sm text-gray-600 mb-1">{plant.species}</p>
          )}
          {plant.location && (
            <p className="text-sm text-gray-600 mb-2">📍 {plant.location}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Planted: {plantedDate}</p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[plant.status] || 'bg-gray-100 text-gray-800'}`}>
              {plant.status}
            </span>
          </div>
          {latestPhoto && (
            <p className="text-xs text-gray-400 mt-2">
              📸 {new Date(latestPhoto.takenAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}