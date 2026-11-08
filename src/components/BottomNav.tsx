import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'

/**
 * Tab navigatsiya — web'dagi suzuvchi to'q pill (#0F1A10, radius 100)ning
 * React Native ekvivalenti. Faol tab: oq doira ichida qora ikonka + yonida nom.
 *
 * O'tish ikki fazali: avval ikonka/doira va yozuv almashadi, keyin pill
 * kengligi 220 ms silliq o'zgaradi. Yozuv qat'iy kenglikda — siqilmaydi,
 * faqat opacity bilan chiqadi.
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
  { key: 'problems', label: 'Masalalar', icon: 'calculator-outline', iconActive: 'calculator', labelW: 80 },
  { key: 'shop', label: "Do'kon", icon: 'storefront-outline', iconActive: 'storefront', labelW: 52 },
  { key: 'profile', label: 'Profil', icon: 'person-outline', iconActive: 'person', labelW: 48 },
]

const DOT = 50 // faol tabdagi oq doira
const BTN = 56 // tugma balandligi (44 pt minimal talabidan katta)
const PAD = 7 // pill ichki bo'shlig'i
const BAR_H = BTN + PAD * 2

const EASE = Easing.out(Easing.cubic)

const widthOf = (tab: Tab, active: boolean) => (active ? DOT + 8 + tab.labelW + 21 : BTN)

const TabButton = ({ tab, active, onPress }: { tab: Tab; active: boolean; onPress: () => void }) => {
  const width = useRef(new Animated.Value(widthOf(tab, active))).current
  const face = useRef(new Animated.Value(active ? 1 : 0)).current // doira ↔ nofaol ikonka
  const label = useRef(new Animated.Value(active ? 1 : 0)).current // yozuv

  useEffect(() => {
    Animated.parallel([
      Animated.timing(width, {
        toValue: widthOf(tab, active),
        duration: 220,
        delay: 80,
        easing: EASE,
        useNativeDriver: false,
      }),
      Animated.timing(face, { toValue: active ? 1 : 0, duration: 140, easing: EASE, useNativeDriver: true }),
      Animated.timing(label, {
        toValue: active ? 1 : 0,
        duration: active ? 130 : 80,
        delay: active ? 150 : 0,
        easing: EASE,
        useNativeDriver: true,
      }),
    ]).start()
  }, [active, tab, width, face, label])

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
        style={({ pressed }) => [styles.hit, pressed && { transform: [{ scale: 0.9 }] }]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.idle,
            { opacity: face.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
          ]}
        >
          <Ionicons name={tab.icon} size={22} color="rgba(255,255,255,0.42)" />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: face }]} pointerEvents="none">
          <View style={styles.circle}>
            <Ionicons name={tab.iconActive} size={22} color="#0F1A10" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.labelBox, { opacity: label }]} pointerEvents="none">
          <Text numberOfLines={1} style={styles.label}>
            {tab.label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

export const BottomNav = ({ active, onSelect }: { active: TabKey; onSelect: (key: TabKey) => void }) => {
  const insets = useSafeAreaInsets()

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.shadow}>
        <View style={styles.bar}>
          {TABS.map(tab => (
            <TabButton key={tab.key} tab={tab} active={tab.key === active} onPress={() => onSelect(tab.key)} />
          ))}
        </View>
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
  shadow: {
    borderRadius: 100,
    backgroundColor: '#0F1A10',
    shadowColor: '#0E1A12',
    shadowOpacity: 0.34,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: PAD,
    borderRadius: 100,
    overflow: 'hidden',
  },
  tab: { height: BTN },
  hit: { flex: 1, height: BTN },
  idle: { alignItems: 'center', justifyContent: 'center' },
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
  labelBox: {
    position: 'absolute',
    left: DOT + 11,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
})
