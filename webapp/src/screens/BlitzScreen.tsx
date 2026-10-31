import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const QUESTIONS = [
  { q: '2x² − 8 = 0  →  x = ?',         opts: ['±2', '±4', '2', '4'],       correct: 0 },
  { q: 'log₂(32) = ?',                    opts: ['4', '5', '6', '8'],         correct: 1 },
  { q: 'sin(90°) = ?',                    opts: ['0', '√2/2', '1', '−1'],     correct: 2 },
  { q: '√196 = ?',                        opts: ['12', '13', '14', '16'],     correct: 2 },
  { q: 'f(x) = x³  →  f′(x) = ?',        opts: ['3x²', '2x', '3x', 'x²'],   correct: 0 },
]

const BlitzScreen = () => {
  const navigate = useNavigate()
  const [phase, setPhase]       = useState<'lobby' | 'game' | 'result'>('lobby')
  const [qIdx, setQIdx]         = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [myScore, setMyScore]   = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (phase !== 'game') return
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(t); setPhase('result'); return 0 }
        return p - 1
      })
      if (Math.random() > 0.65) setOppScore(s => s + 10)
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  const handleAnswer = (i: number) => {
    if (answered) return
    setAnswered(true)
    const ok = i === QUESTIONS[qIdx].correct
    ok ? triggerHaptic('success') : triggerHaptic('error')
    if (ok) setMyScore(s => s + 10)
    setTimeout(() => {
      if (qIdx < QUESTIONS.length - 1) { setQIdx(q => q + 1); setAnswered(false) }
      else setPhase('result')
    }, 700)
  }

  /* ── Lobby ── */
  if (phase === 'lobby') return (
    <div className="min-h-screen flex flex-col pb-10 select-none font-sans" style={{ background: '#F1F4F9' }}>
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/home') }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Blitz Duel</p>
        <div style={{ width: 36 }} />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-24 h-24 rounded-[28px] flex items-center justify-center text-5xl mb-6"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 12px 40px rgba(67,56,202,0.3)' }}
        >
          ⚔️
        </div>

        <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#0F172A' }}>1v1 Blitz</h1>
        <p className="text-sm mb-8 max-w-xs" style={{ color: '#64748B' }}>
          30 soniya ichida raqibdan ko'proq savolga to'g'ri javob bering!
        </p>

        {/* Opponent preview */}
        <div
          className="w-full rounded-2xl p-4 mb-8 flex items-center gap-4"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #DC2626, #F97316)' }}
          >
            R
          </div>
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Raqib Topildi</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>Matematika Daraja 3 · 🔥 8 streak</p>
          </div>
          <div
            className="ml-auto px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: '#ECFDF5', color: '#059669' }}
          >
            Tayyor
          </div>
        </div>

        <button
          onClick={() => { triggerHaptic('medium'); setPhase('game') }}
          className="w-full py-4 rounded-xl font-extrabold text-white text-base mb-2.5"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 20px rgba(67,56,202,0.3)' }}
        >
          ⚔️ Boshlash
        </button>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/formulas') }}
          className="w-full py-3 text-sm font-medium rounded-xl"
          style={{ background: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0' }}
        >
          📐 Formulalarni takrorlash
        </button>
      </div>
    </div>
  )

  /* ── Result ── */
  if (phase === 'result') {
    const win = myScore > oppScore
    const draw = myScore === oppScore
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10 select-none font-sans" style={{ background: '#F1F4F9' }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 22 }}
          className="w-full rounded-2xl p-6 text-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
        >
          <div className="text-5xl mb-4">{win ? '🏆' : draw ? '🤝' : '😔'}</div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#0F172A' }}>
            {win ? 'G\'alaba!' : draw ? 'Durrang!' : 'Yutqazdingiz'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>
            {win ? 'Ajoyib o\'yin! Raqibni yengillatdingiz.' : draw ? 'Tengma-teng o\'yin!' : 'Keyingi safar harakat qiling!'}
          </p>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
              <p className="text-2xl font-extrabold" style={{ color: '#4338CA' }}>{myScore}</p>
              <p className="text-xs font-medium" style={{ color: '#6366F1' }}>Siz</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-2xl font-extrabold" style={{ color: '#DC2626' }}>{oppScore}</p>
              <p className="text-xs font-medium" style={{ color: '#EF4444' }}>Raqib</p>
            </div>
          </div>

          {win && (
            <div className="p-3 rounded-xl mb-5 text-sm font-bold" style={{ background: '#FFFBEB', color: '#D97706' }}>
              🪙 +{myScore / 10 * 5} coin qo'shildi!
            </div>
          )}

          <button
            onClick={() => { triggerHaptic('medium'); setPhase('lobby'); setMyScore(0); setOppScore(0); setQIdx(0); setTimeLeft(30); setAnswered(false) }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
          >
            ⚔️ Qayta o'ynash
          </button>
          <button
            onClick={() => { triggerHaptic('light'); navigate('/home') }}
            className="w-full py-3 text-sm font-medium rounded-xl"
            style={{ background: '#F1F4F9', color: '#64748B' }}
          >
            Asosiyga qaytish
          </button>
        </motion.div>
      </div>
    )
  }

  /* ── Game ── */
  const q = QUESTIONS[qIdx]
  const timeColor = timeLeft <= 10 ? '#DC2626' : '#4338CA'

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Score + Timer header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          {/* My score */}
          <div className="text-center">
            <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Siz</p>
            <p className="text-2xl font-extrabold" style={{ color: '#4338CA' }}>{myScore}</p>
          </div>

          {/* Timer circle */}
          <div
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full font-extrabold text-2xl"
            style={{
              background: `linear-gradient(135deg, ${timeColor}22, ${timeColor}11)`,
              border:     `3px solid ${timeColor}`,
              color:       timeColor,
            }}
          >
            {timeLeft}
          </div>

          {/* Opp score */}
          <div className="text-center">
            <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>Raqib</p>
            <p className="text-2xl font-extrabold" style={{ color: '#DC2626' }}>{oppScore}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(timeLeft / 30) * 100}%`, background: `linear-gradient(90deg, ${timeColor}, ${timeColor}aa)` }}
          />
        </div>
      </div>

      {/* Question */}
      <section className="px-4 mb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#4338CA' }}>
              Savol {qIdx + 1} / {QUESTIONS.length}
            </p>
            <p className="text-base font-semibold leading-snug" style={{ color: '#0F172A' }}>{q.q}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Options */}
      <section className="px-4 grid grid-cols-2 gap-2.5">
        {q.opts.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(i)}
            disabled={answered}
            className="p-4 rounded-xl font-bold text-sm transition-all"
            style={{
              background: '#FFFFFF',
              border:     '1.5px solid #E2E8F0',
              color:      '#0F172A',
            }}
          >
            <span
              className="block text-[10px] font-extrabold mb-1"
              style={{ color: '#94A3B8' }}
            >
              {['A','B','C','D'][i]}
            </span>
            {opt}
          </motion.button>
        ))}
      </section>
    </div>
  )
}

export default BlitzScreen
