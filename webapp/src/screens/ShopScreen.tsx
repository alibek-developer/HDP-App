import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const ShopScreen = () => {
  const navigate = useNavigate()
  const [coins, setCoins] = useState(1250)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const handleBuyWithCoin = (cost: number) => {
    if (coins >= cost) {
      triggerHaptic('success')
      setCoins((c) => c - cost)
      alert(`Muvaffaqiyatli sotib olindi! Qoldiq: ${coins - cost} Coin`)
    } else {
      triggerHaptic('error')
      alert('Kechirasiz, mablag\' yetarli emas!')
    }
  }

  const items = [
    {
      id: 1,
      icon: '💎',
      title: '1 Oylik HDP Pro Obuna',
      desc: 'Barcha yopiq video darslar va IMO masalalar to\'liq ochiq',
      cost: 200,
      badge: 'PRO',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 2,
      icon: '💎',
      title: '3 Oylik HDP Pro Obuna',
      desc: '90 kunlik intensiv tayyorgarlik va VIP imkoniyatlar',
      cost: 500,
      badge: 'PRO VIP',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 3,
      icon: '📄',
      title: 'DTM 2024 Formulalar to\'plami PDF',
      desc: 'Imtihonga tushadigan 140+ formulalar to\'liq shporasi',
      cost: 50,
      badge: 'PDF',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 4,
      icon: '🏆',
      title: 'IMO Olimpiada Masalalari Arxivi',
      desc: 'Xalqaro matematika olimpiadasi masalalari va yechimlari',
      cost: 100,
      badge: 'OLIMPIADA',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-24 text-[#131B2E] select-none">
      {/* 1. Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('light'); navigate(-1) }}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 className="text-base font-extrabold text-[#131B2E]">Coinlar Do'koni</h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full font-bold text-xs text-amber-900 shadow-2xs">
          <span>🪙</span>
          <span>{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Balance Card */}
      <div className="px-4 py-2">
        <div className="rounded-3xl bg-gradient-to-br from-[#004E35] to-[#006C49] text-white p-5 shadow-[0_8px_24px_rgba(0,108,73,0.18)]">
          <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
            <span>Mavjud tangalar balansi</span>
            <span className="font-semibold text-white/80">HDP Store Exclusive</span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black font-sans">{coins.toLocaleString()}</span>
            <span className="text-sm font-bold text-amber-300">Coin 🪙</span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed mb-4">
            Masalalarni to'g'ri yechib to'plagan coinlaringizni Pro obunaga va eksklyuziv materiallarga almashtiring.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
              className="flex-1 bg-white text-[#006C49] font-extrabold text-xs py-2.5 rounded-full shadow-sm text-center"
            >
              Pro Tariflariga O'tish →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Filter */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {['Barchasi', 'PRO Obuna', 'DTM Materiallar', 'Bonuslar'].map((cat, idx) => {
          const isActive = selectedCategory === idx
          return (
            <button
              key={cat}
              onClick={() => { triggerHaptic('selection'); setSelectedCategory(idx) }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#006C49] text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* 4. Products List */}
      <div className="px-4 py-2 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF8FF] border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-[#131B2E]">{item.title}</h4>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
              <div className="flex items-center gap-1 text-xs font-black text-amber-800">
                <span>🪙</span>
                <span>{item.cost} Coin</span>
              </div>

              <button
                onClick={() => handleBuyWithCoin(item.cost)}
                className="px-4 py-2 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-bold shadow-2xs"
              >
                Sotib olish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShopScreen
