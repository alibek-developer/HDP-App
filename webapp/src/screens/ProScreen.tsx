import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Check, Sparkles, ChevronRight, X } from 'lucide-react'

const ProScreen = () => {
  const navigate = useNavigate()

  const plans = [
    {
      period: '1 Oylik',
      price: '159,000',
      original: '200,000',
      discount: '-20%',
      features: [
        'Barcha darslarga kirish',
        'Cheksiz formulalar',
        'DTM shporalar',
        'Mock sinovlar',
        'VIP qo\'llab-quvvatlash',
      ],
      popular: false,
    },
    {
      period: '3 Oylik',
      price: '318,000',
      original: '600,000',
      discount: '-47%',
      features: [
        'Barcha 1 oylik imtiyozlar',
        'Shaxsiy o\'qituvchi',
        'VIP darslar',
        'IMO olimpiada masalalar',
        'Haftalik progress tahlili',
      ],
      popular: true,
    },
    {
      period: '12 Oylik',
      price: '795,000',
      original: '2,400,000',
      discount: '-67%',
      features: [
        'Barcha 3 oylik imtiyozlar',
        'Live darslar',
        'Sertifikat',
        'DTM tayyorlash to\'plami',
        'Oila obunasi (3 kishi)',
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2">
          <ArrowLeft size={20} className="text-text-muted" />
          <span className="text-text-primary font-medium">HDP Pro</span>
        </button>
        <button className="text-text-muted">
          <X size={20} />
        </button>
      </div>

      {/* Hero */}
      <div className="mx-4 text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary-container text-primary px-4 py-2 rounded-full mb-4">
          <Crown size={18} />
          <span className="font-semibold">HDP Pro Premium</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Matematikani 2x tezroq o'rganing
        </h2>
        <p className="text-text-secondary">
          Barcha darslar, formulalar va imtiyozlarni bitta obuna bilan oching
        </p>
      </div>

      {/* Stats */}
      <div className="mx-4 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-card rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-text-primary">500+</div>
          <div className="text-xs text-text-muted">Darslar</div>
        </div>
        <div className="bg-surface-card rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-text-primary">140+</div>
          <div className="text-xs text-text-muted">Formulalar</div>
        </div>
        <div className="bg-surface-card rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-text-primary">25k+</div>
          <div className="text-xs text-text-muted">O'quvchilar</div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-4 mb-6">
        <h3 className="font-semibold text-text-primary mb-3">Pro imtiyozlari</h3>
        <div className="space-y-2">
          {[
            { icon: '📚', title: 'Cheksiz darslar va video tushuntirishlar' },
            { icon: '📐', title: 'Barcha formulalar va shporalar' },
            { icon: '🎯', title: 'DTM va IMO tayyorlash materiallari' },
            { icon: '📊', title: 'Shaxsiy progress tahlili' },
            { icon: '💬', title: 'VIP qo\'llab-quvvatlash' },
            { icon: '🏆', title: 'Sertifikat va yutuqlar' },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-card rounded-xl">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-text-primary text-sm">{feature.title}</span>
              <Check size={18} className="text-primary ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-text-primary mb-3">Obuna rejalar</h3>
        <div className="space-y-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-surface-card rounded-2xl p-4 border-2 ${
                plan.popular ? 'border-primary' : 'border-surface-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  OMMABOP
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-text-primary">{plan.period}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-text-primary">{plan.price} UZS</span>
                    <span className="text-xs text-text-muted line-through">{plan.original}</span>
                    <span className="bg-error/10 text-error px-2 py-1 rounded text-xs">{plan.discount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-muted">Oylik</div>
                  <div className="text-sm font-semibold text-text-primary">
                    {(parseInt(plan.price.replace(/,/g, '')) / (plan.period === '1 Oylik' ? 1 : plan.period === '3 Oylik' ? 3 : 12)).toLocaleString()} UZS
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check size={16} className="text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
              <button
                className={`w-full rounded-full py-3 font-semibold ${
                  plan.popular ? 'bg-primary text-white' : 'bg-surface-low text-text-primary'
                }`}
              >
                Obunani Boshlash
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-text-primary mb-3">To'lov usullari</h3>
        <div className="flex gap-2 flex-wrap">
          {['Payme', 'Click', 'Uzum Bank', 'Uzcard', 'Humo'].map((method) => (
            <span key={method} className="bg-surface-low text-text-secondary px-4 py-2 rounded-full text-sm">
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className="mx-4 bg-primary-container rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-primary" />
          <span className="font-semibold text-text-primary">7 kunlik kafolat</span>
        </div>
        <p className="text-sm text-text-secondary">
          Agar Pro obunadan qanoqat bo'lmasangiz, 7 kun ichida to'liq qaytarib olishingiz mumkin.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-text-muted">
          Barcha to'lovlar xavfsiz · Istalgan vaqtda bekor qilish mumkin
        </p>
      </div>
    </div>
  )
}

export default ProScreen
