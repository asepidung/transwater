import { APIError, type CollectionBeforeChangeHook, type CollectionConfig, type GlobalBeforeChangeHook, type GlobalConfig, type PayloadRequest } from 'payload'
import { sendPush } from './push'

// Alur persetujuan: Staf hanya boleh MENYIMPAN DRAF. Draf tidak tampil di situs publik.
// Pemilik melihat hasilnya lewat tombol "Pratinjau", lalu menekan "Terbitkan" kalau sudah setuju.
// Pemilik menerima notifikasi (PWA) setiap Staf menyimpan perubahan.

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

async function notifyOwners(req: PayloadRequest, area: string, url: string, tag: string) {
  try {
    const u = req.user as RoleUser
    const who = u?.name || u?.username || 'Staf'
    const owners = await req.payload.find({ collection: 'users', where: { role: { equals: 'owner' } }, limit: 20, depth: 0, overrideAccess: true })
    await Promise.allSettled(
      owners.docs.map((o) =>
        sendPush(req.payload, { title: 'Menunggu persetujuan', body: `${who} mengubah "${area}". Buka untuk pratinjau dan terbitkan.`, url, tag }, o.id),
      ),
    )
  } catch (err) {
    req.payload.logger.error({ err }, '[approval] gagal memberi tahu Pemilik')
  }
}

const previewPath = (path: string) => `/api/preview?path=${encodeURIComponent(path)}`

export function withApprovalCollection(c: CollectionConfig, pagePath: (doc: { slug?: string }) => string): CollectionConfig {
  const area = typeof c.labels?.singular === 'string' ? c.labels.singular : c.slug
  const guard: CollectionBeforeChangeHook = ({ data, req }) => {
    blockDirect(req, data as Record<string, unknown>)
    return data
  }
  return {
    ...c,
    access: { ...c.access, delete: ownerOnly },
    admin: { ...c.admin, preview: (doc) => previewPath(pagePath(doc as { slug?: string })) },
    hooks: {
      ...c.hooks,
      beforeChange: [...(c.hooks?.beforeChange ?? []), guard],
      afterChange: [
        ...(c.hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          if (isStaff(req.user)) await notifyOwners(req, `${area}: ${(doc as { title?: string }).title ?? ''}`, `/admin/collections/${c.slug}/${doc.id}`, `approval-${c.slug}-${doc.id}`)
          return doc
        },
      ],
    },
  }
}

export function withApprovalGlobal(g: GlobalConfig, pagePath: string): GlobalConfig {
  const area = typeof g.label === 'string' ? g.label : g.slug
  const guard: GlobalBeforeChangeHook = ({ data, req }) => {
    blockDirect(req, data as Record<string, unknown>)
    return data
  }
  return {
    ...g,
    // Draf global tidak boleh terbaca publik lewat API; situs memakai Local API di server.
    access: { ...g.access, read: ({ req: { user } }) => Boolean(user) },
    versions: { drafts: true, max: 25 },
    admin: { ...g.admin, preview: () => previewPath(pagePath) },
    hooks: {
      ...g.hooks,
      beforeChange: [...(g.hooks?.beforeChange ?? []), guard],
      afterChange: [
        ...(g.hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          if (isStaff(req.user)) await notifyOwners(req, area, `/admin/globals/${g.slug}`, `approval-${g.slug}`)
          return doc
        },
      ],
    },
  }
}
