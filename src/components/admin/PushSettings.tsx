'use client'

import { useEffect, useState } from 'react'

// Kartu di dasbor admin: aktifkan notifikasi pesan penawaran baru di perangkat ini (HP/komputer).
// Cara kerja: izin notifikasi -> berlangganan lewat service worker admin -> perangkat didaftarkan ke server.

type Status = 'loading' | 'unsupported' | 'ios-install' | 'no-server' | 'denied' | 'off' | 'on'

const toKey = (b64: string) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4)
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

async function api(body?: Record<string, unknown>) {
  const res = await fetch('/api/push', {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { ok: res.ok, data: (await res.json().catch(() => ({}))) as Record<string, unknown> }
}

export function PushSettings() {
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
      if (!supported) return alive && setStatus(ios && !standalone ? 'ios-install' : 'unsupported')
      if (location.protocol !== 'https:') return alive && setStatus('unsupported')

      const info = await api()
      if (!alive) return
      if (!info.ok || !info.data.enabled) return setStatus('no-server')
      if (Notification.permission === 'denied') return setStatus('denied')

      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        if (alive) setStatus(sub && Notification.permission === 'granted' ? 'on' : 'off')
      } catch {
        if (alive) setStatus('off')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  async function enable() {
    setBusy(true)
    setNote(null)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setStatus(perm === 'denied' ? 'denied' : 'off')
        setNote({ kind: 'error', text: 'Izin notifikasi tidak diberikan.' })
        return
      }
      const info = await api()
      const key = info.data.publicKey as string | null
      if (!key) throw new Error('server')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(key) })
      const saved = await api({ action: 'subscribe', subscription: sub.toJSON(), userAgent: navigator.userAgent })
      if (!saved.ok) throw new Error(String(saved.data.error || 'gagal'))
      setStatus('on')
      setNote({ kind: 'ok', text: 'Aktif. Klik "Kirim tes" untuk memastikan notifikasi muncul di perangkat ini.' })
    } catch (e) {
      setNote({ kind: 'error', text: `Gagal mengaktifkan notifikasi${e instanceof Error && e.message ? `: ${e.message}` : ''}.` })
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    setNote(null)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await api({ action: 'unsubscribe', endpoint: sub.endpoint })
        await sub.unsubscribe()
      }
      setStatus('off')
      setNote({ kind: 'ok', text: 'Notifikasi di perangkat ini dimatikan.' })
    } catch {
      setNote({ kind: 'error', text: 'Gagal mematikan notifikasi. Coba lagi.' })
    } finally {
      setBusy(false)
    }
  }

  async function sendTest() {
    setBusy(true)
    setNote(null)
    const r = await api({ action: 'test' })
    setBusy(false)
    const sent = Number(r.data.sent ?? 0)
    setNote(
      r.ok && sent > 0
        ? { kind: 'ok', text: `Tes dikirim ke ${sent} perangkat. Cek bilah notifikasi di perangkat.` }
        : { kind: 'error', text: String(r.data.error || 'Tidak ada perangkat yang menerima. Aktifkan notifikasi dulu.') },
    )
  }

  const texts: Partial<Record<Status, string>> = {
    unsupported: 'Browser atau perangkat ini belum mendukung notifikasi. Buka admin dari Chrome (Android/komputer) atau dari aplikasi yang sudah dipasang.',
    'ios-install': 'Di iPhone/iPad: pasang admin ke Layar Utama dulu (tombol Bagikan > Tambah ke Layar Utama), lalu buka dari ikonnya dan aktifkan notifikasi di sini.',
    'no-server': 'Notifikasi belum diaktifkan di server. Hubungi pengelola website.',
    denied: 'Notifikasi diblokir untuk situs ini. Izinkan lewat pengaturan situs/browser (ikon gembok di alamat), lalu muat ulang halaman.',
  }

  if (status === 'loading') return null

  return (
    <div className="artic-push">
      <div className="artic-push__head">
        <strong>🔔 Notifikasi pesan baru di perangkat ini</strong>
        <span className={`artic-push__badge${status === 'on' ? ' is-on' : ''}`}>{status === 'on' ? 'Aktif' : 'Nonaktif'}</span>
      </div>
      {texts[status] ? (
        <p className="artic-push__text">{texts[status]}</p>
      ) : (
        <>
          <p className="artic-push__text">
            Dapatkan pemberitahuan di HP atau komputer ini setiap ada permintaan penawaran baru. Email tetap dikirim sebagai cadangan.
          </p>
          <div className="artic-push__row">
            {status === 'on' ? (
              <>
                <button type="button" className="artic-ai__btn" onClick={sendTest} disabled={busy}>
                  Kirim tes
                </button>
                <button type="button" className="artic-ai__btn" onClick={disable} disabled={busy}>
                  Matikan
                </button>
              </>
            ) : (
              <button type="button" className="artic-ai__btn artic-ai__btn--primary" onClick={enable} disabled={busy}>
                {busy ? 'Memproses...' : 'Aktifkan notifikasi'}
              </button>
            )}
          </div>
        </>
      )}
      {note && <p className={`artic-ai__note artic-ai__note--${note.kind}`}>{note.text}</p>}
    </div>
  )
}
