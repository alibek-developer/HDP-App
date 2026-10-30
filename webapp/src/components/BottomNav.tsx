import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    {
      path: '/home',
      label: 'Asosiy',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      path: '/formulas',
      label: 'Formulalar',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <line x1="8" y1="8" x2="16" y2="8"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="8" y1="16" x2="12" y2="16"/>
        </svg>
      ),
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ]

  const handleTabClick = (path: string) => {
    triggerHaptic('selection')
    navigate(path)
  }

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 max-w-[410px] mx-auto px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className="relative flex-1 py-2 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-colors select-none"
            >
              {/* Animated Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="absolute inset-0 bg-[#006C49] rounded-full shadow-md shadow-emerald-900/20"
                />
              )}

              <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab.icon}
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-extrabold text-[11px] tracking-wide"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNav
