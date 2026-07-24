import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  
  // Routes to protect
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/citizens') ||
    request.nextUrl.pathname.startsWith('/marriages') ||
    request.nextUrl.pathname.startsWith('/divorces') ||
    request.nextUrl.pathname.startsWith('/audit')

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect root to dashboard if logged in
  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (request.nextUrl.pathname === '/' && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
