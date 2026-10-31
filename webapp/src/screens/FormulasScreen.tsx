import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'
import { PROBLEM_SETS } from '../data/content'

const FORMULAS = [
  {
    cat:   'Algebra',
    color: '#4338CA',
    tint:  '#EEF2FF',
    items: [
      { title: 'Viyet Teoremasi',           formula: 'x₁ + x₂ = −b/a  ·  x₁ · x₂ = c/a',         desc: 'Kvadrat tenglama ildizlari xossasi' },
      { title: 'Qisqa ko\'paytirish (kub)',  formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',           desc: 'Kublar yig\'indisi va ayirmasi' },
      { title: 'Arifmetik progressiya',     formula: 'Sₙ = n(a₁ + aₙ)/2 = n(2a₁ + d(n−1))/2',    desc: 'n ta hadning yig\'indisi' },
    ],
  },
  {
    cat:   'Trigonometriya',
    color: '#7C3AED',
    tint:  '#F5F3FF',
    items: [
      { title: 'Asosiy tenglik',            formula: 'sin²α + cos²α = 1',                          desc: 'Pythagorean identichlik' },
      { title: 'Ikkilangan burchak (sin)',  formula: 'sin(2α) = 2 sin α · cos α',                  desc: 'Ikkilangan burchak formulasi' },
      { title: 'Keltirish formulasi',       formula: 'sin(π/2 − α) = cos α  ·  cos(π/2 − α) = sin α', desc: 'π/2 bo\'yicha reduksiya' },
    ],
  },
  {
    cat:   'Analiz',
    color: '#059669',
    tint:  '#ECFDF5',
    items: [
      { title: 'Zanjir qoidasi',            formula: '(f(g(x)))′ = f′(g(x)) · g′(x)',             desc: 'Murakkab funksiya hosilasi' },
      { title: 'Integratsiya qoidasi',      formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C, (n ≠ −1)',       desc: 'Daraja funksiyasi integrali' },
    ],
  },
  {
    cat:   'Geometriya',
    color: '#D97706',
    tint:  '#FFFBEB',
    items: [
      { title: 'Kosinuslar teoremasi',      formula: 'a² = b² + c² − 2bc · cos(α)',               desc: 'Ixtiyoriy uchburchak uchun' },
      { title: 'Aylana uzunligi / yuza',    formula: 'C = 2πr  ·  S = πr²',                        desc: 'Radius orqali' },
    ],
  },
]

const FormulasScreen = () => {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ cat: string; color: string; title: string; formula: string; desc: string } | null>(null)

  const handleCopy = (text: string, id: string) => {
    triggerHaptic('success')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const query = search.toLowerCase()
  const filtered = FORMULAS
    .filter(g => !activeCat || g.cat === activeCat)
    .map(g => ({
      ...g,
      items: g.items.filter(
        f => !query || f.title.toLowerCase().includes(query) || f.formula.toLowerCase().includes(query)
      ),
    }))
    .filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen pb-24 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="px-4 pt-4 pb-3" style={{ background: '#F1F4F9' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-extrabold" style={{ color: '#0F172A' }}>Formulalar</h1>
          <button
            onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            ⚔️ Blitz Duel
          </button>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Formula qidirish..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#0F172A' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: '#94A3B8', fontSize: '18px', lineHeight: 1 }}>×</button>
          )}
        </div>
      </header>

      {/* Category chips */}
      <section className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { triggerHaptic('selection'); setActiveCat(null) }}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: !activeCat ? '#4338CA' : '#FFFFFF',
              color:      !activeCat ? '#FFFFFF'  : '#94A3B8',
              border:     '1px solid',
              borderColor: !activeCat ? '#4338CA' : '#E2E8F0',
            }}
          >
            Barchasi
          </button>
          {FORMULAS.map(g => (
            <button
              key={g.cat}
              onClick={() => { triggerHaptic('selection'); setActiveCat(activeCat === g.cat ? null : g.cat) }}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold"
              style={{
                background: activeCat === g.cat ? g.color : '#FFFFFF',
                color:      activeCat === g.cat ? '#FFFFFF' : '#334155',
                border:     '1px solid',
                borderColor: activeCat === g.cat ? g.color : '#E2E8F0',
              }}
            >
              {g.cat}
            </button>
          ))}
        </div>
      </section>

      {/* Formula groups */}
      <section className="px-4 space-y-5">
        {filtered.map(group => (
          <div key={group.cat}>
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="w-1.5 h-4 rounded-full"
                style={{ background: group.color }}
              />
              <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>{group.cat}</h3>
            </div>

            <div className="space-y-2">
              {group.items.map((f, i) => {
                const id = `${group.cat}-${i}`
                const copied = copiedId === id
                return (
                  <div
                    key={i}
                    onClick={() => { triggerHaptic('light'); setDetail({ cat: group.cat, color: group.color, title: f.title, formula: f.formula, desc: f.desc }) }}
                    className="rounded-xl overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                    style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                  >
                    {/* Title row */}
                    <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{f.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{f.desc}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(f.formula, id) }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                        style={{
                          background: copied ? '#ECFDF5'  : group.tint,
                          color:      copied ? '#059669'  : group.color,
                          border:     `1px solid ${copied ? '#A7F3D0' : 'transparent'}`,
                        }}
                      >
                        {copied ? '✓ Nusxa' : 'Nusxa'}
                      </button>
                    </div>

                    {/* Formula */}
                    <div
                      className="mx-3 mb-3 p-3 rounded-lg font-mono text-sm text-center leading-relaxed"
                      style={{ background: group.tint, color: group.color, fontWeight: 700 }}
                    >
                      {f.formula}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: '#94A3B8' }}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-medium">Hech narsa topilmadi</p>
          </div>
        )}
      </section>

      {/* Formula detail modal */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.55)' }}
            />
            <motion.div
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 70, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto p-6"
              style={{ background: '#FFFFFF', borderRadius: '24px 24px 0 0' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E2E8F0' }} />
              <span
                className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2"
                style={{ background: '#F1F4F9', color: detail.color }}
              >
                {detail.cat}
              </span>
              <h3 className="text-lg font-extrabold mb-1" style={{ color: '#0F172A' }}>{detail.title}</h3>
              <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>{detail.desc}</p>
              <div
                className="p-4 rounded-xl font-mono text-sm text-center leading-relaxed mb-5"
                style={{ background: '#F1F4F9', color: detail.color, fontWeight: 700 }}
              >
                {detail.formula}
              </div>
              <button
                onClick={() => {
                  triggerHaptic('medium')
                  const setId = PROBLEM_SETS.find(s => s.topic === detail.cat)?.id
                  setDetail(null)
                  navigate(setId ? `/problems/${setId}` : '/problems')
                }}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-2.5"
                style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', boxShadow: '0 4px 16px rgba(67,56,202,0.28)' }}
              >
                📝 Formula bo'yicha testni boshlash →
              </button>
              <button
                onClick={() => setDetail(null)}
                className="w-full py-3 text-sm font-medium rounded-xl"
                style={{ background: '#F1F4F9', color: '#64748B' }}
              >
                Yopish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white z-50"
            style={{ background: '#059669', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}
          >
            ✓ Formula nusxalandi
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormulasScreen
