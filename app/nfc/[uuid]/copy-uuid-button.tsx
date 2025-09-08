'use client'

import { useState } from 'react'

export default function CopyUuidButton({ uuid }: { uuid: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = uuid
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        alert('Failed to copy UUID. Please copy it manually.')
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
        copied 
          ? 'bg-green-600 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {copied ? '✓ UUID Copied!' : '📋 Copy UUID'}
    </button>
  )
}