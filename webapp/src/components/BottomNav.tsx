import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Ruler, User } from 'lucide-react'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { path: '/home', icon: Home, label: 'Asosiy' },
    { path: '/formulas', icon: Ruler, label: 'Formulalar' },
    { path: '/profile', icon: User, label: 'Profil' },
  ]

  const showNav = ['/home', '/formulas', '/profile'].includes(location.pathname)

  if (!showNav) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-surface-border max-w-mobile mx-auto">
      <div className="flex justify-around py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-4 ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav
