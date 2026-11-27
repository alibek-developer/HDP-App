import { useState } from 'react'
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { BalanceLab } from '../components/BalanceLab'
import { LimeButton } from '../components/ui'
import { DEMO_QUESTION } from '../lib/onboardingDemo'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { T, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>

const OnboardingScreen = ({ navigation }: Props) => {
  const C = useColors()
  const styles = makeStyles(C)
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const correct = picked === DEMO_QUESTION.correct
  const pickedValue = picked === null ? null : Number(DEMO_QUESTION.options[picked])
  const sceneScale = Math.min(
    1,
    Math.max(0.52, (height - insets.top - insets.bottom - (checked ? 430 : 390)) / 300),
  )

  const pick = (index: number) => {
    if (checked) return
    triggerHaptic('selection')
    setPicked(index)
  }

  const check = () => {
    if (picked === null || checked) return
    setChecked(true)
    triggerHaptic(correct ? 'success' : 'warning')
  }

  const next = () => {
    if (picked === null || !checked) return
    triggerHaptic('medium')
    navigation.replace('DemoResult', { questionId: DEMO_QUESTION.id, picked })
  }

  const openLogin = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  const stateOf = (index: number) => {
    if (!checked) return picked === index ? 'selected' : 'idle'
    if (index === DEMO_QUESTION.correct) return 'correct'
    if (index === picked) return 'wrong'
    return 'dim'
  }

  const feedback = checked
    ? correct
      ? `Muvozanat tiklandi — x = ${DEMO_QUESTION.options[DEMO_QUESTION.correct]}`
      : `Muvozanat tiklanmadi. To‘g‘ri javob: x = ${DEMO_QUESTION.options[DEMO_QUESTION.correct]}`
    : picked === null
      ? 'x uchun og‘irlik tanlang.'
      : 'Tarozi hali muvozanatda emas. Boshqa og‘irlikni sinang.'

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 14 }]}>
      <LinearGradient
        colors={[C.mintSoft, C.solverBody]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.watermark} pointerEvents="none">
        <Text style={styles.watermarkText}>x</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.brand}>
          <BrandMark size={34} />
          <Wordmark size={21} />
        </View>
        <Pressable onPress={openLogin} style={styles.login} accessibilityRole="button">
          <Text style={styles.loginText}>Kirish</Text>
        </Pressable>
      </View>

      <View style={styles.heading}>
        <Text style={styles.kicker}>TAROZI LABORATORIYASI</Text>
        <Text style={styles.title}>Tenglikni yech.</Text>
        <Text style={styles.subtitle}>x ni toping — tarozi o‘zi ko‘rsatadi.</Text>
      </View>

      <View style={styles.sceneArea}>
        <View style={{ width: 320, height: 300 * sceneScale, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 320, height: 300, transform: [{ scale: sceneScale }] }}>
            <BalanceLab value={pickedValue} success={checked && correct} />
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.weightLabel}>x uchun og‘irlik</Text>
        <View style={styles.weights}>
          {DEMO_QUESTION.options.map((option, index) => {
            const state = stateOf(index)
            return (
              <Pressable
                key={option}
                onPress={() => pick(index)}
                disabled={checked}
                accessibilityRole="radio"
                accessibilityLabel={`x = ${option}`}
                accessibilityState={{ checked: picked === index, disabled: checked }}
                style={({ pressed }) => [
                  styles.weightWrap,
                  pressed && !checked && styles.weightPressed,
                  state === 'dim' && styles.weightDim,
                ]}
              >
                <View style={[styles.weightRing, state !== 'idle' && styles.weightRingActive]} />
                <LinearGradient
                  colors={
                    state === 'correct'
                      ? ['#9BE04B', '#62B92B']
                      : state === 'wrong'
                        ? ['#F08076', '#C9483B']
                        : state === 'selected'
                          ? ['#F0D58D', '#B98734']
                          : ['#E6E9E2', '#B7C1B4']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.weightBody, state !== 'idle' && styles.weightBodyActive]}
                >
                  <Text style={[styles.weightText, state !== 'idle' && styles.weightTextActive]}>{option}</Text>
                </LinearGradient>
                <View style={styles.weightFoot} />
              </Pressable>
            )
          })}
        </View>

        <View style={styles.feedback}>
          <Ionicons
            name={checked ? (correct ? 'checkmark-circle' : 'alert-circle') : 'hand-left-outline'}
            size={16}
            color={checked ? (correct ? C.brand : C.danger) : C.ink3}
          />
          <View style={styles.feedbackText}>
            <Text style={[styles.feedbackTitle, checked && (correct ? styles.feedbackOk : styles.feedbackBad)]}>
              {feedback}
            </Text>
            {checked && <Text style={styles.explain}>{DEMO_QUESTION.explain}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <LimeButton
          label={checked ? 'Natijani ko‘rish' : 'Tekshirish'}
          onPress={checked ? next : check}
          disabled={picked === null}
          height={56}
        />
        <Text style={styles.actionNote}>
          {checked ? 'Natijani Telegram bilan saqlash mumkin.' : 'Hisobsiz sinab ko‘ring.'}
        </Text>
      </View>
    </View>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: C.solverBody,
    overflow: 'hidden',
  },
  watermark: { position: 'absolute', right: -18, top: 90, opacity: 0.035 },
  watermarkText: { fontFamily: 'STIXTwoMath', fontSize: 360, lineHeight: 360, color: C.brandDeep },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  login: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  loginText: { ...T.bodyMd, color: C.brand, fontWeight: '700' },
  heading: { marginTop: 18 },
  kicker: { ...T.tiny, color: C.brand, marginBottom: 6 },
  title: { ...T.display, fontSize: 34, lineHeight: 38, color: C.ink },
  subtitle: { ...T.bodyMd, color: C.ink2, marginTop: 5 },
  sceneArea: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center' },
  controls: { alignItems: 'center' },
  weightLabel: { ...T.label, color: C.ink3, marginBottom: 10 },
  weights: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  weightWrap: { width: 54, height: 64, alignItems: 'center', justifyContent: 'flex-end' },
  weightPressed: { transform: [{ translateY: 3 }, { scale: 0.96 }] },
  weightDim: { opacity: 0.35 },
  weightRing: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#9EAAA0',
  },
  weightRingActive: { borderColor: '#B98734' },
  weightBody: {
    width: 54,
    height: 45,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  weightBodyActive: { borderColor: 'rgba(255,255,255,0.95)' },
  weightText: { ...T.h3, color: C.ink2, fontWeight: '700' },
  weightTextActive: { color: '#FFFFFF' },
  weightFoot: {
    position: 'absolute',
    bottom: 9,
    width: 42,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(14,26,18,0.16)',
  },
  feedback: {
    minHeight: 52,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 8,
  },
  feedbackText: { flex: 1, alignItems: 'center' },
  feedbackTitle: { ...T.bodySm, color: C.ink3, textAlign: 'center' },
  feedbackOk: { color: C.brand, fontWeight: '700' },
  feedbackBad: { color: C.danger, fontWeight: '700' },
  explain: { ...T.label, color: C.ink2, textAlign: 'center', marginTop: 3 },
  actions: { gap: 5 },
  actionNote: { ...T.label, color: C.ink3, textAlign: 'center' },
})

export default OnboardingScreen
