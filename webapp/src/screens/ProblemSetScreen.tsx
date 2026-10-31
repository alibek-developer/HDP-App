import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, X, Coins } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { findProblemSet } from '../data/content'
import { useApp, SessionResult } from '../store/useStore'

/**
 * To'plam ichida mashq. Har to'g'ri javob uchun to'plamning coinPerSolve qiymati beriladi.
 */
const ProblemSetScreen = () => {
  const navigate = useNavigate()
  const { setId } = useParams()
  const set = findProblemSet(String(setId))

  const isPro = useApp(s => s.isPro)
  const finishProblemSet = useApp(s => s.finishProblemSet)
  const coin = useApp(s => s.coin)

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<SessionResult['answers']>([])

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F1F4F9' }}>
        <button onClick={() => navigate('/problems')} className="text-sm font-bold" style={{ color: '#4338CA' }}>
          To'plamlarga qaytish
        </button>
      </div>
    )
  }

  // Zanjir qoidasi: Pro to'plam faqat obunachilarga
  if (!set.free && !isPro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: '#F1F4F9' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#FFF7E6' }}>
          <Coins size={24} style={{ color: '#B45309' }} />
        </div>
        <p className="text-base font-bold text-center" style={{ color: '#0F172A' }}>Bu to'plam Pro uchun</p>
        <button
          onClick={() => navigate('/pro', { state: { reason: 'problem-set', setId: set.id } })}
          className="mt-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
          style={{ background: '#4338CA' }}
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
    setCursor(c => c + 1)
    setPicked(null)
    setChecked(false)
  }

  const finish = (all: SessionResult['answers']) => {
    const ok = all.filter(a => a.ok).length
    finishProblemSet(set.id, {
      kind: 'problem-set',
      refId: set.id,
      title: set.title,
      answers: all,
      coinsEarned: ok * set.coinPerSolve,
      xpEarned: ok * set.xpPerSolve,
    })
    triggerHaptic('success')
    navigate('/result', { replace: true })
  }

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/problems') }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>{set.title}</p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{cursor + 1} / {total}</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg" style={{ background: '#FFF7E6', border: '1px solid #F5D899' }}>
          <Coins size={13} style={{ color: '#B45309' }} />
          <span className="text-xs font-extrabold" style={{ color: '#B45309' }}>{coin}</span>
        </div>
      </header>

      <div className="px-4 mb-5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#4338CA' }}
            animate={{ width: `${((cursor + (checked ? 1 : 0)) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: '#64748B' }}>
          Har to'g'ri javob: <span className="font-bold" style={{ color: '#B45309' }}>+{set.coinPerSolve} 🪙</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cursor}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
          className="px-4"
        >
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4338CA' }}>
              Masala {cursor + 1}
            </p>
            <p className="text-base font-semibold leading-snug" style={{ color: '#0F172A' }}>{question.prompt}</p>
          </div>

          <div className="space-y-2 mb-4">
            {question.options.map((opt, i) => {
              const isPicked = picked === i
              const isCorrect = question.correct === i
              let bg = '#FFFFFF'
              let border = '#E2E8F0'
              let color = '#0F172A'
              if (!checked) {
                if (isPicked) { bg = '#EEF2FF'; border = '#4338CA'; color = '#312E81' }
              } else {
                if (isCorrect) { bg = '#ECFDF5'; border = '#059669'; color = '#065F46' }
                else if (isPicked) { bg = '#FEF2F2'; border = '#DC2626'; color = '#991B1B' }
                else { color = '#94A3B8' }
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={checked}
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-left"
                  style={{ background: bg, border: `1.5px solid ${border}`, color }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white"
                    style={{ background: checked && isCorrect ? '#059669' : checked && isPicked ? '#DC2626' : isPicked ? '#4338CA' : '#F1F5F9' }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-semibold flex-1">{opt}</span>
                  {checked && isCorrect && <Check size={16} style={{ color: '#059669' }} />}
                  {checked && isPicked && !isCorrect && <X size={16} style={{ color: '#DC2626' }} />}
                </button>
              )
            })}
          </div>

          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-4"
              style={{
                background: picked === question.correct ? '#ECFDF5' : '#FFFBEB',
                border: `1px solid ${picked === question.correct ? '#A7F3D0' : '#FDE68A'}`,
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: picked === question.correct ? '#065F46' : '#92400E' }}>
                {picked === question.correct ? `Yechildi! +${set.coinPerSolve} 🪙` : 'Xato javob'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>{question.explain}</p>
            </motion.div>
          )}

          <button
            onClick={checked ? next : confirm}
            disabled={!checked && picked === null}
            className="w-full py-4 rounded-xl font-bold text-sm"
            style={!checked && picked === null
              ? { background: '#E2E8F0', color: '#94A3B8' }
              : { background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
          >
            {!checked ? 'Tekshirish' : isLast ? 'Natijani ko\'rish' : 'Keyingi masala →'}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProblemSetScreen
