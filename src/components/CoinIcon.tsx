import Svg, { Circle, Defs, RadialGradient, Stop, Text as SvgText } from 'react-native-svg'
import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

/**
 * HDP tangasi — oltin medalion. `size` — diametr (px).
 * `mark` — markaziy belgi ('π' asosiy).
 */
export const CoinIcon = ({ size = 20, mark = 'π' }: { size?: number; mark?: string }) => {
  const s = size / 100
  const symbols = ['√', '∞', 'Σ', '∫', 'x²']
  const symbolRadius = 36
  const symbolAngles = [0, 72, 144, 216, 288] // 5 symbols evenly spaced

  const symbolPositions = symbolAngles.map((deg) => {
    const rad = (deg - 90) * (Math.PI / 180)
    return {
      x: 50 + symbolRadius * Math.cos(rad),
      y: 50 + symbolRadius * Math.sin(rad),
    }
  })

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="coinFace" cx="38%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#F8D489" />
          <Stop offset="55%" stopColor="#E8A33D" />
          <Stop offset="100%" stopColor="#B8741A" />
        </RadialGradient>
        <RadialGradient id="coinInner" cx="42%" cy="34%" r="70%">
          <Stop offset="0%" stopColor="#FBE3AC" />
          <Stop offset="100%" stopColor="#D98F2B" />
        </RadialGradient>
      </Defs>

      {/* tashqi medalion */}
      <Circle cx={50} cy={50} r={49} fill="url(#coinFace)" />
      {/* qirraviy halqa */}
      <Circle cx={50} cy={50} r={49} fill="none" stroke="#8A5A12" strokeWidth={2.5 * s} opacity={0.55} />
      {/* ichki disk */}
      <Circle cx={50} cy={50} r={37} fill="url(#coinInner)" />
      <Circle cx={50} cy={50} r={37} fill="none" stroke="#8A5A12" strokeWidth={1.6 * s} opacity={0.4} />
      {/* yorug'lik yaltirashi */}
      <Circle cx={36} cy={30} r={14} fill="#FFFFFF" opacity={0.28} />

      {/* atrofidagi matematik ramzlar */}
      {symbols.map((sym, i) => (
        <SvgText
          key={i}
          x={symbolPositions[i].x}
          y={symbolPositions[i].y + 3}
          textAnchor="middle"
          fontSize={10}
          fontWeight="700"
          fill="#8A5A12"
          opacity={0.65}
        >
          {sym}
        </SvgText>
      ))}

      {/* markaziy belgi */}
      <SvgText
        x={50}
        y={62}
        textAnchor="middle"
        fontSize={46}
        fontWeight="800"
        fill="#7A4A0E"
      >
        {mark}
      </SvgText>
    </Svg>
  )
}

/** Animatsiyali tangalar uchun — paydo bo'lganda scale animatsiya */
export const AnimatedCoinIcon = ({ size = 20, mark = 'π' }: { size?: number; mark?: string }) => {
  const scale = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 180 }).start()
  }, [scale])
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <CoinIcon size={size} mark={mark} />
    </Animated.View>
  )
}
