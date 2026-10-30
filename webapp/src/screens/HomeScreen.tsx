import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const HomeScreen = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(0)

  // Real-time Countdown Timer for Daily Mega Problem
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 22,
    seconds: 15,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 0, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (val: number) => val.toString().padStart(2, '0')

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-24 text-[#131B2E] select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#006C49]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#006C49] uppercase block">
              HDP ACADEMY
            </span>
            <h1 className="text-lg font-extrabold text-[#131B2E] leading-tight">
              Formulalar & Shporalar
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { triggerHaptic('light'); navigate('/formulas') }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <button 
            onClick={() => { triggerHaptic('light'); navigate('/formulas') }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <button 
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="w-9 h-9 rounded-full bg-[#006C49] flex items-center justify-center text-white shadow-sm"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-bold text-amber-900">
              <span>🪙</span>
              <span>1,250 Coin</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/70 rounded-full text-xs font-bold text-blue-900">
              <span className="text-blue-600 font-black">⚡</span>
              <span>3,850 XP</span>
            </div>
          </div>
          <button 
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 pr-1 flex items-center gap-0.5"
          >
            Tarix <span className="text-[10px]">›</span>
          </button>
        </div>
      </div>

      {/* 3. Info Notice */}
      <div className="px-4 py-1">
        <div className="bg-[#F0F4FF] rounded-xl px-3.5 py-2.5 border border-blue-100/80 flex items-center gap-2 text-xs text-slate-700">
          <span className="text-blue-600 font-bold text-sm">ⓘ</span>
          <span>Coinlarni HDP Pro yoki kurslarga almashtiring</span>
        </div>
      </div>

      {/* 4. Daily Mega Problem (Hero Card) */}
      <div className="px-4 py-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004A33] via-[#005B3F] to-[#006C49] text-white p-5 shadow-[0_8px_24px_rgba(0,108,73,0.22)]">
          {/* Subtle math graph grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Top Badge Row */}
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-400/20 backdrop-blur-xs border border-emerald-300/30 rounded-full text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              <span>🔥</span> KUNLIK MEGA MASALA
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-100 bg-black/20 px-2 py-0.5 rounded-md">
              <span>⏱</span> {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </span>
          </div>

          {/* Title & Tag */}
          <div className="relative z-10 mb-3">
            <div className="inline-block px-2 py-0.5 bg-emerald-500/30 text-emerald-200 text-[10px] font-bold rounded mb-1">
              DTM / IMO
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Parametrli Tenglama
            </h2>
          </div>

          {/* Formula Preview Box */}
          <div className="relative z-10 bg-black/25 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 mb-4">
            <div className="font-mono text-base font-bold text-emerald-300 tracking-wide mb-1">
              f(x) = x² - 2ax + a + 6 = 0
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              tenglama ikkita musbat ildizga ega bo'lsa, <span className="font-bold text-emerald-200">a</span> ning barcha qiymatlar sohasini toping.
            </p>
          </div>

          {/* Rewards & CTA */}
          <div className="relative z-10 flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/10">
                🪙 +50
              </span>
              <span className="bg-white/15 px-2.5 py-1 rounded-full text-xs font-bold text-blue-200 border border-white/10">
                ⚡ +80 XP
              </span>
            </div>

            <motion.button
              onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-emerald-50 active:bg-slate-100 text-[#006C49] font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md"
            >
              <span>Yechish</span>
              <span>→</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 5. Categories & Filters */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-extrabold text-[#131B2E]">Kategoriyalar</h3>
          <button 
            onClick={() => triggerHaptic('light')}
            className="text-xs font-semibold text-[#006C49] hover:underline"
          >
            Filterlar
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: 'Barchasi (320+)' },
            { label: 'Algebra (110)' },
            { label: 'Geometriya (85)' },
          ].map((cat, idx) => {
            const isActive = selectedCategory === idx
            return (
              <button
                key={cat.label}
                onClick={() => { triggerHaptic('selection'); setSelectedCategory(idx) }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#006C49] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 6. Quick Exercises & Blitz */}
      <div className="px-4 py-3">
        <h3 className="text-base font-extrabold text-[#131B2E]">Tezkor Mashqlar & Blitz</h3>
        <p className="text-xs text-slate-500 mb-3">
          Do'stlar bilan bellashing va bonus coin yutib oling
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Blitz Duel */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
                  <line x1="13" y1="19" x2="19" y2="13"/>
                  <line x1="16" y1="16" x2="20" y2="20"/>
                  <line x1="19" y1="21" x2="21" y2="19"/>
                  <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
                  <line x1="5" y1="14" x2="9" y2="18"/>
                  <line x1="7" y1="17" x2="4" y2="20"/>
                  <line x1="3" y1="19" x2="5" y2="21"/>
                </svg>
              </div>

              <h4 className="font-extrabold text-sm text-[#131B2E]">Blitz Duel</h4>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">1v1 Real-vaqt</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                3 daqiqada 5 ta misol yechib do'stingiz bilan bellashing.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                🪙 +30 Coin
              </span>
              <button
                onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
                className="w-8 h-8 rounded-full bg-[#006C49] text-white flex items-center justify-center shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Streak Seriya */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>

              <h4 className="font-extrabold text-sm text-[#131B2E]">Streak Seriya</h4>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">2x Koeffitsiyent</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Ketma-ket 10 ta to'g'ri javob bering va bonus oling.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                🪙 +100 Coin
              </span>
              <button
                onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
                className="w-8 h-8 rounded-full bg-[#006C49] text-white flex items-center justify-center shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Themed Problems (Mavzuli Masalalar) */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-extrabold text-[#131B2E]">Mavzuli Masalalar</h3>
          <button 
            onClick={() => { triggerHaptic('light'); navigate('/courses') }}
            className="text-xs font-semibold text-[#006C49] flex items-center gap-0.5 hover:underline"
          >
            Hammasi <span className="text-[10px]">›</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Bosqichma-bosqich o'rganish va amaliyot
        </p>

        <div className="space-y-3">
          {/* Problem 1 - New */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-serif font-black text-indigo-700 text-lg shrink-0">
                Σ
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-extrabold text-sm text-[#131B2E] truncate">
                    Viyet teoremasi va kvadratik tenglamalar
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md shrink-0">
                    Yangi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Oson</span>
                  <span>•</span>
                  <span>Algebra</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-amber-800">🪙 +15 Coin</span>
                <span className="text-blue-800">⚡ +25 XP</span>
              </div>
              <button
                onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
                className="px-4 py-1.5 bg-[#006C49] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#00573a]"
              >
                Yechish
              </button>
            </div>
          </div>

          {/* Problem 2 - Solved */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-[#006C49] text-lg shrink-0">
                △
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-extrabold text-sm text-[#131B2E] truncate">
                    Uchburchak medianasi va bissektrisasi xossalari
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md shrink-0 flex items-center gap-1">
                    ✓ Yechilgan
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">O'rta</span>
                  <span>•</span>
                  <span>Geometriya</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-amber-800">🪙 +25 Coin</span>
                <span className="text-blue-800">⚡ +40 XP</span>
              </div>
              <button
                onClick={() => { triggerHaptic('light'); navigate('/solve') }}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200"
              >
                Qayta ko'rish
              </button>
            </div>
          </div>

          {/* Problem 3 - Locked */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-base shrink-0">
                🔒
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-extrabold text-sm text-[#131B2E] truncate">
                    Murakkab trigonometrik tengsizliklar (IMO)
                  </h4>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md shrink-0">
                    Qulflangan
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Qiyin (Olimpiada)</span>
                  <span>•</span>
                  <span>Analiz</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-amber-800">🪙 +60 Coin</span>
                <span className="text-blue-800">⚡ +100 XP</span>
              </div>
              <button
                onClick={() => { triggerHaptic('medium'); navigate('/shop') }}
                className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-indigo-100"
              >
                <span>🔒</span>
                <span>200 Coin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Coinlar Do'koni Banner */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-blue-50/80 rounded-3xl p-4 border border-blue-100/80 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-2xl">
                🛍️
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#131B2E]">Coinlar Do'koni</h4>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  HDP STORE EXCLUSIVE
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-full shadow-2xs">
              1,250 mavjud
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed my-2.5">
            To'plangan coiningizni 1 oylik <span className="font-bold text-[#131B2E]">HDP Pro</span> obunasiga yoki DTM yopiq konspektlariga almashtiring!
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">DTM</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">PRO</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">PDF</span>
            </div>

            <button
              onClick={() => { triggerHaptic('medium'); navigate('/shop') }}
              className="px-4 py-2 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <span>Do'konga o'tish</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
