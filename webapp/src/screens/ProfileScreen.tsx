import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number | null>(5) // Saturday selected by default
  const [showCertificateModal, setShowCertificateModal] = useState(false)

  const weeklyData = [
    { day: 'Du', min: 30, height: '40%' },
    { day: 'Se', min: 40, height: '60%' },
    { day: 'Ch', min: 25, height: '35%' },
    { day: 'Pa', min: 50, height: '80%' },
    { day: 'Ju', min: 35, height: '50%' },
    { day: 'Sha', min: 45, height: '70%', isToday: true },
    { day: 'Ya', min: 10, height: '15%' },
  ]

  const handleLogout = () => {
    triggerHaptic('warning')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#006C49] text-white flex items-center justify-center font-serif font-black text-lg shadow-xs">
            Σ
          </div>
          <div>
            <h1 className="text-base font-black text-[#131B2E]">Mening Profilim</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">HDP Shaxsiy Kabinet</p>
          </div>
        </div>

        <button 
          onClick={() => triggerHaptic('light')}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* 2. User Profile Card */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-[32px] p-4 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative">
          <div className="flex items-center gap-3.5 mb-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#004E35] to-[#10B981] p-[2px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center font-black text-[#006C49] text-xl">
                  AS
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-[#131B2E]">Aliyev Sardor</h2>
                <span className="text-emerald-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                @sardor_hdp <span className="text-slate-300">·</span> <span className="font-mono text-[11px] text-slate-400">#HDP-84219</span>
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-800">
                <span>🏆</span>
                <span>Olimpiada Ishtirokchisi · Lv.4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pro Status Banner */}
      <section className="px-4 py-2">
        <div className="rounded-[28px] bg-gradient-to-br from-[#003823] via-[#005739] to-[#006C49] text-white p-4 shadow-[0_8px_24px_rgba(0,108,73,0.22)] border border-emerald-400/20">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <h3 className="font-black text-sm text-white">HDP Pro Faol</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] font-bold rounded-md uppercase border border-emerald-300/20">
              YILLIK
            </span>
          </div>

          <p className="text-xs text-white/80 mb-3">
            Barcha 100+ maxsus darslar va IMO tahlili to'liq ochiq
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-emerald-200 text-[11px] font-medium">
              📅 Muddati: 31-Dekabr, 2025
            </span>

            <button
              onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
              className="px-3.5 py-1.5 bg-white text-[#006C49] rounded-full text-xs font-black shadow-sm"
            >
              Boshqarish →
            </button>
          </div>
        </div>
      </section>

      {/* 4. 2x2 Stats Grid */}
      <section className="px-4 py-2 grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="bg-white rounded-[24px] p-3.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-bold">Olov Streak</span>
            <span className="text-base">🔥</span>
          </div>
          <div className="text-xl font-black text-[#131B2E] my-0.5 font-mono">12 kun</div>
          <div className="text-[10px] font-bold text-amber-700">↗ Shaxsiy rekord!</div>
        </div>

        {/* XP */}
        <div className="bg-white rounded-[24px] p-3.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-bold">XP Balans</span>
            <span className="text-base text-blue-600">⚡</span>
          </div>
          <div className="text-xl font-black text-[#131B2E] my-0.5 font-mono">3,850 XP</div>
          <div className="text-[10px] text-slate-500 font-medium">Keyingi: 4,000 (+150)</div>
        </div>

        {/* Solved */}
        <div className="bg-white rounded-[24px] p-3.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-bold">Yechilgan</span>
            <span className="text-base text-emerald-600">🧮</span>
          </div>
          <div className="text-xl font-black text-[#131B2E] my-0.5 font-mono">248 ta</div>
          <div className="text-[10px] font-bold text-emerald-700">✓ 94% aniqlik darajasi</div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-[24px] p-3.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-bold">Reyting O'rni</span>
            <span className="text-base text-amber-500">🏆</span>
          </div>
          <div className="text-xl font-black text-[#131B2E] my-0.5 font-mono">#42-o'rin</div>
          <div className="text-[10px] text-slate-500 font-medium">Respublika Top-100</div>
        </div>
      </section>

      {/* 5. Weekly Activity Chart */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-[28px] p-4 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-black text-[#131B2E]">Haftalik Faollik</h3>
              <p className="text-[11px] text-slate-500">Kunlik o'rtacha 38 daqiqa</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black">
              🕒 Jami 4.4 soat
            </span>
          </div>

          {/* Interactive Bars */}
          <div className="flex items-end justify-between pt-6 pb-2 px-2 h-36">
            {weeklyData.map((col, idx) => {
              const isSelected = selectedDay === idx
              return (
                <div
                  key={col.day}
                  onClick={() => { triggerHaptic('selection'); setSelectedDay(idx) }}
                  className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer"
                >
                  <span className={`text-[10px] font-bold font-mono transition-colors ${
                    isSelected ? 'text-[#006C49]' : 'text-slate-400'
                  }`}>
                    {col.min}m
                  </span>
                  <div className="w-7 bg-slate-100 rounded-xl h-20 flex items-end p-0.5">
                    <div
                      className={`w-full rounded-lg transition-all ${
                        isSelected ? 'bg-[#006C49] shadow-sm' : 'bg-slate-200'
                      }`}
                      style={{ height: col.height }}
                    />
                  </div>
                  <span className={`text-xs ${isSelected ? 'font-black text-[#131B2E]' : 'text-slate-500'}`}>
                    {col.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. Settings List */}
      <section className="px-4 py-2 space-y-2">
        <h3 className="text-xs font-black text-[#131B2E] px-1 uppercase tracking-wider text-slate-500">
          Sozlamalar va Xizmatlar
        </h3>

        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
          {/* Certificate */}
          <div
            onClick={() => { triggerHaptic('light'); setShowCertificateModal(true) }}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                🎓
              </div>
              <div>
                <h4 className="font-bold text-[#131B2E]">Mening Sertifikatlarim</h4>
                <p className="text-[11px] text-slate-500">2 ta rasmiy sertifikat</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px]">PDF</span>
          </div>

          {/* Notifications */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                🔔
              </div>
              <div>
                <h4 className="font-bold text-[#131B2E]">Eslatmalar</h4>
                <p className="text-[11px] text-slate-500">Har kuni soat 20:00 da dars</p>
              </div>
            </div>
            <button
              onClick={() => { triggerHaptic('selection'); setNotificationsOn(!notificationsOn) }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsOn ? 'bg-[#006C49]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsOn ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Support Link */}
          <a
            href="https://t.me/hdp_support"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                🎧
              </div>
              <div>
                <h4 className="font-bold text-[#131B2E]">Qo'llab-quvvatlash (24/7)</h4>
                <p className="text-[11px] text-slate-500">@hdp_support kuratori</p>
              </div>
            </div>
            <span className="text-slate-400">↗</span>
          </a>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                🚪
              </div>
              <div>
                <h4 className="font-bold text-rose-600">Tizimdan chiqish</h4>
                <p className="text-[11px] text-slate-400">Hisobni almashtirish</p>
              </div>
            </div>
            <span className="text-rose-500">›</span>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificateModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[32px] p-5 shadow-2xl z-10 text-center"
            >
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-base font-black text-[#131B2E] mb-1">Milliy Sertifikat</h3>
              <p className="text-xs text-slate-500 mb-4">
                Sardor Aliyev nomiga tasdiqlangan DTM Matematika sertifikati (№HDP-9821).
              </p>
              <button
                onClick={() => { triggerHaptic('light'); setShowCertificateModal(false) }}
                className="w-full bg-[#006C49] text-white py-3 rounded-full font-bold text-xs"
              >
                Yuklab olish (PDF)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileScreen
