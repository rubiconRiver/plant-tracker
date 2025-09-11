'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('resend', {
        email,
        redirect: false,
        callbackUrl: '/'
      })

      if (result?.error) {
        setError('Failed to send sign-in email. Please try again.')
      } else {
        window.location.href = '/auth/verify-request'
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
        {/* Logo/Branding Section */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌱</div>
          <h1 style={{ marginBottom: '0.5rem' }}>Plant Tracker</h1>
          <p className="text-muted">Track your garden's journey</p>
        </div>

        {/* Sign In Card */}
        <article>
          <h2 style={{ marginBottom: '1.5rem' }}>Welcome back</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                disabled={loading}
                style={{ opacity: loading ? 0.5 : 1 }}
              />
            </div>

            {error && (
              <div style={{ 
                background: 'rgba(220, 38, 38, 0.1)', 
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: 'var(--destructive)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ 
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg 
                    className="animate-spin" 
                    style={{ marginRight: '0.5rem', width: '1.25rem', height: '1.25rem' }}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending magic link...
                </span>
              ) : (
                'Sign in with Email'
              )}
            </button>
          </form>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid var(--card-border)' 
          }}>
            <p className="text-small text-muted text-center">
              We'll send you a magic link to sign in instantly.
              <br />
              <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                No password needed!
              </span>
            </p>
          </div>
        </article>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-small text-muted">
            New to Plant Tracker?
            <br />
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
              Enter your email above to get started
            </span>
          </p>
        </div>
      </div>
    </main>
  )
}