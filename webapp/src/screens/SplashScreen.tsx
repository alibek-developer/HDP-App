import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Soft haptic feedback on launch
    triggerHaptic('light')

    // Smooth transition to /home after animation completes
    const timer = setTimeout(() => {
      triggerHaptic('medium')
      navigate('/home')
    }, 2400)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-[#FFFFFF] flex items-center justify-center overflow-hidden select-none z-50">
      {/* Subtle, luxurious radial ambient gradient glow in the center */}
      <div 
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0, 108, 73, 0.12) 0%, rgba(16, 185, 129, 0.04) 45%, transparent 70%)'
        }}
      />

      {/* Main Brand Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.94, 1, 1, 1.04],
          filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']
        }}
        transition={{ 
          duration: 2.3,
          times: [0, 0.35, 0.78, 1],
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative flex flex-col items-center justify-center text-center"
      >
        {/* Subtle Geometric Emblem Accent */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#006C49] to-[#10B981] p-[1.5px] shadow-[0_6px_20px_rgba(0,108,73,0.18)]">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-black text-xs text-[#006C49]">
                Σ
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sophisticated HDP Monogram */}
        <div className="relative">
          <h1 
            className="text-[44px] sm:text-[52px] font-black tracking-[0.28em] pl-[0.28em] font-sans leading-none select-none bg-gradient-to-br from-[#003823] via-[#006C49] to-[#059669] bg-clip-text text-transparent"
            style={{
              textShadow: '0 8px 30px rgba(0, 108, 73, 0.12)'
            }}
          >
            HDP
          </h1>

          {/* Elegant Shimmer Light Sweep Effect across the text */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 1.4, delay: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none mix-blend-overlay"
          />
        </div>

        {/* Minimalist Subtitle */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.35em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-3.5 pl-[0.45em] text-[10px] font-extrabold uppercase text-[#006C49]/60 tracking-[0.45em]"
        >
          ACADEMY
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SplashScreen
