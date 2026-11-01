import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Clock, Coins, Sigma, Swords, Trophy } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { BODY, CARD, LIME_BTN, OUT_BTN, TICK } from '../styles/solver'

const QUESTIONS = [
  { q: '2x² − 8 = 0  →  x = ?',         opts: ['±2', '±4', '2', '4'],       correct: 0 },
  { q: 'log₂(32) = ?',                    opts: ['4', '5', '6', '8'],         correct: 1 },
  { q: 'sin(90°) = ?',                    opts: ['0', '√2/2', '1', '−1'],     correct: 2 },
  { q: '√196 = ?',                        opts: ['12', '13', '14', '16'],     correct: 2 },
  { q: 'f(x) = x³  →  f′(x) = ?',        opts: ['3x²', '2x', '3x', 'x²'],   correct: 0 },
]

const TIME_LIMIT = 30

const BlitzScreen = () => {
  const navigate = useNavigate()
  const [phase, setPhase]       = useState<'lobby' | 'game' | 'result'>('lobby')
  const [qIdx, setQIdx]         = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [myScore, setMyScore]   = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [flash, setFlash]       = useState<'ok' | 'bad' | null>(null)

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
    setFlash(ok ? 'ok' : 'bad')
    if (ok) setMyScore(s => s + 10)
    setTimeout(() => {
      setFlash(null)
      if (qIdx < QUESTIONS.length - 1) { setQIdx(q => q + 1); setAnswered(false) }
      else setPhase('result')
    }, 700)
  }

  /* ── Lobby ── */
  if (phase === 'lobby') return (
    <div className="min-h-screen flex flex-col pb-10 select-none font-sans" style={{ background: BODY }}>
      <div className="px-4 pt-5">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { triggerHaptic('light'); navigate(-1) }}
            aria-label="Orqaga"
            className="w-[38px] h-[38px] flex items-center justify-center active:scale-[0.96] transition-transform"
            style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
          >
            <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <p className="num text-tiny uppercase tracking-[0.16em] font-extrabold" style={{ color: '#6B7C66' }}>
            Duel
          </p>
          <span className="w-[38px]" />
        </div>
        <span
          className="w-[56px] h-[56px] flex items-center justify-center"
          style={{ background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)', borderRadius: 16, color: '#1C3214', boxShadow: '0 8px 18px rgba(95,175,34,0.3)' }}
        >
          <Swords size={26} />
        </span>
        <h1 className="mt-4 text-[26px] font-extrabold leading-tight text-ink">1v1 Blitz</h1>
        <p className="mt-1.5 text-[13.5px] font-medium leading-snug" style={{ color: '#6B7C66' }}>
          {TIME_LIMIT} soniya ichida raqibdan ko'proq savolga to'g'ri javob bering.
        </p>

        {/* Raqib */}
        <div className="relative mt-6 overflow-hidden" style={CARD}>
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: '#E8A33D' }} />
          <div className="pl-4 pr-3.5 py-3.5 flex items-center gap-3">
            <span className="w-[38px] h-[38px] flex items-center justify-center shrink-0 text-[15px] font-extrabold"
              style={{ background: '#FCF1DC', color: '#B87A22', borderRadius: 12 }}>
              R
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-extrabold text-ink">Raqib topildi</p>
              <p className="mt-0.5 text-[11.5px] font-semibold" style={{ color: '#6B7C66' }}>
                Matematika daraja 3 · <span className="num" style={{ color: '#B87A22' }}>8 kunlik streak</span>
              </p>
            </div>
            <span className="num text-[10.5px] font-extrabold uppercase px-2 py-1 shrink-0"
              style={{ background: '#DDF3DC', color: '#0B6E4F', borderRadius: 7 }}>
              Tayyor
            </span>
          </div>
        </div>

        <button
          onClick={() => { triggerHaptic('medium'); setPhase('game') }}
          className="mt-5 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
          style={LIME_BTN}
        >
          Boshlash <ChevronRight size={16} />
        </button>

        <button
          onClick={() => { triggerHaptic('light'); navigate('/formulas') }}
          className="mt-2.5 w-full h-[48px] flex items-center gap-3 px-4 active:scale-[0.985] transition-transform"
          style={{ ...CARD, border: '1px dashed #CFD9C6' }}
        >
          <span className="w-[28px] h-[28px] flex items-center justify-center shrink-0"
            style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 9, color: '#0B6E4F' }}>
            <Sigma size={15} />
          </span>
          <span className="flex-1 text-left text-[13px] font-extrabold text-ink">Formulalarni takrorlash</span>
          <ChevronRight size={15} style={{ color: '#9AA995' }} />
        </button>
      </div>
    </div>
  )

  /* ── Result ── */
  if (phase === 'result') {
    const win = myScore > oppScore
    const draw = myScore === oppScore
    const tone = win ? TICK.ok : draw ? '#E8A33D' : TICK.bad
    const reset = () => {
      triggerHaptic('medium')
      setPhase('lobby'); setMyScore(0); setOppScore(0); setQIdx(0); setTimeLeft(TIME_LIMIT); setAnswered(false)
    }

    return (
      <div className="min-h-screen flex flex-col justify-center px-4 pb-10 select-none font-sans" style={{ background: BODY }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden"
          style={{ ...CARD, borderRadius: 16, boxShadow: '0 10px 26px rgba(14,26,18,0.08)' }}
        >
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 6, background: tone }} />
          <div className="pl-5 pr-4 py-5">
            <div className="flex items-center gap-2">
              {win && <Trophy size={16} style={{ color: '#B87A22' }} />}
              <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                Blitz Duel natijasi
              </p>
            </div>
            <p className="mt-2 text-[24px] font-extrabold leading-none text-ink">
              {win ? "G'alaba!" : draw ? 'Durrang!' : 'Yutqazdingiz'}
            </p>
            <p className="mt-2 text-[13px] font-medium" style={{ color: '#6B7C66' }}>
              {win ? 'Ajoyib o\'yin! Raqibni ortda qoldirdingiz.' : draw ? 'Tengma-teng o\'yin.' : 'Keyingi safar raqibdan tezroq bo\'ling.'}
            </p>

            <div className="mt-5 flex items-stretch" style={{ borderTop: '1px solid #EDF1E7', paddingTop: 16 }}>
              {[
                { v: myScore, u: 'siz', c: '#0E1A12' },
                { v: oppScore, u: 'raqib', c: '#6B7C66' },
                { v: win ? (myScore / 10) * 5 : 0, u: 'coin', c: '#B87A22' },
              ].map((cell, i) => (
                <div key={cell.u} className="flex-1 flex items-center">
                  {i > 0 && <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />}
                  <div className="flex-1 text-center">
                    <p className="num text-[19px] font-extrabold leading-none" style={{ color: cell.c }}>
                      {cell.u === 'coin' && cell.v > 0 ? `+${cell.v}` : cell.v}
                    </p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>{cell.u}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <button
          onClick={reset}
          className="mt-4 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
          style={LIME_BTN}
        >
          <Swords size={16} /> Qayta o'ynash
        </button>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/home') }}
          className="mt-2.5 w-full h-[48px] text-[13.5px] font-extrabold active:scale-[0.985] transition-transform"
          style={OUT_BTN}
        >
          Asosiyga qaytish
        </button>
      </div>
    )
  }

  /* ── Game ── */
  const q = QUESTIONS[qIdx]
  const urgent = timeLeft <= 10

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: BODY }}>

      {/* Hisob varaqasi: Siz / taymer / Raqib */}
      <div className="px-4 pt-5">
        <div style={{ ...CARD, borderRadius: 14 }}>
          <div className="flex items-stretch px-2 py-2.5">
            {[
              { v: myScore, u: 'siz', c: '#0E1A12' },
              { v: oppScore, u: 'raqib', c: '#6B7C66' },
            ].map((cell, i) => (
              <div key={cell.u} className="flex-1 flex items-center">
                {i > 0 && <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />}
                <div className="flex-1 text-center">
                  <p className="num text-[20px] font-extrabold leading-none" style={{ color: cell.c }}>{cell.v}</p>
                  <p className="mt-1.5 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>{cell.u}</p>
                </div>
              </div>
            ))}

            <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />

            <div className="flex-1 flex items-center justify-center">
              <span
                className="num flex items-center gap-1.5 h-[40px] px-3 text-[17px] font-extrabold"
                style={{
                  background: urgent ? '#FBE9E7' : '#F6F8F3',
                  border: `1px solid ${urgent ? '#D9534F' : '#E1E7DA'}`,
                  borderRadius: 12,
                  color: urgent ? TICK.bad : '#0E1A12',
                }}
              >
                <Clock size={14} style={{ color: urgent ? TICK.bad : '#9AA995' }} />
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Savol bo'yicha holat chiziqlari */}
        <div className="mt-3 flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <motion.span
              key={i}
              className="flex-1 h-[5px]"
              animate={{ background: i < qIdx ? TICK.current : i === qIdx ? '#7ED321' : TICK.todo }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: 3 }}
            />
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {/* Savol */}
            <div className="relative" style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}>
              <span
                className="absolute left-0 top-0 bottom-0"
                style={{ width: 5, borderRadius: '16px 0 0 16px', background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }}
              />
              <div className="pl-5 pr-4 py-4">
                <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                  Savol {qIdx + 1} / {QUESTIONS.length}
                </p>
                <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{q.q}</p>
              </div>
            </div>

            {/* Variantlar — 2×2 */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {q.opts.map((opt, i) => {
                const isCorrect = i === q.correct
                const show = answered && flash
                let style: React.CSSProperties = { ...CARD, color: '#0E1A12' }
                if (show) {
                  if (isCorrect) style = { background: '#DDF3DC', border: '1.5px solid #5FAF22', color: '#0B4A34', borderRadius: 14 }
                  else if (flash === 'bad') style = { ...CARD, color: '#9AA995' }
                }
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className="h-[68px] px-3 text-left"
                    style={style}
                  >
                    <span className="num block text-[10px] font-extrabold" style={{ color: '#9AA995' }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    <span className="block mt-1 text-[14.5px] font-extrabold leading-tight">{opt}</span>
                  </motion.button>
                )
              })}
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 num text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
              <Coins size={12} style={{ color: '#E8A33D' }} /> har g'alaba uchun 5 coin
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BlitzScreen
