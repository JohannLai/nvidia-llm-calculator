import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (pathnameHasLocale) return NextResponse.next()
  
  // Redirect to the default locale
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  // Matcher ignoring _next and api routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 