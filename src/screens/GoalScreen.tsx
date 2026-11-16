import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, StepHeader } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { C } from '../theme/tokens'

const GOALS = [
  { id: 'dtm', label: 'DTM 100 ball', desc: 'Imtihonga tayyorlanish', icon: 'trophy-outline' as const },
  { id: 'olymp', label: 'Olimpiada', desc: 'Murakkab masalalar', icon: 'ribbon-outline' as const },
  { id: 'deep', label: 'Bilimni oshirish', desc: 'Chuqurroq mavzular', icon: 'trending-up' as const },
  { id: 'review', label: 'Takrorlash', desc: "O'tilgan mavzular", icon: 'refresh-outline' as const },
]

/** 1-savol — maqsad. To'rtta yo'nalish ikki qatorda; tanlovsiz «Keyingi» ochilmaydi. */
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
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <LinearGradient
          colors={['#F5FBEC', '#FFFFFF']}
          locations={[0, 0.38]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.topBar}>
          <Pressable
            onPress={back}
            hitSlop={10}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.94 }] }]}
          >
            <Ionicons name="chevron-back" size={19} color={C.ink2} />
          </Pressable>

          <View style={styles.brandRow} pointerEvents="none">
            <BrandMark size={30} />
            <Wordmark size={18} />
          </View>

          <View style={styles.topBarSide} />
        </View>

        <StepHeader step={1} />

        <Reveal y={14} duration={340}>
          <Text style={styles.title}>
            <Text style={styles.titleDim}>Maqsadingiz </Text>
            <Text style={styles.titleStrong}>nima?</Text>
          </Text>
        </Reveal>

        <Reveal y={20} delay={70} duration={380} style={styles.gridWrap}>
          <View style={styles.grid}>
            {GOALS.map(g => {
              const on = picked === g.id
              return (
                <Pressable
                  key={g.id}
                  onPress={() => pick(g.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${g.label} — ${g.desc}`}
                  style={({ pressed }) => [
                    styles.tile,
                    on && styles.tileOn,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={styles.tileTop}>
                    <View style={[styles.tileIcon, on && styles.tileIconOn]}>
                      <Ionicons name={g.icon} size={17} color={on ? C.inkOnLime : C.brand} />
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on && <Ionicons name="checkmark" size={12} color={C.inkOnLime} />}
                    </View>
                  </View>
                  <Text style={styles.tileTitle}>{g.label}</Text>
                  <Text style={styles.tileDesc}>{g.desc}</Text>
                </Pressable>
              )
            })}
          </View>
        </Reveal>

        <View style={styles.spacer} />

        <LimeButton
          label="Keyingi"
          onPress={next}
          disabled={!picked}
          trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
        />
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topBarSide: { width: 44, height: 44 },

  title: { marginTop: 18, fontSize: 29, lineHeight: 35, letterSpacing: -0.7 },
  titleDim: { color: '#77947D', fontWeight: '400' },
  titleStrong: { color: C.ink, fontWeight: '700' },

  gridWrap: { marginTop: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '48%',
    flexGrow: 1,
    minHeight: 124,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#F8FBF3',
    borderWidth: 1,
    borderColor: '#E7EFE0',
  },
  tileOn: {
    backgroundColor: '#F5FBEA',
    borderColor: C.limeDeep,
  },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tileIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF5E5',
  },
  tileIconOn: { backgroundColor: C.limeBright },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CFDCC8',
    backgroundColor: '#FFFFFF',
  },
  radioOn: { borderWidth: 0, backgroundColor: C.limeDeep },
  tileTitle: { marginTop: 14, fontSize: 14.5, lineHeight: 19, fontWeight: '600', color: C.ink },
  tileDesc: { marginTop: 3, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: C.ink3 },

  spacer: { flex: 1, minHeight: 20 },
})

export default GoalScreen
