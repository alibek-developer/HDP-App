import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, ChevronRight, Coins, Flag, Heart, MessageSquare, ShieldCheck,
  Star, Timer, Truck, X,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useBack } from '../lib/nav'
import { useApp } from '../store/useStore'
import ProductArt from '../components/ProductArt'
import Sheet from '../components/Sheet'
import { SEED_REVIEWS, blendedRating, daysToEarn, findProduct, PROBLEM_SETS } from '../data/content'

/**
 * Mahsulot sahifasi — rasm, to'liq tavsif, xususiyatlar, ombor qoldig'i,
 * «necha kunda» hisobi, buyurtma tugmasi va izohlar (o'qish + yozish).
 */

const INK = '#0E1A12'
const CANVAS = '#F3F7EE'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_BG = '#FEF3C7'
const AMBER_INK = '#854D0E'
const BAD = '#B4402F'
const LIME = {
  background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 100%)',
  color: '#1C3214',
  boxShadow: '0 5px 12px rgba(95,175,34,0.32), inset 0 1px 0 rgba(255,255,255,0.55)',
}

const ago = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()

const relDate = (iso: string) => {
  const mins = Math.max(0, (Date.now() - Date.parse(iso)) / 60000)
  if (mins < 1) return 'hozir'
  if (mins < 60) return `${Math.round(mins)} daqiqa oldin`
  const hours = mins / 60
  if (hours < 24) return `${Math.round(hours)} soat oldin`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} kun oldin`
  return `${Math.round(days / 30)} oy oldin`
}

const Stars = ({ value, size = 12 }: { value: number; size?: number }) => (
  <span className="inline-flex items-center gap-[2px]">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={size}
        strokeWidth={2}
        style={{ color: i <= Math.round(value) ? '#E8A33D' : '#D7DED6' }}
        fill={i <= Math.round(value) ? '#E8A33D' : 'none'}
      />
    ))}
  </span>
)

const ProductScreen = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const exit = useBack('/shop')
  const product = findProduct(id)

  const coin = useApp(s => s.coin)
  const favs = useApp(s => s.favs)
  const orders = useApp(s => s.orders)
  const stockTaken = useApp(s => s.stockTaken)
  const goalId = useApp(s => s.goalId)
  const myReviews = useApp(s => s.reviews)
  const isPro = useApp(s => s.isPro)
  const unlocked = useApp(s => s.unlocked)

  const buyProduct = useApp(s => s.buyProduct)
  const addReview = useApp(s => s.addReview)
  const toggleFav = useApp(s => s.toggleFav)
  const setGoal = useApp(s => s.setGoal)

  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftStars, setDraftStars] = useState(5)
  const [sent, setSent] = useState(false)

  const mine = useMemo(
    () => myReviews.filter(r => r.productId === id).map(r => ({
      name: r.name, rating: r.rating, text: r.text, at: r.at, own: true, bought: false,
    })),
    [myReviews, id],
  )
  const seeds = useMemo(
    () => SEED_REVIEWS.filter(r => r.productId === id).map(r => ({
      name: r.name, rating: r.rating, text: r.text, at: ago(r.daysAgo), own: false, bought: true,
    })),
    [id],
  )
  const all = [...mine, ...seeds]

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8" style={{ background: CANVAS }}>
        <p className="text-[16px] font-extrabold" style={{ color: INK }}>Mahsulot topilmadi</p>
        <p className="text-[12.5px] text-center" style={{ color: GRAY }}>Do'kon ro'yxatidan boshqa sovg'a tanlang.</p>
        <button
          onClick={() => { triggerHaptic('light'); navigate('/shop') }}
          className="mt-2 h-[46px] px-6 text-[13.5px] font-extrabold"
          style={{ background: INK, color: '#CDE9AE', borderRadius: 100 }}
        >
          Do'konga qaytish
        </button>
      </div>
    )
  }

  const left = Math.max(0, product.stock - (stockTaken[product.id] ?? 0))
  const ownRatings = mine.map(r => r.rating)
  const avg = blendedRating(product, ownRatings)
  const count = all.length
  const out = left === 0
  const bought = orders.some(o => o.productId === product.id)
  const fav = favs.includes(product.id)
  const gap = Math.max(0, product.price - coin)
  const canBuy = !out && gap === 0
  const isGoal = goalId === product.id

  const earnTarget = (() => {
    const openable = PROBLEM_SETS.filter(s => s.free || isPro || unlocked.includes(s.id))
    const pool = openable.length > 0 ? openable : PROBLEM_SETS.filter(s => s.free)
    return [...pool].sort((a, b) => b.coinPerSolve - a.coinPerSolve)[0]?.id ?? 'ps-trig'
  })()

  const submit = () => {
    if (draft.trim().length < 3) {
      triggerHaptic('warning')
      return
    }
    if (!addReview(product.id, draftStars, draft)) {
      triggerHaptic('error')
      return
    }
    setDraft('')
    setSent(true)
    window.setTimeout(() => setSent(false), 1800)
    triggerHaptic('success')
  }

  const onBuy = () => {
    const r = buyProduct(product.id)
    setConfirm(false)
    if (r === 'ok') {
      triggerHaptic('success')
      setDone(true)
    } else {
      triggerHaptic('error')
    }
  }

  return (
    <div className="min-h-screen pb-[132px] select-none font-sans" style={{ background: CANVAS }}>
      {/* ── Yuqori panel ── */}
      <div className="sticky top-0 z-30" style={{ background: 'rgba(243,247,238,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${HAIR}` }}>
        <div className="flex items-center gap-3 px-4" style={{ height: 54 }}>
          <button
            onClick={exit}
            aria-label="Orqaga"
            className="w-[38px] h-[38px] flex items-center justify-center shrink-0 active:scale-[0.94] transition-transform"
            style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 100, color: INK }}
          >
            <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <p className="flex-1 min-w-0 text-[15px] font-extrabold truncate" style={{ color: INK }}>{product.title}</p>
          <button
            onClick={() => { triggerHaptic('light'); toggleFav(product.id) }}
            aria-label="Sevimli"
            className="w-[38px] h-[38px] flex items-center justify-center shrink-0 active:scale-[0.94] transition-transform"
            style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 100 }}
          >
            <Heart size={17} strokeWidth={2.1} color={fav ? BAD : GRAY} fill={fav ? BAD : 'none'} />
          </button>
        </div>
      </div>

      {/* ── Rasm ── */}
      <div className="px-4 pt-4">
        <ProductArt product={product} fill radius={18} iconSize={150}>
          <span
            className="absolute left-3 top-3 px-2.5 py-[5px] text-[10px] font-extrabold uppercase tracking-[0.1em]"
            style={{ background: 'rgba(14,26,18,0.82)', color: '#EAF3E2', borderRadius: 8 }}
          >
            {product.cat}
          </span>
          <span
            className="num absolute right-3 top-3 px-2.5 py-[5px] text-[11px] font-extrabold"
            style={{ background: 'rgba(255,255,255,0.92)', color: out ? BAD : INK, borderRadius: 8 }}
          >
            {out ? 'tugagan' : `${left} dona`}
          </span>
        </ProductArt>
      </div>

      {/* ── Narx varag'i ── */}
      <div className="px-4 mt-4">
        <div className="relative overflow-hidden" style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16 }}>
          <span className="absolute left-0 top-0 bottom-0" style={{ width: 5, background: out ? BAD : 'linear-gradient(180deg,#9BE04B,#5FAF22)' }} />
          <div className="pl-5 pr-4 py-4">
            <h1 className="text-[21px] font-extrabold leading-tight" style={{ color: INK }}>{product.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={avg} />
              <span className="num text-[12px] font-extrabold" style={{ color: INK }}>{avg.toFixed(1)}</span>
              <span className="text-[12px] font-bold" style={{ color: GRAY }}>· {count} izoh</span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="num flex items-center gap-1.5 text-[28px] font-extrabold leading-none" style={{ color: AMBER_INK }}>
                <Coins size={20} style={{ color: AMBER_INK }} />
                {product.price.toLocaleString('en-US')}
              </span>
              <span className="text-right">
                <span className="block text-[11px] font-bold" style={{ color: GRAY }}>hamyonda</span>
                <span className="num block text-[15px] font-extrabold" style={{ color: coin >= product.price ? '#0B6E4F' : AMBER_INK }}>
                  {coin.toLocaleString('en-US')}
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11.5px] font-bold" style={{ color: GRAY }}>
              <Timer size={13} style={{ color: '#5FAF22' }} />
              {out
                ? 'Keyingi partiyaga navbatga turing'
                : gap > 0
                  ? `yana ${gap.toLocaleString()} coin · taxminan ${daysToEarn(gap)} kunlik yechim`
                  : 'hozir olishga yetarli'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tavsif ── */}
      <section className="px-4 mt-5">
        <p className="text-[10.5px] font-extrabold mb-2" style={{ color: GRAY, letterSpacing: '0.14em' }}>MAHSULOT HAQIDA</p>
        <div style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16, padding: 16 }}>
          <p className="text-[13.5px] leading-[1.6]" style={{ color: INK }}>{product.desc}</p>

          <div className="mt-4" style={{ borderTop: `1px solid ${HAIR}` }}>
            {product.specs.map((sp, i) => (
              <div key={sp.k} className="flex items-center justify-between gap-3"
                style={{ padding: '11px 0', borderBottom: i === product.specs.length - 1 ? undefined : `1px solid ${HAIR}` }}>
                <span className="text-[12.5px] font-bold" style={{ color: GRAY }}>{sp.k}</span>
                <span className="text-[13px] font-extrabold text-right" style={{ color: INK }}>{sp.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: Truck, k: 'Yetkazib berish', v: 'Toshkent 2 kun · viloyat 4 kun' },
              { icon: ShieldCheck, k: 'Kafolat', v: 'Rasmiy hujjat bilan' },
            ].map(b => {
              const Icon = b.icon
              return (
                <div key={b.k} style={{ background: '#F7F9F6', border: `1px solid ${HAIR}`, borderRadius: 12, padding: '11px 12px' }}>
                  <Icon size={15} style={{ color: '#5FAF22' }} />
                  <p className="mt-1.5 text-[11px] font-extrabold" style={{ color: GRAY }}>{b.k}</p>
                  <p className="mt-[3px] text-[12px] font-bold leading-snug" style={{ color: INK }}>{b.v}</p>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => { triggerHaptic('selection'); setGoal(isGoal ? null : product.id) }}
          className="mt-3 w-full flex items-center justify-between text-left"
          style={{ background: isGoal ? INK : '#FFFFFF', border: `1px solid ${isGoal ? INK : HAIR}`, borderRadius: 14, padding: '13px 14px' }}
        >
          <span className="flex items-center gap-2.5">
            <Flag size={16} strokeWidth={2.3} style={{ color: isGoal ? '#9BE04B' : GRAY }} />
            <span className="text-[13px] font-extrabold" style={{ color: isGoal ? '#CDE9AE' : INK }}>
              {isGoal ? 'Maqsad qilib qo\'yilgan' : 'Maqsad qilib qo\'yish'}
            </span>
          </span>
          <span className="text-[11.5px] font-bold" style={{ color: isGoal ? 'rgba(205,233,174,0.6)' : GRAY }}>
            {isGoal ? 'olib tashlash' : 'do\'konda ko\'rinadi'}
          </span>
        </button>
      </section>

      {/* ── Izohlar ── */}
      <section className="px-4 mt-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="flex items-center gap-1.5 text-[17px] font-extrabold" style={{ color: INK }}>
            <MessageSquare size={16} style={{ color: GRAY }} /> Izohlar
          </h2>
          <span className="num text-[12px] font-extrabold" style={{ color: GRAY }}>{count} ta</span>
        </div>

        {/* Yozish */}
        <div style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16, padding: 14 }}>
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-extrabold" style={{ color: INK }}>Fikringizni qoldiring</p>
            <StarsRow value={draftStars} onChange={setDraftStars} />
          </div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value.slice(0, 300))}
            rows={3}
            placeholder="Sovg'ani qanchalik tez oldingiz? Sifati qanday?"
            className="mt-2.5 w-full resize-none outline-none text-[13.5px] leading-relaxed font-medium"
            style={{ background: '#F7F9F6', border: `1px solid ${HAIR}`, borderRadius: 12, padding: '11px 12px', color: INK }}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="num text-[11px] font-bold" style={{ color: draft.length > 280 ? BAD : '#9AA995' }}>{draft.length}/300</span>
            <button
              onClick={submit}
              className="h-[40px] px-5 text-[13px] font-extrabold active:scale-[0.97] transition-transform"
              style={draft.trim().length < 3 ? { background: '#F1F4F0', color: '#9AA995', borderRadius: 100 } : { ...LIME, borderRadius: 100 }}
            >
              {sent ? 'Yozildi' : 'Izoh qoldirish'}
            </button>
          </div>
          {bought && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: '#0B6E4F' }}>
              <Check size={12} strokeWidth={3} /> Siz bu sovg'ani buyurtma qilgansiz
            </p>
          )}
        </div>

        {/* Ro'yxat */}
        <div className="mt-3 space-y-2.5">
          <AnimatePresence initial={false}>
            {all.map((r, i) => (
              <motion.div
                key={r.text + i}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
                style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 14, padding: '13px 14px' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-[30px] h-[30px] flex items-center justify-center shrink-0 text-[12px] font-extrabold"
                    style={{ background: r.own ? INK : '#EDF3E7', color: r.own ? '#9BE04B' : '#33501F', borderRadius: 100 }}>
                    {r.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-extrabold truncate" style={{ color: INK }}>
                      {r.name}{r.own && <span className="ml-1.5 text-[10.5px] font-bold" style={{ color: GRAY }}>— siz</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <Stars value={r.rating} size={10} />
                      <span className="text-[10.5px] font-bold" style={{ color: '#9AA995' }}>{relDate(r.at)}</span>
                    </div>
                  </div>
                  {r.bought && (
                    <span className="num shrink-0 px-2 py-[3px] text-[9.5px] font-extrabold uppercase"
                      style={{ background: AMBER_BG, color: AMBER_INK, borderRadius: 100 }}>
                      sotib olgan
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: '#33452F' }}>{r.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {count === 0 && (
            <div style={{ background: '#FFFFFF', border: `1px dashed #D7DED6`, borderRadius: 14, padding: '18px 16px' }}>
              <p className="text-[13.5px] font-extrabold" style={{ color: INK }}>Hali izoh yo'q</p>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: GRAY }}>
                Bu sovg'ani olgan birinchi kishi bo'ling — yuqoridagi maydongga fikringizni yozing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Buyurtma paneli ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 430, margin: '0 auto' }}>
        <div className="px-4 pt-3 pb-5"
          style={{ background: 'rgba(243,247,238,0.94)', backdropFilter: 'blur(14px)', borderTop: `1px solid ${HAIR}` }}>
          <div className="flex items-center gap-2.5">
            <div className="shrink-0">
              <p className="text-[10.5px] font-bold" style={{ color: GRAY }}>narxi</p>
              <p className="num flex items-center gap-1 text-[17px] font-extrabold leading-none" style={{ color: AMBER_INK }}>
                <Coins size={14} style={{ color: AMBER_INK }} />{product.price.toLocaleString('en-US')}
              </p>
            </div>
            {out ? (
              <button
                onClick={() => { triggerHaptic(isGoal ? 'warning' : 'success'); if (!isGoal) setGoal(product.id) }}
                className="flex-1 h-[52px] text-[13.5px] font-extrabold active:scale-[0.98] transition-transform"
                style={{ background: isGoal ? '#E9EEE8' : INK, color: isGoal ? '#8A9784' : '#CDE9AE', borderRadius: 100 }}
              >
                {isGoal ? 'Navbatga qo\'yildingiz' : 'Tugagan — navbatga qo\'yish'}
              </button>
            ) : canBuy ? (
              <button
                onClick={() => { triggerHaptic('medium'); setConfirm(true) }}
                className="flex-1 h-[52px] text-[13.5px] font-extrabold active:scale-[0.98] transition-transform"
                style={{ ...LIME, borderRadius: 100 }}
              >
                Buyurtma berish
              </button>
            ) : (
              <button
                onClick={() => { triggerHaptic('light'); navigate(`/problems/${earnTarget}`) }}
                className="flex-1 h-[52px] text-[13.5px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                style={{ background: INK, color: '#CDE9AE', borderRadius: 100 }}
              >
                <Coins size={15} style={{ color: '#9BE04B' }} />
                <span className="num">{gap.toLocaleString()}</span> coin yig'ish
              </button>
            )}
          </div>
          {bought && !out && (
            <p className="mt-2 text-center text-[11px] font-bold" style={{ color: GRAY }}>
              Buyurtmangiz qabul qilindi — yana {left} ta qoldi
            </p>
          )}
        </div>
      </div>

      {/* ── Chek varaqasi ── */}
      <Sheet open={confirm} onClose={() => setConfirm(false)} title="BUYURTMA · TASDIQLANG">
        <div className="flex items-center gap-3">
          <ProductArt product={product} size={56} radius={12} iconSize={26} />
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold truncate" style={{ color: INK }}>{product.title}</p>
            <p className="text-[11.5px] font-bold" style={{ color: GRAY }}>{product.cat} · {left} ta qoldi</p>
          </div>
        </div>
        <div className="mt-4" style={{ background: '#F7F9F6', borderRadius: 12, padding: '12px 14px' }}>
          {[
            { k: 'Narxi', v: `${product.price.toLocaleString()} coin` },
            { k: 'Hamyoningizda', v: `${coin.toLocaleString()} coin` },
            { k: 'To\'lovdan keyin', v: `${(coin - product.price).toLocaleString()} coin qoladi` },
            { k: 'Yetkazib berish', v: '2–4 kun, bepul' },
          ].map((r, i, arr) => (
            <div key={r.k} className="flex items-center justify-between"
              style={{ padding: '8px 0', borderBottom: i === arr.length - 1 ? undefined : `1px solid ${HAIR}` }}>
              <span className="text-[12px] font-bold" style={{ color: GRAY }}>{r.k}</span>
              <span className="num text-[13px] font-extrabold" style={{ color: INK }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <button
            onClick={() => { triggerHaptic('light'); setConfirm(false) }}
            className="flex-1 h-[50px] text-[13px] font-extrabold"
            style={{ background: '#F1F4F0', color: GRAY, borderRadius: 100 }}
          >
            <X size={14} className="inline mr-1" /> Bekor
          </button>
          <button
            onClick={onBuy}
            className="flex-1 h-[50px] text-[13px] font-extrabold active:scale-[0.98] transition-transform"
            style={{ ...LIME, borderRadius: 100 }}
          >
            <span className="num">{product.price}</span> coin — olaman
          </button>
        </div>
      </Sheet>

      {/* ── Buyurtma qabul qilindi ── */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            style={{ background: 'rgba(14,26,18,0.6)' }}
          >
            <motion.div
              initial={{ scale: 0.86, y: 18 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              className="w-full text-center"
              style={{ background: '#FFFFFF', borderRadius: 20, padding: '26px 20px 22px' }}
            >
              <span className="mx-auto w-[62px] h-[62px] flex items-center justify-center"
                style={{ background: 'linear-gradient(150deg,#9BE04B,#5FAF22)', borderRadius: 100, color: '#12300A' }}>
                <Check size={30} strokeWidth={3} />
              </span>
              <p className="mt-4 text-[19px] font-extrabold" style={{ color: INK }}>Buyurtma qabul qilindi</p>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: GRAY }}>
                <span className="font-extrabold" style={{ color: INK }}>{product.title}</span> — {product.price.toLocaleString()} coin yechildi.
                Yetkazib berishdan oldin operator siz bilan bog'lanadi.
              </p>
              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => { triggerHaptic('light'); setDone(false); exit() }}
                  className="flex-1 h-[48px] text-[13px] font-extrabold"
                  style={{ background: '#F1F4F0', color: INK, borderRadius: 100 }}
                >
                  Do'konga
                </button>
                <button
                  onClick={() => { triggerHaptic('medium'); setDone(false); navigate('/profile') }}
                  className="flex-1 h-[48px] text-[13px] font-extrabold"
                  style={{ background: INK, color: '#CDE9AE', borderRadius: 100 }}
                >
                  Profilim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** yulduz tanlash qatori */
const StarsRow = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <span className="flex items-center gap-[3px]">
    {[1, 2, 3, 4, 5].map(i => (
      <button key={i} onClick={() => { triggerHaptic('selection'); onChange(i) }} aria-label={`${i} yulduz`}>
        <Star
          size={15}
          strokeWidth={2}
          style={{ color: i <= value ? '#E8A33D' : '#D7DED6' }}
          fill={i <= value ? '#E8A33D' : 'none'}
        />
      </button>
    ))}
  </span>
)

export default ProductScreen
