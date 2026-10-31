import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Lock, Coins, Crown, Target, Zap } from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { PROBLEM_SETS } from '../data/content'
import { useApp, totalProblemCount } from '../store/useStore'

/**
 * Masalalar — ko'nikma uchun to'plamlar.
 * Har bir to'g'ri yechilgan masala o'z coin'ini beradi.
 * Qoida: bepul to'plam hammaga, qolgani faqat Pro.
 */
const diffStyle = (d: string) =>
  d === 'oson'
    ? { bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' }
    : d === "o'rta"
      ? { bg: '#FFF7E6', border: '#F5D899', color: '#B45309' }
      : { bg: '#FEF2F2', border: '#FECACA', color: '#B91C1C' }

const ProblemsScreen = () => {
  const navigate = useNavigate()
  const isPro = useApp(s => s.isPro)
  const coin = useApp(s => s.coin)
  const solvedQuestions = useApp(s => s.solvedQuestions)

  const open = (id: string, free: boolean) => {
    if (!free && !isPro) {
      triggerHaptic('warning')
      navigate('/pro', { state: { reason: 'problem-set', setId: id } })
      return
    }
    triggerHaptic('medium')
    navigate(`/problems/${id}`)
  }

  return (
    <div className="min-h-screen pb-8 select-none font-sans" style={{ background: '#F1F4F9' }}>

      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); navigate('/home') }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#334155', transform: 'rotate(180deg)' }} />
        </button>
        <p className="text-base font-extrabold" style={{ color: '#0F172A' }}>Masalalar</p>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg" style={{ background: '#FFF7E6', border: '1px solid #F5D899' }}>
          <Coins size={13} style={{ color: '#B45309' }} />
          <span className="text-xs font-extrabold" style={{ color: '#B45309' }}>{coin}</span>
        </div>
      </header>

      <section className="px-4 mb-5">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <Target size={18} style={{ color: '#4338CA' }} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#0F172A' }}>{PROBLEM_SETS.length} ta to'plam</p>
            <p className="text-[11px]" style={{ color: '#64748B' }}>{totalProblemCount} ta masala · har biriga coin</p>
          </div>
        </div>
      </section>

      <section className="px-4 space-y-3">
        {PROBLEM_SETS.map((set, idx) => {
          const locked = !set.free && !isPro
          const done = (solvedQuestions[set.id] ?? []).length
          const s = diffStyle(set.difficulty)
          return (
            <motion.button
              key={set.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => open(set.id, set.free)}
              className="w-full text-left rounded-2xl p-4 active:scale-[0.985] transition-transform"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${locked ? '#E2E8F0' : '#DCE3EC'}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                opacity: locked ? 0.75 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {locked && <Lock size={13} style={{ color: '#94A3B8' }} />}
                    {!set.free && !locked && <Crown size={13} style={{ color: '#B45309' }} />}
                    <p className="text-sm font-extrabold" style={{ color: '#0F172A' }}>{set.title}</p>
                  </div>
                  <p className="text-[11px]" style={{ color: '#64748B' }}>{set.topic}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                >
                  {set.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #F1F5F9' }}>
                <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#B45309' }}>
                  <Coins size={12} /> {set.coinPerSolve} / masala
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#4338CA' }}>
                  <Zap size={12} /> {set.xpPerSolve}
                </span>
                <span className="flex-1" />
                <span className="text-[11px] font-semibold" style={{ color: '#94A3B8' }}>
                  {set.questions.length} savol
                </span>
              </div>

              {done > 0 && (
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(done / set.questions.length) * 100}%`, background: '#059669' }}
                  />
                </div>
              )}
            </motion.button>
          )
        })}
      </section>

      {!isPro && (
        <section className="px-4 mt-5">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/pro') }}
            className="w-full rounded-2xl p-4 text-left"
            style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#FFFFFF' }}
          >
            <p className="text-sm font-extrabold flex items-center gap-1.5">
              <Crown size={15} /> Barcha to'plamlarni ochish
            </p>
            <p className="text-[11px] mt-0.5" style={{ opacity: 0.85 }}>Pro obuna bilan qolgan masalalar ham bepul.</p>
          </button>
        </section>
      )}
    </div>
  )
}

export default ProblemsScreen
