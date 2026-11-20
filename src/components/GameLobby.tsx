import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import {
  Animated, Easing, Pressable, StyleSheet, Text, View,
} from 'react-native'
import type { ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import type { EdgeInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { GRAD_LIME } from '../theme/solver'
import { NUM, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

export interface LobbyLevel<T extends string = string> {
  id: T
  title: string
  sub: string
}

interface Props<T extends string> {
  title: string
  blurb?: string
  art: ImageSourcePropType
  mark: ReactNode
  accent: string
  accentSoft: string
  accentInk: string
  levels: LobbyLevel<T>[]
  selected: T
  starsFor: (levelId: T) => number
  plays?: number
  insets: EdgeInsets
  onBack: () => void
  onSelect: (levelId: T) => void
  onStart: () => void
}

/**
 * O'yinlarning umumiy daraja tanlash ekrani: oq fonda illyustratsiya butun ekranni
 * egallaydi, pastda daraja kartalari. Har o'yin o'z aksent rangini beradi.
 */
export function GameLobby<T extends string>({
  title, blurb, art, mark, accent, accentSoft, accentInk,
  levels, selected, starsFor, plays = 0, insets, onBack, onSelect, onStart,
}: Props<T>) {
  const C = useColors()
  const s = makeS(C)
  const pulse = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(1200),
    ]))
    loop.start()
    return () => loop.stop()
  }, [pulse])
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] })
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] })

  const kb = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(kb, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(kb, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [kb])
  const kbScale = kb.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] })

  const enter = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
  }, [enter])
  const enterY = enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] })

  const maxStars = levels.length * 3
  const total = levels.reduce((n, l) => n + starsFor(l.id), 0)
  const best = levels.reduce((n, l) => Math.max(n, starsFor(l.id)), 0)

  return (
    <View style={s.screen}>
      <Animated.Image
        source={art}
        style={[StyleSheet.absoluteFill, { transform: [{ scale: kbScale }] }]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', C.surface, C.surface]}
        locations={[0, 0.54, 0.68, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={[s.head, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onBack} accessibilityLabel="Orqaga" hitSlop={10} style={s.back}>
          <Ionicons name="chevron-back" size={18} color={C.ink2} />
        </Pressable>
        <Text style={s.kicker}>Daraja tanlash</Text>
        <View style={s.headStars}>
          <Ionicons name="star" size={10} color={C.coin} />
          <Text style={[s.headStarsText, NUM]}>{total}/{maxStars}</Text>
        </View>
      </View>

      <View style={s.spacer} pointerEvents="none" />

      <Animated.View style={[s.body, { opacity: enter, transform: [{ translateY: enterY }] }]}>
        <View style={s.titleRow}>
          <View style={[s.markChip, { backgroundColor: accentSoft }]}>{mark}</View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{title}</Text>
            {!!blurb && <Text style={s.blurb} numberOfLines={1}>{blurb}</Text>}
          </View>
        </View>

        <View style={s.pathHead}>
          <Text style={s.pathLabel}>Darajalar</Text>
          <Text style={[s.pathCount, NUM]}>{levels.length} ta bosqich</Text>
        </View>

        <View>
          {levels.map((lvl, i) => {
            const lvBest = starsFor(lvl.id)
            const on = lvl.id === selected
            const prevDone = i > 0 && starsFor(levels[i - 1].id) > 0
            return (
              <View key={lvl.id}>
                {i > 0 && (
                  <View style={s.trail} pointerEvents="none">
                    {[0, 1, 2].map(d => (
                      <View
                        key={d}
                        style={[s.trailDash, { backgroundColor: prevDone ? accent : C.line }]}
                      />
                    ))}
                  </View>
                )}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${i + 1}-daraja: ${lvl.title}, ${lvBest} yulduz`}
                  onPress={() => { triggerHaptic('selection'); onSelect(lvl.id) }}
                  style={({ pressed }) => [s.row, pressed && { opacity: 0.92 }]}
                >
                  <View style={s.nodeCol}>
                    {on && (
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          s.pulseRing,
                          { borderColor: accent, opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
                        ]}
                      />
                    )}
                    <View
                      style={[
                        s.node,
                        lvBest > 0 && !on && { borderColor: accent },
                        on && { borderColor: accent, backgroundColor: accent, ...shadow(accent, 8, 3, 0.3) },
                      ]}
                    >
                      <Text style={[s.nodeNum, NUM, { color: on ? accentInk : C.ink2 }]}>{i + 1}</Text>
                    </View>
                  </View>

                  <View style={[s.bubble, on && { backgroundColor: accentSoft, borderColor: accent }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.bubbleTitle}>{lvl.title}</Text>
                      <Text style={[s.bubbleSub, NUM]} numberOfLines={1}>{lvl.sub}</Text>
                    </View>
                    <View style={s.starsChip}>
                      <Ionicons
                        name={lvBest > 0 ? 'star' : 'star-outline'}
                        size={10}
                        color={lvBest > 0 ? C.coin : C.ink4}
                      />
                      <Text style={[s.starsChipText, { color: lvBest > 0 ? C.ink : C.ink4 }]}>
                        {lvBest}/3
                      </Text>
                    </View>
                    {on && (
                      <View style={[s.check, { backgroundColor: accent }]}>
                        <Ionicons name="checkmark" size={11} color={accentInk} />
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>
            )
          })}
        </View>

        {plays > 0 && (
          <Text style={[s.plays, NUM]}>
            {plays} ta urinish · rekord {best}<Text style={{ color: C.coin }}>★</Text>
          </Text>
        )}

        <Pressable onPress={onStart} accessibilityRole="button" style={[s.ctaWrap, { marginBottom: insets.bottom + 14 }]}>
          {({ pressed }) => (
            <LinearGradient
              colors={GRAD_LIME}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.cta, pressed && { transform: [{ translateY: 2 }] }]}
            >
              <Text style={s.ctaText}>Boshlash</Text>
              <Ionicons name="play" size={16} color={C.inkOnLime} />
            </LinearGradient>
          )}
        </Pressable>
      </Animated.View>
    </View>
  )
}

const makeS = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.surface },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 6,
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
  kicker: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2, color: C.ink2 },
  headStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  headStarsText: { fontSize: 11, fontWeight: '700', color: C.ink },

  spacer: { flex: 1 },
  body: { paddingHorizontal: 16 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 12,
  },
  markChip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.4,
    fontWeight: '800',
    color: C.ink,
  },
  blurb: {
    marginTop: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: C.ink3,
  },

  pathHead: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pathLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: C.ink4,
  },
  pathCount: { fontSize: 10.5, fontWeight: '600', color: C.ink4 },

  trail: { marginLeft: 25, marginVertical: 3 },
  trailDash: { width: 3, height: 4, borderRadius: 1.5, marginVertical: 2 },

  row: { flexDirection: 'row', alignItems: 'center' },
  nodeCol: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  node: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNum: { fontSize: 16, fontWeight: '800' },

  bubble: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 13,
    paddingRight: 10,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.surface,
  },
  bubbleTitle: { fontSize: 14.5, lineHeight: 18, fontWeight: '600', color: C.ink },
  bubbleSub: { marginTop: 1, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: C.ink3 },
  starsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: C.leafTint,
  },
  starsChipText: { fontSize: 10.5, fontWeight: '700' },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plays: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 10.5,
    fontWeight: '500',
    color: C.ink4,
  },

  ctaWrap: { borderRadius: 18, marginTop: 12 },
  cta: {
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { fontSize: 15.5, fontWeight: '700', color: C.inkOnLime },
})
