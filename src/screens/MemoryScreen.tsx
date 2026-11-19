import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated, Pressable, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { useApp } from '../store/useStore'
import { SolveTopBar } from '../components/SolveKit'
import { GameLobby } from '../components/GameLobby'
import { MemoryMark } from '../components/GameMarks'
import { ABS_FILL, MATH_FONT, NUM, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { GRAD_LIME } from '../theme/solver'
import {
  MEMORY_LEVELS, buildMemoryDeck, memoryOutcome,
  type MemoryCard, type MemoryLevel, type MemoryLevelId,
} from '../data/games'

/**
 * Sonlar xotirasi — ifoda va uning natijasi yashiringan kartalar.
 * Ikki karta ochiladi: mos kelsa juftlik yopiladi, aks holda qaytadi.
 * Butun sessiya bitta taymerda yuriladi; yulduz qolgan vaqtga bog'liq.
 */

type Phase = 'lobby' | 'play' | 'result'

const VIOLET_DEEP = '#4B33A0'
const COLS = 4

const MemoryScreen = () => {
  const C = useColors()
  const s = makeS(C)
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')
  const { width: winW } = useWindowDimensions()
  const creditGame = useApp(s => s.creditGame)
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)

  const [phase, setPhase] = useState<Phase>('lobby')
  const [levelId, setLevelId] = useState<MemoryLevelId>('easy')
  const [session, setSession] = useState(0)
  const [deck, setDeck] = useState<MemoryCard[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [secs, setSecs] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [outcome, setOutcome] = useState({ stars: 0, coins: 0, xp: 0, matched: 0, attempts: 0 })

  const level = useMemo(
    () => MEMORY_LEVELS.find(l => l.id === levelId) ?? MEMORY_LEVELS[0],
    [levelId],
  )

  const timer = useRef(new Animated.Value(1)).current
  const deadline = useRef(0)
  const lock = useRef(false)
  const credited = useRef(false)
  const finishing = useRef(false)
  const matchedRef = useRef<string[]>([])
  const attemptsRef = useRef(0)
  const levelRef = useRef(level)
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (flipTimer.current) clearTimeout(flipTimer.current)
    if (doneTimer.current) clearTimeout(doneTimer.current)
  }, [])

  const finish = () => {
    if (finishing.current) return
    finishing.current = true
    if (doneTimer.current) clearTimeout(doneTimer.current)
    const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
    const pairs = Math.floor(matchedRef.current.length / 2)
    const lvl = levelRef.current
    const out = memoryOutcome(pairs, lvl.pairs, left, lvl.seconds)
    setOutcome({ ...out, matched: pairs, attempts: attemptsRef.current })
    setPhase('result')
  }

  const startLevel = (lvl: MemoryLevel) => {
    triggerHaptic('medium')
    credited.current = false
    lock.current = false
    finishing.current = false
    matchedRef.current = []
    attemptsRef.current = 0
    levelRef.current = lvl
    setLevelId(lvl.id)
    setDeck(buildMemoryDeck(lvl))
    setFlipped([])
    setMatched([])
    setAttempts(0)
    setSecs(lvl.seconds)
    setMessage(null)
    setSession(v => v + 1)
    setPhase('play')
  }

  /** Butun sessiya bitta taymerda: vaqt tugasa — natija */
  useEffect(() => {
    if (phase !== 'play') return undefined
    const lvl = levelRef.current
    setSecs(lvl.seconds)
    deadline.current = Date.now() + lvl.seconds * 1000
    timer.setValue(1)
    const anim = Animated.timing(timer, {
      toValue: 0,
      duration: lvl.seconds * 1000,
      useNativeDriver: false,
    })
    anim.start(({ finished }) => { if (finished) finish() })
    const tick = setInterval(() => {
      setSecs(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)))
    }, 400)
    return () => { anim.stop(); clearInterval(tick) }
  }, [phase, session]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Barcha juftliklar topildi — kichik pauza bilan natijaga */
  useEffect(() => {
    if (phase !== 'play') return undefined
    if (matchedRef.current.length === levelRef.current.pairs * 2) {
      doneTimer.current = setTimeout(finish, 520)
      return () => { if (doneTimer.current) clearTimeout(doneTimer.current) }
    }
    return undefined
  }, [matched, phase])

  /** Natija ochilganda mukofot bir marta yoziladi */
  useEffect(() => {
    if (phase !== 'result' || credited.current) return
    credited.current = true
    creditGame('memory', levelRef.current.id, outcome.stars, outcome.coins, outcome.xp)
  }, [phase, creditGame, outcome])

  const openCard = (card: MemoryCard) => {
    if (phase !== 'play' || lock.current) return
    if (flipped.includes(card.key) || matchedRef.current.includes(card.key)) return
    triggerHaptic('light')
    const next = [...flipped, card.key]
    setFlipped(next)
    if (next.length < 2) return

    attemptsRef.current += 1
    setAttempts(attemptsRef.current)
    const first = deck.find(c => c.key === next[0])
    const second = deck.find(c => c.key === next[1])
    lock.current = true

    if (first && second && first.pair === second.pair) {
      triggerHaptic('success')
      setMessage('Juftlik topildi')
      flipTimer.current = setTimeout(() => {
        matchedRef.current = [...matchedRef.current, first.key, second.key]
        setMatched(matchedRef.current)
        setFlipped([])
        setMessage(null)
        lock.current = false
      }, 420)
      return
    }

    triggerHaptic('error')
    setMessage('Mos emas — yodda saqlang')
    flipTimer.current = setTimeout(() => {
      setFlipped([])
      setMessage(null)
      lock.current = false
    }, 760)
  }

  const best = gameStars[`memory:${levelId}`] ?? 0
  const gap = 8
  const cardW = Math.floor((winW - 32 - gap * (COLS - 1)) / COLS)
  const cardH = Math.round(cardW * 1.14)

  /* ── Lobby ── */
  if (phase === 'lobby') {
    return (
      <GameLobby
        title="Sonlar xotirasi"
        blurb="Juftliklarni eslab qolin"
        art={require('../assets/games/bgw-memory.jpg')}
        mark={<MemoryMark size={18} color={C.violet} />}
        accent={C.violet}
        accentSoft={C.violetSoft}
        accentInk="#FFFFFF"
        levels={MEMORY_LEVELS}
        selected={levelId}
        starsFor={id => gameStars[`memory:${id}`] ?? 0}
        plays={gamePlays.memory ?? 0}
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
            {outcome.stars === 3 ? 'Mukammal xotira' : outcome.stars > 0 ? 'Yaxshi urinish' : 'Vaqt tugadi'}
          </Text>
          <Text style={[s.resultSub, NUM]}>
            {outcome.matched} / {level.pairs} juftlik · {outcome.attempts} urinish · {level.title}
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
                <Ionicons name="star" size={13} color="#E8A33D" />
                <Text style={[s.resultPillText, NUM]}>rekord {Math.max(outcome.stars, best)}/3</Text>
              </View>
            </View>
            <Text style={s.resultNote}>
              {outcome.stars === 3
                ? 'Bu darajadagi eng yaxshi natija saqlandi.'
                : '3 yulduz uchun barcha juftlikni vaqtning uchdan bir qismi qolganda toping.'}
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
            <Text style={s.kicker}>Sonlar xotirasi · {level.title}</Text>
            <Text style={[s.step, NUM]}>
              {Math.floor(matched.length / 2)}/{level.pairs} juftlik · {secs} soniya
            </Text>
          </View>
          <View style={s.lives}>
            <Ionicons name="albums" size={15} color={C.violet} />
            <Text style={[s.livesText, NUM]}>{attempts}</Text>
          </View>
        </View>
        <View style={s.timerTrack}>
          <Animated.View
            style={[
              s.timerFill,
              { width: timer.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              secs <= 8 && { backgroundColor: C.danger },
            ]}
          />
        </View>
      </SolveTopBar>

      <View style={s.playBody}>
        <View pointerEvents="none" style={s.tableGlow} />

        <View style={[s.grid, { gap }]}>
          {deck.map(card => (
            <CardTile
              key={card.key}
              card={card}
              open={flipped.includes(card.key)}
              matched={matched.includes(card.key)}
              width={cardW}
              height={cardH}
              onPress={() => openCard(card)}
            />
          ))}
        </View>

        <View style={s.tipRow}>
          {message ? (
            <View style={[s.tipPill, message.startsWith('Mos') && s.tipPillBad]}>
              <Ionicons
                name={message.startsWith('Mos') ? 'close-circle' : 'checkmark-circle'}
                size={14}
                color={message.startsWith('Mos') ? C.danger : '#3F7D1C'}
              />
              <Text style={[s.tipText, { color: message.startsWith('Mos') ? '#B23A2F' : C.limeDeep }]}>
                {message}
              </Text>
            </View>
          ) : (
            <Text style={s.tip}>Ikki kartani oching — ifoda va natijasi mos kelsin</Text>
          )}
        </View>
      </View>
    </View>
  )
}

/** Karta — yopiq tomoni siyoh, ochilganda ifoda/natija ko'rinadi */
const CardTile = ({
  card,
  open,
  matched,
  width,
  height,
  onPress,
}: {
  card: MemoryCard
  open: boolean
  matched: boolean
  width: number
  height: number
  onPress: () => void
}) => {
  const C = useColors()
  const s = makeS(C)
  const flip = useRef(new Animated.Value(0)).current
  const shown = open || matched

  useEffect(() => {
    Animated.spring(flip, {
      toValue: shown ? 1 : 0,
      friction: 9,
      tension: 140,
      useNativeDriver: true,
    }).start()
  }, [shown, flip])

  const back = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const front = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })
  const exprSize = Math.max(11, Math.min(15, width * 0.2))
  const ansSize = Math.max(15, Math.min(21, width * 0.3))

  return (
    <Pressable
      onPress={onPress}
      disabled={shown}
      accessibilityRole="button"
      accessibilityLabel={shown ? card.text : 'Yopiq karta'}
      style={{ width, height }}
    >
      <View style={[s.card, matched && s.cardMatched]}>
        <Animated.View
          style={[
            ABS_FILL,
            s.face,
            { transform: [{ perspective: 900 }, { rotateY: back }], backfaceVisibility: 'hidden' },
          ]}
        >
          <LinearGradient
            colors={['#1D2E22', '#0E1A12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[ABS_FILL, { borderRadius: 13 }]}
          />
          <View style={s.cardBackRing}>
            <MemoryMark size={Math.min(22, width * 0.3)} color="rgba(201,184,255,0.55)" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            ABS_FILL,
            s.faceFront,
            matched && s.faceMatched,
            { transform: [{ perspective: 900 }, { rotateY: front }], backfaceVisibility: 'hidden' },
          ]}
        >
          <Text
            style={[
              card.face === 'expr' ? s.cardExpr : s.cardAns,
              card.face === 'expr' && { fontSize: exprSize, lineHeight: Math.round(exprSize * 1.5) },
              card.face === 'ans' && { fontSize: ansSize, lineHeight: Math.round(ansSize * 1.3) },
              matched && { color: '#3F7D1C' },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {card.text}
          </Text>
        </Animated.View>

        {matched && (
          <View style={s.matchBadge}>
            <Ionicons name="checkmark" size={9} color="#FFFFFF" />
          </View>
        )}
      </View>
    </Pressable>
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
  lives: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: '#F1ECFE',
    borderWidth: 1,
    borderColor: 'rgba(124,92,224,0.24)',
  },
  livesText: { fontSize: 12, fontWeight: '600', color: VIOLET_DEEP },

  timerTrack: {
    marginTop: 10,
    marginHorizontal: 16,
    height: 6,
    borderRadius: 9999,
    backgroundColor: C.line,
    overflow: 'hidden',
  },
  timerFill: { height: 6, borderRadius: 9999, backgroundColor: C.violet },

  playBody: { flex: 1, paddingHorizontal: 16, paddingTop: 14, justifyContent: 'center' },
  tableGlow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '28%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124,92,224,0.07)',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },

  card: {
    flex: 1,
    borderRadius: 13,
    backgroundColor: C.surface,
    ...shadow('#000', 6, 3, 0.12),
  },
  cardMatched: { shadowOpacity: 0, elevation: 0 },
  face: { borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  faceFront: {
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  faceMatched: { backgroundColor: '#F4FBED', borderColor: '#BDE39A' },
  cardBackRing: {
    width: '62%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,184,255,0.22)',
  },
  cardExpr: { fontFamily: MATH_FONT, color: '#2A2145', textAlign: 'center', paddingHorizontal: 4 },
  cardAns: { fontWeight: '700', color: C.ink, textAlign: 'center' },
  matchBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.limeDeep,
  },

  tipRow: { marginTop: 16, alignItems: 'center', minHeight: 30, justifyContent: 'center' },
  tip: { fontSize: 12, color: C.ink3, textAlign: 'center' },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
  },
  tipPillBad: { backgroundColor: '#FBEAE8', borderColor: '#F0C6C1' },
  tipText: { fontSize: 12.5, fontWeight: '600' },

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

export default MemoryScreen
