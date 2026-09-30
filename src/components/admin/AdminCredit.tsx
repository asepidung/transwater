// Kredit developer + jalur bantuan. Dipakai di halaman login dan bawah menu samping.
export function AdminCredit() {
  return (
    <p className="artic-credit">
      Dibuat oleh{' '}
      <a href="https://saepullrock.tech/" target="_blank" rel="noopener">
        IDNX
      </a>
      <span className="artic-credit__help">
        {' '}
        · Butuh bantuan?{' '}
        <a href="https://saepullrock.tech/" target="_blank" rel="noopener">
          Hubungi IDNX
        </a>
      </span>
    </p>
  )
}
