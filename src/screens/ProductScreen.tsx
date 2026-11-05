import { useMemo, useState } from 'react'
import {
  Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { PopIn, Reveal } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM } from '../theme/tokens'
import { GRAD_RAIL } from '../theme/solver'
import {
  PROBLEM_SETS, daysToEarn, findProduct, type Product, type ProductCat,
} from '../data/content'
import { PRODUCT_IMAGES } from '../data/productImages'

/**
 * Mahsulot sahifasi — rasm, to'liq tavsif, xususiyatlar, ombor qoldig'i,
 * «necha kunda» hisobi, buyurtma tugmasi va izohlar (o'qish + yozish).
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const INK = '#0E1A12'
const CANVAS = '#F3F7EE'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_BG = '#FEF3C7'
const AMBER_INK = '#854D0E'
const BAD = '#B4402F'
const LIME_TEXT = '#1C3214'

const num = (n: number) => n.toLocaleString('en-US')

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

/* ── ProductArt — janrga qarab gradient + belgi ── */

const ART_GLYPH: Record<string, keyof typeof Ionicons.glyphMap> = {
  phone: 'phone-portrait',
  tablet: 'tablet-portrait',
  buds: 'ear',
  headphones: 'headset',
  watch: 'watch',
  power: 'battery-full',
  speaker: 'volume-high',
  scooter: 'bicycle',
  bike: 'bicycle',
  rolik: 'disc',
  ball: 'football',
  chess: 'grid',
  rubik: 'cube',
  backpack: 'briefcase',
  tote: 'bag-handle',
  tee: 'body',
  hoddie: 'shirt',
  cap: 'baseball',
  bottle: 'water',
  thermos: 'cafe',
  cup: 'cafe-outline',
  discount: 'pricetag',
  voucher: 'ticket',
  studyset: 'school',
  folder: 'folder',
  penal: 'pencil',
  notebook: 'albums',
  pens: 'create',
  bloc: 'reader',
  pen: 'create',
  lamp: 'bulb',
}

const ART_TONE: Record<ProductCat, { grad: readonly [string, string]; ink: string }> = {
  Elektronika: { grad: ['#E7EEF8', '#CFDDF0'], ink: '#31506F' },
  Sport: { grad: ['#E4F0EF', '#C7E0DD'], ink: '#1F5A52' },
  'Kiyim-kechak': { grad: ['#F7E9DF', '#EFD2BF'], ink: '#7A4326' },
  "O'quv qurollari": { grad: ['#FBEFD5', '#F2DDB2'], ink: '#854D0E' },
  "O'yinlar": { grad: ['#EFE7F7', '#DCCBEC'], ink: '#5B3A7A' },
  "Uy-ro'zg'or": { grad: ['#E9F0E3', '#D2E3C4'], ink: '#3C5A2A' },
  Chegirmalar: { grad: ['#F5E8F0', '#E7CFDF'], ink: '#7A2E5A' },
}

const ProductArt = ({
  product,
  fill,
  size,
  radius = 16,
  iconSize = 40,
  children,
}: {
  product: Product
  fill?: boolean
  size?: number
  radius?: number
  iconSize?: number
  children?: React.ReactNode
}) => {
  const tone = ART_TONE[product.cat]
  const img = PRODUCT_IMAGES[product.id]
  return (
    <View
      style={[
        styles.art,
        { borderRadius: radius },
        fill ? { width: '100%', aspectRatio: 1 } : { width: size, height: size },
      ]}
    >
      <LinearGradient
        colors={tone.grad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[ABS_FILL, { borderRadius: radius }]}
      />
      {img ? (
        <Image
          source={img}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: radius,
            backgroundColor: '#FFFFFF',
          }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons name={ART_GLYPH[product.art] ?? 'cube'} size={iconSize} color={tone.ink} />
      )}
      {children}
    </View>
  )
}

/* ── Varaka (web `Sheet`) ── */

const Sheet = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      {open && (
        <View style={sh.root}>
          <Pressable onPress={onClose} style={[ABS_FILL, sh.backdrop]} />
          <Reveal y={40} duration={260} style={sh.outer}>
            <View style={[sh.sheet, { paddingBottom: insets.bottom + 20 }]}>
              <View style={sh.handle} />
              <View style={sh.headRow}>
                <Text style={sh.title}>{title}</Text>
                <Pressable
                  onPress={() => { triggerHaptic('light'); onClose() }}
                  hitSlop={10}
                  accessibilityLabel="Yopish"
                  style={({ pressed }) => [sh.closeBtn, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons name="close" size={17} color={GRAY} />
                </Pressable>
              </View>
              {children}
            </View>
          </Reveal>
        </View>
      )}
    </Modal>
  )
}

const sh = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: 'rgba(14,26,18,0.55)' },
  outer: { width: '100%', maxWidth: 430, alignSelf: 'center' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: HAIR, alignSelf: 'center', marginBottom: 12 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: GRAY },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
})

/* ── Yulduzlar ── */

const Stars = ({ value, size = 12 }: { value: number; size?: number }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Ionicons
        key={i}
        name={i <= Math.round(value) ? 'star' : 'star-outline'}
        size={size}
        color={i <= Math.round(value) ? '#E8A33D' : '#D7DED6'}
      />
    ))}
  </View>
)

/** yulduz tanlash qatori */
const StarsRow = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map(i => (
      <Pressable
        key={i}
        onPress={() => { triggerHaptic('selection'); onChange(i) }}
        hitSlop={6}
        accessibilityLabel={`${i} yulduz`}
        style={({ pressed }) => [pressed && { transform: [{ scale: 0.9 }] }]}
      >
        <Ionicons
          name={i <= value ? 'star' : 'star-outline'}
          size={15}
          color={i <= value ? '#E8A33D' : '#D7DED6'}
        />
      </Pressable>
    ))}
  </View>
)

const ProductScreen = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>()
  const insets = useSafeAreaInsets()
  const id = route.params.id
  const exit = useExit('Shop')
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
  const all = mine

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Mahsulot topilmadi</Text>
        <Text style={styles.notFoundSub}>Do'kon ro'yxatidan boshqa sovg'a tanlang.</Text>
        <Pressable
          onPress={() => { triggerHaptic('light'); navigation.navigate('Shop') }}
          style={({ pressed }) => [styles.notFoundBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.notFoundBtnText}>Do'konga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  const left = Math.max(0, product.stock - (stockTaken[product.id] ?? 0))
  const count = all.length
  const avg = count > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / count : 0
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
    setTimeout(() => setSent(false), 1800)
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

  const railColors: readonly [string, string] = out ? [BAD, BAD] : GRAD_RAIL

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: 132 + insets.bottom }]}
      >
        {/* ── Yuqori panel ── */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <View style={styles.topRow}>
            <Pressable
              onPress={exit}
              accessibilityLabel="Orqaga"
              style={({ pressed }) => [styles.topBtn, pressed && { transform: [{ scale: 0.94 }] }]}
            >
              <Ionicons name="chevron-back" size={17} color={INK} />
            </Pressable>
            <Text numberOfLines={1} style={styles.topTitle}>{product.title}</Text>
            <Pressable
              onPress={() => { triggerHaptic('light'); toggleFav(product.id) }}
              accessibilityLabel="Sevimli"
              style={({ pressed }) => [styles.topBtn, pressed && { transform: [{ scale: 0.94 }] }]}
            >
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={17} color={fav ? BAD : GRAY} />
            </Pressable>
          </View>
        </View>

        {/* ── Rasm ── */}
        <View style={styles.artWrap}>
          <ProductArt product={product} fill radius={18} iconSize={150}>
            <View style={styles.artCat}>
              <Text style={styles.artCatText}>{product.cat}</Text>
            </View>
            <View style={styles.artStock}>
              <Text style={[styles.artStockText, NUM, { color: out ? BAD : INK }]}>
                {out ? 'tugagan' : `${left} dona`}
              </Text>
            </View>
          </ProductArt>
        </View>

        {/* ── Narx varag'i ── */}
        <View style={styles.section}>
          <View style={styles.priceCard}>
            <LinearGradient colors={railColors} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.priceRail} />
            <View style={styles.priceBody}>
              <Text style={styles.priceTitle}>{product.title}</Text>
              <View style={styles.rateRow}>
                {count > 0 ? (
                  <>
                    <Stars value={avg} />
                    <Text style={[styles.rateValue, NUM]}>{avg.toFixed(1)}</Text>
                    <Text style={styles.rateCount}>· {count} izoh</Text>
                  </>
                ) : (
                  <Text style={styles.rateEmpty}>Yangi sovg'a · hali izoh yo'q</Text>
                )}
              </View>

              <View style={styles.priceLine}>
                <View style={styles.priceLeft}>
                  <Ionicons name="cash" size={20} color={AMBER_INK} />
                  <Text style={[styles.priceValue, NUM]}>{num(product.price)}</Text>
                </View>
                <View style={styles.priceRight}>
                  <Text style={styles.walletLabel}>hamyonda</Text>
                  <Text style={[styles.walletValue, NUM, { color: coin >= product.price ? '#0B6E4F' : AMBER_INK }]}>
                    {num(coin)}
                  </Text>
                </View>
              </View>

              <View style={styles.timerRow}>
                <Ionicons name="time" size={13} color="#5FAF22" />
                <Text style={styles.timerText}>
                  {out
                    ? 'Keyingi partiyaga navbatga turing'
                    : gap > 0
                      ? `yana ${num(gap)} coin · taxminan ${daysToEarn(gap)} kunlik yechim`
                      : 'hozir olishga yetarli'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Tavsif ── */}
        <View style={styles.section}>
          <Text style={styles.kicker}>MAHSULOT HAQIDA</Text>
          <View style={styles.descCard}>
            <Text style={styles.descText}>{product.desc}</Text>

            <View style={styles.specWrap}>
              {product.specs.map((sp, i) => (
                <View
                  key={sp.k}
                  style={[styles.specRow, i === product.specs.length - 1 && { borderBottomWidth: 0 }]}
                >
                  <Text style={styles.specK}>{sp.k}</Text>
                  <Text style={styles.specV}>{sp.v}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tiles}>
              {[
                { icon: 'car' as const, k: 'Yetkazib berish', v: 'Toshkent 2 kun · viloyat 4 kun' },
                { icon: 'shield-checkmark' as const, k: 'Kafolat', v: 'Rasmiy hujjat bilan' },
              ].map(b => (
                <View key={b.k} style={styles.tile}>
                  <Ionicons name={b.icon} size={15} color="#5FAF22" />
                  <Text style={styles.tileK}>{b.k}</Text>
                  <Text style={styles.tileV}>{b.v}</Text>
                </View>
              ))}
            </View>
          </View>

          <Pressable
            onPress={() => { triggerHaptic('selection'); setGoal(isGoal ? null : product.id) }}
            style={({ pressed }) => [
              styles.goalBtn,
              isGoal ? styles.goalBtnOn : styles.goalBtnIdle,
              pressed && { opacity: 0.94 },
            ]}
          >
            <View style={styles.goalLeft}>
              <Ionicons name="flag" size={16} color={isGoal ? '#9BE04B' : GRAY} />
              <Text style={[styles.goalLabel, { color: isGoal ? '#CDE9AE' : INK }]}>
                {isGoal ? 'Maqsad qilib qo\'yilgan' : 'Maqsad qilib qo\'yish'}
              </Text>
            </View>
            <Text style={[styles.goalHint, { color: isGoal ? 'rgba(205,233,174,0.6)' : GRAY }]}>
              {isGoal ? 'olib tashlash' : 'do\'konda ko\'rinadi'}
            </Text>
          </Pressable>
        </View>

        {/* ── Izohlar ── */}
        <View style={styles.section}>
          <View style={styles.revHead}>
            <View style={styles.revTitleRow}>
              <Ionicons name="chatbubble" size={16} color={GRAY} />
              <Text style={styles.revTitle}>Izohlar</Text>
            </View>
            <Text style={[styles.revCount, NUM]}>{count} ta</Text>
          </View>

          {/* Yozish */}
          <View style={styles.compose}>
            <View style={styles.composeTop}>
              <Text style={styles.composeLabel}>Fikringizni qoldiring</Text>
              <StarsRow value={draftStars} onChange={setDraftStars} />
            </View>
            <TextInput
              value={draft}
              onChangeText={t => setDraft(t.slice(0, 300))}
              multiline
              numberOfLines={3}
              placeholder="Sovg'ani qanchalik tez oldingiz? Sifati qanday?"
              placeholderTextColor="#9AA995"
              textAlignVertical="top"
              style={styles.composeInput}
            />
            <View style={styles.composeBottom}>
              <Text style={[styles.composeCount, NUM, { color: draft.length > 280 ? BAD : '#9AA995' }]}>
                {draft.length}/300
              </Text>
              <Pressable
                onPress={submit}
                style={({ pressed }) => [styles.sendBtn, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                {draft.trim().length >= 3 ? (
                  <LinearGradient
                    colors={['#9BE04B', '#7ED321']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={ABS_FILL}
                  />
                ) : null}
                <Text
                  style={[
                    styles.sendText,
                    draft.trim().length < 3 ? { color: '#9AA995' } : { color: LIME_TEXT },
                  ]}
                >
                  {sent ? 'Yozildi' : 'Izoh qoldirish'}
                </Text>
              </Pressable>
            </View>
            {bought && (
              <View style={styles.boughtRow}>
                <Ionicons name="checkmark" size={12} color="#0B6E4F" />
                <Text style={styles.boughtText}>Siz bu sovg'ani buyurtma qilgansiz</Text>
              </View>
            )}
          </View>

          {/* Ro'yxat */}
          <View style={styles.revList}>
            {all.map((r, i) => (
              <Reveal key={r.text + i} y={8} duration={240} style={styles.revCard}>
                <View style={styles.revTop}>
                  <View style={[styles.avatar, { backgroundColor: r.own ? INK : '#EDF3E7' }]}>
                    <Text style={[styles.avatarText, { color: r.own ? '#9BE04B' : '#33501F' }]}>
                      {r.name.slice(0, 1)}
                    </Text>
                  </View>
                  <View style={styles.revWho}>
                    <Text numberOfLines={1} style={styles.revName}>
                      {r.name}
                      {r.own ? <Text style={styles.revOwn}> — siz</Text> : null}
                    </Text>
                    <View style={styles.revMeta}>
                      <Stars value={r.rating} size={10} />
                      <Text style={styles.revDate}>{relDate(r.at)}</Text>
                    </View>
                  </View>
                  {r.bought && (
                    <View style={styles.boughtBadge}>
                      <Text style={[styles.boughtBadgeText, NUM]}>sotib olgan</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.revText}>{r.text}</Text>
              </Reveal>
            ))}

            {count === 0 && (
              <View style={styles.revEmpty}>
                <Text style={styles.revEmptyTitle}>Hali izoh yo'q</Text>
                <Text style={styles.revEmptySub}>
                  Bu sovg'ani olgan birinchi kishi bo'ling — yuqoridagi maydongga fikringizni yozing.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── Buyurtma paneli ── */}
      <View style={[styles.orderBar, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.orderRow}>
          <View style={styles.orderPrice}>
            <Text style={styles.orderPriceLabel}>narxi</Text>
            <View style={styles.orderPriceRow}>
              <Ionicons name="cash" size={14} color={AMBER_INK} />
              <Text style={[styles.orderPriceValue, NUM]}>{num(product.price)}</Text>
            </View>
          </View>
          {out ? (
            <Pressable
              onPress={() => {
                triggerHaptic(isGoal ? 'warning' : 'success')
                if (!isGoal) setGoal(product.id)
              }}
              style={({ pressed }) => [
                styles.orderBtn,
                isGoal ? styles.orderBtnQueueOn : styles.orderBtnQueue,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={[styles.orderBtnText, { color: isGoal ? '#8A9784' : '#CDE9AE' }]}>
                {isGoal ? 'Navbatga qo\'yildingiz' : 'Tugagan — navbatga qo\'yish'}
              </Text>
            </Pressable>
          ) : canBuy ? (
            <Pressable
              onPress={() => { triggerHaptic('medium'); setConfirm(true) }}
              style={({ pressed }) => [styles.orderBtn, styles.orderBtnLime, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient
                colors={['#9BE04B', '#7ED321']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={ABS_FILL}
              />
              <Text style={[styles.orderBtnText, { color: LIME_TEXT }]}>Buyurtma berish</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.navigate('ProblemSet', { setId: earnTarget }) }}
              style={({ pressed }) => [
                styles.orderBtn,
                styles.orderBtnInk,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <Ionicons name="cash" size={15} color="#9BE04B" />
              <Text style={[styles.orderBtnText, NUM, { color: '#CDE9AE' }]}>
                {num(gap)} coin yig'ish
              </Text>
            </Pressable>
          )}
        </View>
        {bought && !out && (
          <Text style={styles.orderNote}>Buyurtmangiz qabul qilindi — yana {left} ta qoldi</Text>
        )}
      </View>

      {/* ── Chek varaqasi ── */}
      <Sheet open={confirm} onClose={() => setConfirm(false)} title="BUYURTMA · TASDIQLANG">
        <View style={styles.confirmTop}>
          <ProductArt product={product} size={56} radius={12} iconSize={26} />
          <View style={styles.confirmWho}>
            <Text numberOfLines={1} style={styles.confirmTitle}>{product.title}</Text>
            <Text style={styles.confirmSub}>{product.cat} · {left} ta qoldi</Text>
          </View>
        </View>
        <View style={styles.confirmRows}>
          {[
            { k: 'Narxi', v: `${num(product.price)} coin` },
            { k: 'Hamyoningizda', v: `${num(coin)} coin` },
            { k: 'To\'lovdan keyin', v: `${num(coin - product.price)} coin qoladi` },
            { k: 'Yetkazib berish', v: '2–4 kun, bepul' },
          ].map((r, i, arr) => (
            <View
              key={r.k}
              style={[styles.confirmRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.confirmK}>{r.k}</Text>
              <Text style={[styles.confirmV, NUM]}>{r.v}</Text>
            </View>
          ))}
        </View>
        <View style={styles.confirmBtns}>
          <Pressable
            onPress={() => { triggerHaptic('light'); setConfirm(false) }}
            style={({ pressed }) => [styles.confirmCancel, pressed && { opacity: 0.9 }]}
          >
            <Ionicons name="close" size={14} color={GRAY} style={styles.confirmIcon} />
            <Text style={styles.confirmCancelText}>Bekor</Text>
          </Pressable>
          <Pressable
            onPress={onBuy}
            style={({ pressed }) => [styles.confirmOk, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={['#9BE04B', '#7ED321']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ABS_FILL}
            />
            <Text style={[styles.confirmOkText, { color: LIME_TEXT }]}>
              {product.price} coin — olaman
            </Text>
          </Pressable>
        </View>
      </Sheet>

      {/* ── Buyurtma qabul qilindi ── */}
      <Modal visible={done} transparent animationType="none" onRequestClose={() => setDone(false)}>
        {done && (
          <View style={styles.doneRoot}>
            <PopIn style={styles.doneCardWrap}>
              <View style={styles.doneCard}>
                <LinearGradient
                  colors={['#9BE04B', '#5FAF22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneBadge}
                >
                  <Ionicons name="checkmark" size={30} color="#12300A" />
                </LinearGradient>
                <Text style={styles.doneTitle}>Buyurtma qabul qilindi</Text>
                <Text style={styles.doneText}>
                  <Text style={styles.doneStrong}>{product.title}</Text> — {num(product.price)} coin yechildi.
                  Buyurtma Profilingizdagi buyurtmalar tarixiga saqlandi.
                </Text>
                <View style={styles.doneBtns}>
                  <Pressable
                    onPress={() => { triggerHaptic('light'); setDone(false); exit() }}
                    style={({ pressed }) => [styles.doneShop, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.doneShopText}>Do'konga</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { triggerHaptic('medium'); setDone(false); navigation.navigate('Profile') }}
                    style={({ pressed }) => [styles.doneProfile, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.doneProfileText}>Profilim</Text>
                  </Pressable>
                </View>
              </View>
            </PopIn>
          </View>
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CANVAS },
  content: {},

  topBar: {
    backgroundColor: 'rgba(243,247,238,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  topRow: { height: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  topBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
  },
  topTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: INK },

  notFound: { flex: 1, backgroundColor: CANVAS, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  notFoundTitle: { fontSize: 16, fontWeight: '800', color: INK },
  notFoundSub: { fontSize: 12.5, color: GRAY, textAlign: 'center' },
  notFoundBtn: {
    marginTop: 8,
    height: 46,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: INK,
  },
  notFoundBtnText: { fontSize: 13.5, fontWeight: '800', color: '#CDE9AE' },

  art: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  artWrap: { paddingHorizontal: 16, paddingTop: 16 },
  artCat: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(14,26,18,0.82)',
    borderRadius: 8,
  },
  artCatText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase', color: '#EAF3E2' },
  artStock: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
  },
  artStockText: { fontSize: 11, fontWeight: '800' },

  section: { paddingHorizontal: 16, marginTop: 16 },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  priceRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  priceBody: { paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  priceTitle: { fontSize: 21, lineHeight: 27, fontWeight: '800', color: INK },
  rateRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateValue: { fontSize: 12, fontWeight: '800', color: INK },
  rateCount: { fontSize: 12, fontWeight: '700', color: GRAY },
  rateEmpty: { fontSize: 12, fontWeight: '700', color: GRAY },
  priceLine: { marginTop: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  priceLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceValue: { fontSize: 28, lineHeight: 28, fontWeight: '800', color: AMBER_INK },
  priceRight: { alignItems: 'flex-end' },
  walletLabel: { fontSize: 11, fontWeight: '700', color: GRAY },
  walletValue: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  timerRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  timerText: { fontSize: 11.5, fontWeight: '700', color: GRAY, flex: 1 },

  kicker: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1.4, color: GRAY, marginBottom: 8 },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  descText: { fontSize: 13.5, lineHeight: 22, color: INK },
  specWrap: { marginTop: 16, borderTopWidth: 1, borderTopColor: HAIR },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  specK: { fontSize: 12.5, fontWeight: '700', color: GRAY },
  specV: { fontSize: 13, fontWeight: '800', color: INK, textAlign: 'right', flexShrink: 1 },
  tiles: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '48.5%',
    backgroundColor: '#F7F9F6',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  tileK: { marginTop: 6, fontSize: 11, fontWeight: '800', color: GRAY },
  tileV: { marginTop: 3, fontSize: 12, fontWeight: '700', lineHeight: 17, color: INK },

  goalBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalBtnIdle: { backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1 },
  goalBtnOn: { backgroundColor: INK, borderColor: INK, borderWidth: 1 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  goalLabel: { fontSize: 13, fontWeight: '800' },
  goalHint: { fontSize: 11.5, fontWeight: '700' },

  revHead: { marginBottom: 12, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  revTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  revTitle: { fontSize: 17, fontWeight: '800', color: INK },
  revCount: { fontSize: 12, fontWeight: '800', color: GRAY },

  compose: {
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  composeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  composeLabel: { fontSize: 12.5, fontWeight: '800', color: INK },
  composeInput: {
    marginTop: 10,
    minHeight: 72,
    backgroundColor: '#F7F9F6',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: '500',
    color: INK,
  },
  composeBottom: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  composeCount: { fontSize: 11, fontWeight: '700' },
  sendBtn: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#F1F4F0',
    overflow: 'hidden',
  },
  sendText: { fontSize: 13, fontWeight: '800' },
  boughtRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  boughtText: { fontSize: 11, fontWeight: '700', color: '#0B6E4F' },

  revList: { marginTop: 12, gap: 10 },
  revCard: {
    backgroundColor: '#FFFFFF',
    borderColor: HAIR,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  revTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  avatarText: { fontSize: 12, fontWeight: '800' },
  revWho: { flex: 1, minWidth: 0 },
  revName: { fontSize: 13, fontWeight: '800', color: INK },
  revOwn: { fontSize: 10.5, fontWeight: '700', color: GRAY },
  revMeta: { marginTop: 3, flexDirection: 'row', alignItems: 'center', gap: 8 },
  revDate: { fontSize: 10.5, fontWeight: '700', color: '#9AA995' },
  boughtBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: AMBER_BG,
    borderRadius: 100,
  },
  boughtBadgeText: { fontSize: 9.5, fontWeight: '800', textTransform: 'uppercase', color: AMBER_INK },
  revText: { marginTop: 8, fontSize: 13, lineHeight: 20, color: '#33452F' },
  revEmpty: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED6',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  revEmptyTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  revEmptySub: { marginTop: 4, fontSize: 12.5, lineHeight: 19, color: GRAY },

  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  orderBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(243,247,238,0.94)',
    borderTopWidth: 1,
    borderTopColor: HAIR,
  },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderPrice: {},
  orderPriceLabel: { fontSize: 10.5, fontWeight: '700', color: GRAY },
  orderPriceRow: { marginTop: 2, flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderPriceValue: { fontSize: 17, lineHeight: 17, fontWeight: '800', color: AMBER_INK },
  orderBtn: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
  },
  orderBtnLime: { backgroundColor: '#7ED321' },
  orderBtnInk: { backgroundColor: INK },
  orderBtnQueue: { backgroundColor: INK },
  orderBtnQueueOn: { backgroundColor: '#E9EEE8' },
  orderBtnText: { fontSize: 13.5, fontWeight: '800' },
  orderNote: { marginTop: 8, textAlign: 'center', fontSize: 11, fontWeight: '700', color: GRAY },

  confirmTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  confirmWho: { flex: 1, minWidth: 0 },
  confirmTitle: { fontSize: 15, fontWeight: '800', color: INK },
  confirmSub: { marginTop: 2, fontSize: 11.5, fontWeight: '700', color: GRAY },
  confirmRows: { marginTop: 16, backgroundColor: '#F7F9F6', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  confirmK: { fontSize: 12, fontWeight: '700', color: GRAY },
  confirmV: { fontSize: 13, fontWeight: '800', color: INK },
  confirmBtns: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  confirmCancel: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#F1F4F0',
    flexDirection: 'row',
  },
  confirmIcon: { marginRight: 4 },
  confirmCancelText: { fontSize: 13, fontWeight: '800', color: GRAY },
  confirmOk: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#7ED321',
    overflow: 'hidden',
  },
  confirmOkText: { fontSize: 13, fontWeight: '800' },

  doneRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(14,26,18,0.6)',
  },
  doneCardWrap: { width: '100%' },
  doneCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingTop: 26, paddingHorizontal: 20, paddingBottom: 22, alignItems: 'center' },
  doneBadge: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
  doneTitle: { marginTop: 16, fontSize: 19, fontWeight: '800', color: INK },
  doneText: { marginTop: 8, fontSize: 13, lineHeight: 20, color: GRAY, textAlign: 'center' },
  doneStrong: { fontWeight: '800', color: INK },
  doneBtns: { marginTop: 20, flexDirection: 'row', gap: 10, width: '100%' },
  doneShop: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#F1F4F0',
  },
  doneShopText: { fontSize: 13, fontWeight: '800', color: INK },
  doneProfile: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: INK,
  },
  doneProfileText: { fontSize: 13, fontWeight: '800', color: '#CDE9AE' },
})

export default ProductScreen
