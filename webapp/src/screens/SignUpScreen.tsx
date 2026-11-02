import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Eye, EyeOff, Lock, Mail, User, Check, Loader2 } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { signInWithTelegram } from '../lib/auth'
import { useApp } from '../store/useStore'
import BrandMark from '../components/BrandMark'

const ease = [0.22, 1, 0.36, 1] as const

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden focusable="false">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7L4.34 14.12C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C39.02 4.49 34.04 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7C13.42 14.62 18.27 10.75 24 10.75z" />
  </svg>
)

const TelegramMark = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
    <path fill="#2AABEE" d="M22.3 4.1 2.9 11.4c-1.1.4-1.1 1.1-.2 1.4l4.9 1.5 1.9 5.7c.2.6.4.8.9.8.4 0 .6-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8l3.3-15.5c.3-1.3-.5-1.9-1.5-1.2z" />
  </svg>
)

const fieldBox = 'flex items-center gap-2.5 h-[54px] px-4 rounded-[18px] bg-white'
const fieldStyle = { border: '1px solid #E4E9DD', boxShadow: '0 2px 10px rgba(28,50,20,0.04)' }
const inputCls = 'flex-1 bg-transparent outline-none text-[15px] font-semibold text-ink placeholder:text-ink-4'
const socialStyle = { background: '#FFFFFF', border: '1px solid #E4E9DD', boxShadow: '0 4px 14px rgba(28,50,20,0.06)' }

/**
 * Ro'yxatdan o'tish — email hisobi shu telefon yaratiladi va saqlanadi
 * (server tekshiruvi keyingi bosqich, task #17). Google hali yo'q.
 */
const SignUpScreen = () => {
  const navigate = useNavigate()
  const exit = useBack('/')
  const signIn = useApp(s => s.signInWithTelegram)
  const signInEmail = useApp(s => s.signInWithEmail)
  const setProfile = useApp(s => s.setProfile)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [terms, setTerms] = useState(false)
  const [tgLoading, setTgLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    if (busy) return
    if (name.trim().length < 3) {
      triggerHaptic('warning')
      setErr("Ism familiyani to'liq kiriting.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      triggerHaptic('warning')
      setErr("Email manzili noto'g'ri ko'rinishda.")
      return
    }
    if (password.length < 6) {
      triggerHaptic('warning')
      setErr('Parol kamida 6 belgi bo‘lishi kerak.')
      return
    }
    if (!terms) {
      triggerHaptic('warning')
      setErr('Davom etish uchun shartlarga rozilik bering.')
      return
    }
    setErr(null)
    setBusy(true)
    await new Promise(r => setTimeout(r, 600))
    const first = name.trim().split(/\s+/)[0].toLowerCase()
    setProfile(name.trim(), first)
    signInEmail(email.trim())
    triggerHaptic('success')
    navigate('/home', { replace: true })
  }

  const telegramEnter = async () => {
    if (tgLoading) return
    triggerHaptic('light')
    setTgLoading(true)
    const profile = await signInWithTelegram()
    signIn(profile)
    triggerHaptic('success')
    navigate('/home', { replace: true })
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
          onClick={exit}
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
        <BrandMark size={38} />
        <p className="font-serif text-[26px] text-brand-deep" style={{ letterSpacing: '-0.01em' }}>
          HDP Matematika
        </p>
      </motion.div>

      {/* Sarlavha */}
      <div className="relative z-10 px-8 mt-6 text-center">
        <h1 className="text-[27px] leading-[1.2]" style={{ letterSpacing: '-0.028em', wordSpacing: '0.05em' }}>
          <span className="font-normal text-ink-4">Yangi hisob </span>
          <span className="font-extrabold text-ink">ochish</span>
        </h1>
        <p className="text-body-md text-ink-3 mt-2 leading-relaxed">
          Bir daqiqada ro'yxatdan o'ting — 10 ta dars darhol bepul.
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
          <User size={17} className="text-ink-4 shrink-0" />
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ism familiya"
            className={inputCls}
            autoCapitalize="words"
          />
        </div>

        <div className={`${fieldBox} mt-3`} style={fieldStyle}>
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

        <div className={`${fieldBox} mt-3`} style={fieldStyle}>
          <Lock size={17} className="text-ink-4 shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Parol o'ylab toping"
            className={inputCls}
          />
          <button
            onClick={() => { triggerHaptic('light'); setShowPassword(v => !v) }}
            className="shrink-0 p-1 -mr-1 text-ink-4 active:scale-90 transition-transform"
            aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={() => { triggerHaptic('light'); setTerms(v => !v) }}
          className="flex items-start gap-2.5 mt-4 px-1 active:opacity-70 transition-opacity"
        >
          <span
            className="w-[20px] h-[20px] rounded-[7px] flex items-center justify-center shrink-0 mt-px transition-colors"
            style={
              terms
                ? { background: 'linear-gradient(135deg,#9BE04B,#7ED321)', border: '1px solid #7ED321' }
                : { background: '#FFFFFF', border: '1px solid #D8E0D2' }
            }
          >
            {terms && <Check size={13} strokeWidth={3.4} className="text-ink-on-lime" />}
          </span>
          <span className="text-body-sm font-semibold text-ink-2 text-left leading-snug">
            Foydalanish shartlari va maxfiylik siyosatiga roziman
          </span>
        </button>

        {err && (
          <p className="mt-3 px-1 text-[12.5px] font-bold leading-snug" style={{ color: '#C2453D' }}>
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="w-full h-[56px] mt-6 rounded-full text-[16px] font-extrabold text-ink-on-lime active:scale-[0.975] transition-transform disabled:opacity-80 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #9BE04B 0%, #7ED321 100%)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 12px 26px rgba(95,175,34,0.36)',
          }}
        >
          {busy && <Loader2 size={18} className="animate-spin" />}
          {busy ? 'Hisob ochilmoqda...' : "Ro'yxatdan o'tish"}
        </button>

        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-tiny uppercase text-ink-4">yoki quyidagilar orqali</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={telegramEnter}
            disabled={tgLoading}
            className="flex-1 h-[54px] rounded-[18px] text-[15px] font-bold text-ink flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
            style={socialStyle}
          >
            {tgLoading ? <Loader2 size={18} className="animate-spin" /> : <TelegramMark />}
            {tgLoading ? 'Ulanmoqda...' : 'Telegram'}
          </button>
          <div className="relative flex-1">
            <button
              onClick={() => triggerHaptic('warning')}
              className="w-full h-[54px] rounded-[18px] text-[15px] font-bold text-ink flex items-center justify-center gap-2 opacity-55"
              style={{ background: '#FFFFFF', border: '1px dashed #C6D0BE', boxShadow: '0 4px 14px rgba(28,50,20,0.06)' }}
            >
              <GoogleMark />
              Google
            </button>
            <span
              className="absolute -top-2 right-2 px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.08em]"
              style={{ background: '#FFF3D6', color: '#8A6116', border: '1px solid #F0DCA5', borderRadius: 999 }}
            >
              Tez orada
            </span>
          </div>
        </div>

        <p className="text-body-md text-ink-3 text-center mt-7 pb-8">
          Hisobingiz bormi?{' '}
          <button
            onClick={exit}
            className="font-extrabold text-brand underline underline-offset-2"
          >
            Kirish
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default SignUpScreen
