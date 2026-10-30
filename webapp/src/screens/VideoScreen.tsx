import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const VideoScreen = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'timestamps' | 'notes' | 'qa'>('timestamps')
  const [currentTime, setCurrentTime] = useState('06:42')
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleTogglePlay = () => {
    triggerHaptic('light')
    setIsPlaying(!isPlaying)
  }

  const handleJumpTime = (time: string) => {
    triggerHaptic('selection')
    setCurrentTime(time)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Top Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('light'); navigate(-1) }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">#142-DARS</span>
            <h1 className="text-sm font-black text-[#131B2E]">Parametrli Tenglamalar</h1>
          </div>
        </div>

        <button
          onClick={() => { triggerHaptic('light'); setIsBookmarked(!isBookmarked) }}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "#006C49" : "none"} stroke={isBookmarked ? "#006C49" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </header>

      {/* 2. Mock Video Player 16:9 Aspect */}
      <section className="px-4 py-2">
        <div className="relative rounded-[32px] bg-[#07131B] text-white aspect-[16/10] overflow-hidden shadow-2xl flex flex-col justify-between p-4 border border-slate-800">
          {/* Top badges */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-300 border border-white/10 flex items-center gap-1">
              <span>🎓</span> Ustoz Azamat
            </span>
            <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>348 o'quvchi</span>
            </span>
          </div>

          {/* Center whiteboard math & controls */}
          <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold mb-2">
              ● JONLI TAHLIL
            </span>
            <div className="font-serif text-lg font-bold text-emerald-100 tracking-wide mb-1">
              f(x) = x² − 2ax + a + 6 = 0
            </div>
            <div className="font-mono text-[10px] text-slate-400 mb-3">
              x₀ = −b/(2a) • D ≥ 0 • x₁ + x₂ = 2a
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => triggerHaptic('light')} className="text-slate-300 hover:text-white text-xs font-mono">
                ↺ 10s
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all"
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
              </button>

              <button onClick={() => triggerHaptic('light')} className="text-slate-300 hover:text-white text-xs font-mono">
                10s ↻
              </button>
            </div>
          </div>

          {/* Bottom Scrub Bar */}
          <div className="w-full z-10 pt-2">
            <div className="w-full bg-white/20 rounded-full h-1 relative overflow-hidden mb-2">
              <div className="h-full bg-emerald-400 rounded-full w-[47%]" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>{currentTime} / 14:18</span>
              <div className="flex items-center gap-2.5">
                <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">1.25x</span>
                <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">1080p</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Teacher Info & QA */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-[26px] p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#006C49] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              AQ
            </div>
            <div>
              <h4 className="text-xs font-black text-[#131B2E]">Azamat Qodirov</h4>
              <p className="text-[11px] text-slate-500">HDP Bosh O'qituvchisi • DTM Ekspert</p>
            </div>
          </div>

          <button
            onClick={() => triggerHaptic('light')}
            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold"
          >
            💬 Savol berish
          </button>
        </div>
      </section>

      {/* 4. Independent Quiz Launcher Card */}
      <section className="px-4 py-2">
        <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-[28px] p-4 border border-blue-100/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg">
              ?
            </div>
            <div>
              <h4 className="text-xs font-black text-[#131B2E]">Mustaqil Sinov Testi</h4>
              <span className="text-[11px] text-slate-500">3 ta test savoli bilan o'zlashtirish</span>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
            className="px-4 py-2 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-black shadow-sm"
          >
            Testni Boshlash →
          </button>
        </div>
      </section>

      {/* 5. Timestamps Tab List */}
      <section className="px-4 py-2 space-y-2">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold text-[#006C49]">
          <span>≡ Dars Taymkodlari</span>
        </div>

        {[
          { time: '00:00', title: 'Masala shartini tahlil qilish va qoidalar', status: 'done' },
          { time: '04:15', title: 'Parabola uchining xossasi: f(0) > 0', status: 'current' },
          { time: '09:20', title: 'Diskriminant oraliqlarini kesishtirish', status: 'locked' },
          { time: '12:40', title: 'IMO usulidagi 30 soniyalik tezkor layfxak', status: 'star' },
        ].map((item) => (
          <div
            key={item.time}
            onClick={() => handleJumpTime(item.time)}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-300"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {item.time}
              </span>
              <span className="text-xs font-bold text-[#131B2E]">{item.title}</span>
            </div>
            <span className="text-slate-400 text-xs">▶</span>
          </div>
        ))}
      </section>
    </div>
  )
}

export default VideoScreen
