import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp, freeLessonCount } from '../store/useStore'
import type { Stage } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { LESSONS } from '../data/content'
import { SUBJECTS, topicLessonIds } from '../data/subjects'
import type { RootStackParamList } from '../navigation/types'
import { C, NUM } from '../theme/tokens'
import { CARD, GRAD_LIME, GRAD_RAIL, SOLVER_BODY } from '../theme/solver'

/**
 * 3-qadam: Kurslar — barcha darslar ro'yxati.
 * Qulf mantiqi: 1–10 bepul, 11+ faqat Pro.
 * Bosilganda doim KONSPEKT ga olib kiradi (zanjir boshi).
 */

const STAGE_LABEL: Record<Stage, string> = {
  new: 'Boshlash',
  video: "Misolga o'tish",
  example: "Testga o'tish",
  test: "Testga o'tish",
  done: 'Yakunlangan',
}

const TICK_OK = '#5FAF22'

type Nav = NativeStackNavigationProp<RootStackParamList>

const CoursesScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Home')

  const isPro = useApp(s => s.isPro)
  const lessonsState = useApp(s => s.lessons)
  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)

  const stageOf = (id: number): Stage => {
    const p = lessonsState[id]
    if (!p) return 'new'
    if (p.testScore !== null) return 'done'
    if (p.exampleDone) return 'test'
    if (p.videoWatched) return 'example'
    return 'new'
  }

  const open = (id: number, free: boolean, stage: Stage) => {
    if (!free && !isPro) {
      triggerHaptic('warning')
      navigation.navigate('Pro', { reason: 'lesson' })
      return
    }
    triggerHaptic('medium')
    const params = { id: String(id) }
    if (stage === 'example') navigation.navigate('LessonExample', params)
    else if (stage === 'test') navigation.navigate('LessonTest', params)
    else navigation.navigate('Lesson', params)
  }

  const freeDone = LESSONS.filter(l => l.free && stageOf(l.id) === 'done').length
  const freeLessons = LESSONS.filter(l => l.free)
  const firstOpen = freeLessons.find(l => stageOf(l.id) !== 'done')?.id

  const ledger = [
    { v: LESSONS.filter(l => lessonsState[l.id]?.videoWatched).length, u: "konspekt o'qildi" },
    { v: LESSONS.filter(l => lessonsState[l.id]?.exampleDone).length, u: 'misol ishlandi' },
    {
      v: LESSONS.filter(l => lessonsState[l.id]?.testScore !== null && lessonsState[l.id]?.testScore !== undefined).length,
      u: 'test topshirildi',
    },
  ]

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
            <Text style={styles.headerKicker}>Kurs</Text>
            <Text style={styles.headerName}>DTM Matematika</Text>
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

        {/* ── Fanlar ── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Fanlar</Text>
            <Text style={[styles.sectionCount, NUM]}>{SUBJECTS.length} ta</Text>
          </View>

          <View style={styles.stack}>
            {SUBJECTS.map(sub => {
              const loaded = sub.topics.filter(t => topicLessonIds(t.num).length > 0)
              const doneTopics = loaded.filter(t => topicLessonIds(t.num).every(id => topicLessons[id]?.done)).length
              const has = loaded.length > 0
              return (
                <Pressable
                  key={sub.id}
                  onPress={() => {
                    triggerHaptic('medium')
                    navigation.navigate('Subject', { subjectId: sub.id })
                  }}
                  style={({ pressed }) => [styles.subjectRow, CARD, pressed && { transform: [{ scale: 0.99 }] }]}
                >
                  <View style={[styles.subjectBadge, has ? styles.subjectBadgeOn : styles.subjectBadgeIdle]}>
                    <Text style={[styles.subjectBadgeText, NUM, { color: has ? '#9BE04B' : '#9AA995' }]}>{sub.badge}</Text>
                  </View>

                  <View style={styles.subjectText}>
                    <Text style={styles.subjectName} numberOfLines={1}>
                      {sub.name}
                    </Text>
                    <Text style={[styles.subjectMeta, NUM]}>
                      {has ? `${loaded.length} ta mavzu · ${doneTopics}/${loaded.length} tugadi` : 'Darslar yuklanmagan'}
                    </Text>
                  </View>

                  <View style={styles.subjectTail}>
                    <Text style={[styles.subjectTailLabel, { color: has ? '#0B6E4F' : '#9AA995' }]}>
                      {has ? 'Nazariya' : 'Tez orada'}
                    </Text>
                    <Ionicons name="chevron-forward" size={15} color="#9AA995" style={styles.subjectChevron} />
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* ── Bepul darslar: kvantli progress ── */}
        <View style={styles.section}>
          <View style={[styles.quantum, CARD]}>
            <LinearGradient
              colors={GRAD_RAIL}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.quantumRail, { width: 6 }]}
            />
            <View style={styles.quantumBody}>
              <View style={styles.quantumHead}>
                <View>
                  <Text style={styles.kicker}>Bepul darslar</Text>
                  <View style={styles.scoreRow}>
                    <Text style={[styles.score, NUM]}>{freeDone}</Text>
                    <Text style={[styles.scoreTotal, NUM]}>/{freeLessonCount}</Text>
                  </View>
                </View>
                <Text style={[styles.percent, NUM]}>{Math.round((freeDone / freeLessonCount) * 100)}%</Text>
              </View>

              <View style={styles.quantumBars}>
                {freeLessons.map(l => {
                  const done = stageOf(l.id) === 'done'
                  const current = !done && l.id === firstOpen
                  return (
                    <View key={l.id} style={styles.quantumCellWrap}>
                      {done ? (
                        <LinearGradient
                          colors={GRAD_LIME}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                          style={styles.quantumCell}
                        />
                      ) : (
                        <View style={[styles.quantumCell, { backgroundColor: current ? '#0E1A12' : '#EAEEE3' }]} />
                      )}
                    </View>
                  )
                })}
              </View>

              <View style={styles.ledger}>
                {ledger.map((cell, i) => (
                  <View key={cell.u} style={styles.ledgerCell}>
                    {i > 0 && <View style={styles.ledgerDivider} />}
                    <View style={styles.ledgerInner}>
                      <Text style={[styles.ledgerValue, NUM]}>{cell.v}</Text>
                      <Text style={styles.ledgerUnit}>{cell.u}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={styles.footNote}>
                Har dars: <Text style={styles.footStrong}>konspekt → misol → test</Text>. Keyingi bosqich oldingisi
                tugagach ochiladi.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Darslar ro'yxati — yagona varaq ── */}
        <View style={styles.section}>
          <Text style={styles.listKicker}>Barcha darslar</Text>
          <View style={[styles.listSheet, CARD]}>
            {LESSONS.map((l, idx) => {
              const locked = !l.free && !isPro
              const stage = stageOf(l.id)
              const done = stage === 'done'
              const started = !done && stage !== 'new'

              const tileBg = locked ? '#FBFCF8' : done ? '#DDF3DC' : started ? '#0E1A12' : '#FFFFFF'
              const tileFg = locked ? '#9AA995' : done ? '#0B6E4F' : started ? '#9BE04B' : '#33452F'

              const ticks = [
                !!lessonsState[l.id]?.videoWatched,
                !!lessonsState[l.id]?.exampleDone,
                stage === 'done',
              ]

              return (
                <Pressable
                  key={l.id}
                  onPress={() => open(l.id, l.free, stageOf(l.id))}
                  style={({ pressed }) => [
                    styles.lessonRow,
                    idx > 0 && styles.lessonRowBorder,
                    { backgroundColor: locked ? '#FBFCF8' : '#FFFFFF' },
                    pressed && { transform: [{ scale: 0.995 }] },
                  ]}
                >
                  <View style={[styles.lessonTile, { backgroundColor: tileBg }, locked && styles.lessonTileBorder]}>
                    {locked ? (
                      <Ionicons name="lock-closed" size={15} color={tileFg} />
                    ) : done ? (
                      <Ionicons name="checkmark" size={17} color={tileFg} />
                    ) : started ? (
                      <Ionicons name={stage === 'video' ? 'book-outline' : 'play'} size={14} color={tileFg} />
                    ) : (
                      <Text style={[styles.lessonTileText, NUM, { color: tileFg }]}>{l.id}</Text>
                    )}
                  </View>

                  <View style={styles.lessonText}>
                    <Text style={styles.lessonTitle} numberOfLines={1}>
                      {l.title}
                    </Text>
                    <Text style={[styles.lessonMeta, NUM]}>
                      {l.topic} · {l.duration} daq · {l.questions.length} savol
                    </Text>
                    {!locked && (
                      <View style={styles.lessonTicks}>
                        {ticks.map((on, i) => (
                          <View key={i} style={[styles.lessonTick, { backgroundColor: on ? TICK_OK : '#EAEEE3' }]} />
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.lessonTail}>
                    {locked ? (
                      <View style={styles.proTag}>
                        <Ionicons name="ribbon" size={10} color="#B87A22" />
                        <Text style={[styles.proTagText, NUM]}>Pro</Text>
                      </View>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.stageLabel,
                            { color: done ? '#0B6E4F' : started ? '#B87A22' : '#6B7C66' },
                          ]}
                        >
                          {STAGE_LABEL[stage]}
                        </Text>
                        <Ionicons name="chevron-forward" size={15} color="#9AA995" style={styles.stageChevron} />
                      </>
                    )}
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* ── Pro taklif ── */}
        <View style={styles.section}>
          <Pressable
            onPress={() => {
              triggerHaptic('warning')
              navigation.navigate('Pro', { reason: 'lesson' })
            }}
            style={({ pressed }) => [styles.proOffer, pressed && { transform: [{ scale: 0.99 }] }]}
          >
            <View style={styles.proOfferTile}>
              <Ionicons name="ribbon" size={18} color="#B87A22" />
            </View>
            <View style={styles.proOfferText}>
              <Text style={styles.proOfferTitle}>{LESSONS.length - freeLessonCount} ta dars Pro'da</Text>
              <Text style={styles.proOfferSub}>Olimpiada mavzulari, sinovlar va ustoz tekshiruvi</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9AA995" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const railLeft: ViewStyle = { position: 'absolute', left: 0, top: 0, bottom: 0 }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingBottom: 110 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E7DA',
    borderWidth: 1,
    borderRadius: 12,
  },
  headerTitle: { flex: 1, alignItems: 'center', minWidth: 0, paddingHorizontal: 8 },
  headerKicker: { fontSize: 10.5, letterSpacing: 1.68, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  headerName: { marginTop: 2, fontSize: 15, fontWeight: '800', color: C.ink },
  wallet: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF1DC',
    borderColor: '#E8A33D',
    borderWidth: 1,
    borderRadius: 12,
  },
  walletText: { marginTop: 2, fontSize: 9.5, fontWeight: '800', color: '#B87A22' },

  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8 },
  sectionTitle: { fontSize: 15.5, fontWeight: '800', color: C.ink },
  sectionCount: { fontSize: 11, fontWeight: '700', color: '#9AA995' },
  stack: { gap: 10 },

  subjectRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 12, paddingVertical: 12, borderRadius: 16 },
  subjectBadge: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  subjectBadgeOn: { backgroundColor: '#0E1A12' },
  subjectBadgeIdle: { backgroundColor: '#F1F4EE' },
  subjectBadgeText: { fontSize: 14, fontWeight: '800' },
  subjectText: { flex: 1, minWidth: 0 },
  subjectName: { fontSize: 13.5, lineHeight: 17, fontWeight: '800', color: C.ink },
  subjectMeta: { marginTop: 4, fontSize: 10.5, letterSpacing: 0.42, textTransform: 'uppercase', fontWeight: '700', color: '#9AA995' },
  subjectTail: { alignItems: 'flex-end' },
  subjectTailLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  subjectChevron: { marginTop: 4 },

  quantum: { borderRadius: 16, overflow: 'hidden', flexDirection: 'row' },
  quantumRail: railLeft,
  quantumBody: { flex: 1, paddingLeft: 15, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  kicker: { fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  quantumHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  score: { fontSize: 26, lineHeight: 26, fontWeight: '800', color: C.ink },
  scoreTotal: { fontSize: 26, lineHeight: 26, fontWeight: '800', color: '#9AA995' },
  percent: { fontSize: 11, letterSpacing: 0.66, textTransform: 'uppercase', fontWeight: '700', color: '#5FAF22' },

  quantumBars: { marginTop: 14, flexDirection: 'row', gap: 3 },
  quantumCellWrap: { flex: 1, height: 16, overflow: 'hidden', borderRadius: 4 },
  quantumCell: { flex: 1, borderRadius: 4 },

  ledger: { marginTop: 16, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: 1, borderTopColor: '#EDF1E7', paddingTop: 14 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: '#EDF1E7' },
  ledgerInner: { flex: 1, paddingHorizontal: 8 },
  ledgerValue: { fontSize: 17, lineHeight: 17, fontWeight: '800', color: C.ink },
  ledgerUnit: { marginTop: 6, fontSize: 9.5, lineHeight: 12, textTransform: 'uppercase', fontWeight: '700', color: '#9AA995' },

  footNote: { marginTop: 14, fontSize: 11.5, lineHeight: 17, fontWeight: '500', color: '#6B7C66' },
  footStrong: { fontWeight: '800', color: C.ink2 },

  listKicker: { paddingHorizontal: 4, marginBottom: 8, fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  listSheet: { borderRadius: 16, overflow: 'hidden' },

  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 12, paddingVertical: 14 },
  lessonRowBorder: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  lessonTile: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  lessonTileBorder: { borderColor: '#E1E7DA', borderWidth: 1 },
  lessonTileText: { fontSize: 15, fontWeight: '800' },
  lessonText: { flex: 1, minWidth: 0 },
  lessonTitle: { fontSize: 13.5, lineHeight: 17, fontWeight: '800', color: C.ink },
  lessonMeta: { marginTop: 4, fontSize: 10.5, letterSpacing: 0.42, textTransform: 'uppercase', fontWeight: '700', color: '#9AA995' },
  lessonTicks: { marginTop: 8, flexDirection: 'row', gap: 4 },
  lessonTick: { flex: 1, height: 4, borderRadius: 2 },
  lessonTail: { alignItems: 'flex-end', gap: 4 },
  stageLabel: { fontSize: 10, lineHeight: 13, textTransform: 'uppercase', fontWeight: '800', textAlign: 'right' },
  stageChevron: { marginTop: 2 },
  proTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FCF1DC', borderRadius: 7 },
  proTagText: { fontSize: 10, fontWeight: '800', color: '#B87A22', textTransform: 'uppercase' },

  proOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderStyle: 'dashed',
    borderColor: '#CFD9C6',
    borderWidth: 1,
    borderRadius: 16,
  },
  proOfferTile: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF1DC',
    borderRadius: 12,
  },
  proOfferText: { flex: 1, minWidth: 0 },
  proOfferTitle: { fontSize: 13.5, lineHeight: 17, fontWeight: '800', color: C.ink },
  proOfferSub: { marginTop: 2, fontSize: 11.5, fontWeight: '600', color: '#6B7C66' },
})

export default CoursesScreen
