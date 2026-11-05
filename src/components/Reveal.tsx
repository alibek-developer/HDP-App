import { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import type { ViewStyle } from 'react-native'

const EASE = Easing.bezier(0.22, 1, 0.36, 1)

/**
 * Kirish animatsiyalari — web'dagi `framer-motion`ning qisqartirilgan ekvivalenti.
 *
 * MUHIM: bu yerda kontent hech qachon `opacity: 0`dan boshlamaydi. Android +
 * react-native-screens kombinatsiyasida ekran hali ko'rsatilmay turib boshlangan
 * animatsiya to'xtab qolib, sahifa oq bo'lib qolishi mumkin (xuddi shu xato
 * telefonda ko'rilgani). Shuning uchun faqat siljish/kattalashadi animatsiya
 * qilinadi — animatsiya buzilsa ham yozuv va tugmalar ko'rinib turadi.
 */

/** Pastdan tepaga siljib chiqadi — kontent doim ko'rinadi */
export const Reveal = ({
  children,
  delay = 0,
  y = 20,
  duration = 340,
  style,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  duration?: number
  style?: ViewStyle
}) => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: EASE,
      useNativeDriver: true,
    })
    anim.start()
    return () => anim.stop()
  }, [progress, delay, duration])

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [y, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

/** Brend belgisi — spring bilan bir oz kattalashib chiqadi */
export const PopIn = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: ViewStyle
}) => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = Animated.spring(progress, {
      toValue: 1,
      delay,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    })
    anim.start()
    return () => anim.stop()
  }, [progress, delay])

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

/** Sahifa qoplamasi — animatsiya yo'q: kontent darhol ko'rinadi */
export const Fade = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flex: 1 }, style]}>{children}</View>
)
