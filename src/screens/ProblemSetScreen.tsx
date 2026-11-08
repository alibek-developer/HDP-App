import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import type { SessionResult } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExitToTab } from '../lib/nav'
import { findProblemSet } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, MATH_FONT, NUM } from '../theme/tokens'
import { CARD, GRAD_LIME, GRAD_RAIL, LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'

/**
 * To'plam ichida yechish — Masalalar oilasining «davotar» tili.
 * Har to'g'ri javob uchun to'plamning coinPerSolve qiymati beriladi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const TICK: Record<'done' | 'current' | 'todo', string> = {
  done: '#6B7C66',
  current: '#0E1A12',
  todo: '#E1E7DA',
}

const LETTER = (i: number) => String.fromCharCode(65 + i)

const ProblemSetScreen = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'ProblemSet'>>()
  const insets = useSafeAreaInsets()
  const exit = useExitToTab('problems')

  const setId = String(route.params.setId)
  const set = findProblemSet(setId)

  const canOpenSet = useApp(s => s.canOpenSet)
  const finishProblemSet = useApp(s => s.finishProblemSet)
  const beginSession = useApp(s => s.beginSession)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  /** Kirish paytida yechilgan savollar — takroriy yechim uchun coin to'lanmaydi */
  const solvedBefore = useRef<string[]>(solvedQuestions[set?.id ?? ''] ?? [])

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<SessionResult['answers']>([])
  const finished = useRef(false)

  useEffect(() => {
    beginSession()
  }, [beginSession])

  if (!set) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Pressable onPress={exit} style={({ pressed }) => [styles.backEmpty, pressed && { transform: [{ scale: 0.97 }] }]}>
          <Text style={styles.backEmptyText}>To'plamlarga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  // Zanjir qoidasi: Pro yoki coin evaziga ochilmagan to'plamga kirmaymiz
  if (!canOpenSet(set.id)) {
    return (
      <View style={[styles.screen, styles.center]}>
        <View style={styles.lockTile}>
          <Ionicons name="cash-outline" size={24} color="#B87A22" />
        </View>
        <Text style={styles.lockTitle}>Bu to'plam Pro uchun</Text>
        <Text style={styles.lockMeta}>
          {set.topic} · {set.difficulty} · {set.questions.length} ta masala
        </Text>
        <Pressable
          onPress={() => {
            triggerHaptic('medium')
            navigation.navigate('Pro', { reason: 'problem-set', setId: set.id })
          }}
          style={({ pressed }) => [LIME_BTN, styles.lockCta, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
          <Text style={[styles.lockCtaText, LIME_TEXT]}>Pro ni ko'rish</Text>
        </Pressable>
      </View>
    )
  }

  const total = set.questions.length
  const question = set.questions[cursor]
  const isLast = cursor === total - 1

  const choose = (i: number) => {
    triggerHaptic('selection')
    setPicked(i)
  }

  const finish = (all: SessionResult['answers']) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    /** Faqat birinchi marta yechilgan savollar to'lanadi */
    const paidRight = all.filter((a, i) => a.ok && !solvedBefore.current.includes(set.id + '#' + i)).length
    /** Streak rejimi: hammasi to'g'ri bo'lsa mukofot ikkilanadi */
    const mult = set.perfectBonus && ok === all.length ? 2 : 1
    finishProblemSet(set.id, {
      kind: 'problem-set',
      refId: set.id,
      title: set.title,
      answers: all,
      coinsEarned: paidRight * set.coinPerSolve * mult,
      xpEarned: paidRight * set.xpPerSolve * mult,
    })
    triggerHaptic('success')
    navigation.replace('Result')
  }

  /** Javob jimgina yoziladi: to'g'rilik va coin faqat oxirgi natijada ko'rinadi */
  const next = () => {
    if (picked === null) return
    const all: SessionResult['answers'] = [
      ...answers,
      {
        prompt: question.prompt,
        picked,
        correct: question.correct,
        options: question.options,
        explain: question.explain,
        ok: picked === question.correct,
      },
    ]
    if (isLast) {
      finish(all)
      return
    }
    triggerHaptic('light')
    setAnswers(all)
    setCursor(c => Math.min(c + 1, total - 1))
    setPicked(null)
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Holat chizig'i: savol hisobi + davotar chiziqlari ── */}
        <View style={styles.statusRow}>
          <Text style={[styles.counter, NUM]}>{cursor + 1}/{total}</Text>

          <View style={styles.ticks}>
            {set.questions.map((_, i) => {
              const state = i < cursor ? 'done' : i === cursor ? 'current' : 'todo'
              return (
                <View key={i} style={[styles.tick, { backgroundColor: TICK[state] }]} />
              )
            })}
          </View>
        </View>

        <View style={styles.stage}>
          {/* Savol */}
          <View style={[styles.qCard, CARD]}>
            <LinearGradient
              colors={GRAD_RAIL}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.qRail, { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }]}
            />
            <View style={styles.qBody}>
              <Text style={styles.qKicker}>{set.title}</Text>
              <Text style={styles.qPrompt}>{question.prompt}</Text>
            </View>
          </View>

          {/* Javob variantlari — tanlov ko'rinadi, to'g'rilik ko'rinmaydi */}
          <View style={styles.options}>
            {question.options.map((opt, i) => {
              const isPicked = picked === i
              const row: ViewStyle = isPicked
                ? { backgroundColor: '#EDF7DE', borderColor: '#7ED321', borderWidth: 1.5, borderRadius: 14 }
                : { ...CARD }
              const badge: ViewStyle = isPicked
                ? { backgroundColor: '#7ED321', borderRadius: 9, overflow: 'hidden' }
                : { backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1 }

              return (
                <Pressable
                  key={i}
                  onPress={() => choose(i)}
                  style={({ pressed }) => [styles.option, row, pressed && { transform: [{ scale: 0.99 }] }]}
                >
                  <View style={[styles.optionBadge, badge]}>
                    {isPicked && (
                      <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                    )}
                    <Text style={[styles.optionLetter, { color: isPicked ? '#1C3214' : '#6B7C66' }]}>{LETTER(i)}</Text>
                  </View>
                  <Text style={[styles.optionText, { color: isPicked ? '#1C3214' : C.ink }]}>{opt}</Text>
                </Pressable>
              )
            })}
          </View>

          {/* Harakat */}
          <Pressable
            onPress={next}
            disabled={picked === null}
            style={({ pressed }) => [
              styles.action,
              picked === null ? styles.actionIdle : [LIME_BTN, { overflow: 'hidden' }],
              pressed && picked !== null && { transform: [{ scale: 0.985 }] },
            ]}
          >
            {picked !== null && (
              <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
            )}
            <Text style={[styles.actionText, picked === null ? { color: '#9AA995' } : LIME_TEXT]}>
              {isLast ? "Natijani ko'rish" : 'Keyingi masala'}
            </Text>
            {picked !== null && <Ionicons name="chevron-forward" size={16} color="#1C3214" />}
          </Pressable>

          <Text style={styles.tally}>To&apos;g&apos;ri javoblar va coin to&apos;plam oxirida hisoblanadi.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },

  backEmpty: { ...CARD, height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  backEmptyText: { fontSize: 13, fontWeight: '600', color: C.ink },

  lockTile: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF1DC',
    borderColor: 'rgba(232,163,61,0.4)',
    borderWidth: 1,
    borderRadius: 16,
  },
  lockTitle: { fontSize: 16, fontWeight: '600', color: C.ink, textAlign: 'center' },
  lockMeta: { fontSize: 12.5, fontWeight: '500', color: '#6B7C66', textAlign: 'center' },
  lockCta: { marginTop: 8, height: 46, paddingHorizontal: 24, overflow: 'hidden' },
  lockCtaText: { fontSize: 13.5 },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 },
  counter: { fontSize: 12, fontWeight: '600', color: C.ink2 },
  ticks: { flex: 1, flexDirection: 'row', gap: 6 },
  tick: { flex: 1, height: 5, borderRadius: 3 },

  stage: { paddingHorizontal: 16, marginTop: 12 },

  qCard: { borderRadius: 16, overflow: 'hidden', flexDirection: 'row', ...{ shadowColor: C.ink, shadowOpacity: 0.06, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 2 } },
  qRail: { width: 5 },
  qBody: { flex: 1, paddingLeft: 15, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  qKicker: { fontSize: 11.5, fontWeight: '500', color: '#6B7C66' },
  qPrompt: { marginTop: 8, fontFamily: MATH_FONT, fontWeight: '400', fontSize: 17, lineHeight: 25, color: C.ink },

  options: { marginTop: 16, gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 14 },
  optionBadge: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  optionLetter: { fontSize: 12, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 14.5, lineHeight: 20, fontWeight: '500' },

  action: { marginTop: 20, height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionIdle: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  actionText: { fontSize: 14.5, fontWeight: '600' },
  tally: { marginTop: 12, fontSize: 11.5, fontWeight: '500', color: '#9AA995', textAlign: 'center' },
})

export default ProblemSetScreen
