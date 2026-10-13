import type { Payload } from 'payload'
import { APPROVAL_TARGETS, editUrl, previewUrl, type ApprovalTarget } from '@/lib/approval-targets'

type Props = { payload: Payload; user?: { role?: string | null } | null }

type Item = { key: string; label: string; edit: string; preview: string; requested: boolean; by?: string; note?: string }

// Dasbor: perubahan draf dan permintaan terbit dari Staf. Pemilik langsung melihat tombol Pratinjau dan Buka (terbitkan),
// tanpa mencari menu. Draf = versi terbaru berstatus draft; versi yang sudah terbit tetap tayang sampai Pemilik menerbitkan.
export async function PendingApprovals({ payload, user }: Props) {
  const isOwner = user?.role === 'owner'
  const items: Item[] = []

  try {
    const reqs = await payload.find({ collection: 'approval-requests', limit: 100, depth: 0, overrideAccess: true })
    const reqMap = new Map(reqs.docs.map((r) => [`${r.target}:${r.docId ?? ''}`, r]))

    const add = (t: ApprovalTarget, docId: string, label: string, slug?: string) => {
      const r = reqMap.get(`${t.slug}:${docId}`)
      items.push({ key: `${t.slug}:${docId}`, label, edit: editUrl(t, docId), preview: previewUrl(t, slug), requested: Boolean(r), by: r?.requestedBy ?? undefined, note: r?.note ?? undefined })
    }

    for (const t of APPROVAL_TARGETS) {
      if (t.kind === 'collection') {
        const res = await payload.find({
          collection: t.slug as 'products' | 'posts',
          draft: true,
          where: { _status: { equals: 'draft' } },
          limit: 50,
          depth: 0,
          overrideAccess: true,
        })
        for (const d of res.docs as { id: number | string; title?: string; slug?: string }[]) add(t, String(d.id), `${t.label}: ${d.title || d.slug || d.id}`, d.slug)
      } else {
        const doc = await payload.findGlobal({ slug: t.slug as 'site-settings', draft: true, depth: 0, overrideAccess: true })
        if ((doc as { _status?: string })._status === 'draft') add(t, '', t.label)
      }
    }

    // Permintaan yang dokumennya tidak terdeteksi sebagai draf (mis. halaman isi yang diajukan tanpa perubahan baru) tetap ditampilkan.
    for (const r of reqs.docs) {
      const t = APPROVAL_TARGETS.find((x) => x.slug === r.target)
      if (!t || items.some((i) => i.key === `${r.target}:${r.docId ?? ''}`)) continue
      let slug: string | undefined
      if (t.kind === 'collection' && r.docId) {
        try {
          slug = ((await payload.findByID({ collection: t.slug as 'products' | 'posts', id: r.docId, draft: true, depth: 0, overrideAccess: true })) as { slug?: string }).slug ?? undefined
        } catch {
          continue
        }
      }
      add(t, r.docId ?? '', r.title, slug)
    }
  } catch {
    return null
  }

  if (items.length === 0) return null

  const requested = items.filter((i) => i.requested)
  const others = items.filter((i) => !i.requested)

  return (
    <div className="artic-push" style={requested.length && isOwner ? { borderColor: '#d97706', boxShadow: '0 0 0 2px rgba(217,119,6,.25)' } : undefined}>
      {requested.length > 0 && (
        <>
          <div className="artic-push__head">
            <strong>📨 {isOwner ? `Permintaan terbit (${requested.length})` : 'Sudah Anda ajukan ke Pemilik'}</strong>
          </div>
          <p className="artic-push__text">
            {isOwner ? 'Staf meminta perubahan ini diterbitkan. Klik Pratinjau untuk melihat hasilnya, lalu buka dan tekan Terbitkan jika sudah sesuai.' : 'Menunggu Pemilik melihat pratinjau dan menerbitkan.'}
          </p>
          <ul className="artic-push__text" style={{ margin: '0.25rem 0 0.5rem', paddingLeft: '1.1rem' }}>
            {requested.map((i) => (
              <li key={i.key} style={{ marginBottom: '0.35rem' }}>
                <strong>{i.label}</strong>
                {i.by ? <> · oleh {i.by}</> : null}
                {i.note ? <> · “{i.note}”</> : null}
                <br />
                <a href={i.preview} target="_blank" rel="noopener">👁 Pratinjau</a>
                {' · '}
                <a href={i.edit}>{isOwner ? 'Buka & terbitkan' : 'Buka'}</a>
              </li>
            ))}
          </ul>
        </>
      )}
      {others.length > 0 && (
        <>
          <div className="artic-push__head">
            <strong>📝 Draf belum diajukan ({others.length})</strong>
          </div>
          <p className="artic-push__text">Tersimpan sebagai draf dan belum tampil di situs. {isOwner ? 'Staf belum menekan Ajukan terbit.' : 'Tekan Ajukan terbit di halaman edit jika sudah selesai.'}</p>
          <ul className="artic-push__text" style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
            {others.map((i) => (
              <li key={i.key}>
                <a href={i.edit}>{i.label}</a>
                {isOwner && (
                  <>
                    {' · '}
                    <a href={i.preview} target="_blank" rel="noopener">Pratinjau</a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
