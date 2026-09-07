# 🎓 Saka InternHub

**Saka InternHub** adalah platform portofolio dan verifikasi magang modern yang dibangun dengan menggunakan *stack* teknologi mutakhir. Aplikasi ini dirancang untuk mewadahi mahasiswa magang dalam memamerkan karya, dokumentasi, dan sertifikat mereka yang telah diverifikasi secara resmi oleh mentor terkait.

Aplikasi ini menggunakan pendekatan **Serverless**, memungkinkan *deployment* gratis tanpa pusing memikirkan infrastruktur fisik!

---

## 🚀 Teknologi yang Digunakan

*   **Backend:** Laravel 11 (PHP 8.2+)
*   **Frontend:** React.js dengan Inertia.js (Single Page Application)
*   **Styling:** Tailwind CSS (dengan komponen modern)
*   **Database:** TiDB Serverless (MySQL Compatible)
*   **Storage (Asset/File):** Cloudinary
*   **Hosting / Deployment:** Vercel

---

## 🛠️ Panduan Instalasi Lokal (Development)

Untuk menjalankan aplikasi ini di komputer lokal, ikuti langkah-langkah berikut:

### 1. Prasyarat Sistem
Pastikan komputer Anda sudah terinstal:
*   [PHP](https://www.php.net/downloads) (Minimal versi 8.2)
*   [Composer](https://getcomposer.org/)
*   [Node.js](https://nodejs.org/) & NPM
*   [Git](https://git-scm.com/)
*   MySQL/MariaDB Lokal (seperti XAMPP/Laragon) untuk testing lokal.

### 2. Kloning Repository & Instalasi
Buka terminal dan jalankan perintah berurutan:
```bash
git clone https://github.com/MochAdriq/sakainternhub.git
cd sakainternhub

# Install dependensi Backend
composer install

# Install dependensi Frontend
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Generate *Application Key* Laravel:
```bash
php artisan key:generate
```
Sesuaikan konfigurasi database lokal Anda di dalam file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_lokal_anda
DB_USERNAME=root
DB_PASSWORD=
```
*(Catatan: Buat database kosong terlebih dahulu di phpMyAdmin/Laragon dengan nama yang sesuai).*

### 4. Migrasi & Seeding Database
Jalankan perintah ini untuk membangun struktur tabel sekaligus mengisi data (dummy) bawaan:
```bash
php artisan migrate:fresh --seed
```

### 5. Jalankan Aplikasi
Anda perlu menjalankan **dua terminal** secara bersamaan:

Terminal 1 (Menjalankan server PHP):
```bash
php artisan serve
```

Terminal 2 (Menjalankan Vite untuk React):
```bash
npm run dev
```
Buka browser dan akses **`http://localhost:8000`**.

---

## ☁️ Panduan Deployment (Serverless / Production)

Aplikasi ini sudah dikonfigurasi sepenuhnya untuk berjalan di lingkungan Serverless **Vercel**, dipadukan dengan **TiDB** dan **Cloudinary** agar 100% gratis.

### 1. Persiapan Layanan Pihak Ketiga
1.  **TiDB Serverless (Database):**
    *   Daftar di [TiDB Cloud](https://tidbcloud.com) dan buat cluster gratis (Starter).
    *   Ambil detail host, port (4000), username, dan password.
2.  **Cloudinary (Penyimpanan File):**
    *   Daftar di [Cloudinary](https://cloudinary.com).
    *   Ambil `CLOUDINARY_URL` dari Dashboard.
3.  **Vercel (Hosting Aplikasi):**
    *   Pastikan Anda sudah menginstal **Vercel CLI** (`npm i -g vercel`).

### 2. Konfigurasi Environment Vercel
Tambahkan *environment variables* berikut ke dalam pengaturan Vercel (bisa melalui web dashboard Vercel atau menggunakan perintah `vercel env add`):

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:KUNCI_APP_ANDA_DISINI

# Konfigurasi Database TiDB
DB_CONNECTION=mysql
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=username.root
DB_PASSWORD=password_tidb_anda

# Konfigurasi Cloudinary
FILESYSTEM_DISK=cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```
*(Catatan: Vercel sudah menggunakan CA Certificate bawaan, dan konfigurasi SSL TiDB sudah ditangani di `config/database.php`).*

### 3. Eksekusi Deployment
Cukup jalankan perintah ini dari terminal lokal Anda untuk melempar kode langsung ke Production Vercel:
```bash
vercel --prod --yes
```

---

## 📂 Struktur Penting
*   `api/index.php` & `vercel.json` - File vital untuk konfigurasi serverless Vercel (menggantikan Nginx/Apache).
*   `bootstrap/app.php` - Disesuaikan agar direktori temporer seperti *cache* dan *logs* di-redirect ke `/tmp/storage` khusus saat berjalan di lingkungan Vercel (karena Vercel bersifat *Read-Only*).
*   `app/Providers/AppServiceProvider.php` - Terdapat pemaksaan *scheme* HTTPS (`URL::forceScheme('https')`) untuk mengatasi error *Mixed Content* akibat Vercel Proxy.

---

> Dibuat dengan 💻 dan ☕ untuk Saka Inovasi Network.
