import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import Svg, { Line } from 'react-native-svg'

/**
 * Web'dagi `.grid-paper` — 26 px katak, siyoh 3.5% alfa, opacity 60.
 * RN'da CSS `background-image` yo'q, shuning uchun kataklar SVG chizig'idan
 * quriladi; kenglik onLayout orqali o'lchanadi.
 */
const CELL = 26
const LINE = 'rgba(14,26,18,0.035)'

export const GridPaper = ({ band = 300, style }: { band?: number; style?: ViewStyle }) => {
  const [width, setWidth] = useState(0)

  const cols = Math.ceil(width / CELL)
  const rows = Math.ceil(band / CELL)

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity: 0.6, height: band }, style]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Svg width={width} height={band}>
          {Array.from({ length: cols + 1 }, (_, i) => (
            <Line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={band} stroke={LINE} strokeWidth={1} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <Line key={`h${i}`} x1={0} y1={i * CELL} x2={width} y2={i * CELL} stroke={LINE} strokeWidth={1} />
          ))}
        </Svg>
      )}
    </View>
  )
}
