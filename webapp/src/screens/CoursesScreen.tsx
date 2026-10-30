import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const CoursesScreen = () => {
  const navigate = useNavigate()

  const handleOpenLesson = (lessonId: number) => {
    triggerHaptic('medium')
    navigate('/video')
  }

  const handleOpenPro = () => {
    triggerHaptic('medium')
    navigate('/pro')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-28 text-[#131B2E] select-none">
      {/* 1. Top Header Bar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-bold text-amber-700 shadow-2xs">
            <span>🔥</span>
            <span>5 kun</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
            <span className="text-amber-500 font-black">⚡</span>
            <span>1,420 XP</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          <div 
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="relative cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#00422B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AS
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] flex items-center justify-center border border-white">
              4
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Banner: 100+ Chuqurlashtirilgan Olimpiada Darslari */}
      <div className="px-4 py-2">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#004E35] via-[#005B3F] to-[#006C49] text-white p-5 shadow-[0_8px_24px_rgba(0,108,73,0.22)] overflow-hidden">
          {/* Subtle math watermark formulas */}
          <div className="absolute right-2 top-2 pointer-events-none text-white/10 font-serif text-xs text-right space-y-1">
            <div>f(x) = ∫₀^∞ e^&#123;-t&#125;dt</div>
            <div>∑_&#123;n=1&#125;^∞ 1/n²</div>
          </div>

          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
              <span>🛡️</span> PRO OLIMPIADA
            </span>
            <span className="text-[11px] font-semibold text-emerald-200">
              ● 7 kun bepul
            </span>
          </div>

          <h2 className="relative z-10 text-xl font-extrabold text-white leading-snug mb-1.5 max-w-[280px]">
            100+ Chuqurlashtirilgan Olimpiada Darslari
          </h2>
          <p className="relative z-10 text-xs text-white/80 leading-relaxed mb-4">
            DTM 100%, Xalqaro olimpiada (IMO) va sertifikatlar uchun maxsus mantiqiy algoritmlar.
          </p>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={handleOpenPro}
              className="flex-1 bg-white hover:bg-emerald-50 text-[#006C49] font-extrabold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-1 shadow-md"
            >
              <span>7 kun tekin sinab ko'rish</span>
              <span>→</span>
            </button>

            <button
              onClick={handleOpenPro}
              className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white hover:bg-white/25 shrink-0"
            >
              💎
            </button>
          </div>
        </div>
      </div>

      {/* 3. In-Progress Lesson Card */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>O'RGANISHNI DAVOM ETING</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-md">
            3 / 10 Bepul
          </span>
        </div>

        <div 
          onClick={() => handleOpenLesson(3)}
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-200 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#006C49] text-white flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs">
                Σ
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded">3-DARS</span>
                  <span>Algebra bo'limi</span>
                </div>
                <h3 className="font-extrabold text-sm text-[#131B2E] mt-0.5">
                  Chiziqli tenglamalar va matritsalar
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>⏱</span> 18 daqiqa qoldi
                </span>
              </div>
            </div>

            <button className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="pt-2 border-t border-slate-50">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="text-slate-500 font-medium">Dars jarayoni</span>
              <span className="font-extrabold text-emerald-700">75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Kunlik Masala Mini Banner */}
      <div className="px-4 py-2">
        <div className="bg-[#131B2E] text-white rounded-3xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                <span>KUNLIK MASALA</span>
                <span className="bg-amber-400/20 px-1.5 py-0.2 rounded text-amber-300">+50 XP</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate max-w-[180px]">
                Viyet teoremasida parametr...
              </p>
            </div>
          </div>

          <button
            onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs rounded-full flex items-center gap-1 shrink-0 shadow-xs"
          >
            <span>Yechish</span>
            <span>⚡</span>
          </button>
        </div>
      </div>

      {/* 5. Dastlabki 10 ta Dars (Free Module) */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[#131B2E]">Dastlabki 10 ta Dars</h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
              BEPUL 🎁
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Ochiq modul</span>
        </div>

        <div className="space-y-2.5">
          {/* Lesson 1 - Done */}
          <div 
            onClick={() => handleOpenLesson(1)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-sm font-bold shrink-0">
                ✓
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>1-DARS</span>
                  <span>•</span>
                  <span>18 daqiqa</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">+50 XP</span>
                </div>
                <h4 className="text-xs font-extrabold text-[#131B2E] mt-0.5">
                  Matematik mantiq asoslari
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full">
              Bajarildi
            </span>
          </div>

          {/* Lesson 2 - Done */}
          <div 
            onClick={() => handleOpenLesson(2)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-sm font-bold shrink-0">
                ✓
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>2-DARS</span>
                  <span>•</span>
                  <span>24 daqiqa</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">+50 XP</span>
                </div>
                <h4 className="text-xs font-extrabold text-[#131B2E] mt-0.5">
                  Haqiqiy sonlar to'plami
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full">
              Bajarildi
            </span>
          </div>

          {/* Lesson 3 - In Progress (Active) */}
          <div 
            onClick={() => handleOpenLesson(3)}
            className="bg-white rounded-2xl p-3.5 border-2 border-emerald-500 shadow-xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                ▶
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span className="font-bold text-emerald-800">3-DARS</span>
                  <span>•</span>
                  <span>32 daqiqa</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                </div>
                <h4 className="text-xs font-extrabold text-[#131B2E] mt-0.5">
                  Chiziqli tenglamalar
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full">
              Hozir o'rganilmoqda
            </span>
          </div>

          {/* Lesson 4 - Open */}
          <div 
            onClick={() => handleOpenLesson(4)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                04
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">4-DARS • 22 daqiqa</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Kvadrat tenglamalar va Viyet
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
              Ochiq
            </span>
          </div>

          {/* Lesson 5 - Open */}
          <div 
            onClick={() => handleOpenLesson(5)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                05
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">5-DARS • 26 daqiqa</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Modulli tenglamalar va grafiklar
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
              Ochiq
            </span>
          </div>

          {/* Lesson 6 - Open */}
          <div 
            onClick={() => handleOpenLesson(6)}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                06
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">6-DARS • 30 daqiqa</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Funksiyalar va ularning grafigi
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
              Ochiq
            </span>
          </div>

          {/* Free Notice Badge */}
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3 text-center text-xs font-semibold text-emerald-800">
            🔓 7, 8, 9 va 10-darslar ham butunlay bepul ochiq!
          </div>
        </div>
      </div>

      {/* 6. PRO Bosqichi Divider & Masterclass */}
      <div className="px-4 py-3">
        <div className="w-full bg-amber-500 text-white text-center py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs mb-4">
          🔒 PRO BOSQICHI (11-100+ DARSLAR)
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#131B2E]">Olimpiada & PRO Masterclass</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">100+ DARS</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">Olimpiada darajasi</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Pro Lesson 11 */}
          <div 
            onClick={handleOpenPro}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center text-sm shrink-0">
                🔒
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">11-DARS • Chuqurlashtirilgan</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Trigonometrik formulalar siri & tengsizliklar
                </h4>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
              ›
            </span>
          </div>

          {/* Pro Lesson 12 */}
          <div 
            onClick={handleOpenPro}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center text-sm shrink-0">
                🔒
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">12-DARS • Xalqaro Olimpiada (IMO)</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Hosila va integral olimpiada darajasi
                </h4>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
              ›
            </span>
          </div>

          {/* Pro Lesson 13 */}
          <div 
            onClick={handleOpenPro}
            className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center text-sm shrink-0">
                🔒
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">13-DARS • Stereometriya 3D</div>
                <h4 className="text-xs font-bold text-[#131B2E] mt-0.5">
                  Fazoviy koordinatalar va kesimlar
                </h4>
              </div>
            </div>
            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
              ›
            </span>
          </div>
        </div>
      </div>

      {/* 7. Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-100 z-40">
        <button
          onClick={handleOpenPro}
          className="w-full bg-[#131B2E] hover:bg-[#1f2b48] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
        >
          <span className="text-amber-400">🎓</span>
          <span>HDP Pro Obunasini faollashtirish</span>
          <span className="text-sm">→</span>
        </button>
      </div>
    </div>
  )
}

export default CoursesScreen
