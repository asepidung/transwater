// Validasi & normalisasi nilai dari panel admin yang dipakai sebagai tautan di situs publik.

const digits = (v: string) => v.replace(/\D/g, '')

/** "0812-3456-7890", "+62 812 3456 7890", "62812..." -> digit saja dengan awalan 62. */
export function normalizeWhatsapp(value: string): string {
  const d = digits(value)
  if (d.startsWith('0')) return `62${d.slice(1)}`
  if (d.startsWith('8')) return `62${d}`
  return d
}

export const validateWhatsapp = (value: string | null | undefined) => {
  if (!value) return true
  const n = normalizeWhatsapp(value)
  if (n.length < 10 || n.length > 15) return 'Nomor tidak valid. Contoh: 0812-3456-7890 atau +62 812 3456 7890.'
  return true
}

const HTTP_URL = /^https?:\/\/[^\s<>"']+$/i

/** Hanya tautan http(s); nilai lain (mis. javascript:) ditolak. */
export const isSafeHttpUrl = (value: string | null | undefined): value is string =>
  Boolean(value && HTTP_URL.test(value.trim()))

export const validateHttpUrl = (value: string | null | undefined) => {
  if (!value) return true
  return isSafeHttpUrl(value) ? true : 'Tautan harus diawali http:// atau https://'
}

export const validateSlug = (value: string | null | undefined) => {
  if (!value) return true
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) ? true : 'Hanya huruf kecil, angka, dan tanda hubung. Contoh: artic-600ml'
}
