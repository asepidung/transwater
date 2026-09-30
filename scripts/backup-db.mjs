// Backup database SQLite yang AMAN saat aplikasi sedang berjalan (VACUUM INTO menghasilkan
// salinan konsisten; menyalin file .db mentah bisa menghasilkan salinan rusak).
//
// Pakai:  DATABASE_URL=file:/home/USER/artic-data/artic.db BACKUP_DIR=/home/USER/artic-data/backups node scripts/backup-db.mjs
import { createClient } from '@libsql/client'
import fs from 'node:fs'
import path from 'node:path'

const url = process.env.DATABASE_URL
if (!url || !url.startsWith('file:')) {
  console.error('DATABASE_URL harus berupa file:... (SQLite)')
  process.exit(1)
}
const dbFile = url.slice('file:'.length)
const backupDir = process.env.BACKUP_DIR || path.join(path.dirname(dbFile), 'backups')
const keepDays = Number(process.env.BACKUP_KEEP_DAYS || 14)

fs.mkdirSync(backupDir, { recursive: true })

const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16)
const target = path.join(backupDir, `artic-${stamp}.db`)
if (fs.existsSync(target)) fs.rmSync(target)

const client = createClient({ url })
await client.execute(`VACUUM INTO '${target.replace(/'/g, "''")}'`)
client.close()

// Validasi cepat: salinan bisa dibuka dan berisi tabel.
const check = createClient({ url: `file:${target}` })
const res = await check.execute("select count(*) as n from sqlite_master where type = 'table'")
check.close()
if (Number(res.rows[0].n) === 0) {
  console.error('Backup kosong, dianggap gagal.')
  process.exit(1)
}

// Hapus backup lama.
const limit = Date.now() - keepDays * 24 * 60 * 60 * 1000
for (const f of fs.readdirSync(backupDir)) {
  const p = path.join(backupDir, f)
  if (/^artic-.*\.db$/.test(f) && fs.statSync(p).mtimeMs < limit) fs.rmSync(p)
}

console.log(`Backup database OK: ${target} (${(fs.statSync(target).size / 1024).toFixed(0)} KB)`)
