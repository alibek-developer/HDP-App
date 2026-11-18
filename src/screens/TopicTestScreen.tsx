import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { findTopic } from '../data/curriculum'
import type { SessionResult } from '../store/useStore'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExitToTopics } from '../lib/nav'
import type { RootStackParamList } from '../navigation/types'
import { C } from '../theme/tokens'
import { LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'
import { AnswerOption, QuestionStage, SolveAction, SolveActionBar, SolveProgress, SolveTopBar } from '../components/SolveKit'

/**
 * Mavzu yakuniy testi — 30 savol, har to'g'ri javob testning own narxida.
 * Zanjir qoidasi: barcha bo'limlar tugamagan bo'lsa testga kirilmaydi.
 */

const LETTER = (i: number) => String.fromCharCode(65 + i)
const RAIL_COLS = 15

type Nav = NativeStackNavigationProp<RootStackParamList>
type Answer = SessionResult['answers'][number]

const TopicTestScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'TopicTest'>>()
  const topicNum = route.params.topicNum
  const entry = findTopic(topicNum)
  const exit = useExitToTopics(topicNum)

  const canEnter = useApp(s => s.canEnterTopicTest)
  /** Oldingi eng yaxshi natija — faqat undan oshgan savollar to'lanadi */
  const bestScore = useApp(s => s.topicTests[topicNum]?.score ?? 0)
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

  const lessons = entry?.lessons ?? []
  const test = entry?.test
  const pass = entry?.pass ?? 0
  const doneCount = lessons.filter(l => topicLessons[l.id]?.done).length

  if (!entry || !test) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <Text style={styles.gateTitle}>Test topilmadi</Text>
          <Pressable onPress={exit} style={({ pressed }) => [styles.gateBtn, LIME_BTN, pressed && { transform: [{ scale: 0.97 }] }]}>
            <Text style={[styles.gateBtnText, LIME_TEXT]}>Mavzuga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  if (!canEnter(topicNum)) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIcon}>
            <Ionicons name="lock-closed" size={24} color="#9AA995" />
          </View>
          <Text style={styles.gateTitle}>Yakuniy test hali yopiq</Text>
          <Text style={styles.gateSub}>
            Avval {lessons.length} ta bo&apos;limni yakunlang — {doneCount} tasi tugadi.
          </Text>
          <Pressable
            onPress={() => {
              triggerHaptic('medium')
              exit()
            }}
            style={({ pressed }) => [styles.gateBtn, LIME_BTN, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <Text style={[styles.gateBtnText, LIME_TEXT]}>Mavzularga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const total = test.questions.length
  const question = test.questions[cursor]
  const isLast = cursor === total - 1

  const choose = (i: number) => {
    if (checked) return
    triggerHaptic('selection')
    setPicked(i)
  }

  const confirm = () => {
    if (picked === null) return
    const ok = picked === question.correct
    triggerHaptic('light')
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
    finishTopicTest(topicNum, {
      kind: 'topic-test',
      refId: test.id,
      title: test.title,
      answers: all,
      coinsEarned: ok * test.coinPerSolve,
      xpEarned: ok * test.xpPerSolve,
    })
    triggerHaptic(ok >= pass ? 'success' : 'warning')
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

  return (
    <View style={styles.screen}>
      {/* Yuqori chegara: progress qotirilgan, savollar ostidan siljiydi */}
      <SolveTopBar style={{ paddingTop: insets.top + 10 }}>
        <SolveProgress
          total={total}
          current={cursor}
          columns={RAIL_COLS}
          label={`Mavzu ${topicNum} · yakuniy test`}
        />
      </SolveTopBar>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {bestScore > 0 && (
          <Text style={styles.replayNote}>
            Avvalgi eng yaxshi natija: {bestScore}/{total} — faqat shundan oshgan javoblar to&apos;lanadi
          </Text>
        )}

        <View style={styles.stage}>
          <QuestionStage prompt={question.prompt} />

          {/* Variantlar: tanlov ko'rinadi, to'g'rilik ko'rinmaydi */}
          <View style={styles.options}>
            {question.options.map((opt, i) => (
              <AnswerOption
                key={i}
                letter={LETTER(i)}
                label={opt}
                state={picked === i ? 'selected' : 'idle'}
                disabled={checked}
                onPress={() => choose(i)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <SolveActionBar
        note={`O'tish uchun ${pass}/${total} ta to'g'ri javob kerak`}
        bottom={insets.bottom}
      >
        <SolveAction
          label={!checked ? 'Tekshirish' : isLast ? "Natijani ko'rish" : 'Keyingi savol'}
          tone={checked ? 'lime' : 'ink'}
          icon={checked ? 'next' : 'check'}
          disabled={!checked && picked === null}
          onPress={checked ? next : confirm}
        />
      </SolveActionBar>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },

  gate: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  gateIcon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFCF8', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 16 },
  gateTitle: { fontSize: 16, fontWeight: '600', color: C.ink, textAlign: 'center' },
  gateSub: { fontSize: 12.5, lineHeight: 19, textAlign: 'center', fontWeight: '500', color: '#6B7C66' },
  gateBtn: { marginTop: 8, height: 46, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  gateBtnText: { fontSize: 13.5 },

  replayNote: { marginTop: 14, paddingHorizontal: 16, fontSize: 11, lineHeight: 16, fontWeight: '500', color: '#9AA995' },

  stage: { paddingHorizontal: 16, marginTop: 14 },
  options: { marginTop: 16, gap: 10 },
})

export default TopicTestScreen
