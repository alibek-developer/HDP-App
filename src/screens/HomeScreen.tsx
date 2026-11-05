import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import {
  DAILY_BONUS, WEEK_LABELS, currentWeekKeys, dailyProblem, leagueRank,
} from '../data/content'
import { TOPICS, topicVideoCount } from '../data/curriculum'
import { triggerHaptic } from '../lib/haptics'
import { BrandMark } from '../components/Brand'
import { GridPaper } from '../components/GridPaper'
import { Reveal } from '../components/Reveal'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import type { TabKey } from '../components/BottomNav'
import type { NoParamRoute, RootStackParamList } from '../navigation/types'
import { C, NUM, R, shadow } from '../theme/tokens'
import { GRAD_HEADER, GRAD_LIME } from '../theme/solver'

type Nav = NativeStackNavigationProp<RootStackParamList>

const TOTAL_VIDEOS = TOPICS.reduce((n, t) => n + topicVideoCount(t.meta.num), 0)
const LESSONS = TOPICS.flatMap(t => t.lessons)

type Grad = readonly [string, string, ...string[]]

/* Yuklanmagan kurslar — ilovaning o'z tusi (xp, violet, coin) */
const COMING: { id: string; name: string; badge: string; colors: Grad }[] = [
  { id: 'algebra-2', name: 'Algebra II', badge: 'A2', colors: [C.xp, '#3560C4'] },
  { id: 'geometriya', name: 'Geometriya', badge: 'G', colors: [C.violet, '#5B3FC0'] },
  { id: 'stereometriya', name: 'Stereometriya', badge: 'S', colors: [C.coin, '#C98A16'] },
]

/** Kunlik masala — yarim tungi yangilanishgacha qolgan vaqt */
const leftUntilMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

const pad = (n: number) => String(n).padStart(2, '0')

const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

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

  const [remain, setRemain] = useState(leftUntilMidnight)
  useEffect(() => {
    const t = setInterval(() => setRemain(leftUntilMidnight()), 1000)
    return () => clearInterval(t)
  }, [])

  const go = (route: NoParamRoute) => {
    triggerHaptic('medium')
    navigation.navigate(route)
  }

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const onTab = (key: TabKey) => {
    if (key === 'home') return
    navigation.navigate(key === 'problems' ? 'Problems' : key === 'shop' ? 'Shop' : 'Profile')
  }

  /* ── Davom etish: birinchi tugallanmagan dars ── */
  const doneLessons = LESSONS.filter(l => topicLessons[l.id]?.done).length
  const allDone = doneLessons >= LESSONS.length
  const nextLesson = LESSONS.find(l => !topicLessons[l.id]?.done) ?? LESSONS[LESSONS.length - 1]
  const nextNo = LESSONS.indexOf(nextLesson) + 1
  const progress = LESSONS.length ? Math.round((doneLessons / LESSONS.length) * 100) : 0

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
              onPress={() => go('Profile')}
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

        {/* ── 2. Algebra I — asosiy karta ── */}
        <Reveal delay={70} y={26} duration={420} style={styles.sectionTight}>
          <LinearGradient
            colors={GRAD_HEADER}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.55, y: 1 }}
            style={[styles.hero, shadow(C.ink, 18, 14, 0.22)]}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>DAVOM ETING</Text>
              </View>
              <Text style={[styles.heroPct, NUM]}>{progress}%</Text>
            </View>

            <Text style={styles.heroCourse}>Algebra I</Text>
            <Text style={styles.heroLesson} numberOfLines={2}>
              {allDone ? 'Barcha darslar tugallangan' : `${nextNo}-dars: ${nextLesson.title}`}
            </Text>

            <View style={styles.heroTrack}>
              <LinearGradient
                colors={GRAD_LIME}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.heroFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={[styles.heroMeta, NUM]}>
              {doneLessons}/{LESSONS.length} dars · {TOTAL_VIDEOS} video
            </Text>

            <Pressable
              onPress={() => {
                triggerHaptic('medium')
                navigation.navigate('TopicLesson', { lessonId: nextLesson.id })
              }}
              style={({ pressed }) => [styles.heroBtnWrap, pressed && { transform: [{ scale: 0.985 }] }]}
            >
              <LinearGradient
                colors={GRAD_LIME}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBtn}
              >
                <Text style={styles.heroBtnText}>{allDone ? 'Takrorlash' : 'Davom etish'}</Text>
                <Ionicons name="arrow-forward" size={18} color={C.inkOnLime} />
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </Reveal>

        {/* ── 3. Kunlik masala ── */}
        <Reveal delay={140} y={26} duration={420} style={styles.section}>
          <View style={[styles.daily, shadow(C.ink, 10, 8, 0.05)]}>
            <View style={styles.dailyTop}>
              <Text style={styles.dailyBadgeText}>KUNLIK MASALA</Text>
              <View style={styles.dailyClockRow}>
                <Ionicons name="alarm-outline" size={13} color={C.ink3} />
                <Text style={[styles.dailyClock, NUM]}>{clock(remain)}</Text>
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

        {/* ── 4. Kurslar ── */}
        <Reveal delay={210} y={26} duration={420} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Kurslar</Text>
            <Pressable
              onPress={() => go('Courses')}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.seeAllText}>Hammasi</Text>
              <Ionicons name="chevron-forward" size={14} color={C.brand} />
            </Pressable>
          </View>

          <View style={[styles.courseList, shadow(C.ink, 5, 2, 0.04)]}>
            {COMING.map((c, i) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  triggerHaptic('medium')
                  navigation.navigate('Subject', { subjectId: c.id })
                }}
                style={({ pressed }) => [
                  styles.courseRow,
                  i > 0 && styles.courseRowLine,
                  pressed && { backgroundColor: C.leafTint },
                ]}
              >
                <LinearGradient
                  colors={c.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.courseBadge}
                >
                  <Text style={styles.courseBadgeText}>{c.badge}</Text>
                </LinearGradient>

                <View style={styles.courseText}>
                  <Text style={styles.courseName}>{c.name}</Text>
                  <Text style={styles.courseSub}>Tez orada</Text>
                </View>

                <Ionicons name="chevron-forward" size={17} color={C.ink4} />
              </Pressable>
            ))}
          </View>
        </Reveal>

        {/* ── 5. Bu hafta ── */}
        <Reveal delay={280} y={26} duration={420} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Bu hafta</Text>
            <Pressable
              onPress={() => go('Profile')}
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
                <Text style={[styles.weekLeagueText, NUM]}>Liga · #{leagueRank(xp)}</Text>
              </View>
            </View>
          </View>
        </Reveal>
      </ScrollView>

      <BottomNav active="home" onSelect={onTab} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  brandText: {
    fontFamily: 'Georgia',
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '700',
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
  avatarText: { fontSize: 14, fontWeight: '800', color: C.inkOnLime },

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
  coinText: { fontSize: 13, fontWeight: '800', color: '#B87A22' },
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
  xpText: { fontSize: 13, fontWeight: '800', color: '#3560C4' },

  section: { marginTop: 20 },
  sectionTight: { marginTop: 14 },

  hero: { borderRadius: 24, padding: 20, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: R.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(205,233,174,0.22)',
    borderWidth: 1,
  },
  heroTagText: { fontSize: 10.5, letterSpacing: 1, fontWeight: '800', color: '#CDE9AE' },
  heroPct: { fontSize: 14, fontWeight: '800', color: '#9BE04B' },
  heroCourse: {
    marginTop: 16,
    fontSize: 29,
    lineHeight: 33,
    letterSpacing: -0.7,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroLesson: {
    marginTop: 6,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '600',
    color: '#CDE9AE',
  },
  heroTrack: {
    marginTop: 18,
    height: 8,
    borderRadius: R.full,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  heroFill: { height: 8, borderRadius: R.full },
  heroMeta: { marginTop: 8, fontSize: 11.5, fontWeight: '700', color: 'rgba(255,255,255,0.55)' },
  heroBtnWrap: { marginTop: 18, borderRadius: R.full, ...shadow('#5FAF22', 10, 8, 0.3) },
  heroBtn: {
    height: 50,
    borderRadius: R.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroBtnText: { fontSize: 15, fontWeight: '800', color: C.inkOnLime },

  daily: {
    backgroundColor: C.leafTint,
    borderColor: 'rgba(11,110,79,0.14)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  dailyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dailyBadgeText: { fontSize: 10.5, letterSpacing: 1, fontWeight: '800', color: C.brand },
  dailyClockRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dailyClock: { fontSize: 12, fontWeight: '800', color: C.ink3 },
  dailyCat: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.ink3,
  },
  dailyTitle: { marginTop: 4, fontSize: 17.5, lineHeight: 22, fontWeight: '800', color: C.ink },
  dailyFormula: { marginTop: 6, fontSize: 15.5, fontWeight: '700', color: C.brand },
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
  dailyCoinText: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },
  dailyXpText: { fontSize: 11.5, fontWeight: '800', color: '#3560C4' },
  dailyCtaWrap: { borderRadius: R.full, ...shadow('#5FAF22', 7, 6, 0.28) },
  dailyCta: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: R.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dailyCtaText: { fontSize: 12.5, fontWeight: '800', color: C.inkOnLime },

  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 17.5, fontWeight: '800', color: C.ink },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '800', color: C.brand },

  courseList: {
    backgroundColor: C.surface,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  courseRowLine: { borderTopWidth: 1, borderTopColor: C.lineSoft },
  courseBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  courseText: { flex: 1 },
  courseName: { fontSize: 15.5, fontWeight: '800', color: C.ink },
  courseSub: { marginTop: 2, fontSize: 11.5, fontWeight: '600', color: C.ink3 },

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
  weekDay: { fontSize: 10, fontWeight: '700', color: C.ink4 },
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
  weekTotal: { fontSize: 12.5, fontWeight: '800', color: C.ink },
  weekLeague: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weekLeagueText: { fontSize: 12, fontWeight: '700', color: '#B87A22' },
})

export default HomeScreen
