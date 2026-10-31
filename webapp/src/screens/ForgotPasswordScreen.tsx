import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Mail } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'

const ease = [0.22, 1, 0.36, 1] as const

const fieldBox = 'flex items-center gap-2.5 h-[54px] px-4 rounded-[18px] bg-white'
const fieldStyle = { border: '1px solid #E4E9DD', boxShadow: '0 2px 10px rgba(28,50,20,0.04)' }
const inputCls = 'flex-1 bg-transparent outline-none text-[15px] font-semibold text-ink placeholder:text-ink-4'

/**
 * Parolni tiklash — emailga havola yuboriladigan ekranga o'tish.
 * Yuborish mantig'i keyin qo'shiladi.
 */
const ForgotPasswordScreen = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const send = () => {
    triggerHaptic('success')
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: 'linear-gradient(180deg, #CDE9AE 0%, #E6F5D2 40%, #F7FCED 76%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-[340px] grid-paper opacity-60 pointer-events-none" />

      <header className="relative z-10 safe-top pt-4 px-5">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/login', { replace: true }) }}
          className="w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(28,50,20,0.08)' }}
          aria-label="Orqaga"
        >
          <ChevronLeft size={19} className="text-ink-2" />
        </button>
      </header>

      {/* Brend loqosi */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.6, ease }}
        className="relative z-10 flex items-center justify-center gap-2.5 mt-5"
      >
        <span
          className="w-[38px] h-[38px] rounded-[13px] flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 60%, #5FAF22 100%)',
            boxShadow: '0 8px 20px rgba(95,175,34,0.36), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          <span className="font-serif text-[19px] leading-none text-ink-on-lime">Σ</span>
        </span>
        <p className="font-serif text-[26px] text-brand-deep" style={{ letterSpacing: '-0.01em' }}>
          HDP Matematika
        </p>
      </motion.div>

      {/* Sarlavha */}
      <div className="relative z-10 px-8 mt-6 text-center">
        <h1 className="text-[27px] leading-[1.2]" style={{ letterSpacing: '-0.028em', wordSpacing: '0.05em' }}>
          <span className="font-normal text-ink-4">Parolni </span>
          <span className="font-extrabold text-ink">tiklash</span>
        </h1>
        <p className="text-body-md text-ink-3 mt-2 leading-relaxed max-w-[300px] mx-auto">
          Emailingizni kiriting — parolni yangilash havolasini yuboramiz.
        </p>
      </div>

      {/* Forma */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.6, ease }}
        className="relative z-10 px-6 mt-7"
      >
        <div className={fieldBox} style={fieldStyle}>
          <Mail size={17} className="text-ink-4 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email kiriting"
            className={inputCls}
            autoCapitalize="none"
          />
        </div>

        <button
          onClick={send}
          className="w-full h-[56px] mt-6 rounded-full text-[16px] font-extrabold text-ink-on-lime active:scale-[0.975] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #9BE04B 0%, #7ED321 100%)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 12px 26px rgba(95,175,34,0.36)',
          }}
        >
          Havola yuborish
        </button>

        <p className="text-body-md text-ink-3 text-center mt-7">
          Esingizga tushdimi?{' '}
          <button
            onClick={() => { triggerHaptic('light'); navigate('/login', { replace: true }) }}
            className="font-extrabold text-brand underline underline-offset-2"
          >
            Kirish
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPasswordScreen
