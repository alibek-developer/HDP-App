import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const VideoScreen = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [tab, setTab] = useState<'chapters' | 'notes'>('chapters')
  const [isDone, setIsDone] = useState(false)

  const chapters = [
    { time: '00:00', title: 'Kirish va mavzu taqdimoti' },
    { time: '03:14', title: 'Asosiy formula va uning isboti' },
    { time: '09:40', title: 'Misol 1 — oddiy holat yechimi' },
    { time: '16:22', title: 'Misol 2 — murakkab holat' },
    { time: '22:05', title: 'DTM misollar tahlili' },
    { time: '28:30', title: 'Xulosa va takrorlash' },
  ]

  const handleDone = () => {
    triggerHaptic('success')
    setIsDone(true)
    setTimeout(() => navigate('/courses'), 1200)
  }

  return (
    <div className="min-h-screen pb-6 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ background: '#F1F4F9' }}
      >
        <button
          onClick={() => { triggerHaptic('light'); navigate(-1) }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
            Dars #4 · Trigonometriya
          </p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>
            Trigonometrik funksiyalar
          </p>
        </div>

        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
          onClick={() => triggerHaptic('light')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#334155" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </header>

      {/* Video player */}
      <section className="px-4 mb-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0F0E2A 0%, #1A1748 100%)',
            aspectRatio: '16/9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 16px, rgba(99,102,241,0.3) 16px, rgba(99,102,241,0.3) 17px)',
            }}
          />

          {/* Live badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.25)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              USTOZ AZAMAT
            </span>
          </div>

          {/* Viewer count */}
          <div className="absolute top-3 right-3">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.4)', color: '#94A3B8' }}
            >
              👁 218 ta
            </span>
          </div>

          {/* Center formula + play */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-mono text-base font-bold mb-4 px-4 py-2.5 rounded-xl text-center"
              style={{
                color: '#A5B4FC',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              sin²(x) + cos²(x) = 1
            </div>

            <button
              onClick={() => { triggerHaptic('light'); setIsPlaying(!isPlaying) }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: isPlaying
                  ? 'rgba(255,255,255,0.15)'
                  : 'linear-gradient(135deg, #4338CA, #6366F1)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0">
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ height: '100%', width: '38%', background: 'linear-gradient(90deg, #4338CA, #6366F1)' }} />
            </div>
          </div>
        </div>

        {/* Time row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs font-mono font-medium" style={{ color: '#94A3B8' }}>10:14</span>
          <span className="text-xs font-mono font-medium" style={{ color: '#94A3B8' }}>25:00</span>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 mb-4">
        <div
          className="flex rounded-xl p-1"
          style={{ background: '#E2E8F0' }}
        >
          {(['chapters', 'notes'] as const).map(t => (
            <button
              key={t}
              onClick={() => { triggerHaptic('selection'); setTab(t) }}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: tab === t ? '#FFFFFF' : 'transparent',
                color:      tab === t ? '#0F172A'  : '#94A3B8',
                boxShadow:  tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t === 'chapters' ? '📑 Boblar' : '📝 Eslatmalar'}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section className="px-4 mb-6">
        {tab === 'chapters' ? (
          <div className="space-y-2">
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => triggerHaptic('selection')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <span
                  className="font-mono text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: '#EEF2FF', color: '#4338CA' }}
                >
                  {ch.time}
                </span>
                <span className="text-sm font-medium flex-1" style={{ color: '#334155' }}>
                  {ch.title}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div
            className="p-4 rounded-xl text-sm leading-relaxed"
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B' }}
          >
            <p className="font-semibold mb-2" style={{ color: '#0F172A' }}>Dars eslatmalari:</p>
            <p>• sin²α + cos²α = 1 — asosiy trigonometrik tenglik</p>
            <p>• 1 + tg²α = 1/cos²α</p>
            <p>• 1 + ctg²α = 1/sin²α</p>
            <p className="mt-2">DTM testida bu formulalardan 2-3 ta savol albatta chiqadi.</p>
          </div>
        )}
      </section>

      {/* Mustaqil sinov (test) kartasi */}
      <section className="px-4 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold" style={{ color: '#0F172A' }}>📋 Mustaqil Sinov</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#FFFBEB', color: '#D97706' }}>+30 🪙</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: '#EEF2FF', color: '#4338CA' }}>+50 ⚡</span>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
            3 ta test savoli bilan bu mavzudagi o'zlashtirishingni tekshir.
          </p>
          <button
            onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}
          >
            Testni boshlash →
          </button>
        </div>
      </section>

      {/* Complete button */}
      <section className="px-4">
        <AnimatePresence>
          {isDone ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
              style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
            >
              ✓ Dars tugallandi! Amaliy qismga o'tilmoqda...
            </motion.div>
          ) : (
            <button
              onClick={handleDone}
              className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4338CA, #6366F1)',
                boxShadow: '0 4px 16px rgba(67,56,202,0.3)',
              }}
            >
              ✓ Darsni tugatdim — Amaliy qismga o'tish
            </button>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}

export default VideoScreen
