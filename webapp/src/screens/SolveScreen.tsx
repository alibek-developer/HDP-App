import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const QUESTIONS = [
  {
    q:       'sin(30°) ning qiymatini toping:',
    opts:    ['√3/2', '1/2', '1', '0'],
    correct: 1,
    hint:    'sin(30°) = 1/2 — bu asosiy qiymat, yodlang!',
  },
  {
    q:       'cos(0°) ning qiymatini toping:',
    opts:    ['0', '√2/2', '1', '−1'],
    correct: 2,
    hint:    'cos(0°) = 1 — nol burchakda kosinus maksimal.',
  },
  {
    q:       "Quyidagi tenglik noto\u02BCg\u02BCri:",
    opts:    ['sin²x + cos²x = 1', 'tg(x) = sin(x)/cos(x)', 'cos(2x) = cos²x \u2212 sin²x', 'sin(2x) = 2sin(x)'],
    correct: 3,
    hint:    "To\u02BCg\u02BCri formula: sin(2x) = 2sin(x)\u00B7cos(x)",
  },
]

const SolveScreen = () => {
  const navigate = useNavigate()
  const [qIdx, setQIdx]           = useState(0)
  const [selected, setSelected]   = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore]         = useState(0)
  const [finished, setFinished]   = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(120)

  const q = QUESTIONS[qIdx]

  useEffect(() => {
    if (finished) return
    const t = setInterval(() => setSecondsLeft(p => (p > 0 ? p - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [finished])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const handleSelect = (i: number) => {
    if (submitted) return
    triggerHaptic('selection')
    setSelected(i)
  }

  const handleCheck = () => {
    if (selected === null) return
    setSubmitted(true)
    const ok = selected === q.correct
    setIsCorrect(ok)
    ok ? triggerHaptic('success') : triggerHaptic('error')
    if (ok) setScore(s => s + 10)
  }

  const handleNext = () => {
    triggerHaptic('light')
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(i => i + 1)
      setSelected(null)
      setSubmitted(false)
      setIsCorrect(false)
    } else {
      setFinished(true)
    }
  }

  /* ── Finished / Result screen ── */
  if (finished) {
    const earned = score
    const coins  = earned * 5
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-10 select-none font-sans" style={{ background: '#F1F4F9' }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="w-full rounded-2xl p-6 text-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
        >
          <div className="text-5xl mb-4">{score === QUESTIONS.length * 10 ? '🏆' : score > 10 ? '⭐' : '📚'}</div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#0F172A' }}>
            Natija: {score}/{QUESTIONS.length * 10}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>
            {score === QUESTIONS.length * 10 ? 'Mukammal natija! Barcha savollar to\'g\'ri.' : 'Yaxshi urinish! Xato bo\'lgan mavzularni takrorlang.'}
          </p>

          {/* Reward row */}
          <div className="flex gap-3 mb-6">
            <div
              className="flex-1 rounded-xl p-3 text-center"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
            >
              <p className="text-xl font-extrabold" style={{ color: '#D97706' }}>🪙 +{coins}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#D97706' }}>coin</p>
            </div>
            <div
              className="flex-1 rounded-xl p-3 text-center"
              style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
            >
              <p className="text-xl font-extrabold" style={{ color: '#4338CA' }}>⚡ +{score}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#4338CA' }}>XP</p>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              boxShadow: '0 4px 16px rgba(217,119,6,0.3)',
            }}
          >
            ✨ Pro'ga o'ting — barcha masalalar ochiq
          </button>
          <button
            onClick={() => { triggerHaptic('medium'); navigate('/home') }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
          >
            Bosh sahifaga qaytish
          </button>
          <button
            onClick={() => { triggerHaptic('light'); navigate('/video') }}
            className="w-full py-3 text-sm font-medium rounded-xl"
            style={{ background: '#F1F4F9', color: '#64748B' }}
          >
            Darsni qayta ko'rish
          </button>
        </motion.div>
      </div>
    )
  }

  /* ── Quiz ── */
  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3" style={{ background: '#F1F4F9' }}>
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

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Dars Masalalari</p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Savol {qIdx + 1} / {QUESTIONS.length}</p>
        </div>

        {/* Timer */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs"
          style={{
            background: secondsLeft < 30 ? '#FEF2F2' : '#EEF2FF',
            color:      secondsLeft < 30 ? '#DC2626'  : '#4338CA',
            border:    `1px solid ${secondsLeft < 30 ? '#FECACA' : '#C7D2FE'}`,
          }}
        >
          ⏱ {fmt(secondsLeft)}
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 mb-5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4338CA, #6366F1)' }}
            initial={{ width: `${(qIdx / QUESTIONS.length) * 100}%` }}
            animate={{ width: `${((qIdx + (submitted ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <section className="px-4 mb-5">
        <div
          className="rounded-2xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#4338CA' }}>
            Savol {qIdx + 1}
          </p>
          <p className="text-base font-semibold leading-snug" style={{ color: '#0F172A' }}>{q.q}</p>
        </div>
      </section>

      {/* Options */}
      <section className="px-4 mb-5 space-y-2.5">
        {q.opts.map((opt, i) => {
          let bg = '#FFFFFF', border = '#E2E8F0', color = '#334155'
          if (submitted) {
            if (i === q.correct) { bg = '#ECFDF5'; border = '#6EE7B7'; color = '#059669' }
            else if (i === selected) { bg = '#FEF2F2'; border = '#FECACA'; color = '#DC2626' }
          } else if (selected === i) {
            bg = '#EEF2FF'; border = '#4338CA'; color = '#4338CA'
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              className="w-full p-4 rounded-xl text-sm font-semibold text-left flex items-center gap-3 transition-all"
              style={{ background: bg, border: `1.5px solid ${border}`, color }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                style={{
                  background: selected === i && !submitted ? '#4338CA' : submitted && i === q.correct ? '#059669' : submitted && i === selected ? '#DC2626' : '#F1F4F9',
                  color:      selected === i || (submitted && (i === q.correct || i === selected)) ? '#FFFFFF' : '#94A3B8',
                }}
              >
                {['A','B','C','D'][i]}
              </span>
              {opt}
            </motion.button>
          )
        })}
      </section>

      {/* Hint after submission */}
      <AnimatePresence>
        {submitted && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-5"
          >
            <div
              className="p-4 rounded-xl text-sm leading-relaxed"
              style={{
                background: isCorrect ? '#ECFDF5' : '#FFF7ED',
                border:     `1px solid ${isCorrect ? '#A7F3D0' : '#FED7AA'}`,
                color:      isCorrect ? '#065F46' : '#92400E',
              }}
            >
              <p className="font-bold mb-1">{isCorrect ? '✓ To\'g\'ri!' : '✗ Noto\'g\'ri'}</p>
              <p>{q.hint}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Action button */}
      <section className="px-4">
        {!submitted ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all"
            style={{
              background: selected === null
                ? '#E2E8F0'
                : 'linear-gradient(135deg, #4338CA, #6366F1)',
              color:      selected === null ? '#94A3B8' : '#FFFFFF',
              boxShadow:  selected === null ? 'none' : '0 4px 16px rgba(67,56,202,0.28)',
            }}
          >
            Tekshirish
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
          >
            {qIdx < QUESTIONS.length - 1 ? 'Keyingi savol →' : 'Natijani ko\'rish 🏆'}
          </button>
        )}
      </section>
    </div>
  )
}

export default SolveScreen
