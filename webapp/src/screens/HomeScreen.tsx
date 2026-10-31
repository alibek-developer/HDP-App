import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell, ChevronRight, Coins, Flame, Lock, Play, Sigma, Swords, Triangle, Zap,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'

const ease = [0.22, 1, 0.36, 1] as const

const Reveal = ({ delay, children }: { delay: number; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease }}
  >
    {children}
  </motion.div>
)

const sectionTitle = 'text-[17px] font-extrabold text-ink'
const seeAll = 'flex items-center gap-0.5 text-[12px] font-extrabold text-brand active:opacity-60 transition-opacity'

const WHITE_CARD = {
  background: '#FFFFFF',
  border: '1px solid #E3E8DE',
  boxShadow: '0 2px 10px rgba(28,50,20,0.04)',
}

/* Kurslar — palitramizning ton zinapoyasi: emerald → siyoh → leaf → lime */
const COURSES = [
  {
    name: 'Algebra-1',
    bg: 'linear-gradient(150deg, #1B9A6B 0%, #0B6E4F 100%)',
    fg: '#FFFFFF',
    shadow: '0 8px 20px rgba(11,110,79,0.16)',
  },
  {
    name: 'Geometriya',
    bg: 'linear-gradient(150deg, #33452F 0%, #0E1A12 100%)',
    fg: '#FFFFFF',
    shadow: '0 8px 20px rgba(14,26,18,0.16)',
  },
  {
    name: 'Algebra-2',
    bg: 'linear-gradient(150deg, #4CC16F 0%, #1B9A6B 100%)',
    fg: '#FFFFFF',
    shadow: '0 8px 20px rgba(76,193,111,0.18)',
  },
  {
    name: 'Stereometriya',
    bg: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
    fg: '#1C3214',
    shadow: '0 8px 20px rgba(95,175,34,0.26)',
  },
]

const QUICK = [
  {
    icon: <Swords size={18} />,
    iconBg: '#DDF3DC',
    iconFg: '#0B6E4F',
    name: 'Blitz Duel',
    desc: '1v1 · 3 daqiqa',
    coin: 30,
    to: '/blitz',
  },
  {
    icon: <Flame size={18} />,
    iconBg: '#FCF1DC',
    iconFg: '#E8A33D',
    name: 'Streak Seriya',
    desc: '2x bonus · 10 ta',
    coin: 100,
    to: '/problems',
  },
]

type Row = {
  icon: React.ReactNode
  iconBg: string
  iconFg: string
  title: string
  level: string
  cat: string
  coin: number
  xp: number | null
  cta: string
  to: string
  kind: 'primary' | 'ghost' | 'locked'
}

const CTA_STYLE: Record<Row['kind'], React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
    color: '#1C3214',
    boxShadow: '0 6px 14px rgba(95,175,34,0.32), inset 0 1px 0 rgba(255,255,255,0.55)',
  },
  ghost: { background: '#FFFFFF', color: '#33452F', border: '1px solid #E4E9DD' },
  locked: {
    background: 'linear-gradient(150deg, #F6D8A6 0%, #E8A33D 100%)',
    color: '#0E1A12',
    boxShadow: '0 6px 14px rgba(232,163,61,0.28), inset 0 1px 0 rgba(255,255,255,0.5)',
  },
}

const PROBLEMS: Row[] = [
  {
    icon: <Sigma size={17} />,
    iconBg: '#DDF3DC',
    iconFg: '#0B6E4F',
    title: 'Viyet teoremasi',
    level: 'Oson',
    cat: 'Algebra',
    coin: 15,
    xp: 25,
    cta: 'Yechish',
    to: '/problems/ps-eq',
    kind: 'primary',
  },
  {
    icon: <Triangle size={17} />,
    iconBg: '#EFF2EC',
    iconFg: '#6B7C66',
    title: 'Uchburchak medianasi',
    level: "O'rta",
    cat: 'Geometriya',
    coin: 25,
    xp: 40,
    cta: "Ko'rish",
    to: '/problems/ps-geo',
    kind: 'ghost',
  },
  {
    icon: <Lock size={16} />,
    iconBg: '#FCF1DC',
    iconFg: '#E8A33D',
    title: 'Trigonometrik tengsizliklar',
    level: 'Qiyin',
    cat: 'IMO',
    coin: 60,
    xp: null,
    cta: '200 coin',
    to: '/shop',
    kind: 'locked',
  },
]

/** Kunlik masala — yarim tungi yangilanishgacha qolgan vaqt */
const leftUntilMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

const pad = (n: number) => String(n).padStart(2, '0')

const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

const HomeScreen = () => {
  const navigate = useNavigate()

  const name = useApp(s => s.name)
  const coin = useApp(s => s.coin)
  const xp = useApp(s => s.xp)

  const [remain, setRemain] = useState(leftUntilMidnight)
  useEffect(() => {
    const t = setInterval(() => setRemain(leftUntilMidnight()), 1000)
    return () => clearInterval(t)
  }, [])

  const go = (path: string) => {
    triggerHaptic('medium')
    navigate(path)
  }

  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans safe-bottom select-none"
      style={{ background: 'linear-gradient(180deg, #CDE9AE 0%, #E6F5D2 40%, #F7FCED 76%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-[300px] grid-paper opacity-60 pointer-events-none" />

      <div className="relative z-10 px-5 pt-0">
        {/* ── 1. Header ── */}
        <Reveal delay={0}>
          <header className="safe-top flex items-center justify-between">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/profile') }}
              className="flex items-center gap-2 active:opacity-70 transition-opacity"
            >
              <span
                className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 60%, #5FAF22 100%)',
                  boxShadow: '0 6px 14px rgba(95,175,34,0.34), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
              >
                <span className="font-serif text-[15px] leading-none text-ink-on-lime">Σ</span>
              </span>
              <span className="font-serif text-[19px] leading-none text-brand-deep">HDP Academy</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => triggerHaptic('light')}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
                style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(28,50,20,0.08)' }}
                aria-label="Bildirishnomalar"
              >
                <Bell size={18} className="text-ink-2" />
              </button>
              <button
                onClick={() => go('/profile')}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[13px] font-extrabold active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
                  color: '#1C3214',
                  boxShadow: '0 6px 16px rgba(95,175,34,0.32), inset 0 1px 0 rgba(255,255,255,0.55)',
                }}
                aria-label="Profil"
              >
                {initials}
              </button>
            </div>
          </header>

          {/* Coin / XP pill'lari */}
          <div className="flex items-center gap-2.5 mt-4">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/shop') }}
              className="flex items-center gap-1.5 h-[32px] px-3 rounded-full active:scale-[0.97] transition-transform"
              style={{ background: '#FCF1DC', border: '1px solid rgba(232,163,61,0.38)' }}
            >
              <Coins size={14} style={{ color: '#E8A33D' }} />
              <span className="num text-[12.5px] font-extrabold" style={{ color: '#B87A22' }}>
                {coin.toLocaleString('en-US')} Coin
              </span>
            </button>

            <div
              className="flex items-center gap-1.5 h-[32px] px-3 rounded-full"
              style={{ background: '#E5ECFE', border: '1px solid rgba(76,125,240,0.30)' }}
            >
              <Zap size={14} style={{ color: '#4C7DF0' }} />
              <span className="num text-[12.5px] font-extrabold" style={{ color: '#3560C4' }}>
                {xp.toLocaleString('en-US')} XP
              </span>
            </div>
          </div>
        </Reveal>

        {/* ── 2. Kunlik mega masala ── */}
        <Reveal delay={0.06}>
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
                  style={{ background: 'rgba(255,255,255,0.14)', color: '#CDE9AE', border: '1px solid rgba(205,233,174,0.22)' }}
                >
                  Kunlik masala
                </span>
                <span className="num text-[12.5px] font-extrabold text-leaf-bright">{clock(remain)}</span>
              </div>

              <p className="mt-3.5 text-[11px] font-extrabold uppercase tracking-[0.09em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                DTM / IMO
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold text-white leading-snug">Parametrli tenglama</h2>
              <p className="mt-1.5 font-mono text-[13px] num text-leaf-bright">
                f(x) = x² − 2ax + a + 6 = 0
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 h-[28px] px-2.5 rounded-full text-[11.5px] font-extrabold num"
                    style={{ background: 'rgba(232,163,61,0.18)', color: '#F3C88A', border: '1px solid rgba(232,163,61,0.42)' }}
                  >
                    <Coins size={12} /> +50 coin
                  </span>
                  <span
                    className="flex items-center gap-1 h-[28px] px-2.5 rounded-full text-[11.5px] font-extrabold num"
                    style={{ background: 'rgba(126,211,33,0.16)', color: '#AEEA5C', border: '1px solid rgba(126,211,33,0.40)' }}
                  >
                    <Zap size={12} /> +80 XP
                  </span>
                </div>

                <button
                  onClick={() => go('/problems')}
                  className="flex items-center gap-1 h-[40px] px-4 rounded-full text-[13px] font-extrabold text-ink active:scale-[0.97] transition-transform shrink-0"
                  style={{
                    background: '#FFFFFF',
                    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), 0 8px 18px rgba(6,63,46,0.30)',
                  }}
                >
                  Yechish <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 3. Kurslar (2x2) ── */}
        <Reveal delay={0.12}>
          <section className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <h3 className={sectionTitle}>Kurslar</h3>
              <button onClick={() => go('/courses')} className={seeAll}>
                Hammasi <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {COURSES.map(c => (
                <button
                  key={c.name}
                  onClick={() => go('/courses')}
                  className="text-left rounded-[16px] overflow-hidden active:scale-[0.975] transition-transform"
                  style={{ ...WHITE_CARD, boxShadow: c.shadow }}
                >
                  <div className="h-[68px] px-3 flex items-end pb-2" style={{ background: c.bg }}>
                    <span className="text-[17px] font-extrabold leading-none" style={{ color: c.fg }}>
                      {c.name}
                    </span>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-body-sm font-semibold text-ink truncate">{c.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 4. Tezkor mashqlar ── */}
        <Reveal delay={0.18}>
          <section className="mt-7">
            <h3 className={`${sectionTitle} mb-3`}>Tezkor Mashqlar</h3>

            <div className="grid grid-cols-2 gap-3">
              {QUICK.map(q => (
                <button
                  key={q.name}
                  onClick={() => go(q.to)}
                  className="text-left rounded-[16px] p-3.5 active:scale-[0.975] transition-transform"
                  style={WHITE_CARD}
                >
                  <span
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                    style={{ background: q.iconBg, color: q.iconFg }}
                  >
                    {q.icon}
                  </span>
                  <p className="mt-3 text-[14px] font-extrabold text-ink">{q.name}</p>
                  <p className="mt-0.5 text-[11.5px] font-medium text-ink-3">{q.desc}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11.5px] font-extrabold num" style={{ color: '#B87A22' }}>
                      <Coins size={12} style={{ color: '#E8A33D' }} /> +{q.coin} coin
                    </span>
                    <span
                      className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(150deg, #9BE04B 0%, #5FAF22 100%)',
                        boxShadow: '0 6px 14px rgba(95,175,34,0.34), inset 0 1px 0 rgba(255,255,255,0.55)',
                        color: '#1C3214',
                      }}
                    >
                      <Play size={13} fill="currentColor" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 5. Mavzuli masalalar ── */}
        <Reveal delay={0.24}>
          <section className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <h3 className={sectionTitle}>Masalalar</h3>
              <button onClick={() => go('/problems')} className={seeAll}>
                Hammasi <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {PROBLEMS.map(p => (
                <div
                  key={p.title}
                  className="flex items-center gap-3 rounded-[14px] p-3"
                  style={WHITE_CARD}
                >
                  <span
                    className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: p.iconBg, color: p.iconFg }}
                  >
                    {p.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-extrabold text-ink leading-snug">{p.title}</p>
                    <p className="mt-1 text-tiny">
                      <span className="font-extrabold text-ink-3">{p.level}</span>
                      <span className="text-ink-4"> · {p.cat} · </span>
                      <span className="font-extrabold num" style={{ color: '#B87A22' }}>+{p.coin} coin</span>
                      {p.xp !== null && (
                        <>
                          <span className="text-ink-4"> · </span>
                          <span className="font-extrabold num" style={{ color: '#3560C4' }}>+{p.xp} XP</span>
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => go(p.to)}
                    className="shrink-0 flex items-center gap-1 h-[34px] px-3.5 rounded-full text-[12px] font-extrabold num active:scale-[0.96] transition-transform"
                    style={CTA_STYLE[p.kind]}
                  >
                    {p.kind === 'locked' && <Lock size={11} />}
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}

export default HomeScreen
