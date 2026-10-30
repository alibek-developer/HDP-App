import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SplashScreen = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setShowButton(true)
          return 100
        }
        return prev + 1
      })
    }, 15)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background math formulas texture */}
      <div className="absolute inset-0 opacity-5 text-6xl font-mono overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10">∫</div>
        <div className="absolute top-20 right-20">∑</div>
        <div className="absolute top-40 left-1/4">√</div>
        <div className="absolute bottom-40 right-1/4">π</div>
        <div className="absolute bottom-20 left-20">f(x)</div>
        <div className="absolute top-1/3 right-10">ax²</div>
        <div className="absolute bottom-1/3 left-10">sin</div>
        <div className="absolute top-1/2 right-1/2">cos</div>
      </div>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center z-10"
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-2">
          <span className="text-white text-3xl font-bold">hdp</span>
        </div>
        
        <p className="text-text-muted text-sm mt-2">(H, D, P) ⊂ ℝ³</p>
        
        <h2 className="text-2xl font-bold text-text-primary mt-8 text-center">
          Matematika cho'qqilarini zabt eting
        </h2>
        
        <div className="mt-3 px-4 py-2 border-2 border-primary rounded-full">
          <span className="text-primary font-semibold">∀x ∈ Maqsad : x = Zafar</span>
        </div>
      </motion.div>

      {/* Bottom loading card */}
      <div className="absolute bottom-8 left-4 right-4 bg-surface-card rounded-2xl shadow-card p-4 z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-primary font-semibold">✓ Tayyor!</span>
          <span className="text-text-muted text-sm">0.0s</span>
        </div>
        
        <div className="mb-2">
          <div className="w-full bg-surface-low rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-muted text-xs">MODUL: TOPOLOGIYA</span>
          <span className="text-primary font-semibold text-sm">{progress}%</span>
        </div>
        
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/login')}
            className="w-full bg-primary text-white rounded-full py-4 font-bold"
          >
            Davom etish →
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default SplashScreen
