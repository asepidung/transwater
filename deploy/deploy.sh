#!/usr/bin/env bash
# Deploy di server (dijalankan sebagai user situs di folder aplikasi):
#   bash deploy/deploy.sh            # deploy branch dari BRANCH (default main)
#   BRANCH=feat/payload-cms bash deploy/deploy.sh
#   RESEED=1 bash deploy/deploy.sh   # HANYA jika konten belum pernah diedit: isi ulang teks dari kode
# Urutan sengaja begini: ambil kode -> pasang dependensi -> BACKUP -> migrasi DB -> build -> reload.
# Build membaca database (halaman statis dibuat dari konten CMS), jadi migrasi HARUS sebelum build.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
BRANCH="${BRANCH:-main}"
PORT_CHECK="${PORT:-3010}"

[ -f "$ENV_FILE" ] || { echo "Env tidak ditemukan: $ENV_FILE"; exit 1; }
set -a; . "$ENV_FILE"; set +a
export NODE_ENV=production
cd "$APP_DIR"

echo "== 1/6 Ambil kode ($BRANCH)"
git fetch origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "== 2/6 Pasang dependensi"
npm ci --include=dev --no-audit --no-fund

FIRST_RUN=0
echo "== 3/6 Backup sebelum migrasi"
if [ -f "${DATABASE_URL#file:}" ]; then
  bash deploy/backup.sh || { echo "Backup GAGAL, deploy dibatalkan."; exit 1; }
else
  echo "Database belum ada (deploy pertama), backup dilewati."
  FIRST_RUN=1
fi

echo "== 4/6 Migrasi database"
npm run migrate
if [ "$FIRST_RUN" = "1" ]; then
  echo "-- Deploy pertama: isi data awal (produk, foto, teks) sebelum build"
  ALLOW_PROD_SEED=1 npm run seed
fi
if [ "${RESEED:-0}" = "1" ] && [ "$FIRST_RUN" != "1" ]; then
  echo "-- RESEED=1: isi ulang produk, foto, dan SEMUA teks halaman dari kode (menimpa suntingan di admin!)"
  SEED_RESET=1 ALLOW_PROD_SEED=1 npm run seed
fi

echo "== 5/6 Build"
# Hapus cache pengoptimal gambar lama supaya foto yang diganti tidak tersaji dari salinan lama.
rm -rf .next/cache/images
npm run build

echo "== 6/6 Restart aplikasi"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save

echo "== Cek kesehatan"
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://127.0.0.1:$PORT_CHECK/api/health" >/dev/null; then
    echo "OK: aplikasi sehat."
    exit 0
  fi
  sleep 3
done
echo "GAGAL: /api/health tidak menjawab. Cek: pm2 logs artic"
exit 1
