import { useDeferredValue, useMemo, useState } from 'react'
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { navBottomSpace } from '../components/BottomNav'
import { Reveal } from '../components/Reveal'
import Sheet from '../components/Sheet'
import { TopScrim } from '../components/ui'
import StudyAids from '../components/StudyAids'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { GRAD_LIME } from '../theme/solver'
import {
  PRODUCTS, PRODUCT_CATS,
  type Product, type ProductCat,
} from '../data/content'
import { PRODUCT_IMAGES, PRODUCT_THUMBS } from '../data/productImages'

/**
 * Do'kon — oq fonda turuvchi bozor. Hech qanday karta, ramka yoki panel yo'q:
 * sarlavha, balans, qidiruv, janr qatori va rasm + nom + narx — hammasi to'g'ri
 * oq yuza ustida. Faqat narx, progress va holat ranglari gapiradi.
 */

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const INK = '#0E1A12'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const AMBER_INK = '#854D0E'
const BAD = '#B4402F'

type Filter = 'all' | ProductCat | 'fav'
type Sort = 'yangi' | 'arzon' | 'qimmat'

const SORTS: { key: Sort; label: string; icon: keyof typeof MCI.glyphMap }[] = [
  { key: 'yangi', label: 'Odatiy tartib', icon: 'view-grid-outline' },
  { key: 'arzon', label: 'Arzonlari oldinda', icon: 'arrow-up' },
  { key: 'qimmat', label: 'Qimmatlari oldinda', icon: 'arrow-down' },
]

const CAT_ICON: Record<ProductCat, keyof typeof MCI.glyphMap> = {
  Elektronika: 'cellphone',
  "O'quv qurollari": 'pencil',
  'Kiyim-kechak': 'tshirt-crew',
  Sport: 'run',
  "O'yinlar": 'gamepad-variant',
  "Uy-ro'zg'or": 'home-variant',
  Chegirmalar: 'tag-multiple',
}

const num = (n: number) => n.toLocaleString('en-US')

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}`
}

/* ── ProductArt — rasm, rasm yo'q bo'lsa janr gradienti + belgi ── */

const ART_GLYPH: Record<string, keyof typeof MCI.glyphMap> = {
  phone: 'cellphone',
  tablet: 'tablet',
  buds: 'earbuds',
  headphones: 'headphones',
  watch: 'watch',
  power: 'battery-charging',
  speaker: 'speaker',
  scooter: 'scooter',
  bike: 'bike',
  rolik: 'roller-skate',
  ball: 'soccer',
  chess: 'chess-knight',
  rubik: 'cube-outline',
  backpack: 'bag-personal',
  tote: 'shopping-outline',
  tee: 'tshirt-crew',
  hoddie: 'tshirt-crew-outline',
  cap: 'baseball',
  bottle: 'bottle-tonic-outline',
  thermos: 'thermometer',
  cup: 'cup-outline',
  discount: 'percent-outline',
  voucher: 'ticket-percent-outline',
  studyset: 'school-outline',
  folder: 'folder-outline',
  penal: 'pencil-box-outline',
  notebook: 'notebook-outline',
  pens: 'pen',
  bloc: 'book-open-variant',
  pen: 'fountain-pen',
  lamp: 'desk-lamp',
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
  const img = PRODUCT_THUMBS[product.id] ?? PRODUCT_IMAGES[product.id]
  return (
    <View
      style={[
        art.box,
        { borderRadius: radius, backgroundColor: tone.grad[0] },
        fill ? { width: '100%', aspectRatio: 1 } : { width: size, height: size },
      ]}
    >
      {img ? (
        <Image source={img} style={art.img} resizeMode="cover" />
      ) : (
        <>
          <LinearGradient
            colors={tone.grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={ABS_FILL}
          />
          <MCI name={ART_GLYPH[product.art] ?? 'gift-outline'} size={iconSize} color={tone.ink} />
        </>
      )}
      {children}
    </View>
  )
}

const art = StyleSheet.create({
  box: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0E1A12',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  img: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
})

/* ── Ekran ── */

const ShopScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [sort, setSort] = useState<Sort>('yangi')
  const [sortOpen, setSortOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const coin = useApp(s => s.coin)
  const favs = useApp(s => s.favs)
  const orders = useApp(s => s.orders)
  const stockTaken = useApp(s => s.stockTaken)
  const goalId = useApp(s => s.goalId)
  const toggleFav = useApp(s => s.toggleFav)

  const left = (p: Product) => Math.max(0, p.stock - (stockTaken[p.id] ?? 0))

  const list = useMemo(() => {
    let items = PRODUCTS
    if (filter === 'fav') items = items.filter(p => favs.includes(p.id))
    else if (filter !== 'all') items = items.filter(p => p.cat === filter)
    const q = deferredQuery.trim().toLowerCase()
    if (q) items = items.filter(p => (p.title + ' ' + p.blurb + ' ' + p.cat).toLowerCase().includes(q))
    const sorted = [...items]
    if (sort === 'arzon') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'qimmat') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [filter, favs, deferredQuery, sort])

  const goal = goalId ? PRODUCTS.find(p => p.id === goalId) ?? null : null
  const spent = orders.reduce((n, o) => n + o.price, 0)

  /** Keyingi sovg'a — balans satri shu sariq chiziq bilan shu yerga qarab yuradi */
  const nextReward = useMemo(() => {
    const pool = PRODUCTS.filter(p => Math.max(0, p.stock - (stockTaken[p.id] ?? 0)) > 0 && p.price > coin)
    return [...pool].sort((a, b) => a.price - b.price)[0] ?? null
  }, [stockTaken, coin])

  const counts: Partial<Record<ProductCat, number>> = {}
  let available = 0
  for (const p of PRODUCTS) {
    if (left(p) === 0) continue
    available++
    counts[p.cat] = (counts[p.cat] ?? 0) + 1
  }

  const chip = (key: Filter, label: string, icon: keyof typeof MCI.glyphMap) => {
    const on = filter === key
    const count = key === 'fav' ? favs.length : key === 'all' ? available : counts[key] ?? 0
    return (
      <Pressable
        key={key}
        onPress={() => { triggerHaptic('selection'); setFilter(key) }}
        style={({ pressed }) => [styles.chip, on ? styles.chipOn : styles.chipOff, pressed && { opacity: 0.85 }]}
      >
        <MCI name={icon} size={14} color={on ? '#9BE04B' : '#8B9985'} />
        <Text style={[styles.chipText, on ? styles.chipTextOn : styles.chipTextOff]}>{label}</Text>
        {count > 0 && (
          <Text style={[styles.chipCount, NUM, on ? styles.chipCountOn : styles.chipCountOff]}>
            {count}
          </Text>
        )}
      </Pressable>
    )
  }

  const card = (p: Product) => {
    const stock = left(p)
    const out = stock === 0
    const fav = favs.includes(p.id)
    const ready = coin >= p.price
    return (
      <Pressable
        key={p.id}
        onPress={() => { triggerHaptic('light'); navigation.navigate('Product', { id: p.id }) }}
        style={({ pressed }) => [styles.cardCell, pressed && { opacity: 0.92 }]}
      >
        <Reveal y={12} duration={280}>
          <ProductArt product={p} fill radius={14} iconSize={54}>
            <Pressable
              onPress={() => { triggerHaptic('light'); toggleFav(p.id) }}
              hitSlop={10}
              accessibilityLabel="Sevimli"
              style={({ pressed }) => [styles.favBtn, pressed && { transform: [{ scale: 0.9 }] }]}
            >
              <MCI name={fav ? 'heart' : 'heart-outline'} size={17} color={fav ? BAD : '#5D6B58'} />
            </Pressable>

            {out && (
              <View style={styles.outWrap}>
                <Text style={styles.outText}>Tugadi</Text>
              </View>
            )}
          </ProductArt>

          <View style={styles.cardBody}>
            <Text numberOfLines={1} style={styles.cardTitle}>{p.title}</Text>
            <View style={styles.cardFoot}>
              <View style={styles.priceRow}>
                <MCI name="cash" size={11} color={ready ? C.brand : '#B87A22'} />
                <Text style={[styles.priceText, NUM, ready ? styles.priceReady : styles.priceIdle]}>
                  {num(p.price)}
                </Text>
              </View>
              <Text style={[styles.footNote, NUM, out && { color: BAD }, ready && styles.footReady]}>
                {out ? "yo'q" : ready ? 'yetadi' : `${stock} dona`}
              </Text>
            </View>
          </View>
        </Reveal>
      </Pressable>
    )
  }

  const resultLabel =
    filter === 'fav'
      ? `Sevimlilar · ${list.length}`
      : filter === 'all'
        ? `${list.length} sovg'a`
        : `${filter} · ${list.length}`

  const progress = nextReward ? Math.min(100, (coin / nextReward.price) * 100) : 100
  const gap = nextReward ? nextReward.price - coin : 0

  const header = (
    <View style={styles.head}>
      <View style={styles.headTop}>
        <View style={styles.headText}>
          <Text style={styles.h1}>Do&apos;kon</Text>
          <Text style={styles.h1Sub}>Coin yig&apos;ing — sovg&apos;aga almashtiring</Text>
        </View>
        <Pressable
          onPress={() => { triggerHaptic('selection'); setHistoryOpen(true) }}
          accessibilityLabel="Buyurtmalar tarixi"
          hitSlop={10}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
        >
          <MCI name="history" size={20} color={INK} />
          {orders.length > 0 && <View style={styles.iconDot} />}
        </Pressable>
      </View>

      {/* Balans — ramkasiz satr; o'ngda keyingi sovg'a, ostida shu sariq chiziq */}
      <Pressable
        onPress={() => { triggerHaptic('light'); navigation.navigate('Profile') }}
        style={({ pressed }) => [styles.balance, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.balanceTop}>
          <Text style={styles.balanceLabel}>Balans</Text>
          <Text style={[styles.balanceEta, NUM]}>
            {nextReward ? `yana ${num(gap)} coin` : 'hammasi yetadi'}
          </Text>
        </View>

        <View style={styles.balanceRow}>
          <View style={styles.balanceMain}>
            <View style={styles.balanceValueRow}>
              <Reveal key={String(coin)} y={6} duration={300} style={styles.balanceValueInner}>
                <MCI name="cash" size={19} color="#B87A22" />
                <Text style={[styles.balanceValue, NUM]}>{num(coin)}</Text>
                <Text style={styles.balanceUnit}>coin</Text>
              </Reveal>
            </View>

            <View style={styles.balanceTrack}>
              <View style={{ width: `${progress}%`, height: '100%', borderRadius: 100, overflow: 'hidden' }}>
                <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ABS_FILL} />
              </View>
            </View>
          </View>

          {nextReward && (
            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.navigate('Product', { id: nextReward.id }) }}
              accessibilityLabel={`Keyingi sovg'a: ${nextReward.title}`}
              style={({ pressed }) => [styles.next, pressed && { opacity: 0.7 }]}
            >
              <Image
                source={PRODUCT_THUMBS[nextReward.id] ?? PRODUCT_IMAGES[nextReward.id]}
                style={styles.nextImg}
                resizeMode="cover"
              />
              <View style={styles.nextText}>
                <Text numberOfLines={1} style={styles.nextTitle}>{nextReward.title}</Text>
                <Text style={[styles.nextPrice, NUM]}>{num(nextReward.price)} coin</Text>
              </View>
            </Pressable>
          )}
        </View>
      </Pressable>

      {/* Qidiruv — to'ldirilgan yuza, chegara yo'q */}
      <View style={styles.searchBox}>
        <MCI name="magnify" size={17} color="#8C9A87" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Telefon, sumka, ruchka..."
          placeholderTextColor="#9AA995"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={10}
            accessibilityLabel="Tozalash"
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <MCI name="close" size={16} color="#8C9A87" />
          </Pressable>
        )}
      </View>

      {/* Janrlar — ramkasiz qator, faol janr tagida ingichka chiziq */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        keyboardShouldPersistTaps="handled"
      >
        {chip('all', 'Barchasi', 'view-grid-outline')}
        {PRODUCT_CATS.map(c => chip(c, c, CAT_ICON[c]))}
      </ScrollView>

      {/* Natija qatori */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>{resultLabel}</Text>
        <View style={styles.resultActions}>
          <Pressable
            onPress={() => { triggerHaptic('selection'); setFilter(f => (f === 'fav' ? 'all' : 'fav')) }}
            accessibilityLabel="Sevimlilar"
            hitSlop={10}
            style={({ pressed }) => [pressed && { opacity: 0.55 }]}
          >
            <MCI
              name={filter === 'fav' ? 'heart' : 'heart-outline'}
              size={19}
              color={filter === 'fav' ? BAD : INK}
            />
          </Pressable>
          <Pressable
            onPress={() => { triggerHaptic('selection'); setSortOpen(true) }}
            accessibilityLabel="Saralash"
            hitSlop={10}
            style={({ pressed }) => [pressed && { opacity: 0.55 }]}
          >
            <MCI name="tune-variant" size={19} color={sort === 'yangi' ? INK : C.brand} />
          </Pressable>
        </View>
      </View>

      {/* Maqsad — faqat tanlangan sovg'a bo'lsa ko'rinadi */}
      {goal && (
        <Pressable
          onPress={() => { triggerHaptic('light'); navigation.navigate('Product', { id: goal.id }) }}
          style={({ pressed }) => [styles.goalRow, pressed && { opacity: 0.7 }]}
        >
          <MCI name="flag" size={13} color={C.brand} />
          <Text numberOfLines={1} style={styles.goalTitle}>{goal.title}</Text>
          <Text style={[styles.goalRight, NUM]}>
            {goal.price - coin <= 0 ? 'olish mumkin' : `${num(goal.price - coin)} coin`}
          </Text>
        </Pressable>
      )}
    </View>
  )

  return (
    <View style={styles.screen}>
      <FlatList
        data={list}
        keyExtractor={p => p.id}
        numColumns={2}
        renderItem={({ item }) => card(item)}
        ListHeaderComponent={header}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <View style={styles.gridWrap}>
            <View style={styles.empty}>
              <MCI
                name={filter === 'fav' ? 'heart-outline' : 'gift-outline'}
                size={22}
                color="#9AA995"
              />
              <Text style={styles.emptyTitle}>
                {filter === 'fav' ? "Sevimlilar bo'sh" : "Bu javonda hozircha yo'q"}
              </Text>
              <Text style={styles.emptySub}>
                {filter === 'fav'
                  ? "Kartadagi yurakchani bosib, keyin oladigan sovg'alarni yig'ib qo'ying."
                  : "Boshqa janrni tanlang yoki qidiruvni tozalang."}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.aidsWrap}>
            <StudyAids />
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: navBottomSpace(insets.bottom) }]}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />

      {/* Status bar zonasi — kontent shu chegara ostidan o'tadi */}
      <TopScrim height={insets.top} line={HAIR} />

      {/* ── Saralash varaqasi ── */}
      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="Saralash">
        <View style={styles.sortList}>
          {SORTS.map(o => (
            <Pressable
              key={o.key}
              onPress={() => { triggerHaptic('selection'); setSort(o.key); setSortOpen(false) }}
              style={({ pressed }) => [styles.sortRow, pressed && { opacity: 0.6 }]}
            >
              <View style={styles.sortRowLeft}>
                <MCI name={o.icon} size={16} color={GRAY} />
                <Text style={styles.sortLabel}>{o.label}</Text>
              </View>
              {sort === o.key && <MCI name="check" size={17} color={INK} />}
            </Pressable>
          ))}
        </View>
      </Sheet>

      {/* ── Buyurtmalar tarixi ── */}
      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} title="Buyurtmalar">
        {orders.length === 0 ? (
          <Text style={styles.histEmpty}>
            Hali birorta sovg&apos;a buyurtma qilinmagan. Kartani ochib, ichidan «Buyurtma berish»
            tugmasi bilan olasiz.
          </Text>
        ) : (
          <>
            <View style={styles.histHead}>
              <Text style={styles.histCount}>{orders.length} ta buyurtma</Text>
              <Text style={[styles.histSpent, NUM]}>jami {num(spent)} coin</Text>
            </View>
            {orders.map((o, i) => (
              <View key={o.at + i} style={styles.histRow}>
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
        <Text style={styles.histFoot}>Buyurtmalar shu qurilmadagi Profilingizda saqlanadi.</Text>
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingTop: 16 },

  head: { paddingHorizontal: 16, marginBottom: 4 },
  headTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headText: { flex: 1, minWidth: 0 },
  h1: { fontSize: 21, lineHeight: 26, fontWeight: '600', letterSpacing: -0.6, color: INK },
  h1Sub: { marginTop: 2, fontSize: 12, letterSpacing: 0.1, fontWeight: '500', color: GRAY },
  iconBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  iconDot: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 6,
    height: 6,
    borderRadius: 100,
    backgroundColor: C.coin,
  },

  balance: { marginTop: 18 },
  balanceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  balanceLabel: {
    fontSize: 10.5,
    letterSpacing: 0.8,
    fontWeight: '600',
    color: '#8A6520',
    textTransform: 'uppercase',
  },
  balanceEta: { fontSize: 11.5, fontWeight: '700', color: C.brand },
  balanceRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 14 },
  balanceMain: { flex: 1, minWidth: 0 },
  balanceValueRow: { flexDirection: 'row', alignItems: 'center' },
  balanceValueInner: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  balanceValue: { fontSize: 32, lineHeight: 36, fontWeight: '700', letterSpacing: -1, color: INK },
  balanceUnit: { fontSize: 12, fontWeight: '600', color: GRAY },
  balanceTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 100,
    backgroundColor: C.lineSoft,
    overflow: 'hidden',
  },
  next: { flexDirection: 'row', alignItems: 'center', gap: 9, maxWidth: 168 },
  nextImg: { width: 46, height: 46, borderRadius: 11, backgroundColor: C.surface2 },
  nextText: { flex: 1, minWidth: 0 },
  nextTitle: { fontSize: 12, lineHeight: 15, fontWeight: '600', color: INK },
  nextPrice: { marginTop: 2, fontSize: 11, fontWeight: '600', color: AMBER_INK },

  searchBox: {
    marginTop: 18,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.surface2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 13.5, fontWeight: '500', color: INK, paddingVertical: 0 },

  rail: { marginTop: 14, paddingHorizontal: 0, gap: 8, alignItems: 'center' },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipOff: { backgroundColor: C.surface2 },
  chipOn: { backgroundColor: INK },
  chipText: { fontSize: 12.5, fontWeight: '600' },
  chipTextOn: { color: '#FFFFFF' },
  chipTextOff: { color: '#4C5C46' },
  chipCount: { fontSize: 11, fontWeight: '600' },
  chipCountOn: { color: 'rgba(255,255,255,0.62)' },
  chipCountOff: { color: '#95A38F' },

  resultRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  resultText: { flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: '600', color: GRAY },
  resultActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  goalRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  goalTitle: { flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: '600', color: INK },
  goalRight: { fontSize: 12, fontWeight: '600', color: C.brand },

  gridWrap: { paddingHorizontal: 16 },
  aidsWrap: { marginTop: 28, paddingHorizontal: 16 },
  gridRow: { paddingHorizontal: 10 },

  cardCell: { flex: 1, maxWidth: '50%', paddingHorizontal: 6, paddingBottom: 18 },
  favBtn: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outWrap: {
    ...ABS_FILL,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,26,18,0.38)',
  },
  outText: { fontSize: 11.5, fontWeight: '700', color: '#FFFFFF' },

  cardBody: { paddingTop: 8, paddingHorizontal: 1 },
  cardTitle: { fontSize: 13, lineHeight: 17, fontWeight: '600', color: INK },
  cardFoot: { marginTop: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  priceText: { fontSize: 12.5, fontWeight: '700', letterSpacing: -0.2 },
  priceReady: { color: C.brand },
  priceIdle: { color: AMBER_INK },
  footNote: { fontSize: 10.5, fontWeight: '500', color: '#9AA995' },
  footReady: { color: C.brand, fontWeight: '700' },

  empty: { paddingTop: 28, paddingBottom: 8, alignItems: 'center' },
  emptyTitle: { marginTop: 10, fontSize: 14, fontWeight: '600', color: INK, textAlign: 'center' },
  emptySub: { marginTop: 6, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: GRAY, textAlign: 'center' },

  sortList: { marginTop: 4 },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sortRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sortLabel: { fontSize: 14, fontWeight: '600', color: INK },

  histEmpty: { fontSize: 13, lineHeight: 20, fontWeight: '500', color: GRAY },
  histHead: { marginTop: 4, marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  histCount: { fontSize: 12.5, fontWeight: '500', color: GRAY },
  histSpent: { fontSize: 12.5, fontWeight: '600', color: AMBER_INK },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  histDate: { width: 42, fontSize: 12, fontWeight: '500', color: '#9AA995' },
  histMid: { flex: 1, minWidth: 0 },
  histTitle: { fontSize: 13.5, fontWeight: '600', color: INK },
  histNote: { fontSize: 12, fontWeight: '500', color: GRAY },
  histPrice: { fontSize: 13, fontWeight: '600', color: AMBER_INK },
  histFoot: { marginTop: 12, fontSize: 11.5, lineHeight: 17, color: GRAY },
})

export default ShopScreen
