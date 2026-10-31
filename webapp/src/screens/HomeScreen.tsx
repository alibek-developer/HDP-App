import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'
import { mockDailyProblem } from '../data/mockData'

const ALL_LESSONS = [
  // ── Bepul (10 ta) ──
  { id: 1,  title: 'Kvadrat tenglamalar asoslari',              dur: '18 min', topic: 'Algebra',        free: true,  done: true  },
  { id: 2,  title: 'Viyet teoremasi va qo\'llanilishi',         dur: '22 min', topic: 'Algebra',        free: true,  done: true  },
  { id: 3,  title: 'Parametrli tenglamalar',                    dur: '31 min', topic: 'Algebra',        free: true,  done: true  },
  { id: 4,  title: 'Trigonometrik funksiyalar kirish',          dur: '25 min', topic: 'Trigonometriya', free: true,  done: false, current: true },
  { id: 5,  title: 'Sinuslar va kosinuslar teoremasi',          dur: '28 min', topic: 'Trigonometriya', free: true,  done: false },
  { id: 6,  title: 'Logarifm va ko\'rsatkichli funksiyalar',    dur: '24 min', topic: 'Analiz',         free: true,  done: false },
  { id: 7,  title: 'Hosilalar va geometrik ma\'no',             dur: '35 min', topic: 'Analiz',         free: true,  done: false },
  { id: 8,  title: 'Integral asoslari',                         dur: '30 min', topic: 'Analiz',         free: true,  done: false },
  { id: 9,  title: 'Geometrik progressiya',                     dur: '20 min', topic: 'Algebra',        free: true,  done: false },
  { id: 10, title: 'Kombinatorika va ehtimollik',               dur: '26 min', topic: 'Statistika',     free: true,  done: false },
  // ── Pro (yopiq) ──
  { id: 11, title: 'Murakkab funksiyalar tahlili',              dur: '42 min', topic: 'Analiz',         free: false, done: false },
  { id: 12, title: 'IMO darajasidagi tenglamalar',              dur: '55 min', topic: 'Olimpiada',      free: false, done: false },
  { id: 13, title: 'DTM 2025 tahlili va strategiyasi',          dur: '48 min', topic: 'DTM Prep',       free: false, done: false },
  { id: 14, title: 'Vektorlar va koordinatalar',                dur: '38 min', topic: 'Geometriya',     free: false, done: false },
  { id: 15, title: 'Aniq integral va yuzalar',                  dur: '44 min', topic: 'Analiz',         free: false, done: false },
  { id: 16, title: 'Murakkab trigonometrik tengsizliklar',      dur: '50 min', topic: 'Trigonometriya', free: false, done: false },
]

const TOPIC_COLORS: Record<string, string> = {
  Algebra:        'bg-blue-50 text-blue-600',
  Trigonometriya: 'bg-violet-50 text-violet-600',
  Analiz:         'bg-indigo-50 text-indigo-600',
  Statistika:     'bg-teal-50 text-teal-600',
  Olimpiada:      'bg-rose-50 text-rose-600',
  'DTM Prep':     'bg-amber-50 text-amber-700',
  Geometriya:     'bg-emerald-50 text-emerald-700',
}

const HomeScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showProModal, setShowProModal] = useState(false)

  const doneFree  = ALL_LESSONS.filter(l => l.free && l.done).length
  const totalFree = ALL_LESSONS.filter(l => l.free).length
  const current   = ALL_LESSONS.find(l => l.current)
  const progress  = Math.round((doneFree / totalFree) * 100)
  const coins     = 340
  const streak    = 12

  // Pro modal — faqat 1 marta (per session), onboarding (Login) dan kelganda ko'rsatilmaydi
  useEffect(() => {
    const fromLogin = (location.state as any)?.from === '/login'
    if (!fromLogin && !sessionStorage.getItem('hdp_promo_seen')) {
      const t = setTimeout(() => {
        setShowProModal(true)
        sessionStorage.setItem('hdp_promo_seen', '1')
        triggerHaptic('light')
      }, 900)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="min-h-screen pb-24 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* ── Header ── */}
      <header
        className="px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-20"
        style={{ background: '#F1F4F9' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
          >
            SA
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>Salom,</p>
            <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Sardor Aliyev</p>
          </div>
        </div>

        {/* Coin + Streak */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold"
            style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#D97706' }}
          >
            <span>🔥</span>
            <span>{streak}</span>
          </div>
          <button
            onClick={() => { triggerHaptic('light'); navigate('/shop') }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold"
            style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#D97706' }}
          >
            <span>🪙</span>
            <span>{coins.toLocaleString()}</span>
          </button>
        </div>
      </header>

      {/* ── Progress banner ── */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #312E81 0%, #4338CA 65%, #6366F1 100%)',
            boxShadow: '0 8px 32px rgba(67,56,202,0.28)',
          }}
        >
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <p className="text-indigo-200 text-xs font-semibold mb-0.5 relative z-10">DTM Matematika to'liq kursi</p>
          <h2 className="text-lg font-extrabold text-white mb-3 relative z-10 leading-snug">
            Bepul darslaringiz: {doneFree}/{totalFree} ta
          </h2>

          {/* Progress bar */}
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: '#FFFFFF' }}
              />
            </div>
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>

          {/* Continue CTA */}
          {current ? (
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/video') }}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#FFFFFF', color: '#4338CA', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#4338CA"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Davom etish — {current.title}
            </button>
          ) : (
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              ✨ Pro darslarni ko'rish
            </button>
          )}
        </div>
      </section>

      {/* ── Kun masalasi + Blitz Duel ── */}
      <section className="px-4 mb-5">
        <div className="flex gap-2.5">
          <button
            onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
            className="flex-1 rounded-2xl p-4 text-left relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              boxShadow: '0 6px 20px rgba(15,23,42,0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <p className="relative z-10 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
              Kun masalasi · {mockDailyProblem.category}
            </p>
            <p className="relative z-10 text-sm font-bold text-white mt-1 leading-snug">
              {mockDailyProblem.title}
            </p>
            <p className="relative z-10 font-mono text-[11px] mt-1" style={{ color: '#94A3B8' }}>
              {mockDailyProblem.formula}
            </p>
            <div className="relative z-10 flex items-center gap-2 mt-2.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#FFFBEB', color: '#D97706' }}>
                +{mockDailyProblem.rewardCoin} 🪙
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#EEF2FF', color: '#4338CA' }}>
                +{mockDailyProblem.rewardXp} ⚡
              </span>
              <span className="text-[10px] font-bold ml-auto" style={{ color: '#A5B4FC' }}>Yechish →</span>
            </div>
          </button>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
            className="w-[104px] shrink-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 p-3"
            style={{
              background: 'linear-gradient(135deg, #DC2626, #F97316)',
              boxShadow: '0 6px 20px rgba(220,38,38,0.25)',
            }}
          >
            <span className="text-2xl">⚔️</span>
            <span className="text-xs font-extrabold text-white leading-tight text-center">Blitz<br />Duel</span>
            <span className="text-[9px] font-semibold" style={{ color: '#FECACA' }}>1v1 real-vaqt</span>
          </button>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: `${doneFree * 3}`, label: 'Masala',   sub: 'yechildi' },
            { val: `${doneFree}`,     label: 'Dars',     sub: 'ko\'rildi' },
            { val: `${coins}`,        label: 'Coin',     sub: 'to\'plandi' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <p className="text-lg font-extrabold" style={{ color: '#0F172A' }}>{s.val}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#94A3B8' }}>{s.label} {s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free lessons ── */}
      <section className="px-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full" style={{ background: '#4338CA' }} />
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Bepul darslar</h3>
          </div>
          <span className="text-xs font-semibold" style={{ color: '#94A3B8' }}>10 ta</span>
        </div>

        <div className="space-y-2">
          {ALL_LESSONS.filter(l => l.free).map(lesson => (
            <button
              key={lesson.id}
              onClick={() => { triggerHaptic('light'); navigate('/video') }}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
              style={{
                background: lesson.current ? '#EEF2FF' : '#FFFFFF',
                border: `1px solid ${lesson.current ? '#4338CA' : '#E2E8F0'}`,
              }}
            >
              {/* Status indicator */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                style={{
                  background: lesson.done ? '#ECFDF5' : lesson.current ? '#4338CA' : '#F8FAFC',
                  color:      lesson.done ? '#059669' : lesson.current ? '#FFFFFF'  : '#94A3B8',
                }}
              >
                {lesson.done ? '✓' : lesson.current ? '▶' : lesson.id}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate leading-snug"
                  style={{
                    color:          lesson.done ? '#94A3B8' : '#0F172A',
                    textDecoration: lesson.done ? 'line-through' : 'none',
                  }}
                >
                  {lesson.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-medium" style={{ color: '#CBD5E1' }}>⏱ {lesson.dur}</span>
                  <span style={{ color: '#E2E8F0' }}>·</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${TOPIC_COLORS[lesson.topic] || 'bg-slate-50 text-slate-500'}`}>
                    {lesson.topic}
                  </span>
                </div>
              </div>

              {lesson.current && (
                <span
                  className="text-[11px] font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: '#4338CA', color: '#FFFFFF' }}
                >
                  Kur
                </span>
              )}
              {lesson.done && (
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: '#ECFDF5', color: '#059669' }}
                >
                  +50🪙
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Pro lessons ── */}
      <section className="px-4 mb-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full" style={{ background: '#D97706' }} />
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Pro darslar</h3>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}
          >
            PRO
          </span>
        </div>

        <div className="space-y-2">
          {ALL_LESSONS.filter(l => !l.free).map(lesson => (
            <button
              key={lesson.id}
              onClick={() => { triggerHaptic('light'); navigate('/pro') }}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left opacity-70"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                style={{ background: '#FFFBEB' }}
              >
                🔒
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>
                  {lesson.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-medium" style={{ color: '#CBD5E1' }}>⏱ {lesson.dur}</span>
                  <span style={{ color: '#E2E8F0' }}>·</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${TOPIC_COLORS[lesson.topic] || 'bg-slate-50 text-slate-500'}`}>
                    {lesson.topic}
                  </span>
                </div>
              </div>

              <span
                className="text-[10px] font-black px-2 py-1 rounded-lg shrink-0"
                style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}
              >
                PRO
              </span>
            </button>
          ))}
        </div>

        {/* Upgrade CTA */}
        <button
          onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
          className="w-full mt-4 py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
            boxShadow: '0 4px 16px rgba(217,119,6,0.3)',
          }}
        >
          ✨ Pro obunani olish — 79,000 so'm/oy
        </button>
      </section>

      {/* ── Pro promo modal ── */}
      <AnimatePresence>
        {showProModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProModal(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.55)' }}
            />
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto"
              style={{ background: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '24px' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E2E8F0' }} />

              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
              >
                💎
              </div>

              <h3 className="text-xl font-extrabold text-center mb-2" style={{ color: '#0F172A' }}>
                Pro obunaga o'ting
              </h3>
              <p className="text-sm text-center leading-relaxed mb-5" style={{ color: '#64748B' }}>
                16+ yopiq dars, DTM strategiyasi, jonli master-klasslar va AI yordamchi — hammasi bir joyda.
              </p>

              <button
                onClick={() => { triggerHaptic('medium'); setShowProModal(false); navigate('/pro') }}
                className="w-full py-3.5 rounded-xl font-bold text-white mb-3 text-sm"
                style={{
                  background: 'linear-gradient(135deg, #4338CA, #6366F1)',
                  boxShadow: '0 4px 16px rgba(67,56,202,0.28)',
                }}
              >
                Pro imkoniyatlarni ko'rish
              </button>
              <button
                onClick={() => setShowProModal(false)}
                className="w-full py-3 text-sm font-medium"
                style={{ color: '#94A3B8' }}
              >
                Keyinroq
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomeScreen
