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

// Notifikasi dorong: pesan penawaran baru. Isi dikirim server (judul, isi singkat, tautan).
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'ARTIC', body: event.data ? event.data.text() : '' }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'ARTIC', {
      body: data.body || '',
      icon: '/images/admin-icon-192.png',
      badge: '/images/admin-icon-192.png',
      tag: data.tag || undefined,
      data: { url: data.url || '/admin' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/admin'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes('/admin') && 'focus' in c) {
          if ('navigate' in c) c.navigate(url)
          return c.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
