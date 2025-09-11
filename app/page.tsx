import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { SignInButton } from '@/components/auth/sign-in-button'

export default async function Home() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return (
      <main className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱 Plant Tracker</h1>
          <p className="text-muted mb-4">Sign in to track your plants from seed to harvest</p>
          <SignInButton session={null} />
        </div>
      </main>
    )
  }
  
  // Get user's workspace and gardens
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      workspaces: {
        include: {
          workspace: {
            include: {
              gardens: true
            }
          }
        }
      }
    }
  })
  
  const gardenIds = user?.workspaces[0]?.workspace.gardens.map(g => g.id) || []
  
  const plants = await db.plant.findMany({
    where: {
      gardenId: {
        in: gardenIds
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      photos: {
        orderBy: { takenAt: 'desc' },
        take: 1
      }
    }
  })

  return (
    <main>
      <nav>
        <div className="container flex justify-between items-center">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🌱 Plant Tracker</h1>
          <div className="flex items-center gap-3">
            <a href="/calendar">Calendar</a>
            <SignInButton session={session} />
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="mb-4">
          <h1>Welcome to Your Garden</h1>
          <p className="text-muted">
            {session?.user ? `Hello, ${session.user.email}` : 'Track your plants from seed to harvest'}
          </p>
        </header>

        <section className="flex gap-2 mb-4">
          <Link href="/plants/new">
            <button>+ Add New Plant</button>
          </Link>
          <Link href="/calendar">
            <button className="secondary">View Calendar</button>
          </Link>
        </section>

        {plants.length === 0 ? (
          <section className="text-center" style={{ padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
            <h2>Start Your Garden</h2>
            <p className="text-muted mb-3">
              Add your first plant to begin tracking its growth journey
            </p>
            <Link href="/plants/new">
              <button>Add Your First Plant</button>
            </Link>
          </section>
        ) : (
          <section>
            <h2 className="mb-3">Your Plants ({plants.length})</h2>
            <div className="grid grid-3">
              {plants.map((plant) => (
                <Link key={plant.id} href={`/plants/${plant.id}`} style={{ textDecoration: 'none' }}>
                  <article className="animate-grow" style={{ height: '100%', cursor: 'pointer' }}>
                    {plant.photos?.[0] ? (
                      <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        aspectRatio: '1', 
                        marginBottom: '1rem',
                        overflow: 'hidden',
                        borderRadius: '0.5rem'
                      }}>
                        <Image
                          src={plant.photos[0].url}
                          alt={plant.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
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
                        marginBottom: '1rem'
                      }}>
                        <span style={{ fontSize: '3rem', opacity: 1 }}>🌱</span>
                      </div>
                    )}
                    
                    <h3>{plant.name}</h3>
                    {plant.species && (
                      <p className="text-small text-muted">{plant.species}</p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-small">
                        📅 {new Date(plant.plantedDate).toLocaleDateString()}
                      </span>
                      <span className={`badge ${
                        plant.status === 'seedling' ? 'success' :
                        plant.status === 'growing' ? 'info' :
                        plant.status === 'flowering' ? 'warning' :
                        'muted'
                      }`}>
                        {plant.status}
                      </span>
                    </div>
                    
                    {plant.location && (
                      <p className="text-small text-muted mt-2">📍 {plant.location}</p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4 grid grid-2">
          <div className="card">
            <h3>Quick Stats</h3>
            <div className="grid grid-3 text-center mt-3">
              <div>
                <p className="text-large" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {plants.length}
                </p>
                <p className="text-small text-muted">Plants</p>
              </div>
              <div>
                <p className="text-large" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                  {plants.filter(p => p.photos?.length > 0).length}
                </p>
                <p className="text-small text-muted">With Photos</p>
              </div>
              <div>
                <p className="text-large" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {plants.filter(p => p.status === 'growing').length}
                </p>
                <p className="text-small text-muted">Growing</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <div className="flex flex-col gap-2 mt-3">
              <p className="text-small">🌱 Added Tomato plant - 2 days ago</p>
              <p className="text-small">📸 New photo of Basil - 3 days ago</p>
              <p className="text-small">💧 Watered all plants - 1 week ago</p>
              <p className="text-small">🌺 Mint started flowering - 2 weeks ago</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}