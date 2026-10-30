import { useNavigate } from 'react-router-dom'
import { Sigma } from 'lucide-react'

const LoginScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/')} className="text-text-muted">close</button>
        <div className="flex items-center gap-2 bg-primary-container px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-primary text-xs font-semibold">HDP ACADEMY MATEMATIKA</span>
        </div>
        <button className="text-primary text-sm">Qayta tiklash</button>
      </div>

      {/* Hero */}
      <div className="px-4 mt-8 text-center">
        <p className="text-text-secondary text-lg">
          Matematikani 2x tezroq va chuqurroq egallang
        </p>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-text-primary">HDP PRO</h1>
          <span className="bg-coin text-white text-xs px-2 py-1 rounded ml-2">MATEMATIKA</span>
        </div>
        
        <div className="mt-6 bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 inline-block">
          <Sigma size={64} className="text-white" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around mt-8 px-4 border-t border-b border-surface-border py-4">
        <div className="text-center">
          <div className="text-xl font-bold text-text-primary">4.9 ⭐</div>
          <div className="text-xs text-text-muted">Reyting</div>
        </div>
        <div className="text-center border-l border-surface-border pl-8">
          <div className="text-xl font-bold text-text-primary">2.4x</div>
          <div className="text-xs text-text-muted">O'rtacha o'sish</div>
        </div>
        <div className="text-center border-l border-surface-border pl-8">
          <div className="text-xl font-bold text-text-primary">25k+</div>
          <div className="text-xs text-text-muted">O'quvchilar</div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 mt-6 space-y-3">
        {[
          { icon: '📐', title: 'Cheksiz Darslar & Formulalar Banki' },
          { icon: '⚡', title: 'Al Qadam-baqadam Formula Yechimi' },
          { icon: '🎯', title: 'Milliy Sertifikat & Mock Sinovlari' },
        ].map((feature, i) => (
          <div key={i} className="bg-surface-card rounded-xl border border-surface-border p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-text-primary font-medium">{feature.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-3">
        <div className="bg-surface-card rounded-xl border-2 border-primary p-4">
          <div className="text-xs bg-primary text-white px-2 py-1 rounded inline-block mb-2">-50%</div>
          <div className="text-sm text-text-muted">12 Oylik</div>
          <div className="text-lg font-bold text-text-primary">318,000 UZS</div>
        </div>
        <div className="bg-surface-card rounded-xl border border-surface-border p-4">
          <div className="text-sm text-text-muted">3 Oylik</div>
          <div className="text-lg font-bold text-text-primary">159,000 UZS</div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-8">
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-primary text-white rounded-full py-4 font-bold"
        >
          HDP PRO'NI BOSHLASH →
        </button>
        <p className="text-center text-xs text-text-muted mt-3">
          Istalgan vaqtda bekor qilish mumkin · 7 kunlik kafolat
        </p>
        
        {/* Payment logos */}
        <div className="flex justify-center gap-4 mt-4">
          {['Payme', 'Click', 'Uzum Bank', 'Uzcard/Humo'].map((logo) => (
            <span key={logo} className="text-xs text-text-muted bg-surface-low px-3 py-1 rounded">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
