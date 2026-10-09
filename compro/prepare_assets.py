"""Kompres aset dari public/images ke compro/img supaya PDF tetap kecil (<3 MB).

img/halal.png tidak dibuat di sini: dipotong dari compro ARTIC 2023 (logo Halal Indonesia).
"""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parent.parent / 'public' / 'images'
OUT = Path(__file__).resolve().parent / 'img'

# (sumber, nama keluaran, lebar maks px, format)
JOBS = [
    ('logo.png', 'logo.png', 720, 'PNG'),
    ('floating.png', 'floating.png', 760, 'PNG'),
    ('hero-splash.webp', 'splash.png', 640, 'PNG'),
    ('product_330ml.png', 'p330.jpg', 640, 'JPEG'),
    ('product_600ml.png', 'p600.jpg', 640, 'JPEG'),
    ('product_gallon.png', 'gallon.jpg', 640, 'JPEG'),
    ('hero_bg.png', 'stream.jpg', 900, 'JPEG'),
    ('hero-bg-tall.webp', 'forest.jpg', 900, 'JPEG'),
    ('pabrik/filling-far.webp', 'filling-far.jpg', 700, 'JPEG'),
    ('pabrik/filter.webp', 'filter.jpg', 700, 'JPEG'),
    ('pabrik/ro.webp', 'ro.jpg', 700, 'JPEG'),
    ('pabrik/filling-inside.webp', 'filling.jpg', 700, 'JPEG'),
    ('pabrik/capped-label.webp', 'capped.jpg', 700, 'JPEG'),
]

OUT.mkdir(exist_ok=True)
for src, name, width, fmt in JOBS:
    im = Image.open(SRC / src)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    if fmt == 'JPEG':
        im.convert('RGB').save(OUT / name, 'JPEG', quality=78, optimize=True, progressive=True)
    else:
        im.save(OUT / name, 'PNG', optimize=True)
    print(f'{name}: {(OUT / name).stat().st_size // 1024} KB')
