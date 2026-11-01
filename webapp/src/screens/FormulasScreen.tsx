import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Copy, Search, Sigma, Swords, X } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBackToSource } from '../lib/nav'
import { PROBLEM_SETS } from '../data/content'
import { BODY, CARD, INK_BTN, LIME_BTN, OUT_BTN } from '../styles/solver'

interface Formula { title: string; formula: string; desc: string }
interface Group { cat: string; rail: string; tint: string; ink: string; items: Formula[] }

/**
 * Formulalar qo'llanmasi — "davotar" varaq tilida.
 * Har mavzu o'z rengi (chap reys + tint) bilan belgilanadi.
 */
const FORMULAS: Group[] = [
  {
    cat: 'Algebra',
    rail: '#5FAF22', tint: '#DDF3DC', ink: '#0B4A34',
    items: [
      { title: 'Viyet Teoremasi', formula: 'x₁ + x₂ = −b/a  ·  x₁ · x₂ = c/a', desc: 'Kvadrat tenglama ildizlari xossasi' },
      { title: 'Qisqa ko\'paytirish (kub)', formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)', desc: 'Kublar yig\'indisi va ayirmasi' },
      { title: 'Arifmetik progressiya', formula: 'Sₙ = n(a₁ + aₙ)/2 = n(2a₁ + d(n−1))/2', desc: 'n ta hadning yig\'indisi' },
    ],
  },
  {
    cat: 'Trigonometriya',
    rail: '#4C7DF0', tint: '#E5ECFE', ink: '#3560C4',
    items: [
      { title: 'Asosiy tenglik', formula: 'sin²α + cos²α = 1', desc: 'Pythagorean identichlik' },
      { title: 'Ikkilangan burchak (sin)', formula: 'sin(2α) = 2 sin α · cos α', desc: 'Ikkilangan burchak formulasi' },
      { title: 'Keltirish formulasi', formula: 'sin(π/2 − α) = cos α  ·  cos(π/2 − α) = sin α', desc: 'π/2 bo\'yicha reduksiya' },
    ],
  },
  {
    cat: 'Analiz',
    rail: '#E8A33D', tint: '#FCF1DC', ink: '#B87A22',
    items: [
      { title: 'Zanjir qoidasi', formula: '(f(g(x)))′ = f′(g(x)) · g′(x)', desc: 'Murakkab funksiya hosilasi' },
      { title: 'Integratsiya qoidasi', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C, (n ≠ −1)', desc: 'Daraja funksiyasi integrali' },
    ],
  },
  {
    cat: 'Geometriya',
    rail: '#D9534F', tint: '#FBE9E7', ink: '#8C2F2C',
    items: [
      { title: 'Kosinuslar teoremasi', formula: 'a² = b² + c² − 2bc · cos(α)', desc: 'Ixtiyoriy uchburchak uchun' },
      { title: 'Aylana uzunligi / yuza', formula: 'C = 2πr  ·  S = πr²', desc: 'Radius orqali' },
    ],
  },
]

const FormulasScreen = () => {
  const navigate = useNavigate()
  const exit = useBackToSource()
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ cat: string; rail: string; tint: string; ink: string; title: string; formula: string; desc: string } | null>(null)

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

  const total = FORMULAS.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="min-h-screen pb-24 select-none font-sans" style={{ background: BODY }}>

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
        <div className="flex-1 min-w-0 px-3 text-center">
          <p className="text-tiny uppercase tracking-[0.16em] font-extrabold" style={{ color: '#6B7C66' }}>
            Qo'llanma
          </p>
          <p className="mt-0.5 text-[15px] font-extrabold leading-none text-ink">Formulalar</p>
        </div>
        <button
          onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
          className="flex items-center gap-1.5 h-[38px] px-2.5 shrink-0 active:scale-[0.96] transition-transform"
          style={{ background: '#FCF1DC', border: '1px solid #E8A33D', borderRadius: 12, color: '#B87A22' }}
          aria-label="Blitz Duel"
        >
          <Swords size={15} />
          <span className="num text-[11px] font-extrabold uppercase">Blitz</span>
        </button>
      </header>

      {/* ── Qidiruv ── */}
      <section className="px-4 mb-3">
        <div className="flex items-center gap-2.5 px-3.5 h-[48px]" style={CARD}>
          <Search size={16} style={{ color: '#9AA995' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Formula yoki mavzu qidirish..."
            className="flex-1 text-[13.5px] font-semibold outline-none bg-transparent"
            style={{ color: '#0E1A12' }}
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Tozalash" style={{ color: '#9AA995', lineHeight: 1 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* ── Mavzu chiplari ── */}
      <section className="px-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { triggerHaptic('selection'); setActiveCat(null) }}
            className="num flex-shrink-0 h-[34px] px-3 text-[11px] font-extrabold uppercase tracking-[0.06em] active:scale-[0.97] transition-transform"
            style={!activeCat
              ? INK_BTN
              : { background: '#FFFFFF', border: '1px solid #E1E7DA', color: '#6B7C66', borderRadius: 10 }}
          >
            Barchasi · {total}
          </button>
          {FORMULAS.map(g => {
            const on = activeCat === g.cat
            return (
              <button
                key={g.cat}
                onClick={() => { triggerHaptic('selection'); setActiveCat(on ? null : g.cat) }}
                className="flex-shrink-0 h-[34px] pl-2 pr-3 flex items-center gap-2 active:scale-[0.97] transition-transform"
                style={{
                  background: on ? g.tint : '#FFFFFF',
                  border: `1px solid ${on ? g.rail : '#E1E7DA'}`,
                  borderRadius: 10,
                  color: on ? g.ink : '#6B7C66',
                }}
              >
                <span className="w-[5px] h-[16px]" style={{ background: g.rail, borderRadius: 3 }} />
                <span className="text-[11.5px] font-extrabold uppercase">{g.cat}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Formulalar varaqlari ── */}
      <section className="px-4 space-y-5">
        {filtered.map(group => (
          <div key={group.cat}>
            <div className="flex items-center gap-2.5 mb-2 px-1">
              <p className="num text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#33452F' }}>
                {group.cat}
              </p>
              <span className="flex-1 h-px" style={{ background: '#CFD9C6' }} />
              <span
                className="num text-[10px] font-extrabold px-1.5 py-0.5"
                style={{ background: group.tint, color: group.ink, borderRadius: 6 }}
              >
                {group.items.length}
              </span>
            </div>

            <div style={{ ...CARD, borderRadius: 16 }}>
              {group.items.map((f, i) => {
                const id = `${group.cat}-${i}`
                const copied = copiedId === id
                return (
                  <button
                    key={i}
                    onClick={() => {
                      triggerHaptic('light')
                      setDetail({ cat: group.cat, rail: group.rail, tint: group.tint, ink: group.ink, title: f.title, formula: f.formula, desc: f.desc })
                    }}
                    className="relative w-full overflow-hidden text-left active:scale-[0.995] transition-transform"
                    style={{
                      borderTop: i === 0 ? 'none' : '1px solid #EDF1E7',
                      borderRadius: i === 0 ? '16px 16px 0 0' : i === group.items.length - 1 ? '0 0 16px 16px' : 0,
                      background: '#FFFFFF',
                    }}
                  >
                    <span className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: group.rail }} />
                    <div className="pl-4 pr-3.5 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] font-extrabold leading-tight text-ink">{f.title}</p>
                          <p className="mt-1 text-[11.5px] font-semibold leading-snug" style={{ color: '#6B7C66' }}>{f.desc}</p>
                        </div>
                        <span
                          onClick={e => { e.stopPropagation(); handleCopy(f.formula, id) }}
                          className="w-[30px] h-[30px] flex items-center justify-center shrink-0"
                          style={{
                            background: copied ? '#DDF3DC' : group.tint,
                            color: copied ? '#0B6E4F' : group.ink,
                            borderRadius: 9,
                          }}
                          aria-label="Nusxa olish"
                        >
                          {copied ? <Check size={14} /> : <Copy size={13} />}
                        </span>
                      </div>

                      <div
                        className="mt-3 px-3 py-2.5 font-mono text-[12.5px] text-center leading-relaxed font-bold"
                        style={{ background: '#FBFCF8', border: '1px solid #E1E7DA', borderRadius: 10, color: group.ink }}
                      >
                        {f.formula}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <span
              className="inline-flex w-[52px] h-[52px] items-center justify-center mb-3"
              style={{ background: '#EDF7DE', border: '1px solid #CFD9C6', borderRadius: 16, color: '#9AA995' }}
            >
              <Search size={20} />
            </span>
            <p className="text-[14px] font-extrabold text-ink">Hech narsa topilmadi</p>
            <p className="mt-1 text-[12px] font-medium" style={{ color: '#6B7C66' }}>
              Boshqa mavzu yoki formula belgisini sinab ko'ring.
            </p>
          </div>
        )}
      </section>

      {/* ── Formula tafsilotlari ── */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(14,26,18,0.55)' }}
            />
            <motion.div
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 70, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto px-5 pt-3 pb-6"
              style={{ background: '#FFFFFF', borderRadius: '18px 18px 0 0', boxShadow: '0 -12px 32px rgba(14,26,18,0.18)' }}
            >
              <div className="w-10 h-[5px] rounded-full mx-auto mb-4" style={{ background: '#E1E7DA' }} />
              <span
                className="num inline-block text-[10px] font-extrabold uppercase tracking-[0.1em] px-2 py-1 mb-2"
                style={{ background: detail.tint, color: detail.ink, borderRadius: 7 }}
              >
                {detail.cat}
              </span>
              <h3 className="text-[18px] font-extrabold leading-tight text-ink">{detail.title}</h3>
              <p className="mt-1.5 text-[12.5px] font-semibold" style={{ color: '#6B7C66' }}>{detail.desc}</p>

              <div
                className="relative mt-4 overflow-hidden"
                style={{ background: 'linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%)', borderRadius: 16 }}
              >
                <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: detail.rail }} />
                <div className="pl-5 pr-4 py-5">
                  <p className="num text-[10px] font-extrabold uppercase tracking-[0.14em]" style={{ color: 'rgba(205,233,174,0.5)' }}>
                    Formula
                  </p>
                  <p className="mt-2.5 font-mono text-[15px] font-bold leading-relaxed text-center" style={{ color: '#F7FCED' }}>
                    {detail.formula}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('medium')
                  const setId = PROBLEM_SETS.find(s => s.topic === detail.cat)?.id
                  setDetail(null)
                  navigate(setId ? `/problems/${setId}` : '/problems')
                }}
                className="mt-4 w-full h-[52px] text-[14.5px] font-extrabold flex items-center justify-center gap-2 active:scale-[0.985] transition-transform"
                style={LIME_BTN}
              >
                <Sigma size={16} /> Bu mavzuda masala yechish
              </button>
              <button
                onClick={() => setDetail(null)}
                className="mt-2.5 w-full h-[46px] text-[13.5px] font-extrabold active:scale-[0.985] transition-transform"
                style={OUT_BTN}
              >
                Yopish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-2.5 z-50"
            style={{ background: '#0E1A12', borderRadius: 12, boxShadow: '0 10px 24px rgba(14,26,18,0.28)' }}
          >
            <Check size={14} style={{ color: '#9BE04B' }} />
            <span className="text-[12.5px] font-extrabold" style={{ color: '#CDE9AE' }}>Formula nusxalandi</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormulasScreen
