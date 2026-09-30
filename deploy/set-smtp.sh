#!/usr/bin/env bash
# Isi pengaturan email (SMTP Gmail) ke env server, kirim email uji, lalu restart aplikasi.
# Jalankan sebagai user situs:  bash ~/app/deploy/set-smtp.sh
# App Password diketik tersembunyi dan TIDAK ditampilkan atau dikirim ke mana pun selain file env.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
[ -f "$ENV_FILE" ] || { echo "Env tidak ditemukan: $ENV_FILE"; exit 1; }

read -rp "Alamat Gmail pengirim (mis. artic.notif@gmail.com): " SMTP_USER
read -rsp "App Password 16 karakter (tidak tampil saat diketik): " SMTP_PASS; echo
read -rp "Email penerima notifikasi (pisahkan koma bila lebih dari satu): " NOTIFY

SMTP_USER="${SMTP_USER// /}"; SMTP_PASS="${SMTP_PASS// /}"; NOTIFY="${NOTIFY// /}"
[ -n "$SMTP_USER" ] && [ -n "$SMTP_PASS" ] && [ -n "$NOTIFY" ] || { echo "Ada isian yang kosong, dibatalkan."; exit 1; }

cp "$ENV_FILE" "$ENV_FILE.bak" && chmod 600 "$ENV_FILE.bak"
TMP="$(mktemp)"
grep -vE '^(SMTP_HOST|SMTP_PORT|SMTP_SECURE|SMTP_USER|SMTP_PASS|EMAIL_FROM|NOTIFY_EMAIL)=' "$ENV_FILE" > "$TMP" || true
{
  echo "NOTIFY_EMAIL=$NOTIFY"
  echo "SMTP_HOST=smtp.gmail.com"
  echo "SMTP_PORT=465"
  echo "SMTP_SECURE=true"
  echo "SMTP_USER=$SMTP_USER"
  echo "SMTP_PASS=$SMTP_PASS"
  echo "EMAIL_FROM=$SMTP_USER"
} >> "$TMP"
cat "$TMP" > "$ENV_FILE"; rm -f "$TMP"; chmod 600 "$ENV_FILE"
unset SMTP_PASS
echo "Pengaturan tersimpan. Mengirim email uji..."

set -a; . "$ENV_FILE"; set +a
cd "$APP_DIR"
if node scripts/test-email.mjs; then
  pm2 restart artic --update-env >/dev/null
  echo "Aplikasi di-restart. Notifikasi email form penawaran aktif."
else
  echo "Email uji GAGAL. Pengaturan lama dipulihkan; aplikasi tidak diubah."
  cat "$ENV_FILE.bak" > "$ENV_FILE"; chmod 600 "$ENV_FILE"
  exit 1
fi
