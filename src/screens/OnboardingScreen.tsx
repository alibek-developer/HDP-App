import { Fragment } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade, Reveal } from '../components/Reveal'
import OnboardingHero from '../components/OnboardingHero'
import { LimeButton } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { TOPICS } from '../data/curriculum'
import type { RootStackParamList } from '../navigation/types'
import { C, NUM } from '../theme/tokens'

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>

const CHAIN = [
  { icon: 'play' as const, label: 'Video' },
  { icon: 'bulb-outline' as const, label: 'Misol' },
  { icon: 'checkmark' as const, label: 'Test' },
]

/**
 * Kutib olish — bitta ekran, scrollsiz. Sahna oq fonda chiziladi va nafas
 * oladi; matn qisqa: yo'l nima ekanini rasm emas, uchta so'z aytadi.
 */
const OnboardingScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets()

  const start = () => {
    triggerHaptic('medium')
    navigation.replace('SignUp')
  }

  const login = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  return (
    <Fade>
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 14 },
        ]}
      >
        <View style={styles.header}>
          <BrandMark size={30} />
          <Wordmark size={18} />
        </View>

        <Reveal y={18} duration={440} style={styles.heroWrap}>
          <OnboardingHero />
        </Reveal>

        <Reveal y={14} delay={80} duration={380}>
          <Text style={styles.title}>
            <Text style={styles.titleDim}>Har dars — </Text>
            <Text style={styles.titleStrong}>bir qadam</Text>
          </Text>
          <Text style={styles.sub}>
            Video, misol va test — har mavzuni bitta yo&apos;lda o&apos;zlashtirasiz.
          </Text>
        </Reveal>

        <Reveal y={12} delay={140} duration={360} style={styles.chainWrap}>
          <View style={styles.chainRow}>
            {CHAIN.map((step, i) => (
              <Fragment key={step.label}>
                {i > 0 && <View style={styles.chainLink} />}
                <View style={styles.chainCol}>
                  <View style={[styles.chainNode, i === CHAIN.length - 1 && styles.chainNodeOn]}>
                    <Ionicons
                      name={step.icon}
                      size={15}
                      color={i === CHAIN.length - 1 ? C.inkOnLime : C.brand}
                    />
                  </View>
                  <Text style={[styles.chainLabel, i === CHAIN.length - 1 && styles.chainLabelOn]}>
                    {step.label}
                  </Text>
                </View>
              </Fragment>
            ))}
          </View>
        </Reveal>

        <View style={styles.spacer} />

        <Reveal y={12} delay={190} duration={360}>
          <LimeButton
            label="Boshlash"
            onPress={start}
            trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
          />

          <Pressable
            onPress={login}
            accessibilityRole="button"
            style={({ pressed }) => [styles.loginRow, pressed && { opacity: 0.65 }]}
          >
            <Text style={styles.loginText}>Hisobingiz bormi?</Text>
            <Text style={styles.loginLink}>Kirish</Text>
            <Ionicons name="chevron-forward" size={13} color={C.brand} />
          </Pressable>

          <Text style={[styles.footNote, NUM]}>{TOPICS.length} mavzu · bepul boshlash</Text>
        </Reveal>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 2 },

  heroWrap: { flex: 1, minHeight: 150, justifyContent: 'center' },

  title: { marginTop: 6, fontSize: 29, lineHeight: 35, letterSpacing: -0.7 },
  titleDim: { color: '#77947D', fontWeight: '400' },
  titleStrong: { color: C.ink, fontWeight: '700' },
  sub: { marginTop: 6, maxWidth: 330, fontSize: 13.5, lineHeight: 20, fontWeight: '500', color: C.ink3 },

  chainWrap: { marginTop: 16 },
  chainRow: { flexDirection: 'row', alignItems: 'flex-start' },
  chainCol: { alignItems: 'center', minWidth: 64 },
  chainLink: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    marginTop: 17,
    backgroundColor: '#E3EEDB',
  },
  chainNode: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F8EA',
    borderWidth: 1,
    borderColor: '#E3EEDB',
  },
  chainNodeOn: {
    backgroundColor: C.limeBright,
    borderColor: 'rgba(95,175,34,0.5)',
  },
  chainLabel: { marginTop: 6, fontSize: 12, fontWeight: '600', color: C.ink3 },
  chainLabelOn: { color: C.ink },

  spacer: { flexGrow: 0.35, minHeight: 14 },

  loginRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  loginText: { fontSize: 13, fontWeight: '500', color: C.ink3 },
  loginLink: { fontSize: 13, fontWeight: '600', color: C.brand },
  footNote: { marginTop: 8, textAlign: 'center', fontSize: 11, fontWeight: '500', color: C.ink4 },
})

export default OnboardingScreen
