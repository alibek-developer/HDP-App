import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import { TelegramMark } from '../components/TelegramAuthSheet'
import { LimeButton, ScreenBg, SocialTile } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { TELEGRAM_BOT_URL } from '../lib/telegramAuth'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

/**
 * Parolni tiklash — hisoblar qurilmada saqlangani uchun emailga havola
 * yuborilmaydi. Buning o'rniga aniq yo'l: Telegram orqali yordam olish.
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
        <ScreenBg />
        <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
          <Pressable
            onPress={back}
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.95 }] }]}
            accessibilityLabel="Orqaga"
          >
            <Ionicons name="chevron-back" size={19} color={C.ink2} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <BrandMark size={34} />
            <Wordmark size={22} />
          </View>

          <Text style={styles.title}>Parolni tiklash</Text>
          <Text style={styles.sub}>
            Hisoblar shu qurilmada saqlanadi, shuning uchun parol emailga yuborilmaydi.
          </Text>

          <View style={styles.form}>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="chatbubble-ellipses" size={18} color={C.brand} />
              </View>
              <Text style={styles.infoText}>
                Telegram orqali bizga yozing — hisobingizni tiklashga yordam beramiz.
              </Text>
            </View>

            <SocialTile
              style={styles.telegramTile}
              onPress={() => { triggerHaptic('light'); void Linking.openURL(TELEGRAM_BOT_URL) }}
            >
              <TelegramMark />
              <Text style={styles.socialText}>Telegram orqali yozish</Text>
            </SocialTile>

            <LimeButton label="Kirishga qaytish" onPress={back} style={styles.submit} />
          </View>
        </ScrollView>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas },
  topBar: { paddingHorizontal: 20 },
  back: {
    width: 44,
    height: 44,
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
  },
  scroll: { flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12 },
  title: { ...T.h2, textAlign: 'center', marginTop: 22, paddingHorizontal: 32, color: C.ink },
  sub: { ...T.bodyMd, color: C.ink3, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },
  form: { paddingHorizontal: 24, marginTop: 24 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
    marginBottom: 14,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  infoText: { flex: 1, fontSize: 14, lineHeight: 21, fontWeight: '500', color: C.ink2, paddingTop: 6 },
  socialText: { fontSize: 15, fontWeight: '500', color: C.ink },
  telegramTile: { backgroundColor: '#F2FAFE', borderColor: '#CFE8F7' },
  submit: { marginTop: 16 },
})

export default ForgotPasswordScreen
