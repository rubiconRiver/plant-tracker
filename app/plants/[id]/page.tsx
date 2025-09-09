import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DeletePlantButton from './delete-button'
import PhotoCapture from '@/components/plants/photo-capture'
import NfcTagLinker from '@/components/plants/nfc-tag-linker'
import PlantJourney from '@/components/plants/plant-journey'
import LocationDisplay from '@/components/plants/location-display'
import { statusColors, getStatusLabel, getStatusIcon } from '@/lib/plant-status'

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plant = await db.plant.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { takenAt: 'desc' }
      },
      statusHistory: {
        orderBy: { changedAt: 'desc' }
      },
      garden: true
    }
  })

  if (!plant) {
    notFound()
  }

  const plantedDate = new Date(plant.plantedDate).toLocaleDateString()
  const createdDate = new Date(plant.createdAt).toLocaleDateString()
  const updatedDate = new Date(plant.updatedAt).toLocaleDateString()


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-green-600 hover:text-green-700">
            ← Back to Plants
          </Link>
        </div>

        {/* Photo CTA - Prominent at the top */}
        <div className="mb-6">
          <PhotoCapture plantId={id} plantName={plant.name} />
        </div>

        {/* Plant Journey */}
        <PlantJourney 
          plantedDate={plant.plantedDate}
          daysToGermination={plant.daysToGermination}
          daysToHarvest={plant.daysToHarvest}
          currentStatus={plant.status}
          photos={plant.photos} 
          statusHistory={plant.statusHistory} 
        />

        {/* Latest Photo Display */}
        {plant.photos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Latest Photo</h2>
            <div className="relative aspect-square w-full max-w-md mx-auto">
              <Image
                src={plant.photos[0].url}
                alt={`${plant.name} photo`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Taken {new Date(plant.photos[0].takenAt).toLocaleString()}
            </p>
            {plant.photos.length > 1 && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {plant.photos.length - 1} more photo{plant.photos.length > 2 ? 's' : ''} available
              </p>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColors[plant.status] || 'bg-gray-100 text-gray-800'}`}>
                {getStatusIcon(plant.status)} {getStatusLabel(plant.status)}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/plants/${plant.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <DeletePlantButton plantId={plant.id} plantName={plant.name} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Plant Information</h2>
              <dl className="space-y-2">
                {plant.species && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Species/Variety</dt>
                    <dd className="text-gray-900 mb-3">{plant.species}</dd>
                  </>
                )}
                {plant.garden && plant.gardenRow !== null && plant.gardenColumn !== null && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Garden Position</dt>
                    <dd className="text-gray-900 mb-3">
                      <LocationDisplay
                        gardenName={plant.garden.name}
                        row={plant.gardenRow}
                        column={plant.gardenColumn}
                        totalRows={plant.garden.rows}
                        totalColumns={plant.garden.columnsPerRow}
                      />
                    </dd>
                  </>
                )}
                {plant.location && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Notes/Location</dt>
                    <dd className="text-gray-900 mb-3">{plant.location}</dd>
                  </>
                )}
                <dt className="text-sm font-medium text-gray-500">Planted Date</dt>
                <dd className="text-gray-900 mb-3">{plantedDate}</dd>
                <dt className="text-sm font-medium text-gray-500">Total Photos</dt>
                <dd className="text-gray-900">{plant.photos.length}</dd>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">System Information</h2>
              <dl className="space-y-2">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-gray-900 mb-3">{createdDate}</dd>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">{updatedDate}</dd>
              </dl>
            </div>
          </div>

          {plant.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Notes</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{plant.notes}</p>
            </div>
          )}

          {/* Photo Gallery */}
          {plant.photos.length > 1 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">All Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {plant.photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square">
                    <Image
                      src={photo.url}
                      alt={`${plant.name} photo`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NFC Tag Management - At the very bottom */}
          <NfcTagLinker plantId={id} plantName={plant.name} />
        </div>
      </div>
    </div>
  )
}