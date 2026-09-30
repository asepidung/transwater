#!/usr/bin/env bash
# Dijalankan oleh pm2: memuat env produksi lalu menjalankan Next.js.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
set -a; . "$ENV_FILE"; set +a
export NODE_ENV=production
cd "$APP_DIR"
exec node node_modules/next/dist/bin/next start -p "${PORT:-3010}"
