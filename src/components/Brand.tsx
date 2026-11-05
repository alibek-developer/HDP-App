import { Image, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { C } from '../theme/tokens'

const MARK = require('../assets/hdp-mark-192.png')

/**
 * HDP brend belgisi — logotipning o'zi (yashil disk + oq «hdp»).
 * Web'dagi kabi rasm sifatida: line-art 28-38 px'da deyarli ko'rinmaydi,
 * shuning uchun og'irligi botirilgan disk saqlanadi.
 */
export const BrandMark = ({ size = 38, hero = false }: { size?: number; hero?: boolean }) => (
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

/** Serif logotip yozuvi — «HDP Matematika» */
export const Wordmark = ({ size = 26, style }: { size?: number; style?: ViewStyle }) => (
  <View style={style}>
    <Text
      style={{
        fontFamily: 'Georgia',
        fontSize: size,
        letterSpacing: -size * 0.01,
        color: C.brandDeep,
      }}
    >
      HDP Matematika
    </Text>
  </View>
)

const styles = StyleSheet.create({
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
