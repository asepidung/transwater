#!/usr/bin/env bash
# Membuat kunci VAPID untuk notifikasi dorong di admin (sekali per server), lalu restart aplikasi.
# Jalankan sebagai user situs:  bash ~/app/deploy/set-vapid.sh
# Kunci dibuat DI SERVER dan langsung ditulis ke file env; tidak ditampilkan dan tidak perlu diketik.
# Jika kunci sudah ada, TIDAK ditimpa (membuat ulang kunci akan memutus semua perangkat yang sudah mengaktifkan notifikasi).
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
[ -f "$ENV_FILE" ] || { echo "Env tidak ditemukan: $ENV_FILE (jalankan sebagai user situs: su - artic)"; exit 1; }

if grep -q '^VAPID_PRIVATE_KEY=.\+' "$ENV_FILE"; then
  echo "Kunci VAPID sudah terpasang. Tidak ada yang diubah."
  echo "(Untuk membuat ulang, hapus baris VAPID_* di $ENV_FILE dulu. Semua perangkat harus mengaktifkan notifikasi lagi.)"
  exit 0
fi

cd "$APP_DIR"
KEYS="$(node -e "const w=require('web-push');const k=w.generateVAPIDKeys();console.log(k.publicKey+' '+k.privateKey)")"
PUB="${KEYS%% *}"; PRIV="${KEYS##* }"
[ -n "$PUB" ] && [ -n "$PRIV" ] || { echo "Gagal membuat kunci."; exit 1; }

FIRST_EMAIL="$(grep '^NOTIFY_EMAIL=' "$ENV_FILE" | cut -d= -f2 | cut -d, -f1 | tr -d ' ' || true)"
SUBJECT="mailto:${FIRST_EMAIL:-admin@artic.co.id}"

cp "$ENV_FILE" "$ENV_FILE.bak" && chmod 600 "$ENV_FILE.bak"
TMP="$(mktemp)"
grep -vE '^(VAPID_PUBLIC_KEY|VAPID_PRIVATE_KEY|VAPID_SUBJECT)=' "$ENV_FILE" > "$TMP" || true
{
  echo "VAPID_PUBLIC_KEY=$PUB"
  echo "VAPID_PRIVATE_KEY=$PRIV"
  echo "VAPID_SUBJECT=$SUBJECT"
} >> "$TMP"
cat "$TMP" > "$ENV_FILE"; rm -f "$TMP"; chmod 600 "$ENV_FILE"
unset KEYS PRIV

pm2 restart artic --update-env >/dev/null
echo "Kunci VAPID dibuat dan tersimpan (publik: ${#PUB} karakter). Aplikasi di-restart."
echo "Langkah berikutnya: buka admin di HP, dasbor > 'Aktifkan notifikasi'."
