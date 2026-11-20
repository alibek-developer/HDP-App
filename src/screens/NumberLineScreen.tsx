import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated, PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { useApp } from '../store/useStore'
import { SolveTopBar } from '../components/SolveKit'
import { GameLobby } from '../components/GameLobby'
import { NumberLineMark } from '../components/GameMarks'
import { ABS_FILL, MATH_FONT, NUM, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { GRAD_LIME } from '../theme/solver'
import {
  NUMBERLINE_LEVELS, NUMBERLINE_ROUNDS, numberLineOutcome, numberLineTicks,
  pickNumberLineTarget,
  type NumberLineLevel, type NumberLineLevelId,
} from '../data/games'

/**
 * Sonlar chizig'i — relsda nishon sonni topish. Nishon yuqorida yoziladi,
 * foydalanuvchi puckni sudrab yoki relsga bosib mos belgiga qo'yadi va
 * tasdiqlaydi. Xato yoki vaqt tugashi bitta yurakni oladi.
 * Relsda faqat beshta yorliq bor — qolgan belgilarni sanash o'quvchi ishi.
 */

type Phase = 'lobby' | 'play' | 'result'

const PAD = 14

const NumberLineScreen = () => {
  const C = useColors()
  const s = makeS(C)
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')
  const { width: winW } = useWindowDimensions()
  const creditGame = useApp(s => s.creditGame)
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)

  const [phase, setPhase] = useState<Phase>('lobby')
  const [levelId, setLevelId] = useState<NumberLineLevelId>('easy')
  const [session, setSession] = useState(0)
  const [targets, setTargets] = useState<number[]>([])
  const [idx, setIdx] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [secs, setSecs] = useState(0)
  const [pick, setPick] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [okPulse, setOkPulse] = useState(false)
  const [outcome, setOutcome] = useState({ stars: 0, coins: 0, xp: 0, solved: 0 })

  const level = useMemo(
    () => NUMBERLINE_LEVELS.find(l => l.id === levelId) ?? NUMBERLINE_LEVELS[0],
    [levelId],
  )
  const ticks = useMemo(() => numberLineTicks(level), [level])
  const trackW = winW - 32 - PAD * 2
  const stepX = ticks.length > 1 ? trackW / (ticks.length - 1) : trackW

  const timer = useRef(new Animated.Value(1)).current
  const halo = useRef(new Animated.Value(0)).current
  const deadline = useRef(0)
  const lock = useRef(false)
  const credited = useRef(false)
  const finishing = useRef(false)
  const solvedRef = useRef(0)
  const heartsRef = useRef(3)
  const idxRef = useRef(0)
  const pickRef = useRef(0)
  const levelRef = useRef(level)
  const targetsRef = useRef<number[]>([])
  const advTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drag = useRef({ from: 0, pageX: 0 })

  useEffect(() => () => { if (advTimer.current) clearTimeout(advTimer.current) }, [])

  /** Puck nafasi — doimiy mikro-harakat */
  useEffect(() => {
    if (phase !== 'play') return undefined
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(halo, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    )
    anim.start()
    return () => anim.stop()
  }, [phase, halo])

  const finish = () => {
    if (finishing.current) return
    finishing.current = true
    if (advTimer.current) clearTimeout(advTimer.current)
    const out = numberLineOutcome(solvedRef.current, targetsRef.current.length)
    setOutcome({ ...out, solved: solvedRef.current })
    setPhase('result')
  }

  const startLevel = (lvl: NumberLineLevel) => {
    triggerHaptic('medium')
    credited.current = false
    finishing.current = false
    lock.current = false
    solvedRef.current = 0
    heartsRef.current = lvl.hearts
    idxRef.current = 0
    levelRef.current = lvl
    let prev: number | null = null
    const list: number[] = []
    for (let i = 0; i < NUMBERLINE_ROUNDS; i += 1) {
      prev = pickNumberLineTarget(lvl, prev)
      list.push(prev)
    }
    targetsRef.current = list
    const start = Math.floor(numberLineTicks(lvl).length / 2)
    pickRef.current = start
    setLevelId(lvl.id)
    setTargets(list)
    setIdx(0)
    setHearts(lvl.hearts)
    setSecs(lvl.seconds)
    setPick(start)
    setMessage(null)
    setOkPulse(false)
    setSession(v => v + 1)
    setPhase('play')
  }

  const nextRound = () => {
    if (idxRef.current + 1 >= targetsRef.current.length) {
      finish()
      return
    }
    idxRef.current += 1
    const start = Math.floor(numberLineTicks(levelRef.current).length / 2)
    pickRef.current = start
    setIdx(idxRef.current)
    setPick(start)
    setMessage(null)
    setOkPulse(false)
    lock.current = false
  }

  /** Har bosqich: vaqt tugasa yurak ketadi, keyingi nishonga o'tiladi */
  useEffect(() => {
    if (phase !== 'play' || !targets.length) return undefined
    lock.current = false
    const lvl = levelRef.current
    setSecs(lvl.seconds)
    deadline.current = Date.now() + lvl.seconds * 1000
    timer.setValue(1)
    const anim = Animated.timing(timer, {
      toValue: 0,
      duration: lvl.seconds * 1000,
      useNativeDriver: false,
    })
    anim.start(({ finished }) => {
      if (!finished || lock.current) return
      lock.current = true
      const left = heartsRef.current - 1
      heartsRef.current = left
      setHearts(left)
      triggerHaptic('error')
      setOkPulse(false)
      if (left <= 0) {
        setMessage('Yuraklar tugadi')
        advTimer.current = setTimeout(finish, 900)
        return
      }
      setMessage('Vaqt tugadi')
      advTimer.current = setTimeout(nextRound, 950)
    })
    const tick = setInterval(() => {
      setSecs(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)))
    }, 400)
    return () => { anim.stop(); clearInterval(tick) }
  }, [phase, idx, session]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Natijada mukofot bir marta */
  useEffect(() => {
    if (phase !== 'result' || credited.current) return
    credited.current = true
    creditGame('numberline', levelRef.current.id, outcome.stars, outcome.coins, outcome.xp)
  }, [phase, creditGame, outcome])

  const commit = () => {
    if (phase !== 'play' || lock.current) return
    lock.current = true
    const target = targetsRef.current[idxRef.current]
    const value = ticks[pickRef.current]
    if (value === target) {
      triggerHaptic('success')
      solvedRef.current += 1
      setOkPulse(true)
      setMessage(`To'g'ri — ${value}`)
      advTimer.current = setTimeout(nextRound, 760)
      return
    }
    triggerHaptic('error')
    const left = heartsRef.current - 1
    heartsRef.current = left
    setHearts(left)
    setMessage(`Nishon ${target} edi — siz ${value} ni tanladingiz`)
    if (left <= 0) {
      advTimer.current = setTimeout(finish, 1000)
      return
    }
    advTimer.current = setTimeout(nextRound, 1100)
  }

  const setPickAt = (index: number) => {
    if (lock.current) return
    const clamped = Math.max(0, Math.min(ticks.length - 1, index))
    if (clamped === pickRef.current) return
    pickRef.current = clamped
    setPick(clamped)
    triggerHaptic('selection')
  }

  const responder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => !lock.current,
      onMoveShouldSetPanResponder: () => !lock.current,
      onPanResponderGrant: e => {
        drag.current = { from: pickRef.current, pageX: e.nativeEvent.pageX }
      },
      onPanResponderMove: e => {
        const delta = (e.nativeEvent.pageX - drag.current.pageX) / stepX
        setPickAt(Math.round(drag.current.from + delta))
      },
    }),
    [stepX, ticks.length], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const best = gameStars[`numberline:${levelId}`] ?? 0
  const target = targets[idx]
  const labelEvery = Math.max(1, Math.ceil((ticks.length - 1) / 4))
  const puckX = pick * stepX

  /* ── Lobby ── */
  if (phase === 'lobby') {
    return (
      <GameLobby
        title="Sonlar chizig'i"
        blurb="Relsda nishonni birinchi uring"
        art={require('../assets/games/bgw-numberline.jpg')}
        mark={<NumberLineMark size={18} color={C.xp} />}
        accent={C.xp}
        accentSoft={C.xpSoft}
        accentInk={C.inkOnLime}
        levels={NUMBERLINE_LEVELS}
        selected={levelId}
        starsFor={id => gameStars[`numberline:${id}`] ?? 0}
        plays={gamePlays.numberline ?? 0}
        insets={insets}
        onBack={exit}
        onSelect={setLevelId}
        onStart={() => startLevel(level)}
      />
    )
  }

  /* ── Natija ── */
  if (phase === 'result') {
    return (
      <View style={s.screen}>
        <View style={[s.lobbyHead, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={exit} accessibilityLabel="Chiqish" hitSlop={10} style={s.back}>
            <Ionicons name="close" size={18} color={C.ink2} />
          </Pressable>
          <Text style={s.lobbyKicker}>Natija</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={s.resultBody}>
          <View style={s.starsRow}>
            {[0, 1, 2].map(i => (
              <Ionicons
                key={i}
                name={i < outcome.stars ? 'star' : 'star-outline'}
                size={i === 1 ? 46 : 36}
                color={i < outcome.stars ? C.coin : C.ink4}
                style={i === 1 && { marginTop: -12 }}
              />
            ))}
          </View>

          <Text style={s.resultTitle}>
            {outcome.stars === 3 ? 'Aniq nishonchi' : outcome.stars > 0 ? 'Yaxshi urinish' : 'Yana bir bor'}
          </Text>
          <Text style={[s.resultSub, NUM]}>
            {outcome.solved} / {targets.length} nishon topildi · {level.title}
          </Text>

          <View style={s.resultSheet}>
            <View style={s.resultRow}>
              <View style={[s.resultPill, { backgroundColor: C.coinSoft }]}>
                <Ionicons name="cash" size={14} color={C.coin} />
                <Text style={[s.resultPillText, NUM]}>+{outcome.coins}</Text>
              </View>
              <View style={[s.resultPill, { backgroundColor: C.xpSoft }]}>
                <Ionicons name="flash" size={14} color={C.xp} />
                <Text style={[s.resultPillText, NUM]}>+{outcome.xp}</Text>
              </View>
              <View style={[s.resultPill, { backgroundColor: C.surface2 }]}>
                <Ionicons name="star" size={13} color={C.coin} />
                <Text style={[s.resultPillText, NUM]}>rekord {Math.max(outcome.stars, best)}/3</Text>
              </View>
            </View>
            <Text style={s.resultNote}>
              {outcome.stars === 3
                ? 'Bu darajadagi eng yaxshi natija saqlandi.'
                : "3 yulduz uchun barcha nishonlarni yurak yo'qotmasdan toping."}
            </Text>
          </View>
        </View>

        <View style={[s.lobbyFoot, { paddingBottom: insets.bottom + 14, gap: 10 }]}>
          <Pressable onPress={() => startLevel(level)} accessibilityRole="button" style={s.ctaWrap}>
            {({ pressed }) => (
              <LinearGradient
                colors={GRAD_LIME}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.cta, pressed && { transform: [{ translateY: 2 }] }]}
              >
                <Text style={s.ctaText}>Yana o&apos;ynash</Text>
                <Ionicons name="refresh" size={16} color={C.inkOnLime} />
              </LinearGradient>
            )}
          </Pressable>
          <Pressable onPress={() => { triggerHaptic('selection'); setPhase('lobby') }} style={s.ghostBtn}>
            <Text style={s.ghostText}>Darajani tanlash</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  /* ── O'yin ── */
  return (
    <View style={s.screen}>
      <SolveTopBar style={{ paddingTop: insets.top + 8 }}>
        <View style={s.headRow}>
          <Pressable onPress={exit} accessibilityLabel="Chiqish" hitSlop={10} style={s.back}>
            <Ionicons name="chevron-back" size={18} color={C.ink2} />
          </Pressable>
          <View style={s.headMid}>
            <Text style={s.kicker}>Sonlar chizig&apos;i · {level.title}</Text>
            <Text style={[s.step, NUM]}>
              Bosqich {idx + 1}/{targets.length} · {secs} soniya
            </Text>
          </View>
          <View style={s.hearts}>
            {Array.from({ length: level.hearts }, (_, i) => (
              <Ionicons
                key={i}
                name={i < hearts ? 'heart' : 'heart-outline'}
                size={15}
                color={i < hearts ? C.danger : C.ink4}
              />
            ))}
          </View>
        </View>
        <View style={s.timerTrack}>
          <Animated.View
            style={[
              s.timerFill,
              { width: timer.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              secs <= 4 && { backgroundColor: C.danger },
            ]}
          />
        </View>
      </SolveTopBar>

      <View style={s.playBody}>
        <View style={s.targetCard}>
          <LinearGradient
            colors={['#16305F', '#0E1A12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[ABS_FILL, { borderRadius: 16 }]}
          />
          <Text style={s.targetLabel}>NISHON</Text>
          <Text style={[s.targetValue, NUM]}>{target}</Text>
          <Text style={s.targetHint}>Relsda shu sonni toping</Text>
        </View>

        <View style={s.railWrap}>
          <View style={[s.trackArea, { height: 92 }]}>
            <View pointerEvents="none" style={[s.railLine, { left: PAD, right: PAD }]} />
            {ticks.map((v, i) => {
              const left = PAD + i * stepX
              const half = stepX / 2
              const segLeft = Math.max(0, left - half)
              const segRight = Math.min(trackW, left + half)
              return (
                <Pressable
                  key={`hit-${v}`}
                  onPress={() => setPickAt(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Belgi ${v}`}
                  style={{ position: 'absolute', top: 0, bottom: 0, left: segLeft, width: Math.max(1, segRight - segLeft) }}
                />
              )
            })}
            {ticks.map((v, i) => {
              const left = PAD + i * stepX
              const major = i % labelEvery === 0 || i === ticks.length - 1
              return (
                <View key={v} pointerEvents="none" style={[s.tickWrap, { left }]}>
                  <View style={[s.tick, major && s.tickMajor]} />
                  {major && <Text style={[s.tickLabel, NUM]}>{v}</Text>}
                </View>
              )
            })}
            <View
              {...responder.panHandlers}
              style={[s.puckWrap, { left: PAD + puckX - 16 }]}
              accessibilityLabel={`Tanlangan belgi ${pick + 1}`}
            >
              <Animated.View
                style={[
                  s.puckHalo,
                  {
                    opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.05] }),
                    transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] }) }],
                  },
                ]}
              />
              <View style={[s.puck, okPulse && s.puckOk]}>
                <View style={[s.puckDot, okPulse && { backgroundColor: C.surface }]} />
              </View>
            </View>
          </View>
          <Text style={s.railHint}>
            Yorliq faqat asosiy belgilarda — oraliqdagi belgilarni sanang
          </Text>
        </View>

        <View style={s.tipRow}>
          {message ? (
            <View style={[s.tipPill, okPulse ? s.tipPillOk : s.tipPillBad]}>
              <Ionicons
                name={okPulse ? 'checkmark-circle' : 'alert-circle'}
                size={14}
                color={okPulse ? C.limeDeep : C.danger}
              />
              <Text style={[s.tipText, { color: okPulse ? C.limeDeep : C.danger }]}>{message}</Text>
            </View>
          ) : (
            <Text style={s.tip}>Puckni sudrang yoki relsga bosing</Text>
          )}
        </View>
      </View>

      <View style={[s.dock, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={commit}
          accessibilityRole="button"
          accessibilityLabel="Tasdiqlash"
          style={({ pressed }) => [s.ctaWrap, pressed && { transform: [{ translateY: 2 }] }]}
        >
          <LinearGradient
            colors={GRAD_LIME}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.cta}
          >
            <Text style={s.ctaText}>Tasdiqlash</Text>
            <Ionicons name="checkmark" size={17} color={C.inkOnLime} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  )
}

const makeS = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.solverBody },

  lobbyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    backgroundColor: C.solverBody,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  lobbyKicker: { fontSize: 13, fontWeight: '600', color: C.ink, letterSpacing: 0.2 },

  lobbyFoot: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: C.solverBody },
  ctaWrap: { borderRadius: 16 },
  cta: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow(C.limeDeep, 8, 5, 0.3),
  },
  ctaText: { fontSize: 15.5, fontWeight: '600', color: C.inkOnLime },
  ghostBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  ghostText: { fontSize: 14, fontWeight: '600', color: C.ink2 },

  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  headMid: { flex: 1 },
  kicker: { fontSize: 13, fontWeight: '600', color: C.ink },
  step: { marginTop: 1, fontSize: 11, color: C.ink3 },
  hearts: { flexDirection: 'row', gap: 3 },

  timerTrack: {
    marginTop: 10,
    marginHorizontal: 16,
    height: 6,
    borderRadius: 9999,
    backgroundColor: C.line,
    overflow: 'hidden',
  },
  timerFill: { height: 6, borderRadius: 9999, backgroundColor: C.xp },

  playBody: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },

  targetCard: {
    alignSelf: 'center',
    minWidth: 168,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  targetLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: 'rgba(169,196,255,0.75)' },
  targetValue: { marginTop: 2, fontFamily: MATH_FONT, fontSize: 40, lineHeight: 46, color: '#FFFFFF' },
  targetHint: { marginTop: 2, fontSize: 11, fontWeight: '500', color: 'rgba(205,233,174,0.6)' },

  railWrap: { marginTop: 18 },
  trackArea: { position: 'relative', justifyContent: 'center' },
  railLine: {
    position: 'absolute',
    top: 44,
    height: 3,
    borderRadius: 999,
    backgroundColor: C.line,
  },
  tickWrap: { position: 'absolute', top: 36, alignItems: 'center', width: 1 },
  tick: { width: 1.5, height: 9, borderRadius: 1, backgroundColor: C.line },
  tickMajor: { width: 2, height: 14, backgroundColor: C.ink3 },
  tickLabel: {
    marginTop: 3,
    fontSize: 9.5,
    fontWeight: '600',
    color: C.ink3,
    width: 40,
    textAlign: 'center',
    marginLeft: -20,
  },
  puckWrap: { position: 'absolute', top: 20, width: 32, height: 46, alignItems: 'center' },
  puckHalo: {
    position: 'absolute',
    top: 3,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.xp,
  },
  puck: {
    marginTop: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: C.surface,
    backgroundColor: C.xp,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(C.xp, 8, 4, 0.4),
  },
  puckOk: { backgroundColor: C.limeDeep, borderColor: C.limeBright },
  puckDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.surface },
  railHint: { marginTop: 6, textAlign: 'center', fontSize: 10.5, color: C.ink4 },

  tipRow: { marginTop: 14, alignItems: 'center', minHeight: 30, justifyContent: 'center' },
  tip: { fontSize: 12, color: C.ink3, textAlign: 'center' },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  tipPillOk: { backgroundColor: C.surface2, borderColor: C.line },
  tipPillBad: { backgroundColor: C.dangerSoft, borderColor: C.danger },
  tipText: { fontSize: 11.5, fontWeight: '600', flexShrink: 1 },

  dock: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: C.solverBody },

  resultBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 56 },
  resultTitle: { marginTop: 6, fontSize: 21, fontWeight: '600', color: C.ink },
  resultSub: { marginTop: 5, fontSize: 12.5, color: C.ink3 },
  resultSheet: {
    marginTop: 20,
    alignSelf: 'stretch',
    padding: 14,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  resultRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  resultPillText: { fontSize: 12.5, fontWeight: '600', color: C.ink },
  resultNote: { marginTop: 10, textAlign: 'center', fontSize: 11.5, lineHeight: 16, color: C.ink3 },
})

export default NumberLineScreen
