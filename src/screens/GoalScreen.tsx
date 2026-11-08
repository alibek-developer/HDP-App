import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg, StepHeader } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const GOALS = [
  { id: 'dtm', label: 'DTM 100 ball', desc: 'Imtihonga tayyorlanish', icon: 'trophy' as const },
  { id: 'olymp', label: 'Olimpiada', desc: 'Murakkab masalalar', icon: 'ribbon' as const },
  { id: 'deep', label: 'Bilimni oshirish', desc: 'Mavzularni chuqurlashtirish', icon: 'book' as const },
  { id: 'review', label: 'Darslarni takror', desc: "O'tilganlarni mustahkamlash", icon: 'refresh' as const },
]

/** 1-savol — maqsad. Tanlovsiz «Keyingi» ochilmaydi. */
const GoalScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Goal'>) => {
  const insets = useSafeAreaInsets()
  const [picked, setPicked] = useState<string | null>(null)

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

          <StepHeader step={1} />

          <Text style={styles.title}>Maqsadingiz nima?</Text>
          <Text style={styles.sub}>Sizga mos yo&apos;l tayyorlaymiz.</Text>

          <View style={styles.list}>
            {GOALS.map((g, i) => {
              const on = picked === g.id
              return (
                <Reveal key={g.id} delay={40 + i * 45} y={14} duration={320}>
                  <Pressable
                    onPress={() => pick(g.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    style={({ pressed }) => [
                      styles.card,
                      on && styles.cardOn,
                      pressed && { transform: [{ scale: 0.99 }] },
                    ]}
                  >
                    <View style={[styles.icon, on && styles.iconOn]}>
                      <Ionicons name={g.icon} size={19} color={on ? C.inkOnLime : C.brand} />
                    </View>
                    <View style={styles.cardMid}>
                      <Text style={styles.cardTitle}>{g.label}</Text>
                      <Text style={styles.cardDesc}>{g.desc}</Text>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
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
  title: { ...T.h1, marginTop: 20, color: C.ink },
  sub: { ...T.bodyMd, marginTop: 6, color: C.ink3 },
  list: { marginTop: 22, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: R.lg,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1.5,
    borderColor: 'rgba(28,50,20,0.07)',
  },
  cardOn: {
    backgroundColor: '#F3FBE9',
    borderColor: C.limeDeep,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  iconOn: { backgroundColor: C.limeBright },
  cardMid: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: C.ink },
  cardDesc: { fontSize: 12, lineHeight: 16, fontWeight: '500', marginTop: 2, color: C.ink3 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD6C4',
    backgroundColor: '#FFFFFF',
  },
  radioOn: { borderWidth: 0, backgroundColor: C.limeDeep },
  submit: { marginTop: 24 },
  hint: { ...T.bodySm, textAlign: 'center', marginTop: 10, color: C.ink4 },
})

export default GoalScreen
