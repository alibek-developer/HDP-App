import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Clock, Coins, Flag, Heart, Search, SlidersHorizontal,
  Star, X,
} from 'lucide-react'
import { triggerHaptic } from '../lib/telegram'
import { useApp } from '../store/useStore'
import ProductArt from '../components/ProductArt'
import StudyAids from '../components/StudyAids'
import Sheet from '../components/Sheet'
import { PRODUCTS, PRODUCT_CATS, blendedRating, daysToEarn, type Product, type ProductCat } from '../data/content'

/**
 * Do'kon — sovg'a bozori. Coinlar haqiqiy narsa oladi: telefon, sumka, kitob.
 * Ikki ustunli kartalar, ustida balans + qidiruv/sevimli/tarix tugmalari va
 * janr chiplari. «O'qish uchun» bo'limi — test yordamchilari va ochishlar.
 */

const INK = '#0E1A12'
const CANVAS = '#F3F7EE'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_INK = '#854D0E'
const BAD = '#B4402F'

type Filter = 'all' | ProductCat | 'fav'
type Sort = 'yangi' | 'arzon' | 'qimmat' | 'reyting'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'yangi', label: 'Ombordagi kabi' },
  { key: 'arzon', label: 'Arzonlari oldinda' },
  { key: 'qimmat', label: 'Qimmatlari oldinda' },
  { key: 'reyting', label: 'Reytingi yuqorisi' },
]

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}`
}

const ShopScreen = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [sort, setSort] = useState<Sort>('yangi')
  const [sortOpen, setSortOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const coin = useApp(s => s.coin)
  const favs = useApp(s => s.favs)
  const orders = useApp(s => s.orders)
  const stockTaken = useApp(s => s.stockTaken)
  const goalId = useApp(s => s.goalId)
  const reviews = useApp(s => s.reviews)

  const left = (p: Product) => Math.max(0, p.stock - (stockTaken[p.id] ?? 0))

  const list = useMemo(() => {
    let items = PRODUCTS
    if (filter === 'fav') items = items.filter(p => favs.includes(p.id))
    else if (filter !== 'all') items = items.filter(p => p.cat === filter)
    const q = query.trim().toLowerCase()
    if (q) items = items.filter(p => (p.title + ' ' + p.blurb + ' ' + p.cat).toLowerCase().includes(q))
    const sorted = [...items]
    if (sort === 'arzon') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'qimmat') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'reyting') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [filter, favs, query, sort])

  const goal = goalId ? PRODUCTS.find(p => p.id === goalId) ?? null : null
  const spent = orders.reduce((n, o) => n + o.price, 0)

  const chip = (key: Filter, label: string) => {
    const on = filter === key
    return (
      <button
        key={key}
        onClick={() => { triggerHaptic('selection'); setFilter(key) }}
        className="shrink-0 h-[38px] px-4 text-[13px] font-bold transition-colors"
        style={{
          borderRadius: 100,
          background: on ? INK : 'transparent',
          color: on ? '#FFFFFF' : GRAY,
        }}
      >
        {label}
        {key === 'fav' && favs.length > 0 && (
          <span className="num ml-1.5" style={{ opacity: on ? 0.7 : 1 }}>{favs.length}</span>
        )}
      </button>
    )
  }

  const card = (p: Product) => {
    const stock = left(p)
    const out = stock === 0
    const fav = favs.includes(p.id)
    const rate = blendedRating(p, reviews.filter(r => r.productId === p.id).map(r => r.rating))
    return (
      <motion.button
        key={p.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        onClick={() => { triggerHaptic('light'); navigate(`/shop/${p.id}`) }}
        className="text-left w-full overflow-hidden active:scale-[0.985] transition-transform"
        style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 16, padding: 8 }}
      >
        <ProductArt product={p} fill radius={12} iconSize={62}>
          <span
            role="button"
            tabIndex={-1}
            onClick={e => { e.stopPropagation(); triggerHaptic('light'); useApp.getState().toggleFav(p.id) }}
            className="absolute right-1.5 top-1.5 w-[28px] h-[28px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 100 }}
          >
            <Heart size={14} strokeWidth={2.2} color={fav ? BAD : '#9AA995'} fill={fav ? BAD : 'none'} />
          </span>
          <span
            className="absolute left-1.5 bottom-1.5 px-2 py-[3px] text-[9.5px] font-extrabold uppercase tracking-[0.08em]"
            style={{ background: 'rgba(14,26,18,0.82)', color: '#EAF3E2', borderRadius: 6 }}
          >
            {p.cat}
          </span>
        </ProductArt>

        <div style={{ padding: '9px 3px 2px' }}>
          <p className="text-[13.5px] font-extrabold truncate" style={{ color: INK }}>{p.title}</p>
          <p className="mt-[3px] text-[11.5px] leading-[1.35] overflow-hidden" style={{ color: GRAY, minHeight: 31, ...clamp(2) }}>
            {p.blurb}
          </p>
          <p className="num mt-2 text-[11px] font-extrabold" style={{ color: out ? BAD : INK }}>
            {out ? 'Tugagan' : `${stock} dona qoldi`}
          </p>

          <div className="mt-2 flex items-center justify-between" style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 8 }}>
            <span className="num flex items-center gap-1 text-[13px] font-extrabold" style={{ color: AMBER_INK }}>
              <Coins size={13} style={{ color: AMBER_INK }} />
              {p.price.toLocaleString('en-US')}
            </span>
            <span className="num flex items-center gap-1 text-[12px] font-extrabold" style={{ color: INK }}>
              {rate.toFixed(1)}
              <Star size={11} style={{ color: '#E8A33D' }} fill="#E8A33D" />
            </span>
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="min-h-screen pb-32 select-none font-sans" style={{ background: CANVAS }}>
      {/* ── Sarlavha ── */}
      <div className="px-4 pt-5">
        <h1 className="text-center text-[20px] font-extrabold tracking-tight" style={{ color: INK }}>
          Do'kon
        </h1>

        {/* Balans + qidiruv / sevimli / tarix */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => { triggerHaptic('light'); navigate('/profile') }}
            className="flex items-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span className="text-[15px] font-extrabold" style={{ color: INK }}>Balans:</span>
            <motion.span
              key={coin}
              initial={{ opacity: 0.4, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="num flex items-center gap-1.5 text-[17px] font-extrabold"
              style={{ color: AMBER_INK }}
            >
              <span
                className="w-[22px] h-[22px] flex items-center justify-center"
                style={{ background: `linear-gradient(150deg, #F6D8A6, #E8A33D)`, borderRadius: 100, color: '#7A4A0B' }}
              >
                <Coins size={13} strokeWidth={2.4} />
              </span>
              {coin.toLocaleString('en-US')}
            </motion.span>
          </button>

          <div className="flex items-center gap-2">
            {([
              { key: 'search', icon: Search, on: searchOpen, act: () => { setSearchOpen(v => !v); setQuery('') } },
              { key: 'fav', icon: Heart, on: filter === 'fav', act: () => setFilter(f => (f === 'fav' ? 'all' : 'fav')) },
              { key: 'history', icon: Clock, on: historyOpen, act: () => setHistoryOpen(true) },
            ] as const).map(b => {
              const Icon = b.icon
              return (
                <button
                  key={b.key}
                  onClick={() => { triggerHaptic('selection'); b.act() }}
                  aria-label={b.key}
                  className="w-[38px] h-[38px] flex items-center justify-center active:scale-[0.94] transition-transform"
                  style={{
                    background: b.on ? INK : '#FFFFFF',
                    border: `1px solid ${b.on ? INK : HAIR}`,
                    borderRadius: 100,
                    color: b.on ? '#FFFFFF' : INK,
                  }}
                >
                  <Icon size={17} strokeWidth={2.1} />
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center gap-2 px-3" style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, borderRadius: 100, height: 44 }}>
                <Search size={16} style={{ color: GRAY }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Telefon, sumka, kitob..."
                  className="flex-1 bg-transparent outline-none text-[14px] font-semibold"
                  style={{ color: INK }}
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Tozalash">
                    <X size={16} style={{ color: GRAY }} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtr chiplari */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => { triggerHaptic('selection'); setSortOpen(true) }}
            aria-label="Saralash"
            className="w-[42px] h-[42px] shrink-0 flex items-center justify-center"
            style={{ background: sort === 'yangi' ? '#FFFFFF' : INK, border: `1px solid ${sort === 'yangi' ? HAIR : INK}`, borderRadius: 12, color: sort === 'yangi' ? INK : '#FFFFFF' }}
          >
            <SlidersHorizontal size={17} />
          </button>

          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1" style={{ paddingBottom: 2 }}>
              {chip('all', 'Barchasi')}
              {PRODUCT_CATS.map(c => chip(c, c))}
              {favs.length > 0 && chip('fav', 'Sevimli')}
            </div>
          </div>
        </div>

        {/* Maqsad chizig'i */}
        {goal && (
          <button
            onClick={() => { triggerHaptic('light'); navigate(`/shop/${goal.id}`) }}
            className="mt-3 w-full text-left"
            style={{ background: INK, borderRadius: 14, padding: '11px 13px' }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[12.5px] font-extrabold truncate" style={{ color: '#CDE9AE' }}>
                <Flag size={13} strokeWidth={2.4} /> {goal.title}
              </span>
              <span className="num shrink-0 text-[11.5px] font-bold" style={{ color: '#9BE04B' }}>
                {Math.max(0, goal.price - coin) === 0 ? 'olish mumkin' : `${(goal.price - coin).toLocaleString()} coin qoldi`}
              </span>
            </div>
            <div className="mt-2" style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 100, height: 5 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (coin / goal.price) * 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #9BE04B, #7ED321)', borderRadius: 100, height: 5 }}
              />
            </div>
            <p className="num mt-1.5 text-[10.5px] font-bold" style={{ color: 'rgba(205,233,174,0.55)' }}>
              {coin.toLocaleString()} / {goal.price.toLocaleString()} · taxminan {daysToEarn(Math.max(0, goal.price - coin))} kun
            </p>
          </button>
        )}
      </div>

      {/* ── Ikki ustunli tovar ── */}
      <div className="mt-4 px-4">
        {list.length === 0 ? (
          <div className="text-center" style={{ background: '#FFFFFF', border: `1px dashed #D7E0D3`, borderRadius: 16, padding: '28px 20px' }}>
            <p className="text-[14px] font-extrabold" style={{ color: INK }}>
              {filter === 'fav' ? 'Sevimlilar bo\'sh' : 'Bu javonda hozircha yo\'q'}
            </p>
            <p className="mt-1.5 text-[12.5px]" style={{ color: GRAY }}>
              {filter === 'fav'
                ? 'Kartadagi yurakchani bosib, keyin oladigan sovug\'alarni yig\'ib qo\'ying.'
                : 'Boshqa janrni tanlang yoki qidiruvni tozalang.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map(card)}
          </div>
        )}
      </div>

      {/* ── O'qish uchun: yordamchilar, ochishlar, Pro ── */}
      <div className="mt-6 px-4">
        <StudyAids />
      </div>

      {/* ── Saralash varaqasi ── */}
      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="SARALASH">
        <div className="mt-2">
          {SORTS.map(o => (
            <button
              key={o.key}
              onClick={() => { triggerHaptic('selection'); setSort(o.key); setSortOpen(false) }}
              className="w-full flex items-center justify-between text-left"
              style={{ padding: '14px 2px', borderBottom: `1px solid ${HAIR}` }}
            >
              <span className="text-[14px] font-extrabold" style={{ color: INK }}>{o.label}</span>
              {sort === o.key && (
                <span className="w-[22px] h-[22px] flex items-center justify-center shrink-0"
                  style={{ background: INK, borderRadius: 100, color: '#FFFFFF' }}>
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      {/* ── Buyurtmalar tarixi ── */}
      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="BUYURTMALAR">
        {orders.length === 0 ? (
          <p className="text-[13px] leading-relaxed" style={{ color: GRAY }}>
            Hali birorta sovg'a buyurtma qilinmagan. Kartani ochib, ichidan «Buyurtma berish» tugmasi bilan olasiz.
          </p>
        ) : (
          <>
            <div className="mt-1 mb-2 flex items-center justify-between">
              <p className="text-[12.5px] font-bold" style={{ color: GRAY }}>{orders.length} ta buyurtma</p>
              <p className="num text-[12.5px] font-extrabold" style={{ color: AMBER_INK }}>jami {spent.toLocaleString()} coin</p>
            </div>
            {orders.map((o, i) => (
              <div key={o.at + i} className="flex items-center gap-3"
                style={{ padding: '12px 2px', borderBottom: i === orders.length - 1 ? undefined : `1px solid ${HAIR}` }}>
                <span className="num w-[38px] shrink-0 text-[11px] font-bold" style={{ color: '#9AA995' }}>{fmtDate(o.at)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-extrabold truncate" style={{ color: INK }}>{o.title}</p>
                  <p className="text-[11px] font-bold" style={{ color: GRAY }}>buyurtma qabul qilindi · yetkazib berish 2–4 kun</p>
                </div>
                <span className="num shrink-0 text-[13px] font-extrabold" style={{ color: AMBER_INK }}>−{o.price.toLocaleString()}</span>
              </div>
            ))}
          </>
        )}
        <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: GRAY }}>
          Buyurtmalar bo'yicha operator siz bilan bog'lanadi. Xato yoki qo'shimcha savol bo'lsa — profildagi qo'llab-quvvatlashga yozing.
        </p>
      </Sheet>
    </div>
  )
}

/** ikki qatorli chekuv */
const clamp = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
})

export default ShopScreen
