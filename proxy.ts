import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    '';
  if (country) {
    response.headers.set('x-user-country', country);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(en|fr|de)/:path*'],
};
