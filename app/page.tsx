import Link from 'next/link'
import { PlantCard } from '@/components/plants/plant-card'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { SignInButton } from '@/components/auth/sign-in-button'

export default async function Home() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Plant Tracker</h1>
          <p className="text-amber-700 mb-8">Sign in to track your plants</p>
          <SignInButton session={null} />
        </div>
      </div>
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
    <div className="min-h-screen bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-amber-900">My Plants</h1>
          <SignInButton session={session} />
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-amber-700">
            {session?.user ? `Welcome, ${session.user.email}` : 'Sign in to track your plants'}
          </p>
          <div className="flex gap-2">
            <Link
              href="/calendar"
              className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Link>
            <Link
              href="/plants/new"
              className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors"
            >
              Add Plant
            </Link>
          </div>
        </div>

        {plants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-700 mb-4">No plants yet. Start by adding your first plant!</p>
            <Link
              href="/plants/new"
              className="inline-block bg-lime-600 text-white px-6 py-3 rounded-lg hover:bg-lime-700 transition-colors"
            >
              Add Your First Plant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}