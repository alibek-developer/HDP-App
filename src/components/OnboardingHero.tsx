import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import type { LayoutChangeEvent } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Line, Path, RadialGradient, Stop } from 'react-native-svg'

const AnimatedPath = Animated.createAnimatedComponent(Path)

/** O'sish yo'li — pastdan yuqoriga silliq yoy */
const TRAIL = 'M 24,252 C 84,250 92,196 148,182 C 206,168 220,110 292,84'
const DASH = 360

/**
 * Kutib olish sahnaligi — oq fonda chizilgan yo'l. Hech qanday yozuv yo'q:
 * faqat iz, uning ustidagi nuqtalar va cho'qqida nafas olayotgan yorug'lik.
 * Ramka va soya yo'q, shuning uchun ekranning o'zida "chizilgan"dek turadi.
 */
const OnboardingHero = () => {
  const draw = useRef(new Animated.Value(0)).current
  const breathe = useRef(new Animated.Value(0)).current
  const spin = useRef(new Animated.Value(0)).current
  const driftA = useRef(new Animated.Value(0)).current
  const driftB = useRef(new Animated.Value(0)).current
  const [box, setBox] = useState(0)

  const measure = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setBox(Math.max(0, Math.min(width, 380, height * 1.2)))
  }

  useEffect(() => {
    const loop = (value: Animated.Value, duration: number, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      )

    const intro = Animated.timing(draw, {
      toValue: 1,
      duration: 1500,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    })
    const breatheLoop = loop(breathe, 1700)
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true }),
    )
    const driftA_Loop = loop(driftA, 2800)
    const driftB_Loop = loop(driftB, 3200, 400)

    intro.start()
    breatheLoop.start()
    spinLoop.start()
    driftA_Loop.start()
    driftB_Loop.start()

    return () => {
      intro.stop()
      breatheLoop.stop()
      spinLoop.stop()
      driftA_Loop.stop()
      driftB_Loop.stop()
    }
  }, [draw, breathe, spin, driftA, driftB])

  const dash = draw.interpolate({ inputRange: [0, 1], outputRange: [DASH, 0] })
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] })
  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.14] })
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
  const floatA = driftA.interpolate({ inputRange: [0, 1], outputRange: [0, -9] })
  const floatB = driftB.interpolate({ inputRange: [0, 1], outputRange: [0, 8] })

  return (
    <View style={styles.holder} pointerEvents="none" onLayout={measure}>
      {box > 0 && (
        <View style={[styles.box, { width: box }]}>
          <Animated.View
            style={[
              styles.glow,
              { opacity: glowOpacity, transform: [{ scale: glowScale }] },
            ]}
          />
      <Svg width="100%" height="100%" viewBox="0 0 360 300">
        <Defs>
          <RadialGradient id="wash" cx="0.74" cy="0.26" r="0.62">
            <Stop offset="0" stopColor="#CDE9AE" stopOpacity="0.55" />
            <Stop offset="0.55" stopColor="#E6F5D2" stopOpacity="0.28" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#0B6E4F" />
            <Stop offset="0.55" stopColor="#5FAF22" />
            <Stop offset="1" stopColor="#9BE04B" />
          </LinearGradient>
        </Defs>

        <Circle cx="266" cy="78" r="184" fill="url(#wash)" />

        <Line x1="24" y1="252" x2="336" y2="252" stroke="#E7F0DF" strokeWidth="1.4" strokeDasharray={[2, 9]} />

        <Circle cx="292" cy="84" r="30" fill="none" stroke="#EFF8EC" strokeWidth="1.4" />
        <Circle cx="292" cy="84" r="46" fill="none" stroke="#F3FAEC" strokeWidth="1.2" />

        <Path d={TRAIL} fill="none" stroke="#CDE9AE" strokeWidth="18" strokeLinecap="round" opacity="0.35" />

        <AnimatedPath
          d={TRAIL}
          fill="none"
          stroke="url(#trail)"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeDasharray={[DASH, DASH]}
          strokeDashoffset={dash}
        />

        <Circle cx="82" cy="226" r="3.4" fill="#FFFFFF" stroke="#7ED321" strokeWidth="2" />
        <Circle cx="126" cy="191" r="3.4" fill="#FFFFFF" stroke="#5FAF22" strokeWidth="2" />
        <Circle cx="197" cy="154" r="3.4" fill="#FFFFFF" stroke="#5FAF22" strokeWidth="2" />

        <Circle cx="24" cy="252" r="4.6" fill="#FFFFFF" stroke="#0B6E4F" strokeWidth="2.2" />
        <Circle cx="292" cy="84" r="7.6" fill="#7ED321" stroke="#FFFFFF" strokeWidth="2.6" />
        <Circle cx="289" cy="81" r="2" fill="#F2FBE6" opacity="0.9" />
      </Svg>

          <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]} />
          <Animated.View style={[styles.dotA, { transform: [{ translateY: floatA }] }]} />
          <Animated.View style={[styles.dotB, { transform: [{ translateY: floatB }] }]} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  holder: { width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: { aspectRatio: 1.2 },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    left: '56%',
    top: '-14%',
    backgroundColor: 'rgba(155,224,75,0.14)',
  },
  orbit: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    left: '81.1%',
    top: '28%',
    marginLeft: -48,
    marginTop: -48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(95,175,34,0.38)',
  },
  dotA: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    left: '54%',
    top: '20%',
    backgroundColor: '#CDE9AE',
  },
  dotB: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    left: '26%',
    top: '58%',
    backgroundColor: '#DDF3DC',
  },
})

export default OnboardingHero
