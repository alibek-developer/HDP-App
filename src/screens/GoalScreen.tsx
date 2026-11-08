import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const GOALS = [
  { id: 'dtm', label: 'DTM 100 ball', desc: 'Imtihonga tayyorlanish', icon: 'trophy' as const },
  { id: 'olymp', label: 'Olimpiada', desc: 'Murakkab masalalar', icon: 'ribbon' as const },
  { id: 'deep', label: 'Bilimni oshirish', desc: "Mavzularni chuqurlashtirish", icon: 'book' as const },
  { id: 'review', label: 'Darslarni takror', desc: "O'tilganlarni mustahkamlash", icon: 'refresh' as const },
]

/** 1-savol — maqsad. Ikkala savol ham majburiy: «Keyingi» tanlovsiz ochilmaydi. */
const GoalScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Goal'>) => {
  const insets = useSafeAreaInsets()
  const [picked, setPicked] = useState<string | null>(null)
  const fill = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fill, {
      toValue: 0.5,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [fill])

  const pick = (id: string) => {
    triggerHaptic('selection')
    setPicked(id)
  }

  const next = () => {
    const goal = GOALS.find(g => g.id === picked)
    if (!goal) return
    triggerHaptic('medium')
    navigation.navigate('BirthDate', { goal: goal.label })
  }

  const back = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  return (
    <Fade>
      <View style={styles.root}>
        <ScreenBg />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
        >
          <Pressable
            onPress={back}
            hitSlop={10}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.94 }] }]}
          >
            <Ionicons name="chevron-back" size={19} color={C.ink2} />
          </Pressable>

          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                { width: fill.interpolate({ inputRange: [0, 0.5], outputRange: ['0%', '50%'] }) },
              ]}
            />
          </View>

          <Text style={styles.kicker}>2 ta savol — 1 daqiqa</Text>
          <Text style={styles.title}>
            <Text style={{ color: C.ink4, fontWeight: '400' }}>Maqsadingiz </Text>
            <Text style={{ color: C.ink, fontWeight: '600' }}>nima?</Text>
          </Text>
          <Text style={styles.sub}>Sizga mos yo'l tayyorlaymiz.</Text>

          <View style={styles.grid}>
            {GOALS.map((g, i) => {
              const on = picked === g.id
              return (
                <Reveal key={g.id} delay={60 + i * 45} style={styles.cell}>
                  <Pressable
                    onPress={() => pick(g.id)}
                    style={({ pressed }) => [
                      styles.card,
                      on && styles.cardOn,
                      pressed && { transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <View style={[styles.icon, on && styles.iconOn]}>
                      <Ionicons name={g.icon} size={19} color={on ? C.inkOnLime : C.brand} />
                    </View>
                    <Text style={[styles.cardTitle, on && styles.cardTitleOn]}>{g.label}</Text>
                    <Text style={[styles.cardDesc, on && styles.cardDescOn]}>{g.desc}</Text>
                  </Pressable>
                </Reveal>
              )
            })}
          </View>

          <LimeButton label="Keyingi" onPress={next} disabled={!picked} style={styles.submit} />
          {!picked && <Text style={styles.hint}>Davom etish uchun bitta maqsadni tanlang.</Text>}
        </ScrollView>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  track: {
    height: 4,
    borderRadius: R.full,
    backgroundColor: '#DCE6D4',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: R.full, backgroundColor: C.limeDeep },
  kicker: { ...T.tiny, marginTop: 22, color: C.brand },
  title: { ...T.h1, marginTop: 8, color: C.ink },
  sub: { ...T.bodyMd, marginTop: 6, color: C.ink3 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginTop: 24,
  },
  cell: { width: '48%' },
  card: {
    padding: 14,
    minHeight: 132,
    borderRadius: R.lg,
    backgroundColor: 'rgba(11,110,79,0.06)',
  },
  cardOn: {
    backgroundColor: C.limeBright,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  iconOn: { backgroundColor: 'rgba(255,255,255,0.6)' },
  cardTitle: { ...T.h3, fontSize: 14.5, lineHeight: 19, marginTop: 10, color: C.ink },
  cardTitleOn: { color: C.inkOnLime },
  cardDesc: { fontSize: 11.5, lineHeight: 15, fontWeight: '500', marginTop: 4, color: C.ink3 },
  cardDescOn: { color: 'rgba(28,50,20,0.72)' },
  submit: { marginTop: 26 },
  hint: { ...T.bodySm, textAlign: 'center', marginTop: 10, color: C.ink4 },
})

export default GoalScreen
