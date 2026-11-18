import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade, Reveal } from '../components/Reveal'
import { GhostButton, TelegramButton } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { TELEGRAM_BOT_URL } from '../lib/telegramAuth'
import type { RootStackParamList } from '../navigation/types'
import { C } from '../theme/tokens'

/**
 * Parolni tiklash — hisob qurilmada saqlangani uchun emailga havola
 * yuborilmaydi; yagona yo'l — Telegram orqali yordam.
 */
const ForgotPasswordScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Forgot'>) => {
  const insets = useSafeAreaInsets()

  const back = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  return (
    <Fade>
      <View style={styles.root}>
        <LinearGradient
          colors={['#F5FBEC', '#FFFFFF']}
          locations={[0, 0.38]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={back}
              hitSlop={10}
              style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityLabel="Orqaga"
            >
              <Ionicons name="chevron-back" size={19} color={C.ink2} />
            </Pressable>

            <View style={styles.brandRow} pointerEvents="none">
              <BrandMark size={30} />
              <Wordmark size={18} />
            </View>

            <View style={styles.topBarSide} />
          </View>

          <Reveal y={12} duration={320}>
            <Text style={styles.title}>
              <Text style={styles.titleDim}>Parolni </Text>
              <Text style={styles.titleStrong}>tiklash</Text>
            </Text>
            <Text style={styles.sub}>Telegram orqali yordam olasiz.</Text>

            <TelegramButton
              label="Telegramga yozish"
              onPress={() => {
                triggerHaptic('light')
                void Linking.openURL(TELEGRAM_BOT_URL)
              }}
              style={styles.tg}
            />

            <GhostButton
              label="Kirishga qaytish"
              onPress={back}
              icon={<Ionicons name="arrow-back" size={16} color={C.ink2} />}
              style={styles.backBtn}
            />
          </Reveal>
        </ScrollView>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 10,
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

  title: { marginTop: 26, fontSize: 29, lineHeight: 34, letterSpacing: -0.7 },
  titleDim: { color: '#77947D', fontWeight: '400' },
  titleStrong: { color: C.ink, fontWeight: '700' },
  sub: { marginTop: 7, fontSize: 13.5, lineHeight: 20, fontWeight: '500', color: C.ink3 },

  tg: { marginTop: 20 },
  backBtn: { marginTop: 10 },
})

export default ForgotPasswordScreen
