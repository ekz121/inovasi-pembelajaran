# RENCANA PROJECT LENGKAP: SISTEM PREDIKSI PERFORMA AKADEMIK (ACADPREDICT)

Dokumen ini disusun sebagai panduan komprehensif untuk tim pengembang yang terdiri dari 14 mahasiswa pemula untuk melanjutkan dan menyempurnakan project "AcadPredict".

---

## === DAFTAR ANGGOTA TIM & ROLE ===

| No | Nama | Role | Branch Git |
|:---:|:---|:---|:---|
| 1 | **Yoram** | Project Manager & QA | `main` / `dev` |
| 2 | **Aira** | Project Manager & QA | `main` / `dev` |
| 3 | **Nayli** | Frontend UI Specialist | `feat/frontend-ui` |
| 4 | **Luqman** | Frontend UI Specialist | `feat/frontend-ui` |
| 5 | **Sherly** | Frontend UI Specialist | `feat/frontend-ui` |
| 6 | **Rafly** | Frontend Logic & API | `feat/frontend-logic` |
| 7 | **Intan** | Frontend Logic & API | `feat/frontend-logic` |
| 8 | **Vian** | Frontend Logic & API | `feat/frontend-logic` |
| 9 | **Isna** | Backend API Specialist | `feat/backend-api` |
| 10 | **Belqis** | Backend API Specialist | `feat/backend-api` |
| 11 | **Evrina** | Backend API Specialist | `feat/backend-api` |
| 12 | **Bagas** | Data & Logic Specialist | `feat/data-logic` |
| 13 | **Safira** | Data & Logic Specialist | `feat/data-logic` |
| 14 | **Zein** | Data & Logic Specialist | `feat/data-logic` |

---

## === BAGIAN 1: ANALISA PROJECT ===

### 1. Fungsi Utama Web
Web ini berfungsi sebagai **Sistem Pendukung Keputusan Akademik**. Mahasiswa dapat melihat histori nilai mereka, tren perkembangan IPK, dan yang paling utama: **mendapatkan prediksi IPS (Indeks Prestasi Semester) untuk semester berikutnya**. Web ini membantu mahasiswa memilih beban SKS yang tepat melalui simulasi interaktif.

### 2. Teknologi yang Digunakan
- **Backend:** Python dengan Framework **FastAPI**.
- **Frontend:** JavaScript dengan Library **React.js** (Vite).
- **Styling:** **Tailwind CSS** untuk tampilan modern dan responsif.
- **Visualisasi Data:** **Recharts** untuk grafik tren IPK.
- **Database:** Flat-file **JSON** (`students.json`) sebagai penyimpan data mahasiswa.
- **Ikon:** **Lucide React**.

### 3. Fitur yang Sudah Ada
- **Dashboard Mahasiswa:** Ringkasan profil dan histori nilai.
- **Grafik Tren IPK:** Visualisasi perkembangan nilai dari semester 1.
- **Prediksi Otomatis:** Perhitungan estimasi nilai semester depan berdasarkan tren masa lalu.
- **Skenario SKS:** Perbandingan otomatis beban 18, 20, 22, dan 24 SKS.
- **Interactive Course Selector:** Fitur pilih-pilih matakuliah pilihan untuk melihat dampaknya langsung ke prediksi IPK.

### 4. Fitur "Tersembunyi" (Logic ada, tapi belum maksimal di UI)
- **Validasi Prasyarat:** Backend sudah punya fungsi `validate_prerequisites`, tapi UI belum menampilkan peringatan jika mahasiswa mengambil matkul yang prasyaratnya belum lulus.
- **Data Kurikulum Luas:** Kurikulum tersedia untuk 4 prodi (TI, AK, TM, AP) hingga semester 6, namun saat ini data mahasiswa contoh lebih banyak fokus di semester 3-4.

---

## === BAGIAN 2: ROLE TIM (14 MAHASISWA PEMULA) ===

Strategi pembagian role ini dirancang agar setiap mahasiswa memiliki fokus belajar yang jelas dan tidak tumpang tindih.

### 1. Frontend UI Specialist (3 Orang)
- **File Fokus:** `frontend/src/components/*.jsx`, `frontend/src/index.css`.
- **Jobdesk:** Merapikan layout, memastikan tampilan bagus di HP, memperbaiki warna dan tipografi.
- **Skill & Tutorial:** HTML/CSS Dasar, Tailwind CSS ([Tutorial Tailwind](https://www.youtube.com/watch?v=D6Z9H_YpI3U)).
- **Step-by-Step:** Mulai dengan mengubah warna-warna di `Dashboard.jsx`, lalu buat komponen baru untuk kartu peringatan prasyarat.

### 2. Frontend Logic & API Specialist (3 Orang)
- **File Fokus:** `frontend/src/pages/*.jsx`, `frontend/src/api/client.js`.
- **Jobdesk:** Menghubungkan data dari backend ke tampilan, mengurus fungsi *search* dan *filter* mahasiswa.
- **Skill & Tutorial:** React Hooks (useState, useEffect), Axios ([Tutorial React API](https://www.youtube.com/watch?v=00lxm_doFYw)).
- **Step-by-Step:** Pelajari cara `getPredict` bekerja, lalu tambahkan logika untuk menampilkan daftar matkul yang tidak bisa diambil karena prasyarat.

### 3. Backend API Specialist (3 Orang)
- **File Fokus:** `backend/main.py`, `backend/students.json`.
- **Jobdesk:** Membuat endpoint API baru (misal: tambah mahasiswa baru), mengurus database JSON agar tetap konsisten.
- **Skill & Tutorial:** Python Dasar, FastAPI ([Tutorial FastAPI](https://www.youtube.com/watch?v=tLKKmouUoms)).
- **Step-by-Step:** Tambahkan endpoint `POST /api/student` untuk pendaftaran mahasiswa baru ke `students.json`.

### 4. Data & Logic Specialist (3 Orang)
- **File Fokus:** `backend/utils/*.py`.
- **Jobdesk:** Memperbaiki algoritma prediksi agar lebih akurat, menambah data matkul di kurikulum, membuat generator data mahasiswa yang lebih banyak.
- **Skill & Tutorial:** Algoritma Dasar, Logika Matematika ([Tutorial Python Logic](https://www.youtube.com/watch?v=rfscVS0vtbw)).
- **Step-by-Step:** Ubah formula di `predictor.py` untuk mempertimbangkan rata-rata nilai seangkatan secara lebih detail.

### 5. Project Manager & QA (2 Orang)
- **Bagian Fokus:** Semua file (Review), Dokumentasi.
- **Jobdesk:** Mengatur jadwal, mencoba semua fitur (testing), memastikan tidak ada error (bug), dan membuat slide presentasi.
- **Skill & Tutorial:** Git & GitHub ([Tutorial Git](https://www.youtube.com/watch?v=lTMZxWMjXQU)).
- **Step-by-Step:** Buat akun GitHub untuk tim, kumpulkan kode dari semua orang, dan buat daftar error yang ditemukan untuk diperbaiki tim.

---

## === BAGIAN 3: METODE PENGEMBANGAN ===

### Metode: **Scrum Sederhana**
Metode ini paling cocok karena membagi pekerjaan dalam siklus pendek (Sprint).

**Cara Implementasi:**
1. **Daily Standup:** Setiap pagi, tim ngobrol 10 menit. Bahas: Kemarin ngerjain apa? Hari ini mau ngerjain apa? Ada kendala apa?
2. **Sprint (2 Mingguan):** Setiap 2 minggu, tim harus punya hasil yang bisa didemo-kan (misal: Minggu 2 sudah bisa nambah mahasiswa).

**Tools Kolaborasi:**
- **Git/GitHub:** Wajib untuk berbagi kode. Mahasiswa pemula harus belajar `git commit` dan `git push`.
- **WhatsApp Group:** Komunikasi cepat.
- **Trello:** Untuk mencatat daftar tugas (To Do, Doing, Done).

---

## === BAGIAN 4: TIMELINE 8 MINGGU ===

Setiap minggu memiliki target dan risiko yang harus dikelola.

### Minggu 1-2: Setup & Analisa (Fase Perkenalan)
- **Target:** Semua tim bisa menjalankan project di laptop masing-masing.
- **Jadwal Harian:**
  - **Senin-Selasa:** PM Setup Repo & invite member. Semua anggota install Python, Node.js, dan Clone project.
  - **Rabu-Kamis:** Eksplorasi file. Frontend coba ubah teks di Landing Page. Backend coba jalankan `main.py`.
  - **Jumat:** Review Bersama: Pastikan 14 orang sudah bisa "Run" project tanpa error.
- **Risiko:** Anggota kesulitan install environment.
- **Antisipasi:** Tim PM membuat panduan instalasi tertulis dan membantu via Remote Desktop jika perlu.

### Minggu 3-4: Desain & Database (Fase Fondasi)
- **Target:** Database mahasiswa lebih lengkap dan UI lebih rapi.
- **Jadwal Harian:**
  - **Senin-Selasa:** Data Specialist generate data JSON. UI Specialist bikin mock-up warna baru di Tailwind.
  - **Rabu-Kamis:** API Specialist bikin endpoint filter prodi. Logic Frontend hubungkan filter ke UI.
  - **Jumat:** Review Bersama: Demo fitur filter mahasiswa dan tampilan dashboard baru.
- **Risiko:** Struktur JSON rusak saat generate data banyak.
- **Antisipasi:** Selalu backup `students.json` asli sebelum melakukan perubahan massal.

### Minggu 5-6: Development Core (Fase Inti)
- **Target:** Fitur prediksi dan interaksi matkul sempurna.
- **Jadwal Harian:**
  - **Senin-Selasa:** Backend Logic fokus ke `validate_prerequisites`. Frontend UI bikin komponen Modal/Pop-up peringatan.
  - **Rabu-Kamis:** Integrasi: UI menampilkan matkul yang terkunci. API Specialist bikin fitur simpan profil.
  - **Jumat:** Review Bersama: Demo simulasi pilih matkul dengan validasi prasyarat yang aktif.
- **Risiko:** Logika prasyarat terlalu rumit sehingga menyebabkan "Infinite Loop" atau lemot.
- **Antisipasi:** Gunakan data kecil dulu untuk testing sebelum menggunakan kurikulum lengkap.

### Minggu 7: Integrasi & Testing (Fase Poles)
- **Target:** Bebas bug dan siap pakai.
- **Jadwal Harian:**
  - **Senin-Selasa:** QA melakukan testing ekstrem (input asal-asalan). Catat semua bug di Trello.
  - **Rabu-Kamis:** Semua role fokus memperbaiki bug yang ditemukan QA (Bug Fixing Days).
  - **Jumat:** Review Bersama: Final check semua fitur utama.
- **Risiko:** Ditemukan bug fatal di akhir minggu.
- **Antisipasi:** Fokus pada fitur utama (Prediksi & Pilih Matkul), fitur tambahan bisa dinonaktifkan jika belum stabil.

### Minggu 8: Finalisasi & Demo (Fase Selebrasi)
- **Target:** Presentasi ke Dosen.
- **Jadwal Harian:**
  - **Senin-Selasa:** Pembuatan Slide Presentasi & Video Demo. Latihan bicara.
  - **Rabu-Kamis:** Simulasi Demo (Gladi Resik) di depan teman-teman sendiri.
  - **Jumat:** Demo Final ke Dosen.
- **Risiko:** Gugup atau kendala teknis (laptop mati/internet putus) saat demo.
- **Antisipasi:** Siapkan video demo sebagai cadangan jika live demo gagal, dan siapkan 2 laptop cadangan.

---

## === BAGIAN 5: SARAN KHUSUS PEMULA ===

### Kesalahan Umum & Cara Menghindarinya:
1. **Takut Salah:** Jangan takut merusak kode. Git punya fitur "revert" untuk kembali ke versi sebelumnya.
2. **Tidak Komunikasi:** Jika bingung, tanya teman atau PM. Jangan diam sampai deadline.
3. **Copy-Paste Tanpa Paham:** Boleh cari solusi di Google/ChatGPT, tapi pastikan kamu paham setiap baris kodenya.

### Cara Presentasi yang Meyakinkan:
- **Fokus pada Masalah:** "Banyak mahasiswa telat lulus karena salah ambil matkul. Web ini solusinya."
- **Tunjukkan Visual:** Tampilkan grafik Recharts yang keren saat presentasi.
- **Jelaskan Simulasi:** Tunjukkan langsung fitur pilih-pilih matkul dan bagaimana prediksi IPK berubah secara *real-time*.

### Prioritas Fitur:
- **Paling Mudah:** Mengubah warna UI dan teks, menambah data mahasiswa di JSON.
- **Paling Sulit:** Logika prasyarat matkul dan sinkronisasi grafik Recharts. Berikan perhatian ekstra dan bantuan tim di bagian ini.

---

## === BAGIAN 6: PANDUAN GIT (GIT FLOW) ===

Untuk tim 14 pemula, kita gunakan alur kerja yang sangat sederhana agar tidak terjadi konflik kode.

### 1. Nama Branch (Cabang)
Setiap role bekerja di branch masing-masing:
- `main` : Kode final yang sudah stabil (Hanya PM yang boleh sentuh).
- `dev` : Tempat kumpul kode semua orang untuk dites.
- `feat/frontend-ui` : Khusus tim UI.
- `feat/frontend-logic` : Khusus tim Logic Frontend.
- `feat/backend-api` : Khusus tim API.
- `feat/data-logic` : Khusus tim Data & Prediksi.

### 2. Kapan Harus Commit & Push?
- **Setiap kali fitur kecil selesai** (Misal: Selesai ganti warna button). Jangan tunggu 1 hari baru commit.
- **Sebelum pulang/istirahat**, pastikan kode sudah di-push ke GitHub agar tidak hilang jika laptop rusak.

### 3. Alur Pull Request (PR) yang Benar
1. Kamu selesai kerja di branch `feat/xxx`.
2. Lakukan `git push`.
3. Buka GitHub, klik **"New Pull Request"**.
4. Target PR adalah dari branch kamu ke branch `dev`.
5. PM akan melakukan **Review** (ngecek kode kamu). Jika OK, baru di-Merge.

### 4. Contoh Pesan Commit yang Baik
Gunakan bahasa yang jelas:
- `feat: menambah warna indigo pada dashboard` (Bagus)
- `fix: memperbaiki error perhitungan IPK` (Bagus)
- `update: edit file` (Buruk - tidak jelas apa yang diedit)
- `ajksdhakjdh` (Sangat Buruk)

---
*Simpan dokumen ini baik-baik. Ini adalah peta jalan kesuksesan project kalian!*
