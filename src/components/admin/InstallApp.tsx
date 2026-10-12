'use client'

import { useEffect, useState } from 'react'

// Kartu di dasbor: pasang panel admin sebagai aplikasi (ikon di layar utama, tampil penuh).
// Browser tidak selalu menawarkan pemasangan sendiri, jadi di sini ada tombol dan petunjuk per perangkat.
type InstallEvent = Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: string }> }
type InstallWindow = Window & { __articInstall?: InstallEvent | null }

export function InstallApp() {
  const [mode, setMode] = useState<'hidden' | 'button' | 'ios' | 'manual'>('hidden')

  useEffect(() => {
    const w = window as InstallWindow
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) return // sudah terpasang: kartu tetap tersembunyi

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const refresh = () => setMode(w.__articInstall ? 'button' : ios ? 'ios' : 'manual')
    const onInstalled = () => setMode('hidden')
    const t = setTimeout(refresh, 0) // setelah render pertama, supaya tidak beda dengan HTML dari server
    window.addEventListener('artic-install-ready', refresh)
    window.addEventListener('artic-installed', onInstalled)
    return () => {
      clearTimeout(t)
      window.removeEventListener('artic-install-ready', refresh)
      window.removeEventListener('artic-installed', onInstalled)
    }
  }, [])

  async function install() {
    const ev = (window as InstallWindow).__articInstall
    if (!ev?.prompt) return
    await ev.prompt()
    const choice = await ev.userChoice?.catch(() => undefined)
    if (choice?.outcome === 'accepted') setMode('hidden')
  }

  if (mode === 'hidden') return null

  return (
    <div className="artic-push">
      <div className="artic-push__head">
        <strong>📱 Pasang panel admin sebagai aplikasi</strong>
      </div>
      {mode === 'button' && (
        <>
          <p className="artic-push__text">Admin akan punya ikon sendiri di layar utama dan terbuka seperti aplikasi, tanpa bilah alamat.</p>
          <div className="artic-push__row">
            <button type="button" className="artic-ai__btn artic-ai__btn--primary" onClick={install}>
              Pasang aplikasi
            </button>
          </div>
        </>
      )}
      {mode === 'ios' && (
        <p className="artic-push__text">
          Di iPhone/iPad: buka admin lewat <b>Safari</b>, ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas), pilih <b>Tambah ke Layar Utama</b>, lalu <b>Tambah</b>. Buka lewat ikon baru itu.
        </p>
      )}
      {mode === 'manual' && (
        <p className="artic-push__text">
          Di Android (Chrome): ketuk menu <b>⋮</b> di pojok kanan atas, lalu pilih <b>Instal aplikasi</b> (atau <b>Tambahkan ke layar utama</b>). Di komputer (Chrome/Edge): klik ikon pemasangan di ujung kanan bilah alamat.
          Tombol pemasangan otomatis muncul di sini kalau browser mengizinkan.
        </p>
      )}
    </div>
  )
}
