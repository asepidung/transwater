// Kirim satu email uji memakai pengaturan SMTP dari environment (untuk deploy/set-smtp.sh).
import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM, NOTIFY_EMAIL } = process.env
if (!SMTP_HOST || !NOTIFY_EMAIL) {
  console.error('SMTP_HOST atau NOTIFY_EMAIL belum diisi.')
  process.exit(1)
}

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: SMTP_SECURE === 'true',
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
})

try {
  await transport.sendMail({
    from: `Website ARTIC <${EMAIL_FROM || SMTP_USER}>`,
    to: NOTIFY_EMAIL.split(',').filter(Boolean),
    subject: '[ARTIC] Tes notifikasi email',
    text: 'Ini email uji dari website ARTIC. Kalau Anda menerimanya, notifikasi permintaan penawaran sudah aktif.',
  })
  console.log(`Email uji terkirim ke: ${NOTIFY_EMAIL}`)
} catch (err) {
  console.error('Gagal mengirim email uji:', err.message)
  process.exit(1)
}
