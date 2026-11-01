import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, ChevronRight, Coins, Film, RotateCcw, Target, X,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { findTopicLesson, TOPIC_1_LESSONS } from '../data/topic1'
import { videoFileUrl } from '../lib/videos'
import { LockedVideo } from '../components/LockedVideo'
import { TOPIC_LESSON_REWARD, useApp } from '../store/useStore'
import { BODY, CARD, INK_BTN, LIME_BTN } from '../styles/solver'

/**
 * Mavzu bo'limi — video dars + nazariya + misol + «o'zingizni sinab ko'ring».
 * Zanjir: dars 95% ko'rilmasa bo'lim yakunlanmaydi; test faqat barcha
 * bo'limlar tugagach ochiladi (TopicTestScreen / TopicScreen shu qoida ustida turadi).
 */

const LABEL_STYLE: Record<string, { bg: string; fg: string }> = {
  "TA'RIF": { bg: '#DDF3DC', fg: '#0B6E4F' },
  "MA'LUMOT": { bg: '#E5ECFE', fg: '#3560C4' },
  MASALAN: { bg: '#FCF1DC', fg: '#B87A22' },
  ESLATISH: { bg: '#F1F4EE', fg: '#33452F' },
  SAVOL: { bg: '#EDF7DE', fg: '#5FAF22' },
  YEHISH: { bg: '#EFF2EC', fg: '#6B7C66' },
  MAQSAQ: { bg: '#DDF3DC', fg: '#0B6E4F' },
}

const labelStyle = (kind: string) => LABEL_STYLE[kind] ?? LABEL_STYLE.ESLATISH

/** YouTube'yidagi eski nom — fayl lokal bo'lsa ham afisha shu yerda turadi */
const posterUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

/** Ustun shaklidagi hisob: 8567 / +1129 / 9696 */
const Stack = ({ op, rows, result }: { op: string; rows: string[]; result: string }) => (
  <div className="inline-block mt-2 pl-3">
    {rows.map((r, i) => (
      <p key={i} className="num font-mono text-[16px] font-extrabold leading-7 text-right text-ink">
        {i === 0 ? r : <span>{op === '+' || op === '−' ? `${op} ` : ''}{r}</span>}
      </p>
    ))}
    <p className="num font-mono text-[15px] leading-6 text-right" style={{ color: '#9AA995' }}>
      {'─'.repeat(Math.max(...rows.map(r => r.length), result.length) + 1)}
    </p>
    <p className="num font-mono text-[17px] font-extrabold leading-7 text-right" style={{ color: '#0B6E4F' }}>
      {result}
    </p>
  </div>
)

const TopicLessonScreen = () => {
  const navigate = useNavigate()
  const exit = useBack('/topic/1')
  const { lessonId } = useParams()
  const lesson = findTopicLesson(String(lessonId))

  const stateOf = useApp(s => s.topicLessonState)
  const markVideoSeen = useApp(s => s.markTopicVideoSeen)
  const complete = useApp(s => s.completeTopicLesson)
  const beginSession = useApp(s => s.beginSession)

  /** Har bir videoni 95% ko'rish holati — shu mount ichida yashaydi,
   *  store'ga faqat barcha videolar tugagach yoziladi */
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [unavailable, setUnavailable] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState<number[]>([])
  const idx = TOPIC_1_LESSONS.findIndex(l => l.id === lessonId)
  const nextId = idx >= 0 ? TOPIC_1_LESSONS[idx + 1]?.id : undefined

  useEffect(() => { beginSession() }, [])

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BODY }}>
        <button onClick={exit} className="h-[44px] px-5 text-[13px] font-extrabold" style={{ ...CARD, color: '#0E1A12' }}>
          Mavzuga qaytish
        </button>
      </div>
    )
  }

  const st = stateOf(lesson.id)
  /** Fayli yo'q video bo'lim shartidir hisoblanmaydi — lekin u hech qachon
   *  tashqi manbaga (YouTube) chiqmaydi: kurs sotiladi, tekinga berilmaydi */
  const watchable = lesson.videos.filter(v => !unavailable[v.id])
  const needsVideo = watchable.length > 0
  const canFinish = !needsVideo || st.videoSeen || st.done

  /** Bo'limni yakunlash sharti: fayli bor videolarning har biri 95% ko'rilgan bo'lsa */
  const markWatched = (videoId: string) => {
    const next = { ...seen, [videoId]: true }
    setSeen(next)
    if (!st.videoSeen && watchable.every(v => next[v.id])) markVideoSeen(lesson.id)
  }

  const markUnavailable = (videoId: string) =>
    setUnavailable(prev => (prev[videoId] ? prev : { ...prev, [videoId]: true }))

  const finish = () => {
    if (st.done) {
      goNext()
      return
    }
    if (!canFinish) {
      triggerHaptic('warning')
      return
    }
    triggerHaptic('success')
    complete(lesson.id)
    goNext()
  }

  /** Bo'limdan bo'limga o'tish — yonma-yon harakat, tarixni o'stirmaymiz:
   *  aks holda "Orqaga" bosganda bo'limlar bo'ylab yurib chiqish kerak bo'ladi */
  const goNext = () => {
    navigate(nextId ? `/topic/1/${nextId}` : '/topic/1/test', { replace: true })
  }

  const toggle = (i: number) => {
    triggerHaptic('selection')
    setOpen(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))
  }

  return (
    <div className="min-h-screen pb-32 select-none font-sans" style={{ background: BODY }}>

      {/* ── Sarlavha ── */}
      <header className="flex items-center gap-3 px-4 pt-5 pb-2">
        <button
          onClick={exit}
          aria-label="Orqaga"
          className="w-[38px] h-[38px] flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform"
          style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
        >
          <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="min-w-0">
          <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
            {st.done ? 'Bo\'lim yakunlangan' : `Bo'lim ${lesson.id}`}
          </p>
          <p className="mt-0.5 text-[14.5px] font-extrabold text-ink leading-tight truncate">{lesson.title}</p>
        </div>
      </header>

      <div className="px-4">
        {/* ── Maqsad ── */}
        <div className="mt-2 flex items-center gap-2.5 px-3.5 py-3" style={{ ...CARD, borderRadius: 12 }}>
          <Target size={15} style={{ color: '#5FAF22' }} className="shrink-0" />
          <p className="text-[12.5px] font-bold leading-snug text-ink-2">{lesson.goal}</p>
        </div>

        {/* ── Video dars ── */}
        {lesson.videos.map(v => (unavailable[v.id] ? null : (
          <div key={v.id} className="mt-4">
            <LockedVideo
              src={videoFileUrl(v.id)}
              poster={posterUrl(v.id)}
              title={v.title}
              watched={st.videoSeen || Boolean(seen[v.id])}
              onWatched={() => markWatched(v.id)}
              onUnavailable={() => markUnavailable(v.id)}
            />
          </div>
        )))}

        {lesson.videos.length > 0 && watchable.length === 0 && (
          <div className="mt-4 flex items-center gap-2.5 px-3.5 py-3.5" style={{ background: '#0E1A12', borderRadius: 16 }}>
            <Film size={15} className="shrink-0" style={{ color: '#9BE04B' }} />
            <p className="flex-1 text-[12.5px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>
              Bu bo'limning video darsi ilovaga hali kiritilmagan.
            </p>
            <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.1em]" style={{ color: 'rgba(205,233,174,0.55)' }}>
                Tez orada
            </span>
          </div>
        )}

        {lesson.videoOnly && (
          <p className="mt-3 text-[12.5px] leading-relaxed font-medium" style={{ color: '#6B7C66' }}>
            Bu bo'limning nazariy qismi video darsda berilgan.
          </p>
        )}

        {/* ── Nazariya ── */}
        {lesson.theory.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="relative mt-4 overflow-hidden"
            style={{ ...CARD, borderRadius: 14 }}
          >
            <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: labelStyle(b.kind).fg }} />
            <div className="pl-4 pr-3.5 py-3.5">
              <span
                className="inline-block text-[10px] font-black uppercase tracking-[0.12em] px-2 py-1"
                style={{ background: labelStyle(b.kind).bg, color: labelStyle(b.kind).fg, borderRadius: 6 }}
              >
                {b.kind}
              </span>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{b.text}</p>
            </div>
          </motion.div>
        ))}

        {/* ── Ro'yxatli bo'limlar ── */}
        {lesson.lists?.map((l, li) => (
          <div key={li} className="mt-4" style={{ ...CARD, borderRadius: 14 }}>
            <p className="px-3.5 pt-3.5 pb-2 text-[13px] font-extrabold text-ink">{l.caption}</p>
            <ol className="pb-2">
              {l.items.map((it, i) => (
                <li key={i} className="flex items-start gap-2.5 px-3.5 py-2" style={{ borderTop: '1px solid #EDF1E7' }}>
                  <span
                    className="num w-[20px] h-[20px] flex items-center justify-center shrink-0 text-[10.5px] font-black"
                    style={{ background: '#EDF7DE', color: '#33452F', borderRadius: 6 }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[13.5px] font-semibold leading-snug text-ink-2">{it}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {/* ── Xossalar ── */}
        {lesson.properties && (
          <div className="mt-4 overflow-hidden" style={{ ...CARD, borderRadius: 14 }}>
            <p className="px-3.5 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em]" style={{ color: '#6B7C66', borderBottom: '1px solid #EDF1E7' }}>
              Amal xossalari
            </p>
            {lesson.properties.map((p, i) => (
              <div key={p.name} className="px-3.5 py-3" style={i > 0 ? { borderTop: '1px solid #EDF1E7' } : undefined}>
                <div className="flex items-baseline gap-2">
                  <span className="num text-[11px] font-black uppercase" style={{ color: '#5FAF22' }}>{p.name}</span>
                  <p className="flex-1 text-[13.5px] font-semibold leading-snug text-ink">{p.detail}</p>
                </div>
                <p className="num mt-2 font-mono text-[13px] font-bold" style={{ color: '#0B6E4F' }}>{p.example}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Yechilgan misol ── */}
        {lesson.example && (
          <div className="relative mt-5 overflow-hidden" style={{ background: '#0E1A12', borderRadius: 16 }}>
            <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: 'linear-gradient(180deg, #9BE04B, #5FAF22)' }} />
            <div className="pl-5 pr-4 py-4">
              <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#9BE04B' }}>
                Yechilgan misol
              </p>
              <p className="mt-2 text-[14.5px] font-semibold leading-relaxed text-white">{lesson.example.prompt}</p>

              {lesson.example.stack && (
                <div className="mt-3 inline-block rounded-[10px] px-4 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {lesson.example.stack.rows.map((r, i) => (
                    <p key={i} className="num font-mono text-[16px] font-bold leading-7 text-right text-white">
                      {i > 0 ? `${lesson.example!.stack!.op} ${r}` : r}
                    </p>
                  ))}
                  <p className="num font-mono text-[13px] leading-6 text-right" style={{ color: 'rgba(205,233,174,0.5)' }}>
                    {'─'.repeat(Math.max(...lesson.example.stack!.rows.map(r => r.length), lesson.example.stack!.result.length) + 2)}
                  </p>
                  <p className="num font-mono text-[17px] font-extrabold leading-7 text-right" style={{ color: '#9BE04B' }}>
                    {lesson.example.stack!.result}
                  </p>
                </div>
              )}

              {lesson.example.steps && (
                <ol className="mt-3 space-y-1.5">
                  {lesson.example.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="num shrink-0 text-[11.5px] font-black" style={{ color: '#9BE04B' }}>{i + 1})</span>
                      <span className="text-[13px] leading-snug" style={{ color: 'rgba(255,255,255,0.82)' }}>{s}</span>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-3.5 flex items-center gap-2.5" style={{ borderTop: '1px solid rgba(205,233,174,0.16)', paddingTop: 12 }}>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em]" style={{ color: 'rgba(205,233,174,0.6)' }}>
                  Javob
                </span>
                <span className="num text-[16px] font-extrabold" style={{ color: '#9BE04B' }}>{lesson.example.answer}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── O'zingizni sinab ko'ring ── */}
        {lesson.practice.length > 0 && (
          <section className="mt-6">
            <div className="flex items-baseline justify-between mb-2.5 px-1">
              <h3 className="text-[15.5px] font-extrabold text-ink">O'zingizni sinab ko'ring</h3>
              <span className="num text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>{lesson.practice.length} ta</span>
            </div>

            <div className="space-y-2.5">
              {lesson.practice.map((p, i) => {
                const shown = open.includes(i)
                return (
                  <div key={i} className="overflow-hidden" style={{ ...CARD, borderRadius: 14 }}>
                    <p className="px-3.5 pt-3.5 pb-3 text-[13.5px] font-semibold leading-snug text-ink">{p.prompt}</p>

                    <AnimatePresence initial={false}>
                      {shown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24 }}
                          className="overflow-hidden"
                        >
                          <div className="mx-3.5 mb-3 pl-3 pr-3 py-3" style={{ background: '#FBFCF8', borderLeft: '2px solid #5FAF22', borderRadius: '0 10px 10px 0' }}>
                            {p.stack && <Stack op={p.stack.op} rows={p.stack.rows} result={p.stack.result} />}
                            {p.steps?.map((s, si) => (
                              <p key={si} className="text-[13px] leading-relaxed text-ink-2">
                                {p.steps!.length > 1 ? `${si + 1}) ` : ''}{s}
                              </p>
                            ))}
                            <p className="num mt-2 text-[14px] font-extrabold" style={{ color: '#0B6E4F' }}>
                              Javob: {p.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => toggle(i)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em] active:opacity-70 transition-opacity"
                      style={{ borderTop: '1px solid #EDF1E7', color: shown ? '#6B7C66' : '#0B6E4F' }}
                    >
                      {shown ? <><X size={13} /> Yechimni yashirish</> : <><Check size={13} /> Yechimni ko'rish</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Keyingi bo'limga o'tish ── */}
        {st.done && (
          <button
            onClick={finish}
            className="mt-5 w-full flex items-center gap-3 px-3.5 py-3.5 text-left active:scale-[0.99] transition-transform"
            style={{ ...CARD, borderRadius: 14 }}
          >
            <span className="w-[34px] h-[34px] flex items-center justify-center shrink-0" style={{ background: '#DDF3DC', borderRadius: 10, color: '#0B6E4F' }}>
              {nextId ? <ChevronRight size={16} /> : <Target size={16} />}
            </span>
            <span className="flex-1">
              <span className="block text-[13px] font-extrabold text-ink">
                {nextId ? `Keyingi bo'lim ${nextId}` : 'Mavzu yakuniy testi'}
              </span>
              <span className="block mt-0.5 text-[11.5px] font-semibold" style={{ color: '#6B7C66' }}>
                {nextId ? 'davom etamiz' : '30 savol — barcha bo\'limlar tugadi'}
              </span>
            </span>
          </button>
        )}
      </div>

      {/* ── Pastki CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 430, margin: '0 auto' }}>
        <div className="px-4 pt-3 pb-5" style={{ background: 'rgba(243,247,238,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid #E1E7DA' }}>
          <button
            onClick={finish}
            disabled={!canFinish}
            className="w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
            style={st.done ? LIME_BTN : canFinish ? INK_BTN : { background: '#EAEEE3', color: '#9AA995', borderRadius: 12 }}
          >
            {st.done ? (
              <>Mavzuga qaytish <ChevronRight size={16} /></>
            ) : canFinish ? (
              <>Bo'limni yakunlash <Check size={16} /></>
            ) : (
              <>Avval video darsni to'liq ko'ring <Film size={16} /></>
            )}
          </button>
          {!st.done && (
            <p className="mt-2 text-center num text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
              Yakunlangach +{TOPIC_LESSON_REWARD.coin} coin · +{TOPIC_LESSON_REWARD.xp} XP
              <Coins size={11} className="inline-block ml-0.5" style={{ color: '#E8A33D' }} />
            </p>
          )}
          {st.done && nextId && (
            <button
              onClick={exit}
              className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11.5px] font-extrabold active:opacity-70 transition-opacity"
              style={{ color: '#6B7C66' }}
            >
              <RotateCcw size={12} /> Bo'limlar ro'yxati
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicLessonScreen
