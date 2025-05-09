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

  // Get the preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || ''

  // Parse the Accept-Language header to get language preferences
  // Format example: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
  let detectedLocale = defaultLocale

  // Simple parsing of the Accept-Language header
  const languages = acceptLanguage.split(',').map(lang => {
    const [language, weight] = lang.trim().split(';q=')
    return {
      code: language.split('-')[0], // Get the base language code
      weight: weight ? parseFloat(weight) : 1.0
    }
  }).sort((a, b) => b.weight - a.weight) // Sort by weight descending

  // Find the first supported locale from the user's preferences
  for (const lang of languages) {
    if (locales.includes(lang.code)) {
      detectedLocale = lang.code
      break
    }
  }

  // Redirect to the detected or default locale
  const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  // Very explicit matcher that only applies to routes that need locale handling
  matcher: [
    // Only run on specific paths that need localization
    '/((?!api|_next|favicon.ico|favicon.svg|.*\\.).*)'
  ]
} 