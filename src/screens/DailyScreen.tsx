import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
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
import { DAILY_BONUS } from '../data/content'
import { difficultyLabel } from '../lib/daily'
import { useDailyQuestion } from '../lib/useDailyQuestion'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { MidnightClock } from '../components/MidnightClock'
import { C, NUM, TICK } from '../theme/tokens'
import { CARD, GRAD_RAIL, LIME_TEXT, SOLVER_BODY } from '../theme/solver'
import { AnswerOption, QuestionStage, SolveAction, SolveActionBar } from '../components/SolveKit'

/**
 * Kunlik masala — o'quvchi o'rgangan mavzulardan AI tuzgan bitta savol.
 * Javob kuniga bir marta qabul qilinadi; to'g'ri javob DAILY_BONUS beradi.
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

const DIFF_COLOR: Record<string, { fg: string; bg: string }> = {
  oson: { fg: '#3F7A16', bg: '#EAF7DC' },
  "o'rta": { fg: '#9A640F', bg: '#FCF1DC' },
  qiyin: { fg: '#A93A31', bg: '#FBE9E7' },
}

const DailyScreen = () => {
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')

  const { question, status, plan, reload } = useDailyQuestion()
  const answerDailyQuestion = useApp(s => s.answerDailyQuestion)
  const coin = useApp(s => s.coin)
  const streak = useApp(s => s.streak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const beginSession = useApp(s => s.beginSession)

  const [picked, setPicked] = useState<number | null>(null)
  const [sourceOpen, setSourceOpen] = useState(false)

  useEffect(() => {
    beginSession()
  }, [beginSession])

  const answered = question?.picked !== null && question?.picked !== undefined
  const chosen = answered ? question?.picked ?? null : picked
  const ok = answered && question ? chosen === question.correct : false
  const diff = question ? DIFF_COLOR[question.difficulty] ?? DIFF_COLOR["o'rta"] : null

  const submit = () => {
    if (picked === null || !question) return
    answerDailyQuestion(picked)
    triggerHaptic(picked === question.correct ? 'success' : 'error')
  }

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
        <Text style={s.headKicker}>Kunlik masala</Text>
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
              <Text style={s.loadingTitle}>Savol tayyorlanmoqda…</Text>
              <Text style={s.loadingSub}>
                O&apos;rgangan mavzularingiz asosida tuzilyapti
              </Text>
            </View>
          </View>
        )}

        {!question && status === 'error' && (
          <View style={[CARD, s.promptCard]}>
            <View style={s.loadingWrap}>
              <Ionicons name="cloud-offline-outline" size={26} color={C.ink3} />
              <Text style={s.loadingTitle}>Savolni yuklab bo&apos;lmadi</Text>
              <Text style={s.loadingSub}>Internetni tekshirib, qayta urinib ko&apos;ring</Text>
              <Pressable
                onPress={() => { triggerHaptic('light'); reload() }}
                style={({ pressed }) => [s.retryBtn, pressed && { opacity: 0.85 }]}
              >
                <Ionicons name="refresh" size={15} color={C.inkOnLime} />
                <Text style={[s.retryText, LIME_TEXT]}>Qayta urinish</Text>
              </Pressable>
            </View>
          </View>
        )}

        {question && (
          <>
            <QuestionStage
              prompt={question.prompt}
              badge={
                <Pressable
                  onPress={() => { triggerHaptic('light'); setSourceOpen(true) }}
                  accessibilityRole="button"
                  accessibilityLabel="Savol manbasini ko'rish"
                  hitSlop={8}
                  style={({ pressed }) => [s.sourcePill, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name={SOURCE[question.source].icon} size={12} color={C.brand} />
                  <Text style={s.sourceText}>{SOURCE[question.source].pill}</Text>
                  <Ionicons name="chevron-forward" size={10} color={C.brand} />
                </Pressable>
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
                <View style={[s.resultRail, { backgroundColor: ok ? TICK.ok : '#E8A33D' }]} />
                <View style={s.resultBody}>
                  <View style={s.resultHead}>
                    <View style={s.resultHeadText}>
                      <Text style={s.resultKicker}>Kunlik masala natijasi</Text>
                      <Text style={s.resultTitle} numberOfLines={1}>{question.topic}</Text>
                    </View>
                    <View style={s.scoreWrap}>
                      <Text style={[s.score, NUM]}>{ok ? 1 : 0}</Text>
                      <Text style={[s.scoreTotal, NUM]}>/1</Text>
                    </View>
                  </View>

                  <View style={s.tickRow}>
                    <View style={[s.tick, { backgroundColor: ok ? TICK.ok : '#E8A33D' }]} />
                  </View>

                  <View style={s.tickFoot}>
                    <Text style={[s.percent, NUM, { color: ok ? TICK.ok : '#B87A22' }]}>
                      {ok ? "To'g'ri javob berdingiz" : "Bu safar xato"}
                    </Text>
                    <Text style={s.claimedNote}>
                      {ok ? 'bugun olindi' : 'ertaga yangi masala'}
                    </Text>
                  </View>

                  <View style={s.ledger}>
                    {[
                      { v: ok ? `+${DAILY_BONUS.coin}` : '+0', u: 'coin', c: '#B87A22' },
                      { v: ok ? `+${DAILY_BONUS.xp}` : '+0', u: 'XP', c: '#3560C4' },
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

          </>
        )}
      </ScrollView>

      {question && (
        <SolveActionBar
          note={answered ? undefined : 'Kuniga bitta masala — javob bir marta qabul qilinadi'}
          bottom={insets.bottom}
        >
          {answered ? (
            <SolveAction
              label="Yopish"
              tone="ink"
              icon="none"
              onPress={() => { triggerHaptic('light'); exit() }}
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

      <Modal
        visible={sourceOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSourceOpen(false)}
      >
        <View style={s.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSourceOpen(false)} />
          <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 14) + 6 }]}>
            <View style={s.grabber} />
            <Text style={s.sheetTitle}>Savol manbasi</Text>
            <View style={s.sheetSourceRow}>
              <Ionicons
                name={question ? SOURCE[question.source].icon : 'sparkles'}
                size={14}
                color={C.brand}
              />
              <Text style={s.sheetSourceText}>
                {question ? SOURCE[question.source].sheet : ''}
              </Text>
            </View>

            {question?.source === 'ai' && (
              <>
                <View style={s.factRow}>
                  <Ionicons name="layers-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>
                    Siz o&apos;rgangan {plan.topics.length} mavzu asosida tuzilgan.
                  </Text>
                </View>
                <View style={s.factRow}>
                  <Ionicons name="shield-checkmark-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>
                    Javob ikkinchi model bilan qayta yechib tekshirilgan — faqat mos kelgan savol
                    qabul qilinadi.
                  </Text>
                </View>
              </>
            )}

            {question?.source === 'gen' && (
              <>
                <View style={s.factRow}>
                  <Ionicons name="layers-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>
                    Siz o&apos;rgangan mavzu va darajangiz asosida ilova ichida tuzilgan.
                  </Text>
                </View>
                <View style={s.factRow}>
                  <Ionicons name="calculator-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>
                    Javob ilovada hisoblanadi — internet yoki AI javobiga bog&apos;liq emas.
                  </Text>
                </View>
              </>
            )}

            {question?.source === 'bank' && (
              <>
                <View style={s.factRow}>
                  <Ionicons name="library-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>
                    Savol o&apos;rgangan mavzuingiz testidan olingan.
                  </Text>
                </View>
                <View style={s.factRow}>
                  <Ionicons name="checkmark-done-outline" size={15} color={C.ink3} />
                  <Text style={s.factText}>Javob va izoh mavzu testida tekshirilgan.</Text>
                </View>
              </>
            )}

            <View style={s.chipWrap}>
              {question && <View style={s.chip}><Text style={s.chipText}>{difficultyLabel(question.difficulty)}</Text></View>}
              {plan.topics.map(t => (
                <View key={t.num} style={s.chip}>
                  <Text style={s.chipText} numberOfLines={1}>{t.title}</Text>
                </View>
              ))}
            </View>

            <View style={s.sheetActions}>
              <Pressable
                onPress={() => setSourceOpen(false)}
                style={({ pressed }) => [s.sheetBtn, s.sheetBtnGhost, pressed && { opacity: 0.8 }]}
              >
                <Text style={s.sheetBtnText}>Yopish</Text>
              </Pressable>
              {question && !answered && (
                <Pressable
                  onPress={() => {
                    triggerHaptic('light')
                    setSourceOpen(false)
                    reload()
                  }}
                  style={({ pressed }) => [s.sheetBtn, s.sheetBtnMain, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="refresh" size={14} color={C.inkOnLime} />
                  <Text style={[s.sheetBtnText, { color: C.inkOnLime }]}>Qayta so&apos;rash</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  scroll: { flex: 1 },

  head: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#E6EBE0',
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1, borderRadius: 12,
  },
  headKicker: { fontSize: 12.5, fontWeight: '600', color: C.ink2 },
  clockChip: {
    height: 30, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1, borderRadius: 10,
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
  retryBtn: {
    marginTop: 6, height: 40, paddingHorizontal: 16, borderRadius: 11, flexDirection: 'row',
    alignItems: 'center', gap: 7, backgroundColor: C.lime,
  },
  retryText: { fontSize: 13 },

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

  ledger: { marginTop: 14, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: 1, borderTopColor: '#EDF1E7', paddingTop: 12 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: '#EDF1E7' },
  ledgerInner: { flex: 1, alignItems: 'center' },
  ledgerValue: { fontSize: 16, lineHeight: 16, fontWeight: '600' },
  ledgerUnit: { marginTop: 5, fontSize: 10.5, fontWeight: '500', color: C.ink4 },

  overallRow: { marginTop: 12, flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#F7F9F3', borderRadius: 10, paddingVertical: 9 },
  overallCell: { flex: 1, alignItems: 'center' },
  overallValue: { fontSize: 14, lineHeight: 15, fontWeight: '600', color: C.ink2 },
  overallUnit: { marginTop: 4, fontSize: 10, fontWeight: '500', color: C.ink4 },
  overallDivider: { width: 1, backgroundColor: '#E3E9DB', marginVertical: 4 },

  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(14,24,18,0.36)' },
  sheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 18, paddingTop: 9,
  },
  grabber: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: '#DCE4D4', marginBottom: 13 },
  sheetTitle: { fontSize: 15, fontWeight: '700', color: C.ink },
  sheetSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  sheetSourceText: { fontSize: 12.5, fontWeight: '600', color: C.brand },
  factRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 11 },
  factText: { flex: 1, fontSize: 13, lineHeight: 18.5, fontWeight: '500', color: C.ink2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  chip: { maxWidth: '100%', height: 26, paddingHorizontal: 9, borderRadius: 8, backgroundColor: C.leafTint, justifyContent: 'center' },
  chipText: { flexShrink: 1, fontSize: 11.5, fontWeight: '600', color: C.brand },
  sheetActions: { flexDirection: 'row', gap: 8, marginTop: 18 },
  sheetBtn: {
    flex: 1, height: 46, borderRadius: 13, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 7,
  },
  sheetBtnGhost: { backgroundColor: '#F1F4EE', borderWidth: 1, borderColor: '#E1E7DA' },
  sheetBtnMain: { backgroundColor: C.lime },
  sheetBtnText: { fontSize: 13.5, fontWeight: '600', color: C.ink2 },
})

export default DailyScreen
