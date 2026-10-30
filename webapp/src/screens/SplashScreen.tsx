import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const SplashScreen = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsReady(true)
          triggerHaptic('success')
          return 100
        }
        return prev + 2
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  const handleContinue = () => {
    triggerHaptic('medium')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Background Grid & Math Watermarks */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 108, 73, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 108, 73, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating mathematical symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden text-emerald-800/15 font-serif select-none">
        <span className="absolute top-16 left-6 text-xl">∫ dx</span>
        <span className="absolute top-24 right-10 text-lg font-mono">∑_&#123;i=1&#125;^n</span>
        <span className="absolute top-64 right-8 text-base">f(x) ↦ ℝ</span>
        <span className="absolute top-[44%] left-4 text-2xl font-mono">π ≈ 3.14159</span>
        <span className="absolute bottom-32 left-8 text-sm font-mono">lim Δx → 0</span>
        <span className="absolute bottom-24 right-6 text-base font-mono">e^(iπ) + 1 = 0</span>
      </div>

      {/* Top Status Bar Chips */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/90 border border-emerald-100 rounded-full shadow-sm text-xs font-mono text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider">SYST: ONLINE</span>
        </div>
        <div className="px-3 py-1 bg-white/90 border border-slate-200/80 rounded-full shadow-sm text-xs font-mono text-slate-600 tracking-wider">
          VER 3.14 · QED
        </div>
      </div>

      {/* Center Branding & Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-2">
        {/* Logo Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-36 h-36 bg-white rounded-[32px] p-2.5 shadow-[0_12px_36px_rgba(0,108,73,0.14)] border border-emerald-50 flex items-center justify-center">
            <div className="w-full h-full bg-[#032318] rounded-[24px] flex flex-col items-center justify-center p-3 relative overflow-hidden border border-emerald-500/20 shadow-inner">
              {/* Inner glowing effect */}
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/20 to-transparent opacity-60 pointer-events-none" />
              
              {/* Geometric HDP Vector Representation */}
              <div className="relative flex items-center justify-center mb-1">
                <svg width="68" height="34" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10 V40 M30 10 V40 M15 25 H30" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
                  <path d="M45 10 V40 M45 10 H60 C70 10 70 40 60 40 H45" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
                  <path d="M75 10 V40 M75 10 H88 C95 10 95 26 88 26 H75" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[10px] tracking-[0.2em] font-bold text-emerald-300 font-sans uppercase">
                HDP ACADEMY
              </span>
            </div>
          </div>

          {/* Subtag Pill */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 px-3 py-0.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-mono font-medium text-slate-700">
            ⟨H, D, P⟩ ⊂ ℝ³
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[25px] font-extrabold text-[#131B2E] leading-tight tracking-tight mt-3 mb-3 max-w-[300px]"
        >
          Matematika cho'qqilarini zabt eting
        </motion.h1>

        {/* Math Tagline Pill */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 bg-emerald-50/90 border border-emerald-300/80 rounded-full text-emerald-800 text-xs font-semibold shadow-sm font-mono"
        >
          ∀x ∈ Maqsad : x = Zafar
        </motion.div>
      </div>

      {/* Bottom Container: Progress Card & Action Button */}
      <div className="relative z-10 w-full space-y-4 pb-2">
        {/* Loading / Status Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
              <span className="text-base text-emerald-600">↺</span>
              <span>Tayyor!</span>
            </div>
            <span className="font-mono text-xs text-slate-500 font-medium">0.0s</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#006C49] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="flex justify-between items-center font-mono text-[11px] text-slate-500">
            <span className="tracking-wide">MODUL: TOPOLOGIYA</span>
            <span className="font-bold text-emerald-700">{progress}%</span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          onClick={handleContinue}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#006C49] hover:bg-[#00573a] active:bg-[#00472f] text-white py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,108,73,0.3)] transition-all"
        >
          <span>Davom etish</span>
          <span className="text-lg">→</span>
        </motion.button>

        {/* Sub-footer text */}
        <p className="text-center font-mono text-[10px] tracking-widest text-slate-500 uppercase">
          OLIMPIADA & OLIY MATEMATIKA LABORATORIYASI
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
