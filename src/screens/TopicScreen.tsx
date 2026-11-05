import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { findTopic, shortTitle } from '../data/curriculum'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM, TICK } from '../theme/tokens'
import { CARD, LIME_BTN, SOLVER_BODY } from '../theme/solver'
import type { Grad } from '../theme/tokens'

/**
 * Mavzu bo'limlari — har bir mavzu uchun bir xil kova.
 * Barcha bo'limlar (video dars + nazariya + amaliyot) va oxirida test.
 * Qoida: test faqat barcha bo'limlar yakunlangach ochiladi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const RAIL_SEGMENT: Grad = ['#9BE04B', '#7ED321']

const TopicScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Courses')
  const route = useRoute<RouteProp<RootStackParamList, 'Topic'>>()
  const topicNum = route.params.topicNum
  const entry = findTopic(topicNum)

  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)
  const topicTest = useApp(s => s.topicTests[topicNum])
  const canEnterTopicTest = useApp(s => s.canEnterTopicTest)

  const lessons = entry?.lessons ?? []
  const meta = entry?.meta
  const test = entry?.test
  const pass = entry?.pass ?? 0

  const doneCount = lessons.filter(l => topicLessons[l.id]?.done).length
  const totalLessons = lessons.length
  const videoCount = lessons.reduce((n, l) => n + l.videos.length, 0)
  const minutes = lessons.reduce((n, l) => n + l.minutes, 0)
  const firstOpen = lessons.find(l => !topicLessons[l.id]?.done)
  const testOpen = canEnterTopicTest(topicNum)
  const passed = !!topicTest && topicTest.score >= pass

  const openLesson = (id: string) => {
    triggerHaptic('medium')
    navigation.navigate('TopicLesson', { lessonId: id })
  }

  const openTest = () => {
    if (!testOpen) {
      triggerHaptic('warning')
      return
    }
    triggerHaptic('medium')
    navigation.navigate('TopicTest', { topicNum })
  }

  const stats = [
    { icon: 'film' as const, v: `${videoCount} ta`, u: 'video dars' },
    { icon: 'compass' as const, v: `${minutes} daq`, u: 'nazariya' },
    { icon: 'trophy' as const, v: `${test?.total ?? 0}`, u: 'test savoli' },
  ]

  if (!entry || !meta || !test) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missing}>
          <Pressable onPress={exit} style={({ pressed }) => [CARD, styles.missingBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.missingText}>Mavzularga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerKicker}>Mavzu {topicNum}</Text>
            <Text style={styles.headerName} numberOfLines={1}>
              {shortTitle(meta.title)}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic('light')
              navigation.navigate('Shop')
            }}
            accessibilityLabel="Hamyon"
            style={({ pressed }) => [styles.wallet, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="cash" size={12} color="#B87A22" />
            <Text style={[styles.walletText, NUM]}>{coin}</Text>
          </Pressable>
        </View>

        {/* ── Mavzu varaqasi ── */}
        <View style={styles.sheet}>
          <View style={styles.sheetRailWrap}>
            <LinearGradient colors={RAIL_SEGMENT} style={ABS_FILL} />
          </View>
          <View style={styles.sheetBody}>
            <Text style={styles.sheetKicker}>Nazariy kurs</Text>
            <Text style={styles.sheetChapter}>
              {meta.chapter}
            </Text>

            <View style={styles.sheetCountRow}>
              <Text style={[styles.sheetDone, NUM]}>
                {doneCount}
                <Text style={styles.sheetTotal}>/{totalLessons}</Text>
              </Text>
              <Text style={[styles.sheetPercent, NUM]}>{Math.round((doneCount / totalLessons) * 100)}%</Text>
            </View>

            <View style={styles.segmentRow}>
              {lessons.map(l => {
                const done = !!topicLessons[l.id]?.done
                const current = !done && firstOpen?.id === l.id
                return (
                  <View
                    key={l.id}
                    style={[
                      styles.segment,
                      { backgroundColor: done ? '#7ED321' : current ? '#CDE9AE' : 'rgba(255,255,255,0.10)' },
                    ]}
                  />
                )
              })}
            </View>

            <View style={styles.statsRow}>
              {stats.map(c => (
                <View key={c.u} style={styles.statCell}>
                  <Ionicons name={c.icon} size={12} color="rgba(205,233,174,0.6)" />
                  <Text style={[styles.statValue, NUM]}>{c.v}</Text>
                  <Text style={styles.statUnit}>{c.u}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Bo'limlar ── */}
        <View style={styles.section}>
          <Text style={styles.sectionKicker}>Bo&apos;limlar</Text>
          <View style={[CARD, styles.list]}>
            {lessons.map((l, idx) => {
              const st = topicLessons[l.id]
              const done = !!st?.done
              const started = !done && !!st?.videoSeen

              const tile = done
                ? styles.tileDone
                : started
                  ? styles.tileStarted
                  : styles.tileIdle

              const ticks = [l.videos.length === 0 || !!st?.videoSeen, done]

              return (
                <Pressable
                  key={l.id}
                  onPress={() => openLesson(l.id)}
                  style={({ pressed }) => [
                    styles.row,
                    idx > 0 && styles.rowDivided,
                    pressed && { backgroundColor: '#F8FAF5' },
                  ]}
                >
                  <View style={[styles.tile, tile]}>
                    {done ? (
                      <Ionicons name="checkmark" size={17} color="#0B6E4F" />
                    ) : started ? (
                      <Ionicons name="play" size={14} color="#9BE04B" />
                    ) : (
                      <Text style={[styles.tileText, NUM]}>{l.id}</Text>
                    )}
                  </View>

                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {l.title}
                    </Text>
                    <Text style={[styles.rowMeta, NUM]}>
                      {l.minutes} daq
                      {l.videos.length > 0 && ` · ${l.videos.length} video`}
                      {l.practice.length > 0 && ` · ${l.practice.length} mashq`}
                      {l.videos.length === 0 && ' · faqat nazariya'}
                    </Text>
                    <View style={styles.tickRow}>
                      {ticks.map((on, i) => (
                        <View key={i} style={[styles.tick, { backgroundColor: on ? TICK.ok : '#EAEEE3' }]} />
                      ))}
                    </View>
                  </View>

                  <View style={styles.rowRight}>
                    <Text style={[styles.rowStage, { color: done ? '#0B6E4F' : started ? '#B87A22' : '#6B7C66' }]}>
                      {done ? 'Yakunlangan' : started ? 'Davom etish' : 'Boshlash'}
                    </Text>
                    <Ionicons name="chevron-forward" size={15} color="#9AA995" style={styles.rowChevron} />
                  </View>
                </Pressable>
              )
            })}

            {/* ── Yakuniy test ── */}
            <Pressable
              onPress={openTest}
              style={[styles.row, styles.rowDivided, { backgroundColor: testOpen ? '#EDF7DE' : '#FBFCF8' }]}
            >
              <View style={[styles.tile, passed ? styles.tileDone : testOpen ? styles.tileStarted : styles.tileIdle]}>
                <Ionicons
                  name={passed ? 'trophy' : testOpen ? 'compass' : 'lock-closed'}
                  size={passed ? 17 : 16}
                  color={passed ? '#0B6E4F' : testOpen ? '#9BE04B' : '#9AA995'}
                />
              </View>

              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>
                  {test.title} · {test.total} savol
                </Text>
                <Text style={styles.rowSub}>
                  {testOpen
                    ? topicTest
                      ? `Eng yaxshi natija: ${topicTest.score}/${topicTest.total} · o'tish ${pass} ta`
                      : `Barcha bo'limlar tugadi — testga kirish ochiq (${pass} ta — o'tish)`
                    : `${totalLessons} bo'limning ${doneCount} tasi tugadi — test qulflangan`}
                </Text>
              </View>

              <View style={styles.rowRight}>
                <Text style={[styles.testLabel, { color: testOpen ? '#B87A22' : '#9AA995' }]}>
                  {testOpen ? (topicTest ? 'Yana ishlash' : 'Boshlash') : `${doneCount}/${totalLessons}`}
                </Text>
                <Text style={[styles.testCoins, NUM, { color: testOpen ? '#0B6E4F' : '#CBD5C5' }]}>
                  +{test.total * test.coinPerSolve} coin
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ── Yechish tugmasi ── */}
        <Pressable
          onPress={() => (testOpen ? openTest() : firstOpen && openLesson(firstOpen.id))}
          style={({ pressed }) => [styles.cta, LIME_BTN, pressed && { transform: [{ scale: 0.985 }] }]}
        >
          <Text style={styles.ctaText}>
            {testOpen ? 'Yakuniy testni topshirish' : firstOpen ? `Bo'lim ${firstOpen.id} dan davom etish` : "Bo'limlar"}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#1C3214" />
        </Pressable>
      </ScrollView>
    </View>
  )
}

const railBase: ViewStyle = { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16, paddingBottom: 112 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingBtn: { height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  missingText: { fontSize: 13, fontWeight: '800', color: '#0E1A12' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 12 },
  headerTitle: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: 8 },
  headerKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', textAlign: 'center' },
  headerName: { fontSize: 15, lineHeight: 19, fontWeight: '800', color: C.ink, marginTop: 2, textAlign: 'center' },
  wallet: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', gap: 1, backgroundColor: '#FCF1DC', borderWidth: 1, borderColor: '#E8A33D', borderRadius: 12 },
  walletText: { fontSize: 9.5, fontWeight: '800', color: '#B87A22' },

  sheet: { backgroundColor: '#0E1A12', borderRadius: 16, overflow: 'hidden', flexDirection: 'row', marginBottom: 24 },
  sheetRailWrap: { ...railBase, borderRadius: 16 },
  sheetBody: { flex: 1, paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  sheetKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800', color: '#9BE04B' },
  sheetChapter: { fontSize: 15, lineHeight: 21, fontWeight: '800', color: '#FFFFFF', marginTop: 6 },
  sheetCountRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16 },
  sheetDone: { fontSize: 30, lineHeight: 30, fontWeight: '800', color: '#FFFFFF' },
  sheetTotal: { fontSize: 18, fontWeight: '800', color: 'rgba(205,233,174,0.55)' },
  sheetPercent: { fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '800', color: '#9BE04B' },

  segmentRow: { flexDirection: 'row', gap: 3, marginTop: 12 },
  segment: { flex: 1, height: 16, borderRadius: 4 },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(205,233,174,0.14)',
    paddingTop: 12,
  },
  statCell: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 11.5, fontWeight: '800', color: '#CDE9AE' },
  statUnit: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: 'rgba(205,233,174,0.6)' },

  section: { marginBottom: 16 },
  sectionKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', paddingHorizontal: 4, marginBottom: 8 },
  list: { borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 12, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  rowDivided: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  tile: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  tileDone: { backgroundColor: '#DDF3DC' },
  tileStarted: { backgroundColor: '#0E1A12' },
  tileIdle: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA' },
  tileText: { fontSize: 13.5, fontWeight: '800', color: '#33452F' },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink },
  rowMeta: { fontSize: 10.5, lineHeight: 14, letterSpacing: 0.2, textTransform: 'uppercase', fontWeight: '700', color: '#9AA995', marginTop: 4 },
  rowSub: { fontSize: 11, lineHeight: 15, fontWeight: '600', color: '#6B7C66', marginTop: 4 },
  tickRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  tick: { flex: 1, height: 4, borderRadius: 2 },
  rowRight: { flexShrink: 0, alignItems: 'flex-end' },
  rowStage: { fontSize: 10, lineHeight: 13, textTransform: 'uppercase', fontWeight: '800', textAlign: 'right' },
  rowChevron: { marginTop: 4 },
  testLabel: { fontSize: 10, lineHeight: 13, textTransform: 'uppercase', fontWeight: '800', textAlign: 'right' },
  testCoins: { fontSize: 10, lineHeight: 13, fontWeight: '800', textAlign: 'right', marginTop: 2 },

  cta: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, marginTop: 16 },
  ctaText: { fontSize: 14.5, fontWeight: '800', color: '#1C3214' },
})

export default TopicScreen
