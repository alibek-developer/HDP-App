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
import { NUM, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
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

const AMBER_INK = '#854D0E'
const GREEN_TILE = '#00A855'

const num = (n: number) => n.toLocaleString('en-US')

const StudyAids = () => {
  const C = useColors()
  const st = makeSt(C)
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

    const tone = pro || has
      ? GREEN_TILE
      : isAmber
        ? AMBER_INK
        : o.kind === 'trial'
          ? C.ink
          : C.ink3

    return (
      <View key={o.id} style={[st.row, last ? undefined : st.rowLine]}>
        {stamped && (
          <PopIn style={st.stamp}>
            <Text style={st.stampText}>olindi</Text>
          </PopIn>
        )}
        <View style={st.tile}>
          <Ionicons
            name={pro ? 'diamond' : has ? 'checkmark-circle' : GLYPH[o.icon]}
            size={20}
            color={tone}
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
            <Ionicons name="flag" size={15} color={goalId === o.id ? GREEN_TILE : C.ink4} />
          </Pressable>
        )}

        <Pressable
          onPress={() => tap(o)}
          hitSlop={8}
          style={({ pressed }) => [st.pill, pressed && { opacity: 0.55 }]}
        >
          {has ? (
            <View style={st.pillRow}>
              <Text style={[st.pillText, { color: GREEN_TILE }]}>
                {o.kind === 'trial' ? 'faol' : 'yechish'}
              </Text>
              {o.kind === 'set' && <Ionicons name="chevron-forward" size={13} color={GREEN_TILE} />}
            </View>
          ) : full ? (
            <Text style={[st.pillText, { color: C.ink4 }]}>to&apos;la</Text>
          ) : poor ? (
            <View style={st.pillRow}>
              <Ionicons name="trending-up" size={12} color={C.ink3} />
              <Text style={[st.pillText, { color: C.ink3 }]}>+{num(o.cost - coin)}</Text>
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
          <View style={st.headIcon}>
            <Ionicons name="bulb" size={20} color={GREEN_TILE} />
          </View>
          <View style={st.headMid}>
            <Text style={st.headTitle}>O&apos;qish uchun</Text>
            <Text style={st.headSub}>Maslahat, o&apos;tkazish, to&apos;plam ochish, Pro sinovi</Text>
          </View>
          <Text style={[st.headCount, NUM]}>{heldCount}</Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={17}
            color={C.ink3}
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
              <Ionicons name="chevron-forward" size={16} color={C.ink4} />
            </Pressable>
          </Reveal>
        )}
      </View>

      {/* Xaridlar tarixi */}
      <View style={[st.card, st.basket]}>
        <View style={st.basketHead}>
          <Text style={st.basketTitle}>Xaridlar tarixi</Text>
          <Text style={[st.basketSum, NUM]}>
            jami {num(txLog.reduce((n, t) => n + t.cost, 0))} coin
          </Text>
        </View>
        {txLog.length === 0 ? (
          <Text style={st.basketEmpty}>
            Hali bitta ham xarid qilinmagan.
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

const makeSt = (C: ThemeColors) => StyleSheet.create({
  card: { backgroundColor: C.surface },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 },
  headIcon: { width: 26, alignItems: 'center', justifyContent: 'center' },
  headMid: { flex: 1, minWidth: 0 },
  headTitle: { fontSize: 14, fontWeight: '600', color: C.ink },
  headSub: { marginTop: 3, fontSize: 12, color: C.ink3, lineHeight: 16 },
  headCount: { fontSize: 11.5, fontWeight: '600', color: C.ink3 },
  headChevron: { marginLeft: 4 },
  bodyWrap: { marginTop: 4 },

  groupHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 20, paddingBottom: 6,
  },
  groupHeadRow: { marginTop: 0 },
  groupLabel: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.4, color: C.ink3 },
  groupHint: { fontSize: 10.5, fontWeight: '500', color: C.ink3 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: C.line },
  tile: {
    width: 24, alignItems: 'center', justifyContent: 'center',
  },
  mid: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 14, fontWeight: '600', color: C.ink, flexShrink: 1 },
  hold: { fontSize: 11, fontWeight: '500', color: C.ink3 },
  desc: { marginTop: 3, fontSize: 12, lineHeight: 17, color: C.ink3 },
  goalBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  pill: {
    minHeight: 30, alignItems: 'flex-end', justifyContent: 'center',
  },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillText: { fontSize: 12, fontWeight: '600' },

  stamp: {
    position: 'absolute', right: 96, top: '50%', marginTop: -11, zIndex: 10,
    paddingHorizontal: 4, paddingVertical: 2,
  },
  stampText: { fontSize: 11, fontWeight: '700', color: GREEN_TILE },

  earnCta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  earnCtaText: { fontSize: 11.5, fontWeight: '600', color: GREEN_TILE },
  earnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 },
  earnLabel: { fontSize: 12, color: C.ink3 },
  earnValue: { fontSize: 12, fontWeight: '600', color: AMBER_INK },

  proRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 22,
  },
  proTile: {
    width: 26, alignItems: 'center', justifyContent: 'center',
  },
  proMid: { flex: 1, minWidth: 0 },

  basket: { marginTop: 28 },
  basketHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8,
  },
  basketTitle: { fontSize: 13.5, fontWeight: '600', color: C.ink },
  basketSum: { fontSize: 12, fontWeight: '600', color: AMBER_INK },
  basketEmpty: { paddingVertical: 8, fontSize: 12, color: C.ink3 },
  basketRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  basketName: { flex: 1, fontSize: 13, color: C.ink },
  basketCost: { fontSize: 13, fontWeight: '600', color: AMBER_INK },

  receiptTitle: { fontSize: 19, fontWeight: '600', color: C.ink },
  receiptDesc: { marginTop: 4, fontSize: 12.5, color: C.ink3, lineHeight: 18 },
  receiptBox: { marginTop: 16, backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  receiptLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  receiptLineTop: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line },
  receiptLabel: { fontSize: 12, fontWeight: '600', color: C.ink3 },
  receiptPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  receiptPrice: { fontSize: 15, fontWeight: '600', color: AMBER_INK },
  receiptLeft: { fontSize: 13, fontWeight: '600', color: C.ink },
  receiptActions: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelBtn: {
    flex: 1, height: 50, borderRadius: 100, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '600', color: C.ink3 },
  buyBtn: {
    flex: 1, height: 50, borderRadius: 100, backgroundColor: C.brandDeep,
    alignItems: 'center', justifyContent: 'center',
  },
  buyText: { fontSize: 13, fontWeight: '600', color: C.mint },
  receiptNote: { marginTop: 12, textAlign: 'center', fontSize: 11, color: C.ink4 },
})

export default StudyAids
