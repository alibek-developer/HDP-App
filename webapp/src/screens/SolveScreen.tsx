import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const SolveScreen = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showSolutionSteps, setShowSolutionSteps] = useState(true)

  // Countdown timer
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
    if (isChecked) return
    triggerHaptic('selection')
    setSelectedOption(val)
  }

  const handleCheck = () => {
    if (selectedOption === null) return
    setIsChecked(true)
    if (selectedOption === 18) {
      triggerHaptic('success')
    } else {
      triggerHaptic('error')
    }
  }

  const handleNextProblem = () => {
    triggerHaptic('medium')
    navigate('/home')
  }

  const handleWatchVideo = () => {
    triggerHaptic('medium')
    navigate('/video')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-28 text-[#131B2E] select-none">
      {/* 1. Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { triggerHaptic('light'); navigate(-1) }}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
                MASALA #142 · ALGEBRA
              </span>
              <h1 className="text-base font-extrabold text-[#131B2E] leading-tight">
                Parametrli Tenglamalar
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => triggerHaptic('light')}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
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

        {/* Sub Header Badges */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-mono font-bold text-slate-700 shadow-2xs">
            <span>⏱</span>
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100/90 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
            <span>+50 🪙</span>
            <span>+80 XP ⚡</span>
          </div>
        </div>

        {/* Difficult & Hint Bar */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>DTM / IMO QIYIN DARAJA</span>
          </div>

          <button 
            onClick={() => triggerHaptic('light')}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold text-[11px]"
          >
            <span>💡</span>
            <span>Maslahat (1/2)</span>
          </button>
        </div>

        {/* Topic Title */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            Mavzu: <span className="font-bold text-emerald-800">Kvadrat tenglamalar va Viyet</span>
          </div>
          <button 
            onClick={() => triggerHaptic('light')}
            className="text-indigo-600 font-semibold flex items-center gap-1"
          >
            <span>✏️</span>
            <span>Doska / Qoralama</span>
          </button>
        </div>
      </div>

      {/* 2. Kunlik Mega Masala Card */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              KUNLIK MEGA MASALA
            </span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span>✓</span> HDP Ekspert Tanlovi
            </span>
          </div>

          {/* Canonical Formula Container */}
          <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-4 text-center mb-3.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              KANONIK KO'RINISH
            </span>
            <div className="font-serif text-xl sm:text-2xl font-black text-[#00422B] tracking-wide">
              f(x) = x² − 2ax + a + 6 = 0
            </div>
          </div>

          {/* Problem Statement */}
          <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3.5">
            Ushbu kvadrat tenglama <span className="font-bold text-emerald-800">ikkita har xil musbat haqiqiy ildizga</span> ega bo'lsa, <span className="font-bold text-[#131B2E]">a</span> parametrning barcha butun qiymatlari yig'indisini toping.
          </p>

          {/* 3 Conditions Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F6F8FF] rounded-2xl p-2.5 text-center border border-indigo-50">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">D &gt; 0</div>
              <div className="text-[10px] text-slate-500 leading-tight">2 xil haqiqiy ildiz</div>
            </div>
            <div className="bg-[#F6F8FF] rounded-2xl p-2.5 text-center border border-indigo-50">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">x₁ + x₂ &gt; 0</div>
              <div className="text-[10px] text-slate-500 leading-tight">Ildizlar yig'indisi</div>
            </div>
            <div className="bg-[#F6F8FF] rounded-2xl p-2.5 text-center border border-indigo-50">
              <div className="font-mono text-xs font-bold text-[#131B2E] mb-0.5">x₁ · x₂ &gt; 0</div>
              <div className="text-[10px] text-slate-500 leading-tight">Ildizlar ko'paytmasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Answers Grid (4 Options) */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TO'G'RI JAVOBNI TANLANG
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            1 ta urinish
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'A', val: 14 },
            { label: 'B', val: 18, isCorrect: true },
            { label: 'C', val: 21 },
            { label: 'D', val: 12 },
          ].map((opt) => {
            const isSelected = selectedOption === opt.val
            const isTargetCorrect = opt.isCorrect

            let cardStyle = 'bg-white border-slate-200 text-[#131B2E]'
            let badgeStyle = 'bg-slate-100 text-slate-700'

            if (isChecked) {
              if (isTargetCorrect) {
                cardStyle = 'bg-[#006C49] border-[#006C49] text-white shadow-md'
                badgeStyle = 'bg-white/20 text-white'
              } else if (isSelected && !isTargetCorrect) {
                cardStyle = 'bg-rose-50 border-rose-300 text-rose-700'
                badgeStyle = 'bg-rose-200 text-rose-800'
              }
            } else if (isSelected) {
              cardStyle = 'border-2 border-emerald-600 bg-emerald-50/50 shadow-xs'
              badgeStyle = 'bg-emerald-600 text-white'
            }

            return (
              <motion.button
                key={opt.val}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(opt.val)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${cardStyle}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${badgeStyle}`}>
                  {opt.label}
                </div>
                <div className="font-extrabold text-lg mr-2 font-mono">
                  {opt.val}
                </div>
                {isChecked && isTargetCorrect && (
                  <span className="text-white font-bold text-sm">✓</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 4. Step-by-Step Solution (Shown or Expandable) */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 text-base">💬</span>
            <h3 className="font-extrabold text-sm text-[#131B2E]">
              Bosqichma-bosqich Yechim
            </h3>
          </div>
          <button
            onClick={() => setShowSolutionSteps(!showSolutionSteps)}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            {showSolutionSteps ? 'Barchasini yopish' : 'Ko\'rsatish'}
          </button>
        </div>

        <AnimatePresence>
          {showSolutionSteps && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded uppercase">
                    1-QADAM: DISKRIMINANT SHARTI
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">D &gt; 0</span>
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  Ikkita har xil haqiqiy ildiz mavjud bo'lishi uchun diskriminant qat'iy musbat bo'lishi shart:
                </p>
                <div className="bg-[#F8FAFC] rounded-2xl p-3 font-mono text-[11px] text-slate-800 space-y-1">
                  <div>D = (-2a)² - 4 · 1 · (a + 6) &gt; 0</div>
                  <div>4a² - 4a - 24 &gt; 0 ⇒ a² - a - 6 &gt; 0</div>
                  <div>(a - 3)(a + 2) &gt; 0 ⇒ <span className="font-bold text-emerald-700">a ∈ (-∞, -2) ∪ (3, +∞)</span></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded uppercase">
                    2-QADAM: VIYET TEOREMASI VA ALOMATLAR
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">x₁ &gt; 0, x₂ &gt; 0</span>
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  Ildizlarning ikkalasi ham musbat bo'lishi uchun ularning yig'indisi va ko'paytmasi musbat bo'lishi talab etiladi:
                </p>
                <div className="bg-[#F8FAFC] rounded-2xl p-3 font-mono text-[11px] text-slate-800 space-y-1">
                  <div>• Yig'indi: x₁ + x₂ = 2a &gt; 0 ⇒ <span className="font-bold text-emerald-700">a &gt; 0</span></div>
                  <div>• Ko'paytma: x₁ · x₂ = a + 6 &gt; 0 ⇒ <span className="font-bold text-emerald-700">a &gt; -6</span></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded uppercase">
                    3-QADAM: SHARTLAR KESISHMASI VA YIG'INDI
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">Xulosa</span>
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  Barcha shartlarning umumiy kesishmasi:
                </p>
                <div className="bg-[#F8FAFC] rounded-2xl p-3 font-mono text-[11px] text-slate-800 space-y-1.5">
                  <div>a ∈ (3, +∞) va masalada cheklangan butun qiymatlar majmuasi bo'yicha a ning butun yechimlari tahlili:</div>
                  <div className="text-slate-600">Misol parametr intervalida: a = 4, 5, 9</div>
                  <div className="font-bold text-emerald-800 pt-1 border-t border-slate-200">
                    ... yig'indisi: 18 ga teng.
                  </div>
                </div>
              </div>

              {/* HDP Quick Shortcut Method */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-4 border border-emerald-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-xs text-[#131B2E]">HDP Tezkor Usuli</h4>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded">
                      30 soniya
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Parabola grafigi shoxlari yuqoriga qaraganligi sababli, ikkala ildiz musbat bo'lishi uchun <span className="font-mono font-bold text-emerald-800">f(0) &gt; 0</span> va uchi <span className="font-mono font-bold text-emerald-800">x₀ = -b/(2a) &gt; 0</span> shartini tekshirish eng tezkor natijani beradi!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Result Banner (When Answered Correctly) */}
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 space-y-3"
        >
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl text-emerald-600">
                🏅
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#131B2E]">To'g'ri javob belgilandi!</h4>
                <p className="text-[11px] text-slate-500">Boshqotirma mukofoti hisobingizga o'tdi</p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs block">
                +50 🪙
              </span>
              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                +80 XP ⚡
              </span>
            </div>
          </div>

          {/* Action Button: Next Problem */}
          <button
            onClick={handleNextProblem}
            className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,108,73,0.25)]"
          >
            <span>Tushundim, keyingi misol</span>
            <span>→</span>
          </button>

          {/* Watch Video Solution Link */}
          <button
            onClick={handleWatchVideo}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 flex items-center justify-between shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">▶</span>
              <span>Yechimni videoda ko'rish (1:45)</span>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold">
              Ustoz Azamat
            </span>
          </button>
        </motion.div>
      )}

      {/* 6. Bottom Sticky Action Bar (When not checked) */}
      {!isChecked && (
        <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2.5 flex items-center justify-between z-40">
          <button 
            onClick={() => triggerHaptic('light')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            <span>✏️</span>
            <span>Qoralama</span>
          </button>

          <button 
            onClick={() => triggerHaptic('light')}
            className="text-xs font-semibold text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            Tahlil
          </button>

          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all ${
              selectedOption !== null
                ? 'bg-[#006C49] text-white hover:bg-[#00573a]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Tekshirish</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SolveScreen
