import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Play, Check, ChevronRight, Crown } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { LESSONS } from '../data/content'
import { useApp, freeLessonCount } from '../store/useStore'
import type { Stage } from '../store/useStore'

const STAGE_LABEL: Record<Stage, string> = {
  new: 'Boshlash',
  video: 'Misolga o\'tish',
  example: 'Testga o\'tish',
  test: 'Testga o\'tish',
  done: 'Yakunlangan',
}

/**
 * 3-qadam: Kurslar — barcha darslar ro'yxati.
 * Qulf mantiqi: 1–10 bepul, 11+ faqat Pro.
 * Bosilganda doim VIDEO ga olib kiradi (zanjir boshi).
 */
const CoursesScreen = () => {
  const navigate = useNavigate()
  const isPro = useApp(s => s.isPro)
  const lessonsState = useApp(s => s.lessons)
  const coin = useApp(s => s.coin)

  const stageOf = (id: number): Stage => {
    const p = lessonsState[id]
    if (!p) return 'new'
    if (p.testScore !== null) return 'done'
    if (p.exampleDone) return 'test'
    if (p.videoWatched) return 'example'
    return 'new'
  }

  const open = (id: number, free: boolean) => {
    if (!free && !isPro) {
      triggerHaptic('warning')
      navigate('/pro', { state: { reason: 'lesson', lessonId: id } })
      return
    }
    triggerHaptic('medium')
    navigate(`/lesson/${id}`)
  }

  const freeDone = LESSONS.filter(l => l.free && stageOf(l.id) === 'done').length

  return (
    <div className="min-h-screen pb-24 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Kurs</p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>DTM Matematika</p>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Free / Pro summary */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, #312E81 0%, #4338CA 65%, #6366F1 100%)',
            boxShadow: '0 8px 28px rgba(67,56,202,0.26)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm font-bold">Bepul darslar</p>
            <span className="text-indigo-200 text-xs font-bold">{freeDone}/{freeLessonCount} yakunlandi</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(freeDone / freeLessonCount) * 100}%`, background: '#FFFFFF' }}
            />
          </div>
          <p className="text-indigo-200/80 text-[11px] mt-2">
            Har dars: video → misol → test. Keyingi bosqich oldingisi tugagach ochiladi.
          </p>
        </div>
      </section>

      {/* Lessons */}
      <section className="px-4 space-y-2">
        {LESSONS.map(l => {
          const locked = !l.free && !isPro
          const stage = stageOf(l.id)
          const done = stage === 'done'

          return (
            <motion.button
              key={l.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => open(l.id, l.free)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${locked ? '#E2E8F0' : done ? '#A7F3D0' : '#E2E8F0'}`,
                opacity: locked ? 0.72 : 1,
              }}
            >
              {/* Status */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: locked ? '#F8FAFC' : done ? '#ECFDF5' : stage === 'new' ? '#EEF2FF' : '#FEF3C7',
                  color: locked ? '#94A3B8' : done ? '#059669' : stage === 'new' ? '#4338CA' : '#D97706',
                }}
              >
                {locked ? <Lock size={16} /> : done ? <Check size={17} /> : <Play size={15} />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>
                  {l.id}. {l.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>
                    {l.topic} · {l.duration} daqiqa
                  </span>
                </div>
              </div>

              {/* Stage hint */}
              <div className="shrink-0 text-right">
                {!l.free && !isPro ? (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg"
                    style={{ background: '#FFFBEB', color: '#D97706' }}
                  >
                    <Crown size={11} /> PRO
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: done ? '#059669' : '#4338CA' }}
                  >
                    {STAGE_LABEL[stage]}
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </section>

      {/* Coin balance hint */}
      <section className="px-4 mt-5">
        <div
          className="rounded-xl p-3.5 flex items-center justify-between"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
        >
          <span className="text-xs font-bold" style={{ color: '#D97706' }}>Sizning balansingiz</span>
          <span className="text-sm font-extrabold" style={{ color: '#D97706' }}>{coin} coin</span>
        </div>
      </section>
    </div>
  )
}

export default CoursesScreen
