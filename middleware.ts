import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public access to these paths
  const publicPaths = [
    '/auth/signin',
    '/auth/verify-request',
    '/auth/error',
    '/api/auth',
    '/share',  // Public share pages
    '/nfc'     // NFC redirect pages
  ]
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Check for session cookie (NextAuth sets this)
  const sessionCookie = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token')
  
  // Special handling for /plants/[id] routes when not authenticated
  if (pathname.startsWith('/plants/') && !pathname.includes('/new') && !pathname.includes('/edit') && !sessionCookie) {
    // Extract plant ID from path
    const plantId = pathname.split('/')[2]
    if (plantId) {
      // Redirect to public share page
      // The share page will handle checking if plant is shareable
      return NextResponse.redirect(new URL(`/share/${plantId}`, request.url))
    }
  }
  
  // Redirect to sign-in if no session for protected routes
  if (!sessionCookie && pathname !== '/auth/signin') {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}