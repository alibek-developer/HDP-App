import { useNavigate } from 'react-router-dom'
import { Search, Bookmark, ChevronRight, Filter } from 'lucide-react'
import { mockFormulas } from '../data/mockData'
import FormulaCard from '../components/FormulaCard'

const FormulasScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-text-muted">HDP ACADEMY</p>
          <h2 className="text-xl font-bold text-text-primary">Formulalar</h2>
        </div>
        <div className="flex items-center gap-3">
          <Search size={20} className="text-text-muted" />
          <Bookmark size={20} className="text-text-muted" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 bg-surface-low border border-surface-border rounded-full px-4 py-2">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            placeholder="Formulani qidirish (Viyet, Pifagor...)"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <Filter size={18} className="text-text-muted" />
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Barchasi (140+)', 'Algebra (45)', 'Trigonometriya (32)', 'Geometriya (28)', 'Analiz (35)'].map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                i === 0 ? 'bg-primary text-white' : 'bg-surface-low text-text-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Formula */}
      <div className="mx-4 bg-primary rounded-2xl p-4 text-white mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary-light text-primary-dark text-xs px-2 py-1 rounded">⭐ KUN FORMULASI · DTM 100%</span>
        </div>
        <div className="text-xs text-white/70 mb-1">MATEMATIK ANALIZ</div>
        <h3 className="text-lg font-bold mb-3">Nyuton-Leybnits Teoremasi</h3>
        <div className="bg-primary-dark rounded-lg p-3 mb-3">
          <code className="text-lg font-mono text-primary-light">∫ₐᵇ f(x)dx = F(b) − F(a)</code>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">👁 9.4k ko'rildi</span>
          <button className="bg-white text-primary rounded-full px-4 py-2 text-sm font-medium">
            Tahlil & Misol →
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        <div className="bg-surface-card rounded-xl border border-surface-border p-4">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-semibold text-text-primary text-sm">Formula Blitz</h4>
          <p className="text-xs text-text-muted">Tezkor test</p>
        </div>
        <div className="bg-surface-card rounded-xl border border-surface-border p-4">
          <div className="text-2xl mb-2">📄</div>
          <h4 className="font-semibold text-text-primary text-sm">PDF Shpora</h4>
          <p className="text-xs text-text-muted">Yuklab olish</p>
        </div>
      </div>

      {/* Formulas list */}
      <div className="px-4 mb-4">
        <h3 className="font-semibold text-text-primary mb-3">Σ Asosiy Formulalar · 142 ta mavjud</h3>
        {mockFormulas.map((formula) => (
          <FormulaCard key={formula.id} formula={formula} />
        ))}
      </div>

      {/* Sticky bottom banner */}
      <div className="fixed bottom-16 left-0 right-0 bg-surface-card border-t border-surface-border p-4 max-w-mobile mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-primary">📋 Bugungi formula testi...</p>
            <p className="text-xs text-text-muted">10 ta formula · 5 daqiqa</p>
          </div>
          <button className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">
            Boshlash
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormulasScreen
