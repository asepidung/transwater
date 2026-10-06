// Asisten teks untuk panel admin: merapikan teks dan membuat versi Inggris lewat Gemini.
// Hasilnya HANYA mengisi form di admin; klien yang meninjau dan menekan Simpan sendiri.
// Dipakai oleh /api/ai/improve (hanya untuk pengguna admin yang login).

export type AiMode = 'improve' | 'translate'
export type AiLocale = 'id' | 'en'

export const MAX_INPUT = 2000

const RULES = `Kamu editor teks untuk website perusahaan air minum dalam kemasan PT. Transwater Roberi Indonesia (merek ARTIC).
ATURAN WAJIB:
- Keluarkan HANYA teks hasil. Tanpa tanda kutip pembuka/penutup, tanpa markdown, tanpa penjelasan, tanpa awalan seperti "Berikut".
- DILARANG menambah fakta atau klaim baru yang tidak ada di teks asli: angka, sertifikasi atau izin (BPOM, SNI, ISO, Halal), pH, TDS, manfaat kesehatan, penghargaan, perbandingan dengan merek lain, atau kata superlatif seperti "terbaik", "nomor 1", "terdepan".
- Pertahankan semua fakta, angka, nama merek, nama perusahaan, dan nomor persis seperti aslinya.
- Pertahankan struktur paragraf dan baris baru. Jangan menambah paragraf baru.
- Jika teks kosong atau tidak bermakna, kembalikan apa adanya.`

const PROMPTS: Record<string, string> = {
  'improve:id': `${RULES}
TUGAS: Rapikan teks berbahasa Indonesia ini: perbaiki ejaan dan tata bahasa (PUEBI), buat kalimat jelas, ringkas, dan profesional untuk website perusahaan. Tetap berbahasa Indonesia, pertahankan makna dan nada yang sopan. Jangan berlebihan atau terkesan promosi berlebihan.`,
  'improve:en': `${RULES}
TUGAS: Polish this English text: fix spelling and grammar, make it clear, concise, and professional for a company website. Keep it in English and keep the meaning. Do not oversell.`,
  'translate:id': `${RULES}
TUGAS: Terjemahkan teks berbahasa Indonesia ini ke bahasa Inggris yang natural dan profesional untuk website perusahaan. Pertahankan makna, nada, dan semua fakta.`,
  'translate:en': `${RULES}
TUGAS: Terjemahkan teks ini ke bahasa Inggris yang natural dan profesional untuk website perusahaan. Pertahankan makna, nada, dan semua fakta.`,
}

// ---------- Penjaga klaim ----------
// Tolak hasil AI yang memuat angka atau kata klaim yang tidak ada di teks asli.
const CLAIM_GROUPS: RegExp[] = [
  /bpom/i,
  /\bsni\b/i,
  /\biso\b/i,
  /halal/i,
  /\bph\b/i,
  /\btds\b|\bppm\b/i,
  /sertifi|certif|bersertifikat/i,
  /terbaik|\bbest\b/i,
  /terdepan|leading|foremost/i,
  /nomor\s*(1|satu)|no\.?\s*1|#1|number\s*(1|one)/i,
  /100\s*%/,
  /klinis|clinical/i,
  /penghargaan|award/i,
  /menyembuhkan|menyehatkan|cure|healing|detox/i,
]

const numbersIn = (s: string): Set<string> =>
  new Set((s.match(/\d[\d.,]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]/g, '')))

export function findAddedClaims(source: string, output: string): string[] {
  const added: string[] = []
  const srcNums = numbersIn(source)
  for (const n of numbersIn(output)) if (!srcNums.has(n)) added.push(`angka ${n}`)
  for (const re of CLAIM_GROUPS) {
    const m = output.match(re)
    if (m && !re.test(source)) added.push(`kata "${m[0].trim()}"`)
  }
  return added
}

// ---------- Batas pemakaian (per pengguna, di memori; reset saat aplikasi restart) ----------
const WINDOW_MS = 10 * 60 * 1000
const MAX_CALLS = 30
const calls = new Map<string, number[]>()

export function rateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (calls.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_CALLS) {
    calls.set(key, recent)
    return true
  }
  recent.push(now)
  calls.set(key, recent)
  return false
}

// ---------- Gemini ----------
const MODELS = (process.env.GEMINI_MODELS || 'gemini-flash-latest,gemini-flash-lite-latest')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)

export class AiError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message)
  }
}

async function callModel(model: string, system: string, text: string, key: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
    signal: AbortSignal.timeout(25_000),
  })
  if (!res.ok) throw new AiError(`Gemini ${model}: HTTP ${res.status}`, res.status)
  const data = (await res.json()) as {
    promptFeedback?: { blockReason?: string }
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  if (data.promptFeedback?.blockReason) throw new AiError('Teks ditolak oleh filter keamanan AI.', 422)
  const out = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim()
  if (!out) throw new AiError('AI tidak mengembalikan teks.', 502)
  return out
}

export async function runAi(mode: AiMode, locale: AiLocale, text: string): Promise<string> {
  // Mode tiruan hanya untuk pengembangan lokal (tanpa kunci), tidak pernah aktif di produksi.
  if (process.env.AI_MOCK === '1' && process.env.NODE_ENV !== 'production') {
    if (text.includes('[[tambah-klaim]]')) return `${text} bersertifikat ISO 9001 dan pH 8,5`
    return mode === 'translate' ? `[EN] ${text}` : `${text.trim().replace(/^./, (c) => c.toUpperCase())}`
  }
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new AiError('Kunci AI belum diatur di server. Hubungi pengelola website.', 503)

  const system = PROMPTS[`${mode}:${locale}`] ?? PROMPTS['improve:id']
  let lastError: unknown
  for (const model of MODELS) {
    try {
      return await callModel(model, system, text, key)
    } catch (error) {
      lastError = error
      // Coba model berikutnya hanya untuk model tidak ada / kuota / gangguan sementara.
      const status = error instanceof AiError ? error.status : 0
      if (![0, 404, 429, 500, 502, 503, 504].includes(status)) break
    }
  }
  console.error('[ai] semua model gagal:', lastError)
  throw lastError instanceof AiError && lastError.status === 422
    ? lastError
    : new AiError('Layanan AI sedang tidak tersedia. Coba lagi sebentar lagi.', 502)
}
