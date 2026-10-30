import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const VideoScreen = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'timestamps' | 'notes' | 'comments'>('timestamps')
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleTogglePlay = () => {
    triggerHaptic('light')
    setIsPlaying(!isPlaying)
  }

  const handleStartTest = () => {
    triggerHaptic('medium')
    navigate('/solve')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-28 text-[#131B2E] select-none">
      {/* 1. Top Header */}
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

          <h1 className="text-sm font-extrabold text-[#131B2E] truncate max-w-[160px]">
            Dars Video T...
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerHaptic('light')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>

          <button 
            onClick={() => triggerHaptic('light')}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>

          <button 
            onClick={() => { triggerHaptic('light'); setIsBookmarked(!isBookmarked) }}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? "#006C49" : "none"} stroke={isBookmarked ? "#006C49" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <button 
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="w-8 h-8 rounded-full bg-[#006C49] flex items-center justify-center text-white shadow-2xs"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Mock Video Player 16:9 */}
      <div className="px-4 py-2">
        <div className="relative rounded-3xl bg-[#09151E] text-white aspect-[16/10] overflow-hidden shadow-lg flex flex-col justify-between p-4 border border-slate-800">
          {/* Subtle math grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #34D399 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Player Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-semibold text-emerald-300 border border-white/10">
              <span>🎓</span> Ustoz: Azamat Qodirov
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-semibold text-rose-300 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>348 o'quvchi</span>
            </span>
          </div>

          {/* Center Playback Controls & Board Formula */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* Live Badge */}
            <span className="mb-2 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold tracking-wider">
              ● JONLI TAHLIL
            </span>

            {/* Formula on whiteboard */}
            <div className="font-serif text-center font-bold text-lg text-emerald-200/90 tracking-wide mb-1">
              f(x) = x² - 2ax + a + 6 = 0
            </div>
            <div className="font-mono text-[10px] text-slate-400 mb-3">
              x₀ = -b / (2a) • D ≥ 0 • x₁ + x₂ = 2a
            </div>

            {/* Center Buttons (Rewind 10, Play, Forward 10) */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => triggerHaptic('light')}
                className="text-slate-300 hover:text-white flex flex-col items-center text-xs font-mono"
              >
                <span className="text-lg">↺</span>
                <span className="text-[9px]">10</span>
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30"
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

              <button 
                onClick={() => triggerHaptic('light')}
                className="text-slate-300 hover:text-white flex flex-col items-center text-xs font-mono"
              >
                <span className="text-lg">↻</span>
                <span className="text-[9px]">10</span>
              </button>
            </div>
          </div>

          {/* Bottom Player Scrub Bar */}
          <div className="relative z-10 w-full pt-2">
            <div className="w-full bg-white/20 rounded-full h-1 relative overflow-hidden mb-2">
              <div className="h-full bg-emerald-400 rounded-full w-[47%]" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>06:42 / 14:18</span>

              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">1.25x</span>
                <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">1080p</span>
                <span className="text-xs">⛶</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lesson Meta Badges */}
      <div className="px-4 py-2 flex items-center gap-1.5 flex-wrap">
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md">
          #142-Dars
        </span>
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
          Algebra
        </span>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md border border-emerald-200/60">
          DTM 100%
        </span>
        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[11px] font-bold rounded-md border border-rose-200/60">
          Qiyin daraja
        </span>
      </div>

      {/* 4. Lesson Title & Description */}
      <div className="px-4 py-1">
        <h2 className="text-base font-extrabold text-[#131B2E] leading-snug mb-1">
          Parametrli Tenglamalar: Parabola Uchi va Viyet Teoremasi Chuqur Tahlili
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          Kvadrat tenglamada ildizlarning oraliqlarga tushish qoidasi hamda parabola uchining koordinatalariga bog'liq yechim algoritmi.
        </p>
      </div>

      {/* 5. Resource Buttons */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => triggerHaptic('light')}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs whitespace-nowrap hover:bg-slate-50"
        >
          <span className="text-emerald-700">⬇</span>
          <span>Doska Konspekti (PDF)</span>
        </button>

        <button 
          onClick={() => triggerHaptic('light')}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs whitespace-nowrap hover:bg-slate-50"
        >
          <span>✏️</span>
          <span>Qaydlar (3)</span>
        </button>
      </div>

      {/* 6. Teacher Card */}
      <div className="px-4 py-1">
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                AQ
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white text-[8px]">
                ✓
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#131B2E]">Azamat Qodirov</h4>
              <p className="text-[11px] text-slate-500">HDP Bosh O'qituvchisi • DTM Ekspert</p>
            </div>
          </div>

          <button 
            onClick={() => triggerHaptic('light')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100"
          >
            <span>💬</span>
            <span>Savol berish</span>
          </button>
        </div>
      </div>

      {/* 7. Mustaqil Sinov Test Card */}
      <div className="px-4 py-2">
        <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-3xl p-4 border border-blue-100/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-base shrink-0">
                ?
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#131B2E]">Mustaqil Sinov</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">+30 Coin</span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">+50 XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="px-3.5 py-2 bg-[#006C49] hover:bg-[#00573a] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span>Testni Boshlash</span>
              <span>→</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            3 ta test savoli bilan darsni o'zlashtirish darajangizni sinab ko'ring
          </p>
        </div>
      </div>

      {/* 8. Tab Bar: Timestamps / Notes / Questions */}
      <div className="px-4 py-2">
        <div className="flex items-center border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('timestamps')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'timestamps'
                ? 'border-[#006C49] text-[#006C49]'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span>≡</span>
            <span>Taymkodlar</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'notes'
                ? 'border-[#006C49] text-[#006C49]'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span>📖</span>
            <span>Doska Konspekti</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'comments'
                ? 'border-[#006C49] text-[#006C49]'
                : 'border-transparent text-slate-400'
            }`}
          >
            <span>💬</span>
            <span>Savollar (48)</span>
          </button>
        </div>
      </div>

      {/* 9. Timestamps List */}
      <div className="px-4 py-1 space-y-2">
        {/* Item 1 - Viewed */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
              ✓
            </span>
            <div>
              <div className="text-[10px] text-slate-400 font-mono">00:00 • Ko'rildi</div>
              <h4 className="text-xs font-bold text-[#131B2E]">Masala shartini tahlil qilish va qoid...</h4>
            </div>
          </div>
          <button className="text-slate-400 text-xs">▶</button>
        </div>

        {/* Item 2 - Playing */}
        <div className="bg-white rounded-2xl p-3 border-2 border-emerald-500 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
              ⏸
            </span>
            <div>
              <div className="text-[10px] text-emerald-700 font-bold font-mono">04:15 • ● Hozir ijroda (06:42)</div>
              <h4 className="text-xs font-bold text-[#131B2E]">Parabola uchining xossasi: f(0) &gt; ...</h4>
            </div>
          </div>
          <span className="text-emerald-600 font-bold text-xs">⏸</span>
        </div>

        {/* Item 3 - Locked */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center justify-between opacity-70">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs shrink-0">
              🔒
            </span>
            <div>
              <div className="text-[10px] text-slate-400 font-mono">09:20 • Davomiyligi: 3:20</div>
              <h4 className="text-xs font-bold text-[#131B2E]">Diskriminant oraliqlarini kesishtiris...</h4>
            </div>
          </div>
          <span className="text-slate-400 text-xs">›</span>
        </div>

        {/* Item 4 - Hack */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs shrink-0">
              ⭐
            </span>
            <div>
              <div className="text-[10px] text-amber-700 font-bold font-mono">12:40 • IMO Layfxak</div>
              <h4 className="text-xs font-bold text-[#131B2E]">IMO usulidagi 30 soniyalik tezkor te...</h4>
            </div>
          </div>
          <span className="text-slate-400 text-xs">›</span>
        </div>
      </div>

      {/* 10. Sticky Bottom Next Lesson CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center gap-2 z-40">
        <button 
          onClick={() => triggerHaptic('light')}
          className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm shrink-0 hover:bg-slate-200"
        >
          |◀
        </button>

        <button
          onClick={() => { triggerHaptic('medium'); navigate('/video') }}
          className="flex-1 bg-[#006C49] hover:bg-[#00573a] text-white py-3 px-4 rounded-full font-bold text-xs flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">▶</span>
            <span className="truncate">KEYINGI DARS #143: Logarifmik Tengl...</span>
          </div>
          <span className="text-emerald-200 text-[11px] font-mono shrink-0 ml-1">16:05 →</span>
        </button>
      </div>
    </div>
  )
}

export default VideoScreen
