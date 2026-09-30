'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

// Mendaftarkan service worker minimal agar panel admin bisa dipasang di HP/komputer (PWA).
// Hanya di HTTPS; di localhost/HTTP tidak melakukan apa pun.
export function PwaRegister({ children }: { children?: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {})
    }
  }, [])
  return <>{children}</>
}
