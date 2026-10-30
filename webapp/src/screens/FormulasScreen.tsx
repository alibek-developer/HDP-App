import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

interface FormulaItem {
  id: number
  cat: string
  catBg: string
  catColor: string
  title: string
  desc: string
  formula: string
  tags: string[]
  isMemorized: boolean
  isSaved: boolean
}

const formulasDatabase: FormulaItem[] = [
  {
    id: 1,
    cat: 'Alg',
    catBg: 'from-emerald-500/10 to-teal-500/20 border-emerald-500/30',
    catColor: 'text-[#006C49]',
    title: 'Viyet Teoremasi',
    desc: 'Kvadrat tenglama ildizlari xossalari',
    formula: 'x₁ + x₂ = −b/a  •  x₁ · x₂ = c/a',
    tags: ['8-sinf', 'DTM Bazaviy'],
    isMemorized: true,
    isSaved: false,
  },
  {
    id: 2,
    cat: 'Geo',
    catBg: 'from-blue-500/10 to-indigo-500/20 border-blue-500/30',
    catColor: 'text-blue-700',
    title: 'Kosinuslar Teoremasi',
    desc: 'Ixtiyoriy uchburchak tomonlari va burchaklari',
    formula: 'a² = b² + c² − 2bc · cos(α)',
    tags: ['Planimetriya', 'DTM Blok'],
    isMemorized: true,
    isSaved: true,
  },
  {
    id: 3,
    cat: 'Mat',
    catBg: 'from-purple-500/10 to-pink-500/20 border-purple-500/30',
    catColor: 'text-purple-700',
    title: 'Murakkab Funksiya Hosilasi',
    desc: 'Zanjir qoidasi (Chain Rule)',
    formula: "(f(g(x)))' = f'(g(x)) · g'(x)",
    tags: ['Hosila', 'Olimpiada'],
    isMemorized: false,
    isSaved: false,
  },
  {
    id: 4,
    cat: 'Trig',
    catBg: 'from-amber-500/10 to-orange-500/20 border-amber-500/30',
    catColor: 'text-amber-700',
    title: 'Keltirish Formulalari',
    desc: 'π/2 va π burchaklar bo\'yicha reduksiya',
    formula: 'sin(π/2 − α) = cos(α) • tg(π/2 + α) = −ctg(α)',
    tags: ['Trigonometriya', 'Shpora'],
    isMemorized: true,
    isSaved: false,
  },
  {
    id: 5,
    cat: 'Alg',
    catBg: 'from-emerald-500/10 to-teal-500/20 border-emerald-500/30',
    catColor: 'text-[#006C49]',
    title: 'Qisqa Ko\'paytirish Formulalari',
    desc: 'Kublar yig\'indisi va ayirmasi',
    formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
    tags: ['7-sinf', 'Asosiy'],
    isMemorized: true,
    isSaved: false,
  },
]

const FormulasScreen = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [formulas, setFormulas] = useState(formulasDatabase)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    triggerHaptic('light')
    setTimeout(() => setToastMessage(null), 2000)
  }

  const toggleBookmark = (id: number) => {
    triggerHaptic('selection')
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isSaved: !f.isSaved } : f))
    )
  }

  const toggleMemorized = (id: number) => {
    triggerHaptic('success')
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isMemorized: !f.isMemorized } : f))
    )
  }

  const copyFormula = (text: string) => {
    navigator.clipboard?.writeText(text)
    showToast('Formula nusxalandi! 📋')
  }

  const categories = ['Barchasi (140+)', 'Algebra (45)', 'Geometriya (35)', 'Analiz (32)', 'Trigonometriya (28)']

  const filtered = formulas.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase()) ||
    item.formula.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-[#006C49] tracking-widest uppercase block">
            HDP ACADEMY
          </span>
          <h1 className="text-lg font-black text-[#131B2E] tracking-tight">
            Formulalar & Shporalar
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="w-9 h-9 rounded-full bg-[#006C49] text-white flex items-center justify-center shadow-xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Search & Filter Bar */}
      <div className="px-4 py-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-2xs">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Formulani qidirish (Viyet, Pifagor...)"
            className="w-full bg-transparent outline-none text-xs text-[#131B2E] placeholder:text-slate-400 font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 text-xs font-bold">
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => triggerHaptic('light')}
          className="w-11 h-11 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
          </svg>
        </button>
      </div>

      {/* 3. Category Chips */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat, idx) => {
          const isActive = selectedCategory === idx
          return (
            <button
              key={cat}
              onClick={() => { triggerHaptic('selection'); setSelectedCategory(idx) }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#006C49] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* 4. Formula of the Day (Nyuton-Leybnits) */}
      <section className="px-4 py-2.5">
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#004E35] via-[#006042] to-[#006C49] text-white p-5 shadow-[0_12px_32px_rgba(0,108,73,0.24)] overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              <span>⭐</span> KUN FORMULASI · DTM 100%
            </span>
            <span className="text-[11px] text-emerald-200/90 font-medium">
              👁 9.4k ko'rildi
            </span>
          </div>

          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-0.5">
            MATEMATIK ANALIZ
          </span>
          <h2 className="text-xl font-black text-white tracking-tight mb-3">
            Nyuton-Leybnits Teoremasi
          </h2>

          <div 
            onClick={() => copyFormula('∫ₐᵇ f(x)dx = F(b) − F(a)')}
            className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center mb-3.5 cursor-pointer hover:border-white/30 transition-colors"
          >
            <div className="font-serif text-lg sm:text-xl font-bold text-emerald-300 tracking-wide">
              ∫ₐᵇ f(x)dx = F(b) − F(a)
            </div>
            <span className="text-[10px] text-white/50 block mt-1">Nusxalash uchun bosing 📋</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">Integral va boshlang'ich funksiya</span>
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
              className="bg-white hover:bg-emerald-50 text-[#006C49] font-black text-xs px-4 py-2 rounded-full shadow-md"
            >
              Tahlil & Misol →
            </button>
          </div>
        </div>
      </section>

      {/* 5. Quick Action Cards (Formula Blitz & PDF Conspectus) */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3">
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
          className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-sm cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#006C49] flex items-center justify-center text-xl mb-2">
            ⚡
          </div>
          <div>
            <h3 className="text-xs font-black text-[#131B2E]">Formula Blitz</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">5 daqiqada 10 formula</p>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-emerald-700">+30 XP</span>
            <span className="w-6 h-6 rounded-full bg-[#006C49] text-white flex items-center justify-center text-[10px]">▶</span>
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => showToast('PDF yuklab olindi (12 MB)')}
          className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-sm cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-2">
            📥
          </div>
          <div>
            <h3 className="text-xs font-black text-[#131B2E]">PDF Shpora</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">DTM 2025 to'liq kitob</p>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 font-mono">12 MB</span>
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px]">⬇</span>
          </div>
        </motion.div>
      </div>

      {/* 6. Curated Formulas List */}
      <section className="px-4 py-2 space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-black text-[#131B2E]">Asosiy Formulalar Banki</h3>
          <span className="text-xs font-bold text-slate-400">142 ta mavjud</span>
        </div>

        {filtered.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-[26px] p-4 border border-slate-200/70 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.catBg} border flex items-center justify-center font-bold text-xs ${item.catColor}`}>
                  {item.cat}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#131B2E]">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={item.isSaved ? "#006C49" : "none"} stroke={item.isSaved ? "#006C49" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Formula Block */}
            <div 
              onClick={() => copyFormula(item.formula)}
              className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3 my-2 text-center font-mono text-xs font-black text-[#131B2E] cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {item.formula}
            </div>

            {/* Tags and Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => toggleMemorized(item.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                  item.isMemorized
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <span>{item.isMemorized ? '✓' : '○'}</span>
                <span>{item.isMemorized ? 'Yodlangan' : 'Yodlash'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#131B2E] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormulasScreen
