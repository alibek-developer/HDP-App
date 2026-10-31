import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Lightbulb, Lock, Check } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { findLesson } from '../data/content'
import { useApp } from '../store/useStore'

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F1F4F9' }}>
        <button onClick={() => navigate('/courses')} className="text-sm font-bold" style={{ color: '#4338CA' }}>
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: '#F1F4F9' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <Lock size={22} style={{ color: '#4338CA' }} />
        </div>
        <p className="text-base font-bold text-center" style={{ color: '#0F172A' }}>Avval videoni ko\'ring</p>
        <p className="text-xs text-center" style={{ color: '#64748B' }}>Misol video oxirigacha ko\'rilgach ochiladi.</p>
        <button
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className="mt-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
          style={{ background: '#4338CA' }}
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
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate(`/lesson/${lesson.id}`) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Misol</p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{lesson.title}</p>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Step rail */}
      <div className="flex items-center gap-2 px-6 mb-5">
        <StepDot on label="Video" />
        <StepLine on />
        <StepDot on={allSeen} label="Misol" />
        <StepLine on={allSeen} />
        <StepDot on={false} label="Test" />
      </div>

      {/* Problem */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4338CA' }}>
            Masala sharti
          </p>
          <p className="text-base font-semibold leading-snug" style={{ color: '#0F172A' }}>
            {lesson.example.prompt}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 mb-4 space-y-2">
        {steps.map((s, i) => (
          <AnimatePresence key={i}>
            {i < revealed ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black text-white"
                  style={{ background: '#4338CA' }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#312E81' }}>{s}</p>
              </motion.div>
            ) : (
              i === revealed && (
                <button
                  onClick={revealNext}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm"
                  style={{ background: '#FFFFFF', border: '1.5px dashed #CBD5E1', color: '#4338CA' }}
                >
                  <Lightbulb size={16} />
                  {i === 0 ? 'Yechimning 1-qadamini ko\'rish' : `${i + 1}-qadamni ko'rish`}
                </button>
              )
            )}
          </AnimatePresence>
        ))}
      </section>

      {/* Answer */}
      {allSeen && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-5"
        >
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}
          >
            <span className="text-xs font-bold" style={{ color: '#065F46' }}>Javob</span>
            <span className="text-sm font-extrabold font-mono" style={{ color: '#059669' }}>
              {lesson.example.answer}
            </span>
          </div>
        </motion.section>
      )}

      {/* Gated CTA */}
      <section className="px-4">
        <button
          disabled={!allSeen}
          onClick={toTest}
          className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={allSeen
            ? { background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#FFFFFF', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }
            : { background: '#E2E8F0', color: '#94A3B8' }}
        >
          {!allSeen && <Lock size={15} />}
          {allSeen ? 'Testga o\'tish →' : 'Avval yechimni to\'liq ko\'ring'}
        </button>
        {allSeen && (
          <p className="text-center text-[11px] mt-2" style={{ color: '#94A3B8' }}>
            <Check size={11} className="inline -mt-0.5" /> Misol bajarildi deb belgilandi
          </p>
        )}
      </section>
    </div>
  )
}

const StepDot = ({ on, label }: { on: boolean; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="w-2.5 h-2.5 rounded-full" style={{ background: on ? '#059669' : '#CBD5E1' }} />
    <span className="text-[9px] font-bold" style={{ color: on ? '#059669' : '#94A3B8' }}>{label}</span>
  </div>
)

const StepLine = ({ on }: { on: boolean }) => (
  <span className="flex-1 h-0.5 rounded-full -mt-3.5" style={{ background: on ? '#059669' : '#E2E8F0' }} />
)

export default ExampleScreen
