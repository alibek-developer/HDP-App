import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const EXAMPLES = [
  {
    title: 'sin²α + cos²α = 1 asosida qidirish',
    problem: 'sin α = 3/5 bo\'lsa, cos α ni toping (α — o\'tkinchi burchak).',
    steps: [
      'sin²α + cos²α = 1 tenglikka qo\'yamiz',
      '(3/5)² + cos²α = 1  →  cos²α = 1 − 9/25 = 16/25',
      'α o\'tkinchi burchak → cos α > 0  →  cos α = 4/5',
    ],
  },
  {
    title: 'Ikkilangan burchak formulasi',
    problem: 'sin 2α ni hisoblang, agar sin α = 3/5, cos α = 4/5 bo\'lsa.',
    steps: [
      'sin(2α) = 2 sin α · cos α formulasini eslaymiz',
      'sin(2α) = 2 · (3/5) · (4/5)',
      'sin(2α) = 24/25',
    ],
  },
]

const TASKS = [
  { id: 1, text: 'tg α = 3/4 bo\'lsa, sin α · cos α ni toping', done: true },
  { id: 2, text: 'cos 2α ni hisoblang: cos α = 4/5', done: false },
  { id: 3, text: 'sin(π/6) + cos(π/3) ifodani qiymlashtiring', done: false },
  { id: 4, text: '1 + tg²α ifodani cos α orqali yozing', done: false },
]

const CoursesScreen = () => {
  const navigate = useNavigate()
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [doneTasks, setDoneTasks] = useState<number[]>(TASKS.filter(t => t.done).map(t => t.id))

  const toggleTask = (id: number) => {
    triggerHaptic('selection')
    setDoneTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3" style={{ background: '#F1F4F9' }}>
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
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Amaliy qism</p>
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Dars #4 · Trigonometriya</p>
        </div>
        <div style={{ width: 36 }} />
      </header>

      {/* Misollar */}
      <section className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-4 rounded-full" style={{ background: '#4338CA' }} />
          <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Misollar</h3>
          <span className="text-xs font-semibold ml-auto" style={{ color: '#94A3B8' }}>{EXAMPLES.length} ta</span>
        </div>

        <div className="space-y-2.5">
          {EXAMPLES.map((ex, i) => {
            const open = openIdx === i
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ background: '#FFFFFF', border: `1px solid ${open ? '#C7D2FE' : '#E2E8F0'}` }}
              >
                <button
                  onClick={() => { triggerHaptic('selection'); setOpenIdx(open ? null : i) }}
                  className="w-full flex items-center gap-3 p-3.5 text-left"
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: open ? '#4338CA' : '#EEF2FF', color: open ? '#FFFFFF' : '#4338CA' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: '#0F172A' }}>{ex.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#94A3B8' }}>{ex.problem}</p>
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: '#94A3B8' }}>{open ? '▲' : '▼'}</span>
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="p-3 rounded-lg" style={{ background: '#EEF2FF' }}>
                          <p className="text-xs font-bold mb-2" style={{ color: '#4338CA' }}>Qadam-baqadam yechim:</p>
                          {ex.steps.map((s, k) => (
                            <p key={k} className="text-xs leading-relaxed mb-1" style={{ color: '#334155' }}>
                              <span className="font-bold" style={{ color: '#4338CA' }}>{k + 1}.</span> {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* Topshiriqlar */}
      <section className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-4 rounded-full" style={{ background: '#059669' }} />
          <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>Topshiriqlar</h3>
          <span className="text-xs font-semibold ml-auto" style={{ color: '#94A3B8' }}>{doneTasks.length}/{TASKS.length}</span>
        </div>

        <div className="space-y-2">
          {TASKS.map(t => {
            const done = doneTasks.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${done ? '#A7F3D0' : '#E2E8F0'}`,
                }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                  style={{
                    background: done ? '#059669' : '#F1F4F9',
                    color: done ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  {done ? '✓' : t.id}
                </span>
                <p
                  className="text-sm font-medium flex-1"
                  style={{
                    color: done ? '#94A3B8' : '#0F172A',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {t.text}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Test CTA */}
      <section className="px-4">
        <button
          onClick={() => { triggerHaptic('medium'); navigate('/solve') }}
          className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #4338CA, #6366F1)',
            boxShadow: '0 4px 16px rgba(67,56,202,0.28)',
          }}
        >
          📝 Testni boshlash — +30 🪙 +50 ⚡
        </button>
        <p className="text-center text-xs mt-2" style={{ color: '#94A3B8' }}>
          Topshiriqlarni bajargandan so'ng bilimingizni test orqali tekshiring
        </p>
      </section>
    </div>
  )
}

export default CoursesScreen
