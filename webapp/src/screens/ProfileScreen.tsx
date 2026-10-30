import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triggerHaptic } from '../lib/telegram'

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [notificationsOn, setNotificationsOn] = useState(true)

  const handleToggleNotifications = () => {
    triggerHaptic('selection')
    setNotificationsOn(!notificationsOn)
  }

  const handleLogout = () => {
    triggerHaptic('warning')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-28 text-[#131B2E] select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#006C49] flex items-center justify-center text-white font-serif font-black text-xl shadow-xs">
            Σ
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#131B2E] leading-tight">
              Mening Profilim
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">HDP Shaxsiy Kabinet</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs relative"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          <button 
            onClick={() => triggerHaptic('light')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. User Info Card */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm relative">
          <button 
            onClick={() => triggerHaptic('light')}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>

          <div className="flex items-center gap-3.5 mb-3">
            {/* Avatar with Verified Badge */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006C49] to-[#00422B] text-white flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-white">
                AS
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-[#131B2E]">Aliyev Sardor</h2>
                <span className="text-emerald-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                @sardor_hdp <span className="text-slate-300">·</span> <span className="font-mono text-[11px] text-slate-400">#HDP-84219</span>
              </p>
            </div>
          </div>

          {/* Level Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-semibold text-emerald-800">
            <span>🏆</span>
            <span>Olimpiada Ishtirokchisi · Lv.4</span>
          </div>
        </div>
      </div>

      {/* 3. Pro Subscription Card */}
      <div className="px-4 py-2">
        <div className="rounded-3xl bg-gradient-to-br from-[#004E35] via-[#005B3F] to-[#006C49] text-white p-4 shadow-[0_6px_20px_rgba(0,108,73,0.18)]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200">
                💎
              </div>
              <h3 className="font-extrabold text-sm text-white">HDP Pro Faol</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-300/20">
              YILLIK
            </span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed mb-3">
            Barcha 100+ maxsus darslar va IMO tahlili ochiq
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
            <span className="text-emerald-100/90 text-[11px] flex items-center gap-1">
              <span>📅</span> Muddati: 31-Dekabr, 2025
            </span>

            <button
              onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
              className="px-4 py-1.5 bg-white text-[#006C49] rounded-full text-xs font-extrabold shadow-sm hover:bg-emerald-50"
            >
              Boshqarish
            </button>
          </div>
        </div>
      </div>

      {/* 4. Stats 2x2 Grid */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3">
        {/* Streak */}
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-semibold">Olov Streak</span>
            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              🔥
            </span>
          </div>
          <div className="text-xl font-extrabold text-[#131B2E] my-0.5 font-sans">
            12 kun
          </div>
          <div className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
            <span>↗</span> Shaxsiy rekord!
          </div>
        </div>

        {/* XP */}
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-semibold">XP Jam'armasi</span>
            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              ⚡
            </span>
          </div>
          <div className="text-xl font-extrabold text-[#131B2E] my-0.5 font-sans">
            3,850 XP
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Keyingi: 4,000 XP (+150)
          </div>
        </div>

        {/* Solved Problems */}
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-semibold">Yechilgan Masalalar</span>
            <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
              🧮
            </span>
          </div>
          <div className="text-xl font-extrabold text-[#131B2E] my-0.5 font-sans">
            248 ta
          </div>
          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
            <span>✓</span> 94% aniqlik darajasi
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-semibold">Reyting O'rni</span>
            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              🏆
            </span>
          </div>
          <div className="text-xl font-extrabold text-[#131B2E] my-0.5 font-sans">
            #42-o'rin
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Respublika Top-100
          </div>
        </div>
      </div>

      {/* 5. Weekly Activity Bar Chart */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-sm font-extrabold text-[#131B2E]">Haftalik Faollik</h3>
              <p className="text-[11px] text-slate-500">Kunlik o'rtacha 38 daqiqa mashg'ulot</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
              <span>🕒</span> Jami 4.4 soat
            </span>
          </div>

          {/* Bar Columns */}
          <div className="flex items-end justify-between pt-6 pb-1 px-2 h-36">
            {[
              { day: 'Du', height: '40%', val: '30m' },
              { day: 'Se', height: '60%', val: '40m' },
              { day: 'Ch', height: '35%', val: '25m' },
              { day: 'Pa', height: '80%', val: '50m' },
              { day: 'Ju', height: '50%', val: '35m' },
              { day: 'Sha', height: '70%', val: '45m', active: true },
              { day: 'Ya', height: '10%', val: '0m' },
            ].map((col) => (
              <div key={col.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className={`text-[10px] font-semibold ${col.active ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {col.val}
                </span>
                <div className="w-7 bg-slate-100 rounded-xl h-20 flex items-end p-0.5">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      col.active ? 'bg-[#006C49]' : 'bg-slate-200'
                    }`}
                    style={{ height: col.height }}
                  />
                </div>
                <span className={`text-xs ${col.active ? 'font-bold text-[#131B2E]' : 'text-slate-500'}`}>
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Achievements & Medals */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-extrabold text-[#131B2E]">Yutuqlar & Medallar</h3>
            <button 
              onClick={() => triggerHaptic('light')}
              className="text-xs font-semibold text-[#006C49] flex items-center gap-0.5"
            >
              Barchasi <span className="text-[10px]">›</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            20 tadan 12 tasi ochilgan (60%)
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#FAF8FF] border border-emerald-100/80 rounded-2xl p-2.5 text-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1.5 text-base">
                ⚡
              </div>
              <div className="font-bold text-[11px] text-[#131B2E] truncate">Tezkor Ma...</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Viyet Master</div>
            </div>

            <div className="bg-[#FAF8FF] border border-amber-100/80 rounded-2xl p-2.5 text-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-1.5 text-base">
                🎖️
              </div>
              <div className="font-bold text-[11px] text-[#131B2E] truncate">Olimpiada...</div>
              <div className="text-[10px] text-amber-700 font-semibold">DTM Pro</div>
            </div>

            <div className="bg-[#FAF8FF] border border-blue-100/80 rounded-2xl p-2.5 text-center">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-1.5 text-base">
                🎛️
              </div>
              <div className="font-bold text-[11px] text-[#131B2E] truncate">Matritsa L-3</div>
              <div className="text-[10px] text-blue-700 font-semibold">Algebra Pro</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. App & Security Settings List */}
      <div className="px-4 py-2">
        <h3 className="text-sm font-extrabold text-[#131B2E] mb-2 px-1">
          Ilova va Xavfsizlik Sozlamalari
        </h3>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {/* Certificates */}
          <div 
            onClick={() => triggerHaptic('light')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-base">
                🎓
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131B2E]">Mening Sertifikatlarim</h4>
                <p className="text-[11px] text-slate-500">2 ta rasmiy tasdiqlangan hujjat</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">PDF</span>
              <span className="text-slate-400 text-sm">›</span>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                🔔
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131B2E]">Bildirishnomalar & Eslatmalar</h4>
                <p className="text-[11px] text-slate-500">Har kuni soat 20:00 da dars</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsOn ? 'bg-[#006C49]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme */}
          <div 
            onClick={() => triggerHaptic('light')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-base">
                ☀️
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131B2E]">Ilova Mavzusi</h4>
                <p className="text-[11px] text-slate-500">Yorug' (Toza Oq rejim)</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">Faol</span>
              <span className="text-slate-400 text-sm">›</span>
            </div>
          </div>

          {/* Support */}
          <a
            href="https://t.me/hdp_support"
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerHaptic('light')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-base">
                🎧
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#131B2E]">Yordam va Qo'llab-quvvatlash</h4>
                <p className="text-[11px] text-slate-500">24/7 Telegram kurator (@hdp_support)</p>
              </div>
            </div>
            <span className="text-slate-400 text-xs">↗</span>
          </a>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base">
                🚪
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-600">Tizimdan chiqish</h4>
                <p className="text-[11px] text-slate-400">Hisobdan xavfsiz chiqish</p>
              </div>
            </div>
            <span className="text-rose-500 text-sm">›</span>
          </div>
        </div>
      </div>

      {/* 8. Build / Version Footer */}
      <div className="text-center pt-4 pb-2 text-slate-400">
        <p className="text-xs font-mono font-medium flex items-center justify-center gap-1.5 text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>HDP Academy v2.4.0 (Build 892)</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Matematika & Fizika ixtisoslashtirilgan maktabi
        </p>
      </div>
    </div>
  )
}

export default ProfileScreen
