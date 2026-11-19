import { Image, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { MATH_FONT, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

const MARK = require('../assets/hdp-mark-192.png')

/**
 * HDP brend belgisi — logotipning o'zi (yashil disk + oq «hdp»).
 * Web'dagi kabi rasm sifatida: line-art 28-38 px'da deyarli ko'rinmaydi,
 * shuning uchun og'irligi botirilgan disk saqlanadi.
 */
export const BrandMark = ({ size = 38, hero = false }: { size?: number; hero?: boolean }) => {
  const C = useColors()
  const styles = makeStyles(C)
  return (
  <View
    style={[
      styles.markWrap,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: hero ? Math.max(3, Math.round(size * 0.07)) : 0,
        borderColor: 'rgba(255,255,255,0.9)',
      },
      hero ? styles.heroShadow : { ...styles.markShadow, shadowRadius: size * 0.42, elevation: Math.round(size / 5) },
    ]}
  >
    <Image
      source={MARK}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
      accessibilityLabel="HDP"
    />
  </View>
  )
}

/** Logotip yozuvi — monoline belgi bilan bir tilda: yupqa, keng harflar */
export const Wordmark = ({ size = 26, style }: { size?: number; style?: ViewStyle }) => {
  const C = useColors()
  return (
  <View style={style}>
    <Text
      style={{
        fontFamily: MATH_FONT,
        fontSize: size,
        letterSpacing: -size * 0.015,
        color: C.brandDeep,
      }}
    >
      HDP Matematika
    </Text>
  </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  markWrap: { overflow: 'hidden', backgroundColor: C.brandDeep },
  markShadow: {
    shadowColor: '#0D5638',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: Math.round(38 * 0.18) },
  },
  heroShadow: {
    shadowColor: '#0D5638',
    shadowOpacity: 0.34,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
})
