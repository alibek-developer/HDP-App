import { Formula } from '../types'
import { Bookmark, ChevronRight } from 'lucide-react'

interface FormulaCardProps {
  formula: Formula
}

const FormulaCard = ({ formula }: FormulaCardProps) => {
  return (
    <div className="bg-surface-card rounded-xl border border-surface-border p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-primary bg-primary-container px-2 py-1 rounded">
          {formula.cat}
        </span>
        <Bookmark size={18} className={formula.saved ? 'text-primary fill-primary' : 'text-text-muted'} />
      </div>
      <h3 className="font-semibold text-text-primary mb-1">{formula.title}</h3>
      <p className="text-sm text-text-muted mb-3">{formula.desc}</p>
      <div className="bg-surface-low rounded p-2 mb-3">
        {formula.formulas.map((f, i) => (
          <code key={i} className="text-sm font-mono text-text-secondary block">
            {f}
          </code>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {formula.tags.map((tag) => (
            <span key={tag} className="text-xs text-text-muted bg-surface-low px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <ChevronRight size={20} className="text-text-muted" />
      </div>
    </div>
  )
}

export default FormulaCard
