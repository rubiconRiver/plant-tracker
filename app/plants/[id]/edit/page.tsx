import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import EditPlantForm from './edit-form'

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plant = await db.plant.findUnique({
    where: { id }
  })

  if (!plant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Plant</h1>
        <EditPlantForm plant={plant} />
      </div>
    </div>
  )
}