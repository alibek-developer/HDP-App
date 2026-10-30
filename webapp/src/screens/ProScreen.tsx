import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const ProScreen = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'1y' | '3m' | '1m'>('1y')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSelectPlan = (plan: '1y' | '3m' | '1m') => {
    triggerHaptic('selection')
    setSelectedPlan(plan)
  }

  const handleSubscribe = () => {
    triggerHaptic('success')
    setShowSuccessModal(true)
  }

  const getPrice = () => {
    if (selectedPlan === '1y') return '468,000 so\'m'
    if (selectedPlan === '3m') return '177,000 so\'m'
    return '79,000 so\'m'
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#006C49] text-white flex items-center justify-center font-serif font-black text-sm">
            Σ
          </div>
          <span className="font-black text-sm text-[#131B2E]">HDP Academy</span>
        </div>

        <button 
          onClick={() => triggerHaptic('light')}
          className="text-slate-500 text-xs font-bold hover:text-slate-800"
        >
          Qayta tiklash
        </button>
      </header>

      {/* 2. Hero Presentation */}
      <section className="px-4 py-2">
        <div className="relative rounded-[32px] bg-gradient-to-b from-emerald-50/80 to-white p-5 border border-emerald-100/90 shadow-sm text-center overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 rounded-full text-[10px] font-black text-[#006C49] uppercase tracking-wider mb-2.5 shadow-2xs">
            <span>✨</span> HDP PRO BILAN MATEMATIKANI 100% EGALLANG
          </div>

          <h1 className="text-xl font-black text-[#131B2E] leading-snug mb-2">
            Cheksiz Imkoniyatlar & <br />
            <span className="text-[#006C49]">DTM 100 Ballik</span> Tayyorgarlik
          </h1>

          <p className="text-xs text-slate-600 leading-relaxed max-w-[320px] mx-auto mb-4">
            O'zbekistonning eng sara repetitorlik darslari, Milliy Sertifikat va IMO darajasidagi matematik sirlar yagona ilovada.
          </p>

          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-2xs text-[11px]">
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <span>★</span> 4.9 / 5.0
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-emerald-800 font-bold">12,400+ talabalar</span>
          </div>
        </div>
      </section>

      {/* 3. VIP Features */}
      <section className="px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between mb-1 px-0.5">
          <h3 className="text-sm font-black text-[#131B2E]">Pro Imtiyozlar & Imkoniyatlar</h3>
          <span className="px-2 py-0.5 bg-emerald-400 text-emerald-950 font-black text-[10px] rounded uppercase">
            VIP KIRISH
          </span>
        </div>

        {[
          { icon: '▶', bg: 'bg-blue-50 text-blue-600', title: '100+ Yopiq Video Tahlillar', desc: 'DTM va IMO darajasidagi eksklyuziv misollar tahlili.' },
          { icon: '📹', bg: 'bg-emerald-50 text-emerald-700', title: 'Ustoz Azamat bilan Jonli Master-klass', desc: 'Har haftalik jonli savol-javob va shaxsiy tahlil.' },
          { icon: '💡', bg: 'bg-indigo-50 text-indigo-600', title: 'AI Formula & Qadam-baqadam Yechim', desc: 'Kamera orqali istalgan murakkab misolning tahlili.' },
          { icon: '⬇', bg: 'bg-teal-50 text-teal-700', title: 'Oflayn Yuklab Olish (PDF Shpora)', desc: 'Barcha qoidalar va konspektlar internet bo\'lmaganda ham yoningizda.' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-[24px] p-3.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-base ${f.bg}`}>
              {f.icon}
            </div>
            <div>
              <h4 className="text-xs font-black text-[#131B2E]">{f.title}</h4>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Pricing Plans */}
      <section className="px-4 py-2 space-y-3">
        <h3 className="text-sm font-black text-[#131B2E] text-center mb-1">
          O'zingizga Mos Rejani Tanlang
        </h3>

        {/* 1 Year Plan */}
        <div
          onClick={() => handleSelectPlan('1y')}
          className={`relative bg-white rounded-[28px] p-4 cursor-pointer transition-all ${
            selectedPlan === '1y'
              ? 'border-2 border-emerald-600 shadow-[0_8px_24px_rgba(0,108,73,0.18)]'
              : 'border border-slate-200/80'
          }`}
        >
          <div className="absolute -top-3 left-4 bg-[#006C49] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <span>🔥</span> ENG OMMABOP • -45%
          </div>

          <div className="flex items-center justify-between mt-1 mb-2">
            <div>
              <span className="text-xs font-black text-[#006C49] uppercase">1 YILLIK PRO (CHEKSIZ)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-[#131B2E]">39,000</span>
                <span className="text-xs text-slate-500">so'm / oy</span>
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="line-through mr-1">850,000</span>
                <strong className="text-slate-800">Jami 468,000 so'm / yil</strong>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedPlan === '1y' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
            }`}>
              {selectedPlan === '1y' && <span className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          <div className="bg-[#F0FDF4] border border-emerald-200/80 rounded-2xl p-2.5 my-2 text-xs text-emerald-900 leading-snug">
            <span className="font-bold flex items-center gap-1 mb-0.5 text-emerald-800">
              <span>🎁</span> Maxsus Sovg'a:
            </span>
            +500 Bepul Coin va DTM 2025 PDF To'plam mutlaqo bepul qo'shib beriladi!
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Yillik tejamkorlik:</span>
            <span className="font-black text-emerald-700">382,000 so'm tejang</span>
          </div>
        </div>

        {/* 3 Months Plan */}
        <div
          onClick={() => handleSelectPlan('3m')}
          className={`relative bg-white rounded-[28px] p-4 cursor-pointer transition-all ${
            selectedPlan === '3m'
              ? 'border-2 border-emerald-600 shadow-sm'
              : 'border border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#131B2E] uppercase">3 OYLIK INTENSIV</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">-25%</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-[#131B2E]">59,000</span>
                <span className="text-xs text-slate-500">so'm / oy</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                <span className="line-through mr-1">237,000</span>
                <span className="font-semibold text-slate-700">Jami 177,000 so'm / kvartal</span>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedPlan === '3m' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
            }`}>
              {selectedPlan === '3m' && <span className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
        </div>

        {/* 1 Month Plan */}
        <div
          onClick={() => handleSelectPlan('1m')}
          className={`relative bg-white rounded-[28px] p-4 cursor-pointer transition-all ${
            selectedPlan === '1m'
              ? 'border-2 border-emerald-600 shadow-sm'
              : 'border border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[#131B2E] uppercase">1 OYLIK BAZAVIY</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-[#131B2E]">79,000</span>
                <span className="text-xs text-slate-500">so'm / oy</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-semibold text-slate-700">
                Jami 79,000 so'm / oy
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedPlan === '1m' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
            }`}>
              {selectedPlan === '1m' && <span className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Payments & Guarantee */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-[28px] p-4 border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-black text-[#131B2E] mb-2.5">Qulay To'lov Tizimlari</h4>
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-black text-slate-700">
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center border border-blue-50 text-blue-600">
              pay<span className="text-slate-900">me</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center border border-blue-50 text-emerald-600">
              click<span className="text-slate-900">up</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center border border-blue-50 text-purple-600">
              uzum <span className="text-slate-500 font-semibold text-[10px]">bank</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center border border-blue-50 text-[11px]">
              HUMO / Uzcard / VISA
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3 flex items-start gap-2 text-xs text-emerald-900 border border-emerald-100">
            <span className="text-emerald-700 text-base">🛡️</span>
            <div>
              <span className="font-bold">7 kunlik kafolat:</span> Agar darslar sifati ma'qul kelmasa, mablag'ingiz to'liq qaytariladi.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sticky CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30">
        <button
          onClick={handleSubscribe}
          className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-4 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,108,73,0.3)]"
        >
          <span>Pro Obunani Faollashtirish ({getPrice()})</span>
          <span className="text-base">→</span>
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-[32px] p-6 text-center max-w-[320px] shadow-2xl z-10">
            <div className="text-4xl mb-2">💎</div>
            <h3 className="text-lg font-black text-[#131B2E] mb-1">Tabriklaymiz!</h3>
            <p className="text-xs text-slate-500 mb-4">
              HDP Pro obunasi muvaffaqiyatli faollashtirildi. Barcha darslar va IMO tahlillar siz uchun ochiq!
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/home')
              }}
              className="w-full bg-[#006C49] text-white py-3 rounded-full font-bold text-xs"
            >
              Darslarga o'tish →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProScreen
