'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An error occurred during authentication.'
  
  if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.'
  } else if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You do not have permission to sign in.'
  } else if (error === 'Verification') {
    errorMessage = 'The sign-in link is no longer valid. It may have expired.'
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
        
        <p className="mb-6 text-red-600">{errorMessage}</p>

        <Link 
          href="/auth/signin"
          className="inline-block py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}