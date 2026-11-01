import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Check, ChevronRight, ClipboardList, Clock, Coins, Compass, Flame,
  Infinity as InfinityIcon, Sigma, Triangle, Trophy, Zap,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBackRoot } from '../lib/nav'
import { EXAM_SET, MISSION_REWARDS, PROBLEM_SETS, dailyProblem, DAILY_BONUS, type ProblemSet } from '../data/content'
import { useApp } from '../store/useStore'
import { AMBER_BTN, BODY, CARD, INK_BTN, LIME_BTN, OUT_BTN } from '../styles/solver'

/**
 * Masalalar — mintaqaviy "davotar" tili.
 * Home doira/pill morfologiyasida ishlaydi; bu ekran ataylab burchakli:
 * kvadrat chip, chap reysli qatorlar, ledger ustunlari va ticket-karta.
 */

const DIFF_RAIL: Record<string, string> = {
  oson: '#7ED321',
  "o'rta": '#E8A33D',
  qiyin: '#D9534F',
}
const TOPIC_GLYPH: Record<string, React.ReactNode> = {
  Algebra: <Sigma size={13} />,
  Geometriya: <Triangle size={13} />,
  Trigonometriya: <Compass size={13} />,
  Analiz: <InfinityIcon size={13} />,
  Olimpiada: <Trophy size={13} />,
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

const ProblemsScreen = () => {
  const navigate = useNavigate()
  useBackRoot()

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
  const dailyBonusOn = useApp(s => s.dailyBonusOn)

  const [cat, setCat] = useState('Barchasi')
  const [remain, setRemain] = useState(msToMidnight)

  useEffect(() => {
    rollDay()
    const t = setInterval(() => setRemain(msToMidnight()), 1000)
    return () => clearInterval(t)
  }, [rollDay])

  const daily = useMemo(() => dailyProblem(), [])
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
      reward: MISSION_REWARDS.solve5,
      ratio: Math.min(solvedToday, 5) / 5,
      detail: `${Math.min(solvedToday, 5)}/5`,
    },
    {
      key: 'streak',
      label: "Streak'ni davom ettir",
      reward: MISSION_REWARDS.streak,
      ratio: streak > 0 ? 1 : 0,
      detail: streak > 0 ? `${streak} kun` : '0 kun',
    },
    {
      key: 'olymp',
      label: 'Bitta olimpiada masalasi yech',
      reward: MISSION_REWARDS.olymp,
      ratio: Math.min(olympToday, 1) / 1,
      detail: `${Math.min(olympToday, 1)}/1`,
    },
  ]

  const modes = [
    {
      key: 'blitz',
      icon: <Zap size={17} />,
      tile: '#FCF1DC',
      fg: '#B87A22',
      name: 'Tezkor Blitz',
      desc: "5 daqiqada 10 ta masala",
      coin: 50,
      pro: false,
      run: () => { triggerHaptic('medium'); navigate('/blitz') },
    },
    {
      key: 'streak',
      icon: <Flame size={17} />,
      tile: '#FDE8E4',
      fg: '#C2410C',
      name: 'Streak Seriya',
      desc: "Ketma-ket 10 ta — 2x bonus",
      coin: 100,
      pro: false,
      run: () => { triggerHaptic('medium'); navigate('/problems/ps-streak') },
    },
    {
      key: 'topic',
      icon: <ClipboardList size={17} />,
      tile: '#DDF3DC',
      fg: '#0B6E4F',
      name: "Mavzu bo'yicha",
      desc: "O'zingiz mavzuni tanlang",
      coin: 25,
      pro: false,
      run: () => {
        triggerHaptic('selection')
        setCat('Barchasi')
        document.getElementById('masala-royxati')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
    },
    {
      key: 'exam',
      icon: <Trophy size={17} />,
      tile: '#E5ECFE',
      fg: '#3560C4',
      name: 'Sinov',
      desc: `${EXAM_SET.questions.length} ta savollik to'liq test`,
      coin: 150,
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

  const meRank = board.findIndex(u => u.me) + 1

  return (
    <div className="min-h-screen pb-28 select-none font-sans" style={{ background: BODY }}>

      {/* ── 1. Header: siyoh varaq + ledger ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%)',
          borderRadius: '0 0 26px 26px',
          boxShadow: '0 16px 32px rgba(14,26,18,0.20)',
        }}
      >
        <div className="relative z-10 px-5 safe-top">
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <span
                className="w-[38px] h-[38px] flex items-center justify-center text-[15px] font-extrabold"
                style={{ background: 'rgba(205,233,174,0.12)', border: '1px solid rgba(205,233,174,0.22)', borderRadius: 12, color: '#9BE04B', fontFamily: 'serif' }}
              >
                <Sigma size={18} />
              </span>
              <div>
                <h1 className="text-[21px] font-extrabold tracking-[-0.028em]" style={{ color: '#F7FCED' }}>
                  Masalalar
                </h1>
                <p className="text-tiny uppercase tracking-[0.12em]" style={{ color: 'rgba(205,233,174,0.5)' }}>
                  Yech · mustahkamla · coin yig'
                </p>
              </div>
            </div>

            <button
              onClick={() => { triggerHaptic('light'); navigate('/shop') }}
              className="flex items-center gap-1.5 h-[34px] px-3 active:scale-[0.97] transition-transform"
              style={{ background: 'rgba(232,163,61,0.14)', border: '1px solid rgba(232,163,61,0.38)', borderRadius: 12 }}
            >
              <Coins size={14} style={{ color: '#F3C88A' }} />
              <span className="num text-[13px] font-extrabold" style={{ color: '#F3C88A' }}>
                {coin.toLocaleString('en-US')}
              </span>
            </button>
          </div>

          <div className="mt-4 flex items-stretch">
            {[
              { v: `${streak}`, u: 'kunlik streak', icon: <Flame size={12} />, c: '#F3C88A' },
              { v: `${solvedCount}`, u: 'ta yechilgan', icon: <Check size={12} />, c: '#9BE04B' },
              { v: `${solvedToday}`, u: 'bugun', icon: <Zap size={12} />, c: '#CDE9AE' },
            ].map((cell, i) => (
              <div key={cell.u} className="flex-1 flex items-center">
                {i > 0 && <span className="w-px self-stretch" style={{ background: 'rgba(205,233,174,0.14)' }} />}
                <div className="flex-1 px-3">
                  <p className="num text-[20px] font-extrabold leading-none" style={{ color: '#F7FCED' }}>{cell.v}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: 'rgba(205,233,174,0.55)' }}>
                    <span style={{ color: cell.c }}>{cell.icon}</span>{cell.u}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-4" />
      </div>

      <div className="px-5">
        {/* ── 2. Kunlik mega masala — ticket ── */}
        <section className="relative -mt-1">
          <div className="relative" style={{ ...CARD, borderRadius: 16, boxShadow: '0 8px 22px rgba(14,26,18,0.08)' }}>
            <span
              className="absolute left-0 top-0 bottom-0"
              style={{ width: 6, borderRadius: '16px 0 0 16px', background: 'linear-gradient(180deg, #9BE04B 0%, #5FAF22 100%)' }}
            />
            <div className="pl-5 pr-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-tiny uppercase tracking-[0.14em] font-extrabold" style={{ color: '#6B7C66' }}>
                  Kunlik Mega Masala
                </p>
                <span
                  className="num flex items-center gap-1 h-[26px] px-2 text-[12px] font-extrabold"
                  style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 8, color: '#33452F' }}
                >
                  <Clock size={12} style={{ color: '#9AA995' }} />
                  {clock(remain)}
                </span>
              </div>

              <p className="mt-3 text-[15.5px] font-extrabold leading-tight text-ink">{daily.set.title}</p>
              <p className="mt-1 text-[11.5px] font-semibold text-ink-4">
                {daily.set.topic} · {daily.set.grade} · har kuni yangilanadi
              </p>

              <div
                className="mt-3 px-3 py-3"
                style={{ background: '#F6F8F3', border: '1px dashed #CFD9C6', borderRadius: 10 }}
              >
                <p className="font-mono text-[13px] leading-snug text-ink">{daily.question.prompt}</p>
              </div>

              <div className="relative mt-4" style={{ borderTop: '1px dashed #CFD9C6' }}>
                <span className="absolute -left-[28px] -top-[8px] w-4 h-4 rounded-full" style={{ background: BODY }} />
                <span className="absolute -right-[24px] -top-[8px] w-4 h-4 rounded-full" style={{ background: BODY }} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center">
                  <div className="pr-3">
                    <p className="num text-[15px] font-extrabold leading-none" style={{ color: '#B87A22' }}>
                      +{DAILY_BONUS.coin}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>coin</p>
                  </div>
                  <span className="w-px h-[26px]" style={{ background: '#E1E7DA' }} />
                  <div className="pl-3">
                    <p className="num text-[15px] font-extrabold leading-none" style={{ color: '#3560C4' }}>
                      +{DAILY_BONUS.xp}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase" style={{ color: '#9AA995' }}>xp</p>
                  </div>
                  {dailyClaimed && (
                    <span className="ml-3 text-[10.5px] font-bold uppercase" style={{ color: '#9AA995' }}>
                      bugun olindi
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openSet(daily.set)}
                  className="shrink-0 flex items-center gap-1.5 h-[42px] px-4 text-[13px] font-extrabold active:scale-[0.97] transition-transform"
                  style={LIME_BTN}
                >
                  Yechish <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Kategoriyalar ── */}
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {categories.map(c => {
              const active = cat === c
              const count = c === 'Barchasi' ? PROBLEM_SETS.length : PROBLEM_SETS.filter(s => s.topic === c).length
              return (
                <button
                  key={c}
                  onClick={() => { triggerHaptic('selection'); setCat(c) }}
                  className="shrink-0 flex items-center gap-1.5 h-[38px] px-3.5 text-[12.5px] font-extrabold transition-colors"
                  style={active ? INK_BTN : { background: '#FFFFFF', color: '#6B7C66', border: '1px solid #E1E7DA', borderRadius: 12 }}
                >
                  {c}
                  <span className="num text-[10.5px] font-bold" style={{ opacity: 0.55 }}>{count}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 4. Mashq rejimlari — birlashgan panel ── */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Mashq rejimlari</h3>
            <span className="text-[11px] font-bold" style={{ color: '#9AA995' }}>4 ta</span>
          </div>

          <div className="overflow-hidden" style={CARD}>
            <div className="grid grid-cols-2">
              {modes.map((m, i) => {
                const proLocked = m.pro && !isPro
                return (
                  <button
                    key={m.key}
                    onClick={m.run}
                    className="relative text-left p-3.5 transition-colors active:bg-[#F3F7EE]"
                    style={{
                      borderRight: i % 2 === 0 ? '1px solid #EDF1E7' : undefined,
                      borderTop: i > 1 ? '1px solid #EDF1E7' : undefined,
                      background: proLocked ? '#FBFCF8' : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="w-[34px] h-[34px] flex items-center justify-center"
                        style={{ background: m.tile, color: m.fg, borderRadius: 10 }}
                      >
                        {m.icon}
                      </span>
                      {proLocked && (
                        <span
                          className="text-[9.5px] font-black uppercase tracking-[0.08em] px-1.5 py-1"
                          style={{ background: '#FCF1DC', color: '#B87A22', border: '1px solid rgba(232,163,61,0.4)', borderRadius: 6 }}
                        >
                          Pro
                        </span>
                      )}
                    </div>

                    <p className="mt-2.5 text-[13.5px] font-extrabold leading-tight text-ink">{m.name}</p>
                    <p className="mt-1 text-[11px] font-medium leading-snug text-ink-3">{m.desc}</p>

                    <p className="num mt-2 text-[12px] font-extrabold" style={{ color: '#B87A22' }}>
                      +{m.coin} coin
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 5. O'sish yo'li — segment o'lchagich ── */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">O'sish yo'li</h3>
            <span className="num text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>{solvedCount} ta yechildi</span>
          </div>

          <div style={CARD} className="px-3.5 py-4">
            <div className="flex gap-1.5">
              {TIERS.map(t => {
                const done = solvedCount >= t.need
                const current = !done && solvedCount >= TIERS[TIERS.indexOf(t) - 1]?.need
                return (
                  <span key={t.name} className="flex-1 h-[7px]" style={{
                    borderRadius: 4,
                    background: done
                      ? 'linear-gradient(90deg, #9BE04B, #5FAF22)'
                      : current ? 'linear-gradient(90deg, #F6D8A6, #E8A33D)' : '#EAEEE3',
                  }} />
                )
              })}
            </div>
            <div className="mt-3 flex gap-1.5">
              {TIERS.map((t, i) => {
                const done = solvedCount >= t.need
                const current = !done && solvedCount >= TIERS[i - 1]?.need
                return (
                  <div key={t.name} className="flex-1">
                    <p className="text-[11px] font-extrabold leading-tight"
                      style={{ color: done ? '#0B6E4F' : current ? '#B87A22' : '#9AA995' }}>{t.name}</p>
                    <p className="num mt-0.5 text-[10px] font-bold" style={{ color: '#9AA995' }}>
                      {done ? 'ochiq' : `${t.need}+ masala`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 6. Kundalik vazifalar — guruhlangan davotar ── */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Kundalik vazifalar</h3>
            <span className="text-[11px] font-bold" style={{ color: '#9AA995' }}>tungi 00:00 gacha</span>
          </div>

          <div className="overflow-hidden" style={CARD}>
            {missions.map((m, i) => {
              const claimed = claimedMissions.includes(m.key)
              return (
                <div key={m.key} className="flex items-center gap-3 px-3.5 py-3"
                  style={i > 0 ? { borderTop: '1px solid #EDF1E7' } : undefined}>
                  <span
                    className="w-[22px] h-[22px] flex items-center justify-center shrink-0"
                    style={m.ratio >= 1 ? LIME_BTN : { background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 7 }}
                  >
                    {m.ratio >= 1 && <Check size={13} strokeWidth={3.2} />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-extrabold text-ink">{m.label}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="flex-1 h-[5px] overflow-hidden" style={{ background: '#EAEEE3', borderRadius: 3 }}>
                        <span className="block h-full" style={{
                          width: `${m.ratio * 100}%`,
                          borderRadius: 3,
                          background: m.ratio >= 1 ? '#5FAF22' : '#E8A33D',
                          transition: 'width 0.4s ease',
                        }} />
                      </span>
                      <span className="num text-[10.5px] font-bold" style={{ color: '#6B7C66' }}>{m.detail}</span>
                      <span className="num text-[10.5px] font-extrabold" style={{ color: '#B87A22' }}>+{m.reward}</span>
                    </div>
                  </div>

                  <button
                    disabled={m.ratio < 1 || claimed}
                    onClick={() => { triggerHaptic('success'); claimMission(m.key, m.reward) }}
                    className="shrink-0 h-[32px] px-3 text-[11.5px] font-extrabold transition-opacity"
                    style={claimed ? { ...OUT_BTN, color: '#9AA995' } : m.ratio >= 1 ? LIME_BTN : { ...OUT_BTN, opacity: 0.5 }}
                  >
                    {claimed ? 'Olindi' : 'Olish'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 7. Barcha masalalar — reysli qatorlar ── */}
        <section className="mt-6" id="masala-royxati">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Barcha Masalalar</h3>
            <span className="num text-[11.5px] font-bold" style={{ color: '#6B7C66' }}>{list.length} ta to'plam</span>
          </div>

          <div className="space-y-3">
            {list.map(set => {
              const open = set.free || isPro || unlocked.includes(set.id)
              const done = solvedIn(set)
              const partial = done > 0 && done < set.questions.length
              return (
                <div key={set.id} className="relative overflow-hidden" style={CARD}>
                  <span className="absolute left-0 top-0 bottom-0"
                    style={{ width: 4, background: DIFF_RAIL[set.difficulty] ?? '#7ED321' }} />
                  <div className="pl-4 pr-3.5 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[14.5px] font-extrabold text-ink leading-snug">{set.title}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: '#6B7C66' }}>
                          <span style={{ color: '#9AA995' }}>{TOPIC_GLYPH[set.topic]}</span>
                          {set.difficulty} · {set.topic} · {set.grade}
                        </p>
                      </div>
                      <button
                        onClick={() => openSet(set)}
                        className="shrink-0 h-[36px] px-3.5 text-[12px] font-extrabold num active:scale-[0.96] transition-transform"
                        style={!open ? AMBER_BTN : done && !partial ? OUT_BTN : LIME_BTN}
                      >
                        {!open ? (set.unlockPrice ? `${set.unlockPrice} coin` : 'Pro') : done ? "Ko'rish" : 'Yechish'}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="num text-[11.5px] font-extrabold" style={{ color: '#B87A22' }}>
                        +{set.coinPerSolve} coin
                      </span>
                      <span className="num text-[11.5px] font-extrabold" style={{ color: '#3560C4' }}>
                        +{set.xpPerSolve} XP
                      </span>
                      <span className="flex-1 h-[5px] overflow-hidden" style={{ background: '#EAEEE3', borderRadius: 3 }}>
                        <span className="block h-full" style={{
                          width: `${(done / set.questions.length) * 100}%`,
                          borderRadius: 3,
                          background: done === set.questions.length ? '#5FAF22' : '#0B6E4F',
                          transition: 'width 0.4s ease',
                        }} />
                      </span>
                      <span className="num text-[11px] font-bold" style={{ color: open ? '#6B7C66' : '#B87A22' }}>
                        {open ? `${done}/${set.questions.length}` : 'qulflangan'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Formulalar qo'llanmasi ── */}
        <section className="mt-5">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/formulas') }}
            className="w-full flex items-center gap-3 px-4 py-3.5 active:scale-[0.985] transition-transform"
            style={{ ...CARD, border: '1px dashed #CFD9C6' }}
          >
            <span className="w-[34px] h-[34px] flex items-center justify-center shrink-0"
              style={{ background: '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 10, color: '#0B6E4F' }}>
              <Sigma size={16} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[13.5px] font-extrabold text-ink">Formulalar qo'llanmasi</span>
              <span className="block mt-0.5 text-[11.5px] font-medium" style={{ color: '#6B7C66' }}>
                Yechimda kerak bo'ladigan ifodalar — bir bosishda
              </span>
            </span>
            <ChevronRight size={16} style={{ color: '#9AA995' }} />
          </button>
        </section>

        {/* ── 8. Haftalik reyting — ixcham ro'yxat ── */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[17px] font-extrabold text-ink">Bu hafta</h3>
            <button
              onClick={() => { triggerHaptic('light'); navigate('/profile') }}
              className="flex items-center gap-0.5 text-[12px] font-extrabold text-brand active:opacity-60 transition-opacity"
            >
              To'liq reyting <ChevronRight size={13} />
            </button>
          </div>

          <div className="overflow-hidden" style={CARD}>
            {board.slice(0, 3).map((u, i) => (
              <div key={u.name} className="flex items-center gap-3 px-3.5 py-2.5"
                style={i > 0 ? { borderTop: '1px solid #EDF1E7' } : undefined}>
                <span className="num w-[14px] text-[12px] font-black"
                  style={{ color: i === 0 ? '#B87A22' : '#9AA995' }}>{i + 1}</span>
                <span className="w-[26px] h-[26px] flex items-center justify-center text-[11.5px] font-extrabold shrink-0"
                  style={u.me
                    ? { ...LIME_BTN, borderRadius: 8 }
                    : { background: i === 0 ? '#FCF1DC' : '#F6F8F3', border: '1px solid #E1E7DA', borderRadius: 8, color: i === 0 ? '#B87A22' : '#6B7C66' }}>
                  {u.name.slice(0, 1)}
                </span>
                <p className="flex-1 text-[13px] font-extrabold text-ink truncate">{u.name}</p>
                <p className="num text-[12.5px] font-extrabold shrink-0" style={{ color: '#B87A22' }}>
                  {u.coin.toLocaleString('en-US')}
                </p>
              </div>
            ))}

            {meRank > 3 && (
              <div className="relative flex items-center gap-3 px-3.5 py-2.5" style={{ borderTop: '1px solid #EDF1E7', background: '#F6F8F3' }}>
                <span className="absolute left-0 top-0 bottom-0" style={{ width: 3, background: '#7ED321' }} />
                <span className="num w-[14px] text-[12px] font-black" style={{ color: '#0B6E4F' }}>{meRank}</span>
                <span className="w-[26px] h-[26px] flex items-center justify-center text-[11.5px] font-extrabold shrink-0"
                  style={{ ...LIME_BTN, borderRadius: 8 }}>S</span>
                <p className="flex-1 text-[13px] font-extrabold text-ink">Siz</p>
                <p className="num text-[12.5px] font-extrabold shrink-0" style={{ color: '#B87A22' }}>
                  {coin.toLocaleString('en-US')}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProblemsScreen
