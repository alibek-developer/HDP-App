import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { AuthSwitch, Field, LimeButton, OrDivider, ScreenBg, SocialTile, TapText } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Kirish — Telegram bir tegda, yoki email + parol. Yuqoridagi tanlov
 * orqali ro'yxatdan o'tishga o'tiladi; xatolar har maydon ostida ko'rinadi.
 */
const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => {
  const insets = useSafeAreaInsets()
  const signInEmail = useApp(s => s.signInWithEmail)
  const savedEmail = useApp(s => s.email)

  const [email, setEmail] = useState(savedEmail ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailErr, setEmailErr] = useState<string | null>(null)
  const [passErr, setPassErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const emailEnter = () => {
    const e = EMAIL_RE.test(email.trim()) ? null : "Email manzilini to'g'ri kiriting (misol: ali@mail.com)."
    const p = password.length >= 6 ? null : "Parol kamida 6 belgidan iborat bo'lsin."
    setEmailErr(e)
    setPassErr(p)
    if (e || p) {
      triggerHaptic('warning')
      return
    }
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
              <BrandMark size={34} />
              <Wordmark size={22} />
            </View>

            <AuthSwitch
              active="login"
              onSwitch={() => { triggerHaptic('light'); navigation.replace('SignUp') }}
              style={styles.switch}
            />

            <Text style={styles.title}>Hisobingizga kirish</Text>
            <Text style={styles.sub}>Telegram bilan bir tegda — yoki email va parol bilan.</Text>

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
                label="Email"
                icon={<Ionicons name="mail-outline" size={17} color={C.ink4} />}
                value={email}
                onChangeText={v => { setEmail(v); setEmailErr(null) }}
                placeholder="misol: ali@mail.com"
                keyboardType="email-address"
                error={emailErr}
              />

              <Field
                style={styles.mt14}
                label="Parol"
                icon={<Ionicons name="lock-closed-outline" size={17} color={C.ink4} />}
                value={password}
                onChangeText={v => { setPassword(v); setPassErr(null) }}
                placeholder="Parolingizni kiriting"
                secureTextEntry={!showPassword}
                error={passErr}
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

              <View style={styles.row}>
                <TapText
                  onPress={() => { triggerHaptic('light'); navigation.navigate('Forgot') }}
                  style={styles.forgot}
                >
                  Parolni unutdingizmi?
                </TapText>
              </View>

              <LimeButton label="Kirish" onPress={emailEnter} style={styles.submit} />
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
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12 },
  switch: { marginHorizontal: 24, marginTop: 18 },
  title: { ...T.h2, textAlign: 'center', marginTop: 22, paddingHorizontal: 32, color: C.ink },
  sub: { ...T.bodyMd, color: C.ink3, textAlign: 'center', marginTop: 6, paddingHorizontal: 32 },
  form: { paddingHorizontal: 24, marginTop: 22 },
  mt14: { marginTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, paddingHorizontal: 4 },
  forgot: { ...T.bodySm, fontWeight: '600', color: C.brand },
  submit: { marginTop: 20 },
  socialText: { fontSize: 15, fontWeight: '500', color: C.ink },
  telegramTile: { backgroundColor: '#F2FAFE', borderColor: '#CFE8F7', justifyContent: 'flex-start', paddingHorizontal: 16 },
  socialTag: { marginLeft: 'auto', height: 24, paddingHorizontal: 9, borderRadius: R.full, backgroundColor: '#E1F3FC', alignItems: 'center', justifyContent: 'center' },
  socialTagText: { fontSize: 11, fontWeight: '600', color: '#1B87BE' },
})

export default LoginScreen
