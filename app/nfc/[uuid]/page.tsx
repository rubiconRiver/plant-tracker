import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import CopyUuidButton from './copy-uuid-button'

function UnassignedTagPage({ uuid }: { uuid: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Unassigned NFC Tag</h1>
        <p className="text-gray-600">
          This tag is registered but not linked to a plant yet.
        </p>
        
        <div className="bg-white rounded-lg p-4 space-y-3">
          <p className="text-sm text-gray-500">Tag UUID:</p>
          <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
            {uuid}
          </p>
          <CopyUuidButton uuid={uuid} />
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">How to link this tag:</p>
          <ol className="list-decimal list-inside text-left space-y-1">
            <li>Copy the UUID above</li>
            <li>Go to any plant page</li>
            <li>Scroll to &quot;NFC Tag Management&quot;</li>
            <li>Paste the UUID and click &quot;Link Tag&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

function UnknownTagPage({ uuid }: { uuid: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-2xl font-bold">New NFC Tag Detected</h1>
        <p className="text-gray-600">
          This tag hasn&apos;t been registered yet. Copy the UUID to link it to a plant.
        </p>
        
        <div className="bg-white rounded-lg p-4 space-y-3">
          <p className="text-sm text-gray-500">Tag UUID:</p>
          <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
            {uuid}
          </p>
          <CopyUuidButton uuid={uuid} />
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">How to use this tag:</p>
          <ol className="list-decimal list-inside text-left space-y-1">
            <li>Copy the UUID above</li>
            <li>Go to any plant page</li>
            <li>Scroll to &quot;NFC Tag Management&quot;</li>
            <li>Paste the UUID and click &quot;Link Tag&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

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
    return <UnassignedTagPage uuid={nfcTag.uuid} />
  }
  
  // Unknown tag - offer to register it
  return <UnknownTagPage uuid={uuid} />
}