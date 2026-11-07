import { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { PopIn, Reveal } from './Reveal'
import Sheet from './Sheet'
import type { RootStackParamList } from '../navigation/types'
import { NUM } from '../theme/tokens'
import {
  BOOST_CARD, CONSUMABLES, DAILY_BONUS, MISSION_REWARDS, PROBLEM_SETS,
  PRO_TRIAL, SET_COIN_RANGE, TEST_REWARD, UNLOCKABLE_SETS,
} from '../data/content'

/**
 * Do'konning «o'qish» javoni — tovar ostida yig'ilgan, lekin testda haqiqatan
 * ishlatiladigan narsalar: maslahat, o'tkazish, 2x karta, coin bilan ochiladigan
 * to'plamlar va Pro sinovi. Web'ning `StudyAids.tsx` ekvivalenti.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>
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

const num = (n: number) => n.toLocaleString('en-US')

const StudyAids = () => {
  const navigation = useNavigation<Nav>()
  const [open, setOpen] = useState(false)
  const [buying, setBuying] = useState<Offer | null>(null)
  const [stamp, setStamp] = useState<string | null>(null)
  const stampTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (stampTimer.current) clearTimeout(stampTimer.current)
    stampTimer.current = setTimeout(() => setStamp(null), 1400)
  }

  const pay = (o: Offer): boolean => {
    if (o.kind === 'trial') return buyProTrial() === 'ok'
    if (o.kind === 'set') return unlockSet(o.id, o.cost)
    return buyConsumable(o.id)
  }

  const tap = (o: Offer) => {
    if (owned(o)) {
      if (o.kind === 'set') navigation.navigate('ProblemSet', { setId: o.id })
      return
    }
    if (fullOf(o)) {
      triggerHaptic('warning')
      return
    }
    if (coin < o.cost) {
      triggerHaptic('light')
      navigation.navigate('ProblemSet', { setId: earnTarget })
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

  const GLYPH: Record<Offer['icon'], keyof typeof Ionicons.glyphMap> = {
    hint: 'bulb', skip: 'play-skip-forward', boost: 'flash', set: 'lock-closed', pro: 'diamond',
  }

  const earnings = [
    { v: `+${TEST_REWARD.coin}`, u: "test — har to'g'ri javob" },
    { v: `${SET_COIN_RANGE.min}–${SET_COIN_RANGE.max}`, u: 'masala — 1 yechim' },
    { v: `+${DAILY_BONUS.coin}`, u: 'kunlik mega masala' },
    {
      v: `${Math.min(...Object.values(MISSION_REWARDS))}–${Math.max(...Object.values(MISSION_REWARDS))}`,
      u: 'kunlik vazifalar',
    },
  ]

  const row = (o: Offer, last = false) => {
    const has = owned(o)
    const pro = byPro(o)
    const full = fullOf(o)
    const poor = !has && coin < o.cost
    const held = heldOf(o)
    const max = maxOf(o)
    const stamped = stamp === o.id
    const isAmber = o.icon === 'hint' || o.icon === 'skip' || o.icon === 'boost'

    const tileStyle = pro
      ? { backgroundColor: '#E7F7EE', color: GREEN_TILE }
      : has
        ? { backgroundColor: GREEN_TILE, color: '#FFFFFF' }
        : isAmber
          ? { backgroundColor: AMBER_BG, color: AMBER_INK }
          : o.kind === 'trial'
            ? { backgroundColor: INK, color: '#9BE04B' }
            : { backgroundColor: '#F1F4F0', color: GRAY }

    return (
      <View key={o.id} style={[st.row, last ? undefined : st.rowLine]}>
        {stamped && (
          <PopIn style={st.stamp}>
            <Text style={st.stampText}>olindi</Text>
          </PopIn>
        )}

        <View style={[st.tile, { backgroundColor: tileStyle.backgroundColor }]}>
          <Ionicons
            name={pro ? 'diamond' : has ? 'checkmark' : GLYPH[o.icon]}
            size={19}
            color={tileStyle.color}
          />
        </View>

        <View style={st.mid}>
          <View style={st.titleRow}>
            <Text style={st.title} numberOfLines={1}>{o.title}</Text>
            {max !== null && (
              <Text style={[st.hold, NUM]}>{held}/{max}</Text>
            )}
          </View>
          <Text style={st.desc}>{o.desc}</Text>
        </View>

        {!has && (
          <Pressable
            onPress={() => { triggerHaptic('selection'); setGoal(goalId === o.id ? null : o.id) }}
            hitSlop={8}
            accessibilityLabel="Maqsad qilish"
            style={({ pressed }) => [st.goalBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="flag" size={15} color={goalId === o.id ? GREEN_TILE : '#9AA995'} />
          </Pressable>
        )}

        <Pressable
          onPress={() => tap(o)}
          style={({ pressed }) => [st.pill, pillStyle(has, full, poor), pressed && { transform: [{ scale: 0.97 }] }]}
        >
          {has ? (
            <View style={st.pillRow}>
              <Text style={[st.pillText, { color: '#FFFFFF' }]}>
                {o.kind === 'trial' ? 'faol' : 'yechish'}
              </Text>
              {o.kind === 'set' && <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />}
            </View>
          ) : full ? (
            <Text style={[st.pillText, { color: '#9AA995' }]}>to&apos;la</Text>
          ) : poor ? (
            <View style={st.pillRow}>
              <Ionicons name="trending-up" size={12} color={GRAY} />
              <Text style={[st.pillText, { color: GRAY }]}>+{num(o.cost - coin)}</Text>
            </View>
          ) : (
            <View style={st.pillRow}>
              <Ionicons name="cash" size={12} color={AMBER_INK} />
              <Text style={[st.pillText, NUM, { color: AMBER_INK }]}>{num(o.cost)}</Text>
            </View>
          )}
        </Pressable>
      </View>
    )
  }

  const group = (label: string, hint: string, offers: Offer[]) => (
    <View key={label}>
      <View style={st.groupHead}>
        <Text style={st.groupLabel}>{label}</Text>
        <Text style={st.groupHint}>{hint}</Text>
      </View>
      {offers.map((o, i) => row(o, i === offers.length - 1))}
    </View>
  )

  return (
    <>
      <View style={st.card}>
        <Pressable
          onPress={() => { triggerHaptic('selection'); setOpen(v => !v) }}
          style={({ pressed }) => [st.head, pressed && { opacity: 0.85 }]}
        >
          <View style={st.headTile}>
            <Ionicons name="bulb" size={19} color="#9BE04B" />
          </View>
          <View style={st.headMid}>
            <Text style={st.headTitle}>O&apos;qish uchun</Text>
            <Text style={st.headSub}>Maslahat, o&apos;tkazish, to&apos;plam ochish, Pro sinovi</Text>
          </View>
          <Text style={[st.headCount, NUM]}>{heldCount}</Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={17}
            color={GRAY}
            style={st.headChevron}
          />
        </Pressable>

        {open && (
          <Reveal y={10} duration={240} style={st.bodyWrap}>
            {group('COIN EVAZIGA PRO', 'oyiga bir marta', [trialOffer])}
            {group('TESTGA YORDAMCHI', 'holda saqlanadi, testda bosiladi', itemOffers)}
            {group("OCHILADIGAN TO'PLAMLAR", 'bir marta — abadiy', setOffers)}

            <View style={[st.groupHead, st.groupHeadRow]}>
              <Text style={st.groupLabel}>COIN QANDAY TOPILADI</Text>
              <Pressable
                onPress={() => { triggerHaptic('medium'); navigation.navigate('ProblemSet', { setId: earnTarget }) }}
                hitSlop={6}
                style={({ pressed }) => [st.earnCta, pressed && { opacity: 0.7 }]}
              >
                <Text style={st.earnCtaText}>yig&apos;ishga</Text>
                <Ionicons name="chevron-forward" size={12} color={GREEN_TILE} />
              </Pressable>
            </View>

            {earnings.map((e, i) => (
              <View key={e.u} style={[st.earnRow, i === earnings.length - 1 ? undefined : st.rowLine]}>
                <Text style={st.earnLabel}>{e.u}</Text>
                <Text style={[st.earnValue, NUM]}>{e.v}</Text>
              </View>
            ))}

            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.navigate('Pro') }}
              style={({ pressed }) => [st.proRow, pressed && { opacity: 0.85 }]}
            >
              <View style={st.proTile}>
                <Ionicons name="person" size={18} color={GREEN_TILE} />
              </View>
              <View style={st.proMid}>
                <Text style={st.headTitle}>Pro rejalarini so&apos;mda ko&apos;rish</Text>
                <Text style={st.headSub}>oylik / 3 oylik / yillik to&apos;lov</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9AA995" />
            </Pressable>
          </Reveal>
        )}
      </View>

      {/* Xaridlar kovagi */}
      <View style={[st.card, st.basket]}>
        <View style={st.basketHead}>
          <Text style={st.basketTitle}>Xaridlar kovagi</Text>
          <Text style={[st.basketSum, NUM]}>
            jami {num(txLog.reduce((n, t) => n + t.cost, 0))} coin
          </Text>
        </View>
        {txLog.length === 0 ? (
          <Text style={st.basketEmpty}>
            Kovak bo&apos;sh. Testda adashsangiz — maslahat 30 coin.
          </Text>
        ) : (
          txLog.slice(0, 6).map((t, i) => (
            <View
              key={t.at + i}
              style={[st.basketRow, i === Math.min(txLog.length, 6) - 1 ? undefined : st.rowLine]}
            >
              <Text style={st.basketName} numberOfLines={1}>{t.title}</Text>
              <Text style={[st.basketCost, NUM]}>−{num(t.cost)}</Text>
              <Ionicons name="cash" size={12} color={AMBER_INK} />
            </View>
          ))
        )}
      </View>

      {/* Chek varaqasi */}
      <Sheet open={!!buying} onClose={() => setBuying(null)} title="CHEK · TASDIQLANG">
        {buying && (
          <>
            <Text style={st.receiptTitle}>{buying.title}</Text>
            <Text style={st.receiptDesc}>{buying.desc}</Text>
            <View style={st.receiptBox}>
              <View style={st.receiptLine}>
                <Text style={st.receiptLabel}>Narxi</Text>
                <View style={st.receiptPriceRow}>
                  <Ionicons name="cash" size={14} color={AMBER_INK} />
                  <Text style={[st.receiptPrice, NUM]}>{num(buying.cost)}</Text>
                </View>
              </View>
              <View style={[st.receiptLine, st.receiptLineTop]}>
                <Text style={st.receiptLabel}>To&apos;lovdan keyin</Text>
                <Text style={[st.receiptLeft, NUM]}>{num(coin - buying.cost)} coin qoladi</Text>
              </View>
            </View>
            <View style={st.receiptActions}>
              <Pressable
                onPress={() => { triggerHaptic('light'); setBuying(null) }}
                style={({ pressed }) => [st.cancelBtn, pressed && { opacity: 0.75 }]}
              >
                <Text style={st.cancelText}>Bekor</Text>
              </Pressable>
              <Pressable
                onPress={confirmBuy}
                style={({ pressed }) => [st.buyBtn, pressed && { opacity: 0.9 }]}
              >
                <Text style={st.buyText}>
                  <Text style={NUM}>{num(buying.cost)} coin</Text> — olaman
                </Text>
              </Pressable>
            </View>
            {buying.note && <Text style={st.receiptNote}>{buying.note}</Text>}
          </>
        )}
      </Sheet>
    </>
  )
}

type Pill = { backgroundColor: string; color: string; borderColor?: string; borderStyle?: 'solid' | 'dashed' }

function pillStyle(has: boolean, full: boolean, poor: boolean): Pill {
  if (has) return { backgroundColor: INK, color: '#FFFFFF' }
  if (full) return { backgroundColor: '#F1F4F0', color: '#9AA995' }
  if (poor) return { backgroundColor: '#FFFFFF', color: GRAY, borderColor: '#D7DED6', borderStyle: 'dashed' }
  return { backgroundColor: AMBER_BG, color: AMBER_INK }
}

const st = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  headTile: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: INK,
    alignItems: 'center', justifyContent: 'center',
  },
  headMid: { flex: 1, minWidth: 0 },
  headTitle: { fontSize: 14, fontWeight: '800', color: INK },
  headSub: { marginTop: 3, fontSize: 12, color: GRAY, lineHeight: 16 },
  headCount: { fontSize: 11.5, fontWeight: '800', color: GRAY },
  headChevron: { marginLeft: 4 },
  bodyWrap: { borderTopWidth: 1, borderTopColor: HAIR },

  groupHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FAFBF8',
    borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  groupHeadRow: { marginTop: 0 },
  groupLabel: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1.4, color: GRAY },
  groupHint: { fontSize: 10.5, fontWeight: '700', color: GRAY },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: HAIR },
  tile: {
    width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  mid: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 14, fontWeight: '800', color: INK, flexShrink: 1 },
  hold: {
    fontSize: 11, fontWeight: '700', color: GRAY, borderWidth: 1, borderColor: HAIR,
    borderRadius: 100, paddingHorizontal: 6, paddingVertical: 1,
  },
  desc: { marginTop: 3, fontSize: 12, lineHeight: 17, color: GRAY },
  goalBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  pill: {
    minHeight: 32, paddingHorizontal: 12, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent',
  },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillText: { fontSize: 12, fontWeight: '800' },

  stamp: {
    position: 'absolute', right: 96, top: '50%', marginTop: -11, zIndex: 10,
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: GREEN_TILE,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  stampText: { fontSize: 11, fontWeight: '800', color: GREEN_TILE },

  earnCta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  earnCtaText: { fontSize: 11.5, fontWeight: '800', color: GREEN_TILE },
  earnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  earnLabel: { fontSize: 12, color: GRAY },
  earnValue: { fontSize: 12, fontWeight: '800', color: AMBER_INK },

  proRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: '#FAFBF8', borderTopWidth: 1, borderTopColor: HAIR,
  },
  proTile: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#E7F7EE',
    alignItems: 'center', justifyContent: 'center',
  },
  proMid: { flex: 1, minWidth: 0 },

  basket: { marginTop: 12 },
  basketHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  basketTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  basketSum: { fontSize: 12, fontWeight: '800', color: AMBER_INK },
  basketEmpty: { paddingHorizontal: 14, paddingVertical: 13, fontSize: 12, color: GRAY },
  basketRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  basketName: { flex: 1, fontSize: 13, color: INK },
  basketCost: { fontSize: 13, fontWeight: '800', color: AMBER_INK },

  receiptTitle: { fontSize: 19, fontWeight: '800', color: INK },
  receiptDesc: { marginTop: 4, fontSize: 12.5, color: GRAY, lineHeight: 18 },
  receiptBox: { marginTop: 16, backgroundColor: '#F7F9F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  receiptLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  receiptLineTop: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: HAIR },
  receiptLabel: { fontSize: 12, fontWeight: '800', color: GRAY },
  receiptPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  receiptPrice: { fontSize: 15, fontWeight: '800', color: AMBER_INK },
  receiptLeft: { fontSize: 13, fontWeight: '800', color: INK },
  receiptActions: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelBtn: {
    flex: 1, height: 50, borderRadius: 100, backgroundColor: '#F1F4F0',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '800', color: GRAY },
  buyBtn: {
    flex: 1, height: 50, borderRadius: 100, backgroundColor: INK,
    alignItems: 'center', justifyContent: 'center',
  },
  buyText: { fontSize: 13, fontWeight: '800', color: '#CDE9AE' },
  receiptNote: { marginTop: 12, textAlign: 'center', fontSize: 11, color: '#9AA995' },
})

export default StudyAids
