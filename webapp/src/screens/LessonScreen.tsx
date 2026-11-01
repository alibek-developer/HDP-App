import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Lock, MessageCircle, Pause, Play, Send } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { findLesson } from '../data/content'
import { useApp } from '../store/useStore'
import { AMBER_BTN, BODY, CARD, INK_BTN, LIME_BTN, OUT_BTN, TICK } from '../styles/solver'

/** Demo tezligi: real dars davomiyligi ~10 soniyada tugadi hisoblanadi */
const DEMO_MS = 10000

/**
 * 4-qadam: Video dars.
 * MUHOIM LOGIKA: «Misolga o'tish» tugmasi faqat video OXIRIGACHA
 * ko'rilgandan keyin aktiv bo'ladi.
 */
const LessonScreen = () => {
  const navigate = useNavigate()
  const exit = useBack('/courses')
  const { id } = useParams()
  const lesson = findLesson(Number(id))

  const videoWatched = useApp(s => !!s.lessons[Number(id)]?.videoWatched)
  const canOpenLesson = useApp(s => s.canOpenLesson)
  const markVideoWatched = useApp(s => s.markVideoWatched)
  const startLesson = useApp(s => s.startLesson)
  const beginSession = useApp(s => s.beginSession)

  const [playing, setPlaying] = useState(videoWatched)
  const [progress, setProgress] = useState(videoWatched ? 100 : 0)
  const [askOpen, setAskOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (lesson) {
      startLesson(lesson.id)
      beginSession()
    }
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
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: BODY }}>

      {/* ── Header ── */}
      <header className="flex items-start justify-between px-4 pt-5 pb-3">
        <button
          onClick={exit}
          aria-label="Orqaga"
          className="w-[38px] h-[38px] flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform"
          style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
        >
          <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex-1 min-w-0 px-3 pt-0.5">
          <p className="num text-tiny uppercase tracking-[0.16em] font-extrabold text-center" style={{ color: '#6B7C66' }}>
            Dars {String(lesson.id).padStart(2, '0')} · {lesson.topic}
          </p>
          <p className="mt-1 text-[15px] font-extrabold leading-tight text-center text-ink truncate">
            {lesson.title}
          </p>
        </div>
        <span
          className="num w-[38px] h-[38px] flex items-center justify-center shrink-0 text-[13px] font-extrabold"
          style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
        >
          {String(lesson.id).padStart(2, '0')}
        </span>
      </header>

      {/* ── Player: siyoh varaq ── */}
      <section className="px-4 mb-3">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%)',
            borderRadius: 18,
            aspectRatio: '16/9',
            boxShadow: '0 12px 26px rgba(14,26,18,0.22)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 22px, rgba(205,233,174,0.5) 22px, rgba(205,233,174,0.5) 23px)',
            }}
          />

          <div className="absolute top-3 left-3 z-10">
            <span
              className="num flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] px-2 py-1.5"
              style={{ background: 'rgba(155,224,75,0.14)', border: '1px solid rgba(155,224,75,0.32)', borderRadius: 8, color: '#CDE9AE' }}
            >
              <span
                className={`w-[6px] h-[6px] ${playing ? 'animate-pulse' : ''}`}
                style={{ background: watched ? '#9BE04B' : '#E8A33D', borderRadius: 2 }}
              />
              Ustoz Azamat
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span
              className="num text-[10px] font-extrabold uppercase px-2 py-1.5"
              style={{ background: 'rgba(205,233,174,0.10)', borderRadius: 8, color: 'rgba(205,233,174,0.65)' }}
            >
              {lesson.questions.length} savol
            </span>
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
            <div
              className="font-mono text-[11.5px] font-bold mb-4 px-3 py-2 w-full max-w-[300px] text-center leading-snug break-words"
              style={{ color: '#CDE9AE', background: 'rgba(14,26,18,0.45)', border: '1px solid rgba(205,233,174,0.18)', borderRadius: 10 }}
            >
              {lesson.example.steps[0] ?? lesson.summary}
            </div>

            <button
              onClick={() => { if (watched) return; triggerHaptic('light'); setPlaying(p => !p) }}
              aria-label={watched ? 'Ko\'rildi' : playing ? 'Pauza' : 'Boshlash'}
              className="w-[58px] h-[58px] flex items-center justify-center active:scale-[0.95] transition-transform"
              style={watched
                ? { background: 'rgba(155,224,75,0.16)', border: '1px solid rgba(155,224,75,0.4)', borderRadius: 18, color: '#9BE04B' }
                : { ...LIME_BTN, borderRadius: 18, width: 58, height: 58 }}
            >
              {watched
                ? <Check size={24} />
                : playing
                  ? <Pause size={22} />
                  : <Play size={22} style={{ marginLeft: 2 }} />}
            </button>

            {watched && (
              <p className="num text-[10.5px] font-extrabold uppercase tracking-[0.1em] mt-3" style={{ color: '#9BE04B' }}>
                Video ko'rilgan
              </p>
            )}
          </div>

          {/* Scrubber */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div style={{ height: 4, background: 'rgba(205,233,174,0.12)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #9BE04B 0%, #5FAF22 100%)',
                  transition: playing ? 'none' : 'width 0.3s',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <span className="num text-[11.5px] font-extrabold" style={{ color: '#33452F' }}>{fmt(cur)}</span>
          <span className="text-[10.5px] font-bold uppercase tracking-[0.06em]" style={{ color: '#9AA995' }}>
            {lesson.duration} daq · demo tezlashtirilgan
          </span>
          <span className="num text-[11.5px] font-extrabold" style={{ color: '#9AA995' }}>{fmt(totalSec)}</span>
        </div>
      </section>

      {/* ── Zanjir holati: Video → Misol → Test ── */}
      <section className="px-4 mb-4">
        <div style={{ ...CARD, borderRadius: 14 }}>
          <div className="flex items-stretch px-2 py-2.5">
            {[
              { u: 'Video', on: watched },
              { u: 'Misol', on: false },
              { u: 'Test', on: false },
            ].map((cell, i) => (
              <div key={cell.u} className="flex-1 flex items-center">
                {i > 0 && <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />}
                <div className="flex-1 px-2">
                  <span
                    className="block h-[5px]"
                    style={{ borderRadius: 3, background: cell.on ? TICK.ok : '#EAEEE3' }}
                  />
                  <p
                    className="mt-2 text-[10px] font-extrabold uppercase text-center"
                    style={{ color: cell.on ? '#0B6E4F' : '#9AA995' }}
                  >
                    {cell.u}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mavzu haqida ── */}
      <section className="px-4 mb-4">
        <div className="relative" style={{ ...CARD, borderRadius: 16 }}>
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, borderRadius: '16px 0 0 16px', background: '#5FAF22' }} />
          <div className="pl-5 pr-4 py-4">
            <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
              Mavzu haqida
            </p>
            <p className="mt-2 text-[13.5px] font-medium leading-relaxed" style={{ color: '#33452F' }}>
              {lesson.summary}
            </p>
          </div>
        </div>
      </section>

      {/* ── Ustozga savol ── */}
      <section className="px-4 mb-4">
        <button
          onClick={() => { triggerHaptic('light'); setAskOpen(true) }}
          className="w-full flex items-center gap-3 pl-3.5 pr-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
          style={CARD}
        >
          <span
            className="w-[38px] h-[38px] flex items-center justify-center shrink-0"
            style={{ background: '#EDF7DE', borderRadius: 12, color: '#0B6E4F' }}
          >
            <MessageCircle size={17} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-extrabold text-ink leading-tight">Ustozga savol berish</p>
            <p className="mt-0.5 text-[11.5px] font-semibold" style={{ color: '#6B7C66' }}>
              Tushunmagan joyingizni yozing — javob qaytaramiz
            </p>
          </div>
          <ChevronRight size={16} style={{ color: '#9AA995' }} />
        </button>
      </section>

      {/* ── Gated CTA — video tugagachina aktiv ── */}
      <section className="px-4">
        <button
          disabled={!watched}
          onClick={() => { triggerHaptic('medium'); navigate(`/lesson/${lesson.id}/example`) }}
          className="w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
          style={watched
            ? LIME_BTN
            : { background: '#EAEEE3', color: '#9AA995', borderRadius: 12 }}
        >
          {!watched && <Lock size={15} />}
          {watched ? 'Misolga o\'tish' : 'Avval videoni oxirigacha ko\'ring'}
          {watched && <ChevronRight size={16} />}
        </button>
      </section>

      {/* ── Savol yuborish modali — faqat bosish orqali ochiladi ── */}
      <AnimatePresence>
        {askOpen && (
          <motion.div
            key="ask-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAskOpen(false)}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(14,26,18,0.55)' }}
          />
        )}
        {askOpen && (
          <motion.div
            key="ask-panel"
            initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto px-5 pt-3 pb-6"
              style={{ background: '#FFFFFF', borderRadius: '18px 18px 0 0', boxShadow: '0 -12px 32px rgba(14,26,18,0.18)' }}
            >
              <div className="w-10 h-[5px] rounded-full mx-auto mb-4" style={{ background: '#E1E7DA' }} />
              <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                Ustozga savol
              </p>
              <p className="mt-1.5 text-[14px] font-extrabold text-ink leading-tight">{lesson.title}</p>
              <p className="num mt-0.5 text-[11px] font-bold uppercase" style={{ color: '#9AA995' }}>
                {lesson.topic} · dars {String(lesson.id).padStart(2, '0')}
              </p>

              {sent ? (
                <div className="relative mt-4 overflow-hidden" style={{ background: '#DDF3DC', border: '1px solid #A7D8A0', borderRadius: 14 }}>
                  <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: '#5FAF22' }} />
                  <div className="pl-5 pr-4 py-4">
                    <p className="text-[13.5px] font-extrabold" style={{ color: '#0B4A34' }}>Savolingiz yuborildi</p>
                    <p className="mt-1 text-[12px] font-medium" style={{ color: '#0B6E4F' }}>
                      Ustoz 24 soat ichida javob beradi.
                    </p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={4}
                  placeholder="Masalan: diskriminant nima uchun manfiy bo'lsa ildiz chiqmaydi?"
                  className="w-full mt-4 p-3.5 text-[13.5px] font-medium outline-none resize-none"
                  style={{ background: '#FBFCF8', border: '1px solid #E1E7DA', borderRadius: 14, color: '#0E1A12' }}
                />
              )}

              {!sent && (
                <button
                  disabled={!draft.trim()}
                  onClick={() => { triggerHaptic('success'); setSent(true) }}
                  className="mt-3 w-full h-[50px] text-[14px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
                  style={draft.trim() ? LIME_BTN : { background: '#EAEEE3', color: '#9AA995', borderRadius: 12 }}
                >
                  <Send size={15} /> Yuborish
                </button>
              )}
              <button
                onClick={() => { setAskOpen(false); setSent(false); setDraft('') }}
                className="mt-2.5 w-full h-[46px] text-[13.5px] font-extrabold active:scale-[0.985] transition-transform"
                style={OUT_BTN}
              >
                Yopish
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const NotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
    <span
      className="w-[54px] h-[54px] flex items-center justify-center text-[22px] font-extrabold"
      style={{ background: '#EDF7DE', borderRadius: 16, color: '#0B6E4F', fontFamily: 'serif' }}
    >
      ?
    </span>
    <p className="text-[15px] font-extrabold text-ink">Bunday dars topilmadi</p>
    <button onClick={onBack} className="mt-1 w-full max-w-[240px] h-[48px] text-[13.5px] font-extrabold" style={INK_BTN}>
      Kurslarga qaytish
    </button>
  </div>
)

const GateScreen = ({ onBack, title, sub, cta }: { onBack: () => void; title: string; sub: string; cta: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
    <span
      className="w-[54px] h-[54px] flex items-center justify-center"
      style={{ background: '#FCF1DC', border: '1px solid #E8A33D', borderRadius: 16, color: '#B87A22' }}
    >
      <Lock size={22} />
    </span>
    <p className="mt-1 text-[16px] font-extrabold text-center text-ink">{title}</p>
    <p className="text-[12.5px] text-center leading-snug max-w-[260px]" style={{ color: '#6B7C66' }}>{sub}</p>
    <button
      onClick={onBack}
      className="mt-2 w-full max-w-[240px] h-[50px] text-[14px] font-extrabold"
      style={AMBER_BTN}
    >
      {cta}
    </button>
  </div>
)

export default LessonScreen
