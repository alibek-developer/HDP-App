import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const SolveScreen = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(165) // 02:45

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleSelect = (val: number) => {
    if (isSubmitted) return
    triggerHaptic('selection')
    setSelectedOption(val)
  }

  const handleCheck = () => {
    if (selectedOption === null) return
    setIsSubmitted(true)
    const correct = selectedOption === 18
    setIsCorrect(correct)
    if (correct) {
      triggerHaptic('success')
    } else {
      triggerHaptic('error')
    }
  }

  const handleNext = () => {
    triggerHaptic('medium')
    navigate('/home')
  }

  const handleWatchVideo = () => {
    triggerHaptic('medium')
    navigate('/video')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32 text-[#111827] select-none font-sans relative">
      {/* 1. Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/home') }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              MASALA #142 · ALGEBRA
            </span>
            <h1 className="text-sm font-black text-[#131B2E]">Parametrli Tenglamalar</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full font-mono font-bold text-xs text-slate-700 shadow-2xs">
            <span>⏱</span>
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => { triggerHaptic('light'); setIsBookmarked(!isBookmarked) }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "#006C49" : "none"} stroke={isBookmarked ? "#006C49" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Top Progress & Bounty Pill */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>DTM / IMO QIYIN</span>
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
            💡 Maslahat (1/2)
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 rounded-full text-xs font-black text-[#006C49] shadow-2xs">
          <span>🪙 +50</span>
          <span>•</span>
          <span>⚡ +80 XP</span>
        </div>
      </div>

      {/* 3. Main Question Card */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-[32px] p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              KANONIK KO'RINISH
            </span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span>✓</span> HDP Ekspert Tanlovi
            </span>
          </div>

          {/* Formula Presentation Box */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-slate-50 border border-emerald-100 rounded-2xl p-4 text-center mb-3.5 shadow-inner">
            <div className="font-serif text-xl sm:text-2xl font-black text-[#003B26] tracking-wide">
              f(x) = x² − 2ax + a + 6 = 0
            </div>
          </div>

          {/* Statement */}
          <p className="text-xs text-slate-700 leading-relaxed font-sans mb-4">
            Ushbu kvadrat tenglama <span className="font-bold text-emerald-800">ikkita har xil musbat haqiqiy ildizga</span> ega bo'lsa, <span className="font-bold text-[#131B2E]">a</span> parametrning barcha butun qiymatlari yig'indisini toping.
          </p>

          {/* Theoretical Condition Chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-2.5 text-center">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">D &gt; 0</div>
              <div className="text-[10px] text-slate-500">2 xil ildiz</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-2.5 text-center">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">x₁ + x₂ &gt; 0</div>
              <div className="text-[10px] text-slate-500">Ildizlar yig'indisi</div>
            </div>
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-2.5 text-center">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">x₁ · x₂ &gt; 0</div>
              <div className="text-[10px] text-slate-500">Ko'paytmasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Options Grid (Duolingo 3D Tactile Buttons) */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
            JAVOBNI TANLANG
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            1 ta urinish
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'A', val: 14 },
            { label: 'B', val: 18, isAnswer: true },
            { label: 'C', val: 21 },
            { label: 'D', val: 12 },
          ].map((opt) => {
            const isSelected = selectedOption === opt.val
            const showSuccess = isSubmitted && opt.isAnswer
            const showError = isSubmitted && isSelected && !opt.isAnswer

            let btnTheme = 'bg-white border-slate-200 text-[#131B2E] border-b-4 hover:border-slate-300'
            let badgeTheme = 'bg-slate-100 text-slate-700'

            if (showSuccess) {
              btnTheme = 'bg-[#006C49] border-[#00472F] text-white border-b-4 shadow-md'
              badgeTheme = 'bg-white/20 text-white'
            } else if (showError) {
              btnTheme = 'bg-rose-50 border-rose-400 text-rose-800 border-b-4'
              badgeTheme = 'bg-rose-200 text-rose-900'
            } else if (isSelected) {
              btnTheme = 'bg-emerald-50 border-emerald-600 text-[#006C49] border-b-4 shadow-sm'
              badgeTheme = 'bg-[#006C49] text-white'
            }

            return (
              <motion.button
                key={opt.val}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(opt.val)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all select-none ${btnTheme}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${badgeTheme}`}>
                  {opt.label}
                </div>
                <div className="font-mono text-xl font-black mr-2">
                  {opt.val}
                </div>
                {showSuccess && <span className="text-white font-bold text-base">✓</span>}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* 5. Pre-submit Bottom Bar */}
      {!isSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 flex items-center justify-between">
          <button
            onClick={() => triggerHaptic('light')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 px-4 py-2.5 rounded-full hover:bg-slate-100"
          >
            <span>✏️</span>
            <span>Qoralama</span>
          </button>

          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`px-8 py-3.5 rounded-full text-xs font-black flex items-center gap-2 shadow-md transition-all ${
              selectedOption !== null
                ? 'bg-[#006C49] hover:bg-[#00573a] active:bg-[#00472f] text-white shadow-emerald-900/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Tekshirish</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 6. Post-submit Duolingo Bottom Sheet Result */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className={`fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto rounded-t-[36px] p-5 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] z-40 border-t ${
              isCorrect
                ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
                : 'bg-gradient-to-b from-rose-50 to-white border-rose-200'
            }`}
          >
            {/* Top result title */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                  isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {isCorrect ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className={`text-base font-black ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {isCorrect ? 'Barakalla! To\'g\'ri javob!' : 'Afsuski, xato javob!'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isCorrect ? '+50 Coin va +80 XP hisobingizga o\'tdi' : 'To\'g\'ri javob: 18'}
                  </p>
                </div>
              </div>

              {isCorrect && (
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs block">
                    🪙 +50
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                    ⚡ +80 XP
                  </span>
                </div>
              )}
            </div>

            {/* Explanation Toggle */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full text-left py-2 px-3 bg-white/80 rounded-xl border border-slate-200/80 mb-3 text-xs font-bold text-[#006C49] flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span>💬</span>
                <span>Bosqichma-bosqich yechimni ko'rish</span>
              </span>
              <span>{showExplanation ? '▲' : '▼'}</span>
            </button>

            {/* Expanded Math Solution */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 text-xs text-slate-700 space-y-2 mb-3 max-h-56 overflow-y-auto"
              >
                <div>
                  <span className="font-bold text-emerald-800">1. Diskriminant:</span>
                  <div className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg mt-0.5">
                    D = (-2a)² - 4·1·(a+6) = 4(a² - a - 6) &gt; 0<br/>
                    ⇒ a ∈ (-∞, -2) ∪ (3, +∞)
                  </div>
                </div>

                <div>
                  <span className="font-bold text-emerald-800">2. Viyet alomatlari:</span>
                  <div className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg mt-0.5">
                    x₁ + x₂ = 2a &gt; 0 ⇒ a &gt; 0<br/>
                    x₁ · x₂ = a + 6 &gt; 0 ⇒ a &gt; -6
                  </div>
                </div>

                <div>
                  <span className="font-bold text-emerald-800">3. Xulosa & Yig'indi:</span>
                  <div className="font-mono text-[11px] bg-slate-50 p-2 rounded-lg mt-0.5">
                    a ∈ (3, +∞). Oraliqdagi qiymatlar yig'indisi: 18.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions: Next and Video Solution */}
            <div className="space-y-2">
              <button
                onClick={handleNext}
                className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-3.5 rounded-full font-black text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-1.5"
              >
                <span>Davom etish</span>
                <span className="text-sm">→</span>
              </button>

              <button
                onClick={handleWatchVideo}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-full font-bold text-xs border border-slate-200 flex items-center justify-center gap-2"
              >
                <span className="text-emerald-700">▶</span>
                <span>Yechim videosi (1:45) • Ustoz Azamat</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SolveScreen
