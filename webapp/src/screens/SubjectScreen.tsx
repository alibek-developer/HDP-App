import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Check, ChevronRight, Coins, Film, Target } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { SUBJECTS, findSubject, topicLessonIds, topicTestCount, topicVideoCount } from '../data/subjects'
import { useApp } from '../store/useStore'
import { BODY, CARD } from '../styles/solver'

/**
 * Fan ichi — o'sha fanning mavzulari. Algebra I'ga kirgan o'quvchi faqat
 * Algebra I mavzularini ko'radi; mazmuni yuklanmagan fanlar bo'sh holatni
 * chizadi (u yerda hech qanday soxta dars yo'q).
 */

const SubjectScreen = () => {
  const navigate = useNavigate()
  const exit = useBack('/courses')
  const { subjectId } = useParams()
  const subject = findSubject(String(subjectId))

  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BODY }}>
        <button onClick={exit} className="h-[44px] px-5 text-[13px] font-extrabold" style={{ ...CARD, color: '#0E1A12' }}>
          Kurslarga qaytish
        </button>
      </div>
    )
  }

  const progressOf = (num: number) => {
    const ids = topicLessonIds(num)
    return { done: ids.filter(id => topicLessons[id]?.done).length, total: ids.length }
  }

  const loaded = subject.topics.filter(t => topicLessonIds(t.num).length > 0)

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
            Fan
          </p>
          <p className="mt-0.5 text-[15px] font-extrabold text-ink leading-none truncate">{subject.name}</p>
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

      {/* ── Fan varaqasi ── */}
      <section className="px-4">
        <div className="relative overflow-hidden" style={{ background: '#0E1A12', borderRadius: 16, boxShadow: '0 10px 26px rgba(14,26,18,0.18)' }}>
          <span
            className="absolute -right-6 -top-8 w-[120px] h-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(155,224,75,0.22), transparent 70%)', borderRadius: '50%' }}
          />
          <div className="relative flex items-center gap-3.5 px-4 py-4">
            <span
              className="num w-[46px] h-[46px] flex items-center justify-center shrink-0 text-[19px] font-extrabold"
              style={{ background: 'rgba(155,224,75,0.14)', border: '1px solid rgba(155,224,75,0.4)', color: '#9BE04B', borderRadius: 14 }}
            >
              {subject.badge}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold text-white leading-tight">{subject.name}</p>
              <p className="num mt-1 text-[10.5px] font-bold uppercase tracking-[0.06em]" style={{ color: 'rgba(205,233,174,0.6)' }}>
                {loaded.length > 0
                  ? `${loaded.length} ta mavzu yuklangan`
                  : 'Mavzular hali yuklanmagan'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mavzular ── */}
      {loaded.length > 0 ? (
        <section className="px-4 mt-5">
          <h2 className="text-[15.5px] font-extrabold text-ink px-1 mb-2.5">Mavzular</h2>
          <div className="space-y-3">
            {loaded.map((t, i) => {
              const { done, total } = progressOf(t.num)
              const ready = total > 0 && done === total
              const ratio = total > 0 ? done / total : 0
              return (
                <motion.button
                  key={t.num}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => { triggerHaptic('medium'); navigate(`/topic/${t.num}`) }}
                  className="w-full text-left overflow-hidden active:scale-[0.99] transition-transform"
                  style={{ ...CARD, borderRadius: 16, boxShadow: '0 6px 18px rgba(14,26,18,0.06)' }}
                >
                  <div className="flex items-start gap-3 pl-3.5 pr-3 pt-3.5">
                    <span
                      className="num w-[34px] h-[34px] flex items-center justify-center shrink-0 text-[13px] font-extrabold"
                      style={ready
                        ? { background: '#DDF3DC', color: '#0B6E4F', borderRadius: 11 }
                        : { background: '#0E1A12', color: '#9BE04B', borderRadius: 11 }}
                    >
                      {ready ? <Check size={16} /> : t.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-extrabold leading-snug text-ink">
                        Mavzu {t.num}. {t.title}
                      </p>
                      <p className="num mt-1 text-[10.5px] font-bold uppercase tracking-[0.04em]" style={{ color: '#9AA995' }}>
                        {total} bo'lim · {topicVideoCount(t.num)} video dars · {topicTestCount(t.num)} savol
                      </p>
                    </div>
                    <ChevronRight size={15} className="shrink-0 mt-2" style={{ color: '#9AA995' }} />
                  </div>

                  <div className="flex items-center gap-3 px-3.5 pt-3 pb-3.5">
                    <span className="flex-1 relative h-[6px] overflow-hidden" style={{ background: '#EDF1E7', borderRadius: 3 }}>
                      <span
                        className="absolute left-0 top-0 bottom-0 transition-[width] duration-500"
                        style={{ width: `${ratio * 100}%`, background: 'linear-gradient(90deg, #9BE04B, #5FAF22)', borderRadius: 3 }}
                      />
                    </span>
                    <span className="num text-[11px] font-extrabold shrink-0" style={{ color: ready ? '#0B6E4F' : '#6B7C66' }}>
                      {done}/{total}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] shrink-0" style={{ color: ready ? '#0B6E4F' : '#9AA995' }}>
                      {ready ? 'Testga tayyor' : done > 0 ? 'Davom etish' : 'Boshlash'}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>
      ) : (
        /* ── Bo'sh holat: mazmun yuklanmagan ── */
        <section className="px-4 mt-5">
          <div className="px-5 py-7 text-center" style={{ ...CARD, borderRadius: 16 }}>
            <span
              className="inline-flex w-[54px] h-[54px] items-center justify-center"
              style={{ background: '#EDF7DE', color: '#5FAF22', borderRadius: 18 }}
            >
              <BookOpen size={22} />
            </span>
            <p className="mt-3.5 text-[14px] font-extrabold text-ink">
              {subject.name} uchun mavzular hali kiritilmagan
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed font-medium" style={{ color: '#6B7C66' }}>
              Video darslar, nazariya va yakuniy test shu bo'limda paydo bo'ladi.
              Hozircha {SUBJECTS[0].name} bo'yicha davom etishingiz mumkin.
            </p>
            <button
              onClick={() => { triggerHaptic('medium'); navigate(`/subject/${SUBJECTS[0].id}`, { replace: true }) }}
              className="mt-4 w-full h-[46px] flex items-center justify-center gap-2 text-[13px] font-extrabold active:scale-[0.985] transition-transform"
              style={{ background: '#0E1A12', color: '#CDE9AE', borderRadius: 12 }}
            >
              <Target size={15} /> {SUBJECTS[0].name} mavzulariga o'tish
            </button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold" style={{ color: '#9AA995' }}>
            <Film size={12} /> Yuklangan fanlar avtomatik ro'yxatga qo'shiladi
          </p>
        </section>
      )}
    </div>
  )
}

export default SubjectScreen
