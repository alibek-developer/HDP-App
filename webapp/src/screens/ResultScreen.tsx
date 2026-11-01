import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, RotateCcw, Home, BookOpen } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'
import { BODY, CARD, LIME_BTN, OUT_BTN, TICK } from '../styles/solver'

/**
 * 7-qadam: Natija — nechta to'g'ri, qancha coin, va har bir xato uchun
 * «qanday to'g'rilash kerak» tushuntirishi.
 */
const ResultScreen = () => {
  const navigate = useNavigate()
  const result = useApp(s => s.lastResult)
  const coin = useApp(s => s.coin)

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: BODY }}>
        <span
          className="w-[54px] h-[54px] flex items-center justify-center mb-1"
          style={{ background: '#EDF7DE', border: '1px solid #CFD9C6', borderRadius: 16, color: '#5FAF22' }}
        >
          <BookOpen size={22} />
        </span>
        <p className="text-[16px] font-extrabold text-ink">Natija topilmadi</p>
        <p className="text-[12.5px] text-center font-medium" style={{ color: '#6B7C66' }}>
          Avval test yoki to'plamni yakunlang.
        </p>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/home') }}
          className="mt-2 h-[46px] px-6 text-[13.5px] font-extrabold active:scale-[0.97] transition-transform"
          style={LIME_BTN}
        >
          Bosh sahifaga
        </button>
      </div>
    )
  }

  const total = result.answers.length
  const correct = result.answers.filter(a => a.ok).length
  const skipped = result.answers.filter(a => a.skipped)
  const wrong = result.answers.filter(a => !a.ok && !a.skipped)
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  const backTo = result.kind === 'problem-set' ? '/problems' : `/lesson/${result.refId}`
  const tone = percent >= 80 ? TICK.ok : percent >= 50 ? '#E8A33D' : TICK.bad

  return (
    <div className="min-h-screen pb-32 select-none font-sans" style={{ background: BODY }}>

      {/* ── Natija varaqasi ── */}
      <div className="px-4 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden"
          style={{ ...CARD, borderRadius: 16, boxShadow: '0 10px 26px rgba(14,26,18,0.08)' }}
        >
          <span
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 6, background: tone }}
          />
          <div className="pl-5 pr-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                  {result.kind === 'problem-set' ? 'To\'plam natijasi' : 'Test natijasi'}
                </p>
                <p className="mt-2 text-[14px] font-extrabold text-ink">{result.title}</p>
              </div>
              <p className="num text-[34px] font-extrabold leading-none text-ink">
                {correct}
                <span className="text-[18px]" style={{ color: '#9AA995' }}>/{total}</span>
              </p>
            </div>

            {/* Har bir savol uchun holat chizig'i */}
            <div className="mt-4 flex gap-1.5">
              {result.answers.map((a, i) => (
                <motion.span
                  key={i}
                  className="flex-1 h-[6px]"
                  initial={{ background: TICK.todo }}
                  animate={{ background: a.ok ? TICK.ok : a.skipped ? '#E8A33D' : TICK.bad }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.25 }}
                  style={{ borderRadius: 3 }}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="num text-[11.5px] font-extrabold" style={{ color: tone }}>
                {percent}% {percent >= 80 ? '· ajoyib' : percent >= 50 ? '· yaxshi' : '· takrorlash kerak'}
              </span>
              <span className="num text-[11.5px] font-bold" style={{ color: '#9AA995' }}>
                {wrong.length} ta xato{skipped.length > 0 ? ` · ${skipped.length} o'tkazildi` : ''}
              </span>
            </div>

            {/* Mukofot ledger */}
            <div className="mt-4 flex items-stretch" style={{ borderTop: '1px solid #EDF1E7', paddingTop: 14 }}>
              {[
                { v: `+${result.coinsEarned}`, u: 'coin', c: '#B87A22' },
                { v: `+${result.xpEarned}`, u: 'XP', c: '#3560C4' },
                { v: `${coin.toLocaleString('en-US')}`, u: 'hamyonda', c: '#0E1A12' },
              ].map((cell, i) => (
                <div key={cell.u} className="flex-1 flex items-center">
                  {i > 0 && <span className="w-px self-stretch" style={{ background: '#EDF1E7' }} />}
                  <div className="flex-1 text-center">
                    <p className="num text-[17px] font-extrabold leading-none" style={{ color: cell.c }}>{cell.v}</p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>{cell.u}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Topilgan xatolar ── */}
      {wrong.length > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Topilgan xatolar</h3>
            <span className="num text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>{wrong.length} ta</span>
          </div>

          <div className="space-y-3">
            {wrong.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden"
                style={{ ...CARD, borderRadius: 14 }}
              >
                <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: TICK.bad }} />
                <div className="pl-4 pr-3.5 py-3.5">
                  <p className="text-[14px] font-extrabold leading-snug text-ink">{a.prompt}</p>

                  <div className="mt-3 space-y-1.5">
                    <p className="flex items-center gap-2 text-[12.5px]">
                      <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0"
                        style={{ background: '#FBE9E7', borderRadius: 6 }}>
                        <X size={11} style={{ color: TICK.bad }} strokeWidth={3} />
                      </span>
                      <span style={{ color: '#6B7C66' }}>Sizning javobingiz:</span>
                      <span className="font-extrabold" style={{ color: '#8C2F2C' }}>
                        {a.options[a.picked] ?? '—'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-[12.5px]">
                      <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0"
                        style={{ background: '#DDF3DC', borderRadius: 6 }}>
                        <Check size={11} style={{ color: TICK.ok }} strokeWidth={3} />
                      </span>
                      <span style={{ color: '#6B7C66' }}>To'g'ri javob:</span>
                      <span className="font-extrabold" style={{ color: '#0B6E4F' }}>{a.options[a.correct]}</span>
                    </p>
                  </div>

                  <div className="mt-3 pl-3 py-2.5" style={{ background: '#FBFCF8', borderLeft: '2px solid #E1E7DA' }}>
                    <p className="text-tiny uppercase tracking-[0.12em] font-extrabold mb-1" style={{ color: '#6B7C66' }}>
                      Qanday to'g'rilash kerak
                    </p>
                    <p className="text-[13px] leading-relaxed text-ink-2">{a.explain}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── O'tkazilgan savollar (buyum sarflangan) ── */}
      {skipped.length > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">O'tkazilganlar</h3>
            <span className="num text-[11.5px] font-bold" style={{ color: '#B87A22' }}>{skipped.length} ta</span>
          </div>

          <div className="space-y-3">
            {skipped.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden"
                style={{ ...CARD, borderRadius: 14 }}
              >
                <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: '#E8A33D' }} />
                <div className="pl-4 pr-3.5 py-3.5">
                  <p className="text-[14px] font-extrabold leading-snug text-ink">{a.prompt}</p>
                  <p className="mt-2.5 flex items-center gap-2 text-[12.5px]">
                    <span style={{ color: '#6B7C66' }}>To'g'ri javob:</span>
                    <span className="font-extrabold" style={{ color: '#0B6E4F' }}>{a.options[a.correct]}</span>
                  </p>
                  <div className="mt-3 pl-3 py-2.5" style={{ background: '#FBFCF8', borderLeft: '2px solid #E1E7DA' }}>
                    <p className="text-tiny uppercase tracking-[0.12em] font-extrabold mb-1" style={{ color: '#6B7C66' }}>
                      Nima yodda qolishi kerak
                    </p>
                    <p className="text-[13px] leading-relaxed text-ink-2">{a.explain}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Bajarilganlar ── */}
      {correct > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Bajarilganlar</h3>
            <span className="num text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>{correct} ta</span>
          </div>

          <div className="overflow-hidden" style={CARD}>
            {result.answers.filter(a => a.ok).map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5"
                style={i > 0 ? { borderTop: '1px solid #EDF1E7' } : undefined}>
                <Check size={14} style={{ color: TICK.ok }} strokeWidth={3} className="shrink-0" />
                <p className="flex-1 text-[13px] font-semibold text-ink-2 leading-snug">{a.prompt}</p>
                <span className="num text-[12px] font-extrabold shrink-0" style={{ color: '#0B6E4F' }}>
                  {a.options[a.correct]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {wrong.length === 0 && skipped.length === 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mt-6"
        >
          <div className="relative overflow-hidden" style={{ background: '#0E1A12', borderRadius: 14 }}>
            <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: 'linear-gradient(180deg, #9BE04B, #5FAF22)' }} />
            <div className="pl-5 pr-4 py-4">
              <p className="text-[15px] font-extrabold" style={{ color: '#9BE04B' }}>
                Xatosiz yakunladingiz
              </p>
              <p className="mt-1 text-[12.5px] font-medium" style={{ color: 'rgba(205,233,174,0.6)' }}>
                {result.kind === 'problem-set' ? "To'plam to'liq yechildi." : 'Barcha savollarga to\'g\'ri javob berdingiz.'}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Pastki harakat paneli ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 430, margin: '0 auto' }}>
        <div className="px-4 pt-3 pb-5"
          style={{ background: 'rgba(243,247,238,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid #E1E7DA' }}>
          <div className="flex gap-2.5">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/home') }}
              className="flex-1 h-[50px] text-[13.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
              style={OUT_BTN}
            >
              <Home size={15} /> Bosh sahifa
            </button>
            {result.kind === 'lesson-test' ? (
              <button
                onClick={() => { triggerHaptic('medium'); navigate(`/lesson/${result.refId}`) }}
                className="flex-1 h-[50px] text-[13.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                style={LIME_BTN}
              >
                <BookOpen size={15} /> Davom etish
              </button>
            ) : (
              <button
                onClick={() => { triggerHaptic('medium'); navigate(backTo) }}
                className="flex-1 h-[50px] text-[13.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                style={LIME_BTN}
              >
                <RotateCcw size={15} /> Yana ishlash
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultScreen
