#!/usr/bin/env bash
# Dijalankan oleh pm2: memuat env produksi lalu menjalankan Next.js.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$HOME/artic-data/.env.production}"
set -a; . "$ENV_FILE"; set +a
export NODE_ENV=production
cd "$APP_DIR"
# Hanya 127.0.0.1: aplikasi diakses lewat nginx (proxy_pass ke 127.0.0.1:<port>), tidak langsung dari luar.
exec node node_modules/next/dist/bin/next start -H 127.0.0.1 -p "${PORT:-3010}"
