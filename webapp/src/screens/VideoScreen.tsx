import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Share, Download, Bookmark, User, Play, MessageCircle, FileText, ChevronRight } from 'lucide-react'

const VideoScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/courses')} className="flex items-center gap-2">
          <ArrowLeft size={20} className="text-text-muted" />
          <span className="text-text-primary font-medium truncate max-w-[150px]">Parametrli Tenglamalar</span>
        </button>
        <div className="flex items-center gap-3">
          <Share size={20} className="text-text-muted" />
          <Download size={20} className="text-text-muted" />
          <Bookmark size={20} className="text-text-muted" />
        </div>
      </div>

      {/* Video Player */}
      <div className="mx-4 bg-primary-dark rounded-2xl overflow-hidden aspect-video mb-4 relative">
        {/* Top info */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <span className="text-white text-sm">Azamat Qodirov</span>
          <span className="text-white/70 text-sm">348 o'quvchi</span>
        </div>
        
        {/* Live badge */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ● JONLI TAHLIL
        </div>
        
        {/* Background formula */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-white text-6xl font-mono">
          f(x) x² a 0
        </div>
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Play size={32} className="text-white ml-1" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
          <div className="flex items-center justify-between text-white text-xs mb-2">
            <span>06:42 / 14:18</span>
            <div className="flex gap-3">
              <span>1.25x</span>
              <span>1080p</span>
              <span>⛶</span>
            </div>
          </div>
          <div className="w-full bg-white/30 rounded-full h-1">
            <div className="bg-primary h-1 rounded-full" style={{ width: '47%' }} />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 mb-4 flex gap-2 flex-wrap">
        {['#142-Dars', 'Algebra', 'DTM 100%', 'Qiyin daraja'].map((badge) => (
          <span key={badge} className="bg-surface-low text-text-secondary text-xs px-3 py-1 rounded-full">{badge}</span>
        ))}
      </div>

      {/* Title */}
      <h2 className="px-4 text-xl font-bold text-text-primary mb-2">
        Parametrli Tenglamalar: Parabola Uchi...
      </h2>
      <p className="px-4 text-sm text-text-muted mb-4">
        Parametrli tenglamalarni yechish va ildizlar xossalarini o'rganish. Parabola uchining koordinatalarini topish usullari.
      </p>

      {/* Resources */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto">
        <button className="flex items-center gap-2 bg-surface-low text-text-secondary px-4 py-2 rounded-full text-sm whitespace-nowrap">
          <Download size={16} />
          Doska Konspekti (PDF)
        </button>
        <button className="flex items-center gap-2 bg-surface-low text-text-secondary px-4 py-2 rounded-full text-sm whitespace-nowrap">
          <FileText size={16} />
          Qaydlar (3)
        </button>
      </div>

      {/* Teacher Card */}
      <div className="mx-4 bg-surface-card rounded-xl border border-surface-border p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">Azamat Qodirov</h4>
            <p className="text-xs text-text-muted">Matematika o'qituvchisi · 10 yil tajriba</p>
          </div>
          <button className="border border-primary text-primary rounded-full px-4 py-2 text-sm font-medium">
            💬 Savol berish
          </button>
        </div>
      </div>

      {/* Test Card */}
      <div className="mx-4 bg-surface-low rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={20} className="text-primary" />
          <span className="font-semibold text-text-primary">Mustaqil Sinov</span>
        </div>
        <div className="flex gap-2 mb-3">
          <span className="bg-coin/10 text-coin px-2 py-1 rounded text-xs">+30 Coin</span>
          <span className="bg-xp/10 text-xp px-2 py-1 rounded text-xs">+50 XP</span>
        </div>
        <p className="text-sm text-text-muted mb-3">3 ta test savoli bilan bilimingizni tekshiring</p>
        <button onClick={() => navigate('/solve')} className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ml-auto">
          Testni Boshlash <ChevronRight size={16} />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="px-4 mb-4 border-b border-surface-border">
        <div className="flex gap-4">
          <button className="pb-3 border-b-2 border-primary text-primary font-medium text-sm">≡ Taymkodlar</button>
          <button className="pb-3 text-text-muted text-sm">📖 Doska Konspekti</button>
          <button className="pb-3 text-text-muted text-sm">💬 Savollar (48)</button>
        </div>
      </div>

      {/* Timestamps */}
      <div className="px-4 space-y-2 pb-4">
        {[
          { time: '00:00', status: 'viewed', title: 'Kirish' },
          { time: '02:15', status: 'current', title: 'Parametrli tenglamalar tushunchasi' },
          { time: '05:30', status: 'locked', title: 'Diskriminant va ildizlar' },
          { time: '08:45', status: 'locked', title: 'Parabola uchini topish' },
          { time: '12:00', status: 'locked', title: 'Misol yechimlari' },
        ].map((item, i) => {
          let icon = null
          if (item.status === 'viewed') icon = <Check size={16} className="text-primary" />
          else if (item.status === 'current') icon = <div className="w-2 h-2 bg-primary rounded-full" />
          else icon = <Lock size={16} className="text-text-muted" />

          return (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-card rounded-xl">
              <span className="text-sm text-text-muted font-mono w-12">{item.time}</span>
              {icon}
              <span className={`flex-1 text-sm ${item.status === 'locked' ? 'text-text-muted' : 'text-text-primary'}`}>{item.title}</span>
              {item.status !== 'locked' && <ChevronRight size={16} className="text-text-muted" />}
            </div>
          )
        })}
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-surface-border p-4 max-w-mobile mx-auto">
        <div className="flex items-center gap-3">
          <button className="text-text-muted">|◀</button>
          <button onClick={() => navigate('/video')} className="flex-1 bg-primary text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2">
            KEYINGI DARS #143: Murakkab tenglamalar 16:05
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoScreen
