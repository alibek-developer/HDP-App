import { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { findLevel, drawLevelQuestions, STAR_THRESHOLDS } from '../data/problems'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C } from '../theme/tokens'
import { CARD, GRAD_LIME, LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'
import {
  AnswerOption,
  QuestionStage,
  SolveAction,
  SolveActionBar,
  SolveProgress,
  SolveTopBar,
} from '../components/SolveKit'

/**
 * To'plam ichida yechish — Masalalar oilasining «davotar» tili.
 * Har to'g'ri javob uchun to'plamning coinPerSolve qiymati beriladi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const LETTER = (i: number) => String.fromCharCode(65 + i)

const ProblemSetScreen = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'ProblemSet'>>()
  const insets = useSafeAreaInsets()
  const exit = useExitToTab('problems')

  const setId = String(route.params.setId)
  const set = findProblemSet(setId)
  /** Fan → daraja sessiyasi bo'lsa, maqsad chizig'i ko'rsatiladi */
  const level = findLevel(setId)
  /** Daraja banki 15 ta: har urinishda boshqa 10 ta savol olinadi */
  const questions = useMemo(
    () => (level && set ? drawLevelQuestions(level) : set?.questions ?? []),
    [level, set],
  )

  const canOpenSet = useApp(s => s.canOpenSet)
  const levelStars = useApp(s => s.levelStars)
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
          <Text style={styles.backEmptyText}>Masalalarga qaytish</Text>
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

  const total = questions.length
  const question = questions[cursor]
  const isLast = cursor === total - 1
  const earnedStars = level ? levelStars[set.id] ?? 0 : 0
  const nextGoal = level && earnedStars < 3 ? STAR_THRESHOLDS[earnedStars] : null

  const choose = (i: number) => {
    triggerHaptic('selection')
    setPicked(i)
  }

  const finish = (all: SessionResult['answers']) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    /** Faqat birinchi marta yechilgan savollar to'lanadi (savol id'si bilan) */
    const paidRight = all.filter(a => a.ok && a.qid && !solvedBefore.current.includes(a.qid)).length
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
        qid: question.id,
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
    <View style={styles.screen}>
      {/* Yuqori chegara: maqsad va progress qotirilgan, savollar ostidan siljiydi */}
      <SolveTopBar style={{ paddingTop: insets.top + 10 }}>
        {level && (
          <View style={styles.goalBar}>
            <Ionicons name="star" size={12} color="#B87A22" />
            <Text style={styles.goalBarText} numberOfLines={1}>
              {nextGoal
                ? `Maqsad: ${nextGoal} ta to‘g‘ri javob — ${earnedStars + 1} yulduz`
                : `Barcha yulduzlar to‘plangan — ${level.label.toLowerCase()} darajani mustahkamlash`}
            </Text>
            <View style={styles.goalStars}>
              {[0, 1, 2].map(i => (
                <Ionicons
                  key={i}
                  name={i < earnedStars ? 'star' : 'star-outline'}
                  size={11}
                  color={i < earnedStars ? '#E8A33D' : '#CFD9C6'}
                />
              ))}
            </View>
          </View>
        )}

        <SolveProgress
          total={total}
          current={cursor}
          label={set.title}
          style={level ? styles.progressUnderGoal : undefined}
        />
      </SolveTopBar>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.stage}>
          <QuestionStage prompt={question.prompt} />

          {/* Javob variantlari — tanlov ko'rinadi, to'g'rilik ko'rinmaydi */}
          <View style={styles.options}>
            {question.options.map((opt, i) => (
              <AnswerOption
                key={i}
                letter={LETTER(i)}
                label={opt}
                state={picked === i ? 'selected' : 'idle'}
                onPress={() => choose(i)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <SolveActionBar
        note={
          level
            ? "To‘g‘ri javoblar, coin va yulduzlar sessiya oxirida hisoblanadi."
            : "To‘g‘ri javoblar va coin to‘plam oxirida hisoblanadi."
        }
        bottom={insets.bottom}
      >
        <SolveAction
          label={isLast ? "Natijani ko'rish" : 'Keyingi masala'}
          icon={isLast ? 'check' : 'next'}
          disabled={picked === null}
          onPress={next}
        />
      </SolveActionBar>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
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

  goalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  goalBarText: { flex: 1, minWidth: 0, fontSize: 11.5, fontWeight: '500', color: '#6B7C66' },
  goalStars: { flexDirection: 'row', alignItems: 'center', gap: 1 },

  progressUnderGoal: { marginTop: 8 },
  stage: { paddingHorizontal: 16, marginTop: 16 },

  options: { marginTop: 16, gap: 10 },
})

export default ProblemSetScreen
