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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#4338CA' : '#94A3B8'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      path: '/formulas',
      label: 'Formulalar',
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#4338CA' : '#94A3B8'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: (active: boolean) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#4338CA' : '#94A3B8'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto"
      style={{
        background: '#ffffff',
        borderTop: '1px solid #E2E8F0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => { triggerHaptic('selection'); navigate(tab.path) }}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative transition-colors"
            >
              {/* Active top indicator */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-b-sm"
                  style={{ background: '#4338CA' }}
                />
              )}
              {tab.icon(active)}
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? '#4338CA' : '#94A3B8' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
