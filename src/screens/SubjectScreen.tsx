import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExitToTab } from '../lib/nav'
import { SUBJECTS, findSubject, topicLessonIds, topicTestCount, topicVideoCount } from '../data/subjects'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { CARD, SOLVER_BODY } from '../theme/solver'
import { Reveal } from '../components/Reveal'

/**
 * Fan ichi — o'sha fanning mavzulari. Algebra I'ga kirgan o'quvchi faqat
 * Algebra I mavzularini ko'radi; mazmuni yuklanmagan fanlar bo'sh holatni
 * chizadi (u yerda hech qanday soxta dars yo'q).
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const SubjectScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExitToTab('home')

  const route = useRoute<RouteProp<RootStackParamList, 'Subject'>>()
  const subject = findSubject(route.params.subjectId)

  const coin = useApp(s => s.coin)
  const topicLessons = useApp(s => s.topicLessons)

  if (!subject) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missing}>
          <Pressable onPress={exit} style={({ pressed }) => [styles.missingBtn, pressed && { opacity: 0.8 }]}>
            <Text style={styles.missingText}>Asosiy sahifaga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const progressOf = (num: number) => {
    const ids = topicLessonIds(num)
    return { done: ids.filter(id => topicLessons[id]?.done).length, total: ids.length }
  }

  const loaded = subject.topics.filter(t => topicLessonIds(t.num).length > 0)

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
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerKicker}>Fan</Text>
            <Text style={styles.headerName} numberOfLines={1}>
              {subject.name}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic('light')
              navigation.navigate('Main', { screen: 'Shop' })
            }}
            accessibilityLabel="Hamyon"
            style={({ pressed }) => [styles.wallet, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="cash" size={12} color="#B87A22" />
            <Text style={[styles.walletText, NUM]}>{coin}</Text>
          </Pressable>
        </View>

        {/* ── Mavzular ── */}
        {loaded.length > 0 ? (
          <View style={[styles.section, styles.topicSection]}>
            {/* ── Qisqa yo'riqnoma ── */}
            <View style={styles.hint}>
              <Ionicons name="information-circle-outline" size={15} color="#6B7C66" />
              <Text style={styles.hintText}>
                Mavzuni tanlang — ichida <Text style={styles.hintStrong}>video → misol → test</Text> bor.
              </Text>
            </View>

            <View style={styles.topicHead}>
              <Text style={styles.topicHeading}>Mavzular</Text>
              <Text style={[styles.topicCount, NUM]}>{loaded.length} ta</Text>
            </View>
            <View style={styles.topicList}>
              {loaded.map((t, i) => {
                const { done, total } = progressOf(t.num)
                const ready = total > 0 && done === total
                const ratio = total > 0 ? done / total : 0
                return (
                  <Reveal key={t.num} delay={i * 60}>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('medium')
                        navigation.navigate('Topic', { topicNum: t.num })
                      }}
                      style={({ pressed }) => [styles.topicCard, pressed && { transform: [{ scale: 0.99 }] }]}
                    >
                      <View style={styles.topicTop}>
                        <View style={[styles.topicNumTile, ready ? styles.topicNumReady : styles.topicNumActive]}>
                          {ready ? (
                            <Ionicons name="checkmark" size={16} color="#0B6E4F" />
                          ) : (
                            <Text style={[styles.topicNumText, NUM]}>{t.num}</Text>
                          )}
                        </View>
                        <View style={styles.topicMeta}>
                          <Text style={styles.topicTitle}>
                            Mavzu {t.num}. {t.title}
                          </Text>
                          <Text style={[styles.topicStats, NUM]}>
                            {total} bo'lim · {topicVideoCount(t.num)} video dars · {topicTestCount(t.num)} savol
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={15} color="#9AA995" style={styles.topicChevron} />
                      </View>

                      <View style={styles.topicFoot}>
                        <View style={styles.railTrack}>
                          <View style={[styles.railFill, { width: `${ratio * 100}%` }]}>
                            <LinearGradient
                              colors={['#9BE04B', '#5FAF22']}
                              start={{ x: 0, y: 0.5 }}
                              end={{ x: 1, y: 0.5 }}
                              style={ABS_FILL}
                            />
                          </View>
                        </View>
                        <Text style={[styles.railCount, NUM, ready ? styles.railCountReady : null]}>
                          {done}/{total}
                        </Text>
                        <Text style={[styles.railLabel, ready ? styles.railLabelReady : null]}>
                          {ready ? 'Testga tayyor' : done > 0 ? 'Davom etish' : 'Boshlash'}
                        </Text>
                      </View>
                    </Pressable>
                  </Reveal>
                )
              })}
            </View>
          </View>
        ) : (
          /* ── Bo'sh holat: mazmun yuklanmagan ── */
          <View style={[styles.section, styles.topicSection]}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyMedia}>
                <Image source={subject.photo} style={styles.emptyPhoto} resizeMode="cover" />
                <LinearGradient
                  colors={['rgba(9,32,21,0.04)', 'rgba(9,32,21,0.5)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <View style={styles.emptyBadge}>
                  <Text style={styles.emptyBadgeText}>{subject.badge}</Text>
                </View>
              </View>

              <View style={styles.emptyBodyWrap}>
                <Text style={styles.emptyTitle}>{subject.name} uchun darslar yuklanmagan</Text>
                <Text style={styles.emptyBody}>
                  Video darslar, nazariya va yakuniy test shu bo'limda paydo bo'ladi. Hozircha {SUBJECTS[0].name} bo'yicha
                  davom etishingiz mumkin.
                </Text>
                <Pressable
                  onPress={() => {
                    triggerHaptic('medium')
                    navigation.navigate('Subject', { subjectId: SUBJECTS[0].id })
                  }}
                  style={({ pressed }) => [styles.emptyCta, pressed && { opacity: 0.9 }]}
                >
                  <Ionicons name="compass" size={15} color="#CDE9AE" />
                  <Text style={styles.emptyCtaText}>{SUBJECTS[0].name} mavzulariga o'tish</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.emptyHint}>
              <Ionicons name="film" size={12} color="#9AA995" />
              <Text style={styles.emptyHintText}>Yuklangan fanlar avtomatik ro'yxatga qo'shiladi</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const headerBtn: ViewStyle = {
  width: 38,
  height: 38,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingBottom: 112 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { ...headerBtn, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA' },
  headerTitle: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: 8 },
  headerKicker: { fontSize: 11, letterSpacing: 0.2, fontWeight: '700', color: '#6B7C66' },
  headerName: { marginTop: 2, fontSize: 15, fontWeight: '800', color: C.ink, lineHeight: 19 },
  wallet: { ...headerBtn, backgroundColor: '#FCF1DC', borderWidth: 1, borderColor: '#E8A33D', gap: 1 },
  walletText: { fontSize: 9.5, fontWeight: '800', color: '#B87A22' },

  section: { paddingHorizontal: 16 },
  topicSection: { marginTop: 20 },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingBtn: { ...CARD, height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  missingText: { fontSize: 13, fontWeight: '800', color: '#0E1A12' },

  hint: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 4, marginBottom: 14 },
  hintText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '500', color: '#6B7C66' },
  hintStrong: { fontWeight: '800', color: C.ink2 },

  topicHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 10 },
  topicHeading: { fontSize: 15.5, fontWeight: '800', color: C.ink },
  topicCount: { fontSize: 11, fontWeight: '700', color: '#9AA995' },
  topicList: { gap: 12 },
  topicCard: { ...CARD, borderRadius: 16, overflow: 'hidden' },
  topicTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingLeft: 14, paddingRight: 12, paddingTop: 14 },
  topicNumTile: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  topicNumReady: { backgroundColor: '#DDF3DC' },
  topicNumActive: { backgroundColor: '#0E1A12' },
  topicNumText: { fontSize: 13, fontWeight: '800', color: '#9BE04B' },
  topicMeta: { flex: 1, minWidth: 0 },
  topicTitle: { fontSize: 13.5, fontWeight: '800', color: C.ink, lineHeight: 19 },
  topicStats: { marginTop: 4, fontSize: 11, fontWeight: '600', color: '#9AA995' },
  topicChevron: { marginTop: 8, flexShrink: 0 },

  topicFoot: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  railTrack: { flex: 1, height: 6, backgroundColor: '#EDF1E7', borderRadius: 3, overflow: 'hidden' },
  railFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3, overflow: 'hidden' },
  railCount: { fontSize: 11, fontWeight: '800', color: '#6B7C66' },
  railCountReady: { color: '#0B6E4F' },
  railLabel: { fontSize: 10.5, fontWeight: '800', color: '#9AA995' },
  railLabelReady: { color: '#0B6E4F' },

  emptyCard: { ...CARD, borderRadius: 16, overflow: 'hidden' },
  emptyMedia: { height: 132, backgroundColor: '#0E1A12' },
  emptyPhoto: { width: '100%', height: '100%' },
  emptyBadge: {
    position: 'absolute',
    left: 14,
    bottom: 12,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#9BE04B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBadgeText: { fontSize: 11.5, fontWeight: '800', color: C.inkOnLime },
  emptyBodyWrap: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20 },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: C.ink, textAlign: 'center', lineHeight: 20 },
  emptyBody: { marginTop: 8, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: '#6B7C66', textAlign: 'center' },
  emptyCta: {
    marginTop: 16,
    alignSelf: 'stretch',
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E1A12',
    borderRadius: 12,
  },
  emptyCtaText: { fontSize: 13, fontWeight: '800', color: '#CDE9AE' },
  emptyHint: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyHintText: { fontSize: 11, fontWeight: '700', color: '#9AA995' },
})

export default SubjectScreen
