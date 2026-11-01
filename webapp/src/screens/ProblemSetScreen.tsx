import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Coins, X } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { findProblemSet } from '../data/content'
import { SessionResult, useApp } from '../store/useStore'
import { BODY, CARD, INK_BTN, LIME_BTN, TICK } from '../styles/solver'

/**
 * To'plam ichida yechish — Masalalar oilasining "davotar" tili.
 * Har to'g'ri javob uchun to'plamning coinPerSolve qiymati beriladi.
 */

const ProblemSetScreen = () => {
  const navigate = useNavigate()
  const exit = useBack('/problems')
  const { setId } = useParams()
  const set = findProblemSet(String(setId))

  const canOpenSet = useApp(s => s.canOpenSet)
  const finishProblemSet = useApp(s => s.finishProblemSet)
  const beginSession = useApp(s => s.beginSession)

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<SessionResult['answers']>([])
  const finished = useRef(false)

  useEffect(() => { beginSession() }, [])

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BODY }}>
        <button
          onClick={exit}
          className="h-[44px] px-5 text-[13px] font-extrabold"
          style={{ ...CARD, color: '#0E1A12' }}
        >
          To'plamlarga qaytish
        </button>
      </div>
    )
  }

  // Zanjir qoidasi: Pro yoki coin evaziga ochilmagan to'plamga kirmaymiz
  if (!canOpenSet(set.id)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
        <span
          className="w-[54px] h-[54px] flex items-center justify-center"
          style={{ background: '#FCF1DC', border: '1px solid rgba(232,163,61,0.4)', borderRadius: 16, color: '#B87A22' }}
        >
          <Coins size={24} />
        </span>
        <p className="text-[16px] font-extrabold text-center text-ink">Bu to'plam Pro uchun</p>
        <p className="text-[12.5px] text-center font-medium" style={{ color: '#6B7C66' }}>
          {set.topic} · {set.difficulty} · {set.questions.length} ta masala
        </p>
        <button
          onClick={() => navigate('/pro', { state: { reason: 'problem-set', setId: set.id } })}
          className="mt-2 h-[46px] px-6 text-[13.5px] font-extrabold active:scale-[0.97] transition-transform"
          style={LIME_BTN}
        >
          Pro ni ko'rish
        </button>
      </div>
    )
  }

  const total = set.questions.length
  const question = set.questions[cursor]
  const isLast = cursor === total - 1

  const choose = (i: number) => {
    if (checked) return
    triggerHaptic('selection')
    setPicked(i)
  }

  const confirm = () => {
    if (picked === null) return
    const ok = picked === question.correct
    triggerHaptic(ok ? 'success' : 'error')
    setChecked(true)
    setAnswers(prev => [...prev, {
      prompt: question.prompt,
      picked,
      correct: question.correct,
      options: question.options,
      explain: question.explain,
      ok,
    }])
  }

  const next = () => {
    if (isLast) {
      finish(answers)
      return
    }
    setCursor(c => Math.min(c + 1, total - 1))
    setPicked(null)
    setChecked(false)
  }

  const finish = (all: SessionResult['answers']) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    /** Streak rejimi: hammasi to'g'ri bo'lsa mukofot ikkilanadi */
    const mult = set.perfectBonus && ok === all.length ? 2 : 1
    finishProblemSet(set.id, {
      kind: 'problem-set',
      refId: set.id,
      title: set.title,
      answers: all,
      coinsEarned: ok * set.coinPerSolve * mult,
      xpEarned: ok * set.xpPerSolve * mult,
    })
    triggerHaptic('success')
    navigate('/result', { replace: true })
  }

  const isRight = picked === question.correct
  const earned = answers.filter(a => a.ok).length * set.coinPerSolve

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: BODY }}>

      {/* ── Juda ixcham holat chizig'i: chiqish + hisob + davotar chiziqlari + mukofot ── */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <button
          onClick={exit}
          aria-label="Chiqish"
          className="w-[30px] h-[30px] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 9, color: '#6B7C66' }}
        >
          <X size={14} />
        </button>
        <span className="num text-[12px] font-extrabold shrink-0" style={{ color: '#33452F' }}>
          {cursor + 1}/{total}
        </span>

        <div className="flex-1 flex gap-1.5">
          {set.questions.map((_, i) => {
            const a = answers[i]
            const state = a ? (a.ok ? 'ok' : 'bad') : i === cursor ? 'current' : 'todo'
            return (
              <motion.span
                key={i}
                className="flex-1 h-[5px]"
                animate={{
                  background: state === 'ok'
                    ? TICK.ok
                    : state === 'bad'
                      ? TICK.bad
                      : state === 'current'
                        ? TICK.current
                        : TICK.todo,
                }}
                transition={{ duration: 0.3 }}
                style={{ borderRadius: 3 }}
              />
            )
          })}
        </div>

        <span className="num text-[11.5px] font-extrabold shrink-0 flex items-center gap-1" style={{ color: '#B87A22' }}>
          <Coins size={12} style={{ color: '#E8A33D' }} />+{set.coinPerSolve}
          {set.perfectBonus && <span style={{ color: '#5FAF22' }}>·2x</span>}
        </span>
      </div>

      <div className="px-4 mt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={cursor}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            {/* Savol */}
            <div className="relative" style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}>
              <span
                className="absolute left-0 top-0 bottom-0"
                style={{ width: 5, borderRadius: '16px 0 0 16px', background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }}
              />
              <div className="pl-5 pr-4 py-4">
                <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                  {set.title}
                </p>
                <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{question.prompt}</p>
              </div>
            </div>

            {/* Javob variantlari */}
            <div className="mt-4 space-y-2.5">
              {question.options.map((opt, i) => {
                const isPicked = picked === i
                const isCorrect = question.correct === i
                let style: React.CSSProperties = { ...CARD, color: '#0E1A12' }
                let badge: React.CSSProperties = { background: '#F6F8F3', border: '1px solid #E1E7DA', color: '#6B7C66' }
                if (!checked) {
                  if (isPicked) {
                    style = { background: '#EDF7DE', border: '1.5px solid #7ED321', color: '#1C3214', borderRadius: 14 }
                    badge = { background: 'linear-gradient(150deg, #9BE04B, #7ED321)', color: '#1C3214', borderRadius: 9 }
                  }
                } else if (isCorrect) {
                  style = { background: '#DDF3DC', border: '1.5px solid #5FAF22', color: '#0B4A34', borderRadius: 14 }
                  badge = { background: '#5FAF22', color: '#FFFFFF', borderRadius: 9 }
                } else if (isPicked) {
                  style = { background: '#FBE9E7', border: '1.5px solid #D9534F', color: '#8C2F2C', borderRadius: 14 }
                  badge = { background: '#D9534F', color: '#FFFFFF', borderRadius: 9 }
                } else {
                  style = { ...CARD, color: '#9AA995' }
                }
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={checked}
                    className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
                    style={style}
                  >
                    <span
                      className="w-[28px] h-[28px] flex items-center justify-center shrink-0 text-[12px] font-black"
                      style={badge}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-[14.5px] font-semibold leading-snug">{opt}</span>
                    {checked && isCorrect && <Check size={16} style={{ color: '#5FAF22' }} strokeWidth={3} />}
                    {checked && isPicked && !isCorrect && <X size={16} style={{ color: '#D9534F' }} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>

            {/* Tushuntirish */}
            {checked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-4 overflow-hidden"
                style={{ ...CARD, borderRadius: 14, background: '#FBFCF8' }}
              >
                <span
                  className="absolute left-0 top-0 bottom-0"
                  style={{ width: 4, background: isRight ? '#5FAF22' : '#E8A33D' }}
                />
                <div className="pl-4 pr-3.5 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]"
                      style={{ color: isRight ? '#0B6E4F' : '#B87A22' }}>
                      {isRight ? 'Yechildi' : 'Xato javob'}
                    </p>
                    <p className="num text-[12px] font-extrabold" style={{ color: isRight ? '#B87A22' : '#9AA995' }}>
                      {isRight ? `+${set.coinPerSolve} coin` : '+0 coin'}
                    </p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{question.explain}</p>
                </div>
              </motion.div>
            )}

            {/* Harakat */}
            <button
              onClick={checked ? next : confirm}
              disabled={!checked && picked === null}
              className="mt-5 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
              style={!checked && picked === null
                ? { background: '#EAEEE3', color: '#9AA995', borderRadius: 12 }
                : checked
                  ? LIME_BTN
                  : INK_BTN}
            >
              {!checked ? 'Tekshirish' : isLast ? 'Natijani ko\'rish' : 'Keyingi masala'}
              {checked && <ChevronRight size={16} />}
            </button>

            <p className="mt-3 text-center num text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
              {answers.filter(a => a.ok).length} ta to'g'ri · {earned} coin yig'ildi
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProblemSetScreen
