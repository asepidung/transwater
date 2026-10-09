# Brief: Company Profile ARTIC (PDF) — serah terima

Dokumen ini untuk sesi yang akan menyusun company profile (PDF). Tidak berisi kunci, kata sandi, atau alamat server. Basis kode: branch `feat/payload-cms` (atau `feat/ai-assist`, sama untuk keperluan ini).

## Tujuan
Membuat ulang **company profile ARTIC** (PT. Transwater Roberi Indonesia) sebagai PDF yang bisa diunduh pengunjung website. Versi 2023 dari desainer (Mas Deo) berupa 2 gambar utuh (tidak bisa diedit), berisi data usang. Permintaan Pak Feri (Direktur, penyetuju akhir):
1. Kata "Baik dan Benar" **semuanya** diganti **"Premium dan Higienis"**.
2. Latar/foto: mesin, tangki, botol, dan galon, seperti di website.
3. Tampilan sebisa mungkin mirip versi lama (2 halaman lanskap: halaman 1 = produk + kontak; halaman 2 = tentang kami, nilai, visi/misi, proses, kontrol kualitas).

## Format keluaran
- PDF **2 halaman lanskap**, ukuran A4 lanskap (297 x 210 mm), **bahasa Indonesia saja**.
- **Teks harus teks asli** (bisa dipilih/dicari), bukan gambar. Ukuran file **di bawah 3 MB** (foto dikompres).
- Dibuat dari HTML + CSS lalu dicetak ke PDF dengan Chromium tanpa kepala (headless). Simpan sumbernya di `compro/` (mis. `compro/index.html`) dan hasil di `compro/ARTIC-Company-Profile.pdf`.
- Periksa hasil dengan merender tiap halaman jadi gambar (mis. PyMuPDF) dan lihat sendiri sebelum menyerahkan.

## Aset yang sudah ada di repo (semua di `public/images/`)
- Logo: `logo.png` (transparan). Produk bertiga (transparan): `floating.png`. Render per produk: `product_330ml.png`, `product_600ml.png`, `product_gallon.png`.
- Foto fasilitas (`pabrik/`): `filter.webp` (tangki penyaringan), `alkali.webp` (tangki alkali), `ro.webp` (unit reverse osmosis), `filling-inside.webp`, `filling-far.webp` (mesin pengisian), `capped-label.webp` (botol berlabel di lini), `packing.webp`, `packing-2.webp`, `warehouse.webp`.
- Latar alam: `hero-bg-wide.webp`, `hero-lake-wide.webp`, `hero-splash.webp` (cipratan air).
- Palet website (Tailwind di `src/app/globals.css`): navy (`--color-navy-*`, utama #303860 pada navy-700), emas (`--color-gold-*`, #a88038), biru air (`--color-water-*`). Font: lihat `src/app/layout.tsx`.

## Sumber teks (kebenaran tunggal)
Pakai teks dari **`src/lib/content.ts`** (bagian bahasa Indonesia: `about`, `quality`, `products`, `trust`, `company`). Teks di sana sudah dipoles dan memakai "Premium dan Higienis". Boleh dipadatkan agar muat 2 halaman, **jangan menambah klaim baru**.

## Data yang BOLEH tampil (sudah terverifikasi)
- Perusahaan: PT. Transwater Roberi Indonesia, berdiri 2017, Cileungsi, Bogor.
- Produk: ARTIC botol 330 ml (1 karton = 24 botol), botol 600 ml (1 karton = 24 botol), galon 19 liter.
- Legalitas: **NIB 9120106342207**; **Merek terdaftar DJKI IDM000818024**; **BPOM RI MD 122882000900549 (botol)**; **Halal BPJPH ID00110007032150723** (atas nama PT. Transwater Roberi Indonesia; produk "ARTIC Air Minum Dalam Kemasan Mineral", sudah dicek di situs BPJPH).
- Standar: boleh ditulis "proses produksi mengacu pada SNI 3553:2023 (air mineral)". **Bukan** klaim bersertifikat.
- Kontak: Jl. Raya Cipeucang/Ciuncal No. 88 A, Cipeucang, Kec. Cileungsi, Kab. Bogor, Jawa Barat 16820. Telepon kantor (021) 8993-1363. WhatsApp/telepon +62 813-9964-1608. Email transwaterroberi03.sn@gmail.com. Jam kerja 08.00 - 16.00 WIB. Instagram https://www.instagram.com/articwater.id/ . Website: artic.co.id (belum live).

## Yang TIDAK BOLEH tampil kecuali Pak Feri mengonfirmasi tertulis
Ini ada di compro 2023 tetapi usang atau belum terbukti:
- Nomor BPOM lama **MD 265228013693** (JANGAN dipakai).
- Logo/teks **SNI 3553:2015** dan logo SNI (standar sudah 2023; nomor sertifikat SPPT-SNI belum ada).
- **ISO 9001:2015**, logo **KAN**, logo **Kemenperin** (belum ada sertifikat/izin logo).
- "Low TDS <25 ppm", "Soft Mineral Water", "micro molekul diserap cepat", "Mengandung Oxygen Natural", pH tinggi, dan klaim kesehatan lain.
- Superlatif seperti "tak tertandingi", "terbaik".
- Logo Halal boleh dipakai (nomor di atas terverifikasi).

**Status konfirmasi ke Pak Feri:** ditanyakan (1) nomor BPOM terbaru, (2) logo SNI/ISO/KAN/Kemenperin, (3) bukti lab untuk TDS dan "Soft Mineral Water". **Jangan mulai sebelum Asep memberi tahu jawabannya.** Sambil menunggu, rancang tata letak dengan data yang boleh tampil saja.

## Struktur yang diusulkan
- **Halaman 1:** logo besar, tagline "Penuhi kebutuhan air minum Anda dengan ARTIC", 3 produk (foto `floating.png` atau render per produk) dengan keterangan kemasan, blok kontak (WhatsApp, telepon kantor, email, alamat), baris legalitas terverifikasi, latar alam/cipratan air.
- **Halaman 2:** Tentang Kami, Nilai Perusahaan (Integritas, Kemitraan, Profesional, Pertumbuhan), Visi dan Misi (versi "Premium dan Higienis"), proses (kolase 4-5 foto fasilitas: penyaringan, alkali, reverse osmosis, mesin pengisian), kontrol kualitas (6 pilar di `quality.pillars`), logo-logo legalitas yang terverifikasi saja.
- Kolom/foto dibuat rapi dan seragam (belajar dari kartu legalitas di website).

## Aturan kerja
- Folder `docs/` di komputer Asep berisi bahan mentah (tidak ada di repo); jangan bergantung padanya. Semua aset yang dibutuhkan ada di `public/images/`.
- Jangan sentuh `src/` (website) untuk pekerjaan ini. Hanya tambah folder `compro/`.
- Setelah PDF jadi: serahkan ke Asep (jalur cepat: unggah lewat admin website atau dipasang oleh sesi artic utama; tombol "Unduh Company Profile" di website adalah pekerjaan terpisah).
- Gaya komunikasi dengan Asep: Indonesia santai, singkat. Laporkan jujur kalau ada yang belum bisa dipastikan.
