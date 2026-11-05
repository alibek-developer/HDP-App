import { useState } from 'react'
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
import { findLesson } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { CARD, GRAD_RAIL, LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'

/**
 * 5-qadam: Misol — dars mavzusiga oid BITTA yechilgan misol.
 * Qoida: barcha qadamlar ochilmasa «Testga o'tish» yopiq qoladi.
 */

const TICK = { ok: '#5FAF22', current: '#0E1A12', todo: '#E1E7DA' }

type Nav = NativeStackNavigationProp<RootStackParamList>

const ExampleScreen = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'LessonExample'>>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Home')

  const lessonId = Number(route.params.id)
  const lesson = findLesson(lessonId)

  const exampleDone = useApp(s => !!s.lessons[lessonId]?.exampleDone)
  const canEnterExample = useApp(s => s.canEnterExample(lessonId))
  const markExampleDone = useApp(s => s.markExampleDone)

  const [revealed, setRevealed] = useState(exampleDone ? 99 : 0)

  if (!lesson) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Pressable onPress={exit} style={({ pressed }) => [styles.backEmpty, pressed && { transform: [{ scale: 0.97 }] }]}>
          <Text style={styles.backEmptyText}>Kurslarga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  const steps = lesson.example.steps
  const allSeen = revealed >= steps.length

  // Zanjir qoidasi: konspekt o'qilmagan bo'lsa misolga kirib bo'lmaydi
  if (!canEnterExample) {
    return (
      <View style={[styles.screen, styles.center]}>
        <View style={styles.lockTile}>
          <Ionicons name="lock-closed" size={22} color="#6B7C66" />
        </View>
        <Text style={styles.lockTitle}>Avval konspektni o&apos;qing</Text>
        <Text style={styles.lockMeta}>Misol konspekt o&apos;qilgach ochiladi.</Text>
        <Pressable
          onPress={() => {
            triggerHaptic('medium')
            navigation.navigate('Lesson', { id: String(lesson.id) })
          }}
          style={({ pressed }) => [LIME_BTN, styles.lockCta, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />
          <Text style={[styles.lockCtaText, LIME_TEXT]}>Konspektga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  const revealNext = () => {
    triggerHaptic('selection')
    setRevealed(r => r + 1)
  }

  const toTest = () => {
    markExampleDone(lesson.id)
    triggerHaptic('medium')
    navigation.navigate('LessonTest', { id: String(lesson.id) })
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Holat chizig'i: chiqish + qadam hisobi + davotar chiziqlari */}
        <View style={styles.statusRow}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Chiqish"
            style={({ pressed }) => [styles.exitBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          >
            <Ionicons name="close" size={14} color="#6B7C66" />
          </Pressable>
          <Text style={[styles.counter, NUM]}>{Math.min(revealed, steps.length)}/{steps.length}</Text>

          <View style={styles.ticks}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[styles.tick, { backgroundColor: i < revealed ? TICK.ok : i === revealed ? TICK.current : TICK.todo }]}
              />
            ))}
          </View>

          <Text style={styles.qadamLabel}>qadam</Text>
        </View>

        <View style={styles.stage}>
          {/* Masala sharti */}
          <View style={[styles.qCard, CARD]}>
            <LinearGradient
              colors={GRAD_RAIL}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.qRail, { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }]}
            />
            <View style={styles.qBody}>
              <Text style={styles.qKicker}>{lesson.title} · masala sharti</Text>
              <Text style={styles.qPrompt}>{lesson.example.prompt}</Text>
            </View>
          </View>

          {/* Qadamlar */}
          <View style={styles.steps}>
            {steps.map((s, i) =>
              i < revealed ? (
                <View key={i} style={[styles.step, { backgroundColor: '#FBFCF8' }]}>
                  <View style={styles.stepRail} />
                  <View style={styles.stepNum}>
                    <Text style={[styles.stepNumText, NUM]}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{s}</Text>
                </View>
              ) : (
                i === revealed && (
                  <Pressable
                    key={i}
                    onPress={revealNext}
                    style={({ pressed }) => [styles.revealBtn, pressed && { transform: [{ scale: 0.99 }] }]}
                  >
                    <Ionicons name="bulb-outline" size={16} color="#B87A22" />
                    <Text style={styles.revealText}>
                      {i === 0 ? "1-qadamni ko'rish" : `${i + 1}-qadamni ko'rish`}
                    </Text>
                  </Pressable>
                )
              )
            )}
          </View>

          {/* Javob */}
          {allSeen && (
            <View style={styles.answer}>
              <LinearGradient
                colors={GRAD_RAIL}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.rail, { width: 5 }]}
              />
              <View style={styles.answerBody}>
                <Text style={styles.answerKicker}>Javob</Text>
                <Text style={[styles.answerValue, NUM]}>{lesson.example.answer}</Text>
              </View>
            </View>
          )}

          {/* Testga o'tish — qulf zanjiri */}
          <Pressable
            disabled={!allSeen}
            onPress={toTest}
            style={({ pressed }) => [
              styles.toTest,
              allSeen ? [LIME_BTN, { overflow: 'hidden' }] : styles.toTestIdle,
              pressed && { transform: [{ scale: 0.985 }] },
            ]}
          >
            {allSeen && <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />}
            {!allSeen && <Ionicons name="lock-closed" size={15} color="#9AA995" />}
            <Text style={[styles.toTestText, allSeen ? LIME_TEXT : { color: '#9AA995', fontWeight: '800' }]}>
              {allSeen ? "Testga o'tish" : "Avval yechimni to'liq ko'ring"}
            </Text>
            {allSeen && <Ionicons name="chevron-forward" size={16} color="#1C3214" />}
          </Pressable>

          {allSeen && (
            <View style={styles.markedRow}>
              <Ionicons name="checkmark" size={11} color="#5FAF22" />
              <Text style={styles.markedText}>Misol bajarildi deb belgilandi</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const railBase: ViewStyle = { position: 'absolute', left: 0, top: 0, bottom: 0 }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },

  backEmpty: { ...CARD, height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  backEmptyText: { fontSize: 13, fontWeight: '800', color: C.ink },

  lockTile: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8F3',
    borderColor: '#E1E7DA',
    borderWidth: 1,
    borderRadius: 16,
  },
  lockTitle: { fontSize: 16, fontWeight: '800', color: C.ink, textAlign: 'center' },
  lockMeta: { fontSize: 12.5, fontWeight: '500', color: '#6B7C66', textAlign: 'center' },
  lockCta: { marginTop: 8, height: 46, paddingHorizontal: 24, overflow: 'hidden' },
  lockCtaText: { fontSize: 13.5 },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 },
  exitBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E7DA',
    borderWidth: 1,
    borderRadius: 9,
  },
  counter: { fontSize: 12, fontWeight: '800', color: C.ink2 },
  ticks: { flex: 1, flexDirection: 'row', gap: 6 },
  tick: { flex: 1, height: 5, borderRadius: 3 },
  qadamLabel: { fontSize: 11.5, letterSpacing: 0.92, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },

  stage: { paddingHorizontal: 16, marginTop: 12 },

  qCard: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: C.ink,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  qRail: { width: 5 },
  qBody: { flex: 1, paddingLeft: 15, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  qKicker: { fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  qPrompt: { marginTop: 8, fontSize: 16.5, lineHeight: 24, fontWeight: '600', color: C.ink },

  steps: { marginTop: 16, gap: 10 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, overflow: 'hidden', paddingVertical: 14, paddingRight: 16, paddingLeft: 15, borderColor: '#E1E7DA', borderWidth: 1, position: 'relative' },
  stepRail: { ...railBase, width: 4, backgroundColor: '#5FAF22' },
  stepNum: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDF3DC',
    borderRadius: 8,
  },
  stepNumText: { fontSize: 12, fontWeight: '900', color: '#0B6E4F' },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21, color: C.ink2 },

  revealBtn: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#CFD9C6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
  },
  revealText: { fontSize: 13.5, fontWeight: '800', color: C.ink },

  answer: { marginTop: 16, backgroundColor: '#0E1A12', borderRadius: 14, overflow: 'hidden', flexDirection: 'row' },
  rail: railBase,
  answerBody: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingLeft: 15, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  answerKicker: { fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: 'rgba(205,233,174,0.55)' },
  answerValue: { fontFamily: 'monospace', fontSize: 16, fontWeight: '800', color: '#9BE04B' },

  toTest: { marginTop: 20, height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  toTestIdle: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  toTestText: { fontSize: 14.5, fontWeight: '800' },

  markedRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  markedText: { fontSize: 11.5, fontWeight: '700', color: '#9AA995' },
})

export default ExampleScreen
