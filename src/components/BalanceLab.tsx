import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Path } from 'react-native-svg'
import { MATH_FONT } from '../theme/tokens'

export const BalanceLab = ({
  value,
  success = false,
  style,
}: {
  value: number | null
  success?: boolean
  style?: StyleProp<ViewStyle>
}) => {
  const tilt = useRef(new Animated.Value(0)).current
  const glow = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const next = value === null ? 0 : Math.max(-8, Math.min(8, (value - 4) * 2))
    const animation = Animated.spring(tilt, {
      toValue: next,
      friction: 9,
      tension: 72,
      useNativeDriver: true,
    })
    animation.start()
    return () => animation.stop()
  }, [tilt, value])

  useEffect(() => {
    const animation = Animated.timing(glow, {
      toValue: success ? 1 : 0,
      duration: 520,
      useNativeDriver: true,
    })
    animation.start()
    return () => animation.stop()
  }, [glow, success])

  const beamRotate = tilt.interpolate({ inputRange: [-8, 8], outputRange: ['-8deg', '8deg'] })
  const leftY = tilt.interpolate({ inputRange: [-8, 8], outputRange: [9, -9] })
  const rightY = tilt.interpolate({ inputRange: [-8, 8], outputRange: [-9, 9] })
  const haloScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.25] })
  const haloOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })

  return (
    <View style={[styles.root, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          { opacity: haloOpacity, transform: [{ scale: haloScale }] },
        ]}
      />

      <View style={styles.pillarWrap} pointerEvents="none">
        <LinearGradient
          colors={['#2D5D43', '#0C3425', '#071E15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pillar}
        />
        <LinearGradient
          colors={['#163E2A', '#071B13']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.foot}
        />
      </View>

      <Animated.View style={[styles.beamWrap, { transform: [{ rotate: beamRotate }] }]} pointerEvents="none">
        <LinearGradient
          colors={['#D4B56D', '#F0D58D', '#A8843F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.beam}
        />
        <View style={styles.beamShine} />
      </Animated.View>

      <View style={styles.pivot} pointerEvents="none">
        <LinearGradient colors={['#F3DDA0', '#A97B32']} style={styles.pivotFill} />
        <View style={styles.pivotCore} />
      </View>

      <Animated.View style={[styles.panLeft, { transform: [{ translateY: leftY }] }]} pointerEvents="none">
        <Pan value="2x + 6" weight={value} success={success} />
      </Animated.View>
      <Animated.View style={[styles.panRight, { transform: [{ translateY: rightY }] }]} pointerEvents="none">
        <Pan value="14" success={success} />
      </Animated.View>

      <View style={styles.ground} pointerEvents="none">
        <LinearGradient
          colors={['rgba(6,63,46,0.22)', 'rgba(6,63,46,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.groundFill}
        />
      </View>
    </View>
  )
}

const Pan = ({ value, weight, success = false }: { value: string; weight?: number | null; success?: boolean }) => (
  <View style={styles.pan}>
    <Svg width="126" height="112" viewBox="0 0 126 112">
      <Line x1="7" y1="4" x2="25" y2="72" stroke="#809282" strokeWidth="2" />
      <Line x1="119" y1="4" x2="101" y2="72" stroke="#809282" strokeWidth="2" />
      <Line x1="7" y1="4" x2="119" y2="4" stroke="#B89A56" strokeWidth="5" strokeLinecap="round" />
      <Path d="M14 68 Q63 116 112 68 L106 80 Q63 104 20 80 Z" fill="#214D35" />
      <Path d="M18 70 Q63 104 108 70" fill="none" stroke="#77A56D" strokeWidth="2" />
    </Svg>
    <View style={styles.panValue}>
      <Text style={styles.valueText}>{value}</Text>
      {typeof weight === 'number' && (
        <View style={[styles.miniWeight, success && styles.miniWeightOk]}>
          <Text style={styles.miniWeightText}>{weight}</Text>
        </View>
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  root: { width: 320, height: 300, alignSelf: 'center' },
  halo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: 18,
    alignSelf: 'center',
    backgroundColor: 'rgba(158,224,75,0.45)',
  },
  pillarWrap: { position: 'absolute', left: 149, top: 76, width: 22, height: 174 },
  pillar: { flex: 1, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  foot: {
    position: 'absolute',
    width: 108,
    height: 22,
    borderRadius: 11,
    left: -43,
    bottom: -8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  beamWrap: { position: 'absolute', top: 74, left: 20, width: 280, height: 22 },
  beam: { flex: 1, height: 12, borderRadius: 6, marginTop: 3 },
  beamShine: { position: 'absolute', left: 12, right: 12, top: 4, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.45)' },
  pivot: {
    position: 'absolute',
    left: 142,
    top: 61,
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  pivotFill: { flex: 1, borderRadius: 15 },
  pivotCore: { position: 'absolute', width: 10, height: 10, borderRadius: 5, left: 13, top: 13, backgroundColor: '#0A2D1E' },
  panLeft: { position: 'absolute', left: 17, top: 86, width: 126, height: 112 },
  panRight: { position: 'absolute', right: 17, top: 86, width: 126, height: 112 },
  pan: { width: 126, height: 112 },
  panValue: { position: 'absolute', left: 0, right: 0, top: 34, alignItems: 'center', gap: 5 },
  valueText: { fontFamily: MATH_FONT, fontSize: 19, color: '#123B27' },
  miniWeight: {
    minWidth: 30,
    height: 26,
    borderRadius: 8,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B88737',
    borderWidth: 1,
    borderColor: '#E1C47C',
  },
  miniWeightOk: { backgroundColor: '#6DAF2C', borderColor: '#A6EA55' },
  miniWeightText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  ground: { position: 'absolute', left: 70, right: 70, bottom: 5, height: 34, borderRadius: 17, overflow: 'hidden' },
  groundFill: { flex: 1, borderRadius: 17 },
})
