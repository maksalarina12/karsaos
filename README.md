# ⚡ KarsaOS | Asisten Keuangan & Strategi Bisnis UMKM

<div align="center">

![KarsaOS Logo](/public/karsaos.png)

**Sistem Informasi Keuangan, Analisis Arus Kas, & Asisten Strategi Operasional UMKM Berbasis AI**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

</div>

---

## 📌 Apa itu KarsaOS?

**KarsaOS** (*Karsa Operating System*) adalah platform analisis keuangan dan asisten strategi operasional modern yang dirancang khusus untuk pemilik **UMKM dan Warung di Indonesia**. 

Mencatat pembukuan harian seringkali menyita waktu dan rumit bagi pemilik usaha kecil. **KarsaOS memecahkan masalah ini** dengan menghadirkan pencatatan transaksi berbasis cerita dan suara (*Voice-to-Journal*), analisis laba/rugi otomatis, serta rekomendasi strategi berbasis data yang langsung dapat dieksekusi.

Dengan KarsaOS, pemilik usaha hanya perlu menceritakan penjualan harian mereka (contoh: *"Laku nasi goreng 3 porsi 45rb, beli minyak 20rb"*), dan sistem akan secara otomatis mengesktrak nominal, mengategorikan jurnal keuangan, menghitung margin profit, serta memberikan saran mitigasi risiko secara *real-time*.

---

## ✨ Fitur-Fitur Unggulan

### 🎙️ 1. Pencatatan Transaksi Lewat Suara & Teks (*Voice-to-Journal*)
- **Integrasi Web Speech API (`id-ID`)**: Bicara langsung dalam bahasa Indonesia sehari-hari untuk mencatat transaksi tanpa perlu mengisi form manual yang rumit.
- **Ekstraksi Nominal Cerdas**: Mendukung berbagai format pengucapan nominal angka Indonesia seperti `"45rb"`, `"150 ribu"`, `"1,5jt"`, hingga ekspresi jumlah barang (cth: *"3 porsi"*).
- **Auto-Commit dengan Penjadwalan Undo**: Hasil ekstraksi AI ditampilkan dalam bentuk konfirmasi interaktif dengan hitung mundur otomatis 5 detik untuk fleksibilitas pembatalan.

### 📊 2. Laporan Keuangan Bento Grid Real-Time
- **Metrik Utama Usaha**: Pantau Total Omzet, Total Pengeluaran, Laba/Rugi Bersih, dan Persentase Margin Profit dalam tata letak *Executive Bento Grid*.
- **Jurnal Transaksi Interaktif**: Tabel terminal data-padat yang dilengkapi pencarian instan, filter kategori, edit nama/nominal langsung (*inline editing*), serta penghapusan entri yang halus.
- **Visualisasi Animasi Angka**: Menggunakan counter teranimasi yang aman bagi aksesibilitas (*reduced motion support*).

### 💡 3. Rekomendasi Strategi & Mitigasi Risiko (*Business Briefs*)
- **Kartu Strategi Operasional**: Menyajikan 3 kategori rekomendasi berprioritas tinggi:
  - 🟢 **Peluang Pertumbuhan** (*Opportunity*)
  - 🔴 **Risiko Operasional & Margin** (*Risk*)
  - 🟡 **Insight Operasional** (*Strategic Insight*)
- **Detail Proyeksi Dampak**: Dilengkapi accordion analisis akar masalah (*root cause analysis*) dan proyeksi dampak finansial konkret.
- **Eksekusi 1-Klik**: Terapkan saran atau selesaikan mitigasi risiko dengan animasi perayaan *confetti*.

### 🤖 4. Ask Karsa (Asisten AI Strategi Finansial)
- **Chatbot Analisis Keuangan**: Tanyakan kondisi bisnis Anda kapan saja (cth: *"Kenapa margin turun?"*, *"Apakah aman beli stok hari ini?"*).
- **Perhitungan Deterministik**: Jawaban AI didasarkan 100% pada matematika data transaksi aktual bisnis Anda, menjamin zero-hallucination.

### ☀️/🌙 5. Tema Light & Dark Mode Safe Hydration
- **Perpindahan Tema Mulus**: Didukung oleh `next-themes` dan Tailwind CSS v4 dengan transisi ikon `Sun` & `Moon` teranimasi.
- **Bebas Layout Shift & Hydration Mismatch**: Dilengkapi perlindungan `mounted` state untuk memastikan render awal *Light Mode* (Cerah) yang konsisten tanpa FOUC (*Flash of Unstyled Content*).

### 🔒 6. Perlindungan Privasi Data 100% Lokal
- **Offline-First Architecture**: Semua data transaksi dan jurnal tersimpan dengan aman di `localStorage` browser pengguna menggunakan *Repository Pattern*. Data bisnis Anda tidak pernah diunggah atau dijual ke pihak ketiga.

---

## 🛠️ Teknologi & Stack Utama

- **Core Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router & Turbopack)
- **UI & View**: [React 19](https://react.dev/)
- **Styling System**: [Tailwind CSS v4](https://tailwindcss.com/) & `tw-animate-css`
- **Theme Engine**: [`next-themes`](https://github.com/pacocoursey/next-themes)
- **Animation & Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Visual Effects**: `canvas-confetti`
- **Type Safety**: [TypeScript 5.7](https://www.typescriptlang.org/)

---

## 🚀 Panduan Memulai (*Getting Started*)

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js (v18+)** dan **npm** / **pnpm** / **yarn** pada perangkat Anda.

### 2. Kloning Repository
```bash
git clone https://github.com/maksalarina12/karsaos.git
cd karsaos
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Menjalankan Server Pengembang (*Development Mode*)
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 5. Membangun Produk untuk Produksi (*Production Build*)
```bash
npm run build
npm run start
```

---

## 📋 Catatan Penting (*Important Notes*)

> [!NOTE]
> **Dukungan Perekaman Suara (Web Speech API)**  
> Fitur rekam suara (*Voice-to-Journal*) mengandalkan API bawaan browser `SpeechRecognition`. Untuk pengalaman terbaik, gunakan browser berbasis Chromium seperti **Google Chrome**, **Microsoft Edge**, atau **Brave**.

> [!TIP]
> **Uji Coba Cepat (Demo Seed Data)**  
> Anda dapat langsung menekan tombol **"⚡ Muat Contoh Data Warung"** di bagian navigasi atas untuk memuat 7 hari sampel transaksi dan rekomendasi strategi siap pakai secara instan.

> [!IMPORTANT]
> **Jaminan Keamanan Build & Type Safety**  
> Proyek ini telah melalui audit kode 360-derajat dengan jaminan `0 TypeScript errors` (`npx tsc --noEmit`) dan `0 Hydration Mismatches`.

---

## 📄 Lisensi

Proyek KarsaOS dirilis di bawah lisensi [MIT License](LICENSE).

<div align="center">
  <sub>Dikembangkan dengan ❤️ untuk kemajuan UMKM Indonesia.</sub>
</div>
