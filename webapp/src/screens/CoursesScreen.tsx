import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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

  const freeLessons = [
    { id: 1, title: 'Matematik mantiq asoslari', time: '18 daqiqa', status: 'done', xp: 50 },
    { id: 2, title: 'Haqiqiy sonlar to\'plami', time: '24 daqiqa', status: 'done', xp: 50 },
    { id: 3, title: 'Chiziqli tenglamalar va matritsalar', time: '32 daqiqa', status: 'current', xp: 50 },
    { id: 4, title: 'Kvadrat tenglamalar va Viyet', time: '22 daqiqa', status: 'open', xp: 50 },
    { id: 5, title: 'Modulli tenglamalar va grafiklar', time: '26 daqiqa', status: 'open', xp: 50 },
    { id: 6, title: 'Funksiyalar va ularning grafigi', time: '30 daqiqa', status: 'open', xp: 50 },
  ]

  const proLessons = [
    { id: 11, title: 'Trigonometrik formulalar siri & tengsizliklar', level: 'Chuqurlashtirilgan' },
    { id: 12, title: 'Hosila va integral olimpiada darajasi', level: 'IMO Olimpiada' },
    { id: 13, title: 'Stereometriya 3D fazoviy koordinatalar', level: 'Fazoviy Geometriya' },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-32 text-[#111827] select-none font-sans overflow-x-hidden">
      {/* 1. Top Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/home') }}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-slate-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AKADEMIYA</span>
            <h1 className="text-base font-black text-[#131B2E]">Olimpiada Kurslari</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-amber-800 shadow-2xs">
            <span>🔥</span>
            <span>12 kun</span>
          </div>
        </div>
      </header>

      {/* 2. Hero Card: 100+ Chuqurlashtirilgan Darslar */}
      <section className="px-4 py-2.5">
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#003823] via-[#005739] to-[#006C49] text-white p-5 shadow-[0_12px_32px_rgba(0,108,73,0.25)] border border-emerald-400/20 overflow-hidden">
          <div className="relative z-10 flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              <span>🛡️</span> PRO MASTERCLASS
            </span>
            <span className="text-xs text-emerald-200 font-bold">
              ● 7 kun bepul
            </span>
          </div>

          <h2 className="relative z-10 text-xl font-black text-white leading-snug mb-1 max-w-[280px]">
            100+ Chuqurlashtirilgan Olimpiada Darslari
          </h2>
          <p className="relative z-10 text-xs text-white/80 leading-relaxed mb-4">
            DTM 100%, Milliy sertifikat va Xalqaro olimpiada (IMO) uchun maxsus videodarslar.
          </p>

          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={handleOpenPro}
              className="flex-1 bg-white hover:bg-emerald-50 text-[#006C49] font-black text-xs py-3 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>7 kun tekin sinab ko'rish</span>
              <span>→</span>
            </button>
            <button
              onClick={handleOpenPro}
              className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 hover:bg-white/25"
            >
              💎
            </button>
          </div>
        </div>
      </section>

      {/* 3. In-Progress Lesson Card */}
      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-xs font-black text-[#131B2E] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>O'RGANISHNI DAVOM ETING</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400">3 / 10 Bepul</span>
        </div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenLesson(3)}
          className="bg-white rounded-[28px] p-4 border-2 border-emerald-500/80 shadow-sm cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006C49] text-white flex items-center justify-center font-serif font-black text-2xl shadow-xs">
                Σ
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  3-DARS • ALGEBRA
                </span>
                <h3 className="text-xs font-black text-[#131B2E]">
                  Chiziqli tenglamalar va matritsalar
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">⏱ 18 daqiqa qoldi</span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-full bg-[#006C49] text-white flex items-center justify-center shadow-md">
              ▶
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-500">Dars jarayoni</span>
              <span className="font-bold text-emerald-700">75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-3/4" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. Free Module Lessons */}
      <section className="px-4 py-2 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-black text-[#131B2E]">Dastlabki 10 ta Dars</h3>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
            BEPUL 🎁
          </span>
        </div>

        {freeLessons.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenLesson(item.id)}
            className={`bg-white rounded-2xl p-3.5 border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
              item.status === 'current'
                ? 'border-emerald-500 bg-emerald-50/20'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                item.status === 'done'
                  ? 'bg-emerald-100 text-emerald-800'
                  : item.status === 'current'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {item.status === 'done' ? '✓' : item.status === 'current' ? '▶' : item.id}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.id}-DARS • {item.time}
                </span>
                <h4 className="text-xs font-bold text-[#131B2E]">{item.title}</h4>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              item.status === 'done'
                ? 'bg-emerald-50 text-emerald-800'
                : item.status === 'current'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {item.status === 'done' ? 'Bajarildi' : item.status === 'current' ? 'Ko\'rish' : 'Ochiq'}
            </span>
          </div>
        ))}
      </section>

      {/* 5. Pro Masterclass Section */}
      <section className="px-4 py-3 space-y-2.5">
        <div className="bg-amber-500 text-white text-center py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
          🔒 PRO BOSQICHI (11-100+ DARSLAR)
        </div>

        {proLessons.map((item) => (
          <div
            key={item.id}
            onClick={handleOpenPro}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between cursor-pointer opacity-85 hover:opacity-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-xs shrink-0">
                🔒
              </div>
              <div>
                <span className="text-[10px] text-slate-400">{item.id}-DARS • {item.level}</span>
                <h4 className="text-xs font-bold text-[#131B2E]">{item.title}</h4>
              </div>
            </div>
            <span className="text-slate-400 text-sm">›</span>
          </div>
        ))}
      </section>
    </div>
  )
}

export default CoursesScreen
