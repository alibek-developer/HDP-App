import Svg, { Circle, Line, Path, Rect } from 'react-native-svg'

/**
 * O'yin belgilari — Ionicons'da mos shakl yo'q, shuning uchun chiziqli SVG.
 * Har belgi o'yin mexanikasini ko'rsatadi: juft kartalar, son chizig'i, duel.
 */

type MarkProps = { size?: number; color?: string }

/** Sonlar xotirasi — ustma-ust ikki karta, oldingisida 2×2 nuqta */
export const MemoryMark = ({ size = 22, color = '#1C3214' }: MarkProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3.2" y="6.6" width="10" height="13.8" rx="2.6" stroke={color} strokeWidth="1.7" />
    <Rect x="10.6" y="3.4" width="10" height="13.8" rx="2.6" stroke={color} strokeWidth="1.7" />
    <Circle cx="13.6" cy="8.1" r="1.05" fill={color} />
    <Circle cx="17.6" cy="8.1" r="1.05" fill={color} />
    <Circle cx="13.6" cy="12.2" r="1.05" fill={color} />
    <Circle cx="17.6" cy="12.2" r="1.05" fill={color} />
  </Svg>
)

/** Sonlar chizig'i — belgilangan nuqta va sakrash yoyi */
export const NumberLineMark = ({ size = 22, color = '#1C3214' }: MarkProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="2.6" y1="16.6" x2="21.4" y2="16.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="5.4" y1="14.8" x2="5.4" y2="18.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="10" y1="14.8" x2="10" y2="18.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="14.6" y1="14.8" x2="14.6" y2="18.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="19.2" y1="14.8" x2="19.2" y2="18.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="14.6" cy="16.6" r="2.35" fill={color} />
    <Path
      d="M9.6 10.6c1.4-3.1 3.6-4.6 5.4-4.2 1.4.3 2.3 1.6 2.6 3.4"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
)

/** Raqam jangchilari — ikki birlik yuzma-yuz, o'rtada uchqun */
export const FightersMark = ({ size = 22, color = '#1C3214' }: MarkProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6.8" cy="6.9" r="2.5" stroke={color} strokeWidth="1.7" />
    <Path
      d="M3.9 18.6c0-3.5 1.1-5.4 2.9-6.1 1.8.7 2.9 2.6 2.9 6.1"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Circle cx="17.2" cy="6.9" r="2.5" stroke={color} strokeWidth="1.7" />
    <Path
      d="M14.3 18.6c0-3.5 1.1-5.4 2.9-6.1 1.8.7 2.9 2.6 2.9 6.1"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Path
      d="M12.9 9.2 11.7 11.7h2.5l-1.2 2.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)
