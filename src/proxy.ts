import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Semua halaman publik, termasuk yang tanpa awalan bahasa (mis. /produk -> /id/produk).
  // Dikecualikan: API, admin Payload, berkas internal Next, dan berkas statis (yang punya titik).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
