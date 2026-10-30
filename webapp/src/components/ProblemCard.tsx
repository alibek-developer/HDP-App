import { Problem } from '../types'
import { Lock, Check, Play } from 'lucide-react'

interface ProblemCardProps {
  problem: Problem
  onAction?: () => void
}

const ProblemCard = ({ problem, onAction }: ProblemCardProps) => {
  const getStatusIcon = () => {
    switch (problem.status) {
      case 'solved':
        return <Check size={20} className="text-primary" />
      case 'locked':
        return <Lock size={20} className="text-text-muted" />
      default:
        return null
    }
  }

  const getDifficultyColor = () => {
    switch (problem.difficulty) {
      case 'easy':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'hard':
        return 'text-red-600'
    }
  }

  return (
    <div className={`bg-surface-card rounded-xl border border-surface-border p-4 ${
      problem.status === 'locked' ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{problem.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon()}
            <h3 className="font-semibold text-text-primary">{problem.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span className={getDifficultyColor()}>{problem.difficulty}</span>
            <span>·</span>
            <span>{problem.category}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-coin">+{problem.coin} 🪙</span>
            <span className="text-xp">+{problem.xp} ⚡</span>
          </div>
        </div>
        {problem.status !== 'locked' && (
          <button
            onClick={onAction}
            className="bg-primary text-white rounded-full p-2"
          >
            <Play size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProblemCard
