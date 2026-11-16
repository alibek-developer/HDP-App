import Svg, { Circle, Line, Path } from 'react-native-svg'

/** Tarozi belgisi — ikonka to'plamida mos glif yo'q, shuning uchun chiziladi */
export const ScaleMark = ({ size = 22, color = '#1C3214' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="7.5" x2="21" y2="7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="12" y1="7.5" x2="12" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="7.5" y1="20.4" x2="16.5" y2="20.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="12" cy="7.5" r="1.5" fill={color} />
    <Line x1="4" y1="7.5" x2="4" y2="9.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M1.4 9.6a2.6 2.6 0 0 0 5.2 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Line x1="20" y1="7.5" x2="20" y2="9.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <Path d="M17.4 9.6a2.6 2.6 0 0 0 5.2 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
)
