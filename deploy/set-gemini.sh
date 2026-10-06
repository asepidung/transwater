#!/usr/bin/env bash
# Pasang kunci Gemini API ke env server untuk tombol AI di admin, uji dulu, lalu restart aplikasi.
# Jalankan sebagai user situs:  bash ~/app/deploy/set-gemini.sh
# Kunci diketik tersembunyi dan TIDAK ditampilkan atau dikirim ke mana pun selain file env
# dan satu panggilan uji ke Google (langsung ke generativelanguage.googleapis.com).
set -euo pipefail
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
[ -f "$ENV_FILE" ] || { echo "Env tidak ditemukan: $ENV_FILE"; exit 1; }

read -rsp "Kunci Gemini API (tidak tampil saat diketik): " KEY; echo
KEY="${KEY// /}"
[ -n "$KEY" ] || { echo "Kosong, dibatalkan."; exit 1; }
echo "Panjang kunci yang terbaca: ${#KEY} karakter (kunci Google biasanya 39, diawali AIza)."
case "$KEY" in AIza*) ;; *) echo "PERINGATAN: tidak diawali 'AIza'. Pastikan itu kunci dari aistudio.google.com/apikey." ;; esac

echo "Menguji kunci ke Gemini..."
MODEL="${GEMINI_TEST_MODEL:-gemini-flash-latest}"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 30 \
  -H 'content-type: application/json' -H "x-goog-api-key: $KEY" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Balas satu kata: siap"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent")"
if [ "$CODE" != "200" ]; then
  echo "Uji GAGAL (HTTP $CODE). Kunci tidak disimpan dan aplikasi tidak diubah."
  echo "  400/403 = kunci salah atau belum aktif; 429 = kuota habis; 404 = nama model tidak ada."
  unset KEY
  exit 1
fi

cp "$ENV_FILE" "$ENV_FILE.bak" && chmod 600 "$ENV_FILE.bak"
TMP="$(mktemp)"
grep -vE '^GEMINI_API_KEY=' "$ENV_FILE" > "$TMP" || true
echo "GEMINI_API_KEY=$KEY" >> "$TMP"
cat "$TMP" > "$ENV_FILE"; rm -f "$TMP"; chmod 600 "$ENV_FILE"
unset KEY

pm2 restart artic --update-env >/dev/null
echo "Kunci valid dan tersimpan. Aplikasi di-restart; tombol AI di admin aktif."
