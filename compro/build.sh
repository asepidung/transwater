#!/usr/bin/env bash
# Cetak compro/index.html ke PDF (A4 lanskap) dengan Chromium headless,
# lalu render tiap halaman ke PNG di compro/preview/ untuk diperiksa.
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-$(command -v chromium || command -v google-chrome || echo /opt/pw-browsers/chromium-1194/chrome-linux/chrome)}"
OUT="${1:-ARTIC-Company-Profile.pdf}"

"$CHROME" --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=5000 \
  --print-to-pdf="$PWD/$OUT" "file://$PWD/index.html" 2>/dev/null

python3 - "$OUT" <<'PY'
import sys, pathlib, fitz
pdf = sys.argv[1]
doc = fitz.open(pdf)
pathlib.Path('preview').mkdir(exist_ok=True)
for i, page in enumerate(doc, 1):
    r = page.rect
    page.get_pixmap(dpi=110).save(f'preview/halaman-{i}.png')
    print(f'halaman {i}: {r.width / 72 * 25.4:.0f} x {r.height / 72 * 25.4:.0f} mm, {len(page.get_text().split())} kata')
print(f'{pdf}: {len(doc)} halaman, {pathlib.Path(pdf).stat().st_size / 1024 / 1024:.2f} MB')
PY
