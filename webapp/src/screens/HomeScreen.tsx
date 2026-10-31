import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coins, Flame, Play, BookOpen, Target, Sigma, Crown, Zap, ChevronRight } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { LESSONS } from '../data/content'
import { useApp, freeLessonCount } from '../store/useStore'

/**
 * Home — kurs holati va asosiy yo'naltirishlar.
 * Qoida: bu yerda majburiy ketma-ketlik boshlanadi (Home → Kurslar → Dars → Misol → Test → Natija).
 * Sababsiz modal yo'q: Pro taklifi faqat foydalanuvchi o'zi bosganda ochiladi.
 */
const TOPIC_COLORS: Record<string, string> = {
  Algebra: 'bg-blue-50 text-blue-600',
  Trigonometriya: 'bg-violet-50 text-violet-600',
  Analiz: 'bg-indigo-50 text-indigo-600',
  Statistika: 'bg-teal-50 text-teal-600',
  Olimpiada: 'bg-rose-50 text-rose-600',
  'DTM Prep': 'bg-amber-50 text-amber-700',
  Geometriya: 'bg-emerald-50 text-emerald-700',
}

const fmtDur = (min: number) => `${min} min`

const HomeScreen = () => {
  const navigate = useNavigate()

  const name = useApp(s => s.name)
  const coin = useApp(s => s.coin)
  const xp = useApp(s => s.xp)
  const level = useApp(s => s.level)
  const streak = useApp(s => s.streak)
  const isPro = useApp(s => s.isPro)
  const lessonsState = useApp(s => s.lessons)
  const solvedCount = useApp(s => s.solvedCount)

  const freeLessons = LESSONS.filter(l => l.free)
  const proLessons = LESSONS.filter(l => !l.free)
  const isDone = (id: number) => lessonsState[id]?.testScore != null
  const doneFree = freeLessons.filter(l => isDone(l.id)).length
  const progress = Math.round((doneFree / freeLessonCount) * 100)

  // Davom etish: oxirgi ochilgan yoki hali tugamagan birinchi bepul dars
  const current =
    LESSONS.find(l => lessonsState[l.id]?.videoWatched && !isDone(l.id))
    ?? freeLessons.find(l => !isDone(l.id))
    ?? null

  const openLesson = (id: number, free: boolean) => {
    if (!free && !isPro) {
      triggerHaptic('warning')
      navigate('/pro', { state: { reason: 'lesson', lessonId: id } })
      return
    }
    triggerHaptic('medium')
    navigate(`/lesson/${id}`)
  }

  return (
    <div className="min-h-screen pb-24 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* ── Header ── */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-20" style={{ background: '#F1F4F9' }}>
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2.5 text-left">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}>
            {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>Salom,</p>
            <p className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>{name}</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold" style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#EA580C' }}>
            <Flame size={13} />
            <span>{streak}</span>
          </div>
          <button
            onClick={() => { triggerHaptic('light'); navigate('/shop') }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold"
            style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#D97706' }}
          >
            <Coins size={13} />
            <span>{coin.toLocaleString()}</span>
          </button>
        </div>
      </header>

      {/* ── Kurs progress ── */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #312E81 0%, #4338CA 65%, #6366F1 100%)',
            boxShadow: '0 8px 32px rgba(67,56,202,0.28)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <p className="text-indigo-200 text-xs font-semibold mb-0.5 relative z-10">DTM Matematika to'liq kursi</p>
          <h2 className="text-lg font-extrabold text-white mb-3 relative z-10 leading-snug">
            Bepul darslar: {doneFree}/{freeLessonCount}
          </h2>

          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#FFFFFF' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>

          {current ? (
            <button
              onClick={() => openLesson(current.id, current.free)}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#FFFFFF', color: '#4338CA', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              <Play size={15} fill="#4338CA" />
              <span className="truncate">Davom etish — {current.title}</span>
            </button>
          ) : (
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/courses') }}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <BookOpen size={15} /> Barcha darslar
            </button>
          )}
        </div>
      </section>

      {/* ── Yo'naltirishlar ── */}
      <section className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: <BookOpen size={18} />, label: 'Kurslar', sub: `${LESSONS.length} dars`, to: '/courses', bg: '#EEF2FF', fg: '#4338CA' },
            { icon: <Target size={18} />, label: 'Masalalar', sub: 'coin to\'plash', to: '/problems', bg: '#ECFDF5', fg: '#059669' },
            { icon: <Sigma size={18} />, label: 'Formulalar', sub: 'tez eslatma', to: '/formulas', bg: '#FFF7E6', fg: '#B45309' },
          ].map((c, i) => (
            <button
              key={i}
              onClick={() => { triggerHaptic('light'); navigate(c.to) }}
              className="rounded-2xl p-3.5 text-left active:scale-[0.97] transition-transform"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: c.bg, color: c.fg }}>
                {c.icon}
              </span>
              <p className="text-[13px] font-bold" style={{ color: '#0F172A' }}>{c.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{c.sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Statistika ── */}
      <section className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: solvedCount, label: 'Masala', sub: 'yechildi' },
            { val: doneFree, label: 'Dars', sub: 'tugadi' },
            { val: `Lvl ${level}`, label: 'Daraja', sub: `${xp} XP` },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <p className="text-lg font-extrabold" style={{ color: '#0F172A' }}>{s.val}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#94A3B8' }}>{s.label} {s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bepul darslar (10 ta) ── */}
      <section className="px-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full" style={{ background: '#4338CA' }} />
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Bepul darslar</h3>
          </div>
          <button onClick={() => navigate('/courses')} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: '#4338CA' }}>
            Hammasi <ChevronRight size={13} />
          </button>
        </div>

        <div className="space-y-2">
          {freeLessons.slice(0, 5).map(lesson => {
            const p = lessonsState[lesson.id]
            const done = isDone(lesson.id)
            const isCurrent = current?.id === lesson.id
            return (
              <button
                key={lesson.id}
                onClick={() => openLesson(lesson.id, true)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all active:scale-[0.985]"
                style={{
                  background: isCurrent ? '#EEF2FF' : '#FFFFFF',
                  border: `1px solid ${isCurrent ? '#4338CA' : '#E2E8F0'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: done ? '#ECFDF5' : isCurrent ? '#4338CA' : '#F8FAFC',
                    color: done ? '#059669' : isCurrent ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  {done ? '✓' : isCurrent ? <Play size={13} fill="currentColor" /> : lesson.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate leading-snug"
                    style={{ color: done ? '#94A3B8' : '#0F172A', textDecoration: done ? 'line-through' : 'none' }}
                  >
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-medium" style={{ color: '#CBD5E1' }}>{fmtDur(lesson.duration)}</span>
                    <span style={{ color: '#E2E8F0' }}>·</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${TOPIC_COLORS[lesson.topic] || 'bg-slate-50 text-slate-500'}`}>
                      {lesson.topic}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg shrink-0" style={{ background: '#4338CA', color: '#FFFFFF' }}>
                    Kur
                  </span>
                )}
                {done && p?.testScore !== null && p?.testScore !== undefined && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 flex items-center gap-0.5" style={{ background: '#FFF7E6', color: '#B45309' }}>
                    <Zap size={10} /> {p.testScore}/{p.testTotal}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Pro darslar ── */}
      <section className="px-4 mb-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full" style={{ background: '#D97706' }} />
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Pro darslar</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
            PRO
          </span>
        </div>

        <div className="space-y-2">
          {proLessons.slice(0, 3).map(lesson => (
            <button
              key={lesson.id}
              onClick={() => openLesson(lesson.id, false)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left opacity-75 active:scale-[0.985] transition-transform"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FFFBEB' }}>
                <Crown size={14} style={{ color: '#D97706' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>{lesson.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-medium" style={{ color: '#CBD5E1' }}>{fmtDur(lesson.duration)}</span>
                  <span style={{ color: '#E2E8F0' }}>·</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${TOPIC_COLORS[lesson.topic] || 'bg-slate-50 text-slate-500'}`}>
                    {lesson.topic}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-lg shrink-0" style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>
                PRO
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
          className="w-full mt-4 py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', boxShadow: '0 4px 16px rgba(217,119,6,0.3)' }}
        >
          <Crown size={16} /> Pro obunani olish — 79 000 so'm/oy
        </button>
      </section>

      {/* ── Blitz ── */}
      <section className="px-4">
        <button
          onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', boxShadow: '0 6px 20px rgba(15,23,42,0.25)' }}
        >
          <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.18)' }}>
            <Zap size={18} style={{ color: '#F87171' }} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Blitz Duel</p>
            <p className="text-[11px]" style={{ color: '#94A3B8' }}>1v1 real vaqtda poyga</p>
          </div>
          <ChevronRight size={16} style={{ color: '#64748B' }} />
        </button>
      </section>
    </div>
  )
}

export default HomeScreen
