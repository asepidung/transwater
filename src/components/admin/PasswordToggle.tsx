'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

// Payload tidak punya tombol "lihat password". Komponen ini dipasang sebagai provider di seluruh
// panel admin dan menambahkan ikon mata di setiap kolom password (login, buat akun pertama,
// ganti password, konfirmasi password). Ia hanya menambah satu tombol di samping input dan
// mengganti atribut `type`; tidak mengubah state atau nilai yang dikelola React.

const EYE =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-6.4 0-10-7-10-7a18.5 18.5 0 0 1 4.1-5.2M9.9 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a18.6 18.6 0 0 1-2.2 3.2M1 1l22 22"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>'

type Pair = { input: HTMLInputElement; button: HTMLButtonElement }

export function PasswordToggle({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const pairs: Pair[] = []
    let frame = 0

    const position = ({ input, button }: Pair) => {
      const parent = input.offsetParent as HTMLElement | null
      if (!parent || !input.isConnected) return
      button.style.top = `${input.offsetTop + input.offsetHeight / 2}px`
      button.style.left = `${input.offsetLeft + input.offsetWidth - 34}px`
    }

    const attach = () => {
      frame = 0
      // Buang pasangan yang inputnya sudah hilang dari halaman.
      for (let i = pairs.length - 1; i >= 0; i--) {
        if (!pairs[i].input.isConnected) {
          pairs[i].button.remove()
          pairs.splice(i, 1)
        }
      }
      document.querySelectorAll<HTMLInputElement>('input[type="password"]:not([data-eye])').forEach((input) => {
        const parent = input.parentElement
        if (!parent) return
        input.dataset.eye = '1'
        if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative'
        input.style.paddingRight = '44px'

        const button = document.createElement('button')
        button.type = 'button'
        button.setAttribute('aria-label', 'Tampilkan password')
        button.title = 'Tampilkan password'
        button.innerHTML = EYE
        Object.assign(button.style, {
          position: 'absolute',
          transform: 'translateY(-50%)',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          border: '0',
          background: 'transparent',
          color: 'currentColor',
          opacity: '0.7',
          cursor: 'pointer',
          zIndex: '2',
        } as Partial<CSSStyleDeclaration>)
        button.addEventListener('click', () => {
          const show = input.type === 'password'
          input.type = show ? 'text' : 'password'
          button.innerHTML = show ? EYE_OFF : EYE
          const label = show ? 'Sembunyikan password' : 'Tampilkan password'
          button.setAttribute('aria-label', label)
          button.title = label
          input.focus()
        })
        input.after(button)
        const pair = { input, button }
        pairs.push(pair)
        position(pair)
      })
      pairs.forEach(position)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(attach)
    }

    // type berubah menjadi "text" saat password ditampilkan, jadi input yang sudah ditandai
    // (data-eye) tidak dicari lagi; input baru yang muncul ditangkap lewat observer.
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
      pairs.forEach(({ button }) => button.remove())
    }
  }, [])

  return <>{children}</>
}
