import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, ShoppingBag, Target, User } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'

/**
 * Tab navigatsiya — suzuvchi to'q pill (#0F1A10, radius 100).
 * Faol tab: oq doira ichida qora ikonka + yonida nom.
 * O'ng uchida: yashil doira ichida oltin ◇ + coin soni.
 */
const TABS = [
  { path: '/blitz', label: 'Keyingi', icon: ChevronRight },
  { path: '/home', label: 'Asosiy', icon: Home },
  { path: '/problems', label: 'Masalalar', icon: Target },
  { path: '/shop', label: "Do'kon", icon: ShoppingBag },
  { path: '/profile', label: 'Profil', icon: User },
]

const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const coin = useApp(s => s.coin)

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 max-w-[430px] mx-auto pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="flex justify-center px-3">
        <motion.nav
          layout
          transition={spring}
          className="pointer-events-auto relative flex items-center gap-0.5 p-[6px] rounded-full"
          style={{
            background: '#0F1A10',
            boxShadow: '0 16px 36px rgba(14,26,18,0.32), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {TABS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <motion.button
                key={path}
                layout
                transition={spring}
                whileTap={{ scale: 0.9 }}
                onClick={() => { triggerHaptic('selection'); navigate(path) }}
                className="relative h-[46px] flex items-center justify-center rounded-full"
                style={active ? { paddingLeft: 3, paddingRight: 14, justifyContent: 'flex-start' } : { width: 44 }}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-circle"
                    transition={spring}
                    className="absolute rounded-full"
                    style={{
                      left: 3,
                      top: 3,
                      width: 40,
                      height: 40,
                      background: '#FFFFFF',
                      boxShadow: '0 4px 14px rgba(14,26,18,0.28)',
                    }}
                  />
                )}

                <span
                  className="relative z-10 shrink-0 flex items-center justify-center"
                  style={{ width: active ? 40 : undefined }}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.5 : 2.1}
                    className="transition-colors duration-200"
                    color={active ? '#0F1A10' : 'rgba(255,255,255,0.42)'}
                  />
                </span>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      key={label}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={spring}
                      className="relative z-10 overflow-hidden whitespace-nowrap text-[13px] font-extrabold"
                      style={{ color: '#FFFFFF', marginLeft: 6 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}

          {/* coin ko'rsatkichi — yashil doira ichida oltin ◇ */}
          <button
            onClick={() => { triggerHaptic('light'); navigate('/shop') }}
            className="shrink-0 flex items-center gap-1 h-[40px] pl-2 pr-2.5 ml-1 rounded-full"
            style={{ background: '#00422B', border: '1px solid rgba(0,201,107,0.35)' }}
            aria-label="Hamyon"
          >
            <span className="relative z-10" style={{ color: '#F6B93B' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </span>
            <span className="num text-[12px] font-extrabold" style={{ color: '#F6B93B' }}>
              {coin >= 1000 ? (coin / 1000).toFixed(1) + 'k' : coin}
            </span>
          </button>
        </motion.nav>
      </div>
    </div>
  )
}

export default BottomNav
