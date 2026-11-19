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
import { EXAM_SET, PROBLEM_SETS, PRO_TRIAL } from '../data/content'
import { TOPICS } from '../data/curriculum'
import { isFreeLessonId, topicHasPaidLessons } from '../data/paywall'
import { PopIn } from '../components/Reveal'
import Sheet from '../components/Sheet'
import { TopScrim } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM, shadow } from '../theme/tokens'
import {
  GRAD_HEADER, GRAD_LIME, GRAD_RAIL,
  INK_BTN, LIME_BTN,
} from '../theme/solver'

/**
 * HDP Pro sahifasi — tarif tanlash, obuna holati va Pro'ga kirgan
 * imkoniyatlarning to'liq ro'yxati. To'lov qadami varaqada: onlayn
 * usullar (Payme/Click) hali ulanmagan, hozircha coin evaziga sinov.
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

/* Pro nimani ochadi — raqamlar kontent fayllaridan, qo'lda yozilmaydi */

const CURRICULUM = TOPICS.flatMap(t => t.lessons)
const PRO_LESSON_COUNT = CURRICULUM.filter(l => !isFreeLessonId(l.id)).length
const FREE_LESSON_COUNT = CURRICULUM.length - PRO_LESSON_COUNT
const PRO_TEST_COUNT = TOPICS.filter(t => topicHasPaidLessons(t.meta.num)).length
const PRO_SETS = [...PROBLEM_SETS, EXAM_SET].filter(s => !s.free)
const COIN_SET_COUNT = PRO_SETS.filter(s => !!s.unlockPrice).length
const COIN_SET_PRICE = Math.min(...PRO_SETS.map(s => s.unlockPrice ?? Infinity))

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

/** Chegarasiz oq karta soyasi */
const soft = shadow('#0E1A12', 12, 8, 0.07)
/** Tanlangan reja uchun yashil yorug'lik soyasi */
const glowGreen = shadow('#5FAF22', 14, 8, 0.2)

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
  const exit = useExit('Main')
  const [selected, setSelected] = useState<PlanId>('3m')
  const [showSuccess, setShowSuccess] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [payMsg, setPayMsg] = useState<string | null>(null)

  const isPro = useApp(s => s.isPro)
  const proExpires = useApp(s => s.proExpires)
  const coin = useApp(s => s.coin)
  const buyProTrial = useApp(s => s.buyProTrial)
  const cancelPro = useApp(s => s.cancelPro)

  const plan = PLANS.find(p => p.id === selected) ?? PLANS[1]
  const total = plan.perMonth * plan.months
  const baseline = BASE_PER_MONTH * plan.months
  const saved = baseline - total

  /** To'lov qadami: onlayn usullarsiz obuna faollashmaydi */
  const handleSubscribe = () => {
    triggerHaptic('light')
    setPayMsg(null)
    setPayOpen(true)
  }

  const payWithCoins = () => {
    const result = buyProTrial()
    if (result === 'ok') {
      triggerHaptic('success')
      setPayOpen(false)
      setShowSuccess(true)
      return
    }
    triggerHaptic('warning')
    setPayMsg(
      result === 'poor'
        ? `Coin yetarli emas — ${PRO_TRIAL.coin} coin kerak.`
        : 'Bu oy uchun coin sinovi allaqachon ishlatilgan.',
    )
  }

  return (
    <View style={s.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingTop: insets.top + 16, paddingBottom: (isPro ? 40 : 200) + insets.bottom },
        ]}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            hitSlop={10}
            style={({ pressed }) => [s.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={18} color="#33452F" />
          </Pressable>
          <View style={s.headCenter}>
            <Text style={s.headKicker}>Obuna</Text>
            <Text style={s.headTitle}>HDP Pro</Text>
          </View>
          <View style={s.headSpacer} />
        </View>

        {/* ── Hero: siyoh varaq ── */}
        <View style={s.hero}>
          <LinearGradient colors={GRAD_HEADER} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={ABS_FILL} />
          <HeroGrid />
          <View style={s.heroInner}>
            <View style={s.heroTop}>
              <View style={s.heroBadge}>
                <Ionicons name="diamond" size={18} color="#1C3214" />
              </View>
              <View style={s.heroPill}>
                <Text style={s.heroPillText}>HDP PRO</Text>
              </View>
            </View>
            <Text style={s.heroH1}>Barcha darslar, testlar va to&apos;plamlar bitta obunada</Text>
            <Text style={s.heroSub}>
              {`${FREE_LESSON_COUNT} bepul darsdan keyingi butun kurs — video, nazariya va amaliyot — to'liq ochiladi.`}
            </Text>

            <View style={s.heroStats}>
              {[
                [`${PRO_LESSON_COUNT}`, 'yopiq dars'],
                [`${PRO_TEST_COUNT}`, 'mavzu testi'],
                [`${PRO_SETS.length}`, "to'plam"],
              ].map(([v, l], i) => (
                <View key={l} style={[s.heroStatCell, i > 0 && s.heroStatCellB]}>
                  <Text style={[s.heroStatValue, NUM]}>{v}</Text>
                  <Text style={s.heroStatLabel}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Faol obuna holati ── */}
        {isPro && (
          <View style={s.activeCard}>
            <View style={s.activeInner}>
              <View style={s.activeHead}>
                <Ionicons name="ribbon" size={15} color={AMBER} />
                <Text style={s.activeTitle}>Pro faol</Text>
              </View>
              <Text style={s.activeSub}>
                {`${PRO_LESSON_COUNT} ta dars, ${PRO_TEST_COUNT} ta test va ${PRO_SETS.length} ta to'plam ochiq.`}
              </Text>
              {!!proExpires && (
                <View style={s.activeDateRow}>
                  <Ionicons name="calendar" size={14} color="#0B4A34" />
                  <Text style={[s.activeDate, NUM]}>Amal qiladi: {ruDate(proExpires)} gacha</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── Tarif rejalari ── */}
        {!isPro && (
          <>
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
          </>
        )}

        {/* ── Pro ichida nimalar bor ── */}
        <Text style={s.sectionLabel}>Pro ichida nimalar bor</Text>
        <View style={s.features}>
          {([
            {
              icon: 'book',
              title: `${PRO_LESSON_COUNT} ta yopiq dars`,
              desc: `${FREE_LESSON_COUNT} bepul darsdan keyingi barcha bo'limlar — video, nazariya va amaliyot`,
            },
            {
              icon: 'document-text',
              title: `${PRO_TEST_COUNT} ta mavzu testi`,
              desc: 'Har mavzu yakunidagi test, natija va to‘liq tahlil bilan',
            },
            {
              icon: 'layers',
              title: `${COIN_SET_COUNT} ta Pro to'plam`,
              desc: `Geometriya va Olimpiada — hozir ${COIN_SET_PRICE} coin, Pro'da coin sarflamasdan`,
            },
            {
              icon: 'stopwatch',
              title: 'Umumiy sinov',
              desc: `${EXAM_SET.questions.length} savolli imtihon simulyatsiyasi — barcha mavzular aralash`,
            },
          ] as { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[]).map((f, i) => (
            <View
              key={f.title}
              style={[s.feature, i > 0 ? { borderTopWidth: 1, borderTopColor: '#EDF1E7' } : null]}
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

        {/* ── Coin bilan sinash — Do'kondagi haftalik Pro ── */}
        <Pressable
          onPress={() => { triggerHaptic('light'); navigation.navigate('Main', { screen: 'Shop' }) }}
          style={({ pressed }) => [s.coinRow, pressed && { opacity: 0.85 }]}
        >
          <View style={s.coinTile}>
            <Ionicons name="wallet" size={16} color={AMBER} />
          </View>
          <View style={s.coinMid}>
            <Text style={s.coinTitle}>Coin bilan sinab ko&apos;rish</Text>
            <Text style={s.coinDesc}>{`Do'konda ${PRO_TRIAL.coin} coin — ${PRO_TRIAL.days} kunlik Pro`}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={FAINT} />
        </Pressable>

        <View style={s.plainNote}>
          <Ionicons name="shield-checkmark" size={14} color={BRAND} />
          <Text style={s.plainNoteText}>
            Yashirin to&apos;lov yo&apos;q — muddat tugagach obuna o&apos;zi yangilanmaydi.
          </Text>
        </View>

        {/* ── Obunani boshqarish ── */}
        {isPro && (
          <Pressable
            onPress={() => { cancelPro(); triggerHaptic('warning'); navigation.navigate('Main') }}
            style={({ pressed }) => [s.cancelPro, pressed && { opacity: 0.8 }]}
          >
            <Text style={s.cancelProText}>Obunani bekor qilish</Text>
          </Pressable>
        )}
      </ScrollView>

      <TopScrim height={insets.top} line="#E6EBE0" />

      {/* ── Xarid paneli — bosh barmaq zonasi, doim ko'z oldida ── */}
      {!isPro && (
        <View style={[s.dock, { paddingBottom: insets.bottom + 12 }]}>
          <View style={s.dockHead}>
            <View style={s.dockLeft}>
              <Text style={s.dockLabel}>{`Jami to'lov · ${plan.label}`}</Text>
              <View style={s.dockTotalRow}>
                <Text style={[s.dockTotal, NUM]}>
                  {money(total)} <Text style={s.dockCur}>so&apos;m</Text>
                </Text>
                {saved > 0 && <Text style={[s.dockOld, NUM]}>{money(baseline)}</Text>}
              </View>
            </View>
            <View style={s.dockSave}>
              <Text style={[s.dockSaveText, NUM]}>−{money(saved)} so'm</Text>
            </View>
          </View>

          <Pressable
            onPress={handleSubscribe}
            style={({ pressed }) => [s.buyBtn, pressed && { transform: [{ scale: 0.985 }] }]}
          >
            <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[ABS_FILL, { borderRadius: 14 }]} />
            <Ionicons name="ribbon" size={17} color="#1C3214" style={s.buyIcon} />
            <Text style={s.buyText}>Obuna olish</Text>
          </Pressable>

          <View style={s.dockFoot}>
            <Ionicons name="information-circle-outline" size={12} color={FAINT} />
            <Text style={s.dockFootText}>
              Onlayn to&apos;lov tez orada — hozircha coin bilan sinov
            </Text>
          </View>
        </View>
      )}

      {/* ── To'lov varaqasi ── */}
      <Sheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="TO'LOV"
        subtitle={`${plan.label} · ${money(total)} so'm`}
      >
        <View style={s.payBox}>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Tarif</Text>
            <Text style={[s.payValue, NUM]}>
              {plan.label} · {plan.months} oy
            </Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Jami</Text>
            <Text style={[s.payValue, NUM]}>{money(total)} so&apos;m</Text>
          </View>
          {saved > 0 && (
            <View style={s.payRow}>
              <Text style={s.payLabel}>Tejov</Text>
              <Text style={[s.payValue, NUM, { color: BRAND }]}>−{money(saved)} so&apos;m</Text>
            </View>
          )}
        </View>

        <Text style={s.paySection}>Onlayn to&apos;lov</Text>
        {([
          { name: 'Payme', icon: 'card' },
          { name: 'Click', icon: 'phone-portrait' },
        ] as { name: string; icon: keyof typeof Ionicons.glyphMap }[]).map(m => (
          <View key={m.name} style={s.methodRow}>
            <View style={s.methodTile}>
              <Ionicons name={m.icon} size={16} color={FAINT} />
            </View>
            <Text style={s.methodName}>{m.name}</Text>
            <View style={s.soonPill}>
              <Text style={s.soonText}>Tez orada</Text>
            </View>
          </View>
        ))}
        <Text style={s.payNote}>
          Onlayn to&apos;lov hali ulanmagan — ishga tushgach obuna shu yerda faollashadi.
        </Text>

        <View style={s.payDivider} />

        <View style={s.trialHead}>
          <Text style={s.paySection}>Hozircha coin bilan</Text>
          <Text style={[s.trialCoin, NUM]}>{coin} coin</Text>
        </View>
        <Pressable
          onPress={payWithCoins}
          style={({ pressed }) => [s.trialBtn, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="wallet" size={16} color="#CDE9AE" />
          <Text style={s.trialBtnText}>
            {PRO_TRIAL.coin} coin — {PRO_TRIAL.days} kunlik Pro
          </Text>
        </Pressable>
        {!!payMsg && <Text style={s.payMsg}>{payMsg}</Text>}
        <Text style={s.payFine}>Oyiga bir marta. Obuna avtomatik yangilanmaydi.</Text>
      </Sheet>

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
                      <Text style={s.successH3}>Pro faollashtirildi!</Text>
                      <Text style={s.successSub}>Darslar va to&apos;plamlarga kirish ochildi.</Text>
                    </View>
                  </View>

                  <View style={s.receipt}>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>Tarif</Text>
                      <Text style={[s.receiptValue, NUM]}>{PRO_TRIAL.days} kunlik sinov</Text>
                    </View>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>To&apos;lov</Text>
                      <Text style={[s.receiptValue, NUM]}>{PRO_TRIAL.coin} coin</Text>
                    </View>
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>Amal muddati</Text>
                      <Text style={[s.receiptValue, NUM]}>{ruDate(proExpires) ?? '—'} gacha</Text>
                    </View>
                  </View>
                  <Text style={s.receiptNote}>
                    Coin hamyondan yechildi. Obuna avtomatik yangilanmaydi.
                  </Text>

                  <Pressable
                    onPress={() => { setShowSuccess(false); navigation.navigate('Main') }}
                    style={({ pressed }) => [s.goBtn, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={s.goText}>Darslarga o'tish</Text>
                    <Ionicons name="chevron-forward" size={16} color="#CDE9AE" />
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
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 13, ...soft,
  },
  headCenter: { alignItems: 'center' },
  headKicker: { fontSize: 12, fontWeight: '500', color: GRAY },
  headTitle: { marginTop: 2, fontSize: 15, fontWeight: '600', color: INK },
  headSpacer: { width: 40 },

  hero: {
    position: 'relative', overflow: 'hidden', borderRadius: 20,
    backgroundColor: INK, marginBottom: 16,
  },
  heroInner: { padding: 18 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroBadge: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#9BE04B', borderRadius: 100,
    ...shadow('#9BE04B', 8, 4, 0.4),
  },
  heroPill: {
    backgroundColor: 'rgba(155,224,75,0.14)', borderRadius: 11,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  heroPillText: { fontSize: 9.5, fontWeight: '700', color: '#9BE04B', letterSpacing: 0.8 },
  heroH1: {
    marginTop: 12, fontSize: 20, lineHeight: 25, fontWeight: '600',
    letterSpacing: -0.4, color: '#F7FCED',
  },
  heroSub: { marginTop: 7, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: 'rgba(205,233,174,0.75)' },

  heroStats: {
    marginTop: 14, flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(155,224,75,0.16)', paddingTop: 12,
  },
  heroStatCell: { flex: 1, alignItems: 'center' },
  heroStatCellB: { borderLeftWidth: 1, borderLeftColor: 'rgba(155,224,75,0.16)' },
  heroStatValue: { fontSize: 18, lineHeight: 21, fontWeight: '700', color: '#9BE04B', letterSpacing: -0.3 },
  heroStatLabel: { marginTop: 2, fontSize: 10, fontWeight: '500', color: 'rgba(205,233,174,0.72)' },

  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: INK,
    marginBottom: 8, paddingLeft: 4,
  },
  plans: { gap: 8, marginBottom: 16 },

  plan: {
    position: 'relative', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 12,
    minHeight: 74, borderRadius: 18, paddingVertical: 11, paddingLeft: 16, paddingRight: 16,
  },
  planIdle: { backgroundColor: '#FFFFFF', ...soft },
  planOn: { backgroundColor: '#F1FAE7', ...glowGreen },
  radio: {
    width: 22, height: 22, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
  },
  radioIdle: { backgroundColor: '#FFFFFF', borderColor: '#CFD9C6', borderWidth: 1.5 },
  radioOn: { backgroundColor: BRAND, borderColor: BRAND, borderWidth: 1.5 },
  planMid: { flex: 1, minWidth: 0 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planLabel: { fontSize: 14.5, fontWeight: '600', color: INK },
  planTotal: { marginTop: 6, fontSize: 12, fontWeight: '500', color: GRAY },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontSize: 19, fontWeight: '600', lineHeight: 21 },
  planUnit: { marginTop: 2, fontSize: 12, fontWeight: '500', color: FAINT },
  saveChip: { marginTop: 6, backgroundColor: '#DDF3DC', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saveChipText: { fontSize: 12, fontWeight: '600', color: BRAND },
  badgeLime: { backgroundColor: '#EDF7DE', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  badgeLimeText: { fontSize: 11, fontWeight: '600', color: BRAND },
  badgeAmber: { backgroundColor: '#FCF1DC', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  badgeAmberText: { fontSize: 11, fontWeight: '600', color: AMBER },

  features: { backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', marginBottom: 10, ...soft },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingLeft: 14, paddingRight: 16, paddingVertical: 12 },
  featureTile: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#EDF7DE',
    alignItems: 'center', justifyContent: 'center',
  },
  featureMid: { flex: 1, minWidth: 0 },
  featureTitle: { fontSize: 13.5, fontWeight: '600', lineHeight: 18, color: INK },
  featureDesc: { marginTop: 3, fontSize: 12, lineHeight: 17, fontWeight: '500', color: GRAY },

  coinRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 10,
    paddingLeft: 12, paddingRight: 14, paddingVertical: 11,
    ...soft,
  },
  coinTile: {
    width: 34, height: 34, borderRadius: 11, backgroundColor: '#FCF1DC',
    alignItems: 'center', justifyContent: 'center',
  },
  coinMid: { flex: 1, minWidth: 0 },
  coinTitle: { fontSize: 13, fontWeight: '600', color: INK },
  coinDesc: { marginTop: 2, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: GRAY },

  plainNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    paddingHorizontal: 4, marginBottom: 20,
  },
  plainNoteText: { flex: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: GRAY },

  activeCard: {
    position: 'relative', overflow: 'hidden', marginBottom: 20,
    backgroundColor: '#E9F7DF', borderRadius: 18, ...glowGreen,
  },
  activeInner: { paddingLeft: 18, paddingRight: 16, paddingVertical: 16 },
  activeHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeTitle: { fontSize: 14, fontWeight: '600', color: '#0B4A34' },
  activeSub: { marginTop: 6, fontSize: 12, fontWeight: '500', color: BRAND },
  activeDateRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeDate: { fontSize: 12, fontWeight: '600', color: '#0B4A34' },
  cancelPro: {
    backgroundColor: '#FFFFFF', borderRadius: 14, height: 48,
    alignItems: 'center', justifyContent: 'center', ...soft,
  },
  cancelProText: { fontSize: 13.5, fontWeight: '600', color: '#33452F' },

  dock: {
    position: 'absolute', left: 12, right: 12, bottom: 12,
    backgroundColor: '#FFFFFF', borderRadius: 20,
    paddingHorizontal: 16, paddingTop: 14,
    ...shadow('#0E1A12', 20, 6, 0.12),
  },
  dockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dockLeft: { flex: 1, minWidth: 0 },
  dockLabel: { fontSize: 12, fontWeight: '500', color: GRAY },
  dockTotalRow: { marginTop: 4, flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  dockTotal: { fontSize: 21, fontWeight: '600', lineHeight: 22, color: INK },
  dockCur: { color: GRAY, fontSize: 21 },
  dockOld: { color: FAINT, fontSize: 12, fontWeight: '500', textDecorationLine: 'line-through' },
  dockSave: { backgroundColor: '#DDF3DC', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  dockSaveText: { fontSize: 12, fontWeight: '600', color: BRAND },
  buyBtn: {
    ...LIME_BTN, height: 52, borderRadius: 14,
  },
  buyIcon: { color: '#1C3214', marginRight: 8 },
  buyText: { fontSize: 15, fontWeight: '600', color: '#1C3214' },
  dockFoot: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dockFootText: { fontSize: 11.5, fontWeight: '500', color: GRAY },

  payBox: {
    marginTop: 4, backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payLabel: { fontSize: 12, fontWeight: '500', color: GRAY },
  payValue: { fontSize: 12.5, fontWeight: '600', color: INK },
  paySection: { marginTop: 16, marginBottom: 4, fontSize: 10.5, fontWeight: '600', letterSpacing: 1.4, color: GRAY },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  methodTile: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: '#F3F5EF',
    alignItems: 'center', justifyContent: 'center',
  },
  methodName: { flex: 1, fontSize: 13.5, fontWeight: '600', color: INK },
  soonPill: { backgroundColor: '#EDEFF5', borderRadius: 11, paddingHorizontal: 8, paddingVertical: 3 },
  soonText: { fontSize: 10.5, fontWeight: '600', color: GRAY },
  payNote: { marginTop: 2, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: FAINT },
  payDivider: { height: 1, backgroundColor: '#EDF1E7', marginTop: 16 },
  trialHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  trialCoin: { fontSize: 11.5, fontWeight: '600', color: AMBER, marginTop: 16 },
  trialBtn: {
    ...INK_BTN, height: 50, marginTop: 10, gap: 8,
  },
  trialBtnText: { fontSize: 13.5, fontWeight: '600', color: '#CDE9AE' },
  payMsg: { marginTop: 10, fontSize: 12, lineHeight: 17, fontWeight: '500', color: '#B4442F' },
  payFine: { marginTop: 10, fontSize: 11, lineHeight: 15, color: FAINT },

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
  successH3: { fontSize: 20, fontWeight: '600', lineHeight: 24, color: INK },
  successSub: { marginTop: 4, fontSize: 12.5, fontWeight: '500', color: GRAY },
  receipt: {
    marginTop: 20, backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  receiptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  receiptLabel: { fontSize: 12, fontWeight: '500', color: GRAY },
  receiptValue: { fontSize: 12.5, fontWeight: '600', color: INK },
  receiptNote: { marginTop: 10, fontSize: 12, lineHeight: 16, fontWeight: '500', color: FAINT },
  goBtn: {
    ...INK_BTN, height: 52, marginTop: 20, gap: 6,
  },
  goText: { fontSize: 14.5, fontWeight: '600', color: '#CDE9AE' },
})

export default ProScreen
