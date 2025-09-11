import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import DeletePlantButton from './delete-button'
import PhotoCapture from '@/components/plants/photo-capture'
import NfcTagLinker from '@/components/plants/nfc-tag-linker'
import PlantJourney from '@/components/plants/plant-journey'
import LocationDisplay from '@/components/plants/location-display'
import GrowthTimelapse from '@/components/plants/growth-timelapse'

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

  const plantedDate = new Date(plant.plantedDate)
  const daysSincePlanted = Math.floor((Date.now() - plantedDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <main>
      <nav>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>🌱</span>
            </Link>
            <Link href="/">← Back to Garden</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/plants/${plant.id}/edit`}>
              <button className="secondary" style={{ padding: '0.5rem 1rem' }}>Edit</button>
            </Link>
            <DeletePlantButton plantId={plant.id} plantName={plant.name} />
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>{plant.name}</h1>
              {plant.species && (
                <p className="text-muted">{plant.species}</p>
              )}
            </div>
            <span className={`badge ${
              plant.status === 'seedling' ? 'success' :
              plant.status === 'growing' ? 'info' :
              plant.status === 'flowering' ? 'warning' :
              plant.status === 'fruiting' ? 'warning' :
              plant.status === 'harvested' ? 'muted' :
              'muted'
            }`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {plant.status}
            </span>
          </div>
        </header>

        {/* Photo Section */}
        <section className="mb-4">
          <div className="mb-3">
            <PhotoCapture plantId={id} plantName={plant.name} />
          </div>
          
          {plant.photos.length > 0 && (
            <>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '16/9'
                }}>
                  <Image
                    src={plant.photos[0].url}
                    alt={`Latest photo of ${plant.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="text-small text-muted">
                    Latest photo taken {new Date(plant.photos[0].takenAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {plant.photos.length > 1 && (
                <div className="mt-3">
                  <GrowthTimelapse photos={plant.photos} plantName={plant.name} />
                </div>
              )}
            </>
          )}
        </section>

        {/* Journey Timeline */}
        <section className="mb-4">
          <PlantJourney 
            plantedDate={plant.plantedDate}
            daysToGermination={plant.daysToGermination}
            daysToHarvest={plant.daysToHarvest}
            currentStatus={plant.status}
            photos={plant.photos} 
            statusHistory={plant.statusHistory} 
          />
        </section>

        {/* Plant Information Grid */}
        <section className="grid grid-2 gap-3 mb-4">
          <article>
            <h3>Plant Details</h3>
            <dl style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <dt className="text-small text-muted">Planted</dt>
                <dd>{plantedDate.toLocaleDateString()} ({daysSincePlanted} days ago)</dd>
              </div>
              
              {plant.locationType && (
                <div>
                  <dt className="text-small text-muted">Location Type</dt>
                  <dd>
                    {plant.locationType === 'hydroponics' && '💧 Hydroponics'}
                    {plant.locationType === 'garden' && '🌻 Garden Bed'}
                    {plant.locationType === 'indoor' && '🏠 Indoor'}
                    {plant.locationType === 'greenhouse' && '🏡 Greenhouse'}
                    {plant.locationType === 'balcony' && '🪴 Balcony/Patio'}
                    {plant.locationType === 'windowsill' && '🪟 Windowsill'}
                  </dd>
                </div>
              )}
              
              {plant.quantity && plant.quantity > 1 && (
                <div>
                  <dt className="text-small text-muted">Quantity</dt>
                  <dd>{plant.quantity} plants</dd>
                </div>
              )}
              
              {plant.garden && plant.gardenRow !== null && plant.gardenColumn !== null && (
                <div>
                  <dt className="text-small text-muted">Garden Position</dt>
                  <dd>
                    <LocationDisplay
                      gardenName={plant.garden.name}
                      row={plant.gardenRow}
                      column={plant.gardenColumn}
                      totalRows={plant.garden.rows}
                      totalColumns={plant.garden.columnsPerRow}
                    />
                  </dd>
                </div>
              )}
              
              {plant.location && (
                <div>
                  <dt className="text-small text-muted">{plant.locationType === 'garden' ? 'Additional Location' : 'Location Details'}</dt>
                  <dd>{plant.location}</dd>
                </div>
              )}

              <div>
                <dt className="text-small text-muted">Total Photos</dt>
                <dd>{plant.photos.length} photo{plant.photos.length !== 1 ? 's' : ''}</dd>
              </div>
            </dl>
          </article>

          <article>
            <h3>Care Information</h3>
            <dl style={{ display: 'grid', gap: '1rem' }}>
              {plant.daysToGermination && (
                <div>
                  <dt className="text-small text-muted">Days to Germination</dt>
                  <dd>{plant.daysToGermination} days</dd>
                </div>
              )}
              
              {plant.daysToHarvest && (
                <div>
                  <dt className="text-small text-muted">Days to Harvest</dt>
                  <dd>{plant.daysToHarvest} days</dd>
                </div>
              )}

              <div>
                <dt className="text-small text-muted">Next Watering</dt>
                <dd>Tomorrow</dd>
              </div>

              <div>
                <dt className="text-small text-muted">Last Updated</dt>
                <dd>{new Date(plant.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </article>
        </section>

        {/* Notes Section */}
        {plant.notes && (
          <section className="mb-4">
            <article>
              <h3>Notes</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{plant.notes}</p>
            </article>
          </section>
        )}

        {/* Photo Gallery */}
        {plant.photos.length > 1 && (
          <section className="mb-4">
            <h2>Photo History</h2>
            <div className="grid grid-3">
              {plant.photos.map((photo, index) => (
                <div key={photo.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '1'
                  }}>
                    <Image
                      src={photo.url}
                      alt={`${plant.name} photo ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <p className="text-small text-muted text-center">
                      {new Date(photo.takenAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NFC Tag Section */}
        <section>
          <NfcTagLinker plantId={id} plantName={plant.name} />
        </section>

        {/* Quick Actions */}
        <section className="mt-4 flex gap-2">
          <button>💧 Log Watering</button>
          <button className="secondary">✂️ Log Pruning</button>
          <button className="secondary">🌱 Update Status</button>
        </section>
      </div>
    </main>
  )
}