import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, FileText, Sparkles, Lock, ChevronRight } from 'lucide-react'

const ShopScreen = () => {
  const navigate = useNavigate()

  const shopItems = [
    { icon: '📄', title: 'DTM Shporalar (PDF)', price: 50, coin: true, locked: false },
    { icon: '📚', title: 'Barcha formulalar PDF', price: 100, coin: true, locked: false },
    { icon: '🎯', title: 'DTM Mock Sinovlari (10 ta)', price: 150, coin: true, locked: false },
    { icon: '🏆', title: 'IMO Olimpiada masalalar', price: 200, coin: true, locked: false },
    { icon: '💎', title: 'HDP Pro 1 oylik', price: 50000, coin: false, locked: false },
    { icon: '💎', title: 'HDP Pro 3 oylik', price: 150000, coin: false, locked: false },
    { icon: '🔒', title: 'VIP Darslar', price: 300, coin: true, locked: true },
    { icon: '🔒', title: 'Shaxsiy o\'qituvchi', price: 1000, coin: true, locked: true },
  ]

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2">
          <ArrowLeft size={20} className="text-text-muted" />
          <span className="text-text-primary font-medium">Do'kon</span>
        </button>
        <div className="flex items-center gap-2 bg-surface-low px-3 py-1 rounded-full">
          <span className="text-coin">🪙</span>
          <span className="text-text-primary font-semibold">1,250</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="mx-4 bg-primary rounded-2xl p-4 text-white mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Mening Balansim</span>
          <button className="text-sm text-white/80">Tarix →</button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl font-bold">1,250</span>
          <span className="bg-primary-light text-primary-dark px-2 py-1 rounded text-sm">Coin</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-primary rounded-full py-2 text-sm font-medium">
            Coin Sotib Olish
          </button>
          <button className="flex-1 bg-white/10 text-white border border-white/20 rounded-full py-2 text-sm font-medium">
            Bonus Olish
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Barchasi', 'Shporalar', 'Kurslar', 'Pro', 'VIP'].map((cat, i) => (
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

      {/* Shop Items */}
      <div className="px-4 mb-4">
        <h3 className="font-semibold text-text-primary mb-3">Mavjud Mahsulotlar</h3>
        <div className="space-y-3">
          {shopItems.map((item, i) => (
            <div
              key={i}
              className={`bg-surface-card rounded-xl border ${
                item.locked ? 'border-surface-border opacity-60' : 'border-surface-border'
              } p-4 flex items-center gap-3`}
            >
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary text-sm">{item.title}</h4>
                <p className="text-xs text-text-muted">
                  {item.coin ? `${item.price} Coin` : `${item.price.toLocaleString()} UZS`}
                </p>
              </div>
              {item.locked ? (
                <Lock size={18} className="text-text-muted" />
              ) : (
                <button className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">
                  Sotib Olish
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pro Banner */}
      <div className="mx-4 bg-surface-low rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Crown size={24} className="text-coin" />
          <div>
            <h4 className="font-semibold text-text-primary">HDP Pro Obuna</h4>
            <p className="text-xs text-text-muted">Barcha imtiyozlarni oching</p>
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Cheksiz darslar</span>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">VIP shporalar</span>
        </div>
        <button onClick={() => navigate('/pro')} className="w-full bg-coin text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2">
          <Sparkles size={18} />
          Pro'ga O'tish
        </button>
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <div className="bg-surface-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-primary" />
            <span className="font-semibold text-text-primary text-sm">Coin qanday ishlaydi?</span>
          </div>
          <p className="text-xs text-text-muted mb-2">
            Masalalarni yechish, darslarni tamomlash va kundik challenge'larda coin to'plang.
          </p>
          <p className="text-xs text-text-muted">
            Coinlarni shporalar, kurslar va Pro obunaga almashtiring.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShopScreen
