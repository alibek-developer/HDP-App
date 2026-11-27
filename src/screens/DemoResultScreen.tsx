import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BalanceLab } from '../components/BalanceLab'
import { BrandMark, Wordmark } from '../components/Brand'
import { LimeButton } from '../components/ui'
import { DEMO_QUESTION } from '../lib/onboardingDemo'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { MATH_FONT, T, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

type Props = NativeStackScreenProps<RootStackParamList, 'DemoResult'>

const DemoResultScreen = ({ navigation, route }: Props) => {
  const C = useColors()
  const styles = makeStyles(C)
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const picked = route.params.picked
  const correct = picked === DEMO_QUESTION.correct
  const pickedLabel = DEMO_QUESTION.options[picked] ?? 'Tanlanmadi'
  const answer = DEMO_QUESTION.options[DEMO_QUESTION.correct]
  const sceneScale = Math.min(1, Math.max(0.58, (height - insets.top - insets.bottom - 370) / 300))

  const save = () => {
    triggerHaptic('medium')
    navigation.replace('SignUp')
  }

  const retry = () => {
    triggerHaptic('light')
    navigation.replace('Onboarding')
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <LinearGradient
        colors={[C.mintSoft, C.solverBody]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.watermark} pointerEvents="none">
        <Text style={styles.watermarkText}>=</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.brand}>
          <BrandMark size={32} />
          <Wordmark size={19} />
        </View>
        <Text style={styles.labLabel}>TAROZI LABORATORIYASI</Text>
      </View>

      <View style={styles.heading}>
        <Text style={styles.kicker}>{correct ? 'MUVOZANAT TIKLANDI' : 'NATIJA'}</Text>
        <Text style={styles.title}>
          {correct ? 'x = ' : 'To‘g‘ri javob: '}
          <Text style={styles.answer}>{answer}</Text>
        </Text>
        <Text style={styles.subtitle}>
          {correct ? 'Tenglik muvozanatga keldi.' : 'Endi yechimni ko‘rib, qayta urinib ko‘ring.'}
        </Text>
      </View>

      <View style={styles.sceneArea}>
        <View style={{ width: 320, height: 300 * sceneScale, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 320, height: 300, transform: [{ scale: sceneScale }] }}>
            <BalanceLab value={Number(pickedLabel)} success={correct} />
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.answerRow}>
          <View style={[styles.dot, !correct && styles.dotWrong]} />
          <Text style={styles.answerLabel}>Siz tanladingiz</Text>
          <Text style={[styles.answerValue, !correct && styles.answerValueWrong]}>{pickedLabel}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.explain}>{DEMO_QUESTION.explain}</Text>
      </View>

      <View style={styles.actions}>
        <LimeButton label="Telegram bilan saqlash" onPress={save} height={56} />
        <Pressable onPress={retry} style={styles.retry} accessibilityRole="button">
          <Ionicons name="refresh-outline" size={16} color={C.brand} />
          <Text style={styles.retryText}>Qayta urinish</Text>
        </Pressable>
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
  watermark: { position: 'absolute', left: -40, top: 120, opacity: 0.035 },
  watermarkText: { fontFamily: MATH_FONT, fontSize: 360, lineHeight: 360, color: C.brandDeep },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labLabel: { ...T.tiny, color: C.brand },
  heading: { marginTop: 16 },
  kicker: { ...T.tiny, color: C.brand, marginBottom: 5 },
  title: { ...T.display, fontSize: 34, lineHeight: 39, color: C.ink },
  answer: { color: C.brand },
  subtitle: { ...T.bodyMd, color: C.ink2, marginTop: 5 },
  sceneArea: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center' },
  details: { gap: 10, paddingHorizontal: 8 },
  answerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.brand },
  dotWrong: { backgroundColor: C.danger },
  answerLabel: { ...T.bodySm, color: C.ink3 },
  answerValue: { ...T.bodyMd, color: C.brand, fontWeight: '700' },
  answerValueWrong: { color: C.danger },
  divider: { height: 1, backgroundColor: C.line },
  explain: { ...T.bodyMd, color: C.ink2, textAlign: 'center' },
  actions: { gap: 8, marginTop: 14 },
  retry: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  retryText: { ...T.bodySm, color: C.brand, fontWeight: '700' },
})

export default DemoResultScreen
