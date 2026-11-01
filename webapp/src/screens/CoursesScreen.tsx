import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Crown, Lock, Play, Coins } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { LESSONS } from '../data/content'
import { SUBJECTS, topicLessonIds } from '../data/subjects'
import { useApp, freeLessonCount } from '../store/useStore'
import type { Stage } from '../store/useStore'
import { BODY, CARD, TICK } from '../styles/solver'

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
  const exit = useBack('/home')
  const isPro = useApp(s => s.isPro)
  const lessonsState = useApp(s => s.lessons)
  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)

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
  const freeLessons = LESSONS.filter(l => l.free)
  const firstOpen = freeLessons.find(l => stageOf(l.id) !== 'done')?.id

  const ledger = [
    { v: LESSONS.filter(l => lessonsState[l.id]?.videoWatched).length, u: 'video ko\'rildi' },
    { v: LESSONS.filter(l => lessonsState[l.id]?.exampleDone).length, u: 'misol ishlandi' },
    { v: LESSONS.filter(l => lessonsState[l.id]?.testScore !== null && lessonsState[l.id]?.testScore !== undefined).length, u: 'test topshirildi' },
  ]

  return (
    <div className="min-h-screen pb-28 select-none font-sans" style={{ background: BODY }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <button
          onClick={exit}
          aria-label="Orqaga"
          className="w-[38px] h-[38px] flex items-center justify-center active:scale-[0.96] transition-transform"
          style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
        >
          <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center min-w-0 px-2">
          <p className="text-tiny uppercase tracking-[0.16em] font-extrabold" style={{ color: '#6B7C66' }}>Kurs</p>
          <p className="mt-0.5 text-[15px] font-extrabold text-ink leading-none">DTM Matematika</p>
        </div>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/shop') }}
          className="w-[38px] h-[38px] flex flex-col items-center justify-center active:scale-[0.96] transition-transform"
          style={{ background: '#FCF1DC', border: '1px solid #E8A33D', borderRadius: 12 }}
          aria-label="Hamyon"
        >
          <Coins size={12} style={{ color: '#B87A22' }} />
          <span className="num text-[9.5px] font-extrabold leading-none mt-0.5" style={{ color: '#B87A22' }}>{coin}</span>
        </button>
      </header>

      {/* ── Fanlar ── */}
      <section className="px-4 mb-4">
        <div className="flex items-baseline justify-between px-1 mb-2">
          <h2 className="text-[15.5px] font-extrabold text-ink">Fanlar</h2>
          <span className="num text-[11px] font-bold" style={{ color: '#9AA995' }}>{SUBJECTS.length} ta</span>
        </div>
        <div className="space-y-2.5">
          {SUBJECTS.map(sub => {
            const loaded = sub.topics.filter(t => topicLessonIds(t.num).length > 0)
            const doneTopics = loaded.filter(t => topicLessonIds(t.num).every(id => topicLessons[id]?.done)).length
            return (
              <button
                key={sub.id}
                onClick={() => { triggerHaptic('medium'); navigate(`/subject/${sub.id}`) }}
                className="w-full flex items-center gap-3 pl-3.5 pr-3 py-3 text-left active:scale-[0.99] transition-transform"
                style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}
              >
                <span
                  className="num w-[36px] h-[36px] flex items-center justify-center shrink-0 text-[14px] font-extrabold"
                  style={loaded.length > 0
                    ? { background: '#0E1A12', color: '#9BE04B', borderRadius: 12 }
                    : { background: '#F1F4EE', color: '#9AA995', borderRadius: 12 }}
                >
                  {sub.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold truncate leading-tight text-ink">{sub.name}</p>
                  <p className="num mt-1 text-[10.5px] font-bold uppercase tracking-[0.04em]" style={{ color: '#9AA995' }}>
                    {loaded.length > 0
                      ? `${loaded.length} ta mavzu · ${doneTopics}/${loaded.length} tugadi`
                      : 'Mavzular hali yuklanmagan'}
                  </p>
                </div>
                <span className="shrink-0 text-right">
                  <span className="block text-[10px] font-extrabold uppercase" style={{ color: loaded.length > 0 ? '#0B6E4F' : '#9AA995' }}>
                    {loaded.length > 0 ? 'Nazariya' : 'Tez orada'}
                  </span>
                  <ChevronRight size={15} className="inline-block mt-1" style={{ color: '#9AA995' }} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Bepul darslar: kvantli progress ── */}
      <section className="px-4 mb-4">
        <div className="relative overflow-hidden" style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}>
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 6, background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }} />
          <div className="pl-5 pr-4 py-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                  Bepul darslar
                </p>
                <p className="num mt-1.5 text-[26px] font-extrabold leading-none text-ink">
                  {freeDone}
                  <span style={{ color: '#9AA995' }}>/{freeLessonCount}</span>
                </p>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#5FAF22' }}>
                {Math.round((freeDone / freeLessonCount) * 100)}%
              </p>
            </div>

            <div className="mt-3.5 flex gap-[3px]">
              {freeLessons.map(l => {
                const done = stageOf(l.id) === 'done'
                const current = !done && l.id === firstOpen
                return (
                  <motion.span
                    key={l.id}
                    className="flex-1 h-[16px]"
                    initial={false}
                    animate={{
                      background: done
                        ? 'linear-gradient(180deg, #9BE04B 0%, #7ED321 100%)'
                        : current ? '#0E1A12' : '#EAEEE3',
                    }}
                    transition={{ duration: 0.4, delay: l.id * 0.02 }}
                    style={{ borderRadius: 4 }}
                  />
                )
              })}
            </div>

            <div className="mt-4 flex items-stretch" style={{ borderTop: '1px solid #EDF1E7', paddingTop: 14 }}>
              {ledger.map((cell, i) => (
                <div key={cell.u} className="flex-1 flex items-center">
                  {i > 0 && <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />}
                  <div className="flex-1 px-2">
                    <p className="num text-[17px] font-extrabold leading-none" style={{ color: '#0E1A12' }}>{cell.v}</p>
                    <p className="mt-1.5 text-[9.5px] font-bold uppercase leading-tight" style={{ color: '#9AA995' }}>
                      {cell.u}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3.5 text-[11.5px] font-medium leading-snug" style={{ color: '#6B7C66' }}>
              Har dars: <span className="font-extrabold" style={{ color: '#33452F' }}>video → misol → test</span>.
              Keyingi bosqich oldingisi tugagach ochiladi.
            </p>
          </div>
        </div>
      </section>

      {/* ── Darslar ro'yxati — yagona varaq, soch sovu chiziqlar ── */}
      <section className="px-4">
        <p className="text-tiny uppercase tracking-[0.14em] font-extrabold mb-2 px-1" style={{ color: '#6B7C66' }}>
          Barcha darslar
        </p>
        <div style={{ ...CARD, borderRadius: 16 }}>
          {LESSONS.map((l, idx) => {
            const locked = !l.free && !isPro
            const stage = stageOf(l.id)
            const done = stage === 'done'
            const started = !done && stage !== 'new'

            const tileStyle: React.CSSProperties = locked
              ? { background: '#FBFCF8', border: '1px solid #E1E7DA', color: '#9AA995' }
              : done
                ? { background: '#DDF3DC', color: '#0B6E4F' }
                : started
                  ? { background: '#0E1A12', color: '#9BE04B' }
                  : { background: '#FFFFFF', border: '1px solid #E1E7DA', color: '#33452F' }

            const ticks = [
              !!lessonsState[l.id]?.videoWatched,
              !!lessonsState[l.id]?.exampleDone,
              stage === 'done',
            ]

            return (
              <motion.button
                key={l.id}
                whileTap={{ scale: 0.995 }}
                onClick={() => open(l.id, l.free)}
                className="w-full flex items-center gap-3 pl-3.5 pr-3 py-3.5 text-left"
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid #EDF1E7',
                  opacity: locked ? 0.82 : 1,
                  borderRadius: idx === 0 ? '16px 16px 0 0' : idx === LESSONS.length - 1 ? '0 0 16px 16px' : 0,
                  background: locked ? '#FBFCF8' : '#FFFFFF',
                }}
              >
                <span
                  className="num w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[15px] font-extrabold"
                  style={{ ...tileStyle, borderRadius: 12 }}
                >
                  {locked ? <Lock size={15} /> : done ? <Check size={17} /> : started ? <Play size={14} /> : l.id}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold truncate leading-tight text-ink">
                    {l.title}
                  </p>
                  <p className="num mt-1 text-[10.5px] font-bold uppercase tracking-[0.04em]" style={{ color: '#9AA995' }}>
                    {l.topic} · {l.duration} daq · {l.questions.length} savol
                  </p>
                  {!locked && (
                    <div className="mt-2 flex gap-1">
                      {ticks.map((on, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[4px]"
                          style={{ borderRadius: 2, background: on ? TICK.ok : '#EAEEE3' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {locked ? (
                    <span
                      className="num flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-1"
                      style={{ background: '#FCF1DC', color: '#B87A22', borderRadius: 7 }}
                    >
                      <Crown size={10} /> Pro
                    </span>
                  ) : (
                    <>
                      <p
                        className="text-[10px] font-extrabold uppercase leading-tight"
                        style={{ color: done ? '#0B6E4F' : started ? '#B87A22' : '#6B7C66' }}
                      >
                        {STAGE_LABEL[stage]}
                      </p>
                      <ChevronRight size={15} className="inline-block mt-1" style={{ color: '#9AA995' }} />
                    </>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* ── Pro taklif ── */}
      <section className="px-4 mt-4">
        <button
          onClick={() => { triggerHaptic('warning'); navigate('/pro', { state: { reason: 'lesson' } }) }}
          className="w-full flex items-center gap-3 pl-4 pr-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
          style={{ background: '#FFFFFF', border: '1px dashed #CFD9C6', borderRadius: 16 }}
        >
          <span
            className="w-[38px] h-[38px] flex items-center justify-center shrink-0"
            style={{ background: '#FCF1DC', borderRadius: 12, color: '#B87A22' }}
          >
            <Crown size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-extrabold text-ink leading-tight">
              {LESSONS.length - freeLessonCount} ta dars Pro'da
            </p>
            <p className="mt-0.5 text-[11.5px] font-semibold" style={{ color: '#6B7C66' }}>
              Olimpiada mavzulari, sinovlar va ustoz tekshiruvi
            </p>
          </div>
          <ChevronRight size={16} style={{ color: '#9AA995' }} />
        </button>
      </section>
    </div>
  )
}

export default CoursesScreen
