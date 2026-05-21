import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Exclude /api, /_next, /_vercel, static files, and the /s/ shortlink route
  matcher: ['/', '/(th|en)/:path*', '/((?!api|_next|_vercel|s|.*\\..*).*)']
};
