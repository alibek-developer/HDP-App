import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { resetToTopics, useExitToTab } from '../lib/nav'
import { findTopic } from '../data/curriculum'
import { findLevel, STAR_THRESHOLDS, WEEKLY_STAR_GOAL, weekStartKey } from '../data/problems'
import { TopScrim } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import type { ThemeColors } from '../theme/tokens'
import { CARD, GRAD_RAIL, LIME_BTN, LIME_TEXT, OUT_BTN, OUT_TEXT } from '../theme/solver'

/**
 * 7-qadam: Natija — umumiy hisob: nechta to'g'ri, qancha coin.
 * To'g'ri javoblar va yechimlar ko'rsatilmaydi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const TICK = { ok: '#5FAF22', bad: '#D9483B', todo: '#E1E7DA' }
const SKIP_TONE = '#E8A33D'

const ResultScreen = () => {
  const C = useColors()
  const styles = makeStyles(C)
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exitToProblems = useExitToTab('problems')

  const result = useApp(s => s.lastResult)
  const coin = useApp(s => s.coin)
  const starWeek = useApp(s => s.starWeek)
  const starsThisWeek = useApp(s => s.starsThisWeek)
  const levelStars = useApp(s => s.levelStars)

  /** Fan → daraja sessiyasi natijasi yulduz bilan baholanadi */
  const level = result && result.kind === 'problem-set' ? findLevel(result.refId) : undefined
  const isLevel = !!level && result?.stars !== undefined

  /** Mavzu testi natijasi — chegara va mavzu raqami refId'dan (`3.12` → 3) */
  const topicNum = result?.kind === 'topic-test' ? Number(result.refId.split('.')[0]) : 1
  const topicEntry = findTopic(topicNum)
  const pass = topicEntry?.pass ?? 0
  const passTotal = topicEntry?.test.total ?? 0

  /**
   * Natijaga kelish yo'li test/to'plam ekrani edi — ular tarixda qolmasin.
   * Mavzu testi mavzuga, to'plam masalalarga qaytadi; foydalanuvchi boshidan
   * o'tgan test ekraniga tushmaydi.
   */
  const exit = () => {
    triggerHaptic('medium')
    if (result?.kind === 'topic-test') resetToTopics(navigation, topicNum)
    else navigation.navigate('Main', { screen: 'Problems' })
  }

  if (!result) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.emptyTile}>
          <Ionicons name="book-outline" size={22} color="#5FAF22" />
        </View>
        <Text style={styles.emptyTitle}>Natija topilmadi</Text>
        <Text style={styles.emptyText}>Avval test yoki to'plamni yakunlang.</Text>
        <Pressable
          onPress={() => {
            triggerHaptic('light')
            navigation.navigate('Main', { screen: 'Home' })
          }}
          style={({ pressed }) => [LIME_BTN, styles.emptyCta, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />
          <Text style={[styles.emptyCtaText, LIME_TEXT]}>Bosh sahifaga</Text>
        </Pressable>
      </View>
    )
  }

  const total = result.answers.length
  const correct = result.answers.filter(a => a.ok).length
  const skipped = result.answers.filter(a => a.skipped)
  const wrong = result.answers.filter(a => !a.ok && !a.skipped)
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  const tone = percent >= 80 ? TICK.ok : percent >= 50 ? SKIP_TONE : C.danger
  const stars = result.stars ?? 0
  /** Daraja yulduzi eng yaxshi natijadan pastga tushmaydi — takroriy urinishda ham shu ko'rinadi */
  const bestStars = level ? levelStars[level.id] ?? 0 : 0
  const shownStars = Math.max(stars, bestStars)
  const weekStars = starWeek === weekStartKey() ? starsThisWeek : 0

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 110 + insets.bottom }]}
      >
        {/* ── Natija varaqasi ── */}
        <View style={styles.sheet}>
          <View style={[styles.card, { borderRadius: 16 }]}>
            <View style={[styles.rail, { width: 6, backgroundColor: tone }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardHead}>
                <View style={styles.cardHeadText}>
                  <Text style={styles.kicker}>
                    {isLevel
                      ? 'Daraja natijasi'
                      : result.kind === 'problem-set'
                        ? "To'plam natijasi"
                        : 'Mavzu yakuniy testi'}
                  </Text>
                  <Text style={styles.cardTitle}>{result.title}</Text>
                </View>
                <View style={styles.scoreWrap}>
                  <Text style={[styles.score, NUM]}>{correct}</Text>
                  <Text style={[styles.scoreTotal, NUM]}>/{total}</Text>
                </View>
              </View>

              <View style={styles.tickRow}>
                {result.answers.map((a, i) => (
                  <View
                    key={i}
                    style={[styles.tick, { backgroundColor: a.ok ? TICK.ok : a.skipped ? SKIP_TONE : C.danger }]}
                  />
                ))}
              </View>

              <View style={styles.tickFoot}>
                <Text style={[styles.percent, NUM, { color: tone }]}>
                  {percent}% {percent >= 80 ? '· ajoyib' : percent >= 50 ? '· yaxshi' : '· takrorlash kerak'}
                </Text>
                <Text style={styles.wrongCount}>
                  {wrong.length} ta xato{skipped.length > 0 ? ` · ${skipped.length} o'tkazildi` : ''}
                </Text>
              </View>

              {isLevel && (
                <View style={styles.starsBlock}>
                  <View style={styles.starsRow}>
                    {[0, 1, 2].map(i => (
                      <Ionicons
                        key={i}
                        name={i < shownStars ? 'star' : 'star-outline'}
                        size={24}
                        color={i < shownStars ? C.coin : '#DCE3D4'}
                      />
                    ))}
                    <Text style={[styles.starsValue, NUM]}>{shownStars}/3</Text>
                  </View>
                  <Text style={styles.starsHint}>
                    {shownStars === 3
                      ? 'Daraja to‘liq yopildi — uchala yulduz sizda.'
                      : `Keyingi yulduz: ${STAR_THRESHOLDS[shownStars]} ta to‘g‘ri javob.`}
                  </Text>
                  {stars < bestStars && (
                    <Text style={[styles.starsWeek, NUM]}>
                      Bu urinishda: {stars}/3 — daraja yulduzlari saqlanib qoldi.
                    </Text>
                  )}
                  <Text style={[styles.starsWeek, NUM]}>
                    Haftalik maqsad: {Math.min(weekStars, WEEKLY_STAR_GOAL)}/{WEEKLY_STAR_GOAL} yulduz
                  </Text>
                </View>
              )}

              {result.kind === 'topic-test' && (
                <View style={[styles.passNote, { backgroundColor: correct >= pass ? '#EDF8E6' : C.dangerSoft }]}>
                  <Ionicons
                    name={correct >= pass ? 'checkmark-circle' : 'alert-circle'}
                    size={14}
                    color={correct >= pass ? TICK.ok : C.danger}
                  />
                  <Text style={[styles.passNoteText, { color: correct >= pass ? '#3F7A18' : '#A33B31' }]}>
                    {correct >= pass ? "Mavzudan o'tdingiz" : "Mavzudan o'tmadingiz"} · chegara{' '}
                    {pass}/{passTotal}
                  </Text>
                </View>
              )}

              {/* Mukofot ledger */}
              <View style={styles.ledger}>
                {[
                  { v: `+${result.coinsEarned}`, u: 'coin', c: '#B87A22' },
                  { v: `+${result.xpEarned}`, u: 'XP', c: '#3560C4' },
                  { v: `${coin.toLocaleString('en-US')}`, u: 'hamyonda', c: C.ink },
                ].map((cell, i) => (
                  <View key={cell.u} style={styles.ledgerCell}>
                    {i > 0 && <View style={styles.ledgerDivider} />}
                    <View style={styles.ledgerInner}>
                      <Text style={[styles.ledgerValue, NUM, { color: cell.c }]}>{cell.v}</Text>
                      <Text style={styles.ledgerUnit}>{cell.u}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── Xatosiz yakun ── */}
        {correct > 0 && wrong.length === 0 && skipped.length === 0 && (
          <View style={styles.section}>
            <View style={styles.perfect}>
              <LinearGradient
                colors={GRAD_RAIL}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.rail, { width: 5 }]}
              />
              <View style={styles.perfectBody}>
                <Text style={styles.perfectTitle}>Xatosiz yakunladingiz</Text>
                <Text style={styles.perfectText}>
                  {isLevel
                    ? '10 masala xatosiz — daraja to‘liq yopildi.'
                    : result.kind === 'problem-set'
                      ? "To'plam to'liq yechildi."
                      : "Barcha savollarga to'g'ri javob berdingiz."}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <TopScrim height={insets.top} line={C.line} />

      {/* ── Pastki harakat paneli ── */}
      <View style={[styles.dock, { paddingBottom: insets.bottom + 20 }]} pointerEvents="box-none">
        <View style={styles.dockInner} pointerEvents="auto">
          <View style={styles.dockRow}>
            <Pressable
              onPress={() => {
                if (isLevel) {
                  exitToProblems()
                  return
                }
                triggerHaptic('light')
                navigation.navigate('Main', { screen: 'Home' })
              }}
              style={({ pressed }) => [OUT_BTN, styles.dockBtn, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <Ionicons
                name={isLevel ? 'chevron-back' : 'home-outline'}
                size={15}
                color={C.ink2}
              />
              <Text style={[styles.dockBtnText, OUT_TEXT]}>
                {isLevel ? 'Darajalar' : 'Bosh sahifa'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (isLevel) {
                  triggerHaptic('medium')
                  navigation.replace('ProblemSet', { setId: result.refId })
                  return
                }
                exit()
              }}
              style={({ pressed }) => [LIME_BTN, styles.dockBtn, { overflow: 'hidden' }, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />
              <Ionicons
                name={result.kind === 'lesson-test' ? 'book-outline' : 'refresh'}
                size={15}
                color="#1C3214"
              />
              <Text style={[styles.dockBtnText, LIME_TEXT]}>
                {result.kind === 'lesson-test' ? 'Davom etish' : 'Yana ishlash'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },
  content: {},
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },

  emptyTile: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: C.ink },
  emptyText: { fontSize: 12.5, fontWeight: '500', color: C.ink3, textAlign: 'center' },
  emptyCta: { marginTop: 8, height: 46, paddingHorizontal: 24, overflow: 'hidden' },
  emptyCtaText: { fontSize: 13.5 },

  sheet: { paddingHorizontal: 16 },
  section: { marginTop: 24, paddingHorizontal: 16 },

  card: { ...CARD, position: 'relative', flexDirection: 'row', overflow: 'hidden' },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  cardBody: { flex: 1, paddingLeft: 15, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },

  cardHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardHeadText: { flex: 1 },
  kicker: { fontSize: 11.5, fontWeight: '500', color: C.ink3 },
  cardTitle: { marginTop: 8, fontSize: 14, fontWeight: '600', color: C.ink },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontSize: 34, lineHeight: 34, fontWeight: '600', color: C.ink },
  scoreTotal: { fontSize: 18, fontWeight: '600', color: C.ink4 },

  tickRow: { marginTop: 16, flexDirection: 'row', gap: 6 },
  tick: { flex: 1, height: 6, borderRadius: 3 },
  tickFoot: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passNote: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  passNoteText: { fontSize: 12, fontWeight: '600' },
  percent: { fontSize: 11.5, fontWeight: '600' },
  wrongCount: { fontSize: 11.5, fontWeight: '500', color: C.ink4 },

  starsBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starsValue: { marginLeft: 4, fontSize: 15, fontWeight: '600', color: C.coin },
  starsHint: { marginTop: 8, fontSize: 12, lineHeight: 17, fontWeight: '500', color: C.ink3 },
  starsWeek: { marginTop: 6, fontSize: 11.5, fontWeight: '500', color: C.ink4 },

  ledger: { marginTop: 16, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 14 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: C.line },
  ledgerInner: { flex: 1, alignItems: 'center' },
  ledgerValue: { fontSize: 17, lineHeight: 17, fontWeight: '600' },
  ledgerUnit: { marginTop: 6, fontSize: 11, fontWeight: '500', color: C.ink4 },

  perfect: { backgroundColor: C.brandDeep, borderRadius: 14, overflow: 'hidden', flexDirection: 'row' },
  perfectBody: { flex: 1, paddingLeft: 15, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  perfectTitle: { fontSize: 15, fontWeight: '600', color: C.limeBright },
  perfectText: { marginTop: 4, fontSize: 12.5, fontWeight: '500', color: 'rgba(205,233,174,0.6)' },

  dock: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  dockInner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(243,247,238,0.94)',
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  dockRow: { flexDirection: 'row', gap: 10 },
  dockBtn: { flex: 1, height: 50, gap: 6 },
  dockBtnText: { fontSize: 13.5 },
})

export default ResultScreen
