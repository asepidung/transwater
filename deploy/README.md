# Deploy ARTIC ke VPS (CloudPanel + pm2)

Panduan ini generik (tanpa IP atau kredensial). Catatan khusus server ada di `docs/` (tidak masuk repo).

## Arsitektur singkat

- Aplikasi Next.js + Payload berjalan di **pm2**, mendengarkan `127.0.0.1:3010`.
- **nginx CloudPanel** menjadi reverse proxy + SSL (Let's Encrypt) ke port itu.
- Database SQLite dan foto disimpan **di luar folder aplikasi**: `~/artic-data/` (deploy ulang tidak menghapusnya).
- Kode dari GitHub; build dilakukan di server (VPS 8 GB cukup; puncak build ±2 GB).

```
~/app/                     kode (git clone), tempat deploy.sh dijalankan
~/artic-data/.env.production   env (chmod 600), TIDAK di git
~/artic-data/artic.db          database
~/artic-data/media/            foto upload
~/artic-data/backups/          backup harian (14 hari)
```

## Langkah pertama kali (staging)

1. **DNS:** tambahkan A record `staging` → IP VPS di zona domain.
2. **CloudPanel → Sites → Add Site:** tipe Node.js (atau Reverse Proxy ke `http://127.0.0.1:3010`), domain `staging.artic.co.id`, user situs misalnya `artic`, Node 22, App Port `3010`. Setelah DNS menyebar: **SSL/TLS → Actions → New Let's Encrypt Certificate**.
3. **Masuk sebagai user situs** (SSH dari CloudPanel → Site → SSH/FTP), lalu:
   ```bash
   mkdir -p ~/artic-data/media ~/artic-data/backups
   git clone https://github.com/asepidung/transwater.git ~/app
   cd ~/app
   cp deploy/env.production.example ~/artic-data/.env.production
   chmod 600 ~/artic-data/.env.production
   nano ~/artic-data/.env.production     # isi PAYLOAD_SECRET, path USER, SITE_URL, dst.
   ```
   Buat `PAYLOAD_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. **pm2:** cek `pm2 -v`; jika belum ada: `npm i -g pm2`. Agar hidup lagi setelah reboot, jalankan sebagai root perintah yang dicetak `pm2 startup` (systemd, untuk user situs).
5. **Deploy pertama:**
   ```bash
   BRANCH=feat/payload-cms bash deploy/deploy.sh
   ```
   Script: ambil kode → `npm ci` → (backup jika DB ada) → **migrasi DB** → (deploy pertama: **seed** data awal) → build → pm2 → cek `/api/health`.
6. **Buat akun admin segera:** buka `https://staging.artic.co.id/admin`. Selama belum ada user, layar "buat akun pertama" terbuka untuk siapa pun, jadi lakukan segera setelah deploy (dan kunci staging dulu, langkah 7).
7. **Kunci staging:** CloudPanel → Site → Security → Basic Auth (aktifkan). Staging otomatis `noindex` karena `ALLOW_INDEXING` kosong.
8. **Backup harian:** `crontab -e` sebagai user situs:
   ```
   30 2 * * * bash /home/artic/app/deploy/backup.sh >> /home/artic/artic-data/backup.log 2>&1
   ```
   Isi `OFFSITE_CMD` (mis. rclone) agar ada salinan di luar VPS **sebelum go-live**.

## Deploy berikutnya

```bash
cd ~/app && BRANCH=main bash deploy/deploy.sh
```

`deploy.sh` selalu membuat backup dulu dan berhenti jika backup gagal.

## Perubahan struktur database (penting)

Produksi memakai **migrasi**, bukan auto-push seperti dev. Setiap kali mengubah koleksi/field di kode:

```bash
npm run migrate:create nama_perubahan     # di laptop; hasilnya di src/migrations/, commit ke git
```

Jika lupa, deploy tetap jalan tapi kolom baru tidak ada di database produksi. Uji migrasi pada DB kosong lebih dulu.
(Bila `migrate:create` menggantung di prompt "dev mode", jalankan dengan `DATABASE_URL` menunjuk ke file kosong sementara dan `--force-accept-warning`.)

## Go-live (domain utama)

Ubah env: `NEXT_PUBLIC_SITE_URL=https://artic.co.id`, `ALLOW_INDEXING=true`, `NEXT_PUBLIC_DRAFT_BANNER=` (kosong), lalu deploy ulang (nilai ini dibaca saat build). Tambahkan domain di CloudPanel, arahkan DNS, terbitkan SSL, cabut Basic Auth.

## Perintah berguna

```bash
pm2 status            pm2 logs artic --lines 100      pm2 restart artic
curl -s http://127.0.0.1:3010/api/health
bash deploy/backup.sh                       # backup manual
```

**Restore database:** hentikan app (`pm2 stop artic`), salin `backups/artic-YYYY-...db` menjadi `artic.db`, jalankan lagi.
**Jangan** jalankan `SEED_RESET=1 npm run seed` setelah ada konten asli (menghapus produk dan foto).
