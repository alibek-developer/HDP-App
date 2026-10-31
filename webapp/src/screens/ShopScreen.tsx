import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const ITEMS = [
  {
    id: 1,
    icon: '💎',
    title: '1 Oylik HDP Pro',
    desc: 'Barcha yopiq darslar va IMO masalalar',
    cost: 200,
    badge: 'PRO',
    badgeBg: '#EEF2FF',
    badgeColor: '#4338CA',
  },
  {
    id: 2,
    icon: '👑',
    title: '3 Oylik HDP Pro VIP',
    desc: '90 kunlik intensiv + VIP master-klasslar',
    cost: 500,
    badge: 'VIP',
    badgeBg: '#FFFBEB',
    badgeColor: '#D97706',
  },
  {
    id: 3,
    icon: '📄',
    title: 'DTM 2025 Formula PDF',
    desc: '140+ formulalar to\'plami, oflayn',
    cost: 50,
    badge: 'PDF',
    badgeBg: '#F0FDF4',
    badgeColor: '#059669',
  },
  {
    id: 4,
    icon: '🏆',
    title: 'IMO Masalalar Arxivi',
    desc: 'Xalqaro olimpiada masalalari + yechimlar',
    cost: 100,
    badge: 'ARXIV',
    badgeBg: '#F5F3FF',
    badgeColor: '#7C3AED',
  },
]

const ShopScreen = () => {
  const navigate = useNavigate()
  const [coins, setCoins]       = useState(340)
  const [toast, setToast]       = useState<string | null>(null)
  const [buying, setBuying]     = useState<number | null>(null)

  const handleBuy = (item: typeof ITEMS[0]) => {
    if (coins < item.cost) {
      triggerHaptic('error')
      setToast('Coin yetarli emas!')
      setTimeout(() => setToast(null), 2000)
      return
    }
    setBuying(item.id)
  }

  const confirmBuy = () => {
    const item = ITEMS.find(i => i.id === buying)
    if (!item) return
    triggerHaptic('success')
    setCoins(c => c - item.cost)
    setBuying(null)
    setToast(`✓ ${item.title} sotib olindi!`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="min-h-screen pb-10 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/home') }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Do'kon</p>
        <div style={{ width: 36 }} />
      </header>

      {/* Wallet */}
      <section className="px-4 mb-5">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #92400E 0%, #D97706 60%, #F59E0B 100%)',
            boxShadow: '0 8px 32px rgba(217,119,6,0.28)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10">
            <p className="text-amber-100 text-xs font-semibold mb-1">Hamyon balans</p>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-extrabold text-white">{coins.toLocaleString()}</span>
              <span className="text-amber-200 font-bold mb-1">🪙 coin</span>
            </div>
            <p className="text-amber-200 text-xs">Masalalar yechib coin to'plang</p>
          </div>
        </div>
      </section>

      {/* How to earn */}
      <section className="px-4 mb-5">
        <h3 className="text-sm font-bold mb-3" style={{ color: '#0F172A' }}>Coin qanday topiladi?</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { act: 'Dars ko\'rish',  val: '+20🪙' },
            { act: 'Masala yechish', val: '+10🪙' },
            { act: 'Test o\'tish',   val: '+50🪙' },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <p className="text-xs font-extrabold mb-1" style={{ color: '#D97706' }}>{c.val}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{c.act}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Items */}
      <section className="px-4 space-y-3">
        <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Nima sotib olish mumkin?</h3>
        {ITEMS.map(item => (
          <div
            key={item.id}
            className="rounded-xl p-4 flex items-center gap-3.5"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: item.badgeBg }}
            >
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>{item.title}</p>
                <span
                  className="text-[10px] font-black px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: item.badgeBg, color: item.badgeColor }}
                >
                  {item.badge}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{item.desc}</p>
            </div>

            <button
              onClick={() => handleBuy(item)}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl shrink-0 font-bold text-xs transition-all"
              style={{
                background: coins >= item.cost ? '#FFFBEB' : '#F1F4F9',
                color:      coins >= item.cost ? '#D97706' : '#CBD5E1',
                border:    `1px solid ${coins >= item.cost ? '#FDE68A' : '#E2E8F0'}`,
              }}
            >
              <span>🪙</span>
              <span>{item.cost}</span>
            </button>
          </div>
        ))}
      </section>

      {/* Confirm modal */}
      <AnimatePresence>
        {buying !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setBuying(null)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(15,23,42,0.55)' }}
            />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto p-6"
              style={{ background: '#FFFFFF', borderRadius: '24px 24px 0 0' }}
            >
              {(() => {
                const item = ITEMS.find(i => i.id === buying)!
                return (
                  <>
                    <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#E2E8F0' }} />
                    <div className="text-4xl text-center mb-3">{item.icon}</div>
                    <h3 className="text-lg font-extrabold text-center mb-1" style={{ color: '#0F172A' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-center mb-5" style={{ color: '#64748B' }}>
                      Narxi: <strong style={{ color: '#D97706' }}>🪙 {item.cost} coin</strong>
                    </p>
                    <button
                      onClick={confirmBuy}
                      className="w-full py-3.5 rounded-xl font-bold text-white mb-3 text-sm"
                      style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', boxShadow: '0 4px 16px rgba(217,119,6,0.28)' }}
                    >
                      Tasdiqlash — {item.cost} 🪙
                    </button>
                    <button
                      onClick={() => setBuying(null)}
                      className="w-full py-3 text-sm font-medium rounded-xl"
                      style={{ background: '#F1F4F9', color: '#94A3B8' }}
                    >
                      Bekor qilish
                    </button>
                  </>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-xs font-bold text-white z-50 whitespace-nowrap"
            style={{
              background:  toast.startsWith('✓') ? '#059669' : '#DC2626',
              boxShadow:   '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShopScreen
