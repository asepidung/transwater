#!/usr/bin/env bash
# Pasang kunci Gemini API ke env server untuk tombol AI di admin, uji dulu, lalu restart aplikasi.
# Jalankan sebagai user situs:  bash ~/app/deploy/set-gemini.sh
# Kunci diketik/ditempel tersembunyi dan TIDAK ditampilkan atau dikirim ke mana pun selain file env
# dan panggilan uji ke Google (langsung ke generativelanguage.googleapis.com).
set -uo pipefail
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
[ -f "$ENV_FILE" ] || { echo "Env tidak ditemukan: $ENV_FILE (jalankan sebagai user situs: su - artic)"; exit 1; }

read -rsp "Kunci Gemini API (tidak tampil saat diketik/ditempel): " KEY; echo
KEY="${KEY//[[:space:]]/}"
[ -n "$KEY" ] || { echo "Kosong, dibatalkan."; exit 1; }
echo "Panjang kunci yang terbaca: ${#KEY} karakter (format lama: 39, diawali AIza; format baru: 53, diawali AQ.)."
case "$KEY" in
  AIza*) ;;
  AQ.*) echo "Format kunci baru dari Google (awalan AQ.) terbaca. Ini normal; yang menentukan adalah hasil uji di bawah." ;;
  *)    echo "PERINGATAN: awalan kunci tidak dikenal. Pastikan itu kunci dari aistudio.google.com/apikey." ;;
esac

echo "Menguji kunci ke Gemini..."
BODY="$(mktemp)"; trap 'rm -f "$BODY"' EXIT
CODE="000"
for MODEL in ${GEMINI_TEST_MODELS:-gemini-flash-latest gemini-flash-lite-latest}; do
  CODE="$(curl -s -m 30 -o "$BODY" -w '%{http_code}' \
    -H 'content-type: application/json' -H "x-goog-api-key: $KEY" \
    -d '{"contents":[{"role":"user","parts":[{"text":"Balas satu kata: siap"}]}]}' \
    "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent")" || CODE="000"
  echo "  model $MODEL -> HTTP $CODE"
  [ "$CODE" = "200" ] && break
  # 400/401/403 = masalah kunci: model lain tidak akan membantu.
  case "$CODE" in 400|401|403) break ;; esac
done

if [ "$CODE" != "200" ]; then
  echo "Uji GAGAL. Kunci tidak disimpan dan aplikasi tidak diubah."
  echo "Pesan dari Google: $(grep -o '"message": *"[^"]*"' "$BODY" | head -1 | cut -c1-220)"
  echo "  000 = tidak bisa menghubungi Google; 400/401/403 = kunci salah atau belum aktif;"
  echo "  429 = kuota habis; 404 = nama model tidak ada; 503 = layanan Google sedang sibuk (coba lagi nanti)."
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
