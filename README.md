# 🏢 Frontend Sistem Peminjaman Ruangan

Aplikasi web modern dan responsif untuk mengelola peminjaman ruangan kampus. Dibangun dengan Vanilla JavaScript, HTML5, dan CSS3, dilengkapi dengan sistem kontrol akses berbasis peran (RBAC).

## ✨ Fitur Utama

### 🔐 Autentikasi & Keamanan

- **Login & Registrasi Aman**: Autentikasi berbasis JWT.
- **Kontrol Akses Berbasis Peran (RBAC)**: Pemisahan tegas antara peran Mahasiswa, Staf, dan Admin.
- **Rute Terlindungi**: Pengalihan otomatis untuk akses yang tidak sah.

### 🎓 Fitur Mahasiswa

- **Dashboard**: Ringkasan statistik peminjaman dan aktivitas terkini.
- **Lihat Ruangan**: Melihat ruangan yang tersedia beserta detailnya (kapasitas, fasilitas).
- **Pencarian & Filter**: Mencari ruangan berdasarkan nama, kode, atau gedung.
- **Booking Ruangan**: Antarmuka modal sederhana untuk mengajukan peminjaman ruangan.
- **Peminjaman Saya**: Melacak status peminjaman (Menunggu, Disetujui, Ditolak) dan membatalkan permintaan yang masih menunggu.

### 🛡️ Fitur Admin & Staf

- **Dashboard Admin**: Statistik peminjaman keseluruhan sistem.
- **Manajemen Ruangan (CRUD)**:
  - Tambah ruangan baru dengan fasilitas.
  - Edit detail ruangan yang ada.
  - Hapus (soft-delete) ruangan.
- **Manajemen Peminjaman**:
  - Lihat semua peminjaman dalam sistem.
  - Filter berdasarkan status (Menunggu, Disetujui, Ditolak, dll).
  - **Alur Persetujuan/Penolakan**: Tinjau permintaan peminjaman dengan opsi alasan penolakan.

## 🛠️ Teknologi yang Digunakan

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Arsitektur**: Single Page Application (SPA) dengan Router kustom
- **Styling**: Variabel CSS Kustom, Flexbox/Grid (Tanpa framework)
- **API**: Fetch API untuk komunikasi dengan Backend .NET Core

## 📁 Struktur Proyek

```bash
booking-room-fe/
├── index.html              # Entry point utama
├── assets/
│   ├── css/
│   │   ├── main.css        # Variabel global & reset
│   │   └── components.css  # Komponen UI yang dapat digunakan kembali
│   └── js/
│       ├── app.js          # Logika aplikasi utama & navigasi
│       ├── router.js       # Routing sisi klien
│       ├── auth.js         # Layanan autentikasi
│       ├── api.js          # Pembungkus (wrapper) klien API
│       ├── config.js       # Konfigurasi aplikasi
│       └── pages/          # Pengontrol halaman (controllers)
│           ├── home.js
│           ├── login.js
│           ├── register.js
│           ├── dashboard.js
│           ├── rooms.js    # Penjelajahan ruangan mahasiswa
│           ├── bookings.js # Manajemen booking mahasiswa
│           └── admin.js    # Fitur panel admin
```

## 🚀 Memulai (Getting Started)

### Prasyarat

- Browser web modern.
- Backend API berjalan di `http://localhost:5001`.

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/Fairanova/2026-room-booking-frontend.git
   cd booking-room-fe
   ```

2. **Jalankan aplikasi**
   Anda dapat menggunakan server file statis apa pun. Contoh:

   **Menggunakan Python:**

   ```bash
   python -m http.server 8000
   ```

   **Menggunakan Node.js (http-server):**

   ```bash
   npx http-server
   ```

   **VS Code Live Server:**
   Buka index.html dan klik "Go Live".

3. **Akses Aplikasi**
   Buka `http://localhost:8000` (atau port server Anda) di browser.

## 🔧 Konfigurasi

Endpoint API dikonfigurasi di `assets/js/config.js`.
URL API Default: `http://localhost:5001/api`

## 👥 Peran Pengguna (Kredensial Demo)

| Peran (Role)  | Username     | Password     | Akses                |
| ------------- | ------------ | ------------ | -------------------- |
| **Admin**     | `admin`      | `Admin123`   | Kontrol Sistem Penuh |
| **Staf**      | `staff001`   | `Staff123`   | Fitur Admin          |
| **Mahasiswa** | `student001` | `Student123` | Fitur Booking        |
