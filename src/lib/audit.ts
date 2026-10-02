import type { CollectionConfig, GlobalConfig, PayloadRequest } from 'payload'

// Pasang pencatat aktivitas ke semua koleksi dan global (kecuali log itu sendiri).
// Hanya aksi yang dilakukan pengguna yang login yang dicatat; seed, skrip, dan pengiriman
// form dari pengunjung (tanpa user) tidak dicatat.

const IGNORED_KEYS = new Set(['id', 'createdAt', 'updatedAt', 'globalType', 'sizes', 'thumbnailURL', 'url'])

type Doc = Record<string, unknown> | undefined

const changedKeys = (doc: Doc, prev: Doc): string[] => {
  if (!doc) return []
  const keys = Object.keys(doc).filter((k) => !IGNORED_KEYS.has(k))
  if (!prev) return keys
  return keys.filter((k) => JSON.stringify(doc[k]) !== JSON.stringify(prev[k]))
}

const label = (l: unknown, fallback: string): string => {
  if (typeof l === 'string') return l
  if (l && typeof l === 'object') {
    const v = (l as Record<string, unknown>).singular ?? Object.values(l as object)[0]
    if (typeof v === 'string') return v
  }
  return fallback
}

type Entry = { action: 'login' | 'create' | 'update' | 'delete'; area: string; item?: string; fields?: string[] }

async function write(req: PayloadRequest, e: Entry) {
  const user = req.user as { username?: string; name?: string; email?: string } | null
  if (!user) return
  const actor = user.username || user.name || user.email || 'pengguna'
  try {
    await req.payload.create({
      collection: 'activity-log' as never,
      data: {
        actor,
        action: e.action,
        area: e.area,
        item: e.item,
        fields: e.fields?.join(', '),
        summary: `${actor} ${e.action} ${e.area}`,
      } as never,
      overrideAccess: true,
    })
  } catch (err) {
    // Pencatatan tidak boleh menggagalkan penyimpanan konten.
    req.payload.logger.error({ err }, '[audit] gagal mencatat aktivitas')
  }
}

export function withAuditCollection(c: CollectionConfig): CollectionConfig {
  if (c.slug === 'activity-log') return c
  const area = label(c.labels?.singular, c.slug)
  const title = (doc: Doc) => {
    const key = c.admin?.useAsTitle
    const v = key && doc ? doc[key] : undefined
    return typeof v === 'string' ? v : undefined
  }
  return {
    ...c,
    hooks: {
      ...c.hooks,
      afterChange: [
        ...(c.hooks?.afterChange ?? []),
        async ({ doc, previousDoc, operation, req }) => {
          await write(req, {
            action: operation === 'create' ? 'create' : 'update',
            area,
            item: title(doc),
            fields: operation === 'create' ? undefined : changedKeys(doc, previousDoc),
          })
          return doc
        },
      ],
      afterDelete: [
        ...(c.hooks?.afterDelete ?? []),
        async ({ doc, req }) => {
          await write(req, { action: 'delete', area, item: title(doc) })
          return doc
        },
      ],
      ...(c.auth
        ? {
            afterLogin: [
              ...(c.hooks?.afterLogin ?? []),
              async ({ user, req }) => {
                await write({ ...req, user } as PayloadRequest, { action: 'login', area })
                return user
              },
            ],
          }
        : {}),
    },
  }
}

export function withAuditGlobal(g: GlobalConfig): GlobalConfig {
  const area = label(g.label, g.slug)
  return {
    ...g,
    hooks: {
      ...g.hooks,
      afterChange: [
        ...(g.hooks?.afterChange ?? []),
        async ({ doc, previousDoc, req }) => {
          await write(req, { action: 'update', area, fields: changedKeys(doc, previousDoc) })
          return doc
        },
      ],
    },
  }
}
