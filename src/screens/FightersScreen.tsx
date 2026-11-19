import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { useApp } from '../store/useStore'
import { SolveTopBar } from '../components/SolveKit'
import { FightersMark } from '../components/GameMarks'
import { ABS_FILL, C, MATH_FONT, NUM, shadow } from '../theme/tokens'
import { GRAD_LIME } from '../theme/solver'
import {
  FIGHTER_LEVELS, applyFighterOp, buildFighterHand, fighterOutcome,
  type FighterHand, type FighterLevel, type FighterLevelId, type FighterOp,
} from '../data/games'

/**
 * Raqam jangchilari — navbatga asoslangan duel. Raqib qalqonida yashiringan
 * sonni qo'ldagi ikki chip va amal bilan urasiz. To'g'ri hujum raqibning
 * bitta ochkosini yechadi, xato bo'lsa zarba sizga qaytadi.
 */

type Phase = 'lobby' | 'play' | 'result'

const INK = '#0E1A12'
const GRAY = '#6B7C66'
const FAINT = '#9AA995'
const LINE = '#E1E7DA'
const AMBER = '#E8A33D'
const AMBER_DEEP = '#B87A22'
const AMBER_SOFT = '#FCF1DC'

const FightersScreen = () => {
  const insets = useSafeAreaInsets()
  const exit = useExit('Main')
  const creditGame = useApp(s => s.creditGame)
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)

  const [phase, setPhase] = useState<Phase>('lobby')
  const [levelId, setLevelId] = useState<FighterLevelId>('easy')
  const [hand, setHand] = useState<FighterHand | null>(null)
  const [chosen, setChosen] = useState<number[]>([])
  const [op, setOp] = useState<FighterOp>('+')
  const [enemyHp, setEnemyHp] = useState(0)
  const [playerHp, setPlayerHp] = useState(0)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [outcome, setOutcome] = useState({ stars: 0, coins: 0, xp: 0, hits: 0, hpLeft: 0 })

  const level = useMemo(
    () => FIGHTER_LEVELS.find(l => l.id === levelId) ?? FIGHTER_LEVELS[0],
    [levelId],
  )

  const levelRef = useRef(level)
  const hitsRef = useRef(0)
  const hpRef = useRef(0)
  const lock = useRef(false)
  const credited = useRef(false)
  const finishing = useRef(false)
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const bob = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const hitFx = useRef(new Animated.Value(0)).current
  const shake = useRef(new Animated.Value(0)).current

  useEffect(() => () => {
    if (turnTimer.current) clearTimeout(turnTimer.current)
  }, [])

  /** Raqib doimiy tebranadi — arena tirik turadi */
  useEffect(() => {
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1500, useNativeDriver: true }),
    ]))
    anim.start()
    return () => anim.stop()
  }, [bob])

  /** Qalqon atrofidagi halqa nafas oladi */
  useEffect(() => {
    const anim = Animated.loop(Animated.timing(pulse, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: true,
    }))
    anim.start()
    return () => anim.stop()
  }, [pulse])

  const finish = () => {
    if (finishing.current) return
    finishing.current = true
    if (turnTimer.current) clearTimeout(turnTimer.current)
    const lvl = levelRef.current
    const out = fighterOutcome(hitsRef.current, lvl.hp, hpRef.current, lvl.playerHp)
    setOutcome({ ...out, hits: hitsRef.current, hpLeft: Math.max(0, hpRef.current) })
    setPhase('result')
  }

  const startLevel = (lvl: FighterLevel) => {
    triggerHaptic('medium')
    if (turnTimer.current) clearTimeout(turnTimer.current)
    hitFx.stopAnimation()
    hitFx.setValue(0)
    shake.stopAnimation()
    shake.setValue(0)
    credited.current = false
    lock.current = false
    finishing.current = false
    hitsRef.current = 0
    hpRef.current = lvl.playerHp
    levelRef.current = lvl
    setLevelId(lvl.id)
    setHand(buildFighterHand(lvl, null))
    setChosen([])
    setOp(lvl.ops[0])
    setEnemyHp(lvl.hp)
    setPlayerHp(lvl.playerHp)
    setMessage(null)
    setPhase('play')
  }

  /** Natija ochilganda mukofot bir marta yoziladi */
  useEffect(() => {
    if (phase !== 'result' || credited.current) return
    credited.current = true
    creditGame('fighters', levelRef.current.id, outcome.stars, outcome.coins, outcome.xp)
  }, [phase, creditGame, outcome])

  const nextTurn = (avoid: number) => {
    setHand(buildFighterHand(levelRef.current, avoid))
    setChosen([])
    setMessage(null)
    lock.current = false
  }

  const pickChip = (i: number) => {
    if (phase !== 'play' || lock.current) return
    triggerHaptic('selection')
    setMessage(null)
    setChosen(prev => {
      if (prev.includes(i)) return prev.filter(x => x !== i)
      if (prev.length >= 2) return [prev[0], i]
      return [...prev, i]
    })
  }

  const attack = () => {
    if (!hand || chosen.length < 2 || lock.current) return
    const lvl = levelRef.current
    const a = hand.chips[chosen[0]]
    const b = hand.chips[chosen[1]]
    const val = applyFighterOp(a, b, op)
    lock.current = true

    if (val === hand.target) {
      triggerHaptic('success')
      hitsRef.current += 1
      const left = Math.max(0, lvl.hp - hitsRef.current)
      setEnemyHp(left)
      setMessage({ text: `To'g'ri — ${a} ${op} ${b} = ${val}`, ok: true })
      Animated.sequence([
        Animated.timing(hitFx, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(hitFx, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start()
      turnTimer.current = setTimeout(() => {
        if (hitsRef.current >= lvl.hp) finish()
        else nextTurn(hand.target)
      }, 820)
      return
    }

    triggerHaptic('error')
    hpRef.current = Math.max(0, hpRef.current - 1)
    setPlayerHp(hpRef.current)
    setMessage({ text: `Xato — ${a} ${op} ${b} = ${val}. Nishon ${hand.target}`, ok: false })
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0.5, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start()
    turnTimer.current = setTimeout(() => {
      if (hpRef.current <= 0) finish()
      else nextTurn(hand.target)
    }, 1050)
  }

  const best = gameStars[`fighters:${levelId}`] ?? 0
  const plays = gamePlays.fighters ?? 0

  /* ── Lobby ── */
  if (phase === 'lobby') {
    return (
      <View style={s.screen}>
        <View style={[s.lobbyHead, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={exit} accessibilityLabel="Orqaga" hitSlop={10} style={s.back}>
            <Ionicons name="chevron-back" size={18} color="#33452F" />
          </Pressable>
          <Text style={s.lobbyKicker}>O&apos;yin</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={s.lobbyBody}>
          <View style={s.hero}>
            <LinearGradient
              colors={['#3A2A0E', '#0E1A12']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ABS_FILL}
            />
            <View style={s.heroOrb} />
            <View style={s.heroIcon}>
              <FightersMark size={24} color="#F6D8A6" />
            </View>
            <Text style={s.heroTitle}>Raqam jangchilari</Text>
            <Text style={s.heroSub}>
              Raqib qalqonida yashiringan sonni qo&apos;ldagi ikki chip bilan uring.
              Har to&apos;g&apos;ri hujum uning bir ochkosini yechadi — xato bo&apos;lsa zarba sizga qaytadi.
            </Text>
          </View>

          {FIGHTER_LEVELS.map(lvl => {
            const lvBest = gameStars[`fighters:${lvl.id}`] ?? 0
            const on = lvl.id === levelId
            return (
              <Pressable
                key={lvl.id}
                onPress={() => { triggerHaptic('selection'); setLevelId(lvl.id) }}
                style={({ pressed }) => [s.level, on && s.levelOn, pressed && { opacity: 0.9 }]}
              >
                <View style={s.levelMain}>
                  <Text style={s.levelTitle}>{lvl.title}</Text>
                  <Text style={[s.levelSub, NUM]}>{lvl.sub}</Text>
                </View>
                <View style={s.levelStars}>
                  {[0, 1, 2].map(i => (
                    <Ionicons
                      key={i}
                      name={i < lvBest ? 'star' : 'star-outline'}
                      size={13}
                      color={i < lvBest ? AMBER : '#C9D2C1'}
                    />
                  ))}
                </View>
                <View style={[s.levelRadio, on && s.levelRadioOn]}>
                  {on && <View style={s.levelRadioDot} />}
                </View>
              </Pressable>
            )
          })}

          {plays > 0 && (
            <Text style={[s.plays, NUM]}>Shu o&apos;yinda {plays} ta urinish · eng yaxshi {best} yulduz</Text>
          )}
        </View>

        <View style={[s.lobbyFoot, { paddingBottom: insets.bottom + 14 }]}>
          <Pressable onPress={() => startLevel(level)} accessibilityRole="button" style={s.ctaWrap}>
            {({ pressed }) => (
              <LinearGradient
                colors={GRAD_LIME}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[s.cta, pressed && { transform: [{ translateY: 2 }] }]}
              >
                <Text style={s.ctaText}>Jangni boshlash</Text>
                <Ionicons name="flash" size={16} color={C.inkOnLime} />
              </LinearGradient>
            )}
          </Pressable>
        </View>
      </View>
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
          <View style={s.starsRow}>
            {[0, 1, 2].map(i => (
              <Ionicons
                key={i}
                name={i < outcome.stars ? 'star' : 'star-outline'}
                size={i === 1 ? 46 : 36}
                color={i < outcome.stars ? AMBER : '#C9D2C1'}
                style={i === 1 && { marginTop: -12 }}
              />
            ))}
          </View>

          <Text style={s.resultTitle}>
            {outcome.stars === 3 ? "Mukammal g'alaba" : outcome.stars > 0 ? "G'alaba" : "Mag'lubiyat"}
          </Text>
          <Text style={[s.resultSub, NUM]}>
            {outcome.hits} zarba · {outcome.hpLeft}/{level.playerHp} HP · {level.title}
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
                <Ionicons name="star" size={13} color={AMBER} />
                <Text style={[s.resultPillText, NUM]}>rekord {Math.max(outcome.stars, best)}/3</Text>
              </View>
            </View>
            <Text style={s.resultNote}>
              {outcome.stars === 3
                ? "Qalqonni bir marta ham xato qilmasdan yordingiz."
                : outcome.stars > 0
                  ? "3 yulduz uchun hech xato qilmasdan g'alaba qozoning."
                  : "Qalqon sonini to'g'ri urish uchun avval amalni tanlab oling."}
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
                <Text style={s.ctaText}>Yana jang</Text>
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

  if (!hand) return <View style={s.screen} />

  const a = chosen[0] != null ? hand.chips[chosen[0]] : null
  const b = chosen[1] != null ? hand.chips[chosen[1]] : null
  const ready = chosen.length === 2

  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -4] })
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] })
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] })
  const hitScale = hitFx.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] })
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-7, 7] })

  /* ── O'yin ── */
  return (
    <View style={s.screen}>
      <SolveTopBar style={{ paddingTop: insets.top + 8 }}>
        <View style={s.headRow}>
          <Pressable onPress={exit} accessibilityLabel="Chiqish" hitSlop={10} style={s.back}>
            <Ionicons name="chevron-back" size={18} color="#33452F" />
          </Pressable>
          <View style={s.headMid}>
            <Text style={s.kicker} numberOfLines={1}>Raqam jangchilari · {level.title}</Text>
            <Text style={[s.step, NUM]}>
              Zarbalar {level.hp - enemyHp}/{level.hp} · qalqon {hand.target}
            </Text>
          </View>
          <View style={s.lives}>
            <Ionicons name="heart" size={13} color={C.danger} />
            <Text style={[s.livesText, NUM]}>{playerHp}</Text>
          </View>
        </View>
      </SolveTopBar>

      <View style={s.playBody}>
        <View style={s.arena}>
          <LinearGradient
            colors={['#1D2E22', '#0E1A12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={ABS_FILL}
          />

          <Animated.View
            style={[s.tile, { transform: [{ translateY: bobY }, { scale: hitScale }] }]}
          >
            <Animated.View style={[s.hitGlow, { opacity: hitFx }]} />
            <View style={s.avatarEnemy}>
              <Text style={s.avatarOp}>{op}</Text>
            </View>
            <Text style={s.tileTag}>RAQIB</Text>
            <View style={s.segRow}>
              {Array.from({ length: level.hp }).map((_, i) => (
                <View key={i} style={[s.seg, i < enemyHp && s.segOn]} />
              ))}
            </View>
          </Animated.View>

          <Text style={s.vs}>VS</Text>

          <Animated.View style={[s.tile, { transform: [{ translateX: shakeX }] }]}>
            <View style={s.avatarYou}>
              <FightersMark size={20} color="#CDE9AE" />
            </View>
            <Text style={s.tileTag}>SIZ</Text>
            <View style={s.heartRow}>
              {Array.from({ length: level.playerHp }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < playerHp ? 'heart' : 'heart-outline'}
                  size={11}
                  color={i < playerHp ? '#8CE86A' : 'rgba(255,255,255,0.28)'}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        <View style={s.shield}>
          <View style={s.shieldLeft}>
            <View style={s.shieldIconWrap}>
              <Animated.View
                style={[s.pulseRing, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
              />
              <Ionicons name="shield-half" size={17} color={AMBER_DEEP} />
            </View>
            <View>
              <Text style={s.shieldLabel}>QALQON</Text>
              <Text style={s.shieldHint}>Shu sonni uring</Text>
            </View>
          </View>
          <Text style={s.shieldNum}>{hand.target}</Text>
        </View>

        <View style={s.expr}>
          <Text style={[s.exprNum, a == null && s.exprDim]}>{a ?? '·'}</Text>
          <Text style={[s.exprOp, a == null && s.exprDim]}>{op}</Text>
          <Text style={[s.exprNum, b == null && s.exprDim]}>{b ?? '·'}</Text>
          <Text style={s.exprEq}>=</Text>
          <Text style={s.exprQ}>?</Text>
        </View>

        <View style={s.chipRow}>
          {hand.chips.map((v, i) => {
            const on = chosen.includes(i)
            return (
              <Pressable
                key={`${v}-${i}`}
                onPress={() => pickChip(i)}
                accessibilityRole="button"
                accessibilityLabel={`Chip ${v}`}
                style={({ pressed }) => [s.chip, on && s.chipOn, pressed && { opacity: 0.85 }]}
              >
                <Text style={[s.chipNum, on && s.chipNumOn]}>{v}</Text>
                {on && (
                  <View style={s.chipBadge}>
                    <Text style={s.chipBadgeText}>{chosen.indexOf(i) + 1}</Text>
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>

        {level.ops.length > 1 && (
          <View style={s.opRow}>
            {level.ops.map(o => {
              const on = o === op
              return (
                <Pressable
                  key={o}
                  onPress={() => { triggerHaptic('selection'); setOp(o) }}
                  accessibilityRole="button"
                  accessibilityLabel={`Amal ${o}`}
                  style={[s.opPill, on && s.opPillOn]}
                >
                  <Text style={[s.opText, on && s.opTextOn]}>{o}</Text>
                </Pressable>
              )
            })}
          </View>
        )}

        <View style={s.msgWrap}>
          {message ? (
            <View style={[s.msgPill, !message.ok && s.msgPillBad]}>
              <Ionicons
                name={message.ok ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={message.ok ? '#3F7D1C' : C.danger}
              />
              <Text style={[s.msgText, { color: message.ok ? '#2F6B14' : '#B23A2F' }]} numberOfLines={1}>
                {message.text}
              </Text>
            </View>
          ) : (
            <Text style={s.msgHint}>Ikki chipni tanlang — amal natijasi qalqonga teng bo&apos;lsin</Text>
          )}
        </View>
      </View>

      <View style={[s.playFoot, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable
          onPress={attack}
          disabled={!ready}
          accessibilityRole="button"
          accessibilityLabel="Hujum"
          style={s.ctaWrap}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={GRAD_LIME}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                s.cta,
                !ready && s.ctaOff,
                pressed && ready && { transform: [{ translateY: 2 }] },
              ]}
            >
              <Text style={[s.ctaText, !ready && { color: '#5F7357' }]}>Hujum</Text>
              <Ionicons name="flash" size={16} color={ready ? C.inkOnLime : '#5F7357'} />
            </LinearGradient>
          )}
        </Pressable>
      </View>
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

  lobbyBody: { flex: 1, paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  hero: { borderRadius: 16, overflow: 'hidden', padding: 16 },
  heroOrb: {
    position: 'absolute',
    right: -30,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(232,163,61,0.24)',
  },
  heroIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(246,216,166,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(246,216,166,0.32)',
    marginBottom: 10,
  },
  heroTitle: { fontSize: 21, fontWeight: '600', color: '#FFFFFF', letterSpacing: -0.3 },
  heroSub: { marginTop: 5, fontSize: 12.5, lineHeight: 18, color: '#C6D9C1' },

  level: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: LINE,
  },
  levelOn: { borderColor: '#F0C98A', backgroundColor: '#FDF6E9', ...shadow(AMBER, 8, 3, 0.16) },
  levelMain: { flex: 1 },
  levelTitle: { fontSize: 14.5, fontWeight: '600', color: INK },
  levelSub: { marginTop: 2, fontSize: 11.5, color: GRAY },
  levelStars: { flexDirection: 'row', gap: 2 },
  levelRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D3DBCB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRadioOn: { borderColor: AMBER },
  levelRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: AMBER },
  plays: { marginTop: 2, textAlign: 'center', fontSize: 11, color: FAINT },

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
  ctaOff: {
    backgroundColor: '#DCE3D5',
    shadowOpacity: 0,
    elevation: 0,
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
  lives: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: AMBER_SOFT,
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.28)',
  },
  livesText: { fontSize: 12, fontWeight: '600', color: AMBER_DEEP },

  playBody: { flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 9 },

  arena: { borderRadius: 16, overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch', padding: 10, gap: 6 },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  hitGlow: {
    ...ABS_FILL,
    borderRadius: 12,
    backgroundColor: 'rgba(217,83,79,0.5)',
  },
  avatarEnemy: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,163,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(246,216,166,0.4)',
  },
  avatarOp: { fontFamily: MATH_FONT, fontSize: 19, lineHeight: 21, color: '#F6D8A6' },
  avatarYou: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(205,233,174,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.32)',
  },
  tileTag: { fontSize: 9.5, letterSpacing: 0.8, fontWeight: '600', color: 'rgba(255,255,255,0.55)' },
  segRow: { flexDirection: 'row', gap: 3, width: '72%' },
  seg: { flex: 1, height: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.13)' },
  segOn: { backgroundColor: '#E2725B' },
  heartRow: { flexDirection: 'row', gap: 3 },
  vs: { alignSelf: 'center', fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.35)' },

  shield: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0D6AC',
    ...shadow(AMBER, 9, 3, 0.12),
  },
  shieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  shieldIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AMBER_SOFT,
  },
  pulseRing: {
    ...ABS_FILL,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: AMBER,
  },
  shieldLabel: { fontSize: 10, letterSpacing: 0.9, fontWeight: '600', color: AMBER_DEEP },
  shieldHint: { marginTop: 1, fontSize: 11, color: GRAY },
  shieldNum: { fontFamily: MATH_FONT, fontSize: 30, lineHeight: 34, color: INK, paddingHorizontal: 6 },

  expr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 7,
  },
  exprNum: { fontFamily: MATH_FONT, fontSize: 20, lineHeight: 26, color: INK, minWidth: 24, textAlign: 'center' },
  exprOp: { fontFamily: MATH_FONT, fontSize: 18, lineHeight: 24, color: AMBER_DEEP },
  exprEq: { fontFamily: MATH_FONT, fontSize: 17, lineHeight: 24, color: FAINT },
  exprQ: { fontFamily: MATH_FONT, fontSize: 22, lineHeight: 28, color: AMBER },
  exprDim: { color: '#C9D2C1' },

  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: LINE,
  },
  chipOn: { borderColor: AMBER, backgroundColor: '#FDF6E9', ...shadow(AMBER, 6, 3, 0.18) },
  chipNum: { fontSize: 18, fontWeight: '600', color: INK },
  chipNumOn: { color: AMBER_DEEP },
  chipBadge: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AMBER,
  },
  chipBadgeText: { fontSize: 9, fontWeight: '700', color: '#3A2A0E' },

  opRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  opPill: {
    minWidth: 54,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: LINE,
  },
  opPillOn: { borderColor: AMBER, backgroundColor: AMBER },
  opText: { fontFamily: MATH_FONT, fontSize: 16, lineHeight: 20, color: GRAY },
  opTextOn: { color: '#3A2A0E' },

  msgWrap: { marginTop: 'auto', alignItems: 'center', minHeight: 30, justifyContent: 'center' },
  msgHint: { fontSize: 12, color: GRAY, textAlign: 'center' },
  msgPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#EAF7DC',
    borderWidth: 1,
    borderColor: '#CBE8AC',
  },
  msgPillBad: { backgroundColor: '#FBEAE8', borderColor: '#F0C6C1' },
  msgText: { flexShrink: 1, fontSize: 12.5, fontWeight: '600' },

  playFoot: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#F3F7EE' },

  resultBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
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

export default FightersScreen
