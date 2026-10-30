import { Crown } from 'lucide-react'

const ProBanner = () => {
  return (
    <div className="bg-coin rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Crown size={20} />
        <span className="font-bold">HDP PRO</span>
      </div>
      <p className="text-sm text-white/90 mb-3">
        Barcha formulalar, darslar va masalalarga kirish
      </p>
      <button className="bg-white text-coin font-semibold px-4 py-2 rounded-full text-sm">
        Pro'ni ochish
      </button>
    </div>
  )
}

export default ProBanner
