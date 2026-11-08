import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'

type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>

const TRIPTYCH_IMG = require('../assets/onboarding-triptych.png')

export const OnboardingScreen = ({ navigation }: OnboardingProps) => {
  const insets = useSafeAreaInsets()
  const { width: winWidth, height: winHeight } = useWindowDimensions()

  const handleStart = () => {
    triggerHaptic('medium')
    navigation.replace('SignUp')
  }

  const handleLogin = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  const imgWidth = Math.min(winWidth * 0.9, 380)
  const imgHeight = Math.round(imgWidth * (260 / 376))

  return (
    <View style={styles.root}>
      {/* ── Yumshoq och-yashil gradient fon ── */}
      <LinearGradient
        colors={['#DDF2D5', '#EAF5E4', '#F7FAF5']}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + (winHeight > 700 ? 18 : 10),
            paddingBottom: insets.bottom + (winHeight > 700 ? 22 : 14),
          },
        ]}
      >
        {/* ── 1. Yuqori sarlavha: HDP Matematika ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HDP Matematika</Text>
        </View>

        {/* ── 2. 3 ta fotosurat klasteri va o'rtadagi HDP emblemasi ── */}
        <View style={styles.heroWrap}>
          <Image
            source={TRIPTYCH_IMG}
            style={{ width: imgWidth, height: imgHeight }}
            resizeMode="contain"
          />

          {/* Pastdagi ikkita pagination nuqtasi */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotInactive]} />
          </View>
        </View>

        {/* ── 3. Matn qismi (Chap tomonga tekislangan) ── */}
        <View style={styles.textWrap}>
          <Text style={styles.titleLine}>
            <Text style={styles.titleDim}>Sizning </Text>
            <Text style={styles.titleBold}>shaxsiy</Text>
          </Text>
          <Text style={styles.titleLine}>
            <Text style={styles.titleDim}>matematika </Text>
            <Text style={styles.titleBold}>ustozingiz</Text>
          </Text>

          <Text style={styles.subtitle}>
            Video dars, misol va test — bittasi ikkinchisiga olib kiradigan izchil yo&apos;l.
          </Text>
        </View>

        {/* ── 4. Pastki ikkita tugma: Boshlash va Kirish ── */}
        <View style={styles.btnWrap}>
          {/* Asosiy Lime tugma */}
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Boshlash"
          >
            <Text style={styles.btnPrimaryText}>Boshlash</Text>
          </Pressable>

          {/* Ikkilamchi Oq tugma */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.btnSecondary,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.75 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Kirish"
          >
            <Text style={styles.btnSecondaryText}>Kirish</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#DDF2D5',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },

  /* Sarlavha */
  header: {
    alignItems: 'center',
    paddingTop: 6,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: '#0C452B',
    letterSpacing: -0.3,
  },

  /* Hero rasm klasteri */
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    backgroundColor: '#385744',
  },
  dotInactive: {
    backgroundColor: '#B2CEBA',
  },

  /* Matn qismi */
  textWrap: {
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  titleLine: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  titleDim: {
    color: '#76947D',
    fontWeight: '400',
  },
  titleBold: {
    color: '#0D2718',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#536E5B',
    marginTop: 16,
    maxWidth: 320,
  },

  /* Tugmalar */
  btnWrap: {
    gap: 12,
  },
  btnPrimary: {
    height: 58,
    borderRadius: 29,
    backgroundColor: '#7CD524',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7CD524',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E2914',
    letterSpacing: -0.2,
  },
  btnSecondary: {
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F3F9F0',
    borderWidth: 1.2,
    borderColor: '#DEECE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0E2914',
    letterSpacing: -0.2,
  },
})

export default OnboardingScreen
