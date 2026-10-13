import { APIError, type CollectionBeforeChangeHook, type CollectionConfig, type GlobalBeforeChangeHook, type GlobalConfig, type PayloadRequest } from 'payload'

// Alur persetujuan: Staf hanya boleh MENYIMPAN DRAF. Draf tidak tampil di situs publik.
// Pemilik melihat hasilnya lewat tombol "Pratinjau", lalu menekan "Terbitkan" kalau sudah setuju.
// Setelah selesai, Staf menekan "Ajukan terbit" (lihat RequestPublish + /api/approval): Pemilik dapat notifikasi
// dan penanda di dasbor, melihat pratinjau, lalu menerbitkan.

type RoleUser = { id: number | string; role?: 'owner' | 'staff' | null; username?: string | null; name?: string | null } | null | undefined

const isStaff = (u: unknown) => (u as RoleUser)?.role === 'staff'
export const ownerOnly = ({ req: { user } }: { req: PayloadRequest }) => (user as RoleUser)?.role === 'owner'

// Staf tidak boleh menerbitkan, membatalkan terbit, atau mengubah langsung (semua itu tanpa ?draft=true di admin).
const blockDirect = (req: PayloadRequest, data: Record<string, unknown> | undefined) => {
  if (!isStaff(req.user)) return
  const draftQuery = req.query?.draft === 'true' || req.query?.draft === true
  if (!draftQuery || data?._status === 'published') {
    throw new APIError('Staf hanya bisa menyimpan draf. Pemilik yang menerbitkan setelah melihat pratinjau. Tekan "Simpan draf".', 403, undefined, true)
  }
}

// Permintaan terbit dihapus otomatis setelah Pemilik menerbitkan (status terbit).
async function clearRequests(req: PayloadRequest, target: string, docId: string) {
  try {
    await req.payload.delete({
      collection: 'approval-requests',
      where: { and: [{ target: { equals: target } }, { docId: { equals: docId } }] },
      overrideAccess: true,
    })
  } catch (err) {
    req.payload.logger.error({ err }, '[approval] gagal menghapus permintaan terbit')
  }
}

const previewPath = (path: string) => `/api/preview?path=${encodeURIComponent(path)}`

export function withApprovalCollection(c: CollectionConfig, pagePath: (doc: { slug?: string }) => string): CollectionConfig {
  const guard: CollectionBeforeChangeHook = ({ data, req }) => {
    blockDirect(req, data as Record<string, unknown>)
    return data
  }
  return {
    ...c,
    access: { ...c.access, delete: ownerOnly },
    admin: {
      ...c.admin,
      preview: (doc) => previewPath(pagePath(doc as { slug?: string })),
      components: { ...c.admin?.components, edit: { ...c.admin?.components?.edit, beforeDocumentControls: ['/components/admin/RequestPublish#RequestPublish'] } },
    },
    hooks: {
      ...c.hooks,
      beforeChange: [...(c.hooks?.beforeChange ?? []), guard],
      afterChange: [
        ...(c.hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          if ((doc as { _status?: string })._status === 'published') await clearRequests(req, c.slug, String(doc.id))
          return doc
        },
      ],
    },
  }
}

export function withApprovalGlobal(g: GlobalConfig, pagePath: string): GlobalConfig {
  const guard: GlobalBeforeChangeHook = ({ data, req }) => {
    blockDirect(req, data as Record<string, unknown>)
    return data
  }
  return {
    ...g,
    // Draf global tidak boleh terbaca publik lewat API; situs memakai Local API di server.
    access: { ...g.access, read: ({ req: { user } }) => Boolean(user) },
    versions: { drafts: true, max: 25 },
    admin: {
      ...g.admin,
      preview: () => previewPath(pagePath),
      components: { ...g.admin?.components, elements: { ...g.admin?.components?.elements, beforeDocumentControls: ['/components/admin/RequestPublish#RequestPublish'] } },
    },
    hooks: {
      ...g.hooks,
      beforeChange: [...(g.hooks?.beforeChange ?? []), guard],
      afterChange: [
        ...(g.hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          if ((doc as { _status?: string })._status === 'published') await clearRequests(req, g.slug, '')
          return doc
        },
      ],
    },
  }
}
