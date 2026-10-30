import { useNavigate } from 'react-router-dom'
import { Sigma, Bell, Menu, Edit, Crown, Flame, Zap, BookOpen, Trophy, Settings, LogOut, ChevronRight } from 'lucide-react'
import { mockUser } from '../data/mockData'

const ProfileScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sigma size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Mening Profilim</p>
            <p className="text-sm font-semibold text-text-primary">HDP Shaxsiy Kabinet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-text-muted" />
          <Menu size={20} className="text-text-muted" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="mx-4 bg-surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">AS</span>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
              <Edit size={14} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">{mockUser.name}</h2>
            </div>
            <p className="text-sm text-text-muted">@{mockUser.username} · #{mockUser.id}</p>
            <div className="mt-2">
              <span className="bg-primary-container text-primary px-3 py-1 rounded-full text-xs font-medium">
                🏆 {mockUser.rank} · Lv.{mockUser.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Card */}
      <div className="mx-4 bg-primary-dark rounded-2xl p-4 text-white mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Crown size={20} />
          <span className="font-bold">💎 HDP Pro Faol</span>
          <span className="bg-primary-light text-primary-dark text-xs px-2 py-1 rounded ml-auto">YILLIK</span>
        </div>
        <p className="text-sm text-white/80 mb-2">
          Barcha formulalar, darslar va masalalarga kirish
        </p>
        <p className="text-xs text-white/70 mb-3">Muddati: 31-Dekabr, 2025</p>
        <button className="bg-white/10 text-white border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
          Boshqarish
        </button>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        <div className="bg-surface-card rounded-xl border border-surface-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-primary" />
            <span className="text-sm text-text-muted">Olov Streak</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{mockUser.streak} kun</div>
          <div className="text-xs text-primary">Shaxsiy rekord!</div>
        </div>
        <div className="bg-surface-card rounded-xl border border-surface-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-xp" />
            <span className="text-sm text-text-muted">XP Jam'armasi</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{mockUser.xp} XP</div>
          <div className="text-xs text-text-muted">Keyingi: {mockUser.xpNext} XP (+150)</div>
        </div>
        <div className="bg-surface-card rounded-xl border border-surface-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-primary" />
            <span className="text-sm text-text-muted">Yechilgan</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{mockUser.solved} ta</div>
          <div className="text-xs text-text-muted">{mockUser.accuracy}% aniqlik</div>
        </div>
        <div className="bg-surface-card rounded-xl border border-surface-border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-coin" />
            <span className="text-sm text-text-muted">Reyting</span>
          </div>
          <div className="text-xl font-bold text-text-primary">#{mockUser.rating}-o'rin</div>
          <div className="text-xs text-text-muted">Respublika Top-100</div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mx-4 bg-surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Haftalik Faollik</h3>
          <span className="bg-surface-low text-text-secondary px-3 py-1 rounded-full text-xs">Jami 4.4 soat</span>
        </div>
        <div className="flex items-end justify-between h-24">
          {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha', 'Ya'].map((day, i) => {
            const height = mockUser.weeklyActivity[i] || 0
            const isActive = i === 5
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div
                  className={`w-6 rounded-t-lg ${isActive ? 'bg-primary' : 'bg-primary-container'}`}
                  style={{ height: `${height * 1.5}px` }}
                />
                <span className="text-xs text-text-muted">{day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="mx-4 bg-surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">Yutuqlar & Medallar</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">20/12 ochilgan (60%)</span>
            <button className="text-primary text-sm">Barchasi →</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🏆', name: 'Birinchi 100', unlocked: true },
            { icon: '🥇', name: 'Oltin medal', unlocked: true },
            { icon: '🥈', name: 'Kumush medal', unlocked: true },
            { icon: '🔥', name: '7 kunlik streak', unlocked: false },
            { icon: '⚡', name: 'Tezkor yechim', unlocked: false },
            { icon: '🎯', name: 'Aniqlik 95%', unlocked: false },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`flex flex-col items-center p-3 rounded-lg ${
                achievement.unlocked ? 'bg-surface-low' : 'bg-surface-low opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl mb-1">{achievement.icon}</span>
              <span className="text-xs text-text-muted text-center">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mx-4 bg-surface-card rounded-2xl overflow-hidden mb-4">
        {[
          { icon: Settings, label: 'Sozlamalar', desc: 'Ilova sozlamalari' },
          { icon: Bell, label: 'Bildirishnomalar', desc: 'Push bildirishnomalar' },
          { icon: BookOpen, label: 'Mening kurslarim', desc: 'Faol obunalar' },
          { icon: Crown, label: 'Pro obuna', desc: 'Boshqarish' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 border-b border-surface-border last:border-b-0"
          >
            <div className="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
              <item.icon size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
        ))}
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
            <LogOut size={16} className="text-error" />
          </div>
          <p className="text-sm font-medium text-error">Tizimdan chiqish</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-text-muted">● HDP Academy v2.4.0 · Barcha huquqlar himoyalangan</p>
      </div>
    </div>
  )
}

export default ProfileScreen
