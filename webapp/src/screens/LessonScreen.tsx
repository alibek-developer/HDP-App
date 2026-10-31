import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Play, Pause, MessageCircle, Check, Lock, Send } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { findLesson } from '../data/content'
import { useApp } from '../store/useStore'

/** Demo tezligi: real dars davomiyligi ~10 soniyada tugadi hisoblanadi */
const DEMO_MS = 10000

/**
 * 4-qadam: Video dars.
 * MUHOIM LOGIKA: «Misolga o'tish» tugmasi faqat video OXIRIGACHA
 * ko'rilgandan keyin aktiv bo'ladi.
 */
const LessonScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const lesson = findLesson(Number(id))

  const videoWatched = useApp(s => !!s.lessons[Number(id)]?.videoWatched)
  const canOpenLesson = useApp(s => s.canOpenLesson)
  const markVideoWatched = useApp(s => s.markVideoWatched)
  const startLesson = useApp(s => s.startLesson)

  const [playing, setPlaying] = useState(videoWatched)
  const [progress, setProgress] = useState(videoWatched ? 100 : 0)
  const [askOpen, setAskOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (lesson) startLesson(lesson.id)
  }, [lesson?.id])

  /* Simulyatsiya: play holatida progress oldinga suriladi */
  useEffect(() => {
    if (!playing || videoWatched) return
    const started = Date.now()
    const base = progress
    const tick = () => {
      const pct = base + ((Date.now() - started) / DEMO_MS) * 100
      if (pct >= 100) {
        setProgress(100)
        setPlaying(false)
        markVideoWatched(lesson!.id)
        triggerHaptic('success')
        return
      }
      setProgress(pct)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [playing])

  if (!lesson) return <NotFound onBack={() => navigate('/courses')} />

  // Zanjir qoidasi: Pro dars faqat obunachilarga
  if (!canOpenLesson(lesson.id)) {
    return (
      <GateScreen
        onBack={() => navigate('/pro', { state: { reason: 'lesson', lessonId: lesson.id } })}
        title="Bu dars Pro uchun"
        sub="10 ta bepul darsni tugating yoki Pro obuna bilan barchasini oching."
        cta="Pro ni ko'rish"
      />
    )
  }

  const watched = videoWatched || progress >= 100
  const totalSec = lesson.duration * 60
  const cur = Math.floor((progress / 100) * totalSec)
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center min-w-0 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            Dars #{lesson.id} · {lesson.topic}
          </p>
          <p className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>{lesson.title}</p>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Player */}
      <section className="px-4 mb-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0F0E2A 0%, #1A1748 100%)',
            aspectRatio: '16/9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 16px, rgba(99,102,241,0.3) 16px, rgba(99,102,241,0.3) 17px)',
            }}
          />

          <div className="absolute top-3 left-3">
            <span
              className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.25)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              USTOZ AZAMAT
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <div
              className="font-mono text-sm font-bold mb-4 px-3 py-2 rounded-xl text-center"
              style={{ color: '#A5B4FC', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              {lesson.example.steps[0] ?? lesson.summary}
            </div>

            <button
              onClick={() => { if (watched) return; triggerHaptic('light'); setPlaying(p => !p) }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: watched
                  ? 'rgba(255,255,255,0.12)'
                  : 'linear-gradient(135deg, #4338CA, #6366F1)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
            >
              {watched
                ? <Check size={22} color="#6EE7B7" />
                : playing
                  ? <Pause size={20} color="#fff" />
                  : <Play size={20} color="#fff" style={{ marginLeft: 2 }} />}
            </button>

            {watched && (
              <p className="text-emerald-300 text-[11px] font-bold mt-3">✓ Video ko'rildi</p>
            )}
          </div>

          {/* Scrubber */}
          <div className="absolute bottom-0 left-0 right-0">
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.12)' }}>
              <div
                style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4338CA, #6366F1)' }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{fmt(cur)}</span>
          <span className="text-[10px] font-semibold" style={{ color: '#CBD5E1' }}>
            {lesson.duration} daqikalik dars · demo tezlashtirilgan
          </span>
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{fmt(totalSec)}</span>
        </div>
      </section>

      {/* Summary */}
      <section className="px-4 mb-4">
        <div className="rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>Mavzu haqida</p>
          <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{lesson.summary}</p>
        </div>
      </section>

      {/* Ustozga savol */}
      <section className="px-4 mb-4">
        <button
          onClick={() => { triggerHaptic('light'); setAskOpen(true) }}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#4338CA' }}>
            <MessageCircle size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Ustozga savol berish</p>
            <p className="text-[11px]" style={{ color: '#94A3B8' }}>Tushunmagan joyingizni yozing — javob qaytaramiz</p>
          </div>
          <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
        </button>
      </section>

      {/* Gated CTA — video tugagachina aktiv */}
      <section className="px-4">
        <button
          disabled={!watched}
          onClick={() => { triggerHaptic('medium'); navigate(`/lesson/${lesson.id}/example`) }}
          className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={watched
            ? {
                background: 'linear-gradient(135deg, #4338CA, #6366F1)',
                color: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(67,56,202,0.28)',
              }
            : { background: '#E2E8F0', color: '#94A3B8' }}
        >
          {!watched && <Lock size={15} />}
          {watched ? 'Misolga o\'tish →' : 'Avval videoni oxirigacha ko\'ring'}
        </button>

        <div className="flex items-center gap-2 mt-3 px-1">
          <StepDot on={watched} label="Video" />
          <StepLine on={watched} />
          <StepDot on={false} label="Misol" />
          <StepLine on={false} />
          <StepDot on={false} label="Test" />
        </div>
      </section>

      {/* Savol yuborish modali — faqat bosish orqali ochiladi */}
      <AnimatePresence>
        {askOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAskOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.55)' }}
            />
            <motion.div
              initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto p-6"
              style={{ background: '#FFFFFF', borderRadius: '24px 24px 0 0' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E2E8F0' }} />
              <h3 className="text-lg font-extrabold mb-1" style={{ color: '#0F172A' }}>Ustozga savol</h3>
              <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                {lesson.title} · {lesson.topic}
              </p>

              {sent ? (
                <div className="p-4 rounded-xl text-center" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <p className="text-sm font-bold" style={{ color: '#059669' }}>✓ Savolingiz yuborildi</p>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>Ustoz 24 soat ichida javob beradi.</p>
                </div>
              ) : (
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={4}
                  placeholder="Masalan: diskriminant nima uchun manfiy bo'lsa ildiz chiqmaydi?"
                  className="w-full p-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
                />
              )}

              {!sent && (
                <button
                  disabled={!draft.trim()}
                  onClick={() => { triggerHaptic('success'); setSent(true) }}
                  className="w-full mt-3 py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
                >
                  <Send size={15} /> Yuborish
                </button>
              )}
              <button
                onClick={() => { setAskOpen(false); setSent(false); setDraft('') }}
                className="w-full mt-2 py-3 text-sm font-medium rounded-xl"
                style={{ background: '#F1F4F9', color: '#64748B' }}
              >
                Yopish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const StepDot = ({ on, label }: { on: boolean; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span
      className="w-2.5 h-2.5 rounded-full"
      style={{ background: on ? '#059669' : '#CBD5E1' }}
    />
    <span className="text-[9px] font-bold" style={{ color: on ? '#059669' : '#94A3B8' }}>{label}</span>
  </div>
)

const StepLine = ({ on }: { on: boolean }) => (
  <span className="flex-1 h-0.5 rounded-full -mt-3.5" style={{ background: on ? '#059669' : '#E2E8F0' }} />
)

const NotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#F1F4F9' }}>
    <p className="text-4xl mb-3">🧭</p>
    <p className="text-sm font-bold mb-4" style={{ color: '#0F172A' }}>Bunday dars topilmadi</p>
    <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: '#4338CA' }}>
      Kurslarga qaytish
    </button>
  </div>
)

const GateScreen = ({ onBack, title, sub, cta }: { onBack: () => void; title: string; sub: string; cta: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: '#F1F4F9' }}>
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#FFF7E6' }}>
      <Lock size={22} style={{ color: '#B45309' }} />
    </div>
    <p className="text-base font-bold text-center" style={{ color: '#0F172A' }}>{title}</p>
    <p className="text-xs text-center" style={{ color: '#64748B' }}>{sub}</p>
    <button onClick={onBack} className="mt-2 px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#4338CA' }}>
      {cta}
    </button>
  </div>
)

export default LessonScreen
