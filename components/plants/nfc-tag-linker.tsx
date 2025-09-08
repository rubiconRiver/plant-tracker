'use client'

import { useState } from 'react'

interface NfcTagLinkerProps {
  plantId: string
  plantName: string
}

export default function NfcTagLinker({ plantId, plantName }: NfcTagLinkerProps) {
  const [isLinking, setIsLinking] = useState(false)
  const [tagUuid, setTagUuid] = useState('')
  const [status, setStatus] = useState<'idle' | 'reading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleLinkTag = async () => {
    if (!tagUuid.trim()) {
      setMessage('Please enter a tag UUID')
      setStatus('error')
      return
    }

    setIsLinking(true)
    setStatus('idle')
    
    try {
      const response = await fetch('/api/nfc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: tagUuid.trim(),
          plantId,
          label: `${plantName} Tag`
        })
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Tag linked successfully!')
        setTagUuid('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage('Failed to link tag')
      }
    } catch {
      setStatus('error')
      setMessage('Error linking tag')
    } finally {
      setIsLinking(false)
    }
  }

  // Try to read NFC if Web NFC API is available (Android Chrome)
  const handleReadNfc = async () => {
    // Check if Web NFC is available
    if ('NDEFReader' in window) {
      setStatus('reading')
      setMessage('Hold your NFC tag near the phone...')
      
      try {
        // @ts-expect-error - NDEFReader not in TypeScript types yet
        const ndef = new NDEFReader()
        await ndef.scan()
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ndef.addEventListener('reading', ({ message }: { message: any }) => {
          // Extract URL from NFC tag
          for (const record of message.records) {
            if (record.recordType === 'url') {
              const decoder = new TextDecoder()
              const url = decoder.decode(record.data)
              // Extract UUID from URL like https://plants.mobcat.ca/nfc/uuid-here
              const match = url.match(/\/nfc\/([a-f0-9-]+)/i)
              if (match) {
                setTagUuid(match[1])
                setStatus('idle')
                setMessage('Tag detected! Click Link to associate it.')
              }
            }
          }
        })
      } catch {
        setStatus('error')
        setMessage('NFC reading not supported on this device')
      }
    } else {
      setStatus('error')
      setMessage('Web NFC is only supported on Android Chrome')
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">NFC Tag Management</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Link an NFC tag to quickly access this plant
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={tagUuid}
              onChange={(e) => setTagUuid(e.target.value)}
              placeholder="Enter tag UUID or scan below"
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleLinkTag}
              disabled={isLinking}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLinking ? 'Linking...' : 'Link Tag'}
            </button>
          </div>
        </div>

        {/* Only show NFC read button on Android */}
        <div className="flex justify-center">
          <button
            onClick={handleReadNfc}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📱 Read NFC Tag (Android only)
          </button>
        </div>

        {message && (
          <div className={`text-sm p-2 rounded ${
            status === 'success' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
            status === 'reading' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {message}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 How to set up your NFC tag:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Program your NFC tag with: <code className="bg-gray-200 px-1">https://plants.mobcat.ca/nfc/[unique-id]</code></li>
            <li>Enter the unique ID above or scan the tag</li>
            <li>Click &quot;Link Tag&quot; to associate it with this plant</li>
          </ol>
        </div>
      </div>
    </div>
  )
}