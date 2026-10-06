import type { CollectionConfig, Field, GlobalConfig } from 'payload'

// Pasang tombol AI (src/components/admin/AiButtons.tsx) di semua kolom teks yang punya versi bahasa
// (text/textarea dengan localized: true), termasuk yang ada di dalam tab, grup, dan array.
const COMPONENT = '/components/admin/AiButtons#AiButtons'

// Kolom yang tidak boleh diolah AI (data identitas, bukan teks website).
const SKIP = new Set(['slug', 'username', 'email'])

export function withAiFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    const f = field as Field & { fields?: Field[]; tabs?: { fields: Field[] }[]; localized?: boolean; hasMany?: boolean; name?: string }

    if (f.type === 'tabs' && Array.isArray(f.tabs)) {
      return { ...f, tabs: f.tabs.map((tab) => ({ ...tab, fields: withAiFields(tab.fields) })) } as Field
    }
    if (Array.isArray(f.fields)) {
      return { ...f, fields: withAiFields(f.fields) } as Field
    }
    if ((f.type === 'text' || f.type === 'textarea') && f.localized && !f.hasMany && !(f.name && SKIP.has(f.name))) {
      const admin = (f as { admin?: { components?: { afterInput?: unknown[] } } }).admin ?? {}
      return {
        ...f,
        admin: {
          ...admin,
          components: { ...admin.components, afterInput: [...(admin.components?.afterInput ?? []), COMPONENT] },
        },
      } as Field
    }
    return f
  })
}

export const withAiCollection = (c: CollectionConfig): CollectionConfig => ({ ...c, fields: withAiFields(c.fields) })
export const withAiGlobal = (g: GlobalConfig): GlobalConfig => ({ ...g, fields: withAiFields(g.fields) })
