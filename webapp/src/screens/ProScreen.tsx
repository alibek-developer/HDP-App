import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const PLANS = [
  {
    id:      '1m' as const,
    label:   '1 Oy',
    price:   '79,000',
    per:     '/oy',
    badge:   null,
    saving:  null,
  },
  {
    id:      '3m' as const,
    label:   '3 Oy',
    price:   '59,000',
    per:     '/oy',
    badge:   'Mashhur',
    saving:  '25% tejaysiz',
  },
  {
    id:      '1y' as const,
    label:   '1 Yil',
    price:   '39,000',
    per:     '/oy',
    badge:   'Eng arzon',
    saving:  '51% tejaysiz',
  },
]

const FEATURES = [
  { icon: '▶', title: '16+ yopiq video dars',       desc: 'DTM va IMO darajasidagi eksklyuziv tahlillar' },
  { icon: '🤖', title: 'AI yordamchi',                desc: 'Istalgan masala yechimini qadamma-qadam tushuntiradi' },
  { icon: '🎓', title: 'Jonli master-klasslar',       desc: 'Har hafta Ustoz Azamat bilan jonli dars' },
  { icon: '📄', title: 'DTM shpora PDF (140+)',       desc: 'Oflayn yuklab olish, internet shart emas' },
  { icon: '🏅', title: 'Rasmiy HDP sertifikati',     desc: 'Kurs tugagandan so\'ng shaxsiylashtirilgan' },
]

const GATEWAYS = [
  { name: 'Payme',  color: '#00AEEF', bg: '#E5F7FD', label: 'Payme' },
  { name: 'Click',  color: '#0057B7', bg: '#EBF1FB', label: 'Click' },
  { name: 'Uzum',   color: '#FF4F12', bg: '#FEECE7', label: 'Uzum' },
  { name: 'Uzcard', color: '#18A34A', bg: '#EDFBF3', label: 'Uzcard' },
]

const ProScreen = () => {
  const navigate = useNavigate()
  const [selected, setSelected]     = useState<'1m' | '3m' | '1y'>('3m')
  const [gateway, setGateway]       = useState('Payme')
  const [showSuccess, setShowSuccess] = useState(false)

  const plan = PLANS.find(p => p.id === selected)!

  const handleSubscribe = () => {
    triggerHaptic('success')
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p className="text-sm font-bold" style={{ color: '#0F172A' }}>HDP Pro</p>
        <div style={{ width: 36 }} />
      </header>

      {/* Hero */}
      <section className="px-4 mb-5">
        <div
          className="rounded-2xl p-5 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #312E81 0%, #4338CA 65%, #6366F1 100%)',
            boxShadow: '0 8px 32px rgba(67,56,202,0.28)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10">
            <div className="text-4xl mb-3">💎</div>
            <h1 className="text-2xl font-extrabold text-white mb-2 leading-snug">
              HDP Pro bilan<br />matematikani egalla
            </h1>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xs mx-auto">
              O'zbekistonning eng yaxshi DTM va olimpiada matematika kursi — cheksiz kirish.
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-amber-300 text-sm">★★★★★</span>
              <span className="text-indigo-200 text-xs font-medium">4.9 · 12,000+ talaba</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan selector */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>Tarif rejasini tanlang</h3>
        <div className="space-y-2.5">
          {PLANS.map(p => (
            <button
              key={p.id}
              onClick={() => { triggerHaptic('selection'); setSelected(p.id) }}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
              style={{
                background:  selected === p.id ? '#EEF2FF' : '#FFFFFF',
                border:      `1.5px solid ${selected === p.id ? '#4338CA' : '#E2E8F0'}`,
                boxShadow:   selected === p.id ? '0 0 0 3px rgba(67,56,202,0.08)' : 'none',
              }}
            >
              {/* Radio */}
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: selected === p.id ? '#4338CA' : '#CBD5E1',
                  background:  selected === p.id ? '#4338CA' : 'transparent',
                }}
              >
                {selected === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: '#0F172A' }}>{p.label}</span>
                  {p.badge && (
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded"
                      style={{ background: '#4338CA', color: '#FFFFFF' }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                {p.saving && (
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: '#059669' }}>{p.saving}</p>
                )}
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold" style={{ color: selected === p.id ? '#4338CA' : '#0F172A' }}>
                  {p.price}
                </span>
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{p.per}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>Nimalar kiradi</h3>
        <div className="space-y-2">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                style={{ background: '#EEF2FF' }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{f.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{f.desc}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="shrink-0 mt-1">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Payment gateways */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>To'lov usuli</h3>
        <div className="grid grid-cols-4 gap-2">
          {GATEWAYS.map(g => (
            <button
              key={g.name}
              onClick={() => { triggerHaptic('selection'); setGateway(g.name) }}
              className="py-3 rounded-xl flex flex-col items-center gap-1.5 font-bold text-xs transition-all"
              style={{
                background: gateway === g.name ? g.bg : '#FFFFFF',
                border:     `1.5px solid ${gateway === g.name ? g.color : '#E2E8F0'}`,
                color:      g.color,
              }}
            >
              <span className="text-base">{g.name[0]}</span>
              <span style={{ fontSize: '10px' }}>{g.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4">
        <button
          onClick={handleSubscribe}
          className="w-full py-4 rounded-xl font-extrabold text-white text-sm mb-3"
          style={{
            background: 'linear-gradient(135deg, #4338CA, #6366F1)',
            boxShadow:  '0 4px 16px rgba(67,56,202,0.28)',
          }}
        >
          {plan.label} — {plan.price} so'm{plan.per} orqali obuna bo'lish
        </button>
        <p className="text-center text-xs" style={{ color: '#94A3B8' }}>
          Istalgan vaqt bekor qilish mumkin · Xavfsiz to'lov
        </p>
      </section>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.6)' }}
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div
                className="w-full max-w-sm rounded-2xl p-6 text-center"
                style={{ background: '#FFFFFF' }}
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-extrabold mb-2" style={{ color: '#0F172A' }}>Tabriklaymiz!</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748B' }}>
                  HDP Pro obunangiz faollashtirildi. Barcha darslarga kirish ochiq!
                </p>
                <button
                  onClick={() => { setShowSuccess(false); navigate('/home') }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
                >
                  Darslarga o'tish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProScreen
