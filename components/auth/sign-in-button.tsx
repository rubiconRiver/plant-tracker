'use client'

import { signIn, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

interface SignInButtonProps {
  session: Session | null
}

export function SignInButton({ session }: SignInButtonProps) {
  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Sign In
    </button>
  )
}