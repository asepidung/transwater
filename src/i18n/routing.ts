import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'id'],
 
  // Used when no locale matches
  defaultLocale: 'id',

  // hreflang/canonical sudah dibuat di metadata tiap halaman (pageAlternates). Header Link otomatis dari middleware
  // menyebut x-default ke alamat tanpa bahasa (/produk) yang selalu dialihkan, sehingga Google melaporkan
  // "Halaman dengan pengalihan". Dimatikan supaya hanya ada satu sumber hreflang yang benar.
  alternateLinks: false,

  // Pengunjung pertama selalu masuk ke versi Indonesia, tidak mengikuti bahasa browser (Accept-Language).
  // Versi English tetap bisa dipilih lewat tombol bahasa atau alamat /en.
  localeDetection: false
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
