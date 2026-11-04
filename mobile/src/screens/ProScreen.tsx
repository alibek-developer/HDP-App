import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import Svg, { Line } from 'react-native-svg'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { PopIn } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM } from '../theme/tokens'
import {
  CARD, GRAD_HEADER, GRAD_LIME, GRAD_RAIL, GRAD_AMBER,
  INK_BTN, LIME_BTN, OUT_BTN,
} from '../theme/solver'

/**
 * HDP Pro sahifasi — tarif tanlash, to'lov usuli, obuna holati va chek.
 * Web'ning `ProScreen.tsx` ekvivalenti. To'lov haqiqiy emas: tugma store'dagi
 * `subscribePro` orqali Pro'ni yoqadi (demo holat).
 */

type Nav = NativeStackNavigationProp<RootStackParamList>
type PlanId = '1m' | '3m' | '1y'

/** 1 oylik bazaviy narx — tejim shu yerdan hisoblanadi */
const BASE_PER_MONTH = 79_000

const PLANS: { id: PlanId; label: string; months: number; perMonth: number; badge: string | null }[] = [
  { id: '1m', label: '1 Oy', months: 1, perMonth: 79_000, badge: null },
  { id: '3m', label: '3 Oy', months: 3, perMonth: 59_000, badge: 'Mashhur' },
  { id: '1y', label: '1 Yil', months: 12, perMonth: 39_000, badge: 'Eng arzon' },
]

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  { icon: 'play', title: '16+ yopiq video dars', desc: 'DTM va IMO darajasidagi eksklyuziv tahlillar' },
  { icon: 'sparkles', title: 'AI yordamchi', desc: 'Istalgan masala yechimini qadamma-qadam tushuntiradi' },
  { icon: 'school', title: 'Jonli master-klasslar', desc: 'Har hafta Ustoz Azamat bilan jonli dars' },
  { icon: 'document-text', title: 'DTM shpora PDF (140+)', desc: 'Oflayn yuklab olish, internet shart emas' },
  { icon: 'trophy', title: 'Rasmiy HDP sertifikati', desc: "Kurs tugagandan so'ng shaxsiylashtirilgan" },
]

const GATEWAYS = [
  { name: 'Payme', color: '#00AEEF', bg: '#E5F7FD' },
  { name: 'Click', color: '#0057B7', bg: '#EBF1FB' },
  { name: 'Uzum', color: '#FF4F12', bg: '#FEECE7' },
  { name: 'Uzcard', color: '#18A34A', bg: '#EDFBF3' },
]

/** 177000 → «177 000» — O'zbekistonda bo'shaqli yozuv ishlatiladi */
const money = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** 2026-12-02 → 02.12.2026 */
const ruDate = (iso: string | null) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

const INK = '#0E1A12'
const GRAY = '#6B7C66'
const FAINT = '#9AA995'
const BRAND = '#0B6E4F'
const AMBER = '#B87A22'

/** Hero ustidagi katak — web'dagi repeating-linear-gradient ekvivalenti */
const HeroGrid = () => {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const CELL = 24
  const line = 'rgba(205,233,174,0.6)'
  const cols = Math.ceil(size.w / CELL)
  const rows = Math.ceil(size.h / CELL)
  return (
    <View
      pointerEvents="none"
      style={[ABS_FILL, { opacity: 0.07 }]}
      onLayout={e => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {size.w > 0 && size.h > 0 && (
        <Svg width={size.w} height={size.h}>
          {Array.from({ length: cols + 1 }, (_, i) => (
            <Line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={size.h} stroke={line} strokeWidth={1} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <Line key={`h${i}`} x1={0} y1={i * CELL} x2={size.w} y2={i * CELL} stroke={line} strokeWidth={1} />
          ))}
        </Svg>
      )}
    </View>
  )
}

const ProScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Home')
  const [selected, setSelected] = useState<PlanId>('3m')
  const [gateway, setGateway] = useState('Payme')
  const [showSuccess, setShowSuccess] = useState(false)

  const isPro = useApp(s => s.isPro)
  const proExpires = useApp(s => s.proExpires)
  const subscribePro = useApp(s => s.subscribePro)
  const cancelPro = useApp(s => s.cancelPro)

  const plan = PLANS.find(p => p.id === selected) ?? PLANS[1]
  const total = plan.perMonth * plan.months
  const baseline = BASE_PER_MONTH * plan.months
  const saved = baseline - total

  const handleSubscribe = () => {
    subscribePro(plan.months)
    triggerHaptic('success')
    setShowSuccess(true)
  }

  return (
    <View style={[s.screen, { paddingBottom: isPro ? 40 : 170 + insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [s.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>
          <View style={s.headCenter}>
            <Text style={s.headKicker}>Obuna</Text>
            <Text style={s.headTitle}>HDP Pro</Text>
          </View>
          <View style={s.crownTile}>
            {isPro ? (
              <LinearGradient colors={GRAD_AMBER} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[ABS_FILL, { borderRadius: 12 }]} />
            ) : null}
            <Ionicons name="ribbon" size={17} color={AMBER} style={s.crownIcon} />
          </View>
        </View>

        {/* ── Hero: siyoh varaq ── */}
        <View style={s.hero}>
          <LinearGradient colors={GRAD_HEADER} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={ABS_FILL} />
          <HeroGrid />
          <View style={s.heroInner}>
            <View style={s.heroBadge}>
              <Ionicons name="diamond" size={22} color="#9BE04B" />
            </View>
            <Text style={s.heroH1}>HDP Pro bilan{'\n'}matematikani egalla</Text>
            <Text style={s.heroSub}>
              O'zbekistonning eng yaxshi DTM va olimpiada matematika kursi — cheksiz kirish.
            </Text>

            <View style={s.rateRow}>
              <View style={s.stars}>
                {[0, 1, 2, 3, 4].map(i => (
                  <Ionicons
                    key={i}
                    name={i === 4 ? 'star' : 'star'}
                    size={12}
                    color={i === 4 ? 'rgba(243,200,138,0.42)' : '#F3C88A'}
                  />
                ))}
              </View>
              <Text style={[s.rateText, NUM]}>
                4.9 <Text style={s.rateDim}>· 12 000+ talaba</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ── Tarif rejalari ── */}
        <Text style={s.sectionLabel}>Tarif rejasini tanlang</Text>
        <View style={s.plans}>
          {PLANS.map(p => {
            const on = selected === p.id
            const pTotal = p.perMonth * p.months
            const pSaved = BASE_PER_MONTH * p.months - pTotal
            return (
              <Pressable
                key={p.id}
                onPress={() => { triggerHaptic('selection'); setSelected(p.id) }}
                style={({ pressed }) => [
                  s.plan,
                  on ? s.planOn : s.planIdle,
                  pressed && { transform: [{ scale: 0.995 }] },
                ]}
              >
                {on && (
                  <LinearGradient
                    colors={GRAD_RAIL}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={s.planRail}
                  />
                )}
                <View style={[s.radio, on ? s.radioOn : s.radioIdle]}>
                  {on && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <View style={s.planMid}>
                  <View style={s.planTitleRow}>
                    <Text style={s.planLabel}>{p.label}</Text>
                    {!!p.badge && (
                      <View style={p.id === '1y' ? s.badgeAmber : s.badgeLime}>
                        <Text style={p.id === '1y' ? s.badgeAmberText : s.badgeLimeText}>{p.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.planTotal, NUM]}>
                    {p.months === 1 ? "Bir oylik to'lov" : `jami ${money(pTotal)} so'm`}
                  </Text>
                </View>
                <View style={s.planRight}>
                  <Text style={[s.planPrice, NUM, { color: on ? '#0B4A34' : INK }]}>{money(p.perMonth)}</Text>
                  <Text style={[s.planUnit, NUM]}>so'm /oy</Text>
                  {pSaved > 0 && (
                    <View style={s.saveChip}>
                      <Text style={[s.saveChipText, NUM]}>
                        −{Math.round((pSaved / (BASE_PER_MONTH * p.months)) * 100)}%
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>

        {/* ── Nimalar kiradi ── */}
        <Text style={s.sectionLabel}>Nimalar kiradi</Text>
        <View style={s.features}>
          {FEATURES.map((f, i) => (
            <View
              key={f.title}
              style={[
                s.feature,
                i > 0 ? { borderTopWidth: 1, borderTopColor: '#EDF1E7' } : null,
                i === FEATURES.length - 1 ? { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } : null,
              ]}
            >
              <View style={s.featureTile}>
                <Ionicons name={f.icon} size={17} color={BRAND} />
              </View>
              <View style={s.featureMid}>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── To'lov usuli ── */}
        <Text style={s.sectionLabel}>To'lov usuli</Text>
        <View style={s.gateways}>
          {GATEWAYS.map(g => {
            const on = gateway === g.name
            return (
              <Pressable
                key={g.name}
                onPress={() => { triggerHaptic('selection'); setGateway(g.name) }}
                style={({ pressed }) => [
                  s.gw,
                  { backgroundColor: on ? g.bg : '#FFFFFF', borderColor: on ? g.color : '#E1E7DA' },
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                {on && (
                  <View style={[s.gwCheck, { backgroundColor: g.color }]}>
                    <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  </View>
                )}
                <View style={[s.gwLetter, { backgroundColor: on ? g.color : g.bg }]}>
                  <Text style={[s.gwLetterText, NUM, { color: on ? '#FFFFFF' : g.color }]}>{g.name[0]}</Text>
                </View>
                <Text style={[s.gwName, { color: on ? g.color : GRAY }]}>{g.name}</Text>
              </Pressable>
            )
          })}
        </View>

        {/* ── Faol obuna holati ── */}
        {isPro && (
          <View style={s.activeWrap}>
            <View style={s.activeCard}>
              <View style={s.activeRail} />
              <View style={s.activeInner}>
                <View style={s.activeHead}>
                  <Ionicons name="ribbon" size={15} color={AMBER} />
                  <Text style={s.activeTitle}>Pro faol</Text>
                </View>
                <Text style={s.activeSub}>Barcha darslar va to'plamlar ochiq.</Text>
                {!!proExpires && (
                  <View style={s.activeDateRow}>
                    <Ionicons name="calendar" size={14} color="#0B4A34" />
                    <Text style={[s.activeDate, NUM]}>Amal qiladi: {ruDate(proExpires)} gacha</Text>
                  </View>
                )}
              </View>
            </View>
            <Pressable
              onPress={() => { cancelPro(); triggerHaptic('warning'); navigation.replace('Home') }}
              style={({ pressed }) => [s.cancelPro, pressed && { opacity: 0.8 }]}
            >
              <Text style={s.cancelProText}>Obunani bekor qilish</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ── Xarid paneli — bosh barmaq zonasi, doim ko'z oldida ── */}
      {!isPro && (
        <View style={[s.dock, { bottom: 0, paddingBottom: insets.bottom + 12 }]}>
          <View style={s.dockHead}>
            <View style={s.dockLeft}>
              <Text style={s.dockLabel}>{`Jami to'lov · ${plan.label}`}</Text>
              <Text style={[s.dockTotal, NUM]}>
                {money(total)} <Text style={s.dockCur}>so'm</Text>
                <Text style={[s.dockOld, NUM]}>  {money(baseline)}</Text>
              </Text>
            </View>
            <View style={s.dockSave}>
              <Text style={[s.dockSaveText, NUM]}>−{money(saved)} so'm</Text>
            </View>
          </View>

          <Pressable
            onPress={handleSubscribe}
            style={({ pressed }) => [s.buyBtn, pressed && { transform: [{ scale: 0.985 }] }]}
          >
            <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[ABS_FILL, { borderRadius: 12 }]} />
            <Ionicons name="ribbon" size={17} color="#1C3214" style={s.buyIcon} />
            <Text style={s.buyText}>{plan.label} obunani faollashtirish</Text>
          </Pressable>

          <View style={s.dockFoot}>
            <Ionicons name="lock-closed" size={11} color={FAINT} />
            <Text style={s.dockFootText}>
              {gateway} orqali to'lov · istalgan vaqtda bekor qilish
            </Text>
          </View>
        </View>
      )}

      {/* ── Muvaffaqiyat modali ── */}
      <Modal visible={showSuccess} transparent animationType="none" onRequestClose={() => setShowSuccess(false)}>
        {showSuccess && (
          <View style={s.modalRoot}>
            <Pressable onPress={() => setShowSuccess(false)} style={[ABS_FILL, s.modalScrim]} />
            <PopIn style={s.modalWrap}>
              <View style={s.successCard}>
                <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.successBar} />
                <View style={s.successInner}>
                  <View style={s.successHead}>
                    <View style={s.successTick}>
                      <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[ABS_FILL, { borderRadius: 16 }]} />
                      <Ionicons name="checkmark" size={26} color="#1C3214" style={s.successTickIcon} />
                    </View>
                    <View style={s.successTitles}>
                      <Text style={s.successH3}>Obuna faol!</Text>
                      <Text style={s.successSub}>HDP Pro barcha darslarga kirish ochildi.</Text>
                    </View>
                  </View>

                  {/* To'lov varaqasi — pul sarflanganini ko'rsatadigan yagona joy */}
                  <View style={s.receipt}>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>Tarif</Text>
                      <Text style={[s.receiptValue, NUM]}>{plan.label} · {money(total)} so'm</Text>
                    </View>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>Amal muddati</Text>
                      <Text style={[s.receiptValue, NUM]}>{ruDate(proExpires) ?? '—'} gacha</Text>
                    </View>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>To'lov usuli</Text>
                      <Text style={s.receiptValue}>{gateway}</Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => { setShowSuccess(false); navigation.replace('Home') }}
                    style={({ pressed }) => [s.goBtn, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={s.goText}>Darslarga o'tish</Text>
                    <Ionicons name="chevron-forward" size={16} color="#CDE9AE" />
                  </Pressable>
                  <Pressable
                    onPress={() => setShowSuccess(false)}
                    style={({ pressed }) => [s.closeBtn, pressed && { opacity: 0.8 }]}
                  >
                    <Text style={s.closeText}>Yopish</Text>
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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F7EE' },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 },
  backBtn: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1, borderRadius: 12,
  },
  headCenter: { alignItems: 'center' },
  headKicker: { fontSize: 10.5, letterSpacing: 1.7, fontWeight: '800', color: GRAY, textTransform: 'uppercase' },
  headTitle: { marginTop: 2, fontSize: 15, fontWeight: '800', color: INK },
  crownTile: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FCF1DC', borderColor: '#E8A33D', borderWidth: 1, borderRadius: 12,
  },
  crownIcon: { color: AMBER },

  hero: {
    position: 'relative', overflow: 'hidden', borderRadius: 20, minHeight: 210,
    backgroundColor: INK, marginBottom: 20,
  },
  heroInner: { padding: 20 },
  heroBadge: {
    width: 46, height: 46, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(155,224,75,0.16)', borderColor: 'rgba(155,224,75,0.36)',
    borderWidth: 1, borderRadius: 14,
  },
  heroH1: { marginTop: 16, fontSize: 24, lineHeight: 28, fontWeight: '800', letterSpacing: -0.5, color: '#F7FCED' },
  heroSub: { marginTop: 10, fontSize: 13, lineHeight: 18, fontWeight: '500', color: 'rgba(205,233,174,0.72)' },
  rateRow: {
    marginTop: 16, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(205,233,174,0.16)',
  },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rateText: { fontSize: 11.5, fontWeight: '800', color: '#CDE9AE' },
  rateDim: { color: 'rgba(205,233,174,0.5)' },

  sectionLabel: {
    fontSize: 10.5, letterSpacing: 1.4, fontWeight: '800', color: GRAY,
    textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4,
  },
  plans: { gap: 10, marginBottom: 20 },

  plan: {
    position: 'relative', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, paddingVertical: 14, paddingLeft: 16, paddingRight: 16,
  },
  planIdle: { backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1 },
  planOn: { backgroundColor: '#F1FAE7', borderColor: '#5FAF22', borderWidth: 1 },
  planRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  radio: {
    width: 22, height: 22, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
  },
  radioIdle: { backgroundColor: '#FFFFFF', borderColor: '#CFD9C6', borderWidth: 1.5 },
  radioOn: { backgroundColor: BRAND, borderColor: BRAND, borderWidth: 1.5 },
  planMid: { flex: 1, minWidth: 0 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planLabel: { fontSize: 14.5, fontWeight: '800', color: INK },
  planTotal: { marginTop: 6, fontSize: 11.5, fontWeight: '700', color: GRAY },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontSize: 19, fontWeight: '800', lineHeight: 21 },
  planUnit: { marginTop: 2, fontSize: 10, fontWeight: '700', color: FAINT, textTransform: 'uppercase' },
  saveChip: { marginTop: 6, backgroundColor: '#DDF3DC', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saveChipText: { fontSize: 11, fontWeight: '800', color: BRAND },
  badgeLime: { backgroundColor: '#EDF7DE', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  badgeLimeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6, color: BRAND, textTransform: 'uppercase' },
  badgeAmber: { backgroundColor: '#FCF1DC', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  badgeAmberText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6, color: AMBER, textTransform: 'uppercase' },

  features: { ...CARD, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingLeft: 14, paddingRight: 16, paddingVertical: 14 },
  featureTile: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#EDF7DE',
    alignItems: 'center', justifyContent: 'center',
  },
  featureMid: { flex: 1, minWidth: 0 },
  featureTitle: { fontSize: 13.5, fontWeight: '800', lineHeight: 18, color: INK },
  featureDesc: { marginTop: 4, fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: GRAY },

  gateways: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  gw: {
    flex: 1, height: 70, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  gwCheck: {
    position: 'absolute', top: 6, right: 6, width: 15, height: 15, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
  },
  gwLetter: {
    width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  gwLetterText: { fontSize: 13, fontWeight: '800' },
  gwName: { fontSize: 10, fontWeight: '800', letterSpacing: 0.2, textTransform: 'uppercase' },

  activeWrap: { marginTop: 4 },
  activeCard: {
    position: 'relative', overflow: 'hidden', marginBottom: 12,
    backgroundColor: '#DDF3DC', borderColor: '#A7D8A0', borderWidth: 1, borderRadius: 16,
  },
  activeRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: '#5FAF22' },
  activeInner: { paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  activeHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeTitle: { fontSize: 14, fontWeight: '800', color: '#0B4A34' },
  activeSub: { marginTop: 6, fontSize: 12, fontWeight: '600', color: BRAND },
  activeDateRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeDate: { fontSize: 11.5, fontWeight: '800', color: '#0B4A34' },
  cancelPro: {
    ...OUT_BTN, height: 48,
  },
  cancelProText: { fontSize: 13.5, fontWeight: '800', color: '#33452F' },

  dock: {
    position: 'absolute', left: 0, right: 0, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E1E7DA', paddingHorizontal: 16, paddingTop: 12,
  },
  dockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dockLeft: { flex: 1, minWidth: 0 },
  dockLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: FAINT, textTransform: 'uppercase' },
  dockTotal: { marginTop: 4, fontSize: 21, fontWeight: '800', lineHeight: 22, color: INK },
  dockCur: { color: GRAY, fontSize: 21 },
  dockOld: { color: FAINT, fontSize: 12, fontWeight: '700', textDecorationLine: 'line-through' },
  dockSave: { backgroundColor: '#DDF3DC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  dockSaveText: { fontSize: 12, fontWeight: '800', color: BRAND },
  buyBtn: {
    ...LIME_BTN, height: 52,
  },
  buyIcon: { color: '#1C3214', marginRight: 8 },
  buyText: { fontSize: 15, fontWeight: '800', color: '#1C3214' },
  dockFoot: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dockFootText: { fontSize: 10.5, fontWeight: '600', color: FAINT },

  modalRoot: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  modalScrim: { backgroundColor: 'rgba(14,26,18,0.6)' },
  modalWrap: { width: '100%' },
  successCard: { position: 'relative', overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: 22 },
  successBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 6 },
  successInner: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 },
  successHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  successTick: {
    position: 'relative', width: 52, height: 52, borderRadius: 16, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  successTickIcon: { color: '#1C3214' },
  successTitles: { flex: 1, minWidth: 0 },
  successH3: { fontSize: 20, fontWeight: '800', lineHeight: 24, color: INK },
  successSub: { marginTop: 4, fontSize: 12.5, fontWeight: '600', color: GRAY },
  receipt: {
    marginTop: 20, backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  receiptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  receiptLabel: { fontSize: 12, fontWeight: '700', color: GRAY },
  receiptValue: { fontSize: 12.5, fontWeight: '800', color: INK },
  goBtn: {
    ...INK_BTN, height: 52, marginTop: 20, gap: 6,
  },
  goText: { fontSize: 14.5, fontWeight: '800', color: '#CDE9AE' },
  closeBtn: { ...OUT_BTN, height: 44, marginTop: 10 },
  closeText: { fontSize: 13, fontWeight: '800', color: GRAY },
})

export default ProScreen
