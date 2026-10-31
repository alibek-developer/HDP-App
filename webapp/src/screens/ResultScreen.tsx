import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Check, X, Coins, Zap, Award, RotateCcw, Home, BookOpen } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'

/**
 * 7-qadam: Natija — nechta to'g'ri, qancha coin, va har bir xato uchun
 * «qanday to'g'rilash kerak» tushuntirishi.
 */
const ResultScreen = () => {
  const navigate = useNavigate()
  const result = useApp(s => s.lastResult)
  const coin = useApp(s => s.coin)

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: '#F1F4F9' }}>
        <p className="text-base font-bold" style={{ color: '#0F172A' }}>Natija topilmadi</p>
        <p className="text-xs text-center" style={{ color: '#64748B' }}>Avval test yoki to'plamni yakunlang.</p>
        <button
          onClick={() => navigate('/home')}
          className="mt-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
          style={{ background: '#4338CA' }}
        >
          Bosh sahifaga
        </button>
      </div>
    )
  }

  const total = result.answers.length
  const correct = result.answers.filter(a => a.ok).length
  const wrong = result.answers.filter(a => !a.ok)
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  const backTo = result.kind === 'problem-set' ? '/problems' : `/lesson/${result.refId}`

  return (
    <div className="min-h-screen pb-32 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => { triggerHaptic('light'); navigate(backTo) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Natija</p>
        <div style={{ width: 36 }} />
      </header>

      {/* Score card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mb-4"
      >
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
        >
          <ScoreRing percent={percent} />
          <p className="text-2xl font-extrabold mt-4" style={{ color: '#0F172A' }}>
            {correct} / {total}
          </p>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>{result.title}</p>

          {/* Rewards */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: '#FFF7E6', border: '1px solid #F5D899' }}>
              <Coins size={14} style={{ color: '#B45309' }} />
              <span className="text-sm font-extrabold" style={{ color: '#B45309' }}>+{result.coinsEarned}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
              <Zap size={14} style={{ color: '#4338CA' }} />
              <span className="text-sm font-extrabold" style={{ color: '#4338CA' }}>+{result.xpEarned}</span>
            </div>
          </div>
          <p className="text-[11px] mt-3" style={{ color: '#94A3B8' }}>
            <Award size={11} className="inline -mt-0.5" /> Jami hamyoningizda: {coin} 🪙
          </p>
        </div>
      </motion.section>

      {/* Xatolar tahlili */}
      {wrong.length > 0 && (
        <section className="px-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: '#64748B' }}>
            Topilgan xatolar ({wrong.length})
          </p>
          <div className="space-y-2">
            {wrong.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4"
                style={{ background: '#FFFFFF', border: '1px solid #FECACA' }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#FEE2E2' }}>
                    <X size={12} style={{ color: '#DC2626' }} />
                  </span>
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#0F172A' }}>{a.prompt}</p>
                </div>
                <div className="pl-7 space-y-1.5">
                  <p className="text-xs" style={{ color: '#DC2626' }}>
                    Sizning javobingiz: <span className="font-bold">{a.options[a.picked] ?? '—'}</span>
                  </p>
                  <p className="text-xs" style={{ color: '#059669' }}>
                    To'g'ri javob: <span className="font-bold">{a.options[a.correct]}</span>
                  </p>
                  <div className="mt-2 p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#4338CA' }}>
                      Qanday to'g'rilash kerak
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#334155' }}>{a.explain}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* To'g'ri javoblar ro'yxati */}
      {correct > 0 && (
        <section className="px-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: '#64748B' }}>
            Bajarilganlar
          </p>
          <div className="rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            {result.answers.filter(a => a.ok).map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3" style={{ borderTop: i === 0 ? 'none' : '1px solid #F1F5F9' }}>
                <Check size={14} style={{ color: '#059669' }} />
                <p className="text-xs flex-1 truncate" style={{ color: '#334155' }}>{a.prompt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {wrong.length === 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 mb-4">
          <div className="rounded-xl p-4 text-center" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <p className="text-sm font-bold" style={{ color: '#065F46' }}>Ajoyib! Xatosiz yakunladingiz.</p>
          </div>
        </motion.section>
      )}

      {/* Fixed actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 430, margin: '0 auto' }}>
        <div className="px-4 pt-3 pb-5" style={{ background: 'rgba(241,244,249,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid #E2E8F0' }}>
          <div className="flex gap-2">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/home') }}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"
              style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#334155' }}
            >
              <Home size={15} /> Bosh sahifa
            </button>
            {result.kind === 'lesson-test' ? (
              <button
                onClick={() => { triggerHaptic('medium'); navigate(`/lesson/${result.refId}`) }}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 text-white"
                style={{ background: '#4338CA' }}
              >
                <BookOpen size={15} /> Davom etish
              </button>
            ) : (
              <button
                onClick={() => { triggerHaptic('medium'); navigate(backTo) }}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 text-white"
                style={{ background: '#4338CA' }}
              >
                <RotateCcw size={15} /> Yana ishlash
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ScoreRing = ({ percent }: { percent: number }) => {
  const r = 44
  const c = 2 * Math.PI * r
  const color = percent >= 80 ? '#059669' : percent >= 50 ? '#D97706' : '#DC2626'
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E2E8F0" strokeWidth="9" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * percent) / 100 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold" style={{ color }}>{percent}%</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>natija</span>
      </div>
    </div>
  )
}

export default ResultScreen
