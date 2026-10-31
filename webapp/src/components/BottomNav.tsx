import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Sigma, ShoppingBag, User } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'

/**
 * Tab navigatsiya — suzuvchi qora pill.
 * Faol tab oq pillga aylanadi: pill bir tabdan ikkinchisiga silliq siljiydi,
 * nom esa ochilib-yopiladi. Kurslar/Masalalar/Pro tab emas.
 */
const TABS = [
  { path: '/home', label: 'Asosiy', icon: Home },
  { path: '/formulas', label: 'Formulalar', icon: Sigma },
  { path: '/shop', label: "Do'kon", icon: ShoppingBag },
  { path: '/profile', label: 'Profil', icon: User },
]

const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 max-w-[430px] mx-auto pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)' }}
    >
      <div className="flex justify-center px-4">
        <motion.nav
          layout
          transition={spring}
          className="pointer-events-auto relative flex items-center gap-1 p-[6px] rounded-full"
          style={{
            background: '#0E1A12',
            boxShadow: '0 16px 36px rgba(14,26,18,0.32), inset 0 1px 0 rgba(255,255,255,0.07)',
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
                className="relative h-[50px] flex items-center justify-center rounded-full"
                style={active ? { gap: 8, padding: '0 16px' } : { width: 50 }}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full"
                    style={{ background: '#F4F8F1', boxShadow: '0 4px 14px rgba(14,26,18,0.28)' }}
                  />
                )}

                <Icon
                  size={active ? 18 : 19}
                  strokeWidth={active ? 2.5 : 2.1}
                  className="relative z-10 transition-colors duration-200"
                  color={active ? '#0E1A12' : 'rgba(226,240,214,0.55)'}
                />

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      key={label}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={spring}
                      className="relative z-10 overflow-hidden whitespace-nowrap text-[13px] font-extrabold text-ink"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </motion.nav>
      </div>
    </div>
  )
}

export default BottomNav
