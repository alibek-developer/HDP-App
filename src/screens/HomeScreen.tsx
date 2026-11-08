import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import {
  DAILY_BONUS, WEEK_LABELS, currentWeekKeys, dailyProblem, leagueRank,
} from '../data/content'
import { TOPICS, topicVideoCount } from '../data/curriculum'
import { SUBJECTS } from '../data/subjects'
import { triggerHaptic } from '../lib/haptics'
import { BrandMark } from '../components/Brand'
import { GridPaper } from '../components/GridPaper'
import { Reveal } from '../components/Reveal'
import { MidnightClock } from '../components/MidnightClock'
import { navBottomSpace } from '../components/BottomNav'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { C, NUM, R, shadow, ABS_FILL, MATH_FONT } from '../theme/tokens'
import { GRAD_LIME } from '../theme/solver'

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const TOTAL_VIDEOS = TOPICS.reduce((n, t) => n + topicVideoCount(t.meta.num), 0)
const LESSONS = TOPICS.flatMap(t => t.lessons)
const STUDY_CENTER = require('../assets/study-center.webp')

/** Kunlik masala — yarim tungi yangilanishgacha qolgan vaqt */

const num = (n: number) => n.toLocaleString('en-US')

const HomeScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()

  const name = useApp(s => s.name)
  const coin = useApp(s => s.coin)
  const xp = useApp(s => s.xp)
  const topicLessons = useApp(s => s.topicLessons)
  const studyMinutes = useApp(s => s.studyMinutes)
  const daily = dailyProblem()

  const goProfile = () => {
    triggerHaptic('medium')
    navigation.navigate('Profile')
  }

  const openAlgebra = () => {
    triggerHaptic('medium')
    navigation.navigate('Subject', { subjectId: SUBJECTS[0].id })
  }

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  /* ── Davom etish: birinchi tugallanmagan dars ── */
  const doneLessons = LESSONS.filter(l => topicLessons[l.id]?.done).length
  const allDone = doneLessons >= LESSONS.length
  const nextLesson = LESSONS.find(l => !topicLessons[l.id]?.done) ?? LESSONS[LESSONS.length - 1]
  const startLabel = doneLessons === 0 ? 'Boshlash' : allDone ? 'Takrorlash' : 'Davom etish'

  /* ── Hafta: faqat real daqiqalar ── */
  const weekKeys = currentWeekKeys()
  const weekMins = weekKeys.map(k => studyMinutes[k] ?? 0)
  const weekMax = Math.max(1, ...weekMins)
  const weekTotal = weekMins.reduce((a, b) => a + b, 0)

  return (
    <LinearGradient
      colors={['#CDE9AE', '#E6F5D2', '#F7FCED']}
      locations={[0, 0.4, 0.76]}
      style={styles.screen}
    >
      <GridPaper band={300} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── 1. Header ── */}
        <Reveal delay={0} y={22} duration={380}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Profile')
              }}
              style={({ pressed }) => [styles.brandRow, pressed && { opacity: 0.7 }]}
            >
              <BrandMark size={36} />
              <Text style={styles.brandText} numberOfLines={1}>HDP Academy</Text>
            </Pressable>

            <Pressable
              onPress={goProfile}
              accessibilityLabel="Profil"
              style={({ pressed }) => [
                styles.avatarWrap,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <LinearGradient
                colors={['#9BE04B', '#5FAF22']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                {initials ? (
                  <Text style={styles.avatarText}>{initials}</Text>
                ) : (
                  <Ionicons name="person" size={19} color={C.inkOnLime} />
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.walletRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Shop')
              }}
              style={({ pressed }) => [styles.coinPill, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <Ionicons name="cash" size={15} color={C.coin} />
              <Text style={[styles.coinText, NUM]}>{num(coin)}</Text>
            </Pressable>

            <View style={styles.xpPill}>
              <Ionicons name="flash" size={15} color={C.xp} />
              <Text style={[styles.xpText, NUM]}>{num(xp)}</Text>
            </View>
          </View>
        </Reveal>

        {/* ── 2. HDP o'quv markazi reklamasi ── */}
        <Reveal delay={70} y={26} duration={420} style={styles.bannerWrap}>
          <Pressable
            onPress={openAlgebra}
            accessibilityLabel="HDP o'quv markazi darslari"
            style={({ pressed }) => [pressed && { opacity: 0.96 }]}
          >
            <View style={styles.banner}>
              <Image source={STUDY_CENTER} style={styles.bannerPhoto} resizeMode="cover" />
              <LinearGradient
                colors={['#07281B', '#07281B', 'rgba(7,40,27,0.86)', 'rgba(7,40,27,0)']}
                locations={[0, 0.42, 0.62, 0.8]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              <View style={styles.bannerContent}>
                <View style={styles.bannerBrand}>
                  <BrandMark size={20} />
                  <Text style={styles.bannerKicker}>HDP o&apos;quv markazi</Text>
                </View>

                <Text style={styles.bannerTitle}>Matematikani izchil o&apos;rganing</Text>
                <Text style={[styles.bannerSub, NUM]}>
                  {TOPICS.length} mavzu · {TOTAL_VIDEOS} video dars
                </Text>

                <View style={styles.bannerCta}>
                  <Text style={styles.bannerCtaText}>Darslarni ko&apos;rish</Text>
                  <Ionicons name="arrow-forward" size={14} color={C.inkOnLime} />
                </View>
              </View>
            </View>
          </Pressable>
        </Reveal>

        {/* ── 3. Fanlar — Algebra I asosiy karta, qolganlari qator ── */}
        <Reveal delay={140} y={26} duration={420} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Fanlar</Text>
            <Pressable
              onPress={openAlgebra}
              hitSlop={12}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.seeAllText}>{TOPICS.length} mavzu</Text>
              <Ionicons name="chevron-forward" size={14} color={C.brand} />
            </Pressable>
          </View>

          {/* Fanlar — ikkitadan, rasmli kartalar */}
          <View style={styles.fanGrid}>
            {SUBJECTS.map(s => {
              const primary = s.id === SUBJECTS[0].id
              return (
                <Pressable
                  key={s.id}
                  onPress={() => {
                    triggerHaptic('medium')
                    /* Asosiy karta — darsni ochadi; fan ro'yxati banner va «10 mavzu»dan */
                    if (primary) navigation.navigate('TopicLesson', { lessonId: nextLesson.id })
                    else navigation.navigate('Subject', { subjectId: s.id })
                  }}
                  accessibilityLabel={primary ? `${s.name} — ${startLabel}` : `${s.name} fanini ochish`}
                  style={({ pressed }) => [styles.fanCard, pressed && { transform: [{ scale: 0.98 }] }]}
                >
                  <Image source={s.thumb} style={styles.fanCardPhoto} resizeMode="cover" />
                  <LinearGradient
                    colors={['rgba(5,24,16,0)', 'rgba(5,24,16,0.62)', 'rgba(5,24,16,0.94)']}
                    locations={[0, 0.38, 0.78]}
                    style={ABS_FILL}
                    pointerEvents="none"
                  />

                  <View style={styles.fanCardBody}>
                    <Text style={styles.fanCardName} numberOfLines={1}>{s.name}</Text>
                    <Text style={[styles.fanCardMeta, NUM]}>
                      {primary
                        ? `${TOPICS.length} mavzu · ${doneLessons}/${LESSONS.length} dars`
                        : 'Tez orada'}
                    </Text>

                    {primary && (
                      <View style={styles.fanCta}>
                        <Text style={styles.fanCtaText}>{startLabel}</Text>
                        <Ionicons name="arrow-forward" size={12} color={C.inkOnLime} />
                      </View>
                    )}
                  </View>
                </Pressable>
              )
            })}
          </View>
        </Reveal>

        {/* ── 4. Kunlik masala ── */}
        <Reveal delay={210} y={26} duration={420} style={styles.section}>
          <View style={[styles.daily, shadow(C.ink, 10, 8, 0.05)]}>
            <View style={styles.dailyTop}>
              <Text style={styles.dailyBadgeText}>Kunlik masala</Text>
              <View style={styles.dailyClockRow}>
                <Ionicons name="alarm-outline" size={13} color={C.ink3} />
                <MidnightClock style={[styles.dailyClock, NUM]} />
              </View>
            </View>

            <Text style={styles.dailyCat}>{daily.set.topic} · {daily.set.grade}</Text>
            <Text style={styles.dailyTitle} numberOfLines={1}>{daily.set.title}</Text>
            <Text style={styles.dailyFormula} numberOfLines={2}>{daily.question.prompt}</Text>

            <View style={styles.dailyBottom}>
              <View style={styles.dailyRewards}>
                <View style={[styles.dailyRewardPill, styles.dailyCoinPill]}>
                  <Ionicons name="cash" size={13} color={C.coin} />
                  <Text style={[styles.dailyCoinText, NUM]}>+{DAILY_BONUS.coin}</Text>
                </View>
                <View style={[styles.dailyRewardPill, styles.dailyXpPill]}>
                  <Ionicons name="flash" size={13} color={C.xp} />
                  <Text style={[styles.dailyXpText, NUM]}>+{DAILY_BONUS.xp}</Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  triggerHaptic('medium')
                  navigation.navigate('ProblemSet', { setId: daily.set.id })
                }}
                style={({ pressed }) => [styles.dailyCtaWrap, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                <LinearGradient
                  colors={GRAD_LIME}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dailyCta}
                >
                  <Text style={styles.dailyCtaText}>Yechish</Text>
                  <Ionicons name="arrow-forward" size={15} color={C.inkOnLime} />
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Reveal>

        {/* ── 5. Bu hafta ── */}
        <Reveal delay={280} y={26} duration={420} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Bu hafta</Text>
            <Pressable
              onPress={goProfile}
              hitSlop={12}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.seeAllText}>Profil</Text>
              <Ionicons name="chevron-forward" size={14} color={C.brand} />
            </Pressable>
          </View>

          <View style={[styles.weekCard, shadow(C.ink, 5, 2, 0.04)]}>
            <View style={styles.weekBars}>
              {weekKeys.map((k, i) => {
                const m = weekMins[i]
                const h = m === 0 ? 4 : Math.max(6, Math.round((m / weekMax) * 46))
                const today = i === (new Date().getDay() + 6) % 7
                return (
                  <View key={k} style={styles.weekCol}>
                    <View style={styles.weekBarTrack}>
                      <View
                        style={[
                          styles.weekBar,
                          { height: h, backgroundColor: today ? C.brand : m > 0 ? C.lime : C.line },
                        ]}
                      />
                    </View>
                    <Text style={[styles.weekDay, today && styles.weekDayOn]}>{WEEK_LABELS[i]}</Text>
                  </View>
                )
              })}
            </View>

            <View style={styles.weekFoot}>
              <Text style={[styles.weekTotal, NUM]}>{weekTotal} daqiqa</Text>
              <View style={styles.weekLeague}>
                <Ionicons name="trophy" size={13} color={C.coin} />
                <Text style={[styles.weekLeagueText, NUM]}>O&apos;rin · #{leagueRank(xp)}/500</Text>
              </View>
            </View>
          </View>
        </Reveal>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  brandText: {
    fontFamily: MATH_FONT,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '400',
    color: C.brandDeep,
  },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, ...shadow('#5FAF22', 8, 6, 0.3) },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { fontSize: 14, fontWeight: '600', color: C.inkOnLime },

  walletRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: R.full,
    backgroundColor: C.coinSoft,
    borderColor: 'rgba(232,163,61,0.38)',
    borderWidth: 1,
  },
  coinText: { fontSize: 13, fontWeight: '600', color: '#B87A22' },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: R.full,
    backgroundColor: C.xpSoft,
    borderColor: 'rgba(76,125,240,0.3)',
    borderWidth: 1,
  },
  xpText: { fontSize: 13, fontWeight: '600', color: '#3560C4' },

  section: { marginTop: 20 },

  /* Banner — kontent chekinishi ichida, karta ko'rinishida */
  bannerWrap: { marginTop: 16, borderRadius: 22, backgroundColor: '#07281B', ...shadow(C.ink, 14, 10, 0.09) },
  banner: {
    position: 'relative',
    minHeight: 160,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#07281B',
  },
  bannerPhoto: { position: 'absolute', right: 0, top: 0, width: '64%', height: '100%' },
  bannerContent: { maxWidth: 232, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 16 },
  bannerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerKicker: { fontSize: 12, fontWeight: '500', color: '#CDE9AE' },
  bannerTitle: {
    marginTop: 7,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.4,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bannerSub: { marginTop: 4, fontSize: 12, lineHeight: 17, fontWeight: '500', color: 'rgba(230,245,220,0.85)' },
  bannerCta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 13,
    borderRadius: R.full,
    backgroundColor: C.limeBright,
  },
  bannerCtaText: { fontSize: 12.5, fontWeight: '600', color: C.inkOnLime },

  daily: {
    backgroundColor: C.leafTint,
    borderColor: 'rgba(11,110,79,0.14)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  dailyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dailyBadgeText: { fontSize: 11.5, letterSpacing: 0.6, fontWeight: '600', color: C.brand },
  dailyClockRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dailyClock: { fontSize: 12, fontWeight: '600', color: C.ink3 },
  dailyCat: {
    marginTop: 12,
    fontSize: 11.5,
    fontWeight: '500',
    color: C.ink3,
  },
  dailyTitle: { marginTop: 4, fontSize: 17.5, lineHeight: 22, fontWeight: '600', color: C.ink },
  dailyFormula: { marginTop: 6, fontFamily: MATH_FONT, fontWeight: '400', fontSize: 16, lineHeight: 23, color: C.brand },
  dailyBottom: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  dailyRewards: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dailyRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 9,
    borderRadius: R.full,
  },
  dailyCoinPill: { backgroundColor: C.coinSoft },
  dailyXpPill: { backgroundColor: C.xpSoft },
  dailyCoinText: { fontSize: 12, fontWeight: '600', color: '#B87A22' },
  dailyXpText: { fontSize: 12, fontWeight: '600', color: '#3560C4' },
  dailyCtaWrap: { borderRadius: R.full, ...shadow('#5FAF22', 7, 6, 0.28) },
  dailyCta: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: R.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dailyCtaText: { fontSize: 12.5, fontWeight: '600', color: C.inkOnLime },

  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 17.5, fontWeight: '600', color: C.ink },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: C.brand },

  /* Fanlar — ikkitadan rasmli karta */
  fanGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  fanCard: {
    width: '48%',
    height: 156,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#07281B',
    justifyContent: 'flex-end',
  },
  fanCardPhoto: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  fanCardBody: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 8 },
  fanCardName: { fontSize: 15, lineHeight: 19, letterSpacing: -0.2, fontWeight: '600', color: '#FFFFFF' },
  fanCardMeta: { marginTop: 3, fontSize: 12, lineHeight: 16, fontWeight: '500', color: 'rgba(235,248,225,0.82)' },
  fanCta: {
    marginTop: 10,
    height: 34,
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
    borderRadius: R.full,
    backgroundColor: C.limeBright,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fanCtaText: { fontSize: 12, letterSpacing: 0.1, fontWeight: '600', color: C.inkOnLime },

  weekCard: {
    backgroundColor: C.surface,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  weekBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 66 },
  weekCol: { flex: 1, alignItems: 'center', gap: 6 },
  weekBarTrack: { height: 46, width: '100%', justifyContent: 'flex-end' },
  weekBar: { width: '100%', borderRadius: 5 },
  weekDay: { fontSize: 10, fontWeight: '500', color: C.ink4 },
  weekDayOn: { color: C.brand },
  weekFoot: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.lineSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekTotal: { fontSize: 12.5, fontWeight: '600', color: C.ink },
  weekLeague: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weekLeagueText: { fontSize: 12, fontWeight: '500', color: '#B87A22' },
})

export default HomeScreen
