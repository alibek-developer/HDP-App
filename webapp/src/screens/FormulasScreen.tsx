import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

interface FormulaItem {
  id: number
  code: string
  codeBg: string
  codeColor: string
  title: string
  subtitle: string
  math1: string
  math2?: string
  tags: string[]
  memorized: boolean
  bookmarked: boolean
}

const initialFormulas: FormulaItem[] = [
  {
    id: 1,
    code: 'Alg',
    codeBg: 'bg-emerald-50 border-emerald-200',
    codeColor: 'text-[#006C49]',
    title: 'Viyet Teoremasi',
    subtitle: 'Kvadrat tenglama ildizlari xossalari',
    math1: 'x₁ + x₂ = -b / a',
    math2: 'x₁ · x₂ = c / a',
    tags: ['8-sinf', 'Tezkor usul'],
    memorized: true,
    bookmarked: false,
  },
  {
    id: 2,
    code: 'Geo',
    codeBg: 'bg-blue-50 border-blue-200',
    codeColor: 'text-blue-700',
    title: 'Kosinuslar Teoremasi',
    subtitle: 'Ixtiyoriy uchburchak tomonlari va burchaklari',
    math1: 'a² = b² + c² - 2bc · cos(α)',
    tags: ['Planimetriya', 'DTM Blok'],
    memorized: true,
    bookmarked: false,
  },
  {
    id: 3,
    code: 'Mat',
    codeBg: 'bg-purple-50 border-purple-200',
    codeColor: 'text-purple-700',
    title: 'Murakkab Funksiya Hosilasi',
    subtitle: 'Zanjir qoidasi (Chain Rule)',
    math1: "(f(g(x)))' = f'(g(x)) · g'(x)",
    tags: ['Hosila', 'Olimpiada'],
    memorized: true,
    bookmarked: false,
  },
  {
    id: 4,
    code: 'Trig',
    codeBg: 'bg-emerald-50 border-emerald-200',
    codeColor: 'text-emerald-700',
    title: 'Keltirish Formulalari',
    subtitle: 'π/2 va π burchaklar bo\'yicha reduksiya',
    math1: 'sin(π/2 - α) = cos(α)',
    math2: 'tg(π/2 + α) = -ctg(α)',
    tags: ['Trigonometriya', 'Shpora'],
    memorized: true,
    bookmarked: false,
  },
]

const FormulasScreen = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [formulas, setFormulas] = useState(initialFormulas)
  const [isSavedHero, setIsSavedHero] = useState(false)

  const toggleBookmark = (id: number) => {
    triggerHaptic('light')
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, bookmarked: !f.bookmarked } : f))
    )
  }

  const filteredFormulas = formulas.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    f.math1.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-32 text-[#131B2E] select-none">
      {/* 1. Top Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006C49]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#006C49] uppercase block">
              HDP ACADEMY
            </span>
            <h1 className="text-lg font-extrabold text-[#131B2E] leading-tight">
              Formulalar & Shporalar
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <button 
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="w-9 h-9 rounded-full bg-[#006C49] flex items-center justify-center text-white shadow-sm"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Search Input & Filter Button */}
      <div className="px-4 py-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-2xs">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </div>

        <button 
          onClick={() => triggerHaptic('light')}
          className="w-11 h-11 bg-indigo-50 border border-indigo-100/80 rounded-2xl flex items-center justify-center text-indigo-700 shadow-2xs hover:bg-indigo-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
        </button>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: 'Barchasi (140+)' },
          { label: 'Algebra (45)' },
          { label: 'Trigonometriya (32)' },
        ].map((cat, idx) => {
          const isActive = selectedCategory === idx
          return (
            <button
              key={cat.label}
              onClick={() => { triggerHaptic('selection'); setSelectedCategory(idx) }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#006C49] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. Kun Formulasi Hero Card (Nyuton-Leybnits) */}
      <div className="px-4 py-3">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#005739] via-[#006C49] to-[#047857] text-white p-5 shadow-[0_8px_24px_rgba(0,108,73,0.22)] overflow-hidden">
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
              <span>☆</span> KUN FORMULASI · DTM 100%
            </span>

            <button 
              onClick={() => { triggerHaptic('light'); setIsSavedHero(!isSavedHero) }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center text-white hover:bg-white/25"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isSavedHero ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div className="relative z-10 mb-3">
            <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-0.5">
              MATEMATIK ANALIZ
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Nyuton-Leybnits Teoremasi
            </h2>
          </div>

          {/* Math Box */}
          <div className="relative z-10 bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center mb-4">
            <div className="font-serif text-lg font-bold text-emerald-200 tracking-wide">
              ∫ₐᵇ f(x)dx = F(b) − F(a)
            </div>
          </div>

          {/* Footer info & action */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
              <span>👁</span> 9.4k ko'rildi
            </span>

            <button 
              onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
              className="bg-white hover:bg-emerald-50 text-[#006C49] font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1 shadow-md"
            >
              <span>Tahlil & Misol</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Quick Actions: Formula Blitz & PDF Shpora */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3">
        {/* Formula Blitz */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h4 className="font-extrabold text-sm text-[#131B2E]">Formula Blitz</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              5 daqiqada 10 formula sinovi
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50">
            <span className="text-xs font-bold text-emerald-700">+30 XP</span>
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
              className="w-8 h-8 rounded-full bg-[#006C49] text-white flex items-center justify-center shadow-xs"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Shpora */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h4 className="font-extrabold text-sm text-[#131B2E]">PDF Shpora</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              DTM 2024 to'liq konspekt
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50">
            <span className="text-xs font-bold text-slate-500">12 MB</span>
            <button
              onClick={() => { triggerHaptic('light') }}
              className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Asosiy Formulalar Ro'yxati */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-extrabold text-base text-[#131B2E]">
            <span className="text-[#006C49] font-serif font-black text-lg">Σ</span>
            <h3>Asosiy Formulalar</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">142 ta mavjud</span>
        </div>

        <div className="space-y-3">
          {filteredFormulas.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm"
            >
              {/* Header with code and bookmark */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold ${item.codeBg} ${item.codeColor}`}>
                    {item.code}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#131B2E]">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(item.id)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={item.bookmarked ? "#006C49" : "none"} stroke={item.bookmarked ? "#006C49" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>

              {/* Formula Container */}
              <div className="bg-[#F6F8FF] rounded-2xl p-3 my-2.5 text-center space-y-1.5">
                <div className="font-mono text-sm font-bold text-[#131B2E] tracking-wider">
                  {item.math1}
                </div>
                {item.math2 && (
                  <div className="font-mono text-sm font-bold text-[#131B2E] tracking-wider">
                    {item.math2}
                  </div>
                )}
              </div>

              {/* Tags & Memorized status */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Yodlangan</span>
                  </span>

                  <button 
                    onClick={() => { triggerHaptic('light'); navigate('/solve') }}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Bottom Floating Test CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-mobile mx-auto px-4 pointer-events-none z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-lg flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#131B2E]">Bugungi formula testi...</p>
              <p className="text-[10px] text-slate-500">Bilimingizni mustahkamlang</p>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
            className="px-4 py-2 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-bold shadow-xs"
          >
            Boshlash
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormulasScreen
