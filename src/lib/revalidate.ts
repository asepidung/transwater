import { revalidatePath } from 'next/cache'

// Dipanggil setelah konten diubah di panel admin supaya halaman statis (prerender)
// langsung memakai data terbaru. Di luar runtime Next (mis. script seed) revalidatePath
// melempar error, jadi dibungkus try/catch dan diabaikan.
export function revalidateSite() {
  try {
    // Layout root [locale] = semua halaman (Beranda, Produk, Detail) di kedua bahasa.
    revalidatePath('/[locale]', 'layout')
    // Sitemap memuat daftar produk, jadi ikut disegarkan.
    revalidatePath('/sitemap.xml')
  } catch {
    // bukan di runtime Next.js
  }
}
