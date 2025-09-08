import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public access to auth pages and API auth endpoints
  const publicPaths = [
    '/auth/signin',
    '/auth/verify-request',
    '/auth/error',
    '/api/auth'
  ]
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Check for session cookie (NextAuth sets this)
  const sessionCookie = request.cookies.get('authjs.session-token') || 
                        request.cookies.get('__Secure-authjs.session-token')
  
  // Redirect to sign-in if no session
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