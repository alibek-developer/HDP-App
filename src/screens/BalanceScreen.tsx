import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentRef } from 'react'
import {
  Animated, PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { useApp } from '../store/useStore'
import { BalanceScale, Rider } from '../games/BalanceScale'
import { SolveTopBar } from '../components/SolveKit'
import { GameLobby } from '../components/GameLobby'
import { ScaleMark } from '../components/ScaleMark'
import { C, MATH_FONT, NUM, shadow } from '../theme/tokens'
import { GRAD_LIME } from '../theme/solver'
import {
  BALANCE_LEVELS, balanceOutcome, pickBalanceRounds, sum,
  type BalanceLevel, type BalanceLevelId, type BalanceRound,
} from '../data/games'

/**
 * Muvozanat — tarozi o'yini. Har bosqichda chap panada noma'lum `x` turadi;
 * foydalanuvchi pastdagi og'irliklarni panaga tashlab, ikki tomonni tenglashtiradi.
 * Vaqt tugasa yoki yuraklar tugasa sessiya yakunlanadi. Yulduz — yechilgan bosqichdan. */

type Phase = 'lobby' | 'play' | 'result'

const INK = '#0E1A12'
const GRAY = '#6B7C66'
const LINE = '#E1E7DA'

const LIMA_ART = require('../assets/games/muvozanat-lima.png')
const AMBAR_ART = require('../assets/games/muvozanat-ambar.png')

const BalanceScreen = () => {
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')
  const { width: winW } = useWindowDimensions()
  const creditGame = useApp(s => s.creditGame)
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)

  const [phase, setPhase] = useState<Phase>('lobby')
  const [session, setSession] = useState(0)
  const [levelId, setLevelId] = useState<BalanceLevelId>('easy')
  const [rounds, setRounds] = useState<BalanceRound[]>([])
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState<number[]>([])
  const [used, setUsed] = useState<number[]>([])
  const [hearts, setHearts] = useState(3)
  const [secs, setSecs] = useState(30)
  const [message, setMessage] = useState<string | null>(null)
  const [outcome, setOutcome] = useState({ stars: 0, coins: 0, xp: 0, solved: 0 })
  const [drag, setDrag] = useState<{ value: number; x: number; y: number; moved: boolean } | null>(null)
  const [hot, setHot] = useState(false)
  /** Ketma-ket tenglashtirilgan bosqichlar — tezkorlik hissi uchun */
  const [combo, setCombo] = useState(0)
  const comboRef = useRef(0)

  const level = useMemo(
    () => BALANCE_LEVELS.find(l => l.id === levelId) ?? BALANCE_LEVELS[0],
    [levelId],
  )
  const round = rounds[idx]
  const timer = useRef(new Animated.Value(1)).current
  const deadline = useRef(0)
  const locked = useRef(false)
  const credited = useRef(false)
  const solvedRef = useRef(0)
  const heartsRef = useRef(3)
  const idxRef = useRef(0)
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scaleRef = useRef<ComponentRef<typeof View>>(null)
  const scaleRect = useRef<{ x: number; y: number } | null>(null)
  const startPoint = useRef({ x: 0, y: 0 })

  const leftSum = round ? sum(round.left) : 0
  const rightSum = round ? sum(round.right) : 0
  const need = rightSum - leftSum
  const isBalanced = !!round && placed.length > 0 && leftSum + sum(placed) === rightSum

  useEffect(() => () => { if (advance.current) clearTimeout(advance.current) }, [])

  const startLevel = (lvl: BalanceLevel) => {
    triggerHaptic('medium')
    credited.current = false
    solvedRef.current = 0
    comboRef.current = 0
    setCombo(0)
    heartsRef.current = lvl.hearts
    setLevelId(lvl.id)
    setRounds(pickBalanceRounds(lvl))
    setIdx(0)
    idxRef.current = 0
    setPlaced([])
    setUsed([])
    setHearts(lvl.hearts)
    setMessage(null)
    setSession(v => v + 1)
    setPhase('play')
  }

  const finish = () => {
    const out = balanceOutcome(solvedRef.current, rounds.length)
    setOutcome({ ...out, solved: solvedRef.current })
    setPhase('result')
  }

  const nextRound = () => {
    if (idxRef.current + 1 >= rounds.length) {
      finish()
      return
    }
    idxRef.current += 1
    setIdx(idxRef.current)
  }

  /** Har bosqich: vaqt yuritiladi, vaqt tugasa yurak kamayadi */
  useEffect(() => {
    if (phase !== 'play' || !round) return undefined
    locked.current = false
    setPlaced([])
    setUsed([])
    setMessage(null)
    setSecs(level.seconds)
    deadline.current = Date.now() + level.seconds * 1000
    timer.setValue(1)
    const anim = Animated.timing(timer, {
      toValue: 0,
      duration: level.seconds * 1000,
      useNativeDriver: false,
    })
    anim.start(({ finished }) => {
      if (!finished) return
      const left = heartsRef.current - 1
      heartsRef.current = left
      setHearts(left)
      comboRef.current = 0
      setCombo(0)
      triggerHaptic('error')
      if (left <= 0) {
        locked.current = true
        setMessage('Yuraklar tugadi')
        advance.current = setTimeout(finish, 900)
        return
      }
      setMessage('Vaqt tugadi')
      locked.current = true
      advance.current = setTimeout(nextRound, 900)
    })
    return () => anim.stop()
  }, [phase, idx, session]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Sekund hisobi — ekranda ko'rinadigan raqam */
  useEffect(() => {
    if (phase !== 'play') return undefined
    const tick = setInterval(() => {
      setSecs(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)))
    }, 400)
    return () => clearInterval(tick)
  }, [phase, idx])

  /** Teng bo'ldi — bosqich yopildi */
  useEffect(() => {
    if (phase !== 'play' || !round || locked.current || placed.length === 0) return
    if (leftSum + sum(placed) !== rightSum) return
    locked.current = true
    timer.stopAnimation()
    triggerHaptic('success')
    solvedRef.current += 1
    comboRef.current += 1
    setCombo(comboRef.current)
    setMessage(`Teng!  x = ${need}`)
    advance.current = setTimeout(nextRound, 850)
  }, [placed]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Natijaga kirganda mukofot bir marta yoziladi */
  useEffect(() => {
    if (phase !== 'result' || credited.current) return
    credited.current = true
    const out = balanceOutcome(solvedRef.current, rounds.length)
    creditGame('balance', level.id, out.stars, out.coins, out.xp)
  }, [phase, creditGame, level.id, rounds.length])

  const placeChip = (i: number) => {
    if (locked.current || used.includes(i)) return
    triggerHaptic('light')
    setUsed(u => [...u, i])
    setPlaced(p => [...p, round.chips[i]])
  }

  const removeChip = (i: number) => {
    if (locked.current) return
    triggerHaptic('selection')
    const value = placed[i]
    setPlaced(p => p.filter((_, j) => j !== i))
    setUsed(u => {
      const at = round.chips.findIndex((c, k) => c === value && u.includes(k))
      return at >= 0 ? u.filter(k => k !== at) : u
    })
  }

  const clearPlaced = () => {
    if (locked.current || placed.length === 0) return
    triggerHaptic('selection')
    setPlaced([])
    setUsed([])
  }

  /* ── Sudrash ── */

  const panRect = () => {
    if (!scaleRect.current) return null
    /** yangi tarozida chap pana: nur chetidan 13 px, og'irliklar yonidan boshlanadi */
    const panW = 142
    return {
      x: scaleRect.current.x + 13,
      y: scaleRect.current.y + 96,
      w: panW,
      h: 130,
    }
  }

  const inPan = (x: number, y: number) => {
    const r = panRect()
    return !!r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h
  }

  const onChipDrag = (event: 'start' | 'move' | 'end' | 'cancel', i: number, x: number, y: number) => {
    if (locked.current) return
    if (event === 'start') {
      scaleRef.current?.measureInWindow((sx, sy) => { scaleRect.current = { x: sx, y: sy } })
      startPoint.current = { x, y }
      return
    }
    if (event === 'cancel') { setDrag(null); setHot(false); return }
    const moved = Math.hypot(x - startPoint.current.x, y - startPoint.current.y) > 8
    if (event === 'move') {
      if (moved) setDrag({ value: round.chips[i], x, y, moved: true })
      setHot(inPan(x, y))
      return
    }
    const drop = inPan(x, y)
    setDrag(null)
    setHot(false)
    if (drop || !moved) placeChip(i)
  }

  const chipWidth = winW - 32
  const best = gameStars[`balance:${levelId}`] ?? 0

  /* ── Lobby ── */
  if (phase === 'lobby') {
    return (
      <GameLobby
        title="Muvozanat"
        blurb="Og'irliklarni qo'yib, tarozini tenglang"
        art={require('../assets/games/bgw-balance.jpg')}
        mark={<ScaleMark size={18} color={C.limeDeep} />}
        accent={C.lime}
        accentSoft={C.leafSoft}
        accentInk={C.inkOnLime}
        levels={BALANCE_LEVELS}
        selected={levelId}
        starsFor={id => gameStars[`balance:${id}`] ?? 0}
        plays={gamePlays.balance ?? 0}
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
            <Ionicons name="close" size={18} color="#33452F" />
          </Pressable>
          <Text style={s.lobbyKicker}>Natija</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={s.resultBody}>
          <View style={s.resultArt}>
            <Rider source={LIMA_ART} cheer={outcome.stars > 0} delay={0} />
            <Rider source={AMBAR_ART} cheer={outcome.stars > 0} delay={200} />
          </View>

          <View style={s.starsRow}>
            {[0, 1, 2].map(i => (
              <Ionicons
                key={i}
                name={i < outcome.stars ? 'star' : 'star-outline'}
                size={i === 1 ? 46 : 36}
                color={i < outcome.stars ? '#E8A33D' : '#C9D2C1'}
                style={i === 1 && { marginTop: -12 }}
              />
            ))}
          </View>

          <Text style={s.resultTitle}>
            {outcome.stars === 3 ? 'Mukammal balans' : outcome.stars > 0 ? 'Yaxshi urinish' : 'Yana bir bor'}
          </Text>
          <Text style={[s.resultSub, NUM]}>
            {outcome.solved} / {rounds.length} bosqich tenglashtirildi · {level.title}
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
              <View style={[s.resultPill, { backgroundColor: '#F1F5EC' }]}>
                <Ionicons name="star" size={13} color="#E8A33D" />
                <Text style={[s.resultPillText, NUM]}>rekord {Math.max(outcome.stars, best)}/3</Text>
              </View>
            </View>
            <Text style={s.resultNote}>
              {outcome.stars === 3
                ? 'Bu darajadagi eng yaxshi natija saqlandi.'
                : `3 yulduz uchun ${rounds.length} bosqichni ham vaqtida tenglashtiring.`}
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
            <Ionicons name="chevron-back" size={18} color="#33452F" />
          </Pressable>
          <View style={s.headMid}>
            <Text style={s.kicker}>Muvozanat · {level.title}</Text>
            <Text style={[s.step, NUM]}>
              Bosqich {idx + 1}/{rounds.length} · {secs} soniya
            </Text>
          </View>
          <View style={s.hearts}>
            {Array.from({ length: level.hearts }, (_, i) => (
              <Ionicons key={i} name={i < hearts ? 'heart' : 'heart-outline'} size={15} color={i < hearts ? '#D9483B' : '#C9D2C1'} />
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

      <View style={s.body}>
        {level.showEquation && (
          <View style={s.equationWrap}>
            <Text style={s.equation}>x + {leftSum} = {rightSum}</Text>
          </View>
        )}

        <View ref={scaleRef} collapsable={false} style={[s.scaleWrap, hot && s.scaleWrapHot]}>
          {round && (
            <BalanceScale
              width={chipWidth}
              left={round.left}
              right={round.right}
              placed={placed}
              balanced={isBalanced}
              onRemovePlaced={removeChip}
            />
          )}
        </View>

        <View style={s.tipRow}>
          {message ? (
            <View style={s.tipPill}>
              <Ionicons name="checkmark-circle" size={14} color="#3F7D1C" />
              <Text style={[s.tipOn, NUM]}>{message}</Text>
            </View>
          ) : combo >= 2 ? (
            <View style={s.comboPill}>
              <Ionicons name="flame" size={13} color="#B4530A" />
              <Text style={[s.comboText, NUM]}>Ketma-ket ×{combo}</Text>
            </View>
          ) : (
            <Text style={s.tip}>
              {placed.length > 0
                ? `Chap pana: ${leftSum + sum(placed)} · o'ng pana: ${rightSum}`
                : "Og'irlikni panaga bosing yoki sudrab tashlang"}
            </Text>
          )}
        </View>
      </View>

      <View style={[s.tray, { paddingBottom: insets.bottom + 12 }]}>
        <View style={s.trayHead}>
          <Text style={s.trayLabel}>Og&apos;irliklar</Text>
          <Pressable
            onPress={clearPlaced}
            disabled={placed.length === 0}
            accessibilityLabel="Tozalash"
            style={({ pressed }) => [s.trayReset, placed.length === 0 && { opacity: 0.4 }, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="refresh" size={12} color={GRAY} />
            <Text style={s.trayResetText}>Tozalash</Text>
          </Pressable>
        </View>
        <View style={s.trayRow}>
          {round.chips.map((value, i) => {
            const gone = used.includes(i)
            return (
              <TrayChip
                key={`${value}-${i}`}
                value={value}
                gone={gone}
                onDrag={(event, x, y) => onChipDrag(event, i, x, y)}
              />
            )
          })}
        </View>
      </View>

      {drag && (
        <View pointerEvents="none" style={[s.ghostChip, { left: drag.x - 15, top: drag.y - 15 }]}>
          <Text style={[s.ghostText2, NUM]}>{drag.value}</Text>
        </View>
      )}
    </View>
  )
}

/** Pastdagi og'irlik — bosilsa panaga tushadi, sudralsa qo'lda tashiladi */
const TrayChip = ({
  value,
  gone,
  onDrag,
}: {
  value: number
  gone: boolean
  onDrag: (event: 'start' | 'move' | 'end' | 'cancel', x: number, y: number) => void
}) => {
  const state = useRef({ moved: false, x: 0, y: 0 })
  const responder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => !gone,
      onMoveShouldSetPanResponder: () => !gone,
      onPanResponderGrant: e => {
        state.current = { moved: false, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }
        onDrag('start', e.nativeEvent.pageX, e.nativeEvent.pageY)
      },
      onPanResponderMove: e => {
        const { pageX, pageY } = e.nativeEvent
        if (Math.hypot(pageX - state.current.x, pageY - state.current.y) > 8) state.current.moved = true
        onDrag('move', pageX, pageY)
      },
      onPanResponderRelease: e => onDrag('end', e.nativeEvent.pageX, e.nativeEvent.pageY),
      onPanResponderTerminate: () => onDrag('cancel', 0, 0),
    }),
    [gone, onDrag],
  )

  return (
    <View {...responder.panHandlers} style={[s.chip, gone && s.chipGone]}>
      <Text style={[s.chipText, NUM, gone && { color: '#C9D2C1' }]}>{gone ? '·' : value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F7EE' },

  lobbyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE0',
    backgroundColor: '#F3F7EE',
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: LINE,
  },
  lobbyKicker: { fontSize: 13, fontWeight: '600', color: INK, letterSpacing: 0.2 },

  lobbyFoot: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: '#F3F7EE' },
  ctaWrap: { borderRadius: 16 },
  cta: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow('#5FAF22', 8, 5, 0.3),
  },
  ctaText: { fontSize: 15.5, fontWeight: '600', color: C.inkOnLime },
  ghostBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: LINE,
  },
  ghostText: { fontSize: 14, fontWeight: '600', color: '#33452F' },

  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  headMid: { flex: 1 },
  kicker: { fontSize: 13, fontWeight: '600', color: INK },
  step: { marginTop: 1, fontSize: 11, color: GRAY },
  hearts: { flexDirection: 'row', gap: 3 },

  timerTrack: {
    marginTop: 10,
    marginHorizontal: 16,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#E4E9DD',
    overflow: 'hidden',
  },
  timerFill: { height: 6, borderRadius: 9999, backgroundColor: C.limeDeep },

  body: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  equationWrap: { alignItems: 'center', marginBottom: 8 },
  equation: { fontFamily: MATH_FONT, fontSize: 22, color: INK },

  scaleWrap: { borderRadius: 18 },
  scaleWrapHot: { backgroundColor: 'rgba(126,211,33,0.12)' },

  tipRow: { marginTop: 14, alignItems: 'center', minHeight: 30, justifyContent: 'center' },
  tip: { fontSize: 12, color: GRAY, textAlign: 'center' },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#EAF7DC',
    borderWidth: 1,
    borderColor: '#CBE8AC',
  },
  tipOn: { fontSize: 12.5, fontWeight: '600', color: '#2F6B14' },
  comboPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 11,
    backgroundColor: C.coinSoft, borderWidth: 1, borderColor: '#F0D3A1',
  },
  comboText: { fontSize: 12, fontWeight: '700', color: '#B4530A', letterSpacing: 0.1 },

  tray: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#F3F7EE',
    borderTopWidth: 1,
    borderTopColor: '#E6EBE0',
  },
  trayHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  trayLabel: { fontSize: 11.5, fontWeight: '600', color: GRAY, letterSpacing: 0.2 },
  trayReset: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trayResetText: { fontSize: 11.5, color: GRAY },
  trayRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },

  chip: {
    flex: 1,
    height: 48,
    maxWidth: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE4D6',
    ...shadow(INK, 5, 2, 0.08),
  },
  chipGone: { backgroundColor: '#F1F4EC', borderStyle: 'dashed', shadowOpacity: 0, elevation: 0 },
  chipText: { fontSize: 16, fontWeight: '600', color: '#1C3214' },

  ghostChip: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.lime,
    borderWidth: 1.5,
    borderColor: '#4E9420',
    zIndex: 60,
  },
  ghostText2: { fontSize: 12, fontWeight: '700', color: '#1C3214' },

  resultBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  resultArt: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 2 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 56 },
  resultTitle: { marginTop: 6, fontSize: 21, fontWeight: '600', color: INK },
  resultSub: { marginTop: 5, fontSize: 12.5, color: GRAY },
  resultSheet: {
    marginTop: 20,
    alignSelf: 'stretch',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: LINE,
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
  resultPillText: { fontSize: 12.5, fontWeight: '600', color: INK },
  resultNote: { marginTop: 10, textAlign: 'center', fontSize: 11.5, lineHeight: 16, color: GRAY },
})

export default BalanceScreen
