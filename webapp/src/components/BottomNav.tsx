import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Sigma, ShoppingBag, User } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'

/**
 * Tab navigatsiya — 4 ta yonaltiriladigan ekran.
 * Kurslar/Masalalar/Pro tab emas: ular Home va Formulalar ichidan ochiladi.
 */
const TABS = [
  { path: '/home', label: 'Asosiy', icon: Home },
  { path: '/formulas', label: 'Formulalar', icon: Sigma },
  { path: '/shop', label: "Do'kon", icon: ShoppingBag },
  { path: '/profile', label: 'Profil', icon: User },
]

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => { triggerHaptic('selection'); navigate(path) }}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative transition-colors"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-b-sm" style={{ background: '#4338CA' }} />
              )}
              <Icon size={22} color={active ? '#4338CA' : '#94A3B8'} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-semibold" style={{ color: active ? '#4338CA' : '#94A3B8' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
