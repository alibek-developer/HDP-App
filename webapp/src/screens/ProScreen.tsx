import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const ProScreen = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'1y' | '3m' | '1m'>('1y')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSelectPlan = (plan: '1y' | '3m' | '1m') => {
    triggerHaptic('selection')
    setSelectedPlan(plan)
  }

  const handleSubscribe = () => {
    triggerHaptic('success')
    navigate('/home')
  }

  const getPriceText = () => {
    if (selectedPlan === '1y') return '468,000 so\'m'
    if (selectedPlan === '3m') return '177,000 so\'m'
    return '79,000 so\'m'
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-32 text-[#131B2E] select-none">
      {/* 1. Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#006C49] text-white flex items-center justify-center font-serif font-black text-sm">
            Σ
          </div>
          <span className="font-extrabold text-sm text-[#131B2E]">HDP Academy</span>
        </div>

        <button 
          onClick={() => triggerHaptic('light')}
          className="text-slate-500 text-xs font-semibold hover:text-slate-800"
        >
          Qayta tiklash
        </button>
      </div>

      {/* 2. Hero Card */}
      <div className="px-4 py-2">
        <div className="relative rounded-3xl bg-gradient-to-b from-emerald-50/90 to-white p-5 border border-emerald-100 shadow-sm text-center overflow-hidden">
          {/* Subtle math grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0, 108, 73, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 108, 73, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2.5 shadow-2xs">
            <span>✨</span> HDP PRO BILAN MATEMATIKANI 100% EGALLANG
          </div>

          <h1 className="relative z-10 text-xl font-extrabold text-[#131B2E] leading-snug mb-2">
            Cheksiz Imkoniyatlar & <br />
            <span className="text-[#006C49]">DTM 100 Ballik</span> Tayyorgarlik
          </h1>

          <p className="relative z-10 text-xs text-slate-600 leading-relaxed max-w-[320px] mx-auto mb-4">
            O'zbekistonning eng sara repetitorlik tahlillari, Milliy Sertifikat va IMO darajasidagi matematik sirlar yagona ilovada.
          </p>

          <div className="relative z-10 inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-2xs text-[11px]">
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <span>★</span> 4.9 / 5.0 reyting
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-emerald-800 font-bold">
              12,400+ muvaffaqiyatli talabalar
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pro Privileges & Features */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-[#131B2E]">Pro Imtiyozlar & Imkoniyatlar</h3>
          <span className="px-2 py-0.5 bg-emerald-400 text-emerald-950 font-black text-[10px] rounded uppercase tracking-wider">
            VIP KIRISH
          </span>
        </div>
        <p className="text-xs text-slate-500 -mt-2 mb-3">
          Oddiy va Pro foydalanuvchilar orasidagi farq
        </p>

        <div className="space-y-2.5">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-lg">
              ▶
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131B2E]">100+ Yopiq Video Tahlillar</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                DTM va IMO darajasidagi eksklyuziv misollar tahlili va to'liq yechim algoritmlari.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 text-lg">
              📹
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131B2E]">Ustoz Azamat bilan Jonli Master-klass</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Har haftalik jonli savol-javob vebinarlari va shaxsiy test strategiyalari.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-lg">
              💡
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131B2E]">AI Formula & Qadam-baqadam Yechim</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Kamera orqali istalgan murakkab misolni skanerlash va bosqichma-bosqich tushuntirish.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 text-lg">
              ⬇
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131B2E]">Oflayn Yuklab Olish (PDF Shpora)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Barcha nazariy qoidalar, formulalar jadvali va konspektlar internet bo'lmaganda ham yoningizda.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 text-lg">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#131B2E]">Reklamasiz, 2x Tezlik va Cheksiz Testlar</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Chalg'ituvchi bannerlarsiz, tezkor video o'ynatgich va cheksiz simulyatsiya sinovlari.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Pricing Plans Selection */}
      <div className="px-4 py-2">
        <h3 className="text-base font-extrabold text-[#131B2E] text-center mb-1">
          O'zingizga Mos Rejani Tanlang
        </h3>
        <p className="text-xs text-slate-500 text-center mb-4">
          Obunani xohlagan daqiqada bekor qilish imkoni mavjud
        </p>

        <div className="space-y-3">
          {/* Plan 1 - 1 Year (Popular) */}
          <div
            onClick={() => handleSelectPlan('1y')}
            className={`relative bg-white rounded-3xl p-4 cursor-pointer transition-all ${
              selectedPlan === '1y'
                ? 'border-2 border-emerald-600 shadow-[0_6px_20px_rgba(0,108,73,0.15)]'
                : 'border border-slate-200'
            }`}
          >
            {/* Top Badge */}
            <div className="absolute -top-3 left-4 bg-[#006C49] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span>🔥</span> ENG OMMABOP • -45%
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
              <div>
                <span className="text-xs font-bold text-[#006C49] tracking-wider uppercase block">
                  1 YILLIK PRO (CHEKSIZ)
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-[#131B2E]">39,000</span>
                  <span className="text-xs text-slate-500">so'm / oy</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                  <span className="text-slate-400 line-through">850,000 so'm / yil</span>
                  <span className="font-bold text-[#131B2E]">Jami 468,000 so'm / yil</span>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedPlan === '1y' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
              }`}>
                {selectedPlan === '1y' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Special Gift Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-2.5 my-2.5 text-xs text-emerald-900 leading-snug">
              <span className="font-bold flex items-center gap-1 mb-0.5 text-emerald-800">
                <span>🎁</span> Maxsus Sovg'a:
              </span>
              +500 Bepul Coin va DTM 2025 PDF To'plam mutlaqo bepul qo'shib beriladi!
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Yillik tejamkorlik:</span>
              <span className="font-bold text-emerald-700">382,000 so'm tejang</span>
            </div>
          </div>

          {/* Plan 2 - 3 Months */}
          <div
            onClick={() => handleSelectPlan('3m')}
            className={`relative bg-white rounded-3xl p-4 cursor-pointer transition-all ${
              selectedPlan === '3m'
                ? 'border-2 border-emerald-600 shadow-md'
                : 'border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#131B2E] uppercase">
                    3 OYLIK INTENSIV
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    -25%
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-[#131B2E]">59,000</span>
                  <span className="text-xs text-slate-500">so'm / oy</span>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  <span className="line-through mr-1 text-slate-400">237,000 so'm</span>
                  <span className="font-semibold text-slate-700">Jami 177,000 so'm / kvartal</span>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedPlan === '3m' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
              }`}>
                {selectedPlan === '3m' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Muddat:</span>
              <span className="font-semibold text-slate-700">90 kun to'liq kirish</span>
            </div>
          </div>

          {/* Plan 3 - 1 Month */}
          <div
            onClick={() => handleSelectPlan('1m')}
            className={`relative bg-white rounded-3xl p-4 cursor-pointer transition-all ${
              selectedPlan === '1m'
                ? 'border-2 border-emerald-600 shadow-md'
                : 'border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#131B2E] uppercase">
                  1 OYLIK BAZAVIY
                </span>

                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-[#131B2E]">79,000</span>
                  <span className="text-xs text-slate-500">so'm / oy</span>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">Jami 79,000 so'm / oy</span>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedPlan === '1m' ? 'border-[#006C49] bg-[#006C49]' : 'border-slate-300'
              }`}>
                {selectedPlan === '1m' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Muddat:</span>
              <span className="font-semibold text-slate-700">30 kunlik sinov</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Payment Providers & Guarantee */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
          <h4 className="text-xs font-bold text-[#131B2E] mb-1">Qulay To'lov Tizimlari</h4>
          <p className="text-[11px] text-slate-500 mb-3">
            O'zbekistonning barcha asosiy kartalari va ilovalari qo'llab-quvvatlanadi
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center text-xs font-extrabold text-blue-600 border border-blue-50">
              pay<span className="text-[#131B2E]">me</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center text-xs font-extrabold text-emerald-600 border border-blue-50">
              click<span className="text-[#131B2E]">up</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center text-xs font-extrabold text-purple-600 border border-blue-50">
              uzum <span className="text-slate-600 font-semibold text-[11px]">bank</span>
            </div>
            <div className="py-2.5 bg-[#F6F8FF] rounded-xl text-center text-[11px] font-bold text-slate-700 border border-blue-50">
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
      </div>

      {/* 6. FAQ Accordion */}
      <div className="px-4 py-2">
        <h4 className="text-xs font-bold text-[#131B2E] mb-2 px-1">Ko'p beriladigan savollar</h4>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
          <div 
            onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
            className="p-3.5 cursor-pointer"
          >
            <div className="flex items-center justify-between font-bold text-[#131B2E]">
              <span>Obunani qanday bekor qilsa bo'ladi?</span>
              <span>{openFaq === 1 ? '−' : '+'}</span>
            </div>
            {openFaq === 1 && (
              <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                Profil sozlamalari orqali birgina bosish orqali obunani istalgan vaqtda to'xtatishingiz mumkin.
              </p>
            )}
          </div>

          <div 
            onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
            className="p-3.5 cursor-pointer"
          >
            <div className="flex items-center justify-between font-bold text-[#131B2E]">
              <span>Materiallarni yuklab olsa bo'ladimi?</span>
              <span>{openFaq === 2 ? '−' : '+'}</span>
            </div>
            {openFaq === 2 && (
              <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                Ha, Pro a'zolar barcha nazariy qo'llanma va formulalar kitobini oflayn formatda saqlashlari mumkin.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 7. Bottom Sticky Subscribe Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-100 z-40">
        <button
          onClick={handleSubscribe}
          className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_8px_20px_rgba(0,108,73,0.3)]"
        >
          <span>Pro Obunani Faollashtirish ({getPriceText()})</span>
          <span className="text-sm">→</span>
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Istalgan vaqtda bekor qilish mumkin • Yashirin to'lovlar yo'q
        </p>
      </div>
    </div>
  )
}

export default ProScreen
