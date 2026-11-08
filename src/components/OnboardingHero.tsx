import { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg'
import { ABS_FILL, C, MATH_FONT } from '../theme/tokens'

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

/**
 * Kutib olish ekrani illyustratsiyasi — referensdagi sahna vektor ko'rinishida:
 * gradient osmon, parabola, porlovchi yo'l, low-poly tog' va bayroq. Ranglar
 * mo''tadil; glow nafas oladi, sahna ochilishida sal kattalashib joyiga tushadi.
 * Filtrlar ishlatilmagan (native'da ham bir xil chiqishi uchun) — nur qatlamlari
 * radial gradient va keng konturlar bilan beriladi.
 */

const PATH_D =
  'M 98,238 C 58,300 24,344 60,392 C 96,440 200,446 178,492 C 168,514 150,506 140,500'

const SILHOUETTE =
  '140,500 176,565 215,625 262,695 320,765 345,810 0,810 8,760 40,690 78,620 108,560'

const FACETS: { p: string; f: string; o?: number }[] = [
  { p: '140,500 108,560 130,600', f: '#1B9A6B' },
  { p: '140,500 130,600 176,565', f: '#0B6E4F' },
  { p: '140,500 176,565 215,625', f: '#4CAF6E' },
  { p: '140,500 176,565 160,600', f: '#7ED321', o: 0.22 },
  { p: '108,560 78,620 130,600', f: '#0A5C40' },
  { p: '130,600 78,620 110,680', f: '#0B6E4F' },
  { p: '130,600 110,680 160,640', f: '#1B9A6B' },
  { p: '130,600 160,640 176,565', f: '#0E7A52' },
  { p: '176,565 160,640 215,625', f: '#2E9E63' },
  { p: '78,620 40,690 110,680', f: '#063F2E' },
  { p: '110,680 40,690 150,740', f: '#0A5C40' },
  { p: '110,680 150,740 190,700', f: '#0B6E4F' },
  { p: '160,640 190,700 215,625', f: '#15905C' },
  { p: '215,625 190,700 262,695', f: '#3FA468' },
  { p: '40,690 8,760 150,740', f: '#063F2E' },
  { p: '150,740 8,760 0,810 170,810', f: '#0A5C40' },
  { p: '150,740 170,810 300,810 190,700', f: '#0B6E4F' },
  { p: '190,700 300,810 345,810 262,695', f: '#1B9A6B' },
  { p: '262,695 345,810 320,765', f: '#2E9E63' },
]

const OnboardingHero = () => {
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  const halo = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.3] })
  const mid = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.26, 0.52] })
  const glow = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] })

  return (
    <View style={ABS_FILL} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E7F2DA" />
            <Stop offset="0.45" stopColor="#F1F6E9" />
            <Stop offset="1" stopColor="#F8F5EA" />
          </LinearGradient>
          <LinearGradient id="pathGrad" gradientUnits="userSpaceOnUse" x1="98" y1="238" x2="140" y2="500">
            <Stop offset="0" stopColor="#9BE04B" />
            <Stop offset="0.6" stopColor="#7ED321" />
            <Stop offset="1" stopColor="#5FAF22" />
          </LinearGradient>
          <RadialGradient id="glowGrad" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#C4F47E" stopOpacity="0.95" />
            <Stop offset="0.55" stopColor="#9BE04B" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#9BE04B" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="cloudGrad" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F8F5EA" stopOpacity="0" />
            <Stop offset="1" stopColor="#F8F5EA" stopOpacity="0.96" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="400" height="860" fill="url(#sky)" />

        {/* osmondagi matematik belgilar */}
        <G opacity="0.13" fill={C.brand} fontFamily={MATH_FONT}>
          <SvgText x="266" y="194" fontSize="42">π</SvgText>
          <SvgText x="64" y="448" fontSize="38">Σ</SvgText>
          <SvgText x="296" y="620" fontSize="36">∞</SvgText>
        </G>

        {/* parabola + o'qlar */}
        <G stroke={C.brand} strokeOpacity="0.35" strokeWidth="1.2">
          <Line x1="98" y1="120" x2="98" y2="300" />
          <Line x1="22" y1="250" x2="214" y2="250" />
        </G>
        <Polygon points="98,112 94,123 102,123" fill={C.brand} opacity="0.4" />
        <Polygon points="222,250 211,246 211,254" fill={C.brand} opacity="0.4" />
        <Path d="M 30,150 Q 98,322 170,150" fill="none" stroke={C.brand} strokeOpacity="0.5" strokeWidth="1.6" />
        <G fill={C.brand} opacity="0.5" fontFamily={MATH_FONT} fontStyle="italic">
          <SvgText x="105" y="128" fontSize="15">y</SvgText>
          <SvgText x="224" y="256" fontSize="15">x</SvgText>
        </G>

        {/* orqa plandagi tumanli tizma — chuqurlik */}
        <Polygon points="235,612 285,556 348,644 400,708 400,860 150,860 196,708" fill="#A7CBA8" opacity="0.55" />
        <Polygon points="285,556 348,644 322,646" fill="#BFDCC1" opacity="0.5" />

        {/* tog' */}
        <Polygon points={SILHOUETTE} fill="#0A5C40" />
        {FACETS.map((f, i) => (
          <Polygon key={i} points={f.p} fill={f.f} opacity={f.o ?? 1} />
        ))}

        {/* bayroq */}
        <Line x1="140" y1="500" x2="140" y2="468" stroke="#063F2E" strokeWidth="2" />
        <Polygon points="140,468 163,476 140,484" fill="#063F2E" />

        {/* porlovchi yo'l */}
        <AnimatedPath d={PATH_D} fill="none" stroke="#9BE04B" strokeWidth="16" strokeLinecap="round" opacity={halo} />
        <AnimatedPath d={PATH_D} fill="none" stroke="#9BE04B" strokeWidth="8" strokeLinecap="round" opacity={mid} />
        <Path d={PATH_D} fill="none" stroke="url(#pathGrad)" strokeWidth="3.4" strokeLinecap="round" opacity="0.95" />
        <Path d={PATH_D} fill="none" stroke="#F2FBE6" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />

        {/* parabola uchidagi nur */}
        <AnimatedCircle cx="98" cy="236" r="16" fill="url(#glowGrad)" opacity={glow} />
        <Circle cx="98" cy="236" r="3.2" fill="#F4FBE9" />

        {/* cho'qqidagi nur */}
        <AnimatedCircle cx="140" cy="500" r="22" fill="url(#glowGrad)" opacity={glow} />
        <Circle cx="140" cy="500" r="3" fill="#F4FBE9" />

        {/* bulutlar */}
        <G>
          <Ellipse cx="280" cy="716" rx="74" ry="26" fill="url(#cloudGrad)" />
          <Ellipse cx="108" cy="722" rx="64" ry="24" fill="url(#cloudGrad)" />
          <Ellipse cx="70" cy="742" rx="92" ry="34" fill="url(#cloudGrad)" />
          <Ellipse cx="212" cy="772" rx="122" ry="40" fill="url(#cloudGrad)" />
          <Ellipse cx="332" cy="752" rx="82" ry="30" fill="url(#cloudGrad)" />
          <Ellipse cx="140" cy="802" rx="162" ry="46" fill="url(#cloudGrad)" />
          <Ellipse cx="38" cy="812" rx="92" ry="36" fill="url(#cloudGrad)" />
        </G>

        <Rect x="0" y="660" width="400" height="200" fill="url(#mist)" />

        {/* kontur chiziqlar */}
        <Path d="M -10,812 C 120,760 260,840 410,780" fill="none" stroke={C.brand} strokeOpacity="0.1" strokeWidth="1.2" />
        <Path d="M -10,840 C 140,800 280,860 410,818" fill="none" stroke={C.brand} strokeOpacity="0.08" strokeWidth="1.2" />
      </Svg>
    </View>
  )
}

export default OnboardingHero