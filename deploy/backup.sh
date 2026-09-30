#!/usr/bin/env bash
# Backup harian: database (aman untuk DB yang sedang jalan) + folder foto.
# Jalankan lewat cron sebagai user situs. Env dibaca dari ENV_FILE.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
set -a; . "$ENV_FILE"; set +a

BACKUP_DIR="${BACKUP_DIR:-$(dirname "${DATABASE_URL#file:}")/backups}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
mkdir -p "$BACKUP_DIR"

cd "$APP_DIR"
BACKUP_DIR="$BACKUP_DIR" node scripts/backup-db.mjs

# Foto/upload
if [ -n "${MEDIA_DIR:-}" ] && [ -d "$MEDIA_DIR" ]; then
  STAMP="$(date +%Y-%m-%d-%H%M)"
  tar --force-local -czf "$BACKUP_DIR/media-$STAMP.tar.gz" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")"
  find "$BACKUP_DIR" -name 'media-*.tar.gz' -mtime +"$KEEP_DAYS" -delete
  echo "Backup media OK: media-$STAMP.tar.gz"
fi

# Salinan di luar VPS (WAJIB diaktifkan sebelum go-live). Contoh dengan rclone:
#   rclone copy "$BACKUP_DIR" remote:artic-backups --max-age 2d
if [ -n "${OFFSITE_CMD:-}" ]; then
  eval "$OFFSITE_CMD"
fi
