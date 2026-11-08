import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { AuthSwitch, Field, LimeButton, OrDivider, ScreenBg, SocialTile } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Ro'yxatdan o'tish — yangi foydalanuvchining asosiy yo'li. Xatolar har
 * maydon ostida; Telegram varianti shartlarga rozilikdan keyin ochiladi.
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
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [emailErr, setEmailErr] = useState<string | null>(null)
  const [passErr, setPassErr] = useState<string | null>(null)
  const [termsErr, setTermsErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const submit = () => {
    const n = name.trim().length >= 3 ? null : "Ism familiyangizni to'liq kiriting."
    const e = EMAIL_RE.test(email.trim()) ? null : "Email manzilini to'g'ri kiriting (misol: ali@mail.com)."
    const p = password.length >= 6 ? null : "Parol kamida 6 belgidan iborat bo'lsin."
    const t = terms ? null : 'Davom etish uchun shartlarga rozilik bering.'
    setNameErr(n)
    setEmailErr(e)
    setPassErr(p)
    setTermsErr(t)
    if (n || e || p || t) {
      triggerHaptic('warning')
      return
    }
    const first = name.trim().split(/\s+/)[0].toLowerCase()
    setProfile(name.trim(), first)
    signInEmail(email.trim())
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  const openTelegram = () => {
    if (!terms) {
      triggerHaptic('warning')
      setTermsErr('Telegram bilan kirish uchun ham shartlarga rozilik bering.')
      return
    }
    setTermsErr(null)
    triggerHaptic('light')
    setTgOpen(true)
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
              active="signup"
              onSwitch={() => { triggerHaptic('light'); navigation.replace('Login') }}
              style={styles.switch}
            />

            <Text style={styles.title}>Yangi hisob oching</Text>
            <Text style={styles.sub}>Bir daqiqa — barcha mavzular ochiq.</Text>

            <View style={styles.form}>
              <Field
                label="Ism familiya"
                icon={<Ionicons name="person-outline" size={17} color={C.ink4} />}
                value={name}
                onChangeText={v => { setName(v); setNameErr(null) }}
                placeholder="Masalan: Ali Karimov"
                autoCapitalize="words"
                error={nameErr}
              />

              <Field
                style={styles.mt14}
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
                placeholder="Kamida 6 belgi o'ylab toping"
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

              <Pressable
                onPress={() => { triggerHaptic('light'); setTerms(v => !v); setTermsErr(null) }}
                hitSlop={12}
                style={styles.terms}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: terms }}
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

              {!!termsErr && <Text style={styles.err}>{termsErr}</Text>}

              <LimeButton label="Ro'yxatdan o'tish" onPress={submit} style={styles.submit} />

              <OrDivider label="yoki" />

              <SocialTile style={styles.telegramTile} onPress={openTelegram}>
                <TelegramMark />
                <Text style={styles.socialText}>Telegram bilan kirish</Text>
                <View style={styles.socialTag}>
                  <Text style={styles.socialTagText}>Parolsiz</Text>
                </View>
              </SocialTile>
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
  termsText: { ...T.bodySm, fontWeight: '500', color: C.ink2, flex: 1, lineHeight: 19 },
  err: { marginTop: 12, paddingHorizontal: 4, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: '#C2453D' },
  submit: { marginTop: 20 },
  socialText: { fontSize: 15, fontWeight: '500', color: C.ink },
  telegramTile: { backgroundColor: '#F2FAFE', borderColor: '#CFE8F7', justifyContent: 'flex-start', paddingHorizontal: 16 },
  socialTag: { marginLeft: 'auto', height: 24, paddingHorizontal: 9, borderRadius: R.full, backgroundColor: '#E1F3FC', alignItems: 'center', justifyContent: 'center' },
  socialTagText: { fontSize: 11, fontWeight: '600', color: '#1B87BE' },
})

export default SignUpScreen
