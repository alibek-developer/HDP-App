import { useEffect } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { MidnightClock } from '../components/MidnightClock'
import { TopScrim } from '../components/ui'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { ABS_FILL, MATH_FONT, NUM, R, type ThemeColors } from '../theme/tokens'
import { useColors, useIsDark } from '../theme/useTheme'
import ProblemSubjectCard from '../components/ProblemSubjectCard'
import { DAILY_BONUS, FORMULA_GROUPS } from '../data/content'
import {
  PROBLEM_SUBJECTS, WEEKLY_STAR_GOAL, levelsOf, weekStartKey,
} from '../data/problems'
import { difficultyLabel, sourceLabel } from '../lib/daily'
import { useDailyQuestion } from '../lib/useDailyQuestion'
import { CARD_LIFT, GRAD_HEADER, GRAD_HEADER_DARK, GRAD_LIME, GRAD_RAIL, LIME_BTN, LIME_TEXT } from '../theme/solver'

/**
 * Masalalar — fan → daraja → 10 masalalik sessiya xaritasi.
 * Kunlik masala va formulalar shu yerda qoladi, lekin mashqning asosiy
 * yo'li bitta: fan kartasi, ichida uchta daraja.
 */

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const TIERS = [
  { name: "Boshlang'ich", need: 0 },
  { name: "O'rta", need: 5 },
  { name: 'Qiyin', need: 12 },
  { name: 'Olimpiada', need: 20 },
]

/** Store bilan bir xil mahalliy sana kaliti (UTC siljishi kunlik bonusni buzmasin) */
const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const num = (n: number) => n.toLocaleString('en-US')

const ProblemsScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()

  const coin = useApp(s => s.coin)
  const streak = useApp(s => s.streak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const levelStars = useApp(s => s.levelStars)
  const starWeek = useApp(s => s.starWeek)
  const starsThisWeek = useApp(s => s.starsThisWeek)
  const rollDay = useApp(s => s.rollDay)
  const dailyBonusOn = useApp(s => s.dailyBonusOn)
  const { question: daily, status: dailyStatus } = useDailyQuestion()

  const C = useColors()
  const isDark = useIsDark()
  const styles = makeStyles(C)

  /** Hafta almashgan bo'lsa eski yulduzlar ko'rinmaydi */
  const weekStars = starWeek === weekStartKey() ? starsThisWeek : 0

  useEffect(() => {
    rollDay()
  }, [rollDay])

  const dailyClaimed = dailyBonusOn === todayKey()
  const dailyDone = daily ? daily.picked !== null : false

  const openSubject = (subjectId: string) => {
    triggerHaptic('medium')
    navigation.navigate('SubjectLevels', { subjectId })
  }

  const openLevel = (setId: string) => {
    triggerHaptic('medium')
    navigation.navigate('ProblemSet', { setId })
  }

  const tierIdx = Math.max(0, TIERS.reduce((acc, t, i) => (solvedCount >= t.need ? i : acc), 0))
  const tier = TIERS[tierIdx]
  const nextTier = TIERS[tierIdx + 1]
  const tierPct = nextTier
    ? Math.min(100, Math.round(((solvedCount - tier.need) / (nextTier.need - tier.need)) * 100))
    : 100

  /** Jami hajm — sarlavha yonidagi raqamlar qo'lda yozilmaydi */
  const allLevels = PROBLEM_SUBJECTS.reduce((n, sub) => n + levelsOf(sub.id).length, 0)
  const allQuestions = PROBLEM_SUBJECTS.reduce(
    (n, sub) => n + levelsOf(sub.id).reduce((m, lvl) => m + lvl.questions.length, 0),
    0,
  )

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: 0, paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── 1. Header: siyoh varaq + ledger ── */}
        <LinearGradient
          colors={isDark ? GRAD_HEADER_DARK : GRAD_HEADER}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.55, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.titleRow}>
              <View style={styles.glyphTile}>
                <MCI name="calculator-variant" size={18} color="#9BE04B" />
              </View>
              <View>
                <Text style={styles.h1}>Masalalar</Text>
                <Text style={styles.h1Sub}>Fan → daraja → 10 masala</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Shop')
              }}
              style={({ pressed }) => [styles.coinChip, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <MCI name="cash" size={14} color="#F3C88A" />
              <Text style={[styles.coinChipText, NUM]}>{num(coin)}</Text>
            </Pressable>
          </View>

          <View style={styles.ledger}>
            {[
              { v: `${streak}`, u: 'kun ketma-ket', icon: 'fire' as const, c: '#F3C88A' },
              { v: `${solvedCount}`, u: 'ta yechilgan', icon: 'check' as const, c: C.limeBright },
              { v: `${solvedToday}`, u: 'bugun', icon: 'flash' as const, c: C.mint },
            ].map((cell, i) => (
              <View key={cell.u} style={styles.ledgerCell}>
                {i > 0 && <View style={styles.ledgerDivider} />}
                <View style={styles.ledgerInner}>
                  <Text style={[styles.ledgerValue, NUM]}>{cell.v}</Text>
                  <View style={styles.ledgerLabelRow}>
                    <MCI name={cell.icon} size={12} color={cell.c} />
                    <Text style={styles.ledgerLabel}>{cell.u}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.tierBlock}>
            <View style={styles.tierMeta}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={[styles.tierNext, NUM]}>
                {nextTier
                  ? `${solvedCount}/${nextTier.need} · keyingi: ${nextTier.name}`
                  : 'eng yuqori daraja'}
              </Text>
            </View>
            <View style={styles.tierTrack}>
              <View style={[styles.tierTrackFill, { width: `${tierPct}%` }]} />
            </View>
          </View>
          <View style={styles.headerTail} />
        </LinearGradient>

        <View style={styles.body}>
          {/* ── 2. Bugungi masala — ticket ── */}
          <View style={[CARD_LIFT, styles.ticket]}>
            <LinearGradient
              colors={GRAD_RAIL}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.ticketStub}
            >
              <MCI name="calendar-star" size={15} color="#F4FFE8" />
              <Text style={styles.ticketStubLabel}>BUGUN</Text>
            </LinearGradient>

            <View style={styles.ticketTear} pointerEvents="none">
              {Array.from({ length: 11 }).map((_, i) => (
                <View key={i} style={styles.ticketTearDash} />
              ))}
            </View>
            <View pointerEvents="none" style={[styles.notch, styles.notchTop]} />
            <View pointerEvents="none" style={[styles.notch, styles.notchBottom]} />

            <View style={styles.ticketBody}>
              <View style={styles.ticketHead}>
                <Text style={styles.ticketTitle} numberOfLines={1}>
                  {daily ? daily.topic : 'Kunlik savol'}
                </Text>
                <View style={styles.clockChip}>
                  <MCI name="timer-outline" size={11} color={C.ink4} />
                  <MidnightClock style={[styles.clockText, NUM]} />
                </View>
              </View>

              <Text style={styles.ticketMeta}>
                {daily ? sourceLabel(daily.source) : 'Kunlik mashq'}
                {daily ? ` · ${difficultyLabel(daily.difficulty)}` : ''}
              </Text>

              <View style={styles.promptBox}>
                <Text style={styles.promptText}>
                  {daily
                    ? daily.prompt
                    : dailyStatus === 'error'
                      ? "Savolni yuklab bo'lmadi — qayta urinib ko'ring"
                      : 'Savol tayyorlanmoqda…'}
                </Text>
              </View>

              <View style={styles.ticketBottom}>
                <View style={styles.rewardLedger}>
                  <Text style={[styles.rewardCoin, NUM]}>+{DAILY_BONUS.coin}</Text>
                  <Text style={styles.rewardUnit}>coin</Text>
                  <View style={styles.rewardDivider} />
                  <Text style={[styles.rewardXp, NUM]}>+{DAILY_BONUS.xp}</Text>
                  <Text style={styles.rewardUnit}>XP</Text>
                  {dailyClaimed && <Text style={styles.claimedNote}>bugun olindi</Text>}
                </View>

                <Pressable
                  onPress={() => {
                    triggerHaptic('medium')
                    navigation.navigate('Daily')
                  }}
                  style={({ pressed }) => [LIME_BTN, styles.ticketCta, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                  <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                  <Text style={[styles.ticketCtaText, LIME_TEXT]}>{dailyDone ? "Ko'rish" : 'Yechish'}</Text>
                  <MCI name="arrow-right" size={15} color="#1C3214" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── 3. Fanlar: fan → daraja → 10 masala ── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionHeadText}>
                <Text style={styles.sectionTitle}>Fanlar</Text>
                <Text style={[styles.sectionCount, NUM]}>
                  {allLevels} daraja · {allQuestions} masala
                </Text>
              </View>

              <View style={[styles.weekChip, weekStars >= WEEKLY_STAR_GOAL && styles.weekChipDone]}>
                <MCI
                  name="star"
                  size={12}
                  color={weekStars >= WEEKLY_STAR_GOAL ? C.limeDeep : C.coin}
                />
                <Text
                  style={[styles.weekChipText, weekStars >= WEEKLY_STAR_GOAL && styles.weekChipTextDone, NUM]}
                >
                  haftalik {Math.min(weekStars, WEEKLY_STAR_GOAL)}/{WEEKLY_STAR_GOAL} yulduz
                </Text>
              </View>
            </View>

            <View style={styles.subjectList}>
              {PROBLEM_SUBJECTS.map((sub, i) => {
                const levels = levelsOf(sub.id)
                const total = levels.reduce((n, l) => n + l.questions.length, 0)
                const solved = levels.reduce((n, l) => n + (solvedQuestions[l.id]?.length ?? 0), 0)
                return (
                  <ProblemSubjectCard
                    key={sub.id}
                    subject={sub}
                    levels={levels}
                    starsByLevel={levelStars}
                    solved={solved}
                    total={total}
                    index={i}
                    onOpen={() => openSubject(sub.id)}
                    onLevel={openLevel}
                  />
                )
              })}
            </View>

            <View style={styles.subjectHint}>
              <MCI name="star-circle-outline" size={13} color={C.coin} />
              <Text style={styles.subjectHintText}>
                Har darajada <Text style={styles.subjectHintStrong}>6, 8 va 10</Text> to&apos;g&apos;ri javob —
                1, 2 va 3 yulduz.
              </Text>
            </View>
          </View>

          {/* ── Formulalar qo'llanmasi ── */}
          <Pressable
            onPress={() => {
              triggerHaptic('light')
              navigation.navigate('Formulas')
            }}
            style={({ pressed }) => [styles.formulasCta, pressed && { transform: [{ scale: 0.985 }] }]}
          >
            <LinearGradient
              colors={['#0E1A12', '#17512F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ABS_FILL}
            />
            <View style={styles.formulasTile}>
              <MCI name="function-variant" size={20} color="#CDE9AE" />
            </View>
            <View style={styles.formulasText}>
              <Text style={styles.formulasTitle}>Formulalar qo'llanmasi</Text>
              <Text style={[styles.formulasSub, NUM]}>
                {FORMULA_GROUPS.reduce((n, g) => n + g.items.length, 0)} formula · {FORMULA_GROUPS.length} bo'lim
              </Text>
            </View>
            <View style={styles.formulasArrow}>
              <MCI name="arrow-right" size={15} color="#1C3214" />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Status bar zonasi — qora sarlavha shu chegara ostidan siljiydi */}
      <TopScrim height={insets.top} colors={['#0E1A12', '#0F1D14']} line="rgba(255,255,255,0.10)" />
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },
  content: { paddingBottom: 120 },
  body: { paddingHorizontal: 16 },

  header: {
    paddingHorizontal: 16,
    borderBottomLeftRadius: R['2xl'],
    borderBottomRightRadius: R['2xl'],
    overflow: 'hidden',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  glyphTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(205,233,174,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.22)',
  },
  h1: { fontSize: 21, lineHeight: 25, fontWeight: '600', letterSpacing: -0.6, color: '#F7FCED' },
  h1Sub: { marginTop: 2, fontSize: 12, letterSpacing: 0.1, fontWeight: '500', color: 'rgba(205,233,174,0.82)' },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(232,163,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.38)',
  },
  coinChipText: { fontSize: 13, fontWeight: '600', color: '#F3C88A' },

  ledger: { flexDirection: 'row', alignItems: 'stretch', marginTop: 16 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: 'rgba(205,233,174,0.14)' },
  ledgerInner: { flex: 1, paddingHorizontal: 12 },
  ledgerValue: { fontSize: 20, lineHeight: 20, fontWeight: '600', color: '#F7FCED' },
  ledgerLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ledgerLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: 'rgba(205,233,174,0.86)',
  },
  tierBlock: { marginTop: 14 },
  tierMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  tierName: { fontSize: 11.5, fontWeight: '600', letterSpacing: 0.1, color: C.mint },
  tierNext: { fontSize: 11.5, fontWeight: '500', color: 'rgba(205,233,174,0.86)' },
  tierTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(205,233,174,0.16)',
    overflow: 'hidden',
  },
  tierTrackFill: { height: '100%', borderRadius: 3, backgroundColor: C.limeBright },
  headerTail: { height: 16 },

  ticket: {
    marginTop: 12,
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: C.surface,
  },
  ticketStub: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: 'hidden',
  },
  ticketStubLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.92)',
  },
  ticketTear: {
    position: 'absolute',
    left: 47,
    top: 8,
    bottom: 8,
    width: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketTearDash: { width: 1.5, height: 4, borderRadius: 1, backgroundColor: C.line },
  notch: {
    position: 'absolute',
    left: 41,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.solverBody,
  },
  notchTop: { top: -7 },
  notchBottom: { bottom: -7 },
  ticketBody: { flex: 1, paddingLeft: 14, paddingRight: 12, paddingVertical: 12 },
  ticketHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 7,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
  },
  clockText: { fontSize: 11, fontWeight: '600', color: C.ink2 },
  ticketTitle: { flex: 1, fontSize: 15, lineHeight: 19, fontWeight: '600', color: C.ink },
  ticketMeta: { marginTop: 3, fontSize: 11.5, fontWeight: '500', color: C.ink4 },
  promptBox: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.line,
    borderRadius: 9,
  },
  promptText: { fontFamily: MATH_FONT, fontWeight: '400', fontSize: 13, lineHeight: 18, color: C.ink },
  ticketBottom: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  rewardLedger: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardDivider: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 3, backgroundColor: C.line },
  rewardCoin: { fontSize: 13.5, fontWeight: '600', color: C.coin },
  rewardXp: { fontSize: 13.5, fontWeight: '600', color: C.xp },
  rewardUnit: { fontSize: 11, fontWeight: '500', color: C.ink4 },
  claimedNote: { marginLeft: 4, fontSize: 11, fontWeight: '500', color: C.ink4 },
  ticketCta: { height: 38, paddingHorizontal: 14, gap: 5, overflow: 'hidden' },
  ticketCtaText: { fontSize: 12.5 },

  section: { marginTop: 24 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeadText: { flex: 1, minWidth: 0 },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: '600', color: C.ink },
  sectionCount: { marginTop: 2, fontSize: 12, fontWeight: '500', color: C.ink3 },
  weekChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: R.full,
    backgroundColor: C.coinSoft,
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.3)',
  },
  weekChipDone: { backgroundColor: C.leafTint, borderColor: 'rgba(11,110,79,0.22)' },
  weekChipText: { fontSize: 11.5, fontWeight: '700', color: C.coin },
  weekChipTextDone: { color: C.brand },

  subjectList: { gap: 10 },
  subjectHint: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  subjectHintText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '500', color: C.ink3 },
  subjectHintStrong: { fontWeight: '600', color: C.ink2 },

  formulasCta: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 22,
    overflow: 'hidden',
  },
  formulasTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(205,233,174,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.18)',
  },
  formulasText: { flex: 1, minWidth: 0 },
  formulasTitle: { fontSize: 15, lineHeight: 19, fontWeight: '600', color: '#F7FCED' },
  formulasSub: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: 'rgba(205,233,174,0.72)' },
  formulasArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.limeBright,
  },
})

export default ProblemsScreen
