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
    seedling: 'bg-lime-100 text-lime-800',
    growing: 'bg-blue-100 text-blue-800',
    mature: 'bg-lime-100 text-lime-800',
    harvested: 'bg-orange-100 text-orange-800',
    dead: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <Link href={`/plants/${plant.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-amber-200">
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
          <div className="aspect-square w-full bg-amber-50 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">🌱</span>
              <h3 className="text-xl font-semibold text-amber-900 mt-2">{plant.name}</h3>
            </div>
          </div>
        )}
        
        <div className="p-4">
          {plant.species && (
            <p className="text-sm text-amber-700 mb-1">{plant.species}</p>
          )}
          {plant.location && (
            <p className="text-sm text-amber-700 mb-2">📍 {plant.location}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-sm text-amber-600">Planted: {plantedDate}</p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[plant.status] || 'bg-gray-100 text-gray-800'}`}>
              {plant.status}
            </span>
          </div>
          {latestPhoto && (
            <p className="text-xs text-amber-500 mt-2">
              📸 {new Date(latestPhoto.takenAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}