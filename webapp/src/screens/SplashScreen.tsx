import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

/**
 * 1-qadam: Ilova ochilganda.
 * Avtomatik o'tish YO'Q — foydalanuvchi ikki yo'ldan birini tanlaydi,
 * tanlov /login ga `mode` sifatida uzatiladi.
 */
const SplashScreen = () => {
  const navigate = useNavigate()

  const go = (mode: 'start' | 'signin') => {
    triggerHaptic('medium')
    navigate('/login', { state: { mode } })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col justify-between px-6 pt-20 pb-10 select-none font-sans"
      style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 60%, #3730A3 100%)' }}
    >
      {/* Brend */}
      <div className="text-center">
        <div
          className="w-20 h-20 rounded-[26px] mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
            boxShadow: '0 18px 50px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-white font-black text-4xl" style={{ fontFamily: 'serif' }}>
            Σ
          </span>
        </div>
        <h1 className="text-[44px] font-black text-white leading-none" style={{ letterSpacing: '-2.5px' }}>
          HDP
        </h1>
        <p className="text-indigo-300 text-[11px] font-semibold tracking-[5px] uppercase mt-2">
          Math Academy
        </p>
      </div>

      {/* Sarlavha */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="text-[30px] font-extrabold text-white leading-tight" style={{ letterSpacing: '-1px' }}>
          Matematikani
          <br />
          <span className="text-indigo-300">chuqurroq</span> egallang
        </h2>
        <p className="text-indigo-200/70 text-sm leading-relaxed mt-3 max-w-[280px] mx-auto">
          Darslar, misollar va testlar — bittasi ikkinchisiga olib kiradigan izchil o'quv yo'li.
        </p>
      </motion.div>

      {/* Ikki tanlov — majburiy to'xtash nuqtasi */}
      <div className="space-y-3">
        <button
          onClick={() => go('start')}
          className="w-full py-4 rounded-full font-bold text-base text-white"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
          }}
        >
          Boshlash
        </button>
        <button
          onClick={() => go('signin')}
          className="w-full py-4 rounded-full font-bold text-base text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)' }}
        >
          Kirish
        </button>
      </div>
    </motion.div>
  )
}

export default SplashScreen
