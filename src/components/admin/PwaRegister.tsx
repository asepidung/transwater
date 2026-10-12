'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

type InstallWindow = Window & { __articInstall?: Event | null }

// Mendaftarkan service worker minimal agar panel admin bisa dipasang di HP/komputer (PWA).
// Hanya di HTTPS; di localhost/HTTP tidak mendaftarkan service worker.
// Juga menangkap tawaran pemasangan dari browser (beforeinstallprompt) lebih awal, supaya tombol
// "Pasang aplikasi" di dasbor (InstallApp) bisa memakainya kapan pun.
export function PwaRegister({ children }: { children?: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {})
    }

    const w = window as InstallWindow
    const onPrompt = (e: Event) => {
      e.preventDefault()
      w.__articInstall = e
      window.dispatchEvent(new Event('artic-install-ready'))
    }
    const onInstalled = () => {
      w.__articInstall = null
      window.dispatchEvent(new Event('artic-installed'))
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  return <>{children}</>
}
