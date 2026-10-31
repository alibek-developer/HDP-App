import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const STATS = [
  { label: 'Dars ko\'rildi',  value: '3',   icon: '▶' },
  { label: 'Masala yechildi', value: '9',   icon: '✓' },
  { label: 'Streak',          value: '12',  icon: '🔥' },
  { label: 'Coin',            value: '340', icon: '🪙' },
]

const WEEK = [
  { day: 'Du',  min: 30, pct: 40 },
  { day: 'Se',  min: 45, pct: 60 },
  { day: 'Ch',  min: 20, pct: 27 },
  { day: 'Pa',  min: 60, pct: 80 },
  { day: 'Ju',  min: 35, pct: 47 },
  { day: 'Sha', min: 50, pct: 67, today: true },
  { day: 'Ya',  min: 0,  pct: 5  },
]

const ACHIEVEMENTS = [
  { label: '3 kunlik streak', icon: '🔥', done: true  },
  { label: '10 masala',       icon: '⭐', done: true  },
  { label: 'Birinchi dars',   icon: '🎓', done: true  },
  { label: '30 kun streak',   icon: '🏆', done: false },
  { label: '100 masala',      icon: '💎', done: false },
]

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [showCertModal, setShowCertModal] = useState(false)

  return (
    <div className="min-h-screen pb-28 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold" style={{ color: '#0F172A' }}>Profil</h1>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            onClick={() => triggerHaptic('light')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="#334155" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* User card */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
          >
            SA
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-extrabold" style={{ color: '#0F172A' }}>Sardor Aliyev</h2>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: '#EEF2FF', color: '#4338CA' }}
              >
                Lv.4
              </span>
            </div>
            <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>@sardor_hdp · #HDP-84219</p>
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
              style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}
            >
              🆓 Bepul foydalanuvchi
            </div>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-2.5">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5 flex items-center gap-3"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-lg font-extrabold leading-none" style={{ color: '#0F172A' }}>{s.value}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly activity */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Haftalik faollik</h3>
            <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>daqiqa</span>
          </div>

          <div className="flex items-end gap-2 h-20">
            {WEEK.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: '60px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height:     `${Math.max(d.pct, 6)}%`,
                      background: d.today
                        ? 'linear-gradient(180deg, #4338CA, #6366F1)'
                        : d.min > 0
                        ? '#C7D2FE'
                        : '#F1F4F9',
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-bold"
                  style={{ color: d.today ? '#4338CA' : '#CBD5E1' }}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="px-4 mb-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>Yutuqlar</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={i}
              className="shrink-0 flex flex-col items-center gap-2 p-3.5 rounded-xl text-center"
              style={{
                background:  a.done ? '#EEF2FF' : '#FFFFFF',
                border:      `1px solid ${a.done ? '#C7D2FE' : '#E2E8F0'}`,
                opacity:     a.done ? 1 : 0.5,
                minWidth:    '80px',
              }}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-[10px] font-semibold leading-snug" style={{ color: a.done ? '#4338CA' : '#94A3B8' }}>
                {a.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pro upgrade / certificate */}
      <section className="px-4 mb-4 space-y-2.5">
        <button
          onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
        >
          💎 Pro obunani olish
        </button>

        <button
          onClick={() => { triggerHaptic('light'); setShowCertModal(true) }}
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: '#FFFFFF', color: '#334155', border: '1px solid #E2E8F0' }}
        >
          🏅 Sertifikatni ko'rish
        </button>

        <button
          onClick={() => { triggerHaptic('warning'); navigate('/login') }}
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          Chiqish
        </button>
      </section>

      {/* Certificate modal */}
      <AnimatePresence>
        {showCertModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCertModal(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.55)' }}
            />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto p-6"
              style={{ background: '#FFFFFF', borderRadius: '24px 24px 0 0' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E2E8F0' }} />
              <div className="text-center">
                <div className="text-5xl mb-3">🏅</div>
                <h3 className="text-lg font-extrabold mb-2" style={{ color: '#0F172A' }}>HDP Sertifikati</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748B' }}>
                  Sertifikat olish uchun barcha 10 ta bepul darsni tugating va finalni testin yeching.
                </p>
                <div
                  className="p-3 rounded-xl mb-5 text-sm font-semibold"
                  style={{ background: '#EEF2FF', color: '#4338CA' }}
                >
                  Bajarildi: 3 / 10 dars
                </div>
                <button
                  onClick={() => setShowCertModal(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#F1F4F9', color: '#64748B' }}
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileScreen
