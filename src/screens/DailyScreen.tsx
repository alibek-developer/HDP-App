import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { DAILY_QUESTION_REWARD } from '../data/content'
import { difficultyLabel } from '../lib/daily'
import { DAILY_SET_SIZE, useDailySet } from '../lib/useDailySet'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { MidnightClock } from '../components/MidnightClock'
import { NUM, TICK, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { CARD, GRAD_RAIL } from '../theme/solver'
import { AnswerOption, QuestionStage, SolveAction, SolveActionBar } from '../components/SolveKit'

/**
 * Kunlik to'plam — o'rgangan mavzular bo'ylab 10 ta savol.
 * Har bir javob o'zicha qayd etiladi; to'g'ri javob DAILY_QUESTION_REWARD beradi.
 */

const LETTER = ['A', 'B', 'C', 'D']

/** Manba bo'yicha yorliq va ikonka — ekranda aynan shu manba ko'rsatiladi */
const SOURCE: Record<
  'ai' | 'gen' | 'bank',
  { icon: 'sparkles' | 'calculator-outline' | 'library-outline'; pill: string; sheet: string }
> = {
  ai: { icon: 'sparkles', pill: 'AI · sizning mavzularingizdan', sheet: 'AI tuzgan savol' },
  gen: { icon: 'calculator-outline', pill: 'Kunlik mashq · ilovada tuzilgan', sheet: 'Ilovada tuzilgan savol' },
  bank: { icon: 'library-outline', pill: 'Mavzu testidan', sheet: 'Mavzu testidan olingan savol' },
}

const diffTones = (C: ThemeColors): Record<string, { fg: string; bg: string }> => ({
  oson: { fg: C.limeDeep, bg: C.leafTint },
  "o'rta": { fg: C.coin, bg: C.coinSoft },
  qiyin: { fg: C.danger, bg: C.dangerSoft },
})

const DailyScreen = () => {
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')

  const { questions, status, plan } = useDailySet()
  const answerDailySetQuestion = useApp(s => s.answerDailySetQuestion)
  const coin = useApp(s => s.coin)
  const streak = useApp(s => s.streak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const beginSession = useApp(s => s.beginSession)

  const C = useColors()
  const s = makeStyles(C)

  const [picked, setPicked] = useState<number | null>(null)
  /** javob berilgach — shu savolning natijasi ko'rinadigan indeks; null — birinchi javobsiz */
  const [viewIdx, setViewIdx] = useState<number | null>(null)

  useEffect(() => {
    beginSession()
  }, [beginSession])

  const total = questions.length
  const answeredCount = questions.filter(q => q.picked !== null).length
  const done = total > 0 && answeredCount === total
  const firstOpen = questions.findIndex(q => q.picked === null)
  const idx = viewIdx ?? (firstOpen === -1 ? Math.max(0, total - 1) : firstOpen)
  const question = questions[idx] ?? null
  const position = Math.min(idx + 1, total)

  const correctCount = useMemo(
    () => questions.reduce((n, q) => n + (q.picked !== null && q.picked === q.correct ? 1 : 0), 0),
    [questions],
  )

  /** savol o'zgarganda tanlovni tozalash */
  useEffect(() => {
    setPicked(null)
  }, [idx])

  const answered = question ? question.picked !== null : false
  const chosen = answered ? question?.picked ?? null : picked
  const ok = answered && question ? chosen === question.correct : false
  const diff = question ? diffTones(C)[question.difficulty] ?? diffTones(C)["o'rta"] : null

  const submit = () => {
    if (picked === null || !question) return
    answerDailySetQuestion(idx, picked)
    setViewIdx(idx)
    triggerHaptic(picked === question.correct ? 'success' : 'error')
  }

  const next = () => {
    triggerHaptic('light')
    setViewIdx(null)
  }

  const progress = total ? Math.round((answeredCount / total) * 100) : 0

  return (
    <View style={[s.screen, { paddingTop: insets.top + 8 }]}>
      <View style={s.head}>
        <Pressable
          onPress={exit}
          accessibilityLabel="Orqaga"
          hitSlop={10}
          style={({ pressed }) => [s.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
        >
          <Ionicons name="chevron-back" size={18} color={C.ink2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.headKicker}>Kunlik to'plam</Text>
          {total > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: C.line, overflow: 'hidden' }}>
                <View style={{ width: `${progress}%`, height: '100%', borderRadius: 2, backgroundColor: C.limeDeep }} />
              </View>
              <Text style={[s.clockText, NUM]}>{position}/{total}</Text>
            </View>
          )}
        </View>
        <View style={s.clockChip}>
          <Ionicons name="time-outline" size={12} color={C.ink4} />
          <MidnightClock style={[s.clockText, NUM]} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.body, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Mavzu / daraja / manba */}
        <View style={s.metaRow}>
          <View style={s.topicChip}>
            <Ionicons name="school-outline" size={12} color={C.brand} />
            <Text style={s.topicText} numberOfLines={1}>
              {question
                ? question.topic
                : plan.topics.map(t => t.title).join(', ')}
            </Text>
          </View>
          {question && diff && (
            <View style={[s.diffChip, { backgroundColor: diff.bg }]}>
              <Text style={[s.diffText, { color: diff.fg }]}>{difficultyLabel(question.difficulty)}</Text>
            </View>
          )}
        </View>

        {!question && status !== 'error' && (
          <View style={[CARD, s.promptCard]}>
            <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.rail} />
            <View style={s.loadingWrap}>
              <ActivityIndicator color={C.brand} />
              <Text style={s.loadingTitle}>To'plam tayyorlanmoqda…</Text>
              <Text style={s.loadingSub}>
                {DAILY_SET_SIZE} ta savol — o'rgangan mavzularingiz asosida
              </Text>
            </View>
          </View>
        )}

        {!question && status === 'error' && (
          <View style={[CARD, s.promptCard]}>
            <View style={s.loadingWrap}>
              <Ionicons name="cloud-offline-outline" size={26} color={C.ink3} />
              <Text style={s.loadingTitle}>Savollarni yuklab bo'lmadi</Text>
              <Text style={s.loadingSub}>Ilovani qayta oching</Text>
            </View>
          </View>
        )}

        {done && total > 0 && (
          <View style={[CARD, s.resultCard]}>
            <View style={[s.resultRail, { backgroundColor: correctCount >= total / 2 ? TICK.ok : C.coin }]} />
            <View style={s.resultBody}>
              <View style={s.resultHead}>
                <View style={s.resultHeadText}>
                  <Text style={s.resultKicker}>Kunlik to'plam natijasi</Text>
                  <Text style={s.resultTitle}>{correctCount}/{total} to'g'ri</Text>
                </View>
                <View style={s.scoreWrap}>
                  <Text style={[s.score, NUM]}>{correctCount}</Text>
                  <Text style={[s.scoreTotal, NUM]}>/{total}</Text>
                </View>
              </View>

              <View style={s.tickRow}>
                <View style={[s.tick, { backgroundColor: correctCount >= total / 2 ? TICK.ok : C.coin }]} />
              </View>

              <View style={s.tickFoot}>
                <Text style={[s.percent, NUM, { color: correctCount >= total / 2 ? TICK.ok : '#B87A22' }]}>
                  {correctCount === total ? "Ajoyib! Barcha savollar to'g'ri" : correctCount >= total / 2 ? 'Yaxshi natija' : "Davom eting — mashq qiling"}
                </Text>
                <Text style={s.claimedNote}>ertaga yangi to'plam</Text>
              </View>

              <View style={s.ledger}>
                {[
                  { v: `+${correctCount * DAILY_QUESTION_REWARD.coin}`, u: 'coin', c: '#B87A22' },
                  { v: `+${correctCount * DAILY_QUESTION_REWARD.xp}`, u: 'XP', c: '#3560C4' },
                  { v: coin.toLocaleString('en-US'), u: 'hamyonda', c: C.ink },
                ].map((cell, i) => (
                  <View key={cell.u} style={s.ledgerCell}>
                    {i > 0 && <View style={s.ledgerDivider} />}
                    <View style={s.ledgerInner}>
                      <Text style={[s.ledgerValue, NUM, { color: cell.c }]}>{cell.v}</Text>
                      <Text style={s.ledgerUnit}>{cell.u}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={s.overallRow}>
                <View style={s.overallCell}>
                  <Text style={[s.overallValue, NUM]}>{streak}</Text>
                  <Text style={s.overallUnit}>kun ketma-ket</Text>
                </View>
                <View style={s.overallDivider} />
                <View style={s.overallCell}>
                  <Text style={[s.overallValue, NUM]}>{solvedCount}</Text>
                  <Text style={s.overallUnit}>jami yechilgan</Text>
                </View>
                <View style={s.overallDivider} />
                <View style={s.overallCell}>
                  <Text style={[s.overallValue, NUM]}>{solvedToday}</Text>
                  <Text style={s.overallUnit}>bugun</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {!done && question && (
          <>
            <QuestionStage
              prompt={question.prompt}
              badge={
                <View style={s.sourcePill}>
                  <Ionicons name={SOURCE[question.source].icon} size={12} color={C.brand} />
                  <Text style={s.sourceText}>{SOURCE[question.source].pill}</Text>
                </View>
              }
            />

            {/* To'g'rilik ko'rsatilmaydi: faqat tanlov belgilanadi */}
            <View style={s.options}>
              {question.options.map((option, i) => (
                <AnswerOption
                  key={i}
                  letter={LETTER[i]}
                  label={option}
                  state={i === (answered ? chosen : picked) ? 'selected' : 'idle'}
                  disabled={answered}
                  onPress={() => { triggerHaptic('selection'); setPicked(i) }}
                />
              ))}
            </View>

            {answered && question && (
              <View style={[CARD, s.resultCard]}>
                <View style={[s.resultRail, { backgroundColor: ok ? TICK.ok : C.coin }]} />
                <View style={s.resultBody}>
                  <View style={s.resultHead}>
                    <View style={s.resultHeadText}>
                      <Text style={s.resultKicker}>Savol {position} natijasi</Text>
                      <Text style={s.resultTitle} numberOfLines={1}>{question.topic}</Text>
                    </View>
                    <View style={s.scoreWrap}>
                      <Text style={[s.score, NUM]}>{ok ? 1 : 0}</Text>
                      <Text style={[s.scoreTotal, NUM]}>/1</Text>
                    </View>
                  </View>

                  <View style={s.tickRow}>
                    <View style={[s.tick, { backgroundColor: ok ? TICK.ok : C.coin }]} />
                  </View>

                  <View style={s.tickFoot}>
                    <Text style={[s.percent, NUM, { color: ok ? TICK.ok : '#B87A22' }]}>
                      {ok ? "To'g'ri javob berdingiz" : "Bu safar xato"}
                    </Text>
                    <Text style={s.claimedNote}>
                      {ok ? `+${DAILY_QUESTION_REWARD.coin} coin · +${DAILY_QUESTION_REWARD.xp} XP` : "Keyingi savolga o'ting"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {!done && question && (
        <SolveActionBar
          note={answered ? undefined : `${DAILY_SET_SIZE - answeredCount} ta savol qoldi · javob bir marta qabul qilinadi`}
          bottom={insets.bottom}
        >
          {answered ? (
            <SolveAction
              label="Keyingi"
              tone="lime"
              icon="next"
              onPress={next}
            />
          ) : (
            <SolveAction
              label="Tekshirish"
              icon="check"
              disabled={picked === null}
              onPress={submit}
            />
          )}
        </SolveActionBar>
      )}

      {done && (
        <SolveActionBar note=" ertaga yangi to'plam" bottom={insets.bottom}>
          <SolveAction
            label="Yopish"
            tone="ink"
            icon="none"
            onPress={() => { triggerHaptic('light'); exit() }}
          />
        </SolveActionBar>
      )}
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },

  head: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: C.line,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 12,
  },
  headKicker: { fontSize: 12.5, fontWeight: '600', color: C.ink2 },
  clockChip: {
    height: 30, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 10,
  },
  clockText: { fontSize: 12, fontWeight: '600', color: C.ink2 },

  body: { paddingHorizontal: 16, paddingTop: 14 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  topicChip: {
    flexShrink: 1, height: 28, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.leafTint, borderRadius: 9,
  },
  topicText: { flexShrink: 1, fontSize: 11.5, fontWeight: '600', color: C.brand },
  diffChip: { height: 28, paddingHorizontal: 10, borderRadius: 9, justifyContent: 'center' },
  diffText: { fontSize: 11.5, fontWeight: '600' },

  sourcePill: {
    alignSelf: 'flex-start', height: 24, marginBottom: 10, paddingHorizontal: 8,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.leafTint, borderRadius: 8,
  },
  sourceText: { fontSize: 10.5, fontWeight: '600', color: C.brand, letterSpacing: 0.2 },

  loadingWrap: { alignItems: 'center', gap: 8, paddingVertical: 22, paddingLeft: 4 },
  loadingTitle: { fontSize: 14, fontWeight: '600', color: C.ink },
  loadingSub: { fontSize: 12, fontWeight: '500', color: C.ink3 },
  promptCard: { position: 'relative', overflow: 'hidden', borderRadius: 16, paddingLeft: 14, paddingRight: 14, paddingVertical: 14 },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },

  options: { marginTop: 16, gap: 10 },

  resultCard: { marginTop: 16, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', padding: 0 },
  resultRail: { width: 5 },
  resultBody: { flex: 1, paddingLeft: 15, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  resultHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  resultHeadText: { flex: 1 },
  resultKicker: { fontSize: 11.5, fontWeight: '500', color: C.ink4 },
  resultTitle: { marginTop: 6, fontSize: 14, fontWeight: '600', color: C.ink },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontSize: 30, lineHeight: 30, fontWeight: '600', color: C.ink },
  scoreTotal: { fontSize: 16, fontWeight: '600', color: C.ink4 },
  tickRow: { marginTop: 14 },
  tick: { height: 6, borderRadius: 3 },
  tickFoot: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  percent: { fontSize: 11.5, fontWeight: '600' },
  claimedNote: { fontSize: 11, fontWeight: '500', color: C.ink4 },

  ledger: { marginTop: 14, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 12 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: C.line },
  ledgerInner: { flex: 1, alignItems: 'center' },
  ledgerValue: { fontSize: 16, lineHeight: 16, fontWeight: '600' },
  ledgerUnit: { marginTop: 5, fontSize: 10.5, fontWeight: '500', color: C.ink4 },

  overallRow: { marginTop: 12, flexDirection: 'row', alignItems: 'stretch', backgroundColor: C.surface2, borderRadius: 10, paddingVertical: 9 },
  overallCell: { flex: 1, alignItems: 'center' },
  overallValue: { fontSize: 14, lineHeight: 15, fontWeight: '600', color: C.ink2 },
  overallUnit: { marginTop: 4, fontSize: 10, fontWeight: '500', color: C.ink4 },
  overallDivider: { width: 1, backgroundColor: C.line, marginVertical: 4 },
})

export default DailyScreen
