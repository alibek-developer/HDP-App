import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'
import { useBackRoot } from '../lib/nav'

const ease = [0.22, 1, 0.36, 1] as const

const PHOTOS = [
  { src: '/splash/student-left.png', alt: 'Talaba' },
  { src: '/splash/student-center.png', alt: 'Masala yechayotgan talaba' },
  { src: '/splash/student-right.png', alt: 'Dars tayyorlayotgan talaba' },
]

/**
 * 1-qadam: Ilova ochilganda.
 * Avtomatik o'tish YO'Q — foydalanuvchi ikki yo'ldan birini tanlaydi.
 */
const SplashScreen = () => {
  const navigate = useNavigate()
  useBackRoot()

  const go = (path: '/signup' | '/login') => {
    triggerHaptic('medium')
    navigate(path)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: 'linear-gradient(180deg, #CDE9AE 0%, #E6F5D2 40%, #F7FCED 76%)' }}
    >
      {/* Daftar to'ri — faqat yuqori mint maydonda */}
      <div className="absolute inset-x-0 top-0 h-[280px] grid-paper opacity-60 pointer-events-none" />

      {/* Brend */}
      <header className="relative z-10 flex justify-center safe-top pt-4">
        <p className="font-serif text-[25px] text-brand-deep" style={{ letterSpacing: '-0.01em' }}>
          HDP Matematika
        </p>
      </header>

      {/* ── Foto uchlik + brend belgisi ── */}
      <div className="relative z-10 flex justify-center items-center mt-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7, ease }}
          className="flex items-center"
        >
          {/* Chap */}
          <div
            className="w-[96px] h-[122px] rounded-[22px] overflow-hidden shrink-0"
            style={{ boxShadow: '0 10px 26px rgba(28,50,20,0.14)', border: '3px solid rgba(255,255,255,0.7)' }}
          >
            <img src={PHOTOS[0].src} alt={PHOTOS[0].alt} className="w-full h-full object-cover" />
          </div>

          {/* Markaz — ko'tarilgan va kattaroq */}
          <div
            className="w-[140px] h-[170px] rounded-[26px] overflow-hidden shrink-0 -mx-4 relative z-10"
            style={{ boxShadow: '0 18px 44px rgba(28,50,20,0.22)', border: '4px solid #FFFFFF' }}
          >
            <img src={PHOTOS[1].src} alt={PHOTOS[1].alt} className="w-full h-full object-cover" />
          </div>

          {/* O'ng */}
          <div
            className="w-[96px] h-[122px] rounded-[22px] overflow-hidden shrink-0"
            style={{ boxShadow: '0 10px 26px rgba(28,50,20,0.14)', border: '3px solid rgba(255,255,255,0.7)' }}
          >
            <img src={PHOTOS[2].src} alt={PHOTOS[2].alt} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Σ belgisi — markaziy foto ostida.
            Joylashuv statik qatorda: motion ichki transform yozgani uchun
            -translate-x-1/2 shu elementda saqlanmaydi. */}
        <div className="absolute -bottom-[52px] left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.34, type: 'spring', stiffness: 240, damping: 17 }}
            className="w-[68px] h-[68px] rounded-[23px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 60%, #5FAF22 100%)',
              border: '5px solid rgba(255,255,255,0.85)',
              boxShadow: '0 14px 30px rgba(95,175,34,0.42), inset 0 1.5px 0 rgba(255,255,255,0.6)',
            }}
          >
            <span className="font-serif text-[30px] leading-none text-ink-on-lime">Σ</span>
          </motion.div>
        </div>
      </div>

      {/* Nuqta indikatori */}
      <div className="relative z-10 flex justify-center items-center gap-1.5 mt-16 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-on-lime opacity-80" />
        <span className="w-1.5 h-1.5 rounded-full bg-ink-on-lime opacity-20" />
      </div>

      {/* ── Sarlavha + matn ── */}
      <div className="relative z-10 px-7">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.7, ease }}
          className="text-[31px] leading-[1.16]"
          style={{ letterSpacing: '-0.032em' }}
        >
          <span className="font-normal text-ink-4">Sizning </span>
          <span className="font-extrabold text-ink">shaxsiy</span>
          <br />
          <span className="font-normal text-ink-4">matematika </span>
          <span className="font-extrabold text-ink">ustozingiz</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.6, ease }}
          className="text-body-md text-ink-3 mt-3 leading-relaxed max-w-[318px]"
        >
          Video dars, misol va test — bittasi ikkinchisiga olib kiradigan izchil yo'l.
        </motion.p>
      </div>

      {/* ── Ikki tanlov ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.64, duration: 0.6, ease }}
        className="relative z-10 px-6 pt-4 pb-5 mt-auto"
      >
        <button
          onClick={() => go('/signup')}
          className="w-full h-[56px] rounded-full text-[16px] font-extrabold text-ink-on-lime active:scale-[0.975] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #9BE04B 0%, #7ED321 100%)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 12px 26px rgba(95,175,34,0.36)',
          }}
        >
          Boshlash
        </button>

        <button
          onClick={() => go('/login')}
          className="w-full h-[56px] mt-3 rounded-full text-[16px] font-bold text-ink active:scale-[0.985] transition-transform"
          style={{ background: '#F1F4EC', border: '1px solid #E4E9DD' }}
        >
          Kirish
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SplashScreen
