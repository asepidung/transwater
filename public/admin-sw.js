// Service worker minimal untuk panel admin (PWA). Sengaja TANPA cache data:
// isi CMS harus selalu segar. Hanya menyediakan pesan saat tidak ada koneksi.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tidak ada koneksi</title><body style="font-family:sans-serif;padding:2rem;text-align:center"><h1>Tidak ada koneksi</h1><p>Panel admin ARTIC butuh internet. Periksa koneksi lalu muat ulang.</p></body>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
        ),
    ),
  )
})
