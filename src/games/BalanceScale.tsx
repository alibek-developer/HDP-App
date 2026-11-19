import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import type { ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { MATH_FONT, NUM, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { sum } from '../data/games'

/**
 * Muvozanat tarozisi — jismoniy o'yin maydoni: Lima va Ambar nur ustida
 * o'tirishadi, og'irliklar panalarda. Nur og'irlik farqi bo'yicha buriladi,
 * qahramonlar shu bilan birga uchadi, muvozanatda sakrab xursand bo'ladi.
 */

const BEAM_TOP = 62
const BEAM_H = 12
const BEAM_INSET = 84
const PAN_W = 142
const TILT_DEG = 7
const TILT_PX = 18
const RIDER = 56

const RAIL = ['#35543E', '#15281C'] as const
const RAIL_LIT = ['#8FCB62', '#5A9B34'] as const
const TRAY = ['#2E4B38', '#132318'] as const
const TRAY_LIT = ['#B4E96E', '#6FB733'] as const

const LIMA = require('../assets/games/muvozanat-lima.png') as ImageSourcePropType
const AMBAR = require('../assets/games/muvozanat-ambar.png') as ImageSourcePropType

/** Qahramon — nur ustida nafas oladi; teng bo'lganda sakraydi */
export const Rider = ({ source, cheer, delay }: { source: ImageSourcePropType; cheer: boolean; delay: number }) => {
  const bob = useRef(new Animated.Value(0)).current
  const jump = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1, duration: 900, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [bob, delay])

  useEffect(() => {
    if (!cheer) {
      jump.setValue(0)
      return undefined
    }
    const hop = Animated.loop(
      Animated.sequence([
        Animated.timing(jump, {
          toValue: 1, duration: 210, easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(jump, {
          toValue: 0, duration: 250, easing: Easing.in(Easing.quad), useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    )
    hop.start(({ finished }) => { if (finished) jump.setValue(0) })
    return () => hop.stop()
  }, [cheer, jump])

  const lift = Animated.add(
    bob.interpolate({ inputRange: [0, 1], outputRange: [0, -2.5] }),
    jump.interpolate({ inputRange: [0, 1], outputRange: [0, -11] }),
  )
  const squash = jump.interpolate({ inputRange: [0, 0.45, 1], outputRange: [1, 1.05, 1] })

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={{
        width: RIDER,
        height: RIDER,
        transform: [{ translateY: lift }, { scaleX: squash }],
      }}
    />
  )
}

const Plate = ({ value, onPress }: { value: number; onPress?: () => void }) => {
  const C = useColors()
  const s = makeS(C)
  return (
  <Pressable onPress={onPress} disabled={!onPress} style={s.plate}>
    <Text style={[s.plateText, NUM]}>{value}</Text>
  </Pressable>
  )
}

export const BalanceScale = ({
  width,
  left,
  right,
  placed,
  balanced,
  onRemovePlaced,
}: {
  width: number
  /** chap panadagi ma'lum og'irliklar */
  left: number[]
  /** o'ng panadagi og'irliklar */
  right: number[]
  /** foydalanuvchi qo'ygan og'irliklar */
  placed: number[]
  balanced: boolean
  /** qo'yilgan og'irlikni olish */
  onRemovePlaced?: (index: number) => void
}) => {
  const C = useColors()
  const s = makeS(C)
  const tilt = useRef(new Animated.Value(0)).current
  const spark = useRef(new Animated.Value(0)).current
  const leftTotal = sum(left) + sum(placed)
  const rightTotal = sum(right)
  /** o'ng og'irroq bo'lsa musbat — nur soat strelkasi bo'ylab buriladi */
  const target = Math.max(-1, Math.min(1, (rightTotal - leftTotal) / 9))

  useEffect(() => {
    Animated.spring(tilt, {
      toValue: target,
      friction: 6,
      tension: 60,
      useNativeDriver: false,
    }).start()
  }, [target, tilt])

  useEffect(() => {
    if (!balanced) {
      spark.setValue(0)
      return undefined
    }
    const pop = Animated.loop(
      Animated.sequence([
        Animated.timing(spark, {
          toValue: 1, duration: 320, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true,
        }),
        Animated.timing(spark, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]),
      { iterations: 3 }
    )
    pop.start()
    return () => pop.stop()
  }, [balanced, spark])

  const beamRotate = tilt.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${TILT_DEG}deg`, `${TILT_DEG}deg`],
  })
  const panRotate = tilt.interpolate({
    inputRange: [-1, 1],
    outputRange: [`${TILT_DEG}deg`, `-${TILT_DEG}deg`],
  })
  const leftY = tilt.interpolate({ inputRange: [-1, 1], outputRange: [TILT_PX, -TILT_PX] })
  const rightY = tilt.interpolate({ inputRange: [-1, 1], outputRange: [-TILT_PX, TILT_PX] })

  const half = width / 2
  const beamHalf = half - BEAM_INSET
  const sparkT = {
    opacity: spark,
    transform: [{ scale: spark.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }],
  }

  return (
    <View style={{ width, height: 238 }}>
      {/* yer soyasi va taglik */}
      <View style={[s.ground, { left: half - 62, top: BEAM_TOP + 172 }]} />
      <View style={[s.column, { left: half - 6, top: BEAM_TOP + 10, height: 122 }]}>
        <LinearGradient colors={['#3A5C43', '#122018']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </View>
      <View style={[s.base, { left: half - 54, top: BEAM_TOP + 128 }]}>
        <LinearGradient colors={['#2E4B38', '#0F1D14']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      </View>

      {/* nur — uchida qahramonlar o'tiradi */}
      <Animated.View
        style={[
          s.beamWrap,
          { left: BEAM_INSET, right: BEAM_INSET, top: BEAM_TOP, transform: [{ rotate: beamRotate }] },
        ]}
      >
        <View style={s.railBar}>
          <LinearGradient
            colors={balanced ? RAIL_LIT : RAIL}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.railShine} />
        </View>
        <View style={[s.knob, { left: -5 }]} />
        <View style={[s.knob, { right: -5 }]} />

        <View style={[s.rider, { left: -14, bottom: BEAM_H - 6 }]}>
          <Rider source={LIMA} cheer={balanced} delay={0} />
        </View>
        <View style={[s.rider, { right: -14, bottom: BEAM_H - 6 }]}>
          <Rider source={AMBAR} cheer={balanced} delay={380} />
        </View>

        <View style={s.pivot}>
          <MCI name="star-four-points" size={12} color="#3B2A07" />
        </View>
      </Animated.View>

      {/* muvozanat uchqunlari */}
      {balanced && (
        <>
          <Animated.View style={[s.sparkle, { left: half - 66, top: BEAM_TOP - 14 }, sparkT]}>
            <MCI name="star-four-points" size={15} color="#E8A33D" />
          </Animated.View>
          <Animated.View style={[s.sparkle, { left: half + 46, top: BEAM_TOP - 26 }, sparkT]}>
            <MCI name="star-four-points" size={11} color="#7ED321" />
          </Animated.View>
          <Animated.View style={[s.sparkle, { left: half - 24, top: BEAM_TOP + 40 }, sparkT]}>
            <MCI name="star-four-points" size={9} color="#E8A33D" />
          </Animated.View>
          <Animated.View style={[s.sparkle, { left: half + 74, top: BEAM_TOP + 56 }, sparkT]}>
            <MCI name="star-four-points" size={13} color="#9BE04B" />
          </Animated.View>
        </>
      )}

      {/* chap pana: noma'lum x + ma'lum + qo'yilgan */}
      <Animated.View
        style={[
          s.panWrap,
          { left: half - beamHalf - PAN_W / 2, top: BEAM_TOP + BEAM_H + 26, transform: [{ translateY: leftY }, { rotate: panRotate }] },
        ]}
      >
        <View style={s.hook} />
        <View style={s.weights}>
          <View style={s.xTile}>
            <Text style={s.xText}>x</Text>
          </View>
          {left.map((v, i) => <Plate key={`l${i}`} value={v} />)}
          {placed.map((v, i) => (
            <Plate key={`p${i}`} value={v} onPress={onRemovePlaced ? () => onRemovePlaced(i) : undefined} />
          ))}
        </View>
        <View style={s.tray}>
          <LinearGradient
            colors={balanced ? TRAY_LIT : TRAY}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.trayShine} />
        </View>
        <Text style={[s.panTotal, NUM, balanced && s.panTotalLit]}>x + {leftTotal}</Text>
      </Animated.View>

      {/* o'ng pana */}
      <Animated.View
        style={[
          s.panWrap,
          { left: half + beamHalf - PAN_W / 2, top: BEAM_TOP + BEAM_H + 26, transform: [{ translateY: rightY }, { rotate: panRotate }] },
        ]}
      >
        <View style={s.hook} />
        <View style={s.weights}>
          {right.map((v, i) => <Plate key={`r${i}`} value={v} />)}
        </View>
        <View style={s.tray}>
          <LinearGradient
            colors={balanced ? TRAY_LIT : TRAY}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.trayShine} />
        </View>
        <Text style={[s.panTotal, NUM, balanced && s.panTotalLit]}>{rightTotal}</Text>
      </Animated.View>
    </View>
  )
}

const makeS = (C: ThemeColors) => StyleSheet.create({
  ground: {
    position: 'absolute', width: 124, height: 18, borderRadius: 100,
    backgroundColor: 'rgba(14,26,18,0.08)',
  },
  column: { position: 'absolute', width: 12, borderRadius: 6, overflow: 'hidden' },
  base: {
    position: 'absolute', width: 108, height: 16, borderRadius: 8, overflow: 'hidden',
    ...shadow('#000', 8, 4, 0.18),
  },

  beamWrap: { position: 'absolute', height: BEAM_H },
  railBar: {
    height: BEAM_H, borderRadius: 6, overflow: 'hidden',
    ...shadow('#000', 6, 3, 0.2),
  },
  railShine: {
    position: 'absolute', left: 8, right: 8, top: 2, height: 2,
    borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)',
  },
  knob: {
    position: 'absolute', top: BEAM_H / 2 - 5, width: 10, height: 10,
    borderRadius: 5, backgroundColor: C.coin,
  },
  pivot: {
    position: 'absolute', left: '50%', marginLeft: -13, top: BEAM_H / 2 - 13,
    width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.coin, borderWidth: 2, borderColor: '#123B24',
    ...shadow(C.coin, 8, 3, 0.35),
  },
  rider: { position: 'absolute' },
  sparkle: { position: 'absolute' },

  panWrap: { position: 'absolute', width: PAN_W, alignItems: 'center' },
  hook: { width: 3, height: 16, borderRadius: 2, backgroundColor: C.inkOnLime },
  weights: {
    minHeight: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  tray: {
    width: PAN_W, height: 12, borderRadius: 6, overflow: 'hidden',
    borderWidth: 1, borderColor: C.inkOnLime,
  },
  trayShine: {
    position: 'absolute', left: 10, right: 10, top: 2, height: 2,
    borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)',
  },
  panTotal: {
    marginTop: 6, fontSize: 11.5, fontWeight: '600',
    color: C.ink3, letterSpacing: 0.2,
  },
  panTotalLit: { color: '#3F7D1C' },

  plate: {
    minWidth: 27, height: 27, paddingHorizontal: 5, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surface, borderWidth: 1, borderColor: '#DDE4D6',
    ...shadow('#000', 4, 2, 0.08),
  },
  plateText: { fontSize: 10.5, lineHeight: 14, fontWeight: '600', color: C.inkOnLime },

  xTile: {
    minWidth: 27, height: 27, paddingHorizontal: 5, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FBEC', borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.limeDeep,
  },
  xText: { fontFamily: MATH_FONT, fontSize: 15, lineHeight: 20, color: C.limeDeep },
})
