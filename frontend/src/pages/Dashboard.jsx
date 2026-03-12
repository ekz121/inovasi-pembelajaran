import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, RefreshCw, AlertCircle, TrendingUp, TrendingDown,
  Minus, Target, MessageSquare, Calendar, Award, Info,
  CheckSquare, Square, RotateCcw, BookOpen, ChevronDown, ChevronUp,
  History, User, GraduationCap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { getPredict } from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner'

// ─── Constants ─────────────────────────────────────────────────────────────

const PRODI_COLORS = {
  TI: 'from-indigo-500 to-blue-600',
  AK: 'from-emerald-500 to-teal-600',
  TM: 'from-orange-500 to-red-600',
  AP: 'from-violet-500 to-purple-600',
}

const GRADE_BADGE = {
  A:  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
  AB: 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700',
  B:  'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
  BC: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
  C:  'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
  D:  'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
  E:  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600',
}

const SKS_CONFIG = {
  24: { color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', label: 'Beban Penuh' },
  23: { color: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50 dark:bg-blue-900/20',       border: 'border-blue-300 dark:border-blue-700',       text: 'text-blue-700 dark:text-blue-300',       label: 'Beban Tinggi' },
  22: { color: 'from-yellow-500 to-amber-600',  bg: 'bg-yellow-50 dark:bg-yellow-900/20',   border: 'border-yellow-300 dark:border-yellow-700',   text: 'text-yellow-700 dark:text-yellow-300',   label: 'Beban Normal' },
  21: { color: 'from-orange-500 to-red-500',    bg: 'bg-orange-50 dark:bg-orange-900/20',   border: 'border-orange-300 dark:border-orange-700',   text: 'text-orange-700 dark:text-orange-300',   label: 'Beban Ringan' },
}

// ─── Helper functions ────────────────────────────────────────────────────────

function getIPKColor(ipk) {
  if (ipk >= 3.5) return 'text-emerald-600 dark:text-emerald-400'
  if (ipk >= 3.0) return 'text-blue-600 dark:text-blue-400'
  if (ipk >= 2.5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getIPKBg(ipk) {
  if (ipk >= 3.5) return 'bg-emerald-500'
  if (ipk >= 3.0) return 'bg-blue-500'
  if (ipk >= 2.5) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getInitials(nama) {
  return nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ─── Section 1: Student Profile Card ────────────────────────────────────────

function StudentProfileCard({ student, prediksi }) {
  const ipk = student.ipk_kumulatif
  const trend = prediksi?.trend || 'stabil'
  const trendConfig = {
    meningkat: { icon: TrendingUp, label: 'Tren Meningkat', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' },
    menurun: { icon: TrendingDown, label: 'Tren Menurun', cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700' },
    stabil: { icon: Minus, label: 'Tren Stabil', cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700' },
  }
  const tc = trendConfig[trend] || trendConfig.stabil
  const TrendIcon = tc.icon
  const prodi_color = PRODI_COLORS[student.prodi_key] || 'from-indigo-500 to-purple-600'

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prodi_color} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <span className="text-white font-extrabold text-xl">{getInitials(student.nama)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white truncate">{student.nama}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${prodi_color} text-white`}>
              {student.prodi_key}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{student.nim}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </span>
            <span>{student.prodi}</span>
            <span>Angkatan {student.angkatan}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Semester Aktif:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">{student.semester_aktif}</span>
          </div>
        </div>

        {/* Trend + confidence */}
        <div className="flex-shrink-0">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold ${tc.cls}`}>
            <TrendIcon className="w-4 h-4" />
            {tc.label}
          </div>
        </div>
      </div>

      {/* IPK progress bar */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">IPK Kumulatif</span>
          <span className={`text-lg font-extrabold tabular-nums ${getIPKColor(ipk)}`}>
            {ipk.toFixed(2)} / 4.00
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full ${getIPKBg(ipk)} transition-all duration-700`}
            style={{ width: `${(ipk / 4.0) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>0.00</span>
          <span>2.00</span>
          <span>3.00</span>
          <span>3.50</span>
          <span>4.00</span>
        </div>
      </div>
    </div>
  )
}

// ─── Section 2: Prediction Summary ──────────────────────────────────────────

function PredictionSummaryCards({ prediksi, currentIPK }) {
  const st = prediksi.semester_target
  const ips = prediksi.prediksi_ips
  const ipk = prediksi.prediksi_ipk_baru
  const recSks = prediksi.rekomendasi_sks
  const conf = prediksi.confidence
  const sksCfg = SKS_CONFIG[recSks] || SKS_CONFIG[22]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Card A: Predicted IPS */}
      <div className="card animate-slide-up">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Prediksi Semester {st}
        </p>
        <div className="flex items-end gap-3 mb-3">
          <span className={`text-5xl font-extrabold tabular-nums ${getIPKColor(ips)}`}>
            {ips.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 mb-1.5">IPS</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Prediksi IPK Baru:</span>
          <span className={`font-bold tabular-nums ${getIPKColor(ipk)}`}>{ipk.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">Keyakinan:</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{conf}%</span>
        </div>
        <div className="mt-3 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Semester {st}</span>
        </div>
      </div>

      {/* Card B: SKS recommendation */}
      <div className={`card animate-slide-up ${sksCfg.bg} border ${sksCfg.border}`}>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Rekomendasi SKS
        </p>
        <div className="flex items-end gap-3 mb-3">
          <span className={`text-5xl font-extrabold tabular-nums bg-gradient-to-r ${sksCfg.color} bg-clip-text text-transparent`}>
            {recSks}
          </span>
          <span className="text-sm text-gray-400 mb-1.5">SKS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sksCfg.text} ${sksCfg.bg} border ${sksCfg.border}`}>
            {sksCfg.label}
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${sksCfg.color} transition-all duration-700`}
              style={{ width: `${(recSks / 24) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{recSks} / 24 SKS maksimum</p>
        </div>
      </div>
    </div>
  )
}

// ─── Section 3: IPS/IPK Trend Chart ─────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isPred = label?.toString().includes('Prediksi')
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: <span className="tabular-nums">{Number(p.value).toFixed(2)}</span>
          </p>
        ))}
        {isPred && <p className="text-xs text-amber-500 mt-1 italic">* Nilai prediksi</p>}
      </div>
    )
  }
  return null
}

function TrendChart({ riwayat, prediksiIPS, prediksiIPK, semesterTarget }) {
  const data = []
  let cumSks = 0
  let cumPoints = 0
  riwayat.forEach((sem) => {
    cumSks += sem.sks
    cumPoints += sem.ips * sem.sks
    data.push({
      name: `Semester ${sem.semester}`,
      IPS: sem.ips,
      IPK: parseFloat((cumPoints / cumSks).toFixed(2)),
    })
  })
  data.push({
    name: `Sem ${semesterTarget} (Prediksi)`,
    IPS: prediksiIPS,
    IPK: prediksiIPK,
    isPredicted: true,
  })

  const trend = riwayat.length >= 2
    ? riwayat[riwayat.length - 1].ips - riwayat[riwayat.length - 2].ips
    : 0
  const TrendIcon = trend > 0.05 ? TrendingUp : trend < -0.05 ? TrendingDown : Minus
  const trendColor = trend > 0.05 ? 'text-emerald-600 dark:text-emerald-400' : trend < -0.05 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
  const trendLabel = trend > 0.05 ? 'Meningkat' : trend < -0.05 ? 'Menurun' : 'Stabil'

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="section-title">Tren Performa Akademik</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">IPS & IPK per semester</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">{trendLabel}</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="ipsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ipkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-700/50" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <ReferenceLine
              x={`Sem ${semesterTarget} (Prediksi)`}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Prediksi', position: 'top', fontSize: 10, fill: '#f59e0b' }}
            />
            <Area type="monotone" dataKey="IPS" stroke="#6366f1" strokeWidth={2.5} fill="url(#ipsGrad)"
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="IPK" stroke="#a855f7" strokeWidth={2.5} fill="url(#ipkGrad)"
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">IPS per semester</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">IPK kumulatif</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-6 h-0.5 border-t-2 border-dashed border-amber-400" />
          <span className="text-xs text-amber-600 dark:text-amber-400">Nilai prediksi</span>
        </div>
      </div>
    </div>
  )
}

// ─── Section 4: SKS Scenario Comparison ─────────────────────────────────────

function SKSScenarios({ scenarios, rekomendasi_sks }) {
  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="section-title">Simulasi SKS — Jika Anda Mengambil...</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Perbandingan 4 skenario beban SKS</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const cfg = SKS_CONFIG[sc.sks] || SKS_CONFIG[22]
          const isRec = sc.sks === rekomendasi_sks
          return (
            <div
              key={sc.sks}
              className={`rounded-2xl p-4 border-2 transition-all ${
                isRec
                  ? `${cfg.bg} ${cfg.border} ring-2 ring-offset-1 ring-indigo-400 dark:ring-indigo-600`
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              {isRec && (
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Rekomendasi
                </div>
              )}
              <div className={`text-4xl font-extrabold tabular-nums mb-0.5 bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent`}>
                {sc.sks}
              </div>
              <div className="text-xs text-gray-400 mb-3">SKS · {sc.matkul_count} matkul</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Prediksi IPS</span>
                  <span className={`font-bold tabular-nums ${getIPKColor(sc.prediksi_ips)}`}>{sc.prediksi_ips.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">IPK Baru</span>
                  <span className={`font-bold tabular-nums ${getIPKColor(sc.prediksi_ipk)}`}>{sc.prediksi_ipk.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-2.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.text} ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Section 5: Interactive Course Selector ──────────────────────────────────

function CourseSelector({ allCourses, rekomendasi_sks, currentIPK, cumulativeSks, semesterTarget }) {
  const defaultSelected = useMemo(() => {
    const wajib = allCourses.filter(c => c.wajib)
    const pilihan = allCourses.filter(c => !c.wajib)
    const wajibSks = wajib.reduce((s, c) => s + c.sks, 0)
    const sorted = [...pilihan].sort((a, b) => b.prediksi_nilai_angka - a.prediksi_nilai_angka)
    const selected = new Set(wajib.map(c => c.kode))
    let total = wajibSks
    for (const c of sorted) {
      if (total >= rekomendasi_sks) break
      selected.add(c.kode)
      total += c.sks
    }
    return selected
  }, [allCourses, rekomendasi_sks])

  const [selectedCodes, setSelectedCodes] = useState(defaultSelected)

  const wajibCourses = allCourses.filter(c => c.wajib)
  const pilihanCourses = allCourses.filter(c => !c.wajib)

  const totalSks = useMemo(() => {
    return allCourses.filter(c => selectedCodes.has(c.kode)).reduce((s, c) => s + c.sks, 0)
  }, [selectedCodes, allCourses])

  const predictedIPS = useMemo(() => {
    const selected = allCourses.filter(c => selectedCodes.has(c.kode))
    const totalSksLocal = selected.reduce((s, c) => s + c.sks, 0)
    if (totalSksLocal === 0) return 0
    return selected.reduce((s, c) => s + c.prediksi_nilai_angka * c.sks, 0) / totalSksLocal
  }, [selectedCodes, allCourses])

  const predictedIPK = useMemo(() => {
    const total = cumulativeSks + totalSks
    if (total === 0) return 0
    return (cumulativeSks * currentIPK + predictedIPS * totalSks) / total
  }, [cumulativeSks, currentIPK, predictedIPS, totalSks])

  const sksColor = totalSks < 21 ? 'text-red-600 dark:text-red-400' : totalSks > 24 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'
  const sksBg = totalSks < 21 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : totalSks > 24 ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'

  const toggle = (code) => {
    setSelectedCodes(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const resetToDefault = () => setSelectedCodes(new Set(defaultSelected))

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="section-title">Pilih Matakuliah Semester {semesterTarget}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Klik mata kuliah pilihan untuk menambah/menghapus</p>
          </div>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset ke Rekomendasi
        </button>
      </div>

      {/* SKS Counter */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border mb-5 ${sksBg}`}>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Total SKS Dipilih</p>
          <p className={`text-3xl font-extrabold tabular-nums ${sksColor}`}>
            {totalSks} <span className="text-sm font-normal text-gray-400">/ {rekomendasi_sks} disarankan</span>
          </p>
          {totalSks < 21 && <p className="text-xs text-red-500 mt-0.5">Di bawah minimum 21 SKS</p>}
          {totalSks > 24 && <p className="text-xs text-orange-500 mt-0.5">Melebihi maksimum 24 SKS</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Prediksi IPS saat ini</p>
          <p className={`text-2xl font-extrabold tabular-nums ${getIPKColor(predictedIPS)}`}>{predictedIPS.toFixed(2)}</p>
          <p className="text-xs text-gray-400">IPK Baru: {predictedIPK.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Wajib */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Mata Kuliah Wajib (tidak dapat diubah)
          </p>
          <div className="space-y-2">
            {wajibCourses.map((c) => (
              <div key={c.kode} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono text-gray-400 dark:text-gray-500">{c.kode}</code>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{c.sks} SKS</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.nama}</p>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${GRADE_BADGE[c.prediksi_nilai_huruf] || ''}`}>
                  {c.prediksi_nilai_huruf}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pilihan */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Mata Kuliah Pilihan
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {pilihanCourses.map((c) => {
              const isChecked = selectedCodes.has(c.kode)
              return (
                <button
                  key={c.kode}
                  onClick={() => toggle(c.kode)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isChecked
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700'
                      : 'bg-gray-50 dark:bg-gray-700/40 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isChecked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'}`}>
                    {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs font-mono text-gray-400 dark:text-gray-500">{c.kode}</code>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{c.sks} SKS</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{c.confidence}% conf</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{c.nama}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${GRADE_BADGE[c.prediksi_nilai_huruf] || ''}`}>
                    {c.prediksi_nilai_huruf}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section 6: Grade History ────────────────────────────────────────────────

const GRADE_COLORS = {
  A: 'grade-A', AB: 'grade-AB', B: 'grade-B', BC: 'grade-BC',
  C: 'grade-C', D: 'grade-D', E: 'grade-E',
}

function GradeHistory({ riwayat }) {
  const [openSem, setOpenSem] = useState(riwayat.length > 0 ? riwayat[riwayat.length - 1].semester : null)

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="section-title">Riwayat Nilai</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nilai historis semester 1 s.d. {riwayat.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {riwayat.map((sem) => (
          <div key={sem.semester} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSem(openSem === sem.semester ? null : sem.semester)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                  sem.ips >= 3.5 ? 'bg-emerald-500' : sem.ips >= 3.0 ? 'bg-blue-500' : sem.ips >= 2.5 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {sem.semester}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Semester {sem.semester}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{sem.sks} SKS · {sem.nilai_matkul.length} matkul</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">IPS</p>
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white tabular-nums">{sem.ips.toFixed(2)}</p>
                </div>
                {openSem === sem.semester ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {openSem === sem.semester && (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                <div className="grid grid-cols-12 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/30 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <span className="col-span-2">Kode</span>
                  <span className="col-span-6">Mata Kuliah</span>
                  <span className="col-span-1 text-center">SKS</span>
                  <span className="col-span-1 text-center">Nilai</span>
                  <span className="col-span-2 text-right">Angka</span>
                </div>
                {sem.nilai_matkul.map((mk) => (
                  <div key={mk.kode} className="grid grid-cols-12 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors items-center">
                    <span className="col-span-2">
                      <code className="text-xs font-mono text-gray-500 dark:text-gray-400">{mk.kode}</code>
                    </span>
                    <span className="col-span-6 text-sm text-gray-700 dark:text-gray-300 truncate pr-2">{mk.nama}</span>
                    <span className="col-span-1 text-center text-xs font-medium text-gray-500">{mk.sks}</span>
                    <span className="col-span-1 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${GRADE_COLORS[mk.nilai_huruf] || 'bg-gray-100 text-gray-700'}`}>
                        {mk.nilai_huruf}
                      </span>
                    </span>
                    <span className="col-span-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
                      {mk.nilai_angka.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section 7: Academic Notes ───────────────────────────────────────────────

function AcademicNotes({ catatan }) {
  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="section-title">Catatan Akademik</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rekomendasi dan analisis performa</p>
        </div>
      </div>
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{catatan}</p>
      </div>
      <div className="mt-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          Prediksi dihasilkan berdasarkan data historis menggunakan algoritma weighted average
          (Sem3:50%, Sem2:30%, Sem1:20%). Hasil bersifat estimasi. Untuk diskusi lebih lanjut,
          silakan konsultasikan dengan dosen pembimbing akademik.
        </p>
      </div>
    </div>
  )
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

export default function Dashboard() {
  const { nim } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getPredict(nim)
      setData(result)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [nim])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <LoadingSpinner message="Memuat data dan menghitung prediksi..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="card">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex justify-center gap-3">
            <Link to="/" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <button onClick={fetchData} className="btn-primary">
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { prediksi, riwayat_semester, ...student } = data
  const prodi_key = data.prodi_key

  // Calculate cumulative SKS from history for course selector
  const cumulativeSks = riwayat_semester.reduce((s, sem) => s + sem.sks, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Beranda
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dashboard</span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{nim}</span>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {prediksi?.generated_at}
          </span>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Top gradient accent bar */}
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${PRODI_COLORS[prodi_key] || 'from-indigo-500 to-purple-600'} mb-6`} />

      {/* Section 1: Student Profile */}
      <div className="mb-6">
        <StudentProfileCard student={student} prediksi={prediksi} />
      </div>

      {/* Section 2: Prediction Summary (2 cards) */}
      <div className="mb-6">
        <PredictionSummaryCards prediksi={prediksi} currentIPK={student.ipk_kumulatif} />
      </div>

      {/* Section 3: Trend Chart */}
      <div className="mb-6">
        <TrendChart
          riwayat={riwayat_semester}
          prediksiIPS={prediksi.prediksi_ips}
          prediksiIPK={prediksi.prediksi_ipk_baru}
          semesterTarget={prediksi.semester_target}
        />
      </div>

      {/* Section 4: SKS Scenarios */}
      {prediksi.sks_scenarios && prediksi.sks_scenarios.length > 0 && (
        <div className="mb-6">
          <SKSScenarios
            scenarios={prediksi.sks_scenarios}
            rekomendasi_sks={prediksi.rekomendasi_sks}
          />
        </div>
      )}

      {/* Section 5: Interactive Course Selector */}
      {prediksi.all_semester_courses && prediksi.all_semester_courses.length > 0 && (
        <div className="mb-6">
          <CourseSelector
            allCourses={prediksi.all_semester_courses}
            rekomendasi_sks={prediksi.rekomendasi_sks}
            currentIPK={student.ipk_kumulatif}
            cumulativeSks={cumulativeSks}
            semesterTarget={prediksi.semester_target}
          />
        </div>
      )}

      {/* Section 6 + 7: Grade History + Academic Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GradeHistory riwayat={riwayat_semester} />
        <div className="space-y-6">
          <AcademicNotes catatan={prediksi.catatan_akademik} />

          {/* Quick performance summary */}
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Ringkasan Performa
            </h3>
            <div className="space-y-3">
              {riwayat_semester.map((sem) => (
                <div key={sem.semester} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Semester {sem.semester}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sem.ips >= 3.5 ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                          : sem.ips >= 3.0 ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                          : sem.ips >= 2.5 ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                          : 'bg-gradient-to-r from-red-400 to-rose-500'
                      }`}
                      style={{ width: `${(sem.ips / 4.0) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                    {sem.ips.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="w-24 text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  Prediksi Sem {prediksi.semester_target}
                </span>
                <div className="flex-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-700"
                    style={{ width: `${(prediksi.prediksi_ips / 4.0) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {prediksi.prediksi_ips.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Data bersifat sintetis untuk keperluan demonstrasi sistem · AcadPredict 2024
        </p>
      </div>
    </div>
  )
}
