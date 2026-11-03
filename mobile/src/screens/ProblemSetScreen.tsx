import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import type { SessionResult } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { findProblemSet } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { CARD, GRAD_LIME, GRAD_RAIL, LIME_BTN, LIME_TEXT, SOLVER_BODY } from '../theme/solver'

/**
 * To'plam ichida yechish — Masalalar oilasining «davotar» tili.
 * Har to'g'ri javob uchun to'plamning coinPerSolve qiymati beriladi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const TICK: Record<'ok' | 'bad' | 'current' | 'todo', string> = {
  ok: '#5FAF22',
  bad: '#D9534F',
  current: '#0E1A12',
  todo: '#E1E7DA',
}

const LETTER = (i: number) => String.fromCharCode(65 + i)

const ProblemSetScreen = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'ProblemSet'>>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Problems')

  const setId = String(route.params.setId)
  const set = findProblemSet(setId)

  const canOpenSet = useApp(s => s.canOpenSet)
  const finishProblemSet = useApp(s => s.finishProblemSet)
  const beginSession = useApp(s => s.beginSession)

  const [cursor, setCursor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
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
    if (checked) return
    triggerHaptic('selection')
    setPicked(i)
  }

  const confirm = () => {
    if (picked === null) return
    const ok = picked === question.correct
    triggerHaptic(ok ? 'success' : 'error')
    setChecked(true)
    setAnswers(prev => [
      ...prev,
      {
        prompt: question.prompt,
        picked,
        correct: question.correct,
        options: question.options,
        explain: question.explain,
        ok,
      },
    ])
  }

  const finish = (all: SessionResult['answers']) => {
    if (finished.current) return
    finished.current = true
    const ok = all.filter(a => a.ok).length
    /** Streak rejimi: hammasi to'g'ri bo'lsa mukofot ikkilanadi */
    const mult = set.perfectBonus && ok === all.length ? 2 : 1
    finishProblemSet(set.id, {
      kind: 'problem-set',
      refId: set.id,
      title: set.title,
      answers: all,
      coinsEarned: ok * set.coinPerSolve * mult,
      xpEarned: ok * set.xpPerSolve * mult,
    })
    triggerHaptic('success')
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
  const earned = answers.filter(a => a.ok).length * set.coinPerSolve
  const rightCount = answers.filter(a => a.ok).length

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Juda ixcham holat chizig'i: chiqish + hisob + davotar chiziqlari + mukofot ── */}
        <View style={styles.statusRow}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Chiqish"
            style={({ pressed }) => [styles.exitBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          >
            <Ionicons name="close" size={14} color="#6B7C66" />
          </Pressable>
          <Text style={[styles.counter, NUM]}>{cursor + 1}/{total}</Text>

          <View style={styles.ticks}>
            {set.questions.map((_, i) => {
              const a = answers[i]
              const state = a ? (a.ok ? 'ok' : 'bad') : i === cursor ? 'current' : 'todo'
              return (
                <View key={i} style={[styles.tick, { backgroundColor: TICK[state] }]} />
              )
            })}
          </View>

          <View style={styles.rewardRow}>
            <Ionicons name="cash" size={12} color="#E8A33D" />
            <Text style={[styles.rewardText, NUM]}>+{set.coinPerSolve}</Text>
            {!!set.perfectBonus && <Text style={[styles.rewardText, NUM, { color: '#5FAF22' }]}>·2x</Text>}
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

          {/* Javob variantlari */}
          <View style={styles.options}>
            {question.options.map((opt, i) => {
              const isPicked = picked === i
              const isCorrect = question.correct === i
              let row: ViewStyle = { ...CARD }
              let color: string = C.ink
              let badge: ViewStyle = { backgroundColor: '#F6F8F3', borderColor: '#E1E7DA', borderWidth: 1 }
              let badgeColor = '#6B7C66'
              let badgeGrad: readonly [string, string] | null = null

              if (!checked) {
                if (isPicked) {
                  row = { backgroundColor: '#EDF7DE', borderColor: '#7ED321', borderWidth: 1.5, borderRadius: 14 }
                  color = '#1C3214'
                  badge = { backgroundColor: '#7ED321', borderRadius: 9, overflow: 'hidden' }
                  badgeColor = '#1C3214'
                  badgeGrad = GRAD_LIME
                }
              } else if (isCorrect) {
                row = { backgroundColor: '#DDF3DC', borderColor: '#5FAF22', borderWidth: 1.5, borderRadius: 14 }
                color = '#0B4A34'
                badge = { backgroundColor: '#5FAF22', borderRadius: 9 }
                badgeColor = '#FFFFFF'
              } else if (isPicked) {
                row = { backgroundColor: '#FBE9E7', borderColor: '#D9534F', borderWidth: 1.5, borderRadius: 14 }
                color = '#8C2F2C'
                badge = { backgroundColor: '#D9534F', borderRadius: 9 }
                badgeColor = '#FFFFFF'
              } else {
                color = '#9AA995'
              }

              return (
                <Pressable
                  key={i}
                  onPress={() => choose(i)}
                  disabled={checked}
                  style={({ pressed }) => [styles.option, row, pressed && !checked && { transform: [{ scale: 0.99 }] }]}
                >
                  <View style={[styles.optionBadge, badge]}>
                    {!!badgeGrad && <LinearGradient colors={badgeGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />}
                    <Text style={[styles.optionLetter, { color: badgeColor }]}>{LETTER(i)}</Text>
                  </View>
                  <Text style={[styles.optionText, { color }]}>{opt}</Text>
                  {checked && isCorrect && <Ionicons name="checkmark" size={16} color="#5FAF22" />}
                  {checked && isPicked && !isCorrect && <Ionicons name="close" size={16} color="#D9534F" />}
                </Pressable>
              )
            })}
          </View>

          {/* Tushuntirish */}
          {checked && (
            <View style={[styles.explain, CARD, { backgroundColor: '#FBFCF8' }]}>
              <View style={[styles.explainRail, { backgroundColor: isRight ? '#5FAF22' : '#E8A33D' }]} />
              <View style={styles.explainBody}>
                <View style={styles.explainHead}>
                  <Text style={[styles.explainKicker, { color: isRight ? '#0B6E4F' : '#B87A22' }]}>
                    {isRight ? 'Yechildi' : 'Xato javob'}
                  </Text>
                  <Text style={[styles.explainCoin, NUM, { color: isRight ? '#B87A22' : '#9AA995' }]}>
                    {isRight ? `+${set.coinPerSolve} coin` : '+0 coin'}
                  </Text>
                </View>
                <Text style={styles.explainText}>{question.explain}</Text>
              </View>
            </View>
          )}

          {/* Harakat */}
          <Pressable
            onPress={checked ? next : confirm}
            disabled={!checked && picked === null}
            style={({ pressed }) => [
              styles.action,
              !checked && picked === null
                ? styles.actionIdle
                : checked
                  ? [LIME_BTN, { overflow: 'hidden' }]
                  : { backgroundColor: '#0E1A12', borderRadius: 12 },
              pressed && { transform: [{ scale: 0.985 }] },
            ]}
          >
            {!checked && picked === null ? null : checked ? (
              <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
            ) : null}
            <Text
              style={[
                styles.actionText,
                !checked && picked === null
                  ? { color: '#9AA995' }
                  : checked
                    ? LIME_TEXT
                    : { color: '#CDE9AE', fontWeight: '800' },
              ]}
            >
              {!checked ? 'Tekshirish' : isLast ? "Natijani ko'rish" : 'Keyingi masala'}
            </Text>
            {checked && <Ionicons name="chevron-forward" size={16} color="#1C3214" />}
          </Pressable>

          <Text style={[styles.tally, NUM]}>
            {rightCount} ta to'g'ri · {earned} coin yig'ildi
          </Text>
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
  backEmptyText: { fontSize: 13, fontWeight: '800', color: C.ink },

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
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardText: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },

  stage: { paddingHorizontal: 16, marginTop: 12 },

  qCard: { borderRadius: 16, overflow: 'hidden', flexDirection: 'row', ...{ shadowColor: C.ink, shadowOpacity: 0.06, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 2 } },
  qRail: { width: 5 },
  qBody: { flex: 1, paddingLeft: 15, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  qKicker: { fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  qPrompt: { marginTop: 8, fontSize: 17, lineHeight: 24, fontWeight: '600', color: C.ink },

  options: { marginTop: 16, gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 14 },
  optionBadge: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  optionLetter: { fontSize: 12, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 14.5, lineHeight: 20, fontWeight: '600' },

  explain: { marginTop: 16, borderRadius: 14, overflow: 'hidden', flexDirection: 'row' },
  explainRail: { width: 4 },
  explainBody: { flex: 1, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  explainHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  explainKicker: { fontSize: 12, letterSpacing: 0.96, textTransform: 'uppercase', fontWeight: '800' },
  explainCoin: { fontSize: 12, fontWeight: '800' },
  explainText: { marginTop: 8, fontSize: 13.5, lineHeight: 20, color: C.ink2 },

  action: { marginTop: 20, height: 52, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionIdle: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  actionText: { fontSize: 14.5, fontWeight: '800' },
  tally: { marginTop: 12, fontSize: 11.5, fontWeight: '700', color: '#9AA995', textAlign: 'center' },
})

export default ProblemSetScreen
