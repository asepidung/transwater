import { draftMode } from 'next/headers'

// Mode pratinjau: aktif hanya di browser Pemilik/Staf yang membukanya lewat tombol "Pratinjau" di admin
// (lihat /api/preview). Di mode ini situs membaca DRAFT terbaru, bukan versi yang sudah terbit.
// Di luar permintaan (mis. generateStaticParams saat build) selalu dianggap tidak aktif.
export async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}
