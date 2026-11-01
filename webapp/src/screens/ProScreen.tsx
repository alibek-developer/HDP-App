import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award, Check, ChevronRight, Crown, Diamond, FileText, GraduationCap, Play, Sparkles,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBackToSource } from '../lib/nav'
import { useApp } from '../store/useStore'
import { BODY, CARD, INK_BTN, LIME_BTN, OUT_BTN } from '../styles/solver'

const PLANS = [
  {
    id: '1m' as const,
    label: '1 Oy',
    price: '79,000',
    per: '/oy',
    badge: null,
    saving: null,
  },
  {
    id: '3m' as const,
    label: '3 Oy',
    price: '59,000',
    per: '/oy',
    badge: 'Mashhur',
    saving: '25% tejaysiz',
  },
  {
    id: '1y' as const,
    label: '1 Yil',
    price: '39,000',
    per: '/oy',
    badge: 'Eng arzon',
    saving: '51% tejaysiz',
  },
]

const FEATURES = [
  { icon: <Play size={17} />, title: '16+ yopiq video dars', desc: 'DTM va IMO darajasidagi eksklyuziv tahlillar' },
  { icon: <Sparkles size={17} />, title: 'AI yordamchi', desc: 'Istalgan masala yechimini qadamma-qadam tushuntiradi' },
  { icon: <GraduationCap size={17} />, title: 'Jonli master-klasslar', desc: 'Har hafta Ustoz Azamat bilan jonli dars' },
  { icon: <FileText size={17} />, title: 'DTM shpora PDF (140+)', desc: 'Oflayn yuklab olish, internet shart emas' },
  { icon: <Award size={17} />, title: 'Rasmiy HDP sertifikati', desc: 'Kurs tugagandan so\'ng shaxsiylashtirilgan' },
]

const GATEWAYS = [
  { name: 'Payme', color: '#00AEEF', bg: '#E5F7FD', label: 'Payme' },
  { name: 'Click', color: '#0057B7', bg: '#EBF1FB', label: 'Click' },
  { name: 'Uzum', color: '#FF4F12', bg: '#FEECE7', label: 'Uzum' },
  { name: 'Uzcard', color: '#18A34A', bg: '#EDFBF3', label: 'Uzcard' },
]

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

  const MONTHS: Record<'1m' | '3m' | '1y', number> = { '1m': 1, '3m': 3, '1y': 12 }

  const handleSubscribe = () => {
    subscribePro(MONTHS[selected])
    triggerHaptic('success')
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: BODY }}>

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
          style={{ background: '#FCF1DC', border: '1px solid #E8A33D', borderRadius: 12, color: '#B87A22' }}
        >
          <Crown size={17} />
        </span>
      </header>

      {/* ── Hero: siyoh varaq ── */}
      <section className="px-4 mb-4">
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
          <div className="relative z-10 px-5 pt-5 pb-6">
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

            <div className="mt-4 flex items-center gap-3 pt-3.5" style={{ borderTop: '1px solid rgba(205,233,174,0.16)' }}>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className="w-[9px] h-[9px]" style={{ background: i === 4 ? 'rgba(243,200,138,0.35)' : '#F3C88A', borderRadius: 2 }} />
                ))}
              </div>
              <p className="num text-[11.5px] font-extrabold" style={{ color: '#CDE9AE' }}>
                4.9 <span style={{ color: 'rgba(205,233,174,0.5)' }}>· 12,000+ talaba</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tarif rejalari ── */}
      <section className="px-4 mb-4">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2 px-1" style={{ color: '#6B7C66' }}>
          Tarif rejasini tanlang
        </p>
        <div className="space-y-2">
          {PLANS.map(p => {
            const on = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => { triggerHaptic('selection'); setSelected(p.id) }}
                className="relative w-full overflow-hidden flex items-center gap-3 pl-4 pr-3.5 py-3.5 text-left active:scale-[0.995] transition-transform"
                style={{
                  background: on ? '#EDF7DE' : '#FFFFFF',
                  border: `1px solid ${on ? '#7ED321' : '#E1E7DA'}`,
                  borderRadius: 14,
                  boxShadow: on ? '0 6px 16px rgba(95,175,34,0.14)' : 'none',
                }}
              >
                {on && <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }} />}

                <span
                  className="w-[20px] h-[20px] flex items-center justify-center shrink-0"
                  style={{
                    background: on ? '#0E1A12' : '#FFFFFF',
                    border: `1.5px solid ${on ? '#0E1A12' : '#CFD9C6'}`,
                    borderRadius: 6,
                    color: '#9BE04B',
                  }}
                >
                  {on && <Check size={13} />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-extrabold text-ink">{p.label}</span>
                    {p.badge && (
                      <span
                        className="num text-[9.5px] font-extrabold uppercase px-1.5 py-0.5"
                        style={p.id === '1y'
                          ? { background: '#FCF1DC', color: '#B87A22', borderRadius: 6 }
                          : INK_BTN}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {p.saving && (
                    <p className="mt-1 text-[11.5px] font-bold" style={{ color: '#0B6E4F' }}>{p.saving}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="num text-[17px] font-extrabold leading-none" style={{ color: on ? '#0B4A34' : '#0E1A12' }}>
                    {p.price}
                  </p>
                  <p className="num mt-1 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>so'm {p.per}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Nimalar kiradi ── */}
      <section className="px-4 mb-4">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2 px-1" style={{ color: '#6B7C66' }}>
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
              <Check size={15} className="shrink-0 mt-1" style={{ color: '#5FAF22' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── To'lov usuli ── */}
      <section className="px-4 mb-4">
        <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold mb-2 px-1" style={{ color: '#6B7C66' }}>
          To'lov usuli
        </p>
        <div className="grid grid-cols-4 gap-2">
          {GATEWAYS.map(g => {
            const on = gateway === g.name
            return (
              <button
                key={g.name}
                onClick={() => { triggerHaptic('selection'); setGateway(g.name) }}
                className="h-[64px] flex flex-col items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
                style={{
                  background: on ? g.bg : '#FFFFFF',
                  border: `1px solid ${on ? g.color : '#E1E7DA'}`,
                  borderRadius: 14,
                }}
              >
                <span
                  className="num w-[24px] h-[24px] flex items-center justify-center text-[12px] font-extrabold"
                  style={{ background: on ? g.color : '#F6F8F3', color: on ? '#FFFFFF' : '#9AA995', borderRadius: 7 }}
                >
                  {g.name[0]}
                </span>
                <span className="text-[10px] font-extrabold uppercase" style={{ color: on ? g.color : '#6B7C66' }}>
                  {g.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4">
        {isPro ? (
          <>
            <div className="relative overflow-hidden mb-3" style={{ background: '#DDF3DC', border: '1px solid #A7D8A0', borderRadius: 16 }}>
              <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: '#5FAF22' }} />
              <div className="pl-5 pr-4 py-4">
                <div className="flex items-center gap-2">
                  <Crown size={15} style={{ color: '#B87A22' }} />
                  <p className="text-[14px] font-extrabold" style={{ color: '#0B4A34' }}>
                    Pro faol{proExpires ? ` · ${proExpires} gacha` : ''}
                  </p>
                </div>
                <p className="mt-1.5 text-[12px] font-semibold" style={{ color: '#0B6E4F' }}>
                  Barcha darslar va to'plamlar ochiq.
                </p>
              </div>
            </div>
            <button
              onClick={() => { cancelPro(); triggerHaptic('warning'); navigate('/home') }}
              className="w-full h-[48px] text-[13.5px] font-extrabold active:scale-[0.985] transition-transform"
              style={OUT_BTN}
            >
              Obunani bekor qilish
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSubscribe}
              className="w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
              style={LIME_BTN}
            >
              <Crown size={16} /> {plan.label} — {plan.price} so'm{plan.per}
            </button>
            <p className="mt-3 text-center text-[11.5px] font-semibold" style={{ color: '#9AA995' }}>
              Istalgan vaqt bekor qilish mumkin · Xavfsiz to'lov
            </p>
          </>
        )}
      </section>

      {/* ── Muvaffaqiyat modali ── */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(14,26,18,0.6)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-5"
            >
              <div className="relative w-full overflow-hidden" style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 20px 44px rgba(14,26,18,0.28)' }}>
                <span className="absolute left-0 top-0" style={{ width: '100%', height: 6, background: 'linear-gradient(90deg, #9BE04B 0%, #5FAF22 100%)' }} />
                <div className="px-5 pt-7 pb-6">
                  <span
                    className="w-[52px] h-[52px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
                      borderRadius: 16,
                      color: '#1C3214',
                      boxShadow: '0 8px 18px rgba(95,175,34,0.3)',
                    }}
                  >
                    <Check size={26} />
                  </span>
                  <h3 className="mt-4 text-[20px] font-extrabold leading-tight text-ink">Tabriklaymiz!</h3>
                  <p className="mt-2 text-[13px] font-medium leading-snug" style={{ color: '#6B7C66' }}>
                    HDP Pro obunangiz faollashtirildi. Barcha darslarga kirish ochiq!
                  </p>
                  <button
                    onClick={() => { setShowSuccess(false); navigate('/home') }}
                    className="mt-5 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
                    style={LIME_BTN}
                  >
                    Darslarga o'tish <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProScreen
