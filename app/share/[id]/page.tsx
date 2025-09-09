import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

export default async function PublicPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Get plant without auth check
  const plant = await db.plant.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { takenAt: 'desc' }
      },
      garden: true
    }
  })

  // Check if plant exists and is shareable
  if (!plant || !plant.isShareable) {
    notFound()
  }

  const plantedDate = new Date(plant.plantedDate).toLocaleDateString()
  const latestPhoto = plant.photos[0]
  
  const statusColors: Record<string, string> = {
    seedling: 'bg-green-100 text-green-800',
    growing: 'bg-blue-100 text-blue-800',
    mature: 'bg-purple-100 text-purple-800',
    harvested: 'bg-yellow-100 text-yellow-800',
    dead: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public View Header */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📱 You&apos;re viewing a shared plant. 
            <Link href="/auth/signin" className="ml-2 underline font-medium">
              Sign in to track your own plants
            </Link>
          </p>
        </div>

        {/* Main Photo */}
        {latestPhoto && (
          <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
            <Image
              src={latestPhoto.url}
              alt={`${plant.name} photo`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Plant Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
              {plant.species && (
                <p className="text-lg text-gray-600">{plant.species}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[plant.status] || statusColors.seedling
            }`}>
              {plant.status}
            </span>
          </div>

          {/* Plant Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Plant Information</h2>
              <dl className="space-y-2">
                {plant.garden && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Garden</dt>
                    <dd className="text-gray-900 mb-3">{plant.garden.name}</dd>
                  </>
                )}
                {plant.gardenRow !== null && plant.gardenColumn !== null && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Position</dt>
                    <dd className="text-gray-900 mb-3">
                      Row {plant.gardenRow}, Column {plant.gardenColumn}
                    </dd>
                  </>
                )}
                <dt className="text-sm font-medium text-gray-500">Planted</dt>
                <dd className="text-gray-900 mb-3">{plantedDate}</dd>
                <dt className="text-sm font-medium text-gray-500">Total Photos</dt>
                <dd className="text-gray-900">{plant.photos.length}</dd>
              </dl>
            </div>

            {/* Growing Info if available */}
            {(plant.daysToGermination || plant.daysToHarvest) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Growing Information</h2>
                <dl className="space-y-2">
                  {plant.daysToGermination && (
                    <>
                      <dt className="text-sm font-medium text-gray-500">Days to Germination</dt>
                      <dd className="text-gray-900 mb-3">{plant.daysToGermination}</dd>
                    </>
                  )}
                  {plant.daysToHarvest && (
                    <>
                      <dt className="text-sm font-medium text-gray-500">Days to Harvest</dt>
                      <dd className="text-gray-900">{plant.daysToHarvest}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </div>

          {/* Notes */}
          {plant.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Notes</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{plant.notes}</p>
            </div>
          )}

          {/* Photo Gallery */}
          {plant.photos.length > 1 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Growth Timeline</h2>
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
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                      {new Date(photo.takenAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Want to track your own plants?</p>
          <Link
            href="/auth/signin"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}