import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Lightbulb, Lock } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { findLesson } from '../data/content'
import { useApp } from '../store/useStore'
import { BODY, CARD, LIME_BTN, TICK } from '../styles/solver'

/**
 * 5-qadam: Misol — dars mavzusiga oid BITTA yechilgan misol.
 * Qoida: barcha qadamlar ochilmasa «Testga o'tish» yopiq qoladi.
 */
const ExampleScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const lesson = findLesson(Number(id))

  const exampleDone = useApp(s => !!s.lessons[Number(id)]?.exampleDone)
  const canEnterExample = useApp(s => s.canEnterExample(Number(id)))
  const markExampleDone = useApp(s => s.markExampleDone)

  const [revealed, setRevealed] = useState(exampleDone ? 99 : 0)

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BODY }}>
        <button
          onClick={() => navigate('/courses')}
          className="h-[44px] px-5 text-[13px] font-extrabold"
          style={{ ...CARD, color: '#0E1A12' }}
        >
          Kurslarga qaytish
        </button>
      </div>
    )
  }

  const steps = lesson.example.steps
  const allSeen = revealed >= steps.length

  // Zanjir qoidasi: video tugamagan bo'lsa misolga kirib bo'lmaydi
  if (!canEnterExample) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
        <span
          className="w-[54px] h-[54px] flex items-center justify-center"
          style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 16, color: '#6B7C66' }}
        >
          <Lock size={22} />
        </span>
        <p className="text-[16px] font-extrabold text-center text-ink">Avval videoni ko'ring</p>
        <p className="text-[12.5px] text-center font-medium" style={{ color: '#6B7C66' }}>
          Misol video oxirigacha ko'rilgach ochiladi.
        </p>
        <button
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className="mt-2 h-[46px] px-6 text-[13.5px] font-extrabold active:scale-[0.97] transition-transform"
          style={LIME_BTN}
        >
          Videoga qaytish
        </button>
      </div>
    )
  }

  const revealNext = () => {
    triggerHaptic('selection')
    setRevealed(r => r + 1)
  }

  const toTest = () => {
    markExampleDone(lesson.id)
    triggerHaptic('medium')
    navigate(`/lesson/${lesson.id}/test`)
  }

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: BODY }}>

      {/* Holat chizig'i: qadam hisobi + davotar chiziqlari */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <span className="num text-[12px] font-extrabold shrink-0" style={{ color: '#33452F' }}>
          {Math.min(revealed, steps.length)}/{steps.length}
        </span>

        <div className="flex-1 flex gap-1.5">
          {steps.map((_, i) => (
            <motion.span
              key={i}
              className="flex-1 h-[5px]"
              animate={{ background: i < revealed ? TICK.ok : i === revealed ? TICK.current : TICK.todo }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: 3 }}
            />
          ))}
        </div>

        <span className="text-[11.5px] font-extrabold shrink-0 uppercase tracking-[0.08em]" style={{ color: '#6B7C66' }}>
          qadam
        </span>
      </div>

      <div className="px-4 mt-3">
        {/* Masala sharti */}
        <div className="relative" style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}>
          <span
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 5, borderRadius: '16px 0 0 16px', background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }}
          />
          <div className="pl-5 pr-4 py-4">
            <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
              {lesson.title} · masala sharti
            </p>
            <p className="mt-2 text-[16.5px] font-semibold leading-snug text-ink">{lesson.example.prompt}</p>
          </div>
        </div>

        {/* Qadamlar */}
        <div className="mt-4 space-y-2.5">
          {steps.map((s, i) => (
            <AnimatePresence key={i}>
              {i < revealed ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex items-start gap-3 overflow-hidden"
                  style={{ ...CARD, borderRadius: 14, background: '#FBFCF8' }}
                >
                  <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: '#5FAF22' }} />
                  <span
                    className="num ml-3 w-[26px] h-[26px] flex items-center justify-center shrink-0 text-[12px] font-black"
                    style={{ background: '#DDF3DC', color: '#0B6E4F', borderRadius: 8 }}
                  >
                    {i + 1}
                  </span>
                  <p className="flex-1 py-3.5 pr-4 text-[14px] leading-relaxed text-ink-2">{s}</p>
                </motion.div>
              ) : (
                i === revealed && (
                  <button
                    onClick={revealNext}
                    className="w-full h-[54px] flex items-center justify-center gap-2 text-[13.5px] font-extrabold active:scale-[0.99] transition-transform"
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px dashed #CFD9C6',
                      borderRadius: 14,
                      color: '#0E1A12',
                    }}
                  >
                    <Lightbulb size={16} style={{ color: '#B87A22' }} />
                    {i === 0 ? '1-qadamni ko\'rish' : `${i + 1}-qadamni ko'rish`}
                  </button>
                )
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Javob */}
        {allSeen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-4 overflow-hidden"
            style={{ background: '#0E1A12', borderRadius: 14, boxShadow: '0 10px 24px rgba(14,26,18,0.22)' }}
          >
            <span
              className="absolute left-0 top-0 bottom-0"
              style={{ width: 5, background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }}
            />
            <div className="pl-5 pr-4 py-4 flex items-center justify-between gap-3">
              <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: 'rgba(205,233,174,0.55)' }}>
                Javob
              </p>
              <p className="num font-mono text-[16px] font-extrabold" style={{ color: '#9BE04B' }}>
                {lesson.example.answer}
              </p>
            </div>
          </motion.div>
        )}

        {/* Testga o'tish — qulf zanjiri */}
        <button
          disabled={!allSeen}
          onClick={toTest}
          className="mt-5 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
          style={allSeen
            ? LIME_BTN
            : { background: '#EAEEE3', color: '#9AA995', borderRadius: 12 }}
        >
          {!allSeen && <Lock size={15} />}
          {allSeen ? 'Testga o\'tish' : 'Avval yechimni to\'liq ko\'ring'}
          {allSeen && <ChevronRight size={16} />}
        </button>

        {allSeen && (
          <p className="mt-3 text-center text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
            <Check size={11} className="inline -mt-0.5" style={{ color: '#5FAF22' }} /> Misol bajarildi deb belgilandi
          </p>
        )}
      </div>
    </div>
  )
}

export default ExampleScreen
