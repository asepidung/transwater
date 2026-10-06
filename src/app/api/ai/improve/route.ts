import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AiError, MAX_INPUT, findAddedClaims, rateLimited, runAi, type AiLocale, type AiMode } from '@/lib/ai'

// Endpoint untuk tombol AI di panel admin. Hanya untuk pengguna yang sudah login ke admin.
// Mengembalikan teks saja; tidak menyimpan apa pun ke database.
export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Silakan login ke admin dulu.' }, { status: 401 })

  if (rateLimited(`${user.collection}:${user.id}`)) {
    return NextResponse.json({ error: 'Terlalu sering memakai AI. Tunggu beberapa menit lalu coba lagi.' }, { status: 429 })
  }

  let body: { text?: unknown; mode?: unknown; locale?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const mode: AiMode | null = body.mode === 'improve' || body.mode === 'translate' ? body.mode : null
  const locale: AiLocale = body.locale === 'en' ? 'en' : 'id'
  if (!mode) return NextResponse.json({ error: 'Mode tidak dikenal.' }, { status: 400 })
  if (!text) return NextResponse.json({ error: 'Kolom masih kosong.' }, { status: 400 })
  if (text.length > MAX_INPUT) {
    return NextResponse.json({ error: `Teks terlalu panjang (maksimal ${MAX_INPUT} karakter).` }, { status: 400 })
  }

  try {
    const result = await runAi(mode, locale, text)
    const added = findAddedClaims(text, result)
    if (added.length > 0) {
      return NextResponse.json(
        {
          error: `AI menambahkan hal yang tidak ada di teks asli (${added.slice(0, 3).join(', ')}). Hasil dibuang. Coba lagi atau edit manual.`,
        },
        { status: 422 },
      )
    }
    return NextResponse.json({ text: result })
  } catch (error) {
    if (error instanceof AiError) return NextResponse.json({ error: error.message }, { status: error.status === 503 ? 503 : error.status === 422 ? 422 : 502 })
    console.error('[ai] error tak terduga:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 })
  }
}
