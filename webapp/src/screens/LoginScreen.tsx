import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, User, AtSign, KeyRound, Send } from 'lucide-react'
import { triggerHaptic, getTelegramUser } from '../lib/telegram'
import { useApp } from '../store/useStore'

/**
 * 2-qadam: Login.
 *  - 'start'  — yangi foydalanuvchi: ism + @username bilan hisob yaratiladi
 *  - 'signin' — qaytayotgan foydalanuvchi: @username + kod
 * Ikkalasi ham /home ga olib kiradi. Pro taklifi bu yerda YO'Q — u alohida /pro.
 */
const LoginScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const tgUser = getTelegramUser()

  const mode = (location.state as any)?.mode === 'signin' ? 'signin' : 'start'
  const setProfile = useApp(s => s.setProfile)
  const setOnboarded = useApp(s => s.setOnboarded)

  const [name, setName] = useState(tgUser?.name ?? '')
  const [username, setUsername] = useState(tgUser?.username ?? '')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')

  const enter = () => {
    setProfile(name.trim() || (username.trim() ? username.trim() : 'Talaba'), username.trim() || 'talaba')
    setOnboarded()
    navigate('/home', { replace: true })
  }

  const submitStart = () => {
    if (name.trim().length < 2) {
      setError('Ismni kamida 2 ta harf bilan kiriting')
      triggerHaptic('error')
      return
    }
    setError('')
    triggerHaptic('success')
    enter()
  }

  const submitSignIn = () => {
    if (!codeSent) {
      if (username.trim().length < 3) {
        setError('Telegram username yoki telefon raqamni kiriting')
        triggerHaptic('error')
        return
      }
      setError('')
      setCodeSent(true)
      triggerHaptic('medium')
      return
    }
    if (code.trim().length < 4) {
      setError('Kod kamida 4 ta belgidan iborat')
      triggerHaptic('error')
      return
    }
    setError('')
    triggerHaptic('success')
    enter()
  }

  const field =
    'w-full flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white'

  return (
    <div className="min-h-screen flex flex-col px-5 pt-4 pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Top */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/', { replace: true }) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronLeft size={18} style={{ color: '#334155' }} />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
          {mode === 'signin' ? 'Hisobga kirish' : 'Hisob yaratish'}
        </p>
        <div style={{ width: 36 }} />
      </div>

      {/* Head */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold leading-snug" style={{ color: '#0F172A' }}>
          {mode === 'signin' ? 'Xush kelibsiz' : 'Matematikani boshlaymiz'}
        </h1>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#64748B' }}>
          {mode === 'signin'
            ? 'Hisobingizni tasdiqlang — progressiyangiz saqlanib turadi.'
            : 'Ismingizni kiriting. 10 ta dars darhol bepul ochiladi.'}
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {mode === 'start' && (
          <div className={field} style={{ border: `1px solid ${error && !name.trim() ? '#DC2626' : '#E2E8F0'}` }}>
            <User size={16} style={{ color: '#94A3B8' }} />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ism familiya"
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              style={{ color: '#0F172A' }}
            />
          </div>
        )}

        <div className={field} style={{ border: '1px solid #E2E8F0' }}>
          <AtSign size={16} style={{ color: '#94A3B8' }} />
          <input
            value={username}
            onChange={e => setUsername(e.target.value.replace('@', ''))}
            placeholder="telegram_username"
            className="flex-1 bg-transparent outline-none text-sm font-semibold"
            style={{ color: '#0F172A' }}
          />
        </div>

        {mode === 'signin' && codeSent && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs mb-2" style={{ color: '#64748B' }}>
              @{username.trim()} manziliga kod yuborildi.
            </p>
            <div className={field} style={{ border: `1px solid ${error && code.trim().length < 4 ? '#DC2626' : '#E2E8F0'}` }}>
              <KeyRound size={16} style={{ color: '#94A3B8' }} />
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Kod"
                className="flex-1 bg-transparent outline-none text-sm font-semibold tracking-widest"
                style={{ color: '#0F172A' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold mt-3" style={{ color: '#DC2626' }}>{error}</p>
      )}

      {/* CTA */}
      <div className="mt-auto pt-8">
        <button
          onClick={mode === 'signin' ? submitSignIn : submitStart}
          className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #4338CA, #6366F1)',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(67,56,202,0.28)',
          }}
        >
          <Send size={15} />
          {mode === 'signin' ? (codeSent ? 'Kirish' : 'Kod yuborish') : 'Davom etish'}
        </button>

        <button
          onClick={() => { triggerHaptic('light'); navigate('/home', { replace: true }) }}
          className="w-full py-3 mt-2 text-sm font-semibold"
          style={{ color: '#94A3B8' }}
        >
          Mehmon sifatida ko'rish
        </button>
      </div>
    </div>
  )
}

export default LoginScreen
