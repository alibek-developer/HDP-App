import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import { Field, LimeButton, OrDivider, ScreenBg, SocialTile, TapText } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const GoogleMark = () => (
  <Svg viewBox="0 0 48 48" width={18} height={18}>
    <Path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <Path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
    <Path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7L4.34 14.12C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
    <Path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C39.02 4.49 34.04 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7C13.42 14.62 18.27 10.75 24 10.75z" />
  </Svg>
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * 1-qadam: Ro'yxatdan o'tish. Ism/email/parol/shart tekshiruvdan o'tmasa
 * hisob ochilmaydi. Telegram tugmasi bu yerda yo'q — u faqat mini-app'da.
 */
const SignUpScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'SignUp'>) => {
  const insets = useSafeAreaInsets()
  const signInEmail = useApp(s => s.signInWithEmail)
  const setProfile = useApp(s => s.setProfile)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [terms, setTerms] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = () => {
    if (name.trim().length < 3) {
      triggerHaptic('warning')
      setErr("Ism familiyani to'liq kiriting.")
      return
    }
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
    if (!terms) {
      triggerHaptic('warning')
      setErr('Davom etish uchun shartlarga rozilik bering.')
      return
    }
    setErr(null)
    const first = name.trim().split(/\s+/)[0].toLowerCase()
    setProfile(name.trim(), first)
    signInEmail(email.trim())
    triggerHaptic('success')
    navigation.replace('Home')
  }

  return (
    <Fade>
      <View style={styles.root}>
        <ScreenBg />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
          <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
            <Pressable
              onPress={() => navigation.goBack()}
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
              <Text style={{ color: C.ink4, fontWeight: '400' }}>Yangi hisob </Text>
              <Text style={{ color: C.ink, fontWeight: '800' }}>ochish</Text>
            </Text>
            <Text style={styles.sub}>Bir daqiqada ro'yxatdan o'ting — 10 ta dars darhol bepul.</Text>

            <View style={styles.form}>
              <Field
                icon={<Ionicons name="person-outline" size={17} color={C.ink4} />}
                value={name}
                onChangeText={setName}
                placeholder="Ism familiya"
                autoCapitalize="words"
              />

              <Field
                style={styles.mt12}
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
                placeholder="Parol o'ylab toping"
                secureTextEntry={!showPassword}
                right={
                  <Pressable
                    hitSlop={8}
                    onPress={() => { triggerHaptic('light'); setShowPassword(v => !v) }}
                    accessibilityLabel={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                  >
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.ink4} />
                  </Pressable>
                }
              />

              <Pressable
                onPress={() => { triggerHaptic('light'); setTerms(v => !v) }}
                hitSlop={8}
                style={styles.terms}
              >
                <View style={[styles.checkbox, terms && styles.checkboxOn]}>
                  {terms && (
                    <LinearGradient
                      colors={['#9BE04B', '#7ED321']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 6 }]}
                    />
                  )}
                  {terms && <Ionicons name="checkmark" size={13} color={C.inkOnLime} />}
                </View>
                <Text style={styles.termsText}>
                  Foydalanish shartlari va maxfiylik siyosatiga roziman
                </Text>
              </Pressable>

              {!!err && <Text style={styles.err}>{err}</Text>}

              <LimeButton label="Ro'yxatdan o'tish" onPress={submit} style={styles.submit} />

              <OrDivider label="yoki quyidagilar orqali" />

              <SocialTile soon dashed onPress={() => triggerHaptic('warning')} disabled>
                <GoogleMark />
                <Text style={styles.socialText}>Google</Text>
              </SocialTile>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Hisobingiz bormi? </Text>
                <TapText
                  onPress={() => { triggerHaptic('light'); navigation.navigate('Login') }}
                  style={styles.footerLink}
                >
                  Kirish
                </TapText>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  terms: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, paddingHorizontal: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E0D2',
  },
  checkboxOn: { borderWidth: 1, borderColor: '#7ED321' },
  termsText: { ...T.bodySm, fontWeight: '600', color: C.ink2, flex: 1, lineHeight: 19 },
  err: { marginTop: 12, paddingHorizontal: 4, fontSize: 12.5, lineHeight: 18, fontWeight: '700', color: '#C2453D' },
  submit: { marginTop: 24 },
  socialText: { fontSize: 15, fontWeight: '700', color: C.ink },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { ...T.bodyMd, color: C.ink3 },
  footerLink: { ...T.bodyMd, color: C.brand, fontWeight: '800', textDecorationLine: 'underline' },
})

export default SignUpScreen
