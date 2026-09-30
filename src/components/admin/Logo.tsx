// Logo di halaman login panel admin. Dibungkus kotak putih supaya tetap terbaca di tema gelap.
export function Logo() {
  return (
    <div className="artic-login-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.png?v=3" alt="ARTIC Air Mineral" width={220} height={140} />
    </div>
  )
}
