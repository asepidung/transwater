// Daftar yang bisa diajukan terbit, beserta halaman pratinjau dan alamat edit di admin.
export type ApprovalTarget = { slug: string; kind: 'collection' | 'global'; label: string; preview: (slug?: string) => string }

export const APPROVAL_TARGETS: ApprovalTarget[] = [
  { slug: 'products', kind: 'collection', label: 'Produk', preview: (s) => `/id/produk/${s ?? ''}` },
  { slug: 'posts', kind: 'collection', label: 'Artikel', preview: (s) => `/id/berita/${s ?? ''}` },
  { slug: 'site-settings', kind: 'global', label: 'Pengaturan Situs', preview: () => '/id/kontak' },
  { slug: 'home-page', kind: 'global', label: 'Isi Halaman Utama', preview: () => '/id' },
  { slug: 'about-page', kind: 'global', label: 'Halaman Tentang & Kontak', preview: () => '/id/tentang' },
  { slug: 'info-pages', kind: 'global', label: 'Halaman Kualitas & Cara Pesan', preview: () => '/id/kualitas' },
]

export const findTarget = (slug: string) => APPROVAL_TARGETS.find((t) => t.slug === slug)
export const editUrl = (t: ApprovalTarget, docId?: string) => (t.kind === 'global' ? `/admin/globals/${t.slug}` : `/admin/collections/${t.slug}/${docId}`)
export const previewUrl = (t: ApprovalTarget, slug?: string) => `/api/preview?path=${encodeURIComponent(t.preview(slug))}`
