import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

// Pintu masuk tombol "Pratinjau" di admin: hanya untuk yang sudah login. Menyalakan mode pratinjau
// (cookie) lalu mengarahkan ke halaman yang ingin dilihat. Isi draft TIDAK terlihat pengunjung biasa.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || '/'
  // Hanya jalur di situs ini ("/id/..."), bukan alamat luar atau "//host".
  // Karakter kontrol (tab, baris baru) juga ditolak: browser membuangnya, sehingga "/<tab>/host" bisa menjadi "//host".
  const hasControl = [...path].some((ch) => ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127)
  if (!path.startsWith('/') || path.startsWith('//') || path.includes(String.fromCharCode(92)) || hasControl) return new Response('Jalur tidak valid', { status: 400 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Silakan masuk ke admin dulu.', { status: 401 })

  ;(await draftMode()).enable()
  redirect(path)
}
