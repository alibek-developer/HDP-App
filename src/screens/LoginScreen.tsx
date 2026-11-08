import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { Field, LimeButton, OrDivider, ScreenBg, SocialTile, TapText } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * 2-qadam: Login. Email+parol va Telegram kirishi ishlaydi. Hisob shu
 * qurilmada saqlanadi: ilova qayta ochilganda «Kirish» ekrani chiqmaydi.
 */
const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => {
  const insets = useSafeAreaInsets()
  const signInEmail = useApp(s => s.signInWithEmail)
  const savedEmail = useApp(s => s.email)

  const [email, setEmail] = useState(savedEmail ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const emailEnter = () => {
    if (!EMAIL_RE.test(email.trim())) {
      triggerHaptic('warning')
      setErr("Email manzili noto'g'ri ko'rinishda.")
      return
    }
    if (password.length < 6) {
      triggerHaptic('warning')
      setErr('Parol kamida 6 belgi bo‘lishi kerak.')
      return
    }
    setErr(null)
    signInEmail(email.trim())
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  return (
    <Fade>
      <View style={styles.root}>
        <ScreenBg />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
          <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
            <Pressable
              onPress={() => navigation.replace('Onboarding')}
              hitSlop={10}
              style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityLabel="Orqaga"
            >
              <Ionicons name="chevron-back" size={19} color={C.ink2} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.brandRow}>
              <BrandMark size={38} />
              <Wordmark size={26} />
            </View>

            <Text style={styles.title}>
              <Text style={{ color: C.ink4, fontWeight: '400' }}>Hisobingizga </Text>
              <Text style={{ color: C.ink, fontWeight: '600' }}>kirish</Text>
            </Text>
            <Text style={styles.sub}>Telegram bilan bir tegda kiring — yoki email va parol bilan.</Text>

            <View style={styles.form}>
              <SocialTile
                style={styles.telegramTile}
                onPress={() => { triggerHaptic('light'); setTgOpen(true) }}
              >
                <TelegramMark />
                <Text style={styles.socialText}>Telegram bilan kirish</Text>
                <View style={styles.socialTag}>
                  <Text style={styles.socialTagText}>Parolsiz</Text>
                </View>
              </SocialTile>

              <OrDivider label="yoki email bilan" />

              <Field
                icon={<Ionicons name="mail-outline" size={17} color={C.ink4} />}
                value={email}
                onChangeText={setEmail}
                placeholder="Email kiriting"
                keyboardType="email-address"
              />

              <Field
                style={styles.mt12}
                icon={<Ionicons name="lock-closed-outline" size={17} color={C.ink4} />}
                value={password}
                onChangeText={setPassword}
                placeholder="Parol kiriting"
                secureTextEntry={!showPassword}
                right={
                  <Pressable
                    hitSlop={13}
                    onPress={() => { triggerHaptic('light'); setShowPassword(v => !v) }}
                    accessibilityLabel={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                  >
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.ink4} />
                  </Pressable>
                }
              />

              {!!err && <Text style={styles.err}>{err}</Text>}

              <View style={styles.row}>
                <TapText
                  onPress={() => { triggerHaptic('light'); navigation.navigate('Forgot') }}
                  style={styles.forgot}
                >
                  Parolni unutdingizmi?
                </TapText>
              </View>

              <LimeButton label="Kirish" onPress={emailEnter} style={styles.submit} />
              <Text style={styles.keepNote}>
                Hisob bu qurilmada saqlanadi — keyingi ochilishda kirmasdan davom etasiz.
              </Text>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Hisobingiz yo'qmi? </Text>
                <TapText
                  onPress={() => { triggerHaptic('light'); navigation.navigate('SignUp') }}
                  style={styles.footerLink}
                >
                  Ro'yxatdan o'tish
                </TapText>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <TelegramAuthSheet
          visible={tgOpen}
          onClose={() => setTgOpen(false)}
          onDone={() => navigation.replace('Goal')}
        />
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas },
  fill: { flex: 1 },
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
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 },
  title: { ...T.h1, textAlign: 'center', marginTop: 24, paddingHorizontal: 32, color: C.ink },
  sub: { ...T.bodyMd, color: C.ink3, textAlign: 'center', marginTop: 8, paddingHorizontal: 32 },
  form: { paddingHorizontal: 24, marginTop: 28 },
  mt12: { marginTop: 12 },
  err: { marginTop: 12, paddingHorizontal: 4, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: '#C2453D' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 14, paddingHorizontal: 4 },
  forgot: { ...T.bodySm, fontWeight: '600', color: C.brand },
  submit: { marginTop: 24 },
  keepNote: { ...T.bodySm, marginTop: 10, paddingHorizontal: 4, textAlign: 'center', color: C.ink4 },
  socialText: { fontSize: 15, fontWeight: '500', color: C.ink },
  telegramTile: { backgroundColor: '#F2FAFE', borderColor: '#CFE8F7', justifyContent: 'flex-start', paddingHorizontal: 16 },
  socialTag: { marginLeft: 'auto', height: 24, paddingHorizontal: 9, borderRadius: R.full, backgroundColor: '#E1F3FC', alignItems: 'center', justifyContent: 'center' },
  socialTagText: { fontSize: 11, fontWeight: '600', color: '#1B87BE' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { ...T.bodyMd, color: C.ink3 },
  footerLink: { ...T.bodyMd, color: C.brand, fontWeight: '600' },
})

export default LoginScreen
