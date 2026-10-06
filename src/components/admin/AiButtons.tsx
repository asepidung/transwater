'use client'

import { useState } from 'react'
import { useDocumentInfo, useField, useLocale } from '@payloadcms/ui'

// Tombol AI di bawah kolom teks yang punya versi bahasa. AI hanya MENGISI kolom di form;
// klien yang meninjau lalu menekan Simpan sendiri (tidak ada simpan otomatis).
//  - Sempurnakan            : rapikan ejaan/gaya teks di kolom ini (bahasa yang sedang dibuka).
//  - Buat versi Inggris     : (di bahasa Indonesia) terjemahkan, simpan sebagai saran untuk tab English.
//  - Terjemahkan dari Indonesia : (di tab English) ambil teks Indonesia kolom ini lalu isi terjemahannya.

type Props = { path?: string }
type Result = { text?: string; error?: string }

async function callAi(text: string, mode: 'improve' | 'translate', locale: 'id' | 'en'): Promise<Result> {
  try {
    const res = await fetch('/api/ai/improve', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, mode, locale }),
    })
    const data = (await res.json().catch(() => ({}))) as Result
    return res.ok ? data : { error: data.error || 'Terjadi kesalahan. Coba lagi.' }
  } catch {
    return { error: 'Tidak bisa menghubungi server. Periksa koneksi lalu coba lagi.' }
  }
}

// Ambil nilai kolom yang sama (path yang sama) dari versi Indonesia dokumen ini.
function pick(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc == null ? acc : (acc as Record<string, unknown>)[key]), source)
}

export function AiButtons({ path = '' }: Props) {
  const { value, setValue } = useField<string>({ path })
  const locale = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const code: 'id' | 'en' = locale?.code === 'en' ? 'en' : 'id'

  const entity = globalSlug ? `global:${globalSlug}` : `${collectionSlug}:${id ?? 'baru'}`
  const storageKey = `artic-ai:${entity}:${path}`

  const [busy, setBusy] = useState<string | null>(null)
  const [note, setNote] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [suggestion, setSuggestion] = useState<string | null>(() => {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(storageKey)
    } catch {
      return null
    }
  })

  const text = typeof value === 'string' ? value : ''

  async function improve() {
    setBusy('improve')
    setNote(null)
    const r = await callAi(text, 'improve', code)
    setBusy(null)
    if (r.text) {
      setValue(r.text)
      setNote({ kind: 'ok', text: 'Sudah diisi ke kolom. Periksa dulu, lalu klik Simpan.' })
    } else setNote({ kind: 'error', text: r.error ?? 'Gagal.' })
  }

  async function makeEnglish() {
    setBusy('translate')
    setNote(null)
    const r = await callAi(text, 'translate', 'id')
    setBusy(null)
    if (r.text) {
      try {
        window.localStorage.setItem(storageKey, r.text)
      } catch {
        // penyimpanan peramban dimatikan; saran tetap tampil di bawah
      }
      setSuggestion(r.text)
      setNote({ kind: 'ok', text: 'Terjemahan siap. Pindah ke bahasa English (pojok kanan atas), lalu klik "Pakai terjemahan" di kolom ini.' })
    } else setNote({ kind: 'error', text: r.error ?? 'Gagal.' })
  }

  async function fromIndonesian() {
    setBusy('from-id')
    setNote(null)
    try {
      const url = globalSlug
        ? `/api/globals/${globalSlug}?locale=id&depth=0`
        : `/api/${collectionSlug}/${id}?locale=id&depth=0`
      const res = await fetch(url, { credentials: 'include' })
      const doc = await res.json()
      const source = pick(doc, path)
      if (typeof source !== 'string' || !source.trim()) {
        setBusy(null)
        setNote({ kind: 'error', text: 'Teks Indonesia untuk kolom ini masih kosong.' })
        return
      }
      const r = await callAi(source, 'translate', 'id')
      setBusy(null)
      if (r.text) {
        setValue(r.text)
        setNote({ kind: 'ok', text: 'Terjemahan sudah diisi ke kolom. Periksa dulu, lalu klik Simpan.' })
      } else setNote({ kind: 'error', text: r.error ?? 'Gagal.' })
    } catch {
      setBusy(null)
      setNote({ kind: 'error', text: 'Tidak bisa mengambil teks Indonesia. Simpan dokumen dulu lalu coba lagi.' })
    }
  }

  function useSuggestion() {
    if (suggestion == null) return
    setValue(suggestion)
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // abaikan
    }
    setSuggestion(null)
    setNote({ kind: 'ok', text: 'Terjemahan diisi ke kolom. Periksa dulu, lalu klik Simpan.' })
  }

  function dropSuggestion() {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // abaikan
    }
    setSuggestion(null)
  }

  const canFromId = code === 'en' && (globalSlug || id)

  return (
    <div className="artic-ai">
      <div className="artic-ai__row">
        <button type="button" className="artic-ai__btn" onClick={improve} disabled={busy !== null || !text.trim()}>
          {busy === 'improve' ? 'Memproses...' : '✨ Sempurnakan'}
        </button>
        {code === 'id' && (
          <button type="button" className="artic-ai__btn" onClick={makeEnglish} disabled={busy !== null || !text.trim()}>
            {busy === 'translate' ? 'Menerjemahkan...' : '🌐 Buat versi Inggris'}
          </button>
        )}
        {canFromId && (
          <button type="button" className="artic-ai__btn" onClick={fromIndonesian} disabled={busy !== null}>
            {busy === 'from-id' ? 'Menerjemahkan...' : '🌐 Terjemahkan dari Indonesia'}
          </button>
        )}
      </div>

      {code === 'en' && suggestion && (
        <div className="artic-ai__suggestion">
          <p className="artic-ai__suggestion-label">Saran terjemahan dari AI:</p>
          <p className="artic-ai__suggestion-text">{suggestion}</p>
          <div className="artic-ai__row">
            <button type="button" className="artic-ai__btn artic-ai__btn--primary" onClick={useSuggestion}>
              Pakai terjemahan
            </button>
            <button type="button" className="artic-ai__btn" onClick={dropSuggestion}>
              Buang
            </button>
          </div>
        </div>
      )}

      {note && (
        <p className={`artic-ai__note artic-ai__note--${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'}>
          {note.text}
        </p>
      )}
    </div>
  )
}
