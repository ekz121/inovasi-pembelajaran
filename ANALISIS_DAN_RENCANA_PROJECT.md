# Analisis dan Rencana Pengembangan Sistem Prediksi Akademik ("Calude")

Dokumen ini berisi analisis teknis terhadap sistem yang ada, penjelasan metodologi pengembangan, dan simulasi manajemen proyek untuk tim beranggotakan 14 orang mahasiswa.

---

## 1. Analisis Sistem Prediksi (Technical Audit)

Berdasarkan pemeriksaan kode sumber (`backend/utils/predictor.py` dan `data_generator.py`), berikut adalah kesimpulan mengenai kebenaran dan cara kerja sistem prediksi saat ini:

### Cara Kerja Algoritma Saat Ini
Sistem saat ini **TIDAK** menggunakan *Machine Learning* (ML) atau *Artificial Intelligence* (AI) yang sesungguhnya (seperti Regresi Linear, Random Forest, atau Neural Networks). Sistem ini menggunakan pendekatan **Heuristik Deterministik**.

*   **Logika Dasar:** Prediksi nilai mata kuliah dihitung dari:
    *   `Base IPK` (IPK saat ini).
    *   `Trend` (Apakah nilai semester terakhir naik/turun dibanding sebelumnya).
    *   `Difficulty Adjustment` (Mata kuliah Wajib dianggap lebih susah -0.05, Pilihan lebih mudah +0.05).
    *   **Variasi Random:** Ditambahkan angka acak antara -0.3 sampai +0.3.
*   **Fake Determinism:** "Random" yang digunakan dipaku (seeded) menggunakan NIM mahasiswa.
    *   *Artinya:* Jika mahasiswa dengan NIM yang sama menekan tombol prediksi 100 kali, hasilnya akan selalu sama. Ini bagus untuk UX (konsisten), tapi secara ilmiah ini bukan prediksi cerdas.

### Apakah Benar/Valid?
*   **Secara Fungsional:** **YA**. Kode berjalan tanpa error dan menghasilkan angka yang masuk akal (range 0.0 - 4.0).
*   **Secara Ilmiah/Statistik:** **KURANG AKURAT**. Sistem ini hanya melakukan *ekstrapolasi linear* sederhana. Sistem tidak "belajar" dari pola data historis kakak tingkat. Contoh: Jika mata kuliah "Kalkulus" secara statistik membunuh nilai 90% mahasiswa, sistem ini tidak tahu itu. Ia hanya menebak berdasarkan IPK rata-rata si mahasiswa tersebut.

---

## 2. Metodologi Pengembangan

Untuk tim berjumlah **14 orang** dengan status mahasiswa (waktu terbatas, tujuan belajar), metode **Waterfall murni sangat berisiko** karena jika ada kesalahan di awal, baru ketahuan di akhir semester.

Metode yang disarankan: **Agile Scrum (Modified for Large Teams)**.

### Mengapa Agile Scrum?
1.  **Iteratif:** Kita bisa merilis fitur "Login & Dashboard" di bulan pertama, lalu "Prediksi" di bulan kedua. Dosen bisa melihat progress nyata setiap 2 minggu.
2.  **Fleksibel:** Jika rumus prediksi ternyata terlalu sulit, tim bisa menyederhanakannya tanpa merusak seluruh jadwal.
3.  **Kolaboratif:** Memaksa komunikasi antar Frontend, Backend, dan Data.

---

## 3. Simulasi Project (Team of 14)

Mengelola 14 orang itu sulit (terlalu banyak untuk 1 tim Scrum standar). Kita harus memecahnya menjadi **Squads** atau membagi Role secara spesifik agar tidak ada yang "gabut".

### A. Struktur Tim & Role
| Divisi | Role | Jumlah | Tanggung Jawab Utama |
| :--- | :--- | :---: | :--- |
| **Management** | **Project Manager (PM)** | 1 | Mengawasi timeline, memimpin rapat, laporan ke Dosen. |
| **Product** | **System Analyst / Product Owner** | 2 | Menulis SRS/User Stories, mendesain database, alur logika bisnis. |
| **Design** | **UI/UX Designer** | 2 | Membuat Wireframe & High-Fidelity Design (Figma), aset grafis. |
| **Engineering** | **Frontend Dev** | 4 | Coding React/Vue, integrasi API. (Dibagi: 2 Dashboard, 2 Landing/Profile). |
| **Engineering** | **Backend Dev** | 3 | Coding API (FastAPI/Express), Database, Authentication. |
| **Data** | **AI/Data Engineer** | 1 | Meriset algoritma prediksi yang valid (bukan sekedar if-else), Python Pandas/Scikit-Learn. |
| **Quality** | **QA / Tester** | 1 | Manual testing, membuat skenario test, memastikan tidak ada bug sebelum demo. |
| **Total** | | **14** | |

### B. Timeline (1 Semester / 16 Minggu)

Kita bagi menjadi 4 Sprint (Siklus) utama.

#### **Fase 1: Inisiasi & Desain (Minggu 1-4)**
*   **Minggu 1-2 (Analisis):**
    *   *Analyst:* Wawancara mahasiswa/dosen, buat Flowchart.
    *   *PM:* Setup repository Git, Trello/Jira.
*   **Minggu 3-4 (Desain):**
    *   *UI/UX:* Selesai mockup Figma (Login, Dashboard, Tabel Nilai).
    *   *Data:* Kumpul data nilai alumni (anonim) untuk melatih model prediksi.
    *   *Dev:* Setup environment (Install React, Python, Database).

#### **Fase 2: Core Development - MVP (Minggu 5-8)**
*   **Target:** User bisa Login dan melihat Data Historis Nilai (Belum ada prediksi).
*   *Backend:* Buat API CRUD Mahasiswa & Auth.
*   *Frontend:* Slicing design Login & Dashboard.
*   *QA:* Test Login berhasil/gagal.

#### **Fase 3: Fitur Cerdas (Minggu 9-12)**
*   **Target:** Fitur Prediksi & Rekomendasi SKS selesai.
*   *Data Engineer:* Implementasi Regresi Linear / Random Forest di Python. Integrasi ke Backend.
*   *Frontend:* Buat visualisasi grafik (Chart.js/Recharts) untuk tren nilai.
*   *Backend:* Integrasi logika `predictor.py` yang baru.

#### **Fase 4: Finalisasi & Demo (Minggu 13-16)**
*   **Minggu 13-14 (Polishing):**
    *   Perbaiki bug, perhalus animasi UI, pastikan responsif di HP.
*   **Minggu 15 (UAT):**
    *   Test oleh pengguna luar (teman kelas lain).
*   **Minggu 16 (Release):**
    *   Presentasi ke Dosen.
    *   Dokumentasi final (Laporan).

---

## 4. Kunci Sukses (Agar Nilai A)

Agar web ini sukses besar dan terlihat profesional di mata Pak Angga:

1.  **Git Flow yang Rapi:**
    *   JANGAN coding di branch `main`.
    *   Setiap fitur punya branch sendiri (contoh: `feature/login-page`, `feature/prediction-logic`).
    *   PM harus me-review code (Pull Request) sebelum merge.

2.  **Gunakan Data Riil (Dummy tapi Realistis):**
    *   Jangan input data asal-asalan "asdfgh". Buat script generator data (seperti `data_generator.py` yang sudah ada tapi diperbanyak) agar saat didemo grafiknya terlihat cantik.

3.  **Algoritma yang "Jual Mahal":**
    *   Meskipun aslinya mungkin sederhana, gunakan istilah keren di presentasi: *"Kami menggunakan Weighted Moving Average dengan normalisasi SKS untuk memprediksi IPK."*

4.  **UI adalah Raja:**
    *   Dosen/Pengguna melihat kulitnya dulu. Pastikan UI modern, bersih, padding konsisten, dan tidak kaku (gunakan TailwindCSS dengan benar).

5.  **Dokumentasi API (Swagger):**
    *   Karena Backend dan Frontend orangnya beda, pakai Swagger (bawaan FastAPI sudah ada di `/docs`) agar Frontend tidak bingung cara panggil API.
