import { useLocation, useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    {
      path: '/home',
      label: 'Asosiy',
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      path: '/formulas',
      label: 'Formulalar',
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
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
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 max-w-mobile mx-auto px-4 py-2 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={`transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-[#006C49] text-white px-5 py-2 rounded-full gap-2 font-bold text-xs shadow-md shadow-emerald-900/15'
                  : 'flex-col text-slate-400 hover:text-slate-600 px-3 py-1 gap-1 text-[11px] font-medium'
              }`}
            >
              {tab.icon(isActive)}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
