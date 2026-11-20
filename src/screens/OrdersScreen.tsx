import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { useExitToTab } from '../lib/nav'
import { triggerHaptic } from '../lib/haptics'
import { NUM, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { CARD } from '../theme/solver'

/**
 * Buyurtmalarim — Do'kondan berilgan sovg'a buyurtmalar ro'yxati.
 * Har bir yozuv: mahsulot, narx, sana va holat.
 */

const num = (n: number) => n.toLocaleString('en-US')

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`
}

const dayLabel = (iso: string) => {
  const day = iso.slice(0, 10)
  const today = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const tk = `${today.getFullYear()}-${p(today.getMonth() + 1)}-${p(today.getDate())}`
  if (day === tk) return 'Bugun'
  const y = new Date(Date.now() - 86400000)
  const yk = `${y.getFullYear()}-${p(y.getMonth() + 1)}-${p(y.getDate())}`
  return day === yk ? 'Kecha' : fmtDate(iso)
}

const OrdersScreen = () => {
  const insets = useSafeAreaInsets()
  const exit = useExitToTab('shop')
  const orders = useApp(s => s.orders)

  const C = useColors()
  const s = makeStyles(C)

  const spent = orders.reduce((n, o) => n + o.price, 0)
  const latest = orders[0]?.at ?? null

  return (
    <View style={[s.screen, { paddingTop: insets.top + 8 }]}>
      <View style={s.head}>
        <Pressable
          onPress={exit}
          accessibilityLabel="Orqaga"
          hitSlop={10}
          style={({ pressed }) => [s.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
        >
          <Ionicons name="chevron-back" size={18} color={C.ink2} />
        </Pressable>
        <Text style={s.headTitle}>Buyurtmalarim</Text>
        {orders.length > 0 && (
          <View style={s.countChip}>
            <Text style={[s.countText, NUM]}>{orders.length}</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 24 }]}
      >
        {orders.length === 0 ? (
          <View style={[CARD, s.empty]}>
            <View style={s.emptyIcon}>
              <MCI name="package-variant-closed" size={26} color={C.ink3} />
            </View>
            <Text style={s.emptyTitle}>Hali buyurtma yo'q</Text>
            <Text style={s.emptySub}>
              Do'kondan sovg'a tanlang — buyurtma shu yerda saqlanadi
            </Text>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                exit()
              }}
              style={({ pressed }) => [s.emptyBtn, pressed && { opacity: 0.9 }]}
            >
              <Text style={s.emptyBtnText}>Do'konga o'tish</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Umumiy statistika */}
            <View style={[CARD, s.stats]}>
              <View style={s.statCell}>
                <Text style={[s.statValue, NUM]}>{orders.length}</Text>
                <Text style={s.statLabel}>buyurtma</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statCell}>
                <Text style={[s.statValue, NUM]}>{num(spent)}</Text>
                <Text style={s.statLabel}>coin sarflangan</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statCell}>
                <Text style={s.statValue}>{latest ? dayLabel(latest) : '—'}</Text>
                <Text style={s.statLabel}>so'nggi</Text>
              </View>
            </View>

            {/* Ro'yxat */}
            <View style={s.list}>
              {orders.map((o, i) => (
                <View key={o.at + i} style={[CARD, s.row]}>
                  <View style={s.rowIcon}>
                    <MCI name="package-variant" size={17} color={C.brand} />
                  </View>
                  <View style={s.rowMid}>
                    <Text numberOfLines={1} style={s.rowTitle}>{o.title}</Text>
                    <Text style={s.rowMeta}>
                      {dayLabel(o.at)} · {fmtDate(o.at)}
                    </Text>
                  </View>
                  <View style={s.rowRight}>
                    <Text style={[s.rowPrice, NUM]}>−{num(o.price)}</Text>
                    <View style={s.statusChip}>
                      <View style={s.statusDot} />
                      <Text style={s.statusText}>Qabul qilindi</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <Text style={s.foot}>
              Buyurtmalar shu qurilmadagi profilingizda saqlanadi — boshqa qurilmada ko'rinmaydi.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },

  head: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surface, borderColor: C.cardEdge, borderWidth: 1, borderRadius: 12,
  },
  headTitle: { flex: 1, fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: C.ink },
  countChip: {
    minWidth: 28, height: 28, paddingHorizontal: 8, borderRadius: 14,
    backgroundColor: C.leafTint, alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 12.5, fontWeight: '700', color: C.brand },

  body: { paddingHorizontal: 16, paddingTop: 4 },

  empty: {
    marginTop: 40, alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24,
    borderRadius: 20, gap: 8,
  },
  emptyIcon: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.ink },
  emptySub: { fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: C.ink3, textAlign: 'center' },
  emptyBtn: {
    marginTop: 10, height: 42, paddingHorizontal: 20, borderRadius: 12,
    backgroundColor: C.brandDeep, alignItems: 'center', justifyContent: 'center',
  },
  emptyBtnText: { fontSize: 13.5, fontWeight: '700', color: '#FFFFFF' },

  stats: {
    flexDirection: 'row', alignItems: 'stretch', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 8, marginBottom: 14,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 16, fontWeight: '700', color: C.ink, letterSpacing: -0.3 },
  statLabel: { fontSize: 10.5, fontWeight: '500', color: C.ink4 },
  statDivider: { width: 1, backgroundColor: C.line, marginVertical: 4 },

  list: { gap: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12,
  },
  rowIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: C.leafTint,
    alignItems: 'center', justifyContent: 'center',
  },
  rowMid: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: C.ink },
  rowMeta: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: C.ink4 },
  rowRight: { alignItems: 'flex-end', gap: 5 },
  rowPrice: { fontSize: 13.5, fontWeight: '700', color: C.coin },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 20, paddingHorizontal: 7, borderRadius: 10,
    backgroundColor: C.leafTint,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.limeDeep },
  statusText: { fontSize: 10, fontWeight: '700', color: C.limeDeep },

  foot: {
    marginTop: 16, fontSize: 11, lineHeight: 16, fontWeight: '500',
    color: C.ink4, textAlign: 'center', paddingHorizontal: 12,
  },
})

export default OrdersScreen
