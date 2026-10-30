import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

interface ProblemItem {
  id: number
  symbol: string
  symbolBg: string
  symbolColor: string
  title: string
  category: string
  difficulty: 'Oson' | 'O\'rta' | 'Qiyin' | 'Olimpiada'
  difficultyColor: string
  passRate: string
  coin: number
  xp: number
  status: 'new' | 'solved' | 'locked'
}

const problemsList: ProblemItem[] = [
  {
    id: 1,
    symbol: 'Σ',
    symbolBg: 'from-emerald-500/10 to-teal-500/20 border-emerald-500/30',
    symbolColor: 'text-[#006C49]',
    title: 'Viyet teoremasi va parametrli tenglamalar',
    category: 'Algebra',
    difficulty: 'Oson',
    difficultyColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    passRate: '92%',
    coin: 15,
    xp: 25,
    status: 'new',
  },
  {
    id: 2,
    symbol: '△',
    symbolBg: 'from-blue-500/10 to-indigo-500/20 border-blue-500/30',
    symbolColor: 'text-blue-700',
    title: 'Uchburchak medianasi va bissektrisasi xossalari',
    category: 'Geometriya',
    difficulty: 'O\'rta',
    difficultyColor: 'bg-blue-50 text-blue-800 border-blue-200',
    passRate: '78%',
    coin: 25,
    xp: 40,
    status: 'solved',
  },
  {
    id: 3,
    symbol: '∫',
    symbolBg: 'from-purple-500/10 to-pink-500/20 border-purple-500/30',
    symbolColor: 'text-purple-700',
    title: 'Aniq integral yordamida yuzalarni hisoblash',
    category: 'Matematik Analiz',
    difficulty: 'O\'rta',
    difficultyColor: 'bg-blue-50 text-blue-800 border-blue-200',
    passRate: '65%',
    coin: 30,
    xp: 50,
    status: 'new',
  },
  {
    id: 4,
    symbol: '🔒',
    symbolBg: 'from-amber-500/10 to-rose-500/20 border-amber-500/30',
    symbolColor: 'text-amber-700',
    title: 'Murakkab trigonometrik tengsizliklar (IMO)',
    category: 'Olimpiada',
    difficulty: 'Olimpiada',
    difficultyColor: 'bg-rose-50 text-rose-800 border-rose-200',
    passRate: '24%',
    coin: 60,
    xp: 100,
    status: 'locked',
  },
]

const HomeScreen = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [showProModal, setShowProModal] = useState(false)
  const [userCoins, setUserCoins] = useState(1250)
  const [userXp, setUserXp] = useState(3850)

  // Session-based promo modal: only once per session
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hdp_pro_modal_seen')
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowProModal(true)
        sessionStorage.setItem('hdp_pro_modal_seen', 'true')
        triggerHaptic('light')
      }, 750)
      return () => clearTimeout(timer)
    }
  }, [])

  // Live countdown timer for Mega Quest
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 22,
    seconds: 15,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 0, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (n: number) => n.toString().padStart(2, '0')

  const categories = [
    { label: 'Barchasi', count: '320' },
    { label: 'Algebra', count: '110' },
    { label: 'Geometriya', count: '85' },
    { label: 'Analiz', count: '65' },
    { label: 'Olimpiada', count: '60' },
  ]

  const streakDays = [
    { day: 'D', done: true },
    { day: 'S', done: true },
    { day: 'CH', done: true },
    { day: 'P', done: true },
    { day: 'J', done: true },
    { day: 'SH', today: true },
    { day: 'Y', done: false },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* Decorative top ambient mesh gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none opacity-60 -z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 108, 73, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)'
        }}
      />

      {/* 1. Ultra-clean Header */}
      <header className="relative z-10 px-4 pt-3.5 pb-2 flex items-center justify-between">
        {/* User Greeting & Level */}
        <div 
          onClick={() => { triggerHaptic('light'); navigate('/profile') }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-[#006C49] to-[#10B981] p-[2px] shadow-[0_4px_12px_rgba(0,108,73,0.18)] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[16px] flex items-center justify-center font-extrabold text-[#006C49] text-xs">
                AS
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#006C49] text-white rounded-full text-[9px] font-black tracking-tighter border-2 border-white shadow-xs">
              Lv.4
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Xayrli kech</span>
              <span className="text-xs">👋</span>
            </div>
            <h1 className="text-sm font-black text-[#131B2E] tracking-tight leading-none mt-0.5">
              Sardor Aliyev
            </h1>
          </div>
        </div>

        {/* Currency & Notification Pills */}
        <div className="flex items-center gap-2">
          {/* Coin Pill */}
          <motion.div
            whileTap={{ scale: 0.94 }}
            onClick={() => { triggerHaptic('light'); navigate('/shop') }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-2xs cursor-pointer hover:border-amber-300 transition-colors"
          >
            <span className="text-xs">🪙</span>
            <span className="text-xs font-black text-slate-800 font-mono">
              {userCoins.toLocaleString()}
            </span>
          </motion.div>

          {/* XP Pill */}
          <motion.div
            whileTap={{ scale: 0.94 }}
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-2xs cursor-pointer"
          >
            <span className="text-xs font-black text-blue-600">⚡</span>
            <span className="text-xs font-black text-slate-800 font-mono">
              {userXp.toLocaleString()}
            </span>
          </motion.div>

          {/* Notification Button */}
          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs relative hover:bg-slate-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* 2. Interactive Weekly Streak Bar (Duolingo Style) */}
      <section className="px-4 py-2 relative z-10">
        <div className="bg-white rounded-[26px] p-3.5 border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shadow-inner">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-[#131B2E]">12 Kunlik Streak!</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Kunlik odat: 3/5 masala yechildi
              </p>
            </div>
          </div>

          {/* 7-Day Pills Row */}
          <div className="flex items-center gap-1">
            {streakDays.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-slate-400 font-mono">
                  {item.day}
                </span>
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    item.today
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm ring-2 ring-amber-400/40 animate-pulse'
                      : item.done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {item.today ? '🔥' : item.done ? '✓' : '•'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Hero: Daily Mega Problem (Dribbble Glassmorphism Card) */}
      <section className="px-4 py-2.5 relative z-10">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#003823] via-[#005739] to-[#006C49] text-white p-5 shadow-[0_16px_36px_rgba(0,108,73,0.28)] border border-emerald-400/20">
          {/* Subtle math graph overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '18px 18px'
            }}
          />

          {/* Top Row: Pill Badges */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/15 text-[10px] font-extrabold tracking-wider uppercase text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>KUNLIK MEGA SINOV</span>
            </div>

            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-100 border border-white/10">
              <span>⏱</span>
              <span>{formatTimer(timeLeft.hours)}:{formatTimer(timeLeft.minutes)}:{formatTimer(timeLeft.seconds)}</span>
            </div>
          </div>

          {/* Title & Level */}
          <div className="relative z-10 mb-3">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block mb-0.5">
              DTM / IMO OLIMPIADA · #142
            </span>
            <h2 className="text-xl font-black text-white tracking-tight leading-snug">
              Parametrli Kvadrat Tenglama
            </h2>
          </div>

          {/* Formula Glass Box */}
          <div className="relative z-10 bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner mb-4">
            <div className="font-serif text-lg sm:text-xl font-extrabold text-emerald-300 tracking-wide text-center">
              f(x) = x² − 2ax + a + 6 = 0
            </div>
            <p className="text-xs text-white/80 leading-relaxed text-center font-sans mt-1.5">
              Tenglama ikkita har xil musbat ildizga ega bo'lsa, <span className="font-bold text-emerald-200">a</span> parametrning barcha butun qiymatlari yig'indisini toping.
            </p>
          </div>

          {/* Rewards & 3D Tactile CTA Button */}
          <div className="relative z-10 flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-xl text-xs font-black text-amber-300 border border-white/10 flex items-center gap-1">
                <span>🪙</span>
                <span>+50</span>
              </div>
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-xl text-xs font-black text-blue-200 border border-white/10 flex items-center gap-1">
                <span>⚡</span>
                <span>+80 XP</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
              className="bg-white hover:bg-emerald-50 active:bg-slate-100 text-[#006C49] font-black text-xs px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all"
            >
              <span>Yechishga kirish</span>
              <span className="text-base font-bold">→</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 4. Interactive Quick Modes (Dribbble 3-Card Grid) */}
      <section className="px-4 py-2.5 relative z-10">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-sm font-black text-[#131B2E] tracking-tight">
            Tezkor Trenirovka Rejimlari
          </h3>
          <span className="text-[11px] font-bold text-[#006C49]">
            Bugun 2x bonus
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Blitz Duel Card */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => { triggerHaptic('medium'); navigate('/blitz') }}
            className="bg-white rounded-[26px] p-4 border border-slate-200/70 shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between group hover:border-emerald-300 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 text-[#006C49] flex items-center justify-center text-xl mb-3 border border-emerald-500/20">
              ⚔️
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="text-sm font-black text-[#131B2E]">Blitz Duel</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                1v1 real-vaqt bellashuv. 3 daqiqada 5 ta misol.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <span className="text-xs font-black text-amber-700 font-mono">
                +30 Coin
              </span>
              <div className="w-7 h-7 rounded-full bg-[#006C49] text-white flex items-center justify-center text-xs shadow-xs group-hover:scale-110 transition-transform">
                ▶
              </div>
            </div>
          </motion.div>

          {/* Formula Flashcards Card */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => { triggerHaptic('medium'); navigate('/formulas') }}
            className="bg-white rounded-[26px] p-4 border border-slate-200/70 shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between group hover:border-blue-300 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 text-blue-700 flex items-center justify-center text-xl mb-3 border border-blue-500/20">
              🎴
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="text-sm font-black text-[#131B2E]">Formula Express</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                140+ shporalar banki va kunlik formula testi.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <span className="text-xs font-black text-blue-700 font-mono">
                +40 XP
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs group-hover:scale-110 transition-transform">
                →
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Clean Category Pills */}
      <section className="px-4 py-2 relative z-10">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-sm font-black text-[#131B2E] tracking-tight">
            Mavzular Katalogi
          </h3>
          <span className="text-xs font-bold text-slate-400">
            320 ta masala
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === idx
            return (
              <button
                key={cat.label}
                onClick={() => { triggerHaptic('selection'); setSelectedCategory(idx) }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#006C49] text-white shadow-sm shadow-emerald-900/15'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 6. Curated Problems List (Modern Dribbble Cards) */}
      <section className="px-4 py-2 relative z-10 space-y-3">
        {problemsList.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (item.status === 'locked') {
                triggerHaptic('medium')
                navigate('/pro')
              } else {
                triggerHaptic('medium')
                navigate('/solve')
              }
            }}
            className="bg-white rounded-[26px] p-4 border border-slate-200/70 shadow-sm cursor-pointer hover:border-emerald-200 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5 mb-2.5">
              {/* Math Glyphs Badge */}
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.symbolBg} border flex items-center justify-center font-serif font-black text-xl shrink-0 ${item.symbolColor}`}>
                {item.symbol}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.difficultyColor}`}>
                    {item.difficulty}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-[#131B2E] leading-snug line-clamp-1">
                  {item.title}
                </h4>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>Aniq yechim: <strong className="text-emerald-700">{item.passRate}</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Rewards */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="text-amber-800">🪙 +{item.coin}</span>
                <span className="text-blue-800">⚡ +{item.xp} XP</span>
              </div>

              {item.status === 'locked' ? (
                <button className="px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200">
                  <span>🔒</span>
                  <span>Pro bilan ochish</span>
                </button>
              ) : item.status === 'solved' ? (
                <button className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200">
                  Qayta yechish
                </button>
              ) : (
                <button className="px-4 py-1.5 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-bold shadow-xs">
                  Yechish →
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* 7. Pro Membership Highlight Banner */}
      <section className="px-4 py-3 relative z-10">
        <div className="relative rounded-[28px] bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 border border-emerald-200/70 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#006C49] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
              💎
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#131B2E]">
                HDP Pro · DTM 100 Ballik Kafolat
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Barcha olimpiada va yopiq darslar to'liq ochiq
              </p>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
            className="px-4 py-2 bg-[#006C49] text-white font-bold text-xs rounded-full shrink-0 shadow-xs hover:bg-[#00573a]"
          >
            Ko'rish →
          </button>
        </div>
      </section>

      {/* 8. Pro Promo Modal (Shows ONLY ONCE per session) */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { triggerHaptic('light'); setShowProModal(false) }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="relative w-full max-w-[330px] bg-white rounded-[32px] p-5 shadow-2xl border border-emerald-50 overflow-hidden text-center z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => { triggerHaptic('light'); setShowProModal(false) }}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>

              {/* Glowing Top Emblem */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006C49] to-emerald-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-700/20 text-2xl">
                💎
              </div>

              {/* Promo Badge */}
              <span className="inline-block px-3 py-0.5 bg-emerald-50 border border-emerald-200 text-[#006C49] font-bold text-[10px] rounded-full uppercase tracking-wider mb-2">
                HDP PRO · MAXSUS TAKLIF
              </span>

              {/* Title */}
              <h3 className="text-base font-extrabold text-[#131B2E] leading-snug mb-1">
                Matematikani 2x Tezroq va Chuqurroq Egallang!
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-3.5 px-1">
                100+ yopiq video darslar, AI qadam-baqadam yechim va IMO olimpiada tahlillariga to'liq cheksiz kirish.
              </p>

              {/* Discount Box */}
              <div className="bg-[#F0FDF4] border border-emerald-200/80 rounded-2xl p-3 mb-4">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
                  <span>🔥</span>
                  <span>12 Oylik Reja: -50% Chegirma</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Oyiga bor-yo'g'i <span className="font-extrabold text-sm text-[#006C49]">26,500 so'm</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  triggerHaptic('medium')
                  setShowProModal(false)
                  navigate('/pro')
                }}
                className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(0,108,73,0.25)] transition-all"
              >
                <span>Pro Obunani Ko'rish</span>
                <span className="text-sm">→</span>
              </button>

              {/* Skip / Later */}
              <button
                onClick={() => { triggerHaptic('light'); setShowProModal(false) }}
                className="mt-2.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 block mx-auto"
              >
                Keyinroq ko'rish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomeScreen
