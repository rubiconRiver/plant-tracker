import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function NfcRedirect({
  params
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  
  // Look up the NFC tag
  const nfcTag = await db.nfcTag.findUnique({
    where: { uuid },
    include: { plant: true }
  })
  
  // If tag exists and has a plant, redirect to it
  if (nfcTag?.plantId) {
    redirect(`/plants/${nfcTag.plantId}`)
  }
  
  // If tag exists but unassigned, show setup page
  if (nfcTag) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Unassigned NFC Tag</h1>
          <p className="text-gray-600 mb-6">
            This tag (ID: {nfcTag.uuid.slice(0, 8)}...) is not linked to a plant yet.
          </p>
          <p className="text-sm text-gray-500">
            To link this tag, go to a plant page and tap &quot;Link NFC Tag&quot;
          </p>
        </div>
      </div>
    )
  }
  
  // Unknown tag - could offer to register it
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Unknown NFC Tag</h1>
        <p className="text-gray-600 mb-6">
          This tag is not registered in the system.
        </p>
        <p className="text-xs text-gray-400 font-mono">
          UUID: {uuid}
        </p>
      </div>
    </div>
  )
}