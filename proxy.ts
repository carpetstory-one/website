import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing, localeCountries } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
  // Check if the user has already selected a preferred locale
  const hasLocaleCookie = req.cookies.has('NEXT_LOCALE');

  // Only apply IP-based routing on the root path if no preference is saved yet
  if (!hasLocaleCookie && req.nextUrl.pathname === '/') {
    // Netlify (x-country), Vercel (x-vercel-ip-country), and Cloudflare (cf-ipcountry)
    // pass the ISO 3166-1 alpha-2 country code in headers.
    // We also allow a ?sim_country=XX query parameter for easy local testing.
    const country =
      (process.env.NODE_ENV === 'development' && req.nextUrl.searchParams.get('sim_country')) ||
      req.headers.get('x-country') ||
      req.headers.get('x-nf-country') ||
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      '';

    if (country) {
      let targetLocale: string = routing.defaultLocale;

      // Find if the country matches any of our specific language regions
      for (const [locale, countries] of Object.entries(localeCountries)) {
        if (countries.includes(country.toUpperCase())) {
          targetLocale = locale;
          break;
        }
      }

      // If a non-default locale is detected, automatically redirect them
      if (targetLocale !== routing.defaultLocale) {
        const url = req.nextUrl.clone();
        url.pathname = `/${targetLocale}`;
        return NextResponse.redirect(url);
      }
    }
  }

  // Fallback to standard next-intl middleware behavior for all other requests
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Match all localized pathnames
    '/(en|fr|de)/:path*',
    // Enable redirects that add a locale prefix to all un-prefixed requests
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
