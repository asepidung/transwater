'use client'

import { useEffect, useState } from 'react'
import { useAuth, useDocumentInfo, useFormModified } from '@payloadcms/ui'

// Tombol untuk Staf di halaman edit: "Ajukan terbit". Memberi tahu Pemilik (notifikasi + penanda di dasbor).
// Staf menyimpan draf dulu; Pemilik membuka dokumen, klik Pratinjau, lalu Terbitkan.
export function RequestPublish() {
  const { user } = useAuth()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const modified = useFormModified()
  const target = (collectionSlug || globalSlug || '') as string
  const docId = globalSlug ? '' : id ? String(id) : ''
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const isStaff = (user as { role?: string } | null)?.role === 'staff'
  const ready = isStaff && Boolean(target) && (Boolean(globalSlug) || Boolean(docId))

  useEffect(() => {
    if (!ready) return
    fetch(`/api/approval?target=${encodeURIComponent(target)}&id=${encodeURIComponent(docId)}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.pending) setState('done')
      })
      .catch(() => {})
  }, [ready, target, docId])

  if (!ready) return null

  async function send() {
    setState('sending')
    setMsg('')
    try {
      const r = await fetch('/api/approval', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, id: docId }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Gagal mengajukan')
      setState('done')
    } catch (e) {
      setState('error')
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="artic-request">
      {state === 'done' ? (
        <>
          <span className="artic-request__done">✓ Sudah diajukan ke Pemilik</span>
          <button type="button" className="artic-ai__btn" onClick={send}>
            Ingatkan lagi
          </button>
        </>
      ) : (
        <button
          type="button"
          className="artic-ai__btn artic-ai__btn--primary"
          disabled={state === 'sending' || modified}
          onClick={send}
          title={modified ? 'Simpan draf dulu' : 'Beri tahu Pemilik bahwa perubahan ini siap diterbitkan'}
        >
          {state === 'sending' ? 'Mengirim…' : modified ? 'Simpan draf dulu, lalu ajukan' : '📨 Ajukan terbit'}
        </button>
      )}
      {msg && <span className="artic-request__err">{msg}</span>}
    </div>
  )
}
