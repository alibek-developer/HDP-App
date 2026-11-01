import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check, ChevronDown, ChevronRight, Coins, Diamond, Flag, Lightbulb, Lock,
  SkipForward, TrendingUp, User, Zap,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'
import Sheet from './Sheet'
import {
  BOOST_CARD, CONSUMABLES, DAILY_BONUS, MISSION_REWARDS, PROBLEM_SETS,
  PRO_TRIAL, SET_COIN_RANGE, TEST_REWARD, UNLOCKABLE_SETS,
} from '../data/content'

/**
 * Do'konning «o'qish» javoni — tovar ostida yig'ilgan, lekin testda haqiqatan
 * ishlatiladigan narsalar: maslahat, o'tkazish, 2x karta, coin bilan ochiladigan
 * to'plamlar va Pro sinovi. Yig'ilgan holda ochiladi, chunki birinchi taassurot
 * sovg'a bozoriga tegishli.
 */

type OfferKind = 'set' | 'item' | 'trial'

interface Offer {
  kind: OfferKind
  id: string
  title: string
  desc: string
  cost: number
  note?: string
  icon: 'hint' | 'skip' | 'boost' | 'set' | 'pro'
}

/** 100 tadan arzon narsa — bir bosishda; yuqorisi — chek varaqasida */
const DIRECT_LIMIT = 100

const INK = '#0E1A12'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_BG = '#FEF3C7'
const AMBER_INK = '#854D0E'
const GREEN_TILE = '#00A855'

const StudyAids = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [buying, setBuying] = useState<Offer | null>(null)
  const [stamp, setStamp] = useState<string | null>(null)
  const stampTimer = useRef<number | null>(null)

  const coin = useApp(s => s.coin)
  const isPro = useApp(s => s.isPro)
  const unlocked = useApp(s => s.unlocked)
  const inventory = useApp(s => s.inventory)
  const txLog = useApp(s => s.txLog)
  const goalId = useApp(s => s.goalId)
  const boostActive = useApp(s => s.boostActive)
  const unlockSet = useApp(s => s.unlockSet)
  const buyConsumable = useApp(s => s.buyConsumable)
  const buyProTrial = useApp(s => s.buyProTrial)
  const setGoal = useApp(s => s.setGoal)

  const trialOffer: Offer = {
    kind: 'trial', id: PRO_TRIAL.id, title: PRO_TRIAL.title,
    desc: 'Barcha Pro darslar va umumiy sinov', cost: PRO_TRIAL.coin,
    note: 'oyiga bir marta', icon: 'pro',
  }

  const setOffers: Offer[] = UNLOCKABLE_SETS.map(s => ({
    kind: 'set', id: s.id, title: s.title,
    desc: `${s.questions.length} masala · har biri +${s.coinPerSolve} coin`,
    cost: s.unlockPrice ?? 0, note: 'bir marta — abadiy', icon: 'set',
  }))

  const itemOffers: Offer[] = [
    ...CONSUMABLES.map(c => ({
      kind: 'item' as const, id: c.id, title: c.title,
      desc: c.short + ' · ' + c.where.toLowerCase(), cost: c.cost,
      note: `${c.maxHold} tagacha holda`,
      icon: c.kind === 'hint' ? ('hint' as const) : ('skip' as const),
    })),
    {
      kind: 'item' as const, id: BOOST_CARD.id, title: BOOST_CARD.title,
      desc: 'Keyingi seansdagi coinlar ikki barobar', cost: BOOST_CARD.cost,
      note: 'seansda sarflanadi', icon: 'boost' as const,
    },
  ]

  const allOffers = [trialOffer, ...setOffers, ...itemOffers]
  const heldCount = allOffers.length

  const owned = (o: Offer): boolean => {
    if (o.kind === 'set') return isPro || unlocked.includes(o.id)
    if (o.kind === 'trial') return isPro
    return o.id === BOOST_CARD.id && boostActive
  }
  const byPro = (o: Offer) => o.kind === 'set' && isPro && !unlocked.includes(o.id)
  const heldOf = (o: Offer) => inventory[o.id] ?? 0
  const maxOf = (o: Offer) => CONSUMABLES.find(c => c.id === o.id)?.maxHold ?? null
  const fullOf = (o: Offer) => {
    const max = maxOf(o)
    return max !== null && heldOf(o) >= max
  }

  /** eng ko'p to'lovchi ochiq to'plam — «yig'ishga» ketish nuqtasi */
  const earnTarget = (() => {
    const openable = PROBLEM_SETS.filter(s => s.free || isPro || unlocked.includes(s.id))
    const pool = openable.length > 0 ? openable : PROBLEM_SETS.filter(s => s.free)
    return [...pool].sort((a, b) => b.coinPerSolve - a.coinPerSolve)[0]?.id ?? 'ps-trig'
  })()

  const flash = (id: string) => {
    setStamp(id)
    if (stampTimer.current) window.clearTimeout(stampTimer.current)
    stampTimer.current = window.setTimeout(() => setStamp(null), 1400)
  }

  const pay = (o: Offer): boolean => {
    if (o.kind === 'trial') return buyProTrial() === 'ok'
    if (o.kind === 'set') return unlockSet(o.id, o.cost)
    return buyConsumable(o.id)
  }

  const tap = (o: Offer) => {
    if (owned(o)) {
      if (o.kind === 'set') navigate(`/problems/${o.id}`)
      return
    }
    if (fullOf(o)) {
      triggerHaptic('warning')
      return
    }
    if (coin < o.cost) {
      triggerHaptic('light')
      navigate(`/problems/${earnTarget}`)
      return
    }
    if (o.cost > DIRECT_LIMIT) {
      triggerHaptic('medium')
      setBuying(o)
      return
    }
    if (pay(o)) {
      triggerHaptic('success')
      flash(o.id)
    }
  }

  const confirmBuy = () => {
    const o = buying
    setBuying(null)
    if (!o) return
    if (pay(o)) {
      triggerHaptic('success')
      flash(o.id)
    } else {
      triggerHaptic('error')
    }
  }

  const Icon: Record<Offer['icon'], typeof Lightbulb> = {
    hint: Lightbulb, skip: SkipForward, boost: Zap, set: Lock, pro: Diamond,
  }

  const earnings = [
    { v: `+${TEST_REWARD.coin}`, u: 'test — har to\'g\'ri javob' },
    { v: `${SET_COIN_RANGE.min}–${SET_COIN_RANGE.max}`, u: 'masala — 1 yechim' },
    { v: `+${DAILY_BONUS.coin}`, u: 'kunlik mega masala' },
    { v: `${Math.min(...Object.values(MISSION_REWARDS))}–${Math.max(...Object.values(MISSION_REWARDS))}`, u: 'kunlik vazifalar' },
  ]

  const row = (o: Offer, last = false) => {
    const has = owned(o)
    const pro = byPro(o)
    const full = fullOf(o)
    const poor = !has && coin < o.cost
    const held = heldOf(o)
    const max = maxOf(o)
    const Glyph = Icon[o.icon]
    const stamped = stamp === o.id
    const isAmber = o.icon === 'hint' || o.icon === 'skip' || o.icon === 'boost'

    return (
      <div
        key={o.id}
        className="relative flex items-center gap-3"
        style={{ padding: '14px 14px', borderBottom: last ? undefined : `1px solid ${HAIR}` }}
      >
        <AnimatePresence>
          {stamped && (
            <motion.span
              initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 16, stiffness: 320 }}
              className="absolute right-[96px] top-1/2 -translate-y-1/2 z-10 px-2 py-[3px] text-[10px] font-black uppercase tracking-[0.12em]"
              style={{ color: GREEN_TILE, border: `2px solid ${GREEN_TILE}`, borderRadius: 8, background: '#FFFFFF' }}
            >
              olindi
            </motion.span>
          )}
        </AnimatePresence>

        <span
          className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
          style={pro
            ? { background: '#E7F7EE', borderRadius: 10, color: GREEN_TILE }
            : has
              ? { background: GREEN_TILE, borderRadius: 10, color: '#FFFFFF' }
              : isAmber
                ? { background: AMBER_BG, borderRadius: 10, color: AMBER_INK }
                : o.kind === 'trial'
                  ? { background: INK, borderRadius: 10, color: '#9BE04B' }
                  : { background: '#F1F4F0', borderRadius: 10, color: GRAY }}
        >
          {pro ? <Diamond size={19} /> : has ? <Check size={19} strokeWidth={2.6} /> : <Glyph size={19} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-extrabold truncate" style={{ color: INK }}>{o.title}</p>
            {max !== null && (
              <span className="num shrink-0 px-1.5 py-[1px] text-[11px] font-bold"
                style={{ color: GRAY, border: `1px solid ${HAIR}`, borderRadius: 100 }}>
                {held}/{max}
              </span>
            )}
          </div>
          <p className="mt-[3px] text-[12px] leading-[1.35]" style={{ color: GRAY }}>{o.desc}</p>
        </div>

        {!has && (
          <button
            onClick={() => { triggerHaptic('selection'); setGoal(goalId === o.id ? null : o.id) }}
            aria-label="Maqsad qilish"
            className="w-[30px] h-[30px] flex items-center justify-center shrink-0"
            style={{ color: goalId === o.id ? GREEN_TILE : '#9AA995' }}
          >
            <Flag size={15} strokeWidth={goalId === o.id ? 2.6 : 2} />
          </button>
        )}

        <button
          onClick={() => tap(o)}
          className="shrink-0 flex items-center gap-1.5 h-[32px] px-3 text-[12px] font-extrabold active:scale-[0.97] transition-transform"
          style={{ borderRadius: 100, ...pillStyle(has, full, poor) }}
        >
          {has ? (
            <>
              {o.kind === 'trial' ? 'faol' : 'yechish'}
              {o.kind === 'set' && <ChevronRight size={13} />}
            </>
          ) : full ? (
            'to\'la'
          ) : poor ? (
            <>
              <TrendingUp size={12} />+{(o.cost - coin).toLocaleString()}
            </>
          ) : (
            <>
              <Coins size={12} style={{ color: AMBER_INK }} />
              <span className="num">{o.cost}</span>
            </>
          )}
        </button>
      </div>
    )
  }

  const group = (label: string, hint: string, offers: Offer[]) => (
    <>
      <div className="flex items-center justify-between" style={{ padding: '10px 14px', background: '#FAFBF8', borderBottom: `1px solid ${HAIR}` }}>
        <p className="text-[10.5px] font-extrabold" style={{ color: GRAY, letterSpacing: '0.14em' }}>{label}</p>
        <p className="text-[10.5px] font-bold" style={{ color: GRAY }}>{hint}</p>
      </div>
      {offers.map((o, i) => row(o, i === offers.length - 1))}
    </>
  )

  return (
    <>
      <div style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16, overflow: 'hidden' }}>
        <button
          onClick={() => { triggerHaptic('selection'); setOpen(v => !v) }}
          className="w-full flex items-center gap-3 text-left"
          style={{ padding: '14px' }}
        >
          <span className="w-[40px] h-[40px] flex items-center justify-center shrink-0"
            style={{ background: INK, borderRadius: 10, color: '#9BE04B' }}>
            <Lightbulb size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-extrabold" style={{ color: INK }}>O'qish uchun</span>
            <span className="block mt-[3px] text-[12px]" style={{ color: GRAY }}>
              Maslahat, o'tkazish, to'plam ochish, Pro sinovi
            </span>
          </span>
          <span className="num shrink-0 text-[11.5px] font-extrabold" style={{ color: GRAY }}>{heldCount}</span>
          <ChevronDown size={17} style={{ color: GRAY, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div style={{ borderTop: `1px solid ${HAIR}` }}>
                {group('COIN EVAZIGA PRO', 'oyiga bir marta', [trialOffer])}
                {group('TESTGA YORDAMCHI', 'holda saqlanadi, testda bosiladi', itemOffers)}
                {group("OCHILADIGAN TO'PLAMLAR", 'bir marta — abadiy', setOffers)}

                <div className="flex items-center justify-between" style={{ padding: '10px 14px', background: '#FAFBF8', borderBottom: `1px solid ${HAIR}` }}>
                  <p className="text-[10.5px] font-extrabold" style={{ color: GRAY, letterSpacing: '0.14em' }}>
                    COIN QANDAY TOPILADI
                  </p>
                  <button
                    onClick={() => { triggerHaptic('medium'); navigate(`/problems/${earnTarget}`) }}
                    className="flex items-center gap-1 text-[11.5px] font-extrabold"
                    style={{ color: GREEN_TILE }}
                  >
                    yig'ishga <ChevronRight size={12} />
                  </button>
                </div>
                {earnings.map((e, i) => (
                  <div key={e.u} className="flex items-center justify-between"
                    style={{ padding: '12px 14px', borderBottom: i === earnings.length - 1 ? undefined : `1px solid ${HAIR}` }}>
                    <p className="text-[12px]" style={{ color: GRAY }}>{e.u}</p>
                    <p className="num text-[12px] font-extrabold" style={{ color: AMBER_INK }}>{e.v}</p>
                  </div>
                ))}

                <button
                  onClick={() => { triggerHaptic('light'); navigate('/pro') }}
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: '14px', background: '#FAFBF8' }}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-[40px] h-[40px] flex items-center justify-center"
                      style={{ background: '#E7F7EE', borderRadius: 10, color: GREEN_TILE }}>
                      <User size={18} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-extrabold" style={{ color: INK }}>Pro rejalarini so'mda ko'rish</span>
                      <span className="block mt-[3px] text-[12px]" style={{ color: GRAY }}>oylik / 3 oylik / yillik to'lov</span>
                    </span>
                  </span>
                  <ChevronRight size={16} style={{ color: '#9AA995' }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Xaridlar kovagi */}
      <div className="mt-3" style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="flex items-center justify-between" style={{ padding: '13px 14px', borderBottom: `1px solid ${HAIR}` }}>
          <p className="text-[13.5px] font-extrabold" style={{ color: INK }}>Xaridlar kovagi</p>
          <p className="num text-[12px] font-extrabold" style={{ color: AMBER_INK }}>
            jami {txLog.reduce((n, t) => n + t.cost, 0).toLocaleString()} coin
          </p>
        </div>
        {txLog.length === 0 ? (
          <p className="text-[12px]" style={{ padding: '13px 14px', color: GRAY }}>
            Kovak bo'sh. Testda adashsangiz — maslahat 30 coin.
          </p>
        ) : (
          txLog.slice(0, 6).map((t, i) => (
            <div key={t.at + i} className="flex items-center gap-3"
              style={{ padding: '11px 14px', borderBottom: i === Math.min(txLog.length, 6) - 1 ? undefined : `1px solid ${HAIR}` }}>
              <p className="flex-1 text-[13px] truncate" style={{ color: INK }}>{t.title}</p>
              <span className="num text-[13px] font-extrabold shrink-0" style={{ color: AMBER_INK }}>−{t.cost.toLocaleString()}</span>
              <Coins size={12} style={{ color: AMBER_INK }} className="shrink-0" />
            </div>
          ))
        )}
      </div>

      {/* Chek varaqasi */}
      <Sheet open={!!buying} onClose={() => setBuying(null)} title="CHEK · TASDIQLANG">
        {buying && (
          <>
            <p className="text-[19px] font-extrabold" style={{ color: INK }}>{buying.title}</p>
            <p className="mt-1 text-[12.5px]" style={{ color: GRAY }}>{buying.desc}</p>
            <div className="mt-4" style={{ background: '#F7F9F6', borderRadius: 12, padding: '12px 14px' }}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-extrabold" style={{ color: GRAY }}>Narxi</span>
                <span className="num flex items-center gap-1.5 text-[15px] font-extrabold" style={{ color: AMBER_INK }}>
                  <Coins size={14} style={{ color: AMBER_INK }} />{buying.cost.toLocaleString()}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between" style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 10 }}>
                <span className="text-[12px] font-extrabold" style={{ color: GRAY }}>To'lovdan keyin</span>
                <span className="num text-[13px] font-extrabold" style={{ color: INK }}>
                  {(coin - buying.cost).toLocaleString()} coin qoladi
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              <button
                onClick={() => { triggerHaptic('light'); setBuying(null) }}
                className="flex-1 h-[50px] text-[13px] font-extrabold"
                style={{ background: '#F1F4F0', color: GRAY, borderRadius: 100 }}
              >
                Bekor
              </button>
              <button
                onClick={confirmBuy}
                className="flex-1 h-[50px] text-[13px] font-extrabold active:scale-[0.98] transition-transform"
                style={{ background: INK, color: '#CDE9AE', borderRadius: 100 }}
              >
                <span className="num">{buying.cost} coin</span> — olaman
              </button>
            </div>
            {buying.note && <p className="mt-3 text-center text-[11px]" style={{ color: '#9AA995' }}>{buying.note}</p>}
          </>
        )}
      </Sheet>
    </>
  )
}

function pillStyle(has: boolean, full: boolean, poor: boolean) {
  if (has) return { background: INK, color: '#FFFFFF' }
  if (full) return { background: '#F1F4F0', color: '#9AA995' }
  if (poor) return { background: '#FFFFFF', color: GRAY, border: '1px dashed #D7DED6' }
  return { background: AMBER_BG, color: AMBER_INK }
}

export default StudyAids
