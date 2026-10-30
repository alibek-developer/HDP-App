import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Share, Download, Bookmark, User, Lock, Check, Play } from 'lucide-react'
import { mockLessons } from '../data/mockData'

const CoursesScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2">
          <ArrowLeft size={20} className="text-text-muted" />
          <span className="text-text-primary font-medium">Kvadrat tenglamalar</span>
        </button>
        <div className="flex items-center gap-3">
          <Share size={20} className="text-text-muted" />
          <Download size={20} className="text-text-muted" />
          <Bookmark size={20} className="text-text-muted" />
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 px-4 mb-4">
        <span className="text-text-muted">⏱ 02:45</span>
        <span className="text-coin">+50🪙</span>
        <span className="text-xp">+80⚡</span>
      </div>

      {/* Badge */}
      <div className="px-4 mb-4">
        <span className="bg-surface-low text-error text-xs px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-error rounded-full" />
          DTM / IMO QIYIN DARAJA
        </span>
      </div>

      {/* Info */}
      <div className="px-4 mb-4 flex justify-between">
        <span className="text-sm text-text-muted">Mavzu: Kvadrat tenglamalar</span>
        <span className="text-sm text-text-muted">Doska / Qoralama</span>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">O'rganishni davom eting</h3>
        <span className="text-sm text-text-muted">3 / 10 Bepul</span>
      </div>

      {/* Lessons List */}
      <div className="px-4 mb-4 space-y-2">
        {mockLessons.map((lesson, i) => {
          let statusIcon = null
          let className = 'bg-surface-card border border-surface-border'
          
          if (lesson.status === 'done') {
            className = 'bg-primary-container border border-primary'
            statusIcon = <Check size={16} className="text-primary" />
          } else if (lesson.status === 'active') {
            className = 'bg-surface-card border-2 border-primary'
            statusIcon = <Play size={16} className="text-primary" />
          } else {
            statusIcon = <span className="w-6 h-6 bg-surface-low rounded-full flex items-center justify-center text-sm text-text-muted">{i + 1}</span>
          }

          return (
            <div key={lesson.id} className={`${className} rounded-xl p-4 flex items-center gap-3`}>
              {statusIcon}
              <div className="flex-1">
                <h4 className="font-medium text-text-primary text-sm">{lesson.title}</h4>
                <p className="text-xs text-text-muted">{lesson.duration}</p>
              </div>
              <span className="text-xs text-xp">+{lesson.xp} ⚡</span>
            </div>
          )
        })}
      </div>

      {/* Info Banner */}
      <div className="mx-4 bg-primary-container rounded-xl p-3 mb-4">
        <p className="text-sm text-primary">🔓 7, 8, 9 va 10-darslar ham bepul!</p>
      </div>

      {/* Pro Divider */}
      <div className="px-4 mb-4">
        <div className="bg-coin text-white text-center py-3 rounded-full font-semibold">
          🔒 PRO BOSQICHI (11-100+ DARSLAR)
        </div>
      </div>

      {/* Pro Courses */}
      <div className="px-4 mb-4">
        <h3 className="font-semibold text-text-primary mb-3">Pro kurslar</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card rounded-xl border border-surface-border p-4">
            <h4 className="font-semibold text-text-primary text-sm mb-2">DTM Blok</h4>
            <p className="text-xs text-text-muted mb-2">50+ dars</p>
            <button className="text-primary text-xs font-medium">Ko'rish →</button>
          </div>
          <div className="bg-surface-card rounded-xl border border-surface-border p-4">
            <h4 className="font-semibold text-text-primary text-sm mb-2">IMO Olimpiada</h4>
            <p className="text-xs text-text-muted mb-2">100+ dars</p>
            <button className="text-primary text-xs font-medium">Ko'rish →</button>
          </div>
        </div>
      </div>

      {/* Locked Lessons */}
      <div className="px-4 space-y-2">
        {[11, 12, 13].map((i) => (
          <div key={i} className="bg-surface-card rounded-xl border border-surface-border p-4 flex items-center gap-3 opacity-60">
            <Lock size={16} className="text-text-muted" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">Dars #{i}</h4>
              <p className="text-xs text-text-muted">Qulflangan</p>
            </div>
            <span className="text-text-muted">→</span>
          </div>
        ))}
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-surface-border p-4 max-w-mobile mx-auto">
        <button className="w-full bg-primary text-white rounded-full py-3 font-semibold">
          🎓 HDP Pro Obunasini faollashtirish →
        </button>
      </div>
    </div>
  )
}

export default CoursesScreen
