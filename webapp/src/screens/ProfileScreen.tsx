import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'
import { LESSONS } from '../data/content'
import { useApp, freeLessonCount } from '../store/useStore'

/**
 * Profil — real progressiya ma'lumotlari.
 * Bu yerda foydalanuvchi o'z holatini ko'radi: darslar, masalalar, coin,
 * daraja, yutuqlar, sertifikat yo'li va Pro holati.
 */
type Progress = { lessonsDone: number; solved: number; streak: number }

const ACHIEVEMENT_DEFS: { key: string; label: string; icon: string; test: (p: Progress) => boolean }[] = [
  { key: 'first-lesson', label: 'Birinchi dars', icon: '🎓', test: p => p.lessonsDone >= 1 },
  { key: 'five-lessons', label: '5 dars tugadi', icon: '📚', test: p => p.lessonsDone >= 5 },
  { key: 'all-free', label: '10 bepul dars', icon: '🏆', test: p => p.lessonsDone >= freeLessonCount },
  { key: 'ten-problems', label: '10 masala', icon: '⭐', test: p => p.solved >= 10 },
  { key: 'fifty-problems', label: '50 masala', icon: '💎', test: p => p.solved >= 50 },
  { key: 'streak-3', label: '3 kun streak', icon: '🔥', test: p => p.streak >= 3 },
]

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [showCertModal, setShowCertModal] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const { name, username, publicId, level, xp, coin, streak, solvedCount, isPro, proExpires, lessons } =
    useApp(s => s)
  const resetAll = useApp(s => s.resetAll)

  const lessonsDone = LESSONS.filter(l => lessons[l.id]?.testScore != null).length
  const coinsFromTests = LESSONS.reduce((n, l) => n + (lessons[l.id]?.testScore ?? 0) * 5, 0)
  const certReady = lessonsDone >= freeLessonCount

  const stats = [
    { label: 'Dars tugadi', value: `${lessonsDone}/${freeLessonCount}`, icon: '▶' },
    { label: 'Masala yechildi', value: `${solvedCount}`, icon: '✓' },
    { label: 'Streak', value: `${streak}`, icon: '🔥' },
    { label: 'Coin', value: `${coin.toLocaleString()}`, icon: '🪙' },
  ]

  return (
    <div className="min-h-screen pb-28 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold" style={{ color: '#0F172A' }}>Profil</h1>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            onClick={() => setShowReset(true)}
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
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
          >
            {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-extrabold" style={{ color: '#0F172A' }}>{name}</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#EEF2FF', color: '#4338CA' }}>
                Lv.{level}
              </span>
            </div>
            <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>@{username} · #{publicId}</p>

            {/* XP to next level */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${((xp % 1000) / 1000) * 100}%`, background: '#4338CA' }}
                />
              </div>
              <span className="text-[10px] font-bold" style={{ color: '#94A3B8' }}>{xp} XP</span>
            </div>

            <button onClick={() => navigate('/pro')} className="block">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                style={isPro
                  ? { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }
                  : { background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}
              >
                {isPro ? `👑 Pro · ${proExpires} gacha` : '🆓 Bepul foydalanuvchi'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-lg font-extrabold leading-none" style={{ color: '#0F172A' }}>{s.value}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Yo'naltirishlar */}
      <section className="px-4 mb-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          {[
            { label: 'Darslarim', sub: `${lessonsDone} ta tugadi`, to: '/courses', icon: '📚' },
            { label: "Masalalar to'plami", sub: `${solvedCount} yechim · ${coinsFromTests} 🪙`, to: '/problems', icon: '✏️' },
            { label: "Do'kon", sub: 'coin sarflash', to: '/shop', icon: '🛍' },
            { label: 'Blitz Duel', sub: '1v1 poyga', to: '/blitz', icon: '⚔️' },
          ].map((row, i) => (
            <button
              key={i}
              onClick={() => { triggerHaptic('light'); navigate(row.to) }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              style={{ borderTop: i === 0 ? 'none' : '1px solid #F1F5F9' }}
            >
              <span className="text-lg">{row.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{row.label}</p>
                <p className="text-[11px]" style={{ color: '#94A3B8' }}>{row.sub}</p>
              </div>
              <span className="text-sm" style={{ color: '#CBD5E1' }}>›</span>
            </button>
          ))}
        </div>
      </section>

      {/* Yutuqlar */}
      <section className="px-4 mb-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>Yutuqlar</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {ACHIEVEMENT_DEFS.map(a => {
              const done = a.test({ lessonsDone, solved: solvedCount, streak })
            return (
              <div
                key={a.key}
                className="shrink-0 flex flex-col items-center gap-2 p-3.5 rounded-xl text-center"
                style={{
                  background: done ? '#EEF2FF' : '#FFFFFF',
                  border: `1px solid ${done ? '#C7D2FE' : '#E2E8F0'}`,
                  opacity: done ? 1 : 0.5,
                  minWidth: '80px',
                }}
              >
                <span className="text-2xl">{a.icon}</span>
                <p className="text-[10px] font-semibold leading-snug" style={{ color: done ? '#4338CA' : '#94A3B8' }}>
                  {a.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pro / sertifikat / chiqish */}
      <section className="px-4 mb-4 space-y-2.5">
        {!isPro && (
          <button
            onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
          >
            💎 Pro obunani olish
          </button>
        )}

        <button
          onClick={() => { triggerHaptic('light'); setShowCertModal(true) }}
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: certReady ? '#FFFBEB' : '#FFFFFF',
            color: certReady ? '#D97706' : '#334155',
            border: `1px solid ${certReady ? '#FDE68A' : '#E2E8F0'}`,
          }}
        >
          🏅 Sertifikatni ko'rish
        </button>

        <button
          onClick={() => { triggerHaptic('warning'); resetAll(); navigate('/', { replace: true }) }}
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          Chiqish va progressni tozalash
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
                  Sertifikat olish uchun {freeLessonCount} ta bepul darsning testlarini yakunlang.
                </p>
                <div className="p-3 rounded-xl mb-5 text-sm font-semibold" style={{ background: '#EEF2FF', color: '#4338CA' }}>
                  Bajarildi: {lessonsDone} / {freeLessonCount} dars
                </div>
                {certReady ? (
                  <button
                    onClick={() => { triggerHaptic('success'); setShowCertModal(false) }}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white mb-2"
                    style={{ background: '#4338CA' }}
                  >
                    Sertifikatni olish
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowCertModal(false); navigate('/courses') }}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white mb-2"
                    style={{ background: '#4338CA' }}
                  >
                    Darslarni davom ettirish
                  </button>
                )}
                <button
                  onClick={() => setShowCertModal(false)}
                  className="w-full py-3 text-sm font-medium"
                  style={{ color: '#94A3B8' }}
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reset confirm */}
      <AnimatePresence>
        {showReset && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReset(false)}
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
              <h3 className="text-base font-extrabold mb-2 text-center" style={{ color: '#0F172A' }}>
                Progressni tozalash
              </h3>
              <p className="text-sm text-center mb-5" style={{ color: '#64748B' }}>
                Barcha darslar, coin va XP sıfirlanadi.
              </p>
              <button
                onClick={() => { resetAll(); setShowReset(false); triggerHaptic('warning'); navigate('/', { replace: true }) }}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white mb-2"
                style={{ background: '#DC2626' }}
              >
                Ha, tozalansin
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="w-full py-3 text-sm font-medium"
                style={{ color: '#94A3B8' }}
              >
                Bekor qilish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileScreen
