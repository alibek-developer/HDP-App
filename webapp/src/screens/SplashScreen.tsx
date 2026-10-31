import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/login', { replace: true }), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 60%, #3730A3 100%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="text-center relative z-10"
      >
        {/* Logo mark */}
        <div
          className="w-24 h-24 rounded-[28px] mx-auto mb-7 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Diagonal stripe texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)',
            }}
          />
          <span className="text-white font-black text-5xl relative z-10 select-none" style={{ fontFamily: 'serif' }}>
            Σ
          </span>
        </div>

        {/* Brand name */}
        <h1
          className="text-[52px] font-black text-white leading-none tracking-[-3px] mb-2"
          style={{ letterSpacing: '-3px' }}
        >
          HDP
        </h1>
        <p className="text-indigo-300 text-xs font-semibold tracking-[5px] uppercase">
          Math Academy
        </p>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-14 text-indigo-400/50 text-[11px] font-medium tracking-[3px] uppercase"
      >
        Matematikada ustoz bo'l
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.8, ease: 'linear' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-400/40 rounded-full overflow-hidden"
        style={{ transformOrigin: 'left' }}
      >
        <div className="h-full bg-indigo-300 rounded-full" />
      </motion.div>
    </motion.div>
  )
}

export default SplashScreen
