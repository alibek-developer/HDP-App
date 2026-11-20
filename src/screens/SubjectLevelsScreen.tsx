import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExitToTab } from '../lib/nav'
import {
  STAR_THRESHOLDS, WEEKLY_STAR_GOAL, findSubjectProblems, levelsOf, starsOf, weekStartKey,
} from '../data/problems'
import type { LevelKey } from '../data/problems'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import type { ThemeColors } from '../theme/tokens'
import { CARD, GRAD_LIME, LIME_BTN, LIME_TEXT } from '../theme/solver'

/**
 * Fan ichidagi uch daraja. Bu ekran maqsadni ochadi: har darajada 3 yulduz,
 * haftalik maqsad va keyingi yulduz uchun kerak bo'ladigan to'g'ri javob.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const TONE: Record<LevelKey, { rail: string; tile: string; ink: string; icon: keyof typeof Ionicons.glyphMap }> = {
  oson: { rail: '#7ED321', tile: '#EDF7DE', ink: '#3F7A18', icon: 'leaf' },
  "o'rta": { rail: '#E8A33D', tile: '#FCF1DC', ink: '#8A6520', icon: 'trending-up' },
  qiyin: { rail: '#D9483B', tile: '#FBE9E7', ink: '#A33B31', icon: 'flame' },
}

const SubjectLevelsScreen = () => {
  const C = useColors()
  const styles = makeStyles(C)
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExitToTab('problems')

  const route = useRoute<RouteProp<RootStackParamList, 'SubjectLevels'>>()
  const subject = findSubjectProblems(route.params.subjectId)
  const levels = subject ? levelsOf(subject.id) : []

  const coin = useApp(s => s.coin)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const levelStars = useApp(s => s.levelStars)
  const starWeek = useApp(s => s.starWeek)
  const starsThisWeek = useApp(s => s.starsThisWeek)

  if (!subject) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Pressable onPress={exit} style={({ pressed }) => [styles.missingBtn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.missingText}>Masalalarga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  const stars = starsOf(levelStars, subject.id)
  const totalStars = levels.length * 3
  const totalQuestions = levels.reduce((n, l) => n + l.questions.length, 0)
  /** Hafta almashgan bo'lsa o'sha haftaning hisobi ko'rinadi */
  const weekStars = starWeek === weekStartKey() ? starsThisWeek : 0
  const weekDone = weekStars >= WEEKLY_STAR_GOAL

  const openLevel = (setId: string) => {
    triggerHaptic('medium')
    navigation.navigate('ProblemSet', { setId })
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            hitSlop={10}
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={18} color={C.ink2} />
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerKicker}>Masalalar</Text>
            <Text style={styles.headerName} numberOfLines={1}>{subject.name}</Text>
          </View>

          <View style={styles.wallet}>
            <Ionicons name="cash" size={12} color={C.coin} />
            <Text style={[styles.walletText, NUM]}>{coin}</Text>
          </View>
        </View>

        {/* ── Fan holati ── */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#0E1A12', '#143326']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTop}>
            <View style={styles.heroTile}>
              <MCI name={subject.icon as keyof typeof MCI.glyphMap} size={20} color={C.limeBright} />
            </View>
            <View style={styles.heroBody}>
              <Text style={styles.heroName}>{subject.name}</Text>
              <Text style={[styles.heroNote, NUM]}>
                {levels.length} daraja · {totalQuestions} masala
              </Text>
            </View>
            <View style={styles.heroStars}>
              <Ionicons name="star" size={13} color="#F3C88A" />
              <Text style={[styles.heroStarsText, NUM]}>{stars}/{totalStars}</Text>
            </View>
          </View>
          <View style={styles.heroTrack}>
            <View style={[styles.heroFill, { width: `${(stars / totalStars) * 100}%` }]} />
          </View>
        </View>

        {/* ── Haftalik maqsad ── */}
        <View style={[CARD, styles.week]}>
          <View style={styles.weekTop}>
            <View style={styles.weekLabel}>
              <Ionicons name="trophy" size={13} color={C.coin} />
              <Text style={styles.weekTitle}>Haftalik maqsad</Text>
            </View>
            <Text style={[styles.weekCount, NUM]}>
              {Math.min(weekStars, WEEKLY_STAR_GOAL)}/{WEEKLY_STAR_GOAL} yulduz
            </Text>
          </View>
          <View style={styles.weekTrack}>
            <View
              style={[
                styles.weekFill,
                { width: `${Math.min(100, (weekStars / WEEKLY_STAR_GOAL) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.weekHint}>
            {weekDone
              ? 'Haftalik maqsad bajarildi — yaxshi ish!'
              : `Yana ${WEEKLY_STAR_GOAL - weekStars} ta yangi yulduz — istalgan darajada 6+ to‘g‘ri javob.`}
          </Text>
        </View>

        {/* ── Darajalar ── */}
        <View style={styles.levelList}>
          {levels.map(level => {
            const tone = TONE[level.level]
            const total = level.questions.length
            const done = Math.min(solvedQuestions[level.id]?.length ?? 0, total)
            const earned = levelStars[level.id] ?? 0
            const need = earned < 3 ? STAR_THRESHOLDS[earned] : null
            return (
              <Pressable
                key={level.id}
                onPress={() => openLevel(level.id)}
                style={({ pressed }) => [CARD, styles.levelCard, pressed && { transform: [{ scale: 0.99 }] }]}
              >
                <View style={[styles.levelRail, { backgroundColor: tone.rail }]} />
                <View style={styles.levelBody}>
                  <View style={styles.levelTop}>
                    <View style={[styles.levelTile, { backgroundColor: tone.tile }]}>
                      <Ionicons name={tone.icon} size={16} color={tone.ink} />
                    </View>
                    <View style={styles.levelText}>
                      <Text style={styles.levelName}>{level.label}</Text>
                      <Text style={styles.levelBrief}>{level.brief}</Text>
                    </View>
                    <View style={styles.levelStars}>
                      {[0, 1, 2].map(i => (
                        <Ionicons
                          key={i}
                          name={i < earned ? 'star' : 'star-outline'}
                          size={15}
                          color={i < earned ? C.coin : C.line}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.levelProgress}>
                    <View style={styles.levelTrack}>
                      <View
                        style={[
                          styles.levelFill,
                          { width: `${(done / total) * 100}%`, backgroundColor: tone.rail },
                        ]}
                      />
                    </View>
                    <Text style={[styles.levelCount, NUM]}>{done}/{total}</Text>
                  </View>

                  <View style={styles.levelFoot}>
                    <Text style={styles.levelGoal}>
                      {need
                        ? `Maqsad: ${need} ta to‘g‘ri javob — ${earned + 1} yulduz`
                        : 'Barcha yulduzlar to‘plangan'}
                    </Text>
                    <View style={[LIME_BTN, styles.levelCta]}>
                      <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                      <Text style={[styles.levelCtaText, LIME_TEXT]}>
                        {done === 0 ? 'Boshlash' : earned === 3 ? 'Qayta ishlash' : 'Davom etish'}
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={C.inkOnLime} />
                    </View>
                  </View>
                </View>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.legend}>
          <Ionicons name="information-circle-outline" size={14} color={C.ink3} />
          <Text style={styles.legendText}>
            Yulduz: <Text style={styles.legendStrong}>6</Text> ta to‘g‘ri — 1★,{' '}
            <Text style={styles.legendStrong}>8</Text> ta — 2★,{' '}
            <Text style={styles.legendStrong}>10</Text> ta — 3★. To‘g‘rilik sessiya oxirida hisoblanadi.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },
  content: { paddingBottom: 112, paddingHorizontal: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },

  missingBtn: { ...CARD, height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  missingText: { fontSize: 13, fontWeight: '600', color: C.ink },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  headerTitle: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: 8 },
  headerKicker: { fontSize: 12, fontWeight: '500', color: C.ink3 },
  headerName: { marginTop: 2, fontSize: 15, fontWeight: '600', color: C.ink, lineHeight: 19 },
  wallet: {
    width: 46,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: C.coinSoft,
    borderWidth: 1,
    borderColor: C.coin,
    gap: 1,
  },
  walletText: { fontSize: 10.5, fontWeight: '600', color: C.coin },

  hero: {
    marginTop: 4,
    borderRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroTile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(205,233,174,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.22)',
  },
  heroBody: { flex: 1, minWidth: 0 },
  heroName: { fontSize: 16, lineHeight: 21, fontWeight: '600', letterSpacing: -0.3, color: '#F7FCED' },
  heroNote: { marginTop: 3, fontSize: 11.5, fontWeight: '500', color: 'rgba(205,233,174,0.7)' },
  heroStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: 'rgba(232,163,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.34)',
  },
  heroStarsText: { fontSize: 12, fontWeight: '600', color: '#F3C88A' },
  heroTrack: {
    marginTop: 16,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(205,233,174,0.16)',
    overflow: 'hidden',
  },
  heroFill: { height: '100%', borderRadius: 3, backgroundColor: C.limeBright },

  week: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14 },
  weekTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weekLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  weekTitle: { fontSize: 12.5, fontWeight: '600', color: '#8A6520' },
  weekCount: { fontSize: 12, fontWeight: '600', color: C.coin },
  weekTrack: {
    marginTop: 10,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.coinSoft,
    overflow: 'hidden',
  },
  weekFill: { height: '100%', borderRadius: 3, backgroundColor: C.coin },
  weekHint: { marginTop: 9, fontSize: 11.5, lineHeight: 17, fontWeight: '500', color: C.ink3 },

  levelList: { marginTop: 16, gap: 12 },
  levelCard: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden' },
  levelRail: { width: 4 },
  levelBody: { flex: 1, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14 },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelTile: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  levelText: { flex: 1, minWidth: 0 },
  levelName: { fontSize: 14, lineHeight: 18, fontWeight: '600', color: C.ink },
  levelBrief: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: C.ink3 },
  levelStars: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  levelProgress: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: C.line, overflow: 'hidden' },
  levelFill: { height: '100%', borderRadius: 3 },
  levelCount: { fontSize: 11.5, fontWeight: '600', color: C.ink3 },

  levelFoot: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  levelGoal: { flex: 1, minWidth: 0, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: C.ink4 },
  levelCta: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    overflow: 'hidden',
  },
  levelCtaText: { fontSize: 12, fontWeight: '600' },

  legend: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
  },
  legendText: { flex: 1, fontSize: 11.5, lineHeight: 17, fontWeight: '500', color: C.ink3 },
  legendStrong: { fontWeight: '600', color: C.ink2 },
})

export default SubjectLevelsScreen
