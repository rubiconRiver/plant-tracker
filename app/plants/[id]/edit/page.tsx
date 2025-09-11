import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import EditPlantForm from './edit-form'

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plant = await db.plant.findUnique({
    where: { id },
    include: {
      garden: true
    }
  })

  if (!plant) {
    notFound()
  }

  return <EditPlantForm plant={plant} />
}