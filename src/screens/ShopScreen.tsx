import { useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import type { TabKey } from '../components/BottomNav'
import { Reveal } from '../components/Reveal'
import Sheet from '../components/Sheet'
import StudyAids from '../components/StudyAids'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, AMBER_BTN_GRAD, NUM } from '../theme/tokens'
import { GRAD_LIME } from '../theme/solver'
import {
  PRODUCTS, PRODUCT_CATS, daysToEarn,
  type Product, type ProductCat,
} from '../data/content'
import { PRODUCT_IMAGES } from '../data/productImages'

/**
 * Do'kon — sovg'a bozori. Coinlar haqiqiy narsa oladi: telefon, sumka, kitob.
 * Ikki ustunli kartalar, ustida balans + qidiruv/sevimli/tarix tugmalari va
 * janr chiplari.
 *
 * Web'ning `ShopScreen.tsx` ekvivalenti. «O'qish uchun» javoni va xaridlar
 * kovagi `StudyAids` komponentida.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const INK = '#0E1A12'
const CANVAS = '#F3F7EE'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_INK = '#854D0E'
const BAD = '#B4402F'

type Filter = 'all' | ProductCat | 'fav'
type Sort = 'yangi' | 'arzon' | 'qimmat'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'yangi', label: 'Ombordagi kabi' },
  { key: 'arzon', label: 'Arzonlari oldinda' },
  { key: 'qimmat', label: 'Qimmatlari oldinda' },
]

const num = (n: number) => n.toLocaleString('en-US')

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}`
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
        art.box,
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

const art = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
})

/* ── Ekran ── */

const ShopScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
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
  const toggleFav = useApp(s => s.toggleFav)

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
    return sorted
  }, [filter, favs, query, sort])

  const goal = goalId ? PRODUCTS.find(p => p.id === goalId) ?? null : null
  const spent = orders.reduce((n, o) => n + o.price, 0)

  const counts: Partial<Record<ProductCat, number>> = {}
  let available = 0
  for (const p of PRODUCTS) {
    if (left(p) === 0) continue
    available++
    counts[p.cat] = (counts[p.cat] ?? 0) + 1
  }

  const onTab = (key: TabKey) => {
    if (key === 'shop') return
    navigation.navigate(key === 'home' ? 'Home' : key === 'problems' ? 'Problems' : 'Profile')
  }

  const chip = (key: Filter, label: string) => {
    const on = filter === key
    const count = key === 'fav' ? favs.length : key === 'all' ? available : counts[key] ?? 0
    return (
      <Pressable
        key={key}
        onPress={() => { triggerHaptic('selection'); setFilter(key) }}
        style={({ pressed }) => [styles.chip, on ? styles.chipOn : styles.chipIdle, pressed && { opacity: 0.85 }]}
      >
        <Text style={[styles.chipText, on ? styles.chipTextOn : styles.chipTextIdle]}>{label}</Text>
        {count > 0 && (
          <Text style={[styles.chipCount, NUM, { color: on ? 'rgba(255,255,255,0.7)' : '#9AA995' }]}>{count}</Text>
        )}
      </Pressable>
    )
  }

  const card = (p: Product) => {
    const stock = left(p)
    const out = stock === 0
    const fav = favs.includes(p.id)
    const count = reviews.filter(r => r.productId === p.id).length
    return (
      <Pressable
        key={p.id}
        onPress={() => { triggerHaptic('light'); navigation.navigate('Product', { id: p.id }) }}
        style={({ pressed }) => [styles.cardCell, pressed && { transform: [{ scale: 0.985 }] }] }
      >
        <Reveal y={12} duration={280} style={styles.cardInner}>
          <ProductArt product={p} fill radius={12} iconSize={62}>
            <Pressable
              onPress={() => { triggerHaptic('light'); toggleFav(p.id) }}
              hitSlop={6}
              accessibilityLabel="Sevimli"
              style={({ pressed }) => [styles.favBtn, pressed && { transform: [{ scale: 0.9 }] }]}
            >
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={14} color={fav ? BAD : '#9AA995'} />
            </Pressable>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{p.cat}</Text>
            </View>
          </ProductArt>

          <View style={styles.cardBody}>
            <Text numberOfLines={1} style={styles.cardTitle}>{p.title}</Text>
            <Text numberOfLines={2} style={styles.cardBlurb}>{p.blurb}</Text>
            <Text style={[styles.cardStock, NUM, { color: out ? BAD : INK }]}>
              {out ? 'Tugagan' : `${stock} dona qoldi`}
            </Text>

            <View style={styles.cardFoot}>
              <View style={styles.cardPriceRow}>
                <Ionicons name="cash" size={13} color={AMBER_INK} />
                <Text style={[styles.cardPrice, NUM]}>{num(p.price)}</Text>
              </View>
              <View style={styles.cardRateRow}>
                {count > 0 ? (
                  <>
                    <Ionicons name="chatbubble-outline" size={11} color={GRAY} />
                    <Text style={[styles.cardRate, NUM]}>{count}</Text>
                  </>
                ) : (
                  <Text style={styles.cardNew}>Yangi</Text>
                )}
              </View>
            </View>
          </View>
        </Reveal>
      </Pressable>
    )
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── Sarlavha ── */}
        <View style={styles.head}>
          <Text style={styles.h1}>Do'kon</Text>

          {/* Balans + qidiruv / sevimli / tarix */}
          <View style={styles.balRow}>
            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.navigate('Profile') }}
              style={({ pressed }) => [styles.balBtn, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <Text style={styles.balLabel}>Balans:</Text>
              <Reveal key={String(coin)} y={6} duration={300} style={styles.balCoin}>
                <LinearGradient
                  colors={AMBER_BTN_GRAD}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0.8, y: 1 }}
                  style={styles.coinBadge}
                >
                  <Ionicons name="cash" size={13} color="#7A4A0B" />
                </LinearGradient>
                <Text style={[styles.balValue, NUM]}>{num(coin)}</Text>
              </Reveal>
            </Pressable>

            <View style={styles.iconRow}>
              <Pressable
                onPress={() => { triggerHaptic('selection'); setSearchOpen(v => !v); setQuery('') }}
                accessibilityLabel="search"
                style={({ pressed }) => [
                  styles.iconBtn,
                  searchOpen ? styles.iconBtnOn : styles.iconBtnIdle,
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
              >
                <Ionicons name="search" size={17} color={searchOpen ? '#FFFFFF' : INK} />
              </Pressable>
              <Pressable
                onPress={() => { triggerHaptic('selection'); setFilter(f => (f === 'fav' ? 'all' : 'fav')) }}
                accessibilityLabel="fav"
                style={({ pressed }) => [
                  styles.iconBtn,
                  filter === 'fav' ? styles.iconBtnOn : styles.iconBtnIdle,
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
              >
                <Ionicons name="heart" size={17} color={filter === 'fav' ? '#FFFFFF' : INK} />
              </Pressable>
              <Pressable
                onPress={() => { triggerHaptic('selection'); setHistoryOpen(true) }}
                accessibilityLabel="history"
                style={({ pressed }) => [styles.iconBtn, styles.iconBtnIdle, pressed && { transform: [{ scale: 0.94 }] }]}
              >
                <Ionicons name="time" size={17} color={INK} />
              </Pressable>
            </View>
          </View>

          {searchOpen && (
            <View style={styles.searchWrap}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color={GRAY} />
                <TextInput
                  autoFocus
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Telefon, sumka, ruchka..."
                  placeholderTextColor="#9AA995"
                  style={styles.searchInput}
                />
                {query.length > 0 && (
                  <Pressable
                    onPress={() => setQuery('')}
                    hitSlop={10}
                    accessibilityLabel="Tozalash"
                    style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                  >
                    <Ionicons name="close" size={16} color={GRAY} />
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* Filtr chiplari */}
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => { triggerHaptic('selection'); setSortOpen(true) }}
              accessibilityLabel="Saralash"
              style={({ pressed }) => [
                styles.sortBtn,
                sort === 'yangi' ? styles.sortBtnIdle : styles.sortBtnOn,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Ionicons name="options" size={17} color={sort === 'yangi' ? INK : '#FFFFFF'} />
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
              style={styles.chipFlex}
            >
              {chip('all', 'Barchasi')}
              {PRODUCT_CATS.map(c => chip(c, c))}
              {favs.length > 0 && chip('fav', 'Sevimli')}
            </ScrollView>
          </View>

          {/* Maqsad chizig'i */}
          {goal && (
            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.navigate('Product', { id: goal.id }) }}
              style={({ pressed }) => [styles.goalCard, pressed && { opacity: 0.94 }]}
            >
              <View style={styles.goalTop}>
                <View style={styles.goalTitleRow}>
                  <Ionicons name="flag" size={13} color="#CDE9AE" style={styles.goalFlag} />
                  <Text numberOfLines={1} style={styles.goalTitle}>{goal.title}</Text>
                </View>
                <Text style={[styles.goalRight, NUM]}>
                  {Math.max(0, goal.price - coin) === 0 ? 'olish mumkin' : `${num(goal.price - coin)} coin qoldi`}
                </Text>
              </View>
              <View style={styles.goalTrack}>
                <View
                  style={{ width: `${Math.min(100, (coin / goal.price) * 100)}%`, height: 5, borderRadius: 100, overflow: 'hidden' }}
                >
                  <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ABS_FILL} />
                </View>
              </View>
              <Text style={[styles.goalNote, NUM]}>
                {num(coin)} / {num(goal.price)} ·{' '}
                {goal.price - coin <= 0 ? 'bugun olishingiz mumkin' : `taxminan ${daysToEarn(goal.price - coin)} kun`}
              </Text>
            </Pressable>
          )}
        </View>

        {/* ── Ikki ustunli tovar ── */}
        <View style={styles.gridWrap}>
          {list.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {filter === 'fav' ? 'Sevimlilar bo\'sh' : 'Bu javonda hozircha yo\'q'}
              </Text>
              <Text style={styles.emptySub}>
                {filter === 'fav'
                  ? 'Kartadagi yurakchani bosib, keyin oladigan sovug\'alarni yig\'ib qo\'ying.'
                  : 'Boshqa janrni tanlang yoki qidiruvni tozalang.'}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>{list.map(card)}</View>
          )}
        </View>

        {/* ── O'qish uchun: yordamchilar, ochishlar, Pro ── */}
        <View style={styles.aidsWrap}>
          <StudyAids />
        </View>
      </ScrollView>

      {/* ── Saralash varaqasi ── */}
      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="SARALASH">
        <View style={styles.sortList}>
          {SORTS.map(o => (
            <Pressable
              key={o.key}
              onPress={() => { triggerHaptic('selection'); setSort(o.key); setSortOpen(false) }}
              style={({ pressed }) => [styles.sortRow, pressed && { backgroundColor: '#F7F9F6' }]}
            >
              <Text style={styles.sortLabel}>{o.label}</Text>
              {sort === o.key && (
                <View style={styles.sortCheck}>
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </Sheet>

      {/* ── Buyurtmalar tarixi ── */}
      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="BUYURTMALAR">
        {orders.length === 0 ? (
          <Text style={styles.histEmpty}>
            Hali birorta sovg'a buyurtma qilinmagan. Kartani ochib, ichidan «Buyurtma berish» tugmasi bilan olasiz.
          </Text>
        ) : (
          <>
            <View style={styles.histHead}>
              <Text style={styles.histCount}>{orders.length} ta buyurtma</Text>
              <Text style={[styles.histSpent, NUM]}>jami {num(spent)} coin</Text>
            </View>
            {orders.map((o, i) => (
              <View key={o.at + i} style={[styles.histRow, i === orders.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={[styles.histDate, NUM]}>{fmtDate(o.at)}</Text>
                <View style={styles.histMid}>
                  <Text numberOfLines={1} style={styles.histTitle}>{o.title}</Text>
                  <Text style={styles.histNote}>buyurtma qabul qilindi · tarixda saqlandi</Text>
                </View>
                <Text style={[styles.histPrice, NUM]}>−{num(o.price)}</Text>
              </View>
            ))}
          </>
        )}
        <Text style={styles.histFoot}>
          Buyurtmalar shu qurilmadagi Profilingizda saqlanadi.
        </Text>
      </Sheet>

      <BottomNav active="shop" onSelect={onTab} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CANVAS },
  content: { paddingTop: 20 },

  head: { paddingHorizontal: 16 },
  h1: { textAlign: 'center', fontSize: 20, fontWeight: '800', letterSpacing: -0.4, color: INK },

  balRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balLabel: { fontSize: 15, fontWeight: '800', color: INK },
  balCoin: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coinBadge: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
  balValue: { fontSize: 17, fontWeight: '800', color: AMBER_INK },

  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
  iconBtnIdle: { backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1 },
  iconBtnOn: { backgroundColor: INK, borderColor: INK, borderWidth: 1 },

  searchWrap: { marginTop: 12 },
  searchBox: {
    height: 44,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: HAIR,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: INK, paddingVertical: 0 },

  chipRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sortBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  sortBtnIdle: { backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1 },
  sortBtnOn: { backgroundColor: INK, borderColor: INK, borderWidth: 1 },
  chipFlex: { flex: 1 },
  chipScroll: { alignItems: 'center', gap: 4, paddingBottom: 2 },
  chip: { height: 38, paddingHorizontal: 16, borderRadius: 100, flexDirection: 'row', alignItems: 'center' },
  chipIdle: { backgroundColor: 'transparent' },
  chipOn: { backgroundColor: INK },
  chipText: { fontSize: 13, fontWeight: '700' },
  chipTextOn: { color: '#FFFFFF' },
  chipTextIdle: { color: GRAY },
  chipCount: { marginLeft: 6, fontSize: 13, fontWeight: '700' },

  goalCard: { marginTop: 12, backgroundColor: INK, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 13 },
  goalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  goalTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  goalFlag: { flexShrink: 0 },
  goalTitle: { flex: 1, fontSize: 12.5, fontWeight: '800', color: '#CDE9AE' },
  goalRight: { fontSize: 11.5, fontWeight: '700', color: '#9BE04B' },
  goalTrack: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 100, height: 5 },
  goalNote: { marginTop: 6, fontSize: 10.5, fontWeight: '700', color: 'rgba(205,233,174,0.55)' },

  gridWrap: { marginTop: 16, paddingHorizontal: 16 },
  aidsWrap: { marginTop: 24, paddingHorizontal: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  cardCell: { width: '50%', paddingHorizontal: 6, paddingBottom: 12 },
  cardInner: { backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1, borderRadius: 16, padding: 8 },
  favBtn: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 3,
  },
  catBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(14,26,18,0.82)',
    borderRadius: 6,
  },
  catBadgeText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', color: '#EAF3E2' },

  cardBody: { paddingTop: 9, paddingHorizontal: 3, paddingBottom: 2 },
  cardTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  cardBlurb: { marginTop: 3, fontSize: 11.5, lineHeight: 16, color: GRAY, minHeight: 31 },
  cardStock: { marginTop: 8, fontSize: 11, fontWeight: '800' },
  cardFoot: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: HAIR,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardPrice: { fontSize: 13, fontWeight: '800', color: AMBER_INK },
  cardRateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRate: { fontSize: 12, fontWeight: '800', color: INK },
  cardNew: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4, color: GRAY, textTransform: 'uppercase' },

  empty: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E0D3',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: INK, textAlign: 'center' },
  emptySub: { marginTop: 6, fontSize: 12.5, color: GRAY, textAlign: 'center' },

  sortList: { marginTop: 8 },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  sortLabel: { fontSize: 14, fontWeight: '800', color: INK },
  sortCheck: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: INK,
  },

  histEmpty: { fontSize: 13, lineHeight: 20, fontWeight: '500', color: GRAY },
  histHead: { marginTop: 4, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  histCount: { fontSize: 12.5, fontWeight: '700', color: GRAY },
  histSpent: { fontSize: 12.5, fontWeight: '800', color: AMBER_INK },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  histDate: { width: 38, fontSize: 11, fontWeight: '700', color: '#9AA995' },
  histMid: { flex: 1, minWidth: 0 },
  histTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  histNote: { fontSize: 11, fontWeight: '700', color: GRAY },
  histPrice: { fontSize: 13, fontWeight: '800', color: AMBER_INK },
  histFoot: { marginTop: 12, fontSize: 11.5, lineHeight: 17, color: GRAY },
})

export default ShopScreen
