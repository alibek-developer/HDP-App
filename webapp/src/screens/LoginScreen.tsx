import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const LoginScreen = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'12m' | '3m'>('12m')

  const handlePlanSelect = (plan: '12m' | '3m') => {
    triggerHaptic('selection')
    setSelectedPlan(plan)
  }

  const handleStart = () => {
    triggerHaptic('medium')
    navigate('/home')
  }

  const handleSkip = () => {
    triggerHaptic('light')
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between pb-8 pt-2 px-4 select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={handleSkip}
          className="text-slate-600 font-medium text-sm px-2 py-1 hover:text-slate-900 transition-colors"
        >
          close
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-emerald-800 tracking-wider">
            HDP ACADEMY MATEMATIKA
          </span>
        </div>

        <button
          onClick={() => triggerHaptic('light')}
          className="text-slate-500 text-xs font-medium hover:text-slate-800"
        >
          Qayta tiklash
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-3 mb-2">
        <p className="text-emerald-700 text-sm font-semibold mb-1">
          Matematikani 2x tezroq va chuqurroq egallang
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-3xl font-extrabold text-[#131B2E] tracking-tight">HDP PRO</h1>
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-300/60">
            MATEMATIKA
          </span>
        </div>

        {/* Central Sigma Emblem */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Subtle curved rays background */}
          <div className="absolute w-36 h-36 rounded-full border border-emerald-300/30 -z-0 pointer-events-none" />
          <div className="absolute w-48 h-48 rounded-full border border-emerald-200/20 -z-0 pointer-events-none" />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white rounded-3xl border-2 border-emerald-400 shadow-[0_8px_24px_rgba(16,185,129,0.18)] flex items-center justify-center relative z-10"
          >
            <span className="text-4xl font-serif font-black text-[#00422B] select-none">
              Σ
            </span>
            <span className="absolute top-2 right-2 text-amber-400 text-xs">✦</span>
          </motion.div>
        </div>
      </div>

      {/* Stats Counter Card */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-center mb-3">
        <div>
          <div className="text-base font-extrabold text-[#131B2E]">4.9 <span className="text-amber-500">★</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reyting</div>
        </div>
        <div>
          <div className="text-base font-extrabold text-[#131B2E]">2.4x</div>
          <div className="text-[11px] text-slate-500 mt-0.5">O'rtacha o'sish</div>
        </div>
        <div>
          <div className="text-base font-extrabold text-[#131B2E]">25k+</div>
          <div className="text-[11px] text-slate-500 mt-0.5">O'quvchilar</div>
        </div>
      </div>

      {/* 3 Core Features */}
      <div className="space-y-2 mb-4">
        {/* Feature 1 */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.3 15.3l-9.6-9.6a2.4 2.4 0 0 0-3.4 0l-5.6 5.6a2.4 2.4 0 0 0 0 3.4l9.6 9.6a2.4 2.4 0 0 0 3.4 0l5.6-5.6a2.4 2.4 0 0 0 0-3.4z"/>
              <path d="M7.5 10.5l2 2"/>
              <path d="M10.5 7.5l2 2"/>
              <path d="M13.5 4.5l2 2"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#131B2E]">Cheksiz Darslar & Formulalar Banki</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Barcha video tahlillar va PDF konspektlarga to'liq cheksiz kirish.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#131B2E]">AI Qadam-baqadam Formula Yechimi</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Istalgan murakkab matematik misolning lahzali tahlili va yechim algoritmi.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-500">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#131B2E]">Milliy Sertifikat & Mock Sinovlari</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Haqiqiy imtihon muhiti, reytinglar va o'sish tahlili.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 12 Months Card */}
        <div
          onClick={() => handlePlanSelect('12m')}
          className={`relative bg-white rounded-2xl p-3.5 cursor-pointer transition-all ${
            selectedPlan === '12m'
              ? 'border-2 border-emerald-600 shadow-[0_4px_16px_rgba(0,108,73,0.12)]'
              : 'border border-slate-200'
          }`}
        >
          {/* Badge */}
          <div className="absolute -top-3 left-3 bg-[#006C49] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            ENG TEJAMKOR · -50%
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-slate-400 line-through">636,000</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1 rounded">
              -50%
            </span>
          </div>

          <div className="text-sm font-bold text-[#131B2E] mt-0.5">12 Oylik</div>
          <div className="text-base font-extrabold text-[#131B2E] mt-0.5">318,000 UZS</div>
          <div className="text-[10px] text-slate-500">/ yiliga</div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Oyiga:</span>
            <span className="font-bold text-[#131B2E]">26,500 so'm</span>
          </div>
        </div>

        {/* 3 Months Card */}
        <div
          onClick={() => handlePlanSelect('3m')}
          className={`relative bg-white rounded-2xl p-3.5 cursor-pointer transition-all ${
            selectedPlan === '3m'
              ? 'border-2 border-emerald-600 shadow-[0_4px_16px_rgba(0,108,73,0.12)]'
              : 'border border-slate-200'
          }`}
        >
          <div className="text-sm font-bold text-[#131B2E] mt-4">3 Oylik</div>
          <div className="text-base font-extrabold text-[#131B2E] mt-0.5">159,000 UZS</div>
          <div className="text-[10px] text-slate-500">/ 3 oyga</div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Oyiga:</span>
            <span className="font-bold text-[#131B2E]">53,000 so'm</span>
          </div>
        </div>
      </div>

      {/* CTA Button & Guarantees */}
      <div className="w-full space-y-3">
        <motion.button
          onClick={handleStart}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#006C49] hover:bg-[#00573a] active:bg-[#00472f] text-white py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,108,73,0.3)] transition-all"
        >
          <span>HDP PRO'NI BOSHLASH</span>
          <span className="text-lg">→</span>
        </motion.button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
          <span className="text-emerald-600 font-bold">✓</span>
          <span>Istalgan vaqtda bekor qilish mumkin</span>
          <span>·</span>
          <span>7 kunlik kafolat</span>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {['Payme', 'Click', 'Uzum Bank', 'Uzcard / Humo'].map((provider) => (
            <div
              key={provider}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 shadow-2xs"
            >
              {provider}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
