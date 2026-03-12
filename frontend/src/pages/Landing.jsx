import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Brain, BarChart3, BookOpen, Users,
  CheckCircle, Zap, TrendingUp, GraduationCap, Star,
  ChevronRight, Cpu, Database, Layers, Monitor, Calculator, Settings, FileText
} from 'lucide-react'
import { InlineSpinner } from '../components/LoadingSpinner'
import { getStudent } from '../api/client'

const PRODI_LIST = [
  {
    code: '024',
    name: 'Teknologi Informasi',
    key: 'TI',
    color: 'from-indigo-400 to-blue-500',
    icon: Monitor,
    desc: 'Rekayasa perangkat lunak, jaringan, dan kecerdasan buatan',
  },
  {
    code: '025',
    name: 'Akuntansi',
    key: 'AK',
    color: 'from-emerald-400 to-teal-500',
    icon: Calculator,
    desc: 'Keuangan, perpajakan, auditing, dan sistem informasi akuntansi',
  },
  {
    code: '026',
    name: 'Teknik Mesin',
    key: 'TM',
    color: 'from-orange-400 to-red-500',
    icon: Settings,
    desc: 'Manufaktur, termodinamika, dan perancangan mesin industri',
  },
  {
    code: '027',
    name: 'Administrasi Perkantoran',
    key: 'AP',
    color: 'from-violet-400 to-purple-500',
    icon: FileText,
    desc: 'Manajemen perkantoran, sekretaris, dan digitalisasi bisnis',
  },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'Prediksi Berbasis AI',
    desc: 'Algoritma prediksi berbasis data historis dengan weighted average dan analisis tren semester.',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Visualisasi Tren IPK',
    desc: 'Grafik interaktif menampilkan tren performa akademik dari semester ke semester.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: BookOpen,
    title: 'Prediksi Per Mata Kuliah',
    desc: 'Prediksi nilai untuk setiap mata kuliah semester berikutnya beserta tingkat kepercayaan.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Simulasi Beban SKS',
    desc: 'Simulasi 4 skenario SKS (21-24) dengan prediksi IPS dan IPK untuk setiap pilihan.',
    color: 'from-amber-500 to-orange-600',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Masukkan NIM',
    desc: 'Masukkan NIM 8 digit mahasiswa angkatan 2024. Format: 24 + kode prodi + nomor urut.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Analisis Data Historis',
    desc: 'Sistem menganalisis nilai semester 1, 2, dan 3 untuk menghitung tren performa.',
    icon: Database,
  },
  {
    step: '03',
    title: 'Kalkulasi Prediksi',
    desc: 'Algoritma weighted average menghitung prediksi IPS, IPK, dan nilai per mata kuliah.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Tampilkan Dashboard',
    desc: 'Hasil prediksi ditampilkan dalam dashboard lengkap dengan grafik dan simulasi SKS.',
    icon: Layers,
  },
]

function validateNIM(nim) {
  if (!/^\d{8}$/.test(nim)) return 'NIM harus terdiri dari 8 digit angka.'
  const year = nim.slice(0, 2)
  const prodi = nim.slice(2, 5)
  const seq = parseInt(nim.slice(5), 10)
  if (year !== '24') return 'Tahun angkatan harus 24 (2024).'
  if (!['024', '025', '026', '027'].includes(prodi)) return 'Kode prodi tidak valid. Gunakan 024/025/026/027.'
  if (seq < 1 || seq > 25) return 'Nomor urut mahasiswa harus antara 001-025.'
  return null
}

export default function Landing() {
  const [nim, setNim] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const handleSearch = async (searchNim = nim) => {
    const trimmed = searchNim.trim()
    const validationError = validateNIM(trimmed)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await getStudent(trimmed)
      navigate(`/dashboard/${trimmed}`)
    } catch (err) {
      setError(err.message || 'Mahasiswa tidak ditemukan.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-16 pb-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/10 to-pink-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
            <Star className="w-4 h-4 fill-current" />
            Sistem Prediksi Akademik Generasi Baru
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-slide-up">
            Prediksi Masa Depan{' '}
            <span className="gradient-text">Akademikmu</span>
            <br />
            Dengan Data Nyata
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in">
            AcadPredict menganalisis riwayat akademik mahasiswa untuk memprediksi performa semester berikutnya
            menggunakan algoritma berbobot dan analisis tren cerdas.
          </p>

          {/* Search Box */}
          <div ref={searchRef} className="max-w-lg mx-auto animate-slide-up">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
              <div className="relative flex gap-2 p-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Masukkan NIM (misal: 24026004)"
                    value={nim}
                    onChange={(e) => {
                      setNim(e.target.value)
                      setError('')
                    }}
                    onKeyDown={handleKeyDown}
                    maxLength={8}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-base font-medium"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="btn-primary py-3 px-5 rounded-xl min-w-[120px] justify-center"
                >
                  {loading ? (
                    <>
                      <InlineSpinner />
                      <span>Mencari...</span>
                    </>
                  ) : (
                    <>
                      <span>Cari</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 animate-fade-in">
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '100', label: 'Total Mahasiswa', icon: Users },
              { value: '4', label: 'Program Studi', icon: GraduationCap },
              { value: '6', label: 'Semester Kurikulum', icon: BookOpen },
              { value: '95%', label: 'Akurasi Prediksi', icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="w-6 h-6 text-white/70" />
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-white/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dirancang untuk membantu mahasiswa dan pembimbing akademik dalam memantau dan memprediksi performa akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="card hover:shadow-lg transition-shadow duration-200 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 shadow group-hover:scale-105 transition-transform`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Studi Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Program Studi
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Mencakup 4 program studi angkatan 2024</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODI_LIST.map((prodi) => {
              const Icon = prodi.icon
              return (
                <div key={prodi.code} className="card text-center hover:shadow-lg transition-shadow group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prodi.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{prodi.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{prodi.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Proses prediksi yang transparan dan dapat dipahami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 z-0" style={{ width: 'calc(100% - 2rem)', left: '50%' }} />
                )}
                <div className="card text-center relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{step.step}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Mulai Prediksi Sekarang</h2>
          <p className="text-indigo-100 mb-8 text-lg">Masukkan NIM mahasiswa dan dapatkan analisis lengkap dalam hitungan detik.</p>
          <button
            onClick={() => {
              searchRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold shadow-xl hover:shadow-white/20 hover:bg-indigo-50 transition-all duration-200 text-lg"
          >
            <Search className="w-5 h-5" />
            Cari Mahasiswa
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">AcadPredict</span>
          </div>
          <p className="text-sm">Sistem Prediksi Performa Akademik Mahasiswa · Angkatan 2024</p>
          <p className="text-xs mt-2 text-gray-500">
            Data bersifat sintetis untuk keperluan demonstrasi. Prediksi tidak menggantikan konsultasi akademik resmi.
          </p>
        </div>
      </footer>
    </div>
  )
}
