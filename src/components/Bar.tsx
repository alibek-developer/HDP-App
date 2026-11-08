import { View } from 'react-native'
import type { ViewStyle } from 'react-native'

/**
 * Progress reyki — ichki to'ldirish foizda (`ratio` 0..1).
 * RN'da persent kenglik faqat string ko'rinishida ishlaydi.
 */
export const Bar = ({
  ratio,
  color,
  height = 5,
  track = '#EAEEE3',
  style,
}: {
  ratio: number
  color: string
  height?: number
  track?: string
  style?: ViewStyle
}) => (
  <View style={[{ height, flexGrow: 1, flexShrink: 1, alignSelf: 'stretch', borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }, style]}>
    <View
      style={{
        height: '100%',
        borderRadius: height / 2,
        backgroundColor: color,
        width: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
      }}
    />
  </View>
)
