'use client'

import { useState } from 'react'

interface NFCUrlDisplayProps {
  plantId: string
  plantName: string
}

export default function NFCUrlDisplay({ plantId }: NFCUrlDisplayProps) {
  const [copied, setCopied] = useState(false)
  
  // Get the current host URL (works for both localhost and IP access)
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://192.168.0.25:3000'
    
  const nfcUrl = `${baseUrl}/plants/${plantId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(nfcUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers or mobile
      const textArea = document.createElement('textarea')
      textArea.value = nfcUrl
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        alert('Failed to copy URL')
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">NFC Tag Setup</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">
          Write this URL to an NFC tag to quick-access this plant:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nfcUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg font-mono text-black"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          💡 Use apps like &quot;NFC Tools&quot; or &quot;TagWriter&quot; to write this URL to your NFC tag
        </p>
      </div>
    </div>
  )
}