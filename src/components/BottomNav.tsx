import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'

/**
 * Tab navigatsiya — web'dagi suzuvchi to'q pill (#0F1A10, radius 100)ning
 * React Native ekvivalenti. Faol tab: oq doira ichida qora ikonka + yonida nom.
 *
 * Web `framer-motion` layout animatsiyasini qiladi; RN'da kenglik
 * `Animated.timing` (JS driver) bilan ochiladi — natija bir xil: tab silliq
 * kengayadi, qolganlari joyiga qaytadi.
 */

export type TabKey = 'home' | 'problems' | 'shop' | 'profile'

type Tab = {
  key: TabKey
  label: string
  icon: keyof typeof Ionicons.glyphMap
  iconActive: keyof typeof Ionicons.glyphMap
  /** faol holatdagi yozuv kengligi — pill sakrab turmasligi uchun oldindan hisoblangan */
  labelW: number
}

const TABS: Tab[] = [
  { key: 'home', label: 'Asosiy', icon: 'home-outline', iconActive: 'home', labelW: 52 },
  { key: 'problems', label: 'Masalalar', icon: 'locate-outline', iconActive: 'locate', labelW: 80 },
  { key: 'shop', label: "Do'kon", icon: 'storefront-outline', iconActive: 'storefront', labelW: 52 },
  { key: 'profile', label: 'Profil', icon: 'person-outline', iconActive: 'person', labelW: 48 },
]

const DOT = 50 // faol tabdagi oq doira
const BTN = 56 // tugma balandligi (44 pt minimal talabidan katta)
const PAD = 7 // pill ichki bo'shlig'i
const BAR_H = BTN + PAD * 2

const EASE = Easing.bezier(0.22, 1, 0.36, 1)

const widthOf = (tab: Tab, active: boolean) => (active ? DOT + 8 + tab.labelW + 21 : BTN)

const TabButton = ({ tab, active, onPress }: { tab: Tab; active: boolean; onPress: () => void }) => {
  const width = useRef(new Animated.Value(widthOf(tab, active))).current
  const open = useRef(new Animated.Value(active ? 1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(width, { toValue: widthOf(tab, active), duration: 340, easing: EASE, useNativeDriver: false }),
      Animated.timing(open, { toValue: active ? 1 : 0, duration: 280, easing: EASE, useNativeDriver: false }),
    ]).start()
  }, [active, tab, width, open])

  const Icon = active ? tab.iconActive : tab.icon

  return (
    <Animated.View
      style={[styles.tab, { width }]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
    >
      <Pressable
        onPress={() => {
          triggerHaptic('selection')
          onPress()
        }}
        style={({ pressed }) => [styles.hit, active ? styles.hitActive : styles.hitIdle, pressed && { transform: [{ scale: 0.9 }] }]}
      >
        {active ? (
          <>
            <View style={styles.circle}>
              <Ionicons name={Icon} size={22} color="#0F1A10" />
            </View>
            <Animated.View
              style={[
                styles.labelBox,
                {
                  opacity: open,
                  width: open.interpolate({ inputRange: [0, 1], outputRange: [0, tab.labelW] }),
                },
              ]}
              pointerEvents="none"
            >
              <Text numberOfLines={1} style={styles.label}>
                {tab.label}
              </Text>
            </Animated.View>
          </>
        ) : (
          <Ionicons name={Icon} size={22} color="rgba(255,255,255,0.42)" />
        )}
      </Pressable>
    </Animated.View>
  )
}

export const BottomNav = ({ active, onSelect }: { active: TabKey; onSelect: (key: TabKey) => void }) => {
  const insets = useSafeAreaInsets()

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.bar}>
        {TABS.map(tab => (
          <TabButton key={tab.key} tab={tab} active={tab.key === active} onPress={() => onSelect(tab.key)} />
        ))}
      </View>
    </View>
  )
}

/** Pill egallagan pastki maydon — ekran kontenti shu qadar bo'sh joy qoldiradi */
export const navBottomSpace = (insetsBottom: number) => BAR_H + 16 + insetsBottom + 12

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: PAD,
    borderRadius: 100,
    backgroundColor: '#0F1A10',
    shadowColor: '#0E1A12',
    shadowOpacity: 0.34,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 20,
  },
  tab: { height: BTN },
  hit: { flex: 1, height: BTN },
  hitIdle: { alignItems: 'center', justifyContent: 'center' },
  hitActive: { alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 3 },
  circle: {
    position: 'absolute',
    left: 3,
    top: (BTN - DOT) / 2,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0E1A12',
    shadowOpacity: 0.28,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  labelBox: { marginLeft: DOT + 8, overflow: 'hidden', justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
})
