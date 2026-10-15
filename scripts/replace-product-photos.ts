import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

// Mengganti berkas foto produk 330 ml dan 600 ml di Foto & Berkas (CMS) tanpa mengubah dokumen lain.
// Dipakai sekali saat foto baru dari ARTIC (botol bening) dipasang. Ukuran kartu/thumbnail dibuat ulang otomatis.
//
// Cara pakai (di server, sebagai user situs; env produksi dimuat dulu):
//   NEW_330=/path/ke/new330.png NEW_600=/path/ke/new600.png npm run replace-photos
// Tanpa NEW_330/NEW_600 skrip hanya menampilkan dokumen yang akan diganti (tidak mengubah apa pun).
const targets: { filename: string; file?: string }[] = [
  { filename: 'product_330ml.png', file: process.env.NEW_330 },
  { filename: 'product_600ml.png', file: process.env.NEW_600 },
]

const payload = await getPayload({ config })

for (const t of targets) {
  const found = await payload.find({ collection: 'media', where: { filename: { equals: t.filename } }, limit: 2, depth: 0, overrideAccess: true })
  const doc = found.docs[0]
  if (!doc) {
    console.log(`[lewati] ${t.filename}: dokumen media tidak ditemukan`)
    continue
  }
  if (!t.file) {
    console.log(`[cek] ${t.filename}: id ${doc.id} (isi NEW_330/NEW_600 untuk mengganti)`)
    continue
  }
  const filePath = path.resolve(t.file)
  if (!fs.existsSync(filePath)) throw new Error(`Berkas baru tidak ditemukan: ${filePath}`)
  const updated = await payload.update({ collection: 'media', id: doc.id, data: {}, filePath, overrideAccess: true })
  console.log(`[ok] ${t.filename}: id ${doc.id} -> ${updated.filename} (${updated.width}x${updated.height})`)
}

process.exit(0)
