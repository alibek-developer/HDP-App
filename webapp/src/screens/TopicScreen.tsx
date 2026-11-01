import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check, ChevronRight, Coins, Film, Lock, Play, Target, Trophy,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBackToSource } from '../lib/nav'
import { TOPIC_1_LESSONS, TOPIC_1_META, TOPIC_1_TEST, TOPIC_1_PASS } from '../data/topic1'
import { useApp } from '../store/useStore'
import { BODY, CARD, LIME_BTN, TICK } from '../styles/solver'

/**
 * Mavzu 1 bo'limlari — nazariya kursining kovasi.
 * 10 ta bo'lim (video dars + nazariya + amaliyot) va oxirida 30 savolli test.
 * Qoida: test faqat barcha bo'limlar yakunlangach ochiladi.
 */

const TopicScreen = () => {
  const navigate = useNavigate()
  const exit = useBackToSource()
  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)
  const topicTest = useApp(s => s.topicTest)
  const canEnterTopicTest = useApp(s => s.canEnterTopicTest)

  const doneCount = TOPIC_1_LESSONS.filter(l => topicLessons[l.id]?.done).length
  const totalLessons = TOPIC_1_LESSONS.length
  const videoCount = TOPIC_1_LESSONS.reduce((n, l) => n + l.videos.length, 0)
  const minutes = TOPIC_1_LESSONS.reduce((n, l) => n + l.minutes, 0)
  const firstOpen = TOPIC_1_LESSONS.find(l => !topicLessons[l.id]?.done)
  const testOpen = canEnterTopicTest()
  const passed = !!topicTest && topicTest.score >= TOPIC_1_PASS

  const openLesson = (id: string) => {
    triggerHaptic('medium')
    navigate(`/topic/1/${id}`)
  }

  const openTest = () => {
    if (!testOpen) {
      triggerHaptic('warning')
      return
    }
    triggerHaptic('medium')
    navigate('/topic/1/test')
  }

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
          <p className="text-tiny uppercase tracking-[0.16em] font-extrabold" style={{ color: '#6B7C66' }}>
            Mavzu {TOPIC_1_META.num}
          </p>
          <p className="mt-0.5 text-[15px] font-extrabold text-ink leading-none truncate">Matematikaga kirish</p>
        </div>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/shop') }}
          aria-label="Hamyon"
          className="w-[38px] h-[38px] flex flex-col items-center justify-center active:scale-[0.96] transition-transform"
          style={{ background: '#FCF1DC', border: '1px solid #E8A33D', borderRadius: 12 }}
        >
          <Coins size={12} style={{ color: '#B87A22' }} />
          <span className="num text-[9.5px] font-extrabold leading-none mt-0.5" style={{ color: '#B87A22' }}>{coin}</span>
        </button>
      </header>

      {/* ── Mavzu varaqasi ── */}
      <section className="px-4">
        <div className="relative overflow-hidden" style={{ background: '#0E1A12', borderRadius: 16, boxShadow: '0 10px 26px rgba(14,26,18,0.18)' }}>
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 6, background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }} />
          <div className="pl-5 pr-4 py-4">
            <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#9BE04B' }}>
              Nazariy kurs
            </p>
            <h2 className="mt-1.5 text-[15px] font-extrabold leading-snug text-white">
              {TOPIC_1_META.chapter}
            </h2>

            <div className="mt-4 flex items-end justify-between">
              <p className="num text-[30px] font-extrabold leading-none text-white">
                {doneCount}
                <span className="text-[18px]" style={{ color: 'rgba(205,233,174,0.55)' }}>/{totalLessons}</span>
              </p>
              <p className="num text-[11.5px] font-extrabold uppercase tracking-[0.06em]" style={{ color: '#9BE04B' }}>
                {Math.round((doneCount / totalLessons) * 100)}%
              </p>
            </div>

            <div className="mt-3 flex gap-[3px]">
              {TOPIC_1_LESSONS.map(l => {
                const done = !!topicLessons[l.id]?.done
                const current = !done && firstOpen?.id === l.id
                return (
                  <motion.span
                    key={l.id}
                    className="flex-1 h-[16px]"
                    initial={false}
                    animate={{ background: done ? 'linear-gradient(180deg, #9BE04B, #7ED321)' : current ? '#CDE9AE' : 'rgba(255,255,255,0.10)' }}
                    transition={{ duration: 0.4 }}
                    style={{ borderRadius: 4 }}
                  />
                )
              })}
            </div>

            <div className="mt-4 flex items-center gap-4" style={{ borderTop: '1px solid rgba(205,233,174,0.14)', paddingTop: 12 }}>
              {[
                { icon: <Film size={12} />, v: `${videoCount} ta`, u: 'video dars' },
                { icon: <Target size={12} />, v: `${minutes} daq`, u: 'nazariya' },
                { icon: <Trophy size={12} />, v: `${TOPIC_1_TEST.total}`, u: 'test savoli' },
              ].map(c => (
                <span key={c.u} className="flex items-center gap-1.5" style={{ color: 'rgba(205,233,174,0.6)' }}>
                  {c.icon}
                  <span className="num text-[11.5px] font-extrabold" style={{ color: '#CDE9AE' }}>{c.v}</span>
                  <span className="text-[10px] font-bold uppercase">{c.u}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bo'limlar ── */}
      <section className="px-4 mt-6">
        <p className="text-tiny uppercase tracking-[0.14em] font-extrabold mb-2 px-1" style={{ color: '#6B7C66' }}>
          Bo'limlar
        </p>
        <div style={{ ...CARD, borderRadius: 16 }}>
          {TOPIC_1_LESSONS.map((l, idx) => {
            const st = topicLessons[l.id]
            const done = !!st?.done
            const started = !done && !!st?.videoSeen

            const tileStyle: React.CSSProperties = done
              ? { background: '#DDF3DC', color: '#0B6E4F' }
              : started
                ? { background: '#0E1A12', color: '#9BE04B' }
                : { background: '#FFFFFF', border: '1px solid #E1E7DA', color: '#33452F' }

            return (
              <button
                key={l.id}
                onClick={() => openLesson(l.id)}
                className="w-full flex items-center gap-3 pl-3.5 pr-3 py-3.5 text-left active:scale-[0.995] transition-transform"
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid #EDF1E7',
                  borderRadius: idx === 0 ? '16px 16px 0 0' : '0',
                  background: '#FFFFFF',
                }}
              >
                <span
                  className="num w-[40px] h-[40px] flex items-center justify-center shrink-0 text-[13.5px] font-extrabold"
                  style={{ ...tileStyle, borderRadius: 12 }}
                >
                  {done ? <Check size={17} /> : started ? <Play size={14} /> : l.id}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-extrabold truncate leading-tight text-ink">{l.title}</p>
                  <p className="num mt-1 text-[10.5px] font-bold uppercase tracking-[0.04em]" style={{ color: '#9AA995' }}>
                    {l.minutes} daq
                    {l.videos.length > 0 && ` · ${l.videos.length} video`}
                    {l.practice.length > 0 && ` · ${l.practice.length} mashq`}
                    {l.videos.length === 0 && ' · faqat nazariya'}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {[
                      l.videos.length === 0 || !!st?.videoSeen,
                      done,
                    ].map((on, i) => (
                      <span key={i} className="flex-1 h-[4px]" style={{ borderRadius: 2, background: on ? TICK.ok : '#EAEEE3' }} />
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className="text-[10px] font-extrabold uppercase leading-tight"
                    style={{ color: done ? '#0B6E4F' : started ? '#B87A22' : '#6B7C66' }}
                  >
                    {done ? 'Yakunlangan' : started ? 'Davom etish' : 'Boshlash'}
                  </p>
                  <ChevronRight size={15} className="inline-block mt-1" style={{ color: '#9AA995' }} />
                </div>
              </button>
            )
          })}

          {/* ── Yakuniy test ── */}
          <button
            onClick={openTest}
            className="w-full flex items-center gap-3 pl-3.5 pr-3 py-4 text-left active:scale-[0.995] transition-transform"
            style={{
              borderTop: '1px solid #EDF1E7',
              borderRadius: '0 0 16px 16px',
              background: testOpen ? '#EDF7DE' : '#FBFCF8',
            }}
          >
            <span
              className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
              style={
                passed
                  ? { background: '#DDF3DC', color: '#0B6E4F', borderRadius: 12 }
                  : testOpen
                    ? { background: '#0E1A12', color: '#9BE04B', borderRadius: 12 }
                    : { background: '#FFFFFF', border: '1px solid #E1E7DA', color: '#9AA995', borderRadius: 12 }
              }
            >
              {passed ? <Trophy size={17} /> : testOpen ? <Target size={16} /> : <Lock size={15} />}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-extrabold leading-tight text-ink">
                {TOPIC_1_TEST.title} · {TOPIC_1_TEST.total} savol
              </p>
              <p className="mt-1 text-[11px] font-semibold" style={{ color: '#6B7C66' }}>
                {testOpen
                  ? topicTest
                    ? `Eng yaxshi natija: ${topicTest.score}/${topicTest.total} · o'tish ${TOPIC_1_PASS} ta`
                    : `Barcha bo'limlar tugadi — testga kirish ochiq (${TOPIC_1_PASS} ta — o'tish)`
                  : `${totalLessons} bo'limning ${doneCount} tasi tugadi — test qulflangan`}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="num text-[10px] font-extrabold uppercase" style={{ color: testOpen ? '#B87A22' : '#9AA995' }}>
                {testOpen ? (topicTest ? 'Yana ishlash' : 'Boshlash') : `${doneCount}/${totalLessons}`}
              </p>
              <p className="num text-[10px] font-extrabold" style={{ color: testOpen ? '#0B6E4F' : '#CBD5C5' }}>
                +{TOPIC_1_TEST.total * TOPIC_1_TEST.coinPerSolve} coin
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Yechish tugmasi ── */}
      <section className="px-4 mt-4">
        <button
          onClick={() => (testOpen ? openTest() : firstOpen && openLesson(firstOpen.id))}
          className="w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
          style={LIME_BTN}
        >
          {testOpen ? 'Yakuniy testni topshirish' : firstOpen ? `Bo'lim ${firstOpen.id} dan davom etish` : 'Bo\'limlar'}
          <ChevronRight size={16} />
        </button>
      </section>
    </div>
  )
}

export default TopicScreen
