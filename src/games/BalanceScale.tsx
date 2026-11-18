import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { C, MATH_FONT, NUM, shadow } from '../theme/tokens'
import { sum } from '../data/games'

/**
 * Muvozanat tarozisi — faqat View'lar bilan qurilgan: nur markaz atrofida
 * buriladi, panalar qarama-qarshi siljiydi va o'z holicha tekis qoladi.
 * Farq qancha katta bo'lsa, og'ish shuncha kuchli (8° / 20 px chegarada).
 */

const BEAM_TOP = 18
const BEAM_H = 10
const BEAM_INSET = 78
const PAN_W = 150
const TILT_DEG = 8
const TILT_PX = 20

const INK = '#0E1A12'
const RAIL = ['#22402C', '#0E1A12'] as const

const Plate = ({ value, onPress }: { value: number; onPress?: () => void }) => (
  <Pressable onPress={onPress} disabled={!onPress} style={s.plate}>
    <Text style={[s.plateText, NUM]}>{value}</Text>
  </Pressable>
)

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
  const tilt = useRef(new Animated.Value(0)).current
  const leftTotal = sum(left) + sum(placed)
  const rightTotal = sum(right)
  /** o'ng og'irroq bo'lsa musbat — nur soat strelkasi bo'ylab buriladi */
  const target = Math.max(-1, Math.min(1, (rightTotal - leftTotal) / 9))

  useEffect(() => {
    Animated.spring(tilt, {
      toValue: target,
      friction: 7,
      tension: 70,
      useNativeDriver: false,
    }).start()
  }, [target, tilt])

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

  return (
    <View style={{ width, height: 214 }}>
      {/* ustun va taglik */}
      <View style={[s.column, { left: half - 5, top: BEAM_TOP + 26, height: 148 }]} />
      <View style={[s.base, { left: half - 52, top: BEAM_TOP + 168 }]} />

      {/* nur */}
      <Animated.View
        style={[
          s.beam,
          { left: BEAM_INSET, right: BEAM_INSET, top: BEAM_TOP, transform: [{ rotate: beamRotate }] },
        ]}
      >
        <LinearGradient colors={RAIL} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={[s.cap, { left: beamHalf - 9 }]} />
      </Animated.View>

      {/* chap pana: noma'lum x + ma'lum + qo'yilgan */}
      <Animated.View
        style={[
          s.panWrap,
          { left: half - beamHalf - PAN_W / 2, top: BEAM_TOP + BEAM_H + 14, transform: [{ translateY: leftY }, { rotate: panRotate }] },
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
        <View style={[s.tray, balanced && s.trayLit]} />
        <Text style={[s.panTotal, NUM, balanced && s.panTotalLit]}>x + {leftTotal}</Text>
      </Animated.View>

      {/* o'ng pana */}
      <Animated.View
        style={[
          s.panWrap,
          { left: half + beamHalf - PAN_W / 2, top: BEAM_TOP + BEAM_H + 14, transform: [{ translateY: rightY }, { rotate: panRotate }] },
        ]}
      >
        <View style={s.hook} />
        <View style={s.weights}>
          {right.map((v, i) => <Plate key={`r${i}`} value={v} />)}
        </View>
        <View style={[s.tray, balanced && s.trayLit]} />
        <Text style={[s.panTotal, NUM, balanced && s.panTotalLit]}>{rightTotal}</Text>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  beam: {
    position: 'absolute',
    height: BEAM_H,
    borderRadius: 5,
    overflow: 'hidden',
    ...shadow(INK, 6, 3, 0.18),
  },
  cap: {
    position: 'absolute',
    top: -2,
    width: 18,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9BE04B',
    borderWidth: 1.5,
    borderColor: '#123B24',
  },
  column: { position: 'absolute', width: 10, borderRadius: 5, backgroundColor: '#1C3214' },
  base: {
    position: 'absolute',
    width: 104,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#123B24',
    ...shadow(INK, 8, 4, 0.16),
  },

  panWrap: { position: 'absolute', width: PAN_W, alignItems: 'center' },
  hook: { width: 2, height: 12, backgroundColor: '#1C3214' },
  weights: {
    minHeight: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 6,
    paddingBottom: 3,
  },
  tray: {
    width: PAN_W,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#123B24',
    borderWidth: 1,
    borderColor: '#1C3214',
  },
  trayLit: {
    backgroundColor: '#5FAF22',
    borderColor: '#2F6B14',
    ...shadow(C.limeDeep, 10, 4, 0.4),
  },
  panTotal: {
    marginTop: 5,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7C66',
    letterSpacing: 0.2,
  },
  panTotalLit: { color: '#3F7D1C' },

  plate: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE4D6',
    ...shadow(INK, 4, 2, 0.08),
  },
  plateText: { fontSize: 10.5, fontWeight: '600', color: '#1C3214' },

  xTile: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FBEC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5FAF22',
  },
  xText: { fontFamily: MATH_FONT, fontSize: 15, color: '#2F6B14' },
})
