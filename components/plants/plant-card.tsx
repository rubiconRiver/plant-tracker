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
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'seedling':
        return 'success'
      case 'growing':
        return 'info'
      case 'flowering':
      case 'fruiting':
        return 'warning'
      case 'harvested':
      case 'dead':
        return 'muted'
      default:
        return ''
    }
  }
  
  return (
    <Link href={`/plants/${plant.id}`} style={{ textDecoration: 'none' }}>
      <article className="animate-grow" style={{ height: '100%', cursor: 'pointer' }}>
        {latestPhoto ? (
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '1', 
            marginBottom: '1rem',
            overflow: 'hidden',
            borderRadius: '0.5rem'
          }}>
            <Image
              src={latestPhoto.url}
              alt={plant.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              padding: '1rem',
            }}>
              <h3 style={{ color: 'white', marginBottom: 0 }}>{plant.name}</h3>
            </div>
          </div>
        ) : (
          <div style={{ 
            aspectRatio: '1', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            opacity: 0.1,
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <span style={{ fontSize: '4rem', position: 'absolute', opacity: 0.5 }}>🌱</span>
            <h3 style={{ 
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              margin: 0,
              color: 'var(--foreground)'
            }}>{plant.name}</h3>
          </div>
        )}
        
        <div>
          {plant.species && (
            <p className="text-small text-muted" style={{ marginBottom: '0.5rem' }}>
              {plant.species}
            </p>
          )}
          
          {plant.location && (
            <p className="text-small text-muted" style={{ marginBottom: '0.5rem' }}>
              📍 {plant.location}
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-small text-muted">
              Planted: {plantedDate}
            </span>
            <span className={`badge ${getStatusClass(plant.status)}`}>
              {plant.status}
            </span>
          </div>
          
          {latestPhoto && (
            <p className="text-small text-muted" style={{ marginTop: '0.5rem', opacity: 0.7 }}>
              📸 {new Date(latestPhoto.takenAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}