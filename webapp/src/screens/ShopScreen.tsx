import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const ShopScreen = () => {
  const navigate = useNavigate()
  const [coins, setCoins] = useState(1250)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [successItem, setSuccessItem] = useState<string | null>(null)

  const handleBuy = (title: string, cost: number) => {
    if (coins >= cost) {
      triggerHaptic('success')
      setCoins((c) => c - cost)
      setSuccessItem(title)
      setTimeout(() => setSuccessItem(null), 2500)
    } else {
      triggerHaptic('error')
      alert('Tangalar yetarli emas! Masalalarni yechib coin to\'plang.')
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
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 2,
      icon: '💎',
      title: '3 Oylik HDP Pro Obuna',
      desc: '90 kunlik intensiv tayyorgarlik va VIP imkoniyatlar',
      cost: 500,
      badge: 'PRO VIP',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 3,
      icon: '📄',
      title: 'DTM 2025 Formulalar to\'plami PDF',
      desc: 'Imtihonga tushadigan 140+ formulalar to\'liq shporasi',
      cost: 50,
      badge: 'PDF',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 4,
      icon: '🏆',
      title: 'IMO Olimpiada Masalalari Arxivi',
      desc: 'Xalqaro matematika olimpiadasi masalalari va yechimlari',
      cost: 100,
      badge: 'OLIMPIADA',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/home') }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">MARKETPLACE</span>
            <h1 className="text-base font-black text-[#131B2E]">Coinlar Do'koni</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full font-black text-xs text-amber-900 shadow-2xs">
          <span>🪙</span>
          <span className="font-mono">{coins.toLocaleString()}</span>
        </div>
      </header>

      {/* 2. Balance Card */}
      <section className="px-4 py-2">
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#003823] via-[#005739] to-[#006C49] text-white p-5 shadow-[0_12px_32px_rgba(0,108,73,0.24)] border border-emerald-400/20 overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-200 mb-1">
            <span>Mening Hamyonim</span>
            <span className="font-bold text-emerald-300">HDP Store Exclusive</span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black font-mono">{coins.toLocaleString()}</span>
            <span className="text-sm font-bold text-amber-300">Coin 🪙</span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed mb-4">
            Masalalarni yechib to'plagan coiningizni Pro obunaga va eksklyuziv PDF konspektlarga almashtiring.
          </p>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
            className="w-full bg-white hover:bg-emerald-50 text-[#006C49] font-black text-xs py-3 rounded-full shadow-md"
          >
            HDP Pro Tariflarini Ko'rish →
          </button>
        </div>
      </section>

      {/* 3. Items List */}
      <section className="px-4 py-2 space-y-3">
        <h3 className="text-xs font-black text-[#131B2E] px-1 uppercase tracking-wider text-slate-500">
          Mavjud Mahsulotlar
        </h3>

        {items.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-black text-[#131B2E] truncate">{item.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs font-black text-amber-900 font-mono">
                <span>🪙</span>
                <span>{item.cost} Coin</span>
              </div>

              <button
                onClick={() => handleBuy(item.title, item.cost)}
                className="px-4 py-1.5 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-black shadow-xs"
              >
                Almashtirish →
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Success Modal / Toast */}
      <AnimatePresence>
        {successItem && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#131B2E] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl z-50 flex items-center gap-2"
          >
            <span>🎉</span>
            <span>"{successItem}" muvaffaqiyatli xarid qilindi!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShopScreen
