import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import CopyUuidButton from './copy-uuid-button'

function UnassignedTagPage({ uuid }: { uuid: string }) {
  return (
    <main className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏷️</div>
          <h1 style={{ marginBottom: '0.5rem' }}>Unassigned NFC Tag</h1>
          <p className="text-muted">
            This tag is registered but not linked to a plant yet.
          </p>
        </div>
        
        <article style={{ marginBottom: '1.5rem' }}>
          <p className="text-small text-muted" style={{ marginBottom: '0.5rem' }}>Tag UUID:</p>
          <div style={{ 
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            background: 'var(--background)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            wordBreak: 'break-all',
            marginBottom: '1rem'
          }}>
            {uuid}
          </div>
          <CopyUuidButton uuid={uuid} />
        </article>
        
        <article>
          <h3 style={{ marginBottom: '1rem' }}>How to link this tag:</h3>
          <ol style={{ 
            paddingLeft: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <li>Copy the UUID above</li>
            <li>Go to any plant page</li>
            <li>Scroll to "NFC Tag Management"</li>
            <li>Paste the UUID and click "Link Tag"</li>
          </ol>
        </article>
      </div>
    </main>
  )
}

function UnknownTagPage({ uuid }: { uuid: string }) {
  return (
    <main className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{ marginBottom: '0.5rem' }}>New NFC Tag Detected</h1>
          <p className="text-muted">
            This tag hasn't been registered yet. Copy the UUID to link it to a plant.
          </p>
        </div>
        
        <article style={{ marginBottom: '1.5rem' }}>
          <p className="text-small text-muted" style={{ marginBottom: '0.5rem' }}>Tag UUID:</p>
          <div style={{ 
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            background: 'var(--background)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            wordBreak: 'break-all',
            marginBottom: '1rem'
          }}>
            {uuid}
          </div>
          <CopyUuidButton uuid={uuid} />
        </article>
        
        <article>
          <h3 style={{ marginBottom: '1rem' }}>How to use this tag:</h3>
          <ol style={{ 
            paddingLeft: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <li>Copy the UUID above</li>
            <li>Go to any plant page</li>
            <li>Scroll to "NFC Tag Management"</li>
            <li>Paste the UUID and click "Link Tag"</li>
          </ol>
        </article>
      </div>
    </main>
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