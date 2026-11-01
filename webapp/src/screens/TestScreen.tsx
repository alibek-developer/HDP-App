import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Coins, FastForward, Lightbulb, Lock, X } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { CONSUMABLES, findLesson, TEST_REWARD } from '../data/content'
import { SessionResult, useApp } from '../store/useStore'
import { BODY, CARD, INK_BTN, LIME_BTN, TICK } from '../styles/solver'

/**
 * 6-qadam: Test — darsdan keyin bil tekshirish.
 * Har to'g'ri javob coin + XP keltiradi. Barcha javoblar (xato ham)
 * natija ekraniga «xatoni qanday to'g'rilash» uchun olib boriladi.
 * Do'kondan olingan buyumlar shu yerda sarflanadi: maslahat (javobdan
 * oldin tushuntirish) va o'tkazish (xato hisoblanmaydi, coin yutilmaydi).
 */
export interface TestAnswer {
  prompt: string
  picked: number
  correct: number
  options: string[]
  explain: string
  ok: boolean
  skipped?: boolean
}

const HINT = CONSUMABLES.find(c => c.kind === 'hint')!
const SKIP = CONSUMABLES.find(c => c.kind === 'skip')!

const TestScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const exit = useBack(`/lesson/${id}/example`)
  const lesson = findLesson(Number(id))

  const canEnterTest = useApp(s => s.canEnterTest(Number(id)))
  const finishLessonTest = useApp(s => s.finishLessonTest)
  const hintCount = useApp(s => s.inventory[HINT.id] ?? 0)
  const skipCount = useApp(s => s.inventory[SKIP.id] ?? 0)
  const useConsumable = useApp(s => s.useConsumable)
  const beginSession = useApp(s => s.beginSession)

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [hintOn, setHintOn] = useState(false)
  const [answers, setAnswers] = useState<TestAnswer[]>([])
  const finished = useRef(false)

  useEffect(() => { beginSession() }, [])

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BODY }}>
        <button
          onClick={exit}
          className="h-[44px] px-5 text-[13px] font-extrabold"
          style={{ ...CARD, color: '#0E1A12' }}
        >
          Kurslarga qaytish
        </button>
      </div>
    )
  }

  // Zanjir qoidasi: misol yechilmagan bo'lsa testga yo'l yo'q
  if (!canEnterTest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
        <span
          className="w-[54px] h-[54px] flex items-center justify-center"
          style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 16, color: '#6B7C66' }}
        >
          <Lock size={22} />
        </span>
        <p className="text-[16px] font-extrabold text-center text-ink">Avval misolni ishlang</p>
        <p className="text-[12.5px] text-center font-medium" style={{ color: '#6B7C66' }}>
          Test faqat misol yakunlangach ochiladi.
        </p>
        <button
          onClick={() => navigate(`/lesson/${lesson.id}/example`)}
          className="mt-2 h-[46px] px-6 text-[13.5px] font-extrabold active:scale-[0.97] transition-transform"
          style={LIME_BTN}
        >
          Misolga qaytish
        </button>
      </div>
    )
  }

  const questions = lesson.questions
  const total = questions.length
  const question = questions[cursor]
  const isLast = cursor === total - 1

  const choose = (i: number) => {
    if (checked) return
    triggerHaptic('selection')
    setPicked(i)
  }

  const advance = (all: TestAnswer[]) => {
    if (all.length >= total) {
      finish(all)
      return
    }
    setCursor(c => Math.min(c + 1, total - 1))
    setPicked(null)
    setChecked(false)
    setHintOn(false)
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

  /** Maslahat: javob belgilanmasdan tushuntirish ochiladi — bir marta sarflanadi */
  const openHint = () => {
    if (checked || hintOn) return
    if (!useConsumable('hint')) return
    triggerHaptic('light')
    setHintOn(true)
  }

  /** O'tkazish: savol xato hisoblanmaydi, coin ham keltirmaydi */
  const skip = () => {
    if (checked || answers.length !== cursor) return
    if (!useConsumable('skip')) return
    triggerHaptic('medium')
    const withSkip: TestAnswer[] = [...answers, {
      prompt: question.prompt,
      picked: -1,
      correct: question.correct,
      options: question.options,
      explain: question.explain,
      ok: false,
      skipped: true,
    }]
    setAnswers(withSkip)
    advance(withSkip)
  }

  const next = () => advance(answers)

  const goShop = () => {
    triggerHaptic('light')
    navigate('/shop')
  }

  const finish = (all: TestAnswer[]) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    const result: SessionResult = {
      kind: 'lesson-test',
      refId: String(lesson.id),
      title: lesson.title,
      answers: all,
      coinsEarned: ok * TEST_REWARD.coin,
      xpEarned: ok * TEST_REWARD.xp,
    }
    finishLessonTest(lesson.id, result)
    triggerHaptic('success')
    navigate('/result', { replace: true })
  }

  const isRight = picked === question.correct
  const rightCount = answers.filter(a => a.ok).length

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: BODY }}>

      {/* Holat chizig'i: chiqish + hisob + davotar chiziqlari + mukofot */}
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
          {questions.map((_, i) => {
            const a = answers[i]
            const state = a ? (a.ok ? 'ok' : a.skipped ? 'skip' : 'bad') : i === cursor ? 'current' : 'todo'
            return (
              <motion.span
                key={i}
                className="flex-1 h-[5px]"
                animate={{
                  background: state === 'ok'
                    ? TICK.ok
                    : state === 'bad'
                      ? TICK.bad
                      : state === 'skip'
                        ? '#E8A33D'
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
          <Coins size={12} style={{ color: '#E8A33D' }} />+{TEST_REWARD.coin}
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
                  {lesson.title}
                </p>
                <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{question.prompt}</p>
              </div>
            </div>

            {/* Maslahat (holdagi buyum) — javob belgilanmasdan ochiladi */}
            {hintOn && !checked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-4 overflow-hidden"
                style={{ ...CARD, borderRadius: 14, background: '#FCF1DC' }}
              >
                <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: '#E8A33D' }} />
                <div className="pl-4 pr-3.5 py-3.5">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.1em]" style={{ color: '#B87A22' }}>
                    Maslahat
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: '#6B4A17' }}>{question.explain}</p>
                </div>
              </motion.div>
            )}

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
                      {isRight ? "To'g'ri" : 'Xato javob'}
                    </p>
                    <p className="num text-[12px] font-extrabold" style={{ color: isRight ? '#B87A22' : '#9AA995' }}>
                      {isRight ? `+${TEST_REWARD.coin} coin · +${TEST_REWARD.xp} XP` : '+0 coin'}
                    </p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{question.explain}</p>
                </div>
              </motion.div>
            )}

            {/* Holdagi buyumlar: maslahat / o'tkazish. Soni bo'lmasa do'konga oladi */}
            {!checked && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => (hintCount > 0 ? openHint() : goShop())}
                  disabled={hintOn}
                  className="flex-1 h-[42px] flex items-center justify-center gap-2 text-[12.5px] font-extrabold active:scale-[0.98] transition-transform disabled:opacity-60"
                  style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
                >
                  <Lightbulb size={14} style={{ color: hintOn ? '#9AA995' : '#E8A33D' }} />
                  <span>{hintOn ? 'Maslahat ochiq' : 'Maslahat'}</span>
                  <span className="num flex items-center justify-center text-[10px] font-black"
                    style={{ minWidth: 18, height: 18, padding: '0 4px', borderRadius: 6, background: '#FCF1DC', color: '#B87A22' }}>
                    {hintCount > 0 ? hintCount : HINT.cost}
                  </span>
                  {hintCount === 0 && !hintOn && <Coins size={10} style={{ color: '#E8A33D' }} />}
                </button>

                <button
                  onClick={() => (skipCount > 0 ? skip() : goShop())}
                  className="flex-1 h-[42px] flex items-center justify-center gap-2 text-[12.5px] font-extrabold active:scale-[0.98] transition-transform"
                  style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
                >
                  <FastForward size={14} style={{ color: '#6B7C66' }} />
                  <span>O'tkazish</span>
                  <span className="num flex items-center justify-center text-[10px] font-black"
                    style={{ minWidth: 18, height: 18, padding: '0 4px', borderRadius: 6, background: '#FCF1DC', color: '#B87A22' }}>
                    {skipCount > 0 ? skipCount : SKIP.cost}
                  </span>
                  {skipCount === 0 && <Coins size={10} style={{ color: '#E8A33D' }} />}
                </button>
              </div>
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
              {!checked ? 'Tekshirish' : isLast ? 'Natijani ko\'rish' : 'Keyingi savol'}
              {checked && <ChevronRight size={16} />}
            </button>

            <p className="mt-3 text-center num text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
              {rightCount} ta to'g'ri javob to'plandi
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TestScreen
