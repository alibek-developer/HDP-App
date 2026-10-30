import { useNavigate } from 'react-router-dom'
import { Search, Bookmark, User, Play, Lock, Check } from 'lucide-react'
import { mockDailyProblem, mockProblems } from '../data/mockData'

const HomeScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-text-muted">HDP ACADEMY</p>
          <h2 className="text-xl font-bold text-text-primary">Formulalar & Shporalar</h2>
        </div>
        <div className="flex items-center gap-3">
          <Search size={20} className="text-text-muted" />
          <Bookmark size={20} className="text-text-muted" />
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 px-4 mb-3">
        <span className="bg-coin/10 text-coin px-3 py-1 rounded-full text-sm font-medium">🪙 1,250 Coin</span>
        <span className="bg-xp/10 text-xp px-3 py-1 rounded-full text-sm font-medium">⚡ 3,850 XP</span>
        <button className="text-primary text-sm ml-auto">Tarix &gt;</button>
      </div>

      {/* Info banner */}
      <div className="mx-4 bg-surface-low rounded-xl border border-surface-border p-3 mb-4">
        <p className="text-sm text-text-secondary">ℹ️ Coinlarni HDP Pro yoki kurslarga almashtiring</p>
      </div>

      {/* Daily Mega Problem */}
      <div className="mx-4 bg-primary-dark rounded-2xl p-4 text-white mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-primary-light text-primary-dark text-xs px-2 py-1 rounded">🎯 KUNLIK MEGA MASALA</span>
          <span className="text-xs">⏱ 04:22:15</span>
        </div>
        <div className="text-xs text-white/70 mb-1">{mockDailyProblem.category}</div>
        <h3 className="text-lg font-bold mb-2">{mockDailyProblem.title}</h3>
        <code className="text-sm font-mono text-primary-light mb-2 block">{mockDailyProblem.formula}</code>
        <p className="text-sm text-white/80 mb-3">{mockDailyProblem.description}</p>
        <div className="flex gap-2 mb-3">
          <span className="bg-white/20 px-2 py-1 rounded text-xs">+50 🪙</span>
          <span className="bg-white/20 px-2 py-1 rounded text-xs">+80 XP ⚡</span>
        </div>
        <button
          onClick={() => navigate('/solve')}
          className="bg-white text-primary rounded-full px-6 py-2 font-semibold text-sm"
        >
          Yechish →
        </button>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Barchasi (320+)', 'Algebra (110)', 'Geometriya (85)'].map((cat, i) => (
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

      {/* Quick Exercises */}
      <div className="px-4 mb-4">
        <h3 className="font-semibold text-text-primary mb-3">Tezkor Mashqlar & Blitz</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card rounded-xl border border-surface-border p-4">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-text-primary text-sm">Blitz Duel</h4>
            <p className="text-xs text-text-muted mb-2">Real vaqt o'tish</p>
            <div className="text-xs text-coin mb-2">+30 🪙</div>
            <button onClick={() => navigate('/blitz')} className="bg-primary text-white rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <Play size={12} /> Boshlash
            </button>
          </div>
          <div className="bg-surface-card rounded-xl border border-surface-border p-4">
            <div className="text-2xl mb-2">🔥</div>
            <h4 className="font-semibold text-text-primary text-sm">Streak Seriya</h4>
            <p className="text-xs text-text-muted mb-2">Kunlik challenge</p>
            <div className="text-xs text-coin mb-2">+50 🪙</div>
            <button className="bg-primary text-white rounded-full px-3 py-1 text-xs flex items-center gap-1">
              <Play size={12} /> Boshlash
            </button>
          </div>
        </div>
      </div>

      {/* Themed Problems */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">Mavzuli Masalalar</h3>
          <button className="text-primary text-sm">Hammasi →</button>
        </div>
        <div className="space-y-3">
          {mockProblems.map((problem) => (
            <div key={problem.id} className="bg-surface-card rounded-xl border border-surface-border p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{problem.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {problem.status === 'solved' && <Check size={16} className="text-primary" />}
                    {problem.status === 'locked' && <Lock size={16} className="text-text-muted" />}
                    <h4 className="font-semibold text-text-primary text-sm">{problem.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                    <span className={problem.difficulty === 'easy' ? 'text-green-600' : problem.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'}>
                      {problem.difficulty}
                    </span>
                    <span>·</span>
                    <span>{problem.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-coin">+{problem.coin} 🪙</span>
                    <span className="text-xp">+{problem.xp} ⚡</span>
                  </div>
                </div>
                {problem.status !== 'locked' && (
                  <button onClick={() => navigate('/solve')} className="bg-primary text-white rounded-full p-2">
                    <Play size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Banner */}
      <div className="mx-4 bg-surface-low rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-text-primary">Coinlar Do'koni</h4>
          <span className="text-sm text-text-muted">1,250 mavjud</span>
        </div>
        <p className="text-sm text-text-muted mb-3">Premium kontent va imtiyozlarni coinlarga sotib oling</p>
        <div className="flex gap-2 mb-3">
          {['DTM', 'PRO', 'PDF'].map((badge) => (
            <span key={badge} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{badge}</span>
          ))}
        </div>
        <button onClick={() => navigate('/shop')} className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">
          Do'konga o'tish →
        </button>
      </div>
    </div>
  )
}

export default HomeScreen
