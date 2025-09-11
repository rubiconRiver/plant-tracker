import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import PlantJourney from '@/components/plants/plant-journey'
import LocationDisplay from '@/components/plants/location-display'

export default async function PublicPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Get plant without auth check
  const plant = await db.plant.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { takenAt: 'desc' }
      },
      garden: true,
      statusHistory: {
        orderBy: { changedAt: 'desc' }
      }
    }
  })

  // Check if plant exists and is shareable
  if (!plant || !plant.isShareable) {
    notFound()
  }

  const plantedDate = new Date(plant.plantedDate)
  const daysSincePlanted = Math.floor((Date.now() - plantedDate.getTime()) / (1000 * 60 * 60 * 24))
  const latestPhoto = plant.photos[0]
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'seedling': return 'success'
      case 'growing': return 'info'
      case 'flowering':
      case 'fruiting': return 'warning'
      default: return 'muted'
    }
  }

  return (
    <main>
      <nav>
        <div className="container flex justify-between items-center">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🌱 Plant Tracker</h1>
          <Link href="/auth/signin">
            <button className="secondary" style={{ padding: '0.5rem 1rem' }}>Sign In</button>
          </Link>
        </div>
      </nav>

      <div className="container">
        {/* Public View Notice */}
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <p className="text-small">
            📱 You&apos;re viewing a shared plant. 
            <Link href="/auth/signin" style={{ marginLeft: '0.5rem', fontWeight: 500 }}>
              Sign in to track your own plants
            </Link>
          </p>
        </div>

        {/* Plant Header */}
        <header className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>{plant.name}</h1>
              {plant.species && (
                <p className="text-muted">{plant.species}</p>
              )}
            </div>
            <span className={`badge ${getStatusClass(plant.status)}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {plant.status}
            </span>
          </div>
        </header>

        {/* Plant Journey Timeline */}
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

        {/* Latest Photo */}
        {latestPhoto && (
          <section className="mb-4">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '16/9'
              }}>
                <Image
                  src={latestPhoto.url}
                  alt={`${plant.name} photo`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <p className="text-small text-muted">
                  Latest photo taken {new Date(latestPhoto.takenAt).toLocaleString()}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Plant Information */}
        <section className="grid grid-2 gap-3 mb-4">
          <article>
            <h3>Plant Details</h3>
            <dl style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <dt className="text-small text-muted">Planted</dt>
                <dd>{plantedDate.toLocaleDateString()} ({daysSincePlanted} days ago)</dd>
              </div>
              
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

              <div>
                <dt className="text-small text-muted">Total Photos</dt>
                <dd>{plant.photos.length} photo{plant.photos.length !== 1 ? 's' : ''}</dd>
              </div>
            </dl>
          </article>

          <article>
            <h3>Growth Information</h3>
            <dl style={{ display: 'grid', gap: '1rem' }}>
              {plant.daysToGermination && (
                <div>
                  <dt className="text-small text-muted">Days to Germination</dt>
                  <dd>{plant.daysToGermination} days</dd>
                </div>
              )}
              
              {plant.daysToHarvest && (
                <div>
                  <dt className="text-small text-muted">Expected Harvest</dt>
                  <dd>{plant.daysToHarvest} days from planting</dd>
                </div>
              )}

              <div>
                <dt className="text-small text-muted">Current Stage</dt>
                <dd>{plant.status}</dd>
              </div>
            </dl>
          </article>
        </section>

        {/* Photo Gallery */}
        {plant.photos.length > 1 && (
          <section className="mb-4">
            <h2>Growth Progress</h2>
            <div className="grid grid-3">
              {plant.photos.slice(0, 6).map((photo, index) => (
                <div key={photo.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '1'
                  }}>
                    <Image
                      src={photo.url}
                      alt={`${plant.name} progress ${index + 1}`}
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

        {/* Call to Action */}
        <section className="text-center mt-4">
          <div className="card">
            <h3>Start Your Own Garden</h3>
            <p className="text-muted mb-3">
              Track your plants from seed to harvest with Plant Tracker
            </p>
            <Link href="/auth/signin">
              <button>Get Started Free</button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}