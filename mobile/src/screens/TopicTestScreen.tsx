import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TOPIC_1_LESSONS, TOPIC_1_PASS, TOPIC_1_TEST } from '../data/topic1'
import type { SessionResult } from '../store/useStore'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { CARD, GRAD_LIME, GRAD_RAIL, INK_BTN, INK_TEXT, LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'

/**
 * Mavzu yakuniy testi — 30 savol, har to'g'ri javob testning own narxida.
 * Zanjir qoidasi: barcha bo'limlar tugamagan bo'lsa testga kirilmaydi.
 */

const TICK = { ok: '#5FAF22', bad: '#D9534F', current: '#0E1A12', todo: '#E1E7DA' }
const LETTER = (i: number) => String.fromCharCode(65 + i)
const RAIL_COLS = 15

type Nav = NativeStackNavigationProp<RootStackParamList>
type Answer = SessionResult['answers'][number]

const TopicTestScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Topic')

  const canEnter = useApp(s => s.canEnterTopicTest)
  const topicLessons = useApp(s => s.topicLessons)
  const finishTopicTest = useApp(s => s.finishTopicTest)
  const beginSession = useApp(s => s.beginSession)

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const finished = useRef(false)

  useEffect(() => {
    beginSession()
  }, [beginSession])

  const doneCount = TOPIC_1_LESSONS.filter(l => topicLessons[l.id]?.done).length

  if (!canEnter()) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIcon}>
            <Ionicons name="lock-closed" size={24} color="#9AA995" />
          </View>
          <Text style={styles.gateTitle}>Yakuniy test hali yopiq</Text>
          <Text style={styles.gateSub}>
            Avval {TOPIC_1_LESSONS.length} ta bo&apos;limni yakunlang — {doneCount} tasi tugadi.
          </Text>
          <Pressable
            onPress={() => {
              triggerHaptic('medium')
              exit()
            }}
            style={({ pressed }) => [styles.gateBtn, LIME_BTN, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <Text style={[styles.gateBtnText, LIME_TEXT]}>Bo&apos;limlarga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const total = TOPIC_1_TEST.questions.length
  const question = TOPIC_1_TEST.questions[cursor]
  const isLast = cursor === total - 1

  const choose = (i: number) => {
    if (checked) return
    triggerHaptic('selection')
    setPicked(i)
  }

  const confirm = () => {
    if (picked === null) return
    const ok = picked === question.correct
    triggerHaptic(ok ? 'success' : 'error')
    setChecked(true)
    setAnswers(prev => [...prev, {
      prompt: question.prompt,
      picked,
      correct: question.correct,
      options: question.options,
      explain: question.explain,
      ok,
    }])
  }

  const finish = (all: Answer[]) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    finishTopicTest({
      kind: 'topic-test',
      refId: TOPIC_1_TEST.id,
      title: TOPIC_1_TEST.title,
      answers: all,
      coinsEarned: ok * TOPIC_1_TEST.coinPerSolve,
      xpEarned: ok * TOPIC_1_TEST.xpPerSolve,
    })
    triggerHaptic(ok >= TOPIC_1_PASS ? 'success' : 'warning')
    navigation.replace('Result')
  }

  const next = () => {
    if (isLast) {
      finish(answers)
      return
    }
    setCursor(c => Math.min(c + 1, total - 1))
    setPicked(null)
    setChecked(false)
  }

  const isRight = picked === question.correct
  const earned = answers.filter(a => a.ok).length * TOPIC_1_TEST.coinPerSolve

  const railState = (i: number) => {
    const a = answers[i]
    return a ? (a.ok ? 'ok' : 'bad') : i === cursor ? 'current' : 'todo'
  }
  const railColor = (i: number) => {
    const s = railState(i)
    return s === 'ok' ? TICK.ok : s === 'bad' ? TICK.bad : s === 'current' ? TICK.current : TICK.todo
  }

  const rows = Math.ceil(total / RAIL_COLS)

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Holat chizig'i: hisob + 30 bo'linma + narx ── */}
        <View style={styles.statusRow}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Chiqish"
            style={({ pressed }) => [styles.exitBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          >
            <Ionicons name="close" size={14} color="#6B7C66" />
          </Pressable>
          <Text style={[styles.counter, NUM]}>
            {cursor + 1}/{total}
          </Text>
          <View style={styles.priceChip}>
            <Ionicons name="cash" size={12} color="#E8A33D" />
            <Text style={[styles.priceText, NUM]}>+{TOPIC_1_TEST.coinPerSolve}</Text>
          </View>
        </View>

        <View style={styles.rail}>
          {Array.from({ length: rows }, (_, r) => (
            <View key={r} style={styles.railRow}>
              {TOPIC_1_TEST.questions.slice(r * RAIL_COLS, (r + 1) * RAIL_COLS).map((_, j) => {
                const i = r * RAIL_COLS + j
                return <View key={i} style={[styles.railCell, { backgroundColor: railColor(i) }]} />
              })}
            </View>
          ))}
        </View>

        {/* ── Savol ── */}
        <View key={cursor} style={[CARD, styles.qCard]}>
          <View style={styles.qRailWrap}>
            <LinearGradient colors={GRAD_RAIL} style={ABS_FILL} />
          </View>
          <View style={styles.qBody}>
            <Text style={styles.qKicker}>Mavzu 1 · savol {cursor + 1}</Text>
            <Text style={styles.qPrompt}>{question.prompt}</Text>
          </View>
        </View>

        {/* ── Variantlar ── */}
        <View style={styles.options}>
          {question.options.map((opt, i) => {
            const isPicked = picked === i
            const isCorrect = question.correct === i
            let box: ViewStyle = { ...CARD, borderRadius: 14 }
            let textColor = '#0E1A12'
            let badge: ViewStyle = { backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1, borderRadius: 9 }
            let badgeColor = '#6B7C66'
            let badgeGrad: readonly [string, string] | null = null

            if (!checked) {
              if (isPicked) {
                box = { backgroundColor: '#EDF7DE', borderWidth: 1.5, borderColor: '#7ED321', borderRadius: 14 }
                textColor = '#1C3214'
                badge = { backgroundColor: '#7ED321', borderRadius: 9, overflow: 'hidden' }
                badgeColor = '#1C3214'
                badgeGrad = GRAD_LIME
              }
            } else if (isCorrect) {
              box = { backgroundColor: '#DDF3DC', borderWidth: 1.5, borderColor: '#5FAF22', borderRadius: 14 }
              textColor = '#0B4A34'
              badge = { backgroundColor: '#5FAF22', borderRadius: 9 }
              badgeColor = '#FFFFFF'
            } else if (isPicked) {
              box = { backgroundColor: '#FBE9E7', borderWidth: 1.5, borderColor: '#D9534F', borderRadius: 14 }
              textColor = '#8C2F2C'
              badge = { backgroundColor: '#D9534F', borderRadius: 9 }
              badgeColor = '#FFFFFF'
            } else {
              box = { ...CARD, borderRadius: 14 }
              textColor = '#9AA995'
            }

            return (
              <Pressable
                key={i}
                onPress={() => choose(i)}
                disabled={checked}
                style={({ pressed }) => [styles.option, box, pressed && !checked && { transform: [{ scale: 0.99 }] }]}
              >
                <View style={[styles.optionBadge, badge]}>
                  {!!badgeGrad && (
                    <LinearGradient colors={badgeGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                  )}
                  <Text style={[styles.optionLetter, { color: badgeColor }]}>{LETTER(i)}</Text>
                </View>
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                {checked && isCorrect && <Ionicons name="checkmark" size={16} color="#5FAF22" />}
                {checked && isPicked && !isCorrect && <Ionicons name="close" size={16} color="#D9534F" />}
              </Pressable>
            )
          })}
        </View>

        {/* ── Tushuntirish ── */}
        {checked && (
          <View style={[CARD, styles.explain]}>
            <View style={[styles.explainRail, { backgroundColor: isRight ? '#5FAF22' : '#E8A33D' }]} />
            <View style={styles.explainBody}>
              <View style={styles.explainHead}>
                <Text style={[styles.explainVerdict, { color: isRight ? '#0B6E4F' : '#B87A22' }]}>
                  {isRight ? 'Yechildi' : 'Xato javob'}
                </Text>
                <Text style={[styles.explainPrice, NUM, { color: isRight ? '#B87A22' : '#9AA995' }]}>
                  {isRight ? `+${TOPIC_1_TEST.coinPerSolve} coin` : '+0 coin'}
                </Text>
              </View>
              <Text style={styles.explainText}>{question.explain}</Text>
            </View>
          </View>
        )}

        {/* ── Harakat ── */}
        <Pressable
          onPress={checked ? next : confirm}
          disabled={!checked && picked === null}
          style={({ pressed }) => [
            styles.action,
            !checked && picked === null
              ? styles.actionDisabled
              : checked
                ? LIME_BTN
                : INK_BTN,
            pressed && { transform: [{ scale: 0.985 }] },
          ]}
        >
          <Text
            style={[
              styles.actionText,
              !checked && picked === null
                ? { color: '#9AA995' }
                : checked
                  ? LIME_TEXT
                  : INK_TEXT,
            ]}
          >
            {!checked ? 'Tekshirish' : isLast ? "Natijani ko'rish" : 'Keyingi savol'}
          </Text>
          {checked && <Ionicons name="chevron-forward" size={16} color={checked ? '#1C3214' : '#CDE9AE'} />}
        </Pressable>

        <Text style={[styles.tally, NUM]}>
          {answers.filter(a => a.ok).length} ta to&apos;g&apos;ri · {earned} coin · o&apos;tish uchun {TOPIC_1_PASS} ta kerak
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16, paddingBottom: 40 },

  gate: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  gateIcon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFCF8', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 16 },
  gateTitle: { fontSize: 16, fontWeight: '800', color: C.ink, textAlign: 'center' },
  gateSub: { fontSize: 12.5, lineHeight: 19, textAlign: 'center', fontWeight: '500', color: '#6B7C66' },
  gateBtn: { marginTop: 8, height: 46, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  gateBtnText: { fontSize: 13.5 },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 4 },
  exitBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 9 },
  counter: { fontSize: 12, fontWeight: '800', color: '#33452F' },
  priceChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },

  rail: { gap: 3, marginTop: 8 },
  railRow: { flexDirection: 'row', gap: 3 },
  railCell: { flex: 1, height: 6, borderRadius: 3 },

  qCard: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', marginTop: 12 },
  qRailWrap: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  qBody: { flex: 1, paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  qKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  qPrompt: { marginTop: 8, fontSize: 17, lineHeight: 24, fontWeight: '600', color: C.ink },

  options: { marginTop: 16, gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  optionBadge: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  optionLetter: { fontSize: 12, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 14.5, lineHeight: 20, fontWeight: '600', color: '#0E1A12' },

  explain: { borderRadius: 14, marginTop: 16, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#FBFCF8' },
  explainRail: { width: 4 },
  explainBody: { flex: 1, paddingLeft: 16, paddingRight: 14, paddingVertical: 14 },
  explainHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  explainVerdict: { fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800' },
  explainPrice: { fontSize: 12, fontWeight: '800' },
  explainText: { marginTop: 8, fontSize: 13.5, lineHeight: 21, color: C.ink2 },

  action: { marginTop: 20, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  actionDisabled: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  actionText: { fontSize: 14.5, fontWeight: '800' },

  tally: { marginTop: 12, textAlign: 'center', fontSize: 11.5, fontWeight: '700', color: '#9AA995' },
})

export default TopicTestScreen
