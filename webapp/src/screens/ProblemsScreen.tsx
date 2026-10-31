import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check, ChevronLeft, ChevronRight, ClipboardList, Coins, Compass, Flame, Infinity as InfinityIcon,
  ListFilter, Lock, Play, Sigma, Trophy, Triangle, Zap,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { PROBLEM_SETS, EXAM_SET, dailyProblem, type ProblemSet } from '../data/content'
import { useApp, DAILY_BONUS } from '../store/useStore'

const WHITE_CARD = {
  background: '#FFFFFF',
  border: '1px solid #E3E8DE',
  boxShadow: '0 2px 10px rgba(28,50,20,0.04)',
}

const sectionTitle = 'text-[17px] font-extrabold text-ink'
const limeBtn = {
  background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 100%)',
  color: '#1C3214',
  boxShadow: '0 6px 14px rgba(95,175,34,0.34), inset 0 1px 0 rgba(255,255,255,0.55)',
}
const ghostBtn = { background: '#FFFFFF', color: '#33452F', border: '1px solid #E4E9DD' }
const lockedBtn = {
  background: 'linear-gradient(150deg, #F6D8A6 0%, #E8A33D 100%)',
  color: '#0E1A12',
  boxShadow: '0 6px 14px rgba(232,163,61,0.28), inset 0 1px 0 rgba(255,255,255,0.5)',
}

const TOPIC_ICON: Record<string, React.ReactNode> = {
  Algebra: <Sigma size={17} />,
  Geometriya: <Triangle size={17} />,
  Trigonometriya: <Compass size={17} />,
  Analiz: <InfinityIcon size={17} />,
  Olimpiada: <Trophy size={17} />,
}
const TOPIC_TINT: Record<string, { bg: string; fg: string }> = {
  Algebra: { bg: '#DDF3DC', fg: '#0B6E4F' },
  Geometriya: { bg: '#EFF2EC', fg: '#6B7C66' },
  Trigonometriya: { bg: '#E6F5D2', fg: '#1B9A6B' },
  Analiz: { bg: '#E5ECFE', fg: '#3560C4' },
  Olimpiada: { bg: '#FCF1DC', fg: '#B87A22' },
}

const pad = (n: number) => String(n).padStart(2, '0')
const clock = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`
}
const msToMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

/** Reyting — backend ulangunicha mahalliy namuna + haqiqiy foydalanuvchi */
const RIVALS = [
  { name: 'Dilnoza R.', coin: 1840 },
  { name: 'Sardor T.', coin: 1520 },
  { name: 'Jasur A.', coin: 1290 },
]

const TIERS = [
  { name: "Boshlang'ich", need: 0 },
  { name: "O'rta", need: 5 },
  { name: 'Qiyin', need: 12 },
  { name: 'Olimpiada', need: 20 },
]

type Mode = {
  icon: React.ReactNode
  tint: string
  fg: string
  name: string
  desc: string
  coin: number
  cta: string
  pro?: boolean
  run: () => void
}

const ProblemsScreen = () => {
  const navigate = useNavigate()

  const coin = useApp(s => s.coin)
  const streak = useApp(s => s.streak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const olympToday = useApp(s => s.olympToday)
  const claimedMissions = useApp(s => s.claimedMissions)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const unlocked = useApp(s => s.unlocked)
  const isPro = useApp(s => s.isPro)
  const rollDay = useApp(s => s.rollDay)
  const claimMission = useApp(s => s.claimMission)
  const unlockSet = useApp(s => s.unlockSet)
  const canOpenSet = useApp(s => s.canOpenSet)

  const [cat, setCat] = useState('Barchasi')
  const [remain, setRemain] = useState(msToMidnight)

  useEffect(() => {
    rollDay()
    const t = setInterval(() => setRemain(msToMidnight()), 1000)
    return () => clearInterval(t)
  }, [rollDay])

  const daily = useMemo(() => dailyProblem(), [])
  const dailyBonusOn = useApp(s => s.dailyBonusOn)
  const dailyClaimed = dailyBonusOn === new Date().toISOString().slice(0, 10)

  const categories = useMemo(
    () => ['Barchasi', ...Array.from(new Set(PROBLEM_SETS.map(s => s.topic)))],
    []
  )
  const list = useMemo(
    () => (cat === 'Barchasi' ? PROBLEM_SETS : PROBLEM_SETS.filter(s => s.topic === cat)),
    [cat]
  )

  const openSet = (set: ProblemSet) => {
    if (canOpenSet(set.id)) {
      triggerHaptic('medium')
      navigate(`/problems/${set.id}`)
      return
    }
    if (set.unlockPrice) {
      triggerHaptic('warning')
      if (unlockSet(set.id, set.unlockPrice)) navigate(`/problems/${set.id}`)
      else navigate('/shop')
      return
    }
    triggerHaptic('warning')
    navigate('/pro', { state: { reason: 'problem-set', setId: set.id } })
  }

  const solvedIn = (set: ProblemSet) => (solvedQuestions[set.id] ?? []).length

  const missions = [
    {
      key: 'solve5',
      label: 'Bugun 5 ta masala yech',
      reward: 20,
      done: solvedToday >= 5,
      progress: `${Math.min(solvedToday, 5)}/5`,
    },
    {
      key: 'streak',
      label: "Streak'ni davom ettir",
      reward: 10,
      done: streak > 0,
      progress: streak > 0 ? `${streak} kun` : '0 kun',
    },
    {
      key: 'olymp',
      label: 'Bitta olimpiada masalasi yech',
      reward: 50,
      done: olympToday >= 1,
      progress: `${Math.min(olympToday, 1)}/1`,
    },
  ]

  const modes: Mode[] = [
    {
      icon: <Zap size={18} />,
      tint: '#FCF1DC',
      fg: '#E8A33D',
      name: 'Tezkor Blitz',
      desc: '5 daqiqada 10 ta masala',
      coin: 50,
      cta: 'Boshlash',
      run: () => { triggerHaptic('medium'); navigate('/blitz') },
    },
    {
      icon: <Flame size={18} />,
      tint: '#FCF1DC',
      fg: '#B87A22',
      name: 'Streak Seriya',
      desc: "Ketma-ket 10 ta to'g'ri javob — 2x bonus",
      coin: 100,
      cta: 'Boshlash',
      run: () => { triggerHaptic('medium'); navigate('/problems/ps-streak') },
    },
    {
      icon: <Compass size={18} />,
      tint: '#DDF3DC',
      fg: '#0B6E4F',
      name: 'Mavzu bo\'yicha',
      desc: "O'zingiz mavzu tanlang",
      coin: 25,
      cta: 'Tanlash',
      run: () => {
        triggerHaptic('selection')
        setCat('Barchasi')
        document.getElementById('masala-royxati')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
    },
    {
      icon: <ClipboardList size={18} />,
      tint: '#E5ECFE',
      fg: '#3560C4',
      name: 'Sinov',
      desc: `${EXAM_SET.questions.length} ta savollik to'liq test`,
      coin: 150,
      cta: 'Boshlash',
      pro: true,
      run: () => {
        if (!isPro) {
          triggerHaptic('warning')
          navigate('/pro', { state: { reason: 'problem-set', setId: 'ps-exam' } })
          return
        }
        triggerHaptic('medium')
        navigate('/problems/ps-exam')
      },
    },
  ]

  const board = useMemo(() => {
    const me = { name: 'Siz', coin, me: true }
    return [...RIVALS.map(r => ({ ...r, me: false })), me].sort((a, b) => b.coin - a.coin)
  }, [coin])

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans pb-10 select-none"
      style={{ background: 'linear-gradient(180deg, #CDE9AE 0%, #E6F5D2 40%, #F7FCED 76%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-[300px] grid-paper opacity-60 pointer-events-none" />

      <div className="relative z-10 px-5">
        {/* ── 1. Header ── */}
        <header className="safe-top flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/home') }}
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(28,50,20,0.08)' }}
              aria-label="Orqaga"
            >
              <ChevronLeft size={18} className="text-ink-2" />
            </button>
            <h1 className="text-[24px] font-extrabold text-ink tracking-[-0.028em]">Masalalar</h1>
          </div>

          <button
            onClick={() => { triggerHaptic('light'); navigate('/shop') }}
            className="flex items-center gap-1.5 h-[32px] px-3 rounded-full active:scale-[0.97] transition-transform"
            style={{ background: '#FCF1DC', border: '1px solid rgba(232,163,61,0.38)' }}
          >
            <Coins size={14} style={{ color: '#E8A33D' }} />
            <span className="num text-[12.5px] font-extrabold" style={{ color: '#B87A22' }}>
              {coin.toLocaleString('en-US')} coin
            </span>
          </button>
        </header>

        <div className="flex items-center gap-2.5 mt-4">
          <span
            className="flex items-center gap-1.5 h-[32px] px-3 rounded-full"
            style={{ background: '#FFFFFF', border: '1px solid #E3E8DE' }}
          >
            <Flame size={14} style={{ color: '#E8A33D' }} />
            <span className="text-[12.5px] font-extrabold text-ink num">{streak} kunlik streak</span>
          </span>
          <span
            className="flex items-center gap-1.5 h-[32px] px-3 rounded-full"
            style={{ background: '#FFFFFF', border: '1px solid #E3E8DE' }}
          >
            <Check size={14} className="text-brand" strokeWidth={3} />
            <span className="text-[12.5px] font-extrabold text-ink num">{solvedCount} ta yechilgan</span>
          </span>
        </div>

        {/* ── 2. Kunlik mega masala ── */}
        <section className="mt-5">
          <div
            className="relative overflow-hidden rounded-[20px] p-4"
            style={{
              background: 'linear-gradient(140deg, #063F2E 0%, #0B6E4F 58%, #1B9A6B 100%)',
              boxShadow: '0 14px 32px rgba(6,63,46,0.26)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-tiny uppercase px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.14)', color: '#EAF7DC', border: '1px solid rgba(205,233,174,0.28)' }}
              >
                Kunlik Mega Masala
              </span>
              <span className="num text-[12.5px] font-extrabold text-leaf-bright">{clock(remain)}</span>
            </div>

            <p className="mt-3.5 text-[11px] font-extrabold uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {daily.set.topic} · {daily.set.grade}
            </p>
            <p className="mt-1.5 font-mono text-[14px] leading-snug text-leaf-bright">{daily.question.prompt}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 h-[28px] px-2.5 rounded-full text-[11.5px] font-extrabold num"
                  style={{ background: 'rgba(232,163,61,0.18)', color: '#F3C88A', border: '1px solid rgba(232,163,61,0.42)' }}
                >
                  <Coins size={12} /> +{DAILY_BONUS.coin} coin
                </span>
                <span
                  className="flex items-center gap-1 h-[28px] px-2.5 rounded-full text-[11.5px] font-extrabold num"
                  style={{ background: 'rgba(126,211,33,0.16)', color: '#AEEA5C', border: '1px solid rgba(126,211,33,0.40)' }}
                >
                  <Zap size={12} /> +{DAILY_BONUS.xp} XP
                </span>
                {dailyClaimed && (
                  <span className="text-tiny uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>bugun olindi</span>
                )}
              </div>

              <button
                onClick={() => openSet(daily.set)}
                className="shrink-0 flex items-center gap-1 h-[40px] px-4 rounded-full text-[13px] font-extrabold text-ink active:scale-[0.97] transition-transform"
                style={{ background: '#FFFFFF', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 8px 18px rgba(6,63,46,0.30)' }}
              >
                Yechish <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ── Kundalik vazifalar ── */}
        <section className="mt-6">
          <h3 className={`${sectionTitle} mb-3`}>Kundalik vazifalar</h3>
          <div className="space-y-2.5">
            {missions.map(m => {
              const claimed = claimedMissions.includes(m.key)
              return (
                <div key={m.key} className="flex items-center gap-3 rounded-[14px] p-3" style={WHITE_CARD}>
                  <span
                    className="w-[22px] h-[22px] rounded-[7px] flex items-center justify-center shrink-0"
                    style={m.done ? limeBtn : { background: '#FFFFFF', border: '1px solid #E4E9DD' }}
                  >
                    {m.done && <Check size={13} strokeWidth={3.2} />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-extrabold text-ink truncate">{m.label}</p>
                    <p className="mt-0.5 text-tiny">
                      <span className="num" style={{ color: '#B87A22' }}>+{m.reward} coin</span>
                      <span className="text-ink-4"> · {m.progress}</span>
                    </p>
                  </div>

                  <button
                    disabled={!m.done || claimed}
                    onClick={() => { triggerHaptic('success'); claimMission(m.key, m.reward) }}
                    className="shrink-0 h-[30px] px-3 rounded-full text-[11.5px] font-extrabold transition-opacity"
                    style={claimed ? ghostBtn : m.done ? limeBtn : { ...ghostBtn, opacity: 0.5 }}
                  >
                    {claimed ? 'Olindi' : 'Olish'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 3. Kategoriyalar ── */}
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {categories.map(c => {
              const active = cat === c
              return (
                <button
                  key={c}
                  onClick={() => { triggerHaptic('selection'); setCat(c) }}
                  className="shrink-0 h-[34px] px-4 rounded-full text-[12.5px] font-extrabold transition-colors"
                  style={active ? { background: '#0B6E4F', color: '#FFFFFF' } : { background: '#EFF2EC', color: '#6B7C66' }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 4. Mashq rejimlari ── */}
        <section className="mt-6">
          <h3 className={`${sectionTitle} mb-3`}>Mashq rejimlari</h3>
          <div className="grid grid-cols-2 gap-3">
            {modes.map(m => (
              <button
                key={m.name}
                onClick={m.run}
                className="relative text-left rounded-[16px] p-3.5 active:scale-[0.975] transition-transform"
                style={WHITE_CARD}
              >
                {m.pro && !isPro && (
                  <span
                    className="absolute top-3 right-3 text-tiny uppercase px-2 py-1 rounded-full"
                    style={{ background: '#FCF1DC', color: '#B87A22', border: '1px solid rgba(232,163,61,0.4)' }}
                  >
                    PRO
                  </span>
                )}

                <span
                  className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                  style={{ background: m.tint, color: m.fg }}
                >
                  {m.icon}
                </span>
                <p className="mt-3 text-[14px] font-extrabold text-ink">{m.name}</p>
                <p className="mt-0.5 text-[11.5px] font-medium text-ink-3 leading-snug">{m.desc}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11.5px] font-extrabold num" style={{ color: '#B87A22' }}>
                    <Coins size={12} style={{ color: '#E8A33D' }} /> +{m.coin} coin
                  </span>
                  <span
                    className="flex items-center gap-1 h-[30px] px-3 rounded-full text-[11.5px] font-extrabold"
                    style={limeBtn}
                  >
                    {m.cta} <Play size={10} fill="currentColor" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Boshqichlar yo'li ── */}
        <section className="mt-6">
          <h3 className={`${sectionTitle} mb-3`}>O'sish yo'li</h3>
          <div className="flex items-center gap-1.5" style={WHITE_CARD} >
            {TIERS.map((t, i) => {
              const done = solvedCount >= t.need
              const current = !done && solvedCount >= TIERS[i - 1]?.need
              return (
                <div key={t.name} className="flex-1 flex items-center gap-1.5">
                  <div className="flex-1 py-3 rounded-[12px] text-center"
                    style={{
                      background: done ? '#DDF3DC' : current ? '#FCF1DC' : '#F6F8F3',
                      border: `1px solid ${done ? 'rgba(11,110,79,0.18)' : current ? 'rgba(232,163,61,0.32)' : '#E3E8DE'}`,
                    }}
                  >
                    <p className="text-[11px] font-extrabold" style={{ color: done ? '#0B6E4F' : current ? '#B87A22' : '#9AA995' }}>
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold num" style={{ color: '#9AA995' }}>
                      {done ? '✓' : current ? '→' : '🔒'} {t.need}+
                    </p>
                  </div>
                  {i < TIERS.length - 1 && <ChevronRight size={12} className="text-ink-4 shrink-0" />}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 5. Masalalar ro'yxati ── */}
        <section className="mt-6" id="masala-royxati">
          <div className="flex items-center justify-between mb-3">
            <h3 className={sectionTitle}>Barcha Masalalar</h3>
            <button
              onClick={() => { triggerHaptic('selection'); setCat('Barchasi') }}
              className="flex items-center gap-1.5 h-[32px] px-3 rounded-full text-[12px] font-extrabold text-ink-2 active:scale-95 transition-transform"
              style={{ background: '#FFFFFF', border: '1px solid #E4E9DD' }}
            >
              <ListFilter size={13} /> Filterlar
            </button>
          </div>

          <div className="space-y-2.5">
            {list.map(set => {
              const open = set.free || isPro || unlocked.includes(set.id)
              const done = solvedIn(set)
              const solvedAll = done > 0
              const tint = TOPIC_TINT[set.topic] ?? { bg: '#EFF2EC', fg: '#6B7C66' }
              return (
                <div key={set.id} className="flex items-center gap-3 rounded-[14px] p-3" style={WHITE_CARD}>
                  <span
                    className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: tint.bg, color: tint.fg }}
                  >
                    {open ? TOPIC_ICON[set.topic] ?? <Triangle size={17} /> : <Lock size={16} />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-extrabold text-ink leading-snug">{set.title}</p>
                    <p className="mt-1 text-tiny">
                      <span className="font-extrabold text-ink-3">{set.difficulty}</span>
                      <span className="text-ink-4"> · {set.topic} · {set.grade} · </span>
                      <span className="font-extrabold num" style={{ color: '#B87A22' }}>+{set.coinPerSolve} coin</span>
                      <span className="text-ink-4"> · </span>
                      <span className="font-extrabold num" style={{ color: '#3560C4' }}>+{set.xpPerSolve} XP</span>
                    </p>
                    <p className="mt-1 text-tiny" style={{ color: open ? (solvedAll ? '#0B6E4F' : '#9AA995') : '#B87A22' }}>
                      {open ? (solvedAll ? `✓ ${done}/${set.questions.length} yechilgan` : '● Yangi') : set.unlockPrice ? '🔒 Qulflangan' : '🔒 Pro'}
                    </p>
                  </div>

                  <button
                    onClick={() => openSet(set)}
                    className="shrink-0 h-[34px] px-3.5 rounded-full text-[12px] font-extrabold num active:scale-[0.96] transition-transform"
                    style={!open ? lockedBtn : solvedAll ? ghostBtn : limeBtn}
                  >
                    {!open ? (set.unlockPrice ? `${set.unlockPrice} coin` : 'Pro') : solvedAll ? "Ko'rish" : 'Yechish'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 6. Haftalik reyting ── */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className={sectionTitle}>Bu hafta</h3>
            <button
              onClick={() => { triggerHaptic('light'); navigate('/profile') }}
              className="flex items-center gap-0.5 text-[12px] font-extrabold text-brand active:opacity-60 transition-opacity"
            >
              To'liq reyting <ChevronRight size={13} />
            </button>
          </div>

          <div className="rounded-[16px] p-2" style={WHITE_CARD}>
            {board.slice(0, 3).map((u, i) => (
              <div
                key={u.name}
                className="flex items-center gap-3 px-2 py-2 rounded-[12px]"
                style={u.me ? { background: '#DDF3DC' } : undefined}
              >
                <span className="w-[20px] text-center text-[12px] font-black num" style={{ color: i === 0 ? '#B87A22' : '#9AA995' }}>
                  {i + 1}
                </span>
                <span
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0"
                  style={u.me ? limeBtn : { background: '#EFF2EC', color: '#6B7C66' }}
                >
                  {u.name.slice(0, 1)}
                </span>
                <p className="flex-1 text-[13.5px] font-extrabold text-ink truncate">{u.name}</p>
                <span className="flex items-center gap-1 text-[12.5px] font-extrabold num" style={{ color: '#B87A22' }}>
                  <Coins size={12} style={{ color: '#E8A33D' }} /> {u.coin.toLocaleString('en-US')}
                </span>
              </div>
            ))}

            {board.findIndex(u => u.me) > 2 && (
              <div className="flex items-center gap-3 px-2 py-2 mt-1 rounded-[12px]" style={{ background: '#DDF3DC' }}>
                <span className="w-[20px] text-center text-[12px] font-black num text-brand">
                  {board.findIndex(u => u.me) + 1}
                </span>
                <span className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0" style={limeBtn}>
                  <span className="text-[12px] font-extrabold">S</span>
                </span>
                <p className="flex-1 text-[13.5px] font-extrabold text-ink">Siz</p>
                <span className="flex items-center gap-1 text-[12.5px] font-extrabold num" style={{ color: '#B87A22' }}>
                  <Coins size={12} style={{ color: '#E8A33D' }} /> {coin.toLocaleString('en-US')}
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProblemsScreen
