import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, CalendarClock, Check, ChevronRight, Crown, Diamond, FileText, GraduationCap, Lock, Play,
  Sparkles, Star,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBackToSource } from '../lib/nav'
import { useApp } from '../store/useStore'
import { BODY, CARD, INK_BTN, LIME_BTN, OUT_BTN } from '../styles/solver'

/** 1 oylik bazaviy narx — tejim shu yerdan hisoblanadi */
const BASE_PER_MONTH = 79_000

const PLANS = [
  { id: '1m' as const, label: '1 Oy', months: 1, perMonth: 79_000, badge: null as string | null },
  { id: '3m' as const, label: '3 Oy', months: 3, perMonth: 59_000, badge: 'Mashhur' },
  { id: '1y' as const, label: '1 Yil', months: 12, perMonth: 39_000, badge: 'Eng arzon' },
]

const FEATURES = [
  { icon: <Play size={17} />, title: '16+ yopiq video dars', desc: 'DTM va IMO darajasidagi eksklyuziv tahlillar' },
  { icon: <Sparkles size={17} />, title: 'AI yordamchi', desc: 'Istalgan masala yechimini qadamma-qadam tushuntiradi' },
  { icon: <GraduationCap size={17} />, title: 'Jonli master-klasslar', desc: 'Har hafta Ustoz Azamat bilan jonli dars' },
  { icon: <FileText size={17} />, title: 'DTM shpora PDF (140+)', desc: 'Oflayn yuklab olish, internet shart emas' },
  { icon: <Award size={17} />, title: 'Rasmiy HDP sertifikati', desc: 'Kurs tugagandan so\'ng shaxsiylashtirilgan' },
]

const GATEWAYS = [
  { name: 'Payme', color: '#00AEEF', bg: '#E5F7FD' },
  { name: 'Click', color: '#0057B7', bg: '#EBF1FB' },
  { name: 'Uzum', color: '#FF4F12', bg: '#FEECE7' },
  { name: 'Uzcard', color: '#18A34A', bg: '#EDFBF3' },
]

/** 177000 → «177 000» — O'zbekistonda bo'shaqli yozuv ishlatiladi */
const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** 2026-12-02 → 02.12.2026 */
const ruDate = (iso: string | null) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

const ProScreen = () => {
  const navigate = useNavigate()
  const exit = useBackToSource()
  const [selected, setSelected] = useState<'1m' | '3m' | '1y'>('3m')
  const [gateway, setGateway] = useState('Payme')
  const [showSuccess, setShowSuccess] = useState(false)

  const isPro = useApp(s => s.isPro)
  const proExpires = useApp(s => s.proExpires)
  const subscribePro = useApp(s => s.subscribePro)
  const cancelPro = useApp(s => s.cancelPro)

  const plan = PLANS.find(p => p.id === selected)!
  const total = plan.perMonth * plan.months
  const baseline = BASE_PER_MONTH * plan.months
  const saved = baseline - total

  const handleSubscribe = () => {
    subscribePro(plan.months)
    triggerHaptic('success')
    setShowSuccess(true)
  }

  return (
    <div
      className="min-h-screen select-none font-sans"
      style={{ background: BODY, paddingBottom: isPro ? 40 : 160 }}
    >

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 pt-5 pb-3">
        <button
          onClick={exit}
          aria-label="Orqaga"
          className="w-[38px] h-[38px] flex items-center justify-center shrink-0 active:scale-[0.96] transition-transform"
          style={{ background: '#FFFFFF', border: '1px solid #E1E7DA', borderRadius: 12, color: '#33452F' }}
        >
          <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="text-center">
          <p className="text-tiny uppercase tracking-[0.16em] font-extrabold" style={{ color: '#6B7C66' }}>Obuna</p>
          <p className="mt-0.5 text-[15px] font-extrabold leading-none text-ink">HDP Pro</p>
        </div>
        <span
          className="w-[38px] h-[38px] flex items-center justify-center shrink-0"
          style={{
            background: isPro ? 'linear-gradient(150deg, #F6D8A6 0%, #E8A33D 100%)' : '#FCF1DC',
            border: '1px solid #E8A33D',
            borderRadius: 12,
            color: '#B87A22',
          }}
        >
          <Crown size={17} />
        </span>
      </header>

      {/* ── Hero: siyoh varaq ── */}
      <section className="px-4 mb-5">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%)',
            borderRadius: 20,
            boxShadow: '0 14px 30px rgba(14,26,18,0.22)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(205,233,174,0.6) 24px, rgba(205,233,174,0.6) 25px), repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(205,233,174,0.6) 24px, rgba(205,233,174,0.6) 25px)',
            }}
          />
          <div className="relative z-10 px-5 pt-5 pb-5">
            <span
              className="w-[46px] h-[46px] flex items-center justify-center"
              style={{ background: 'rgba(155,224,75,0.16)', border: '1px solid rgba(155,224,75,0.36)', borderRadius: 14, color: '#9BE04B' }}
            >
              <Diamond size={22} />
            </span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ color: '#F7FCED' }}>
              HDP Pro bilan<br />matematikani egalla
            </h1>
            <p className="mt-2.5 text-[13px] font-medium leading-snug" style={{ color: 'rgba(205,233,174,0.72)' }}>
              O'zbekistonning eng yaxshi DTM va olimpiada matematika kursi — cheksiz kirish.
            </p>

            <div className="mt-4 flex items-center gap-2 pt-3.5" style={{ borderTop: '1px solid rgba(205,233,174,0.16)' }}>
              <span className="flex items-center gap-[3px]">
                {[0, 1, 2, 3, 4].map(i => (
                  <Star key={i} size={12} fill={i === 4 ? 'rgba(243,200,138,0.32)' : '#F3C88A'} strokeWidth={0} color="#F3C88A" />
                ))}
              </span>
              <p className="num text-[11.5px] font-extrabold" style={{ color: '#CDE9AE' }}>
                4.9 <span style={{ color: 'rgba(205,233,174,0.5)' }}>· 12 000+ talaba</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tarif rejalari ── */}
      <section className="px-4 mb-5">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2.5 px-1" style={{ color: '#6B7C66' }}>
          Tarif rejasini tanlang
        </p>
        <div className="space-y-2.5">
          {PLANS.map(p => {
            const on = selected === p.id
            const pTotal = p.perMonth * p.months
            const pSaved = BASE_PER_MONTH * p.months - pTotal
            return (
              <button
                key={p.id}
                onClick={() => { triggerHaptic('selection'); setSelected(p.id) }}
                aria-pressed={on}
                className="relative w-full overflow-hidden flex items-center gap-3 pl-4 pr-4 py-3.5 text-left active:scale-[0.995] transition-transform"
                style={{
                  background: on ? '#F1FAE7' : '#FFFFFF',
                  border: `1px solid ${on ? '#5FAF22' : '#E1E7DA'}`,
                  borderRadius: 16,
                  boxShadow: on ? '0 8px 20px rgba(95,175,34,0.15)' : '0 1px 2px rgba(14,26,18,0.04)',
                }}
              >
                {on && <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }} />}

                <span
                  className="w-[22px] h-[22px] flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: on ? '#0B6E4F' : '#FFFFFF',
                    border: `1.5px solid ${on ? '#0B6E4F' : '#CFD9C6'}`,
                    borderRadius: 999,
                    color: '#FFFFFF',
                  }}
                >
                  {on && <Check size={14} strokeWidth={3} />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-extrabold text-ink">{p.label}</span>
                    {p.badge && (
                      <span
                        className="num text-[9px] font-extrabold uppercase tracking-[0.06em] px-1.5 py-[3px]"
                        style={p.id === '1y'
                          ? { background: '#FCF1DC', color: '#B87A22', borderRadius: 6 }
                          : { background: '#EDF7DE', color: '#0B6E4F', borderRadius: 6 }}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="num mt-1.5 text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>
                    {p.months === 1
                      ? 'Bir oylik to\'lov'
                      : <>jami <span style={{ color: '#0B6E4F', fontWeight: 800 }}>{money(pTotal)} so'm</span></>}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="num text-[19px] font-extrabold leading-none" style={{ color: on ? '#0B4A34' : '#0E1A12' }}>
                    {money(p.perMonth)}
                  </p>
                  <p className="num mt-1 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>so'm /oy</p>
                  {pSaved > 0 && (
                    <p className="num mt-1.5 text-[11px] font-extrabold inline-block px-1.5 py-[2px]" style={{ background: '#DDF3DC', color: '#0B6E4F', borderRadius: 6 }}>
                      −{Math.round((pSaved / (BASE_PER_MONTH * p.months)) * 100)}%
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Nimalar kiradi ── */}
      <section className="px-4 mb-5">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2.5 px-1" style={{ color: '#6B7C66' }}>
          Nimalar kiradi
        </p>
        <div style={{ ...CARD, borderRadius: 16 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 pl-3.5 pr-4 py-3.5"
              style={{
                borderTop: i === 0 ? 'none' : '1px solid #EDF1E7',
                borderRadius: i === 0 ? '16px 16px 0 0' : i === FEATURES.length - 1 ? '0 0 16px 16px' : 0,
              }}
            >
              <span
                className="w-[38px] h-[38px] flex items-center justify-center shrink-0"
                style={{ background: '#EDF7DE', borderRadius: 12, color: '#0B6E4F' }}
              >
                {f.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-extrabold leading-tight text-ink">{f.title}</p>
                <p className="mt-1 text-[11.5px] font-semibold leading-snug" style={{ color: '#6B7C66' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── To'lov usuli ── */}
      <section className="px-4 mb-5">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2.5 px-1" style={{ color: '#6B7C66' }}>
          To'lov usuli
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GATEWAYS.map(g => {
            const on = gateway === g.name
            return (
              <button
                key={g.name}
                onClick={() => { triggerHaptic('selection'); setGateway(g.name) }}
                aria-pressed={on}
                className="relative h-[70px] flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                style={{
                  background: on ? g.bg : '#FFFFFF',
                  border: `1.5px solid ${on ? g.color : '#E1E7DA'}`,
                  borderRadius: 14,
                  boxShadow: on ? `0 6px 16px ${g.color}22` : '0 1px 2px rgba(14,26,18,0.04)',
                }}
              >
                {on && (
                  <span
                    className="absolute top-[6px] right-[6px] w-[15px] h-[15px] flex items-center justify-center"
                    style={{ background: g.color, borderRadius: 999, color: '#FFFFFF' }}
                  >
                    <Check size={11} strokeWidth={3.2} />
                  </span>
                )}
                <span
                  className="num w-[26px] h-[26px] flex items-center justify-center text-[13px] font-extrabold"
                  style={{ background: on ? g.color : g.bg, color: on ? '#FFFFFF' : g.color, borderRadius: 8 }}
                >
                  {g.name[0]}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.02em]" style={{ color: on ? g.color : '#6B7C66' }}>
                  {g.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Faol obuna holati ── */}
      {isPro && (
        <section className="px-4">
          <div className="relative overflow-hidden mb-3" style={{ background: '#DDF3DC', border: '1px solid #A7D8A0', borderRadius: 16 }}>
            <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: '#5FAF22' }} />
            <div className="pl-5 pr-4 py-4">
              <div className="flex items-center gap-2">
                <Crown size={15} style={{ color: '#B87A22' }} />
                <p className="text-[14px] font-extrabold" style={{ color: '#0B4A34' }}>Pro faol</p>
              </div>
              <p className="mt-1.5 text-[12px] font-semibold" style={{ color: '#0B6E4F' }}>
                Barcha darslar va to'plamlar ochiq.
              </p>
              {proExpires && (
                <p className="num mt-2.5 flex items-center gap-1.5 text-[11.5px] font-extrabold" style={{ color: '#0B4A34' }}>
                  <CalendarClock size={14} /> Amal qiladi: {ruDate(proExpires)} gacha
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => { cancelPro(); triggerHaptic('warning'); navigate('/home') }}
            className="w-full h-[48px] text-[13.5px] font-extrabold active:scale-[0.985] transition-transform"
            style={OUT_BTN}
          >
            Obunani bekor qilish
          </button>
        </section>
      )}

      {/* ── Xarid paneli — bosh barmaq zonasi, doim ko'z oldida ── */}
      {!isPro && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 max-w-[430px] mx-auto"
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #E1E7DA',
            boxShadow: '0 -10px 28px rgba(14,26,18,0.10)',
            padding: '12px 16px calc(var(--sab) + 12px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: '#9AA995' }}>
                Jami to'lov · {plan.label}
              </p>
              <p className="num mt-1 text-[21px] font-extrabold leading-none whitespace-nowrap" style={{ color: '#0E1A12' }}>
                {money(total)} <span style={{ color: '#6B7C66' }}>so'm</span>
                <span className="ml-2 text-[12px] font-bold" style={{ color: '#9AA995', textDecoration: 'line-through' }}>
                  {money(baseline)}
                </span>
              </p>
            </div>
            <span
              className="num shrink-0 text-[12px] font-extrabold px-2.5 py-1.5"
              style={{ background: '#DDF3DC', color: '#0B6E4F', borderRadius: 10 }}
            >
              −{money(saved)} so'm
            </span>
          </div>

          <button
            onClick={handleSubscribe}
            className="w-full h-[52px] text-[15px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
            style={LIME_BTN}
          >
            <Crown size={17} /> {plan.label} obunani faollashtirish
          </button>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold" style={{ color: '#9AA995' }}>
            <Lock size={11} /> {gateway} orqali to'lov · istalgan vaqtda bekor qilish
          </p>
        </div>
      )}

      {/* ── Muvaffaqiyat modali ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(14,26,18,0.6)' }}
          />
        )}
        {showSuccess && (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
          >
            <div className="relative w-full overflow-hidden" style={{ background: '#FFFFFF', borderRadius: 22, boxShadow: '0 20px 44px rgba(14,26,18,0.28)' }}>
              <span className="absolute left-0 top-0" style={{ width: '100%', height: 6, background: 'linear-gradient(90deg, #9BE04B 0%, #5FAF22 100%)' }} />
              <div className="px-5 pt-7 pb-6">
                <div className="flex items-center gap-3.5">
                  <span
                    className="w-[52px] h-[52px] flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
                      borderRadius: 16,
                      color: '#1C3214',
                      boxShadow: '0 8px 18px rgba(95,175,34,0.3)',
                    }}
                  >
                    <Check size={26} strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="text-[20px] font-extrabold leading-tight text-ink">Obuna faol!</h3>
                    <p className="mt-1 text-[12.5px] font-semibold" style={{ color: '#6B7C66' }}>
                      HDP Pro barcha darslarga kirish ochildi.
                    </p>
                  </div>
                </div>

                {/* To'lov varaqasi — pul sarflanganini ko'rsatadigan yagona joy */}
                <div className="mt-5" style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 14, padding: '12px 14px' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold" style={{ color: '#6B7C66' }}>Tarif</span>
                    <span className="num text-[12.5px] font-extrabold text-ink">{plan.label} · {money(total)} so'm</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[12px] font-bold" style={{ color: '#6B7C66' }}>Amal muddati</span>
                    <span className="num text-[12.5px] font-extrabold text-ink">{ruDate(proExpires) ?? '—'} gacha</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[12px] font-bold" style={{ color: '#6B7C66' }}>To'lov usuli</span>
                    <span className="text-[12.5px] font-extrabold text-ink">{gateway}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setShowSuccess(false); navigate('/home') }}
                  className="mt-5 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
                  style={INK_BTN}
                >
                  Darslarga o'tish <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-2.5 w-full h-[44px] text-[13px] font-extrabold active:scale-[0.985] transition-transform"
                  style={{ ...OUT_BTN, color: '#6B7C66' }}
                >
                  Yopish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProScreen
