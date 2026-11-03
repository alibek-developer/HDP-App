import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { Reveal } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM, TICK } from '../theme/tokens'
import { CARD, GRAD_RAIL, LIME_BTN, OUT_BTN } from '../theme/solver'

/**
 * 1v1 Blitz — 30 soniyalik duel. Web'ning `BlitzScreen.tsx` ekvivalenti.
 * Raqib bot: har soniyada tasodifiy ochko qo'shadi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>
type Phase = 'lobby' | 'game' | 'result'

const QUESTIONS = [
  { q: '2x² − 8 = 0  →  x = ?', opts: ['±2', '±4', '2', '4'], correct: 0 },
  { q: 'log₂(32) = ?', opts: ['4', '5', '6', '8'], correct: 1 },
  { q: 'sin(90°) = ?', opts: ['0', '√2/2', '1', '−1'], correct: 2 },
  { q: '√196 = ?', opts: ['12', '13', '14', '16'], correct: 2 },
  { q: 'f(x) = x³  →  f′(x) = ?', opts: ['3x²', '2x', '3x', 'x²'], correct: 0 },
]

const TIME_LIMIT = 30
const COIN_PER_WIN = 5

const INK = '#0E1A12'
const GRAY = '#6B7C66'
const FAINT = '#9AA995'

const BlitzScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Home')
  const [phase, setPhase] = useState<Phase>('lobby')
  const [qIdx, setQIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [myScore, setMyScore] = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (phase !== 'game') return undefined
    const timer = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timer); setPhase('result'); return 0 }
        return p - 1
      })
      if (Math.random() > 0.65) setOppScore(s => s + 10)
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  useEffect(() => () => { if (advance.current) clearTimeout(advance.current) }, [])

  const handleAnswer = (i: number) => {
    if (answered) return
    setAnswered(true)
    const ok = i === QUESTIONS[qIdx].correct
    triggerHaptic(ok ? 'success' : 'error')
    setFlash(ok ? 'ok' : 'bad')
    if (ok) setMyScore(s => s + 10)
    advance.current = setTimeout(() => {
      setFlash(null)
      if (qIdx < QUESTIONS.length - 1) { setQIdx(q => q + 1); setAnswered(false) }
      else setPhase('result')
    }, 700)
  }

  /* ── Lobby ── */
  if (phase === 'lobby') {
    return (
      <View style={[s.screen, { paddingBottom: insets.bottom + 40 }]}>
        <View style={s.lobbyPad}>
          <View style={s.lobbyHead}>
            <Pressable
              onPress={exit}
              accessibilityLabel="Orqaga"
              style={({ pressed }) => [s.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              <Ionicons name="chevron-back" size={17} color="#33452F" />
            </Pressable>
            <Text style={s.lobbyKicker}>Duel</Text>
            <View style={s.headSpacer} />
          </View>

          <View style={s.mark}>
            <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[ABS_FILL, { borderRadius: 16 }]} />
            <Ionicons name="game-controller" size={26} color="#1C3214" style={s.markIcon} />
          </View>

          <Text style={s.h1}>1v1 Blitz</Text>
          <Text style={s.h1Sub}>
            {TIME_LIMIT} soniya ichida raqibdan ko'proq savolga to'g'ri javob bering.
          </Text>

          {/* Raqib */}
          <View style={s.rivalCard}>
            <View style={s.rivalRail} />
            <View style={s.rivalInner}>
              <View style={s.rivalAvatar}>
                <Text style={s.rivalAvatarText}>R</Text>
              </View>
              <View style={s.rivalMid}>
                <Text style={s.rivalTitle}>Raqib topildi</Text>
                <Text style={s.rivalSub}>
                  Matematika daraja 3 · <Text style={s.rivalStreak}>8 kunlik streak</Text>
                </Text>
              </View>
              <View style={s.rivalTag}>
                <Text style={[s.rivalTagText, NUM]}>Tayyor</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => { triggerHaptic('medium'); setPhase('game') }}
            style={({ pressed }) => [s.startBtn, pressed && { transform: [{ scale: 0.985 }] }]}
          >
            <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[ABS_FILL, { borderRadius: 12 }]} />
            <Text style={s.startText}>Boshlash</Text>
            <Ionicons name="chevron-forward" size={16} color="#1C3214" style={s.startIcon} />
          </Pressable>

          <Pressable
            onPress={() => { triggerHaptic('light'); navigation.navigate('Formulas') }}
            style={({ pressed }) => [s.reviseBtn, pressed && { opacity: 0.85 }]}
          >
            <View style={s.reviseTile}>
              <Ionicons name="book" size={15} color="#0B6E4F" />
            </View>
            <Text style={s.reviseText}>Formulalarni takrorlash</Text>
            <Ionicons name="chevron-forward" size={15} color={FAINT} />
          </Pressable>
        </View>
      </View>
    )
  }

  /* ── Result ── */
  if (phase === 'result') {
    const win = myScore > oppScore
    const draw = myScore === oppScore
    const tone = win ? TICK.ok : draw ? '#E8A33D' : TICK.bad
    const coins = win ? (myScore / 10) * COIN_PER_WIN : 0
    const reset = () => {
      triggerHaptic('medium')
      setPhase('lobby'); setMyScore(0); setOppScore(0); setQIdx(0); setTimeLeft(TIME_LIMIT); setAnswered(false)
    }

    const cells = [
      { v: String(myScore), u: 'siz', c: INK },
      { v: String(oppScore), u: 'raqib', c: GRAY },
      { v: coins > 0 ? `+${coins}` : '0', u: 'coin', c: '#B87A22' },
    ]

    return (
      <View style={[s.screen, s.centerWrap, { paddingBottom: insets.bottom + 40 }]}>
        <Reveal y={14} duration={360} style={s.resultCard}>
          <View style={[s.resultRail, { backgroundColor: tone }]} />
          <View style={s.resultInner}>
            <View style={s.resultHead}>
              {win && <Ionicons name="trophy" size={16} color="#B87A22" />}
              <Text style={s.resultKicker}>Blitz Duel natijasi</Text>
            </View>
            <Text style={s.resultH1}>{win ? "G'alaba!" : draw ? 'Durrang!' : 'Yutqazdingiz'}</Text>
            <Text style={s.resultSub}>
              {win
                ? "Ajoyib o'yin! Raqibni ortda qoldirdingiz."
                : draw
                  ? "Tengma-teng o'yin."
                  : "Keyingi safar raqibdan tezroq bo'ling."}
            </Text>

            <View style={s.scoreRow}>
              {cells.map((cell, i) => (
                <View key={cell.u} style={s.scoreCellWrap}>
                  {i > 0 && <View style={s.scoreDivider} />}
                  <View style={s.scoreCell}>
                    <Text style={[s.scoreValue, NUM, { color: cell.c }]}>{cell.v}</Text>
                    <Text style={s.scoreUnit}>{cell.u}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Reveal>

        <Pressable
          onPress={reset}
          style={({ pressed }) => [s.startBtn, s.againBtn, pressed && { transform: [{ scale: 0.985 }] }]}
        >
          <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[ABS_FILL, { borderRadius: 12 }]} />
          <Ionicons name="game-controller" size={16} color="#1C3214" style={s.startIcon} />
          <Text style={s.startText}>Qayta o'ynash</Text>
        </Pressable>
        <Pressable
          onPress={() => { triggerHaptic('light'); navigation.replace('Home') }}
          style={({ pressed }) => [s.homeBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.homeBtnText}>Asosiyga qaytish</Text>
        </Pressable>
      </View>
    )
  }

  /* ── Game ── */
  const q = QUESTIONS[qIdx]
  const urgent = timeLeft <= 10

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[s.gamePad, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hisob varaqasi: siz / raqib / taymer */}
      <View style={s.scoreboard}>
        <View style={s.scoreRow}>
          {[
            { v: String(myScore), u: 'siz', c: INK },
            { v: String(oppScore), u: 'raqib', c: GRAY },
          ].map((cell, i) => (
            <View key={cell.u} style={s.scoreCellWrap}>
              {i > 0 && <View style={s.scoreDivider} />}
              <View style={s.scoreCell}>
                <Text style={[s.scoreValueBig, NUM, { color: cell.c }]}>{cell.v}</Text>
                <Text style={s.scoreUnit}>{cell.u}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={s.scoreDivider} />
        <View style={s.timerWrap}>
          <View
            style={[
              s.timer,
              {
                backgroundColor: urgent ? '#FBE9E7' : '#F6F8F3',
                borderColor: urgent ? '#D9534F' : '#E1E7DA',
              },
            ]}
          >
            <Ionicons name="time" size={14} color={urgent ? TICK.bad : FAINT} />
            <Text style={[s.timerText, NUM, { color: urgent ? TICK.bad : INK }]}>{timeLeft}</Text>
          </View>
        </View>
      </View>

      {/* Savol bo'yicha holat chiziqlari */}
      <View style={s.rail}>
        {QUESTIONS.map((_, i) => (
          <View
            key={i}
            style={[
              s.railCell,
              { backgroundColor: i < qIdx ? TICK.current : i === qIdx ? '#7ED321' : TICK.todo },
            ]}
          />
        ))}
      </View>

      <Reveal key={qIdx} y={12} duration={200} style={s.questionBlock}>
        {/* Savol */}
        <View style={s.questionCard}>
          <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.questionRail} />
          <View style={s.questionInner}>
            <Text style={[s.questionKicker, NUM]}>Savol {qIdx + 1} / {QUESTIONS.length}</Text>
            <Text style={s.questionText}>{q.q}</Text>
          </View>
        </View>

        {/* Variantlar — 2×2 */}
        <View style={s.options}>
          {q.opts.map((opt, i) => {
            const isCorrect = i === q.correct
            const show = answered && flash
            const active = show && isCorrect
            const dimmed = show === 'bad' && !isCorrect
            return (
              <View key={i} style={s.optionOuter}>
                <Pressable
                  onPress={() => handleAnswer(i)}
                  disabled={answered}
                  style={({ pressed }) => [
                    s.option,
                    active ? s.optionCorrect : dimmed ? s.optionDim : s.optionIdle,
                    pressed && !answered && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Text style={[s.optionLetter, NUM]}>{['A', 'B', 'C', 'D'][i]}</Text>
                  <Text style={[s.optionText, { color: active ? '#0B4A34' : dimmed ? FAINT : INK }]}>
                    {opt}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        <View style={s.footNote}>
          <Ionicons name="cash" size={12} color="#E8A33D" />
          <Text style={[s.footNoteText, NUM]}>har g'alaba uchun {COIN_PER_WIN} coin</Text>
        </View>
      </Reveal>
    </ScrollView>
  )
}

const COL = 2
const GAP = 10

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F7EE' },
  centerWrap: { justifyContent: 'center', paddingHorizontal: 16 },
  lobbyPad: { paddingHorizontal: 16, paddingTop: 20 },

  lobbyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1, borderRadius: 12,
  },
  lobbyKicker: { fontSize: 10.5, letterSpacing: 1.7, fontWeight: '800', color: GRAY, textTransform: 'uppercase' },
  headSpacer: { width: 38 },

  mark: {
    position: 'relative', width: 56, height: 56, borderRadius: 16, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#7ED321',
  },
  markIcon: { color: '#1C3214' },
  h1: { marginTop: 16, fontSize: 26, lineHeight: 32, fontWeight: '800', color: INK },
  h1Sub: { marginTop: 6, fontSize: 13.5, lineHeight: 20, fontWeight: '500', color: GRAY },

  rivalCard: { position: 'relative', overflow: 'hidden', marginTop: 24, ...CARD, borderRadius: 14 },
  rivalRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#E8A33D' },
  rivalInner: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 14, paddingVertical: 14 },
  rivalAvatar: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#FCF1DC',
    alignItems: 'center', justifyContent: 'center',
  },
  rivalAvatarText: { fontSize: 15, fontWeight: '800', color: '#B87A22' },
  rivalMid: { flex: 1, minWidth: 0 },
  rivalTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  rivalSub: { marginTop: 2, fontSize: 11.5, fontWeight: '600', color: GRAY },
  rivalStreak: { color: '#B87A22', fontVariant: ['tabular-nums'] },
  rivalTag: { backgroundColor: '#DDF3DC', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  rivalTagText: { fontSize: 10.5, fontWeight: '800', color: '#0B6E4F', textTransform: 'uppercase' },

  startBtn: {
    ...LIME_BTN, position: 'relative', overflow: 'hidden', marginTop: 20, height: 52, gap: 8,
  },
  againBtn: { marginTop: 16 },
  startText: { fontSize: 14.5, fontWeight: '800', color: '#1C3214' },
  startIcon: { color: '#1C3214' },

  reviseBtn: {
    marginTop: 10, height: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderColor: '#CFD9C6', borderWidth: 1, borderStyle: 'dashed', borderRadius: 14,
  },
  reviseTile: {
    width: 28, height: 28, borderRadius: 9, backgroundColor: '#F6F8F3',
    borderColor: '#E1E7DA', borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  reviseText: { flex: 1, fontSize: 13, fontWeight: '800', color: INK },

  resultCard: { position: 'relative', overflow: 'hidden', ...CARD, borderRadius: 16 },
  resultRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  resultInner: { paddingLeft: 20, paddingRight: 16, paddingVertical: 20 },
  resultHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultKicker: { fontSize: 10.5, letterSpacing: 1.4, fontWeight: '800', color: GRAY, textTransform: 'uppercase' },
  resultH1: { marginTop: 8, fontSize: 24, lineHeight: 26, fontWeight: '800', color: INK },
  resultSub: { marginTop: 8, fontSize: 13, fontWeight: '500', color: GRAY },

  homeBtn: { ...OUT_BTN, marginTop: 10, height: 48 },
  homeBtnText: { fontSize: 13.5, fontWeight: '800', color: '#33452F' },

  gamePad: { paddingHorizontal: 16, paddingTop: 20 },
  scoreboard: {
    ...CARD, borderRadius: 14, flexDirection: 'row', alignItems: 'stretch',
    paddingHorizontal: 8, paddingVertical: 10,
  },
  scoreRow: { flex: 2, flexDirection: 'row', alignItems: 'stretch' },
  scoreCellWrap: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  scoreDivider: { width: 1, backgroundColor: '#EDF1E7', marginVertical: 4 },
  scoreCell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  scoreValue: { fontSize: 19, lineHeight: 20, fontWeight: '800' },
  scoreValueBig: { fontSize: 20, lineHeight: 21, fontWeight: '800' },
  scoreUnit: { marginTop: 6, fontSize: 10, fontWeight: '700', color: FAINT, textTransform: 'uppercase' },
  timerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  timer: {
    height: 40, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: 12,
  },
  timerText: { fontSize: 17, fontWeight: '800' },

  rail: { marginTop: 12, flexDirection: 'row', gap: 6 },
  railCell: { flex: 1, height: 5, borderRadius: 3 },

  questionBlock: { marginTop: 16 },
  questionCard: { position: 'relative', overflow: 'hidden', ...CARD, borderRadius: 16 },
  questionRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  questionInner: { paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  questionKicker: { fontSize: 10.5, letterSpacing: 1.4, fontWeight: '800', color: GRAY, textTransform: 'uppercase' },
  questionText: { marginTop: 8, fontSize: 17, lineHeight: 24, fontWeight: '600', color: INK },

  options: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  optionOuter: { width: `${(100 - (COL - 1) * (GAP / 1)) / COL}%` },
  option: {
    height: 68, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 14,
    justifyContent: 'flex-start',
  },
  optionIdle: { backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1 },
  optionCorrect: { backgroundColor: '#DDF3DC', borderColor: '#5FAF22', borderWidth: 1.5 },
  optionDim: { backgroundColor: '#FFFFFF', borderColor: '#E1E7DA', borderWidth: 1, opacity: 0.6 },
  optionLetter: { fontSize: 10, fontWeight: '800', color: FAINT },
  optionText: { marginTop: 4, fontSize: 14.5, lineHeight: 19, fontWeight: '800' },

  footNote: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footNoteText: { fontSize: 11.5, fontWeight: '700', color: FAINT },
})

export default BlitzScreen
