// Kolom "Sudah ditindaklanjuti" di daftar Pesan Masuk: tampil "Sudah" / "Belum", bukan true/false.
export function HandledCell({ cellData }: { cellData?: unknown }) {
  const done = cellData === true
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: done ? 'rgba(34,197,94,.18)' : 'rgba(245,158,11,.18)',
        color: done ? '#16a34a' : '#d97706',
      }}
    >
      {done ? 'Sudah' : 'Belum'}
    </span>
  )
}
