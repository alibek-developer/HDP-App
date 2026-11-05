import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line } from 'react-native-svg'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { findLesson } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM, TICK, shadow } from '../theme/tokens'
import {
  AMBER_BTN, AMBER_TEXT, CARD, INK_BTN, INK_TEXT, LIME_BTN, SOLVER_BODY,
} from '../theme/solver'

/**
 * Kurs darsining birinchi bosqichi — konspekt.
 * Bu darslarda video yozuv yo'q, shuning uchun soxta pleyer o'rniga
 * haqiqiy mazmun: mavzu, asosiy misol qadamlari va bog'liq formulalar.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const kicker: TextStyle = {
  fontSize: 10,
  lineHeight: 13,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  fontWeight: '800',
  color: '#6B7C66',
}

const LessonScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Courses')
  const route = useRoute<RouteProp<RootStackParamList, 'Lesson'>>()
  const lesson = findLesson(Number(route.params.id))

  const lessonId = Number(route.params.id)
  const read = useApp(s => !!s.lessons[lessonId]?.videoWatched)
  const exampleDone = useApp(s => !!s.lessons[lessonId]?.exampleDone)
  const testScore = useApp(s => s.lessons[lessonId]?.testScore ?? null)
  const canOpenLesson = useApp(s => s.canOpenLesson)
  const markVideoWatched = useApp(s => s.markVideoWatched)
  const startLesson = useApp(s => s.startLesson)
  const beginSession = useApp(s => s.beginSession)

  useEffect(() => {
    if (lesson) {
      startLesson(lesson.id)
      beginSession()
    }
  }, [lesson, startLesson, beginSession])

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIconNotFound}>
            <Text style={styles.gateQuestion}>?</Text>
          </View>
          <Text style={styles.gateTitle}>Bunday dars topilmadi</Text>
          <Pressable
            onPress={exit}
            style={({ pressed }) => [styles.gateBtn, styles.inkBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={[styles.inkBtnText, INK_TEXT]}>Kurslarga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  // Zanjir qoidasi: Pro dars faqat obunachilarga
  if (!canOpenLesson(lesson.id)) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIconLock}>
            <Ionicons name="lock-closed" size={22} color="#B87A22" />
          </View>
          <Text style={styles.gateTitle}>Bu dars Pro uchun</Text>
          <Text style={styles.gateSub}>
            10 ta bepul darsni tugating yoki Pro obuna bilan barchasini oching.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Pro', { reason: 'lesson' })}
            style={({ pressed }) => [styles.gateBtn, styles.amberBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={[styles.amberBtnText, AMBER_TEXT]}>{"Pro ni ko'rish"}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const toExample = () => {
    if (!read) markVideoWatched(lesson.id)
    triggerHaptic('medium')
    navigation.navigate('LessonExample', { id: String(lesson.id) })
  }

  const chain = [
    { u: 'Konspekt', on: read },
    { u: 'Misol', on: exampleDone },
    { u: 'Test', on: testScore !== null },
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
            <Text style={styles.headerKicker}>
              Dars {String(lesson.id).padStart(2, '0')} · {lesson.topic}
            </Text>
            <Text style={styles.headerName} numberOfLines={1}>
              {lesson.title}
            </Text>
          </View>

          <View style={styles.headerNum}>
            <Text style={[styles.headerNumText, NUM]}>{String(lesson.id).padStart(2, '0')}</Text>
          </View>
        </View>

        {/* ── Konspekt: siyoh varaq ── */}
        <LinearGradient
          colors={GRAD_SHEET}
          locations={[0, 0.72, 1]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={styles.sheet}
        >
          <Stripes />

          <View style={styles.sheetHead}>
            <View style={styles.sheetIcon}>
              <Ionicons name="book-outline" size={14} color="#9BE04B" />
            </View>
            <Text style={[styles.sheetKicker, NUM]}>Dars konspekti</Text>
            <View style={styles.qChip}>
              <Text style={[styles.qChipText, NUM]}>{lesson.questions.length} savol</Text>
            </View>
          </View>

          <Text style={styles.sheetTopic}>{lesson.topic}</Text>
          <Text style={styles.sheetBody}>{lesson.summary}</Text>

          <View style={styles.sheetFoot}>
            <Ionicons name="time-outline" size={12} color="rgba(205,233,174,0.55)" />
            <Text style={[styles.sheetMeta, NUM]}>{lesson.duration} daq o&apos;qish</Text>
            {read && (
              <View style={styles.readChip}>
                <Ionicons name="checkmark" size={10} color="#9BE04B" />
                <Text style={styles.readChipText}>O&apos;qildi</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ── Zanjir holati: Konspekt → Misol → Test ── */}
        <View style={[CARD, styles.chain]}>
          {chain.map((cell, i) => (
            <View key={cell.u} style={styles.chainCell}>
              {i > 0 && <View style={styles.chainDiv} />}
              <View style={styles.chainInner}>
                <View style={[styles.chainBar, { backgroundColor: cell.on ? TICK.ok : '#EAEEE3' }]} />
                <Text style={[styles.chainLabel, { color: cell.on ? '#0B6E4F' : '#9AA995' }]}>{cell.u}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Asosiy misol — to'liq yechim ── */}
        <View style={[CARD, styles.about]}>
          <View style={styles.aboutRail} />
          <View style={styles.aboutBody}>
            <Text style={kicker}>Asosiy misol</Text>
            <Text style={styles.examplePrompt}>{lesson.example.prompt}</Text>

            {lesson.example.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={[styles.stepNumText, NUM]}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Javob</Text>
              <Text style={[styles.answerText, NUM]}>{lesson.example.answer}</Text>
            </View>
          </View>
        </View>

        {/* ── Bog'liq formulalar ── */}
        {lesson.formulaIds.length > 0 && (
          <Pressable
            onPress={() => {
              triggerHaptic('light')
              navigation.navigate('Formulas')
            }}
            style={({ pressed }) => [CARD, styles.linkRow, pressed && { transform: [{ scale: 0.99 }] }]}
          >
            <View style={styles.linkIcon}>
              <Ionicons name="calculator-outline" size={17} color="#0B6E4F" />
            </View>
            <View style={styles.linkBody}>
              <Text style={styles.linkTitle}>Tegishli formulalar</Text>
              <Text style={styles.linkSub}>
                {lesson.formulaIds.length} ta formula — Formulalar bankida
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9AA995" />
          </Pressable>
        )}

        {/* ── Keyingi bosqich ── */}
        <Pressable
          onPress={toExample}
          style={({ pressed }) => [styles.cta, LIME_BTN, pressed && { transform: [{ scale: 0.985 }] }]}
        >
          {read ? (
            <Ionicons name="chevron-forward" size={16} color="#1C3214" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={17} color="#1C3214" />
          )}
          <Text style={[styles.ctaText, { color: '#1C3214' }]}>
            {read ? "Misolga o'tish" : "Konspektni o'qidim"}
          </Text>
        </Pressable>
        <Text style={styles.ctaHint}>Misol va test keyingi bosqichda — ketma-ket ochiladi.</Text>
      </ScrollView>

    </View>
  )
}

/** web: repeating-linear-gradient(90deg, transparent 0 22px, rgba(205,233,174,.5) 22px 23px) */
const STRIPE_GAP = 22
const STRIPE_LINE = 'rgba(205,233,174,0.5)'

const Stripes = ({ style }: { style?: ViewStyle }) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const cols = Math.ceil(size.width / STRIPE_GAP)

  return (
    <View pointerEvents="none" style={[ABS_FILL, { opacity: 0.07 }, style]} onLayout={e => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
      {size.width > 0 && (
        <Svg width={size.width} height={size.height}>
          {Array.from({ length: cols }, (_, i) => (
            <Line
              key={i}
              x1={(i + 1) * STRIPE_GAP}
              y1={0}
              x2={(i + 1) * STRIPE_GAP}
              y2={size.height}
              stroke={STRIPE_LINE}
              strokeWidth={1}
            />
          ))}
        </Svg>
      )}
    </View>
  )
}

/** web: linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%) */
const GRAD_SHEET = ['#0E1A12', '#123B24', '#164A2C'] as const

const sheetShadow = shadow('#0E1A12', 13, 10, 0.22)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 14 },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 12,
  },
  headerTitle: { flex: 1, minWidth: 0, alignItems: 'center', paddingTop: 2 },
  headerKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', textAlign: 'center' },
  headerName: { fontSize: 15, lineHeight: 19, fontWeight: '800', color: C.ink, marginTop: 4, textAlign: 'center' },
  headerNum: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8F3',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 12,
  },
  headerNumText: { fontSize: 13, fontWeight: '800', color: '#33452F' },

  sheet: { borderRadius: 18, overflow: 'hidden', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, ...sheetShadow },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(155,224,75,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(155,224,75,0.32)',
    borderRadius: 8,
  },
  sheetKicker: { flex: 1, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800', color: '#CDE9AE' },
  qChip: { paddingHorizontal: 8, paddingVertical: 5, backgroundColor: 'rgba(205,233,174,0.10)', borderRadius: 8 },
  qChipText: { fontSize: 10, textTransform: 'uppercase', fontWeight: '800', color: 'rgba(205,233,174,0.65)' },
  sheetTopic: { marginTop: 14, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '800', color: '#9BE04B' },
  sheetBody: { marginTop: 6, fontSize: 13.5, lineHeight: 21, fontWeight: '600', color: '#F2F8EA' },
  sheetFoot: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sheetMeta: { fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '700', color: 'rgba(205,233,174,0.55)' },
  readChip: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(155,224,75,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(155,224,75,0.4)',
    borderRadius: 8,
  },
  readChipText: { fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800', color: '#9BE04B' },

  chain: { borderRadius: 14, flexDirection: 'row', alignItems: 'stretch', paddingHorizontal: 8, paddingVertical: 10, marginBottom: 16 },
  chainCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chainDiv: { width: 1, alignSelf: 'stretch', backgroundColor: '#EDF1E7' },
  chainInner: { flex: 1, paddingHorizontal: 8 },
  chainBar: { height: 5, borderRadius: 3 },
  chainLabel: { fontSize: 10, textTransform: 'uppercase', fontWeight: '800', textAlign: 'center', marginTop: 8 },

  about: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 },
  aboutRail: { width: 4, backgroundColor: '#5FAF22' },
  aboutBody: { flex: 1, paddingLeft: 16, paddingRight: 16, paddingVertical: 16 },
  examplePrompt: { fontSize: 13.5, lineHeight: 20, fontWeight: '800', color: C.ink, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 10 },
  stepNum: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 6, marginTop: 1 },
  stepNumText: { fontSize: 10.5, fontWeight: '800', color: '#0B6E4F' },
  stepText: { flex: 1, minWidth: 0, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: '#33452F' },
  answerRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF1E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  answerLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '800', color: '#9AA995' },
  answerText: { flexShrink: 1, fontSize: 13.5, fontWeight: '800', color: '#0B6E4F', textAlign: 'right' },

  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 14, paddingVertical: 14, marginBottom: 16 },
  linkIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 12 },
  linkBody: { flex: 1, minWidth: 0 },
  linkTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink },
  linkSub: { fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: '#6B7C66', marginTop: 2 },

  cta: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  ctaText: { fontSize: 14.5, fontWeight: '800' },
  ctaHint: { marginTop: 10, fontSize: 11, lineHeight: 15, fontWeight: '600', color: '#9AA995', textAlign: 'center' },

  gate: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  gateIconNotFound: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 16 },
  gateQuestion: { fontSize: 22, fontWeight: '800', color: '#0B6E4F' },
  gateIconLock: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF1DC',
    borderWidth: 1,
    borderColor: '#E8A33D',
    borderRadius: 16,
  },
  gateTitle: { fontSize: 16, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: 4 },
  gateSub: { fontSize: 12.5, lineHeight: 18, textAlign: 'center', maxWidth: 260, color: '#6B7C66' },
  gateBtn: { width: '100%', maxWidth: 240, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 12, marginTop: 8 },
  inkBtn: INK_BTN,
  inkBtnText: { fontSize: 13.5, fontWeight: '800' },
  amberBtn: AMBER_BTN,
  amberBtnText: { fontSize: 14, fontWeight: '800' },
})

export default LessonScreen
