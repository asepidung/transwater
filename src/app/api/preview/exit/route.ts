import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// Keluar dari mode pratinjau (cookie dihapus), kembali ke admin.
export async function GET() {
  ;(await draftMode()).disable()
  redirect('/admin')
}
