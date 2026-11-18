import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Reveal } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { AuthSwitch, Field, GhostButton, LimeButton, TapText } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { useApp } from '../store/useStore'
import { C } from '../theme/tokens'

type AuthMode = 'login' | 'signup'

type Props<RouteName extends 'Login' | 'SignUp'> = {
  initialMode: AuthMode
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function AuthScreen<RouteName extends 'Login' | 'SignUp'>({ initialMode, navigation }: Props<RouteName>) {
  const insets = useSafeAreaInsets()
  const signInEmail = useApp(s => s.signInWithEmail)
  const setProfile = useApp(s => s.setProfile)
  const savedEmail = useApp(s => s.email)

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialMode === 'login' ? savedEmail ?? '' : '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [terms, setTerms] = useState(false)
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [emailErr, setEmailErr] = useState<string | null>(null)
  const [passErr, setPassErr] = useState<string | null>(null)
  const [termsErr, setTermsErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const changeMode = (next: AuthMode) => {
    triggerHaptic('light')
    setMode(next)
    setNameErr(null)
    setEmailErr(null)
    setPassErr(null)
    setTermsErr(null)
  }

  const submitLogin = () => {
    const validEmail = EMAIL_RE.test(email.trim())
    const validPassword = password.length >= 6
    setEmailErr(validEmail ? null : "Email manzilini to'g'ri kiriting (misol: ali@mail.com).")
    setPassErr(validPassword ? null : "Parol kamida 6 belgidan iborat bo'lsin.")
    if (!validEmail || !validPassword) {
      triggerHaptic('warning')
      return
    }
    signInEmail(email.trim())
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  const submitSignUp = () => {
    const validName = name.trim().length >= 3
    const validEmail = EMAIL_RE.test(email.trim())
    const validPassword = password.length >= 6
    setNameErr(validName ? null : "Ism familiyangizni to'liq kiriting.")
    setEmailErr(validEmail ? null : "Email manzilini to'g'ri kiriting (misol: ali@mail.com).")
    setPassErr(validPassword ? null : "Parol kamida 6 belgidan iborat bo'lsin.")
    setTermsErr(terms ? null : 'Davom etish uchun shartlarga rozilik bering.')
    if (!validName || !validEmail || !validPassword || !terms) {
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
    if (mode === 'signup' && !terms) {
      setTermsErr('Telegram bilan davom etish uchun shartlarga rozilik bering.')
      triggerHaptic('warning')
      return
    }
    triggerHaptic('light')
    setTgOpen(true)
  }

  const signup = mode === 'signup'

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#F5FBEC', '#FFFFFF']}
        locations={[0, 0.38]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={() => { triggerHaptic('light'); navigation.replace('Onboarding') }}
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

          <AuthSwitch active={mode} onSwitch={changeMode} style={styles.switch} />

          <Reveal key={mode} y={12} duration={300}>
            <Text style={styles.title}>
              {signup ? (
                <Text>
                  <Text style={styles.titleDim}>Hisob </Text>
                  <Text style={styles.titleStrong}>ochish</Text>
                </Text>
              ) : (
                <Text>
                  <Text style={styles.titleDim}>Xush </Text>
                  <Text style={styles.titleStrong}>kelibsiz</Text>
                </Text>
              )}
            </Text>

            <View style={styles.fields}>
              {signup && (
                <Field
                  icon={<Ionicons name="person-outline" size={17} color={C.ink4} />}
                  value={name}
                  onChangeText={value => { setName(value); setNameErr(null) }}
                  placeholder="Ism familiya"
                  autoCapitalize="words"
                  returnKeyType="next"
                  error={nameErr}
                />
              )}

              <Field
                icon={<Ionicons name="mail-outline" size={17} color={C.ink4} />}
                value={email}
                onChangeText={value => { setEmail(value); setEmailErr(null) }}
                placeholder="Email manzilingiz"
                keyboardType="email-address"
                returnKeyType="next"
                error={emailErr}
              />

              <Field
                icon={<Ionicons name="lock-closed-outline" size={17} color={C.ink4} />}
                value={password}
                onChangeText={value => { setPassword(value); setPassErr(null) }}
                placeholder="Parol"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={signup ? submitSignUp : submitLogin}
                error={passErr}
                right={
                  <Pressable
                    hitSlop={13}
                    onPress={() => { triggerHaptic('light'); setShowPassword(value => !value) }}
                    accessibilityLabel={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                  >
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.ink4} />
                  </Pressable>
                }
              />
            </View>

            {signup ? (
              <>
                <Pressable
                  onPress={() => { triggerHaptic('light'); setTerms(value => !value); setTermsErr(null) }}
                  hitSlop={12}
                  style={styles.terms}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: terms }}
                >
                  <View style={[styles.checkbox, terms && styles.checkboxOn]}>
                    {terms && (
                      <LinearGradient
                        colors={['#A6EA55', '#7ED321']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[StyleSheet.absoluteFill, { borderRadius: 6 }]}
                      />
                    )}
                    {terms && <Ionicons name="checkmark" size={13} color={C.inkOnLime} />}
                  </View>
                  <Text style={styles.termsText}>Foydalanish shartlariga roziman</Text>
                </Pressable>
                {!!termsErr && <Text style={styles.err}>{termsErr}</Text>}
              </>
            ) : (
              <View style={styles.forgotRow}>
                <TapText onPress={() => { triggerHaptic('light'); navigation.navigate('Forgot') }} style={styles.forgot}>
                  Parolni unutdingizmi?
                </TapText>
              </View>
            )}

            <LimeButton
              label={signup ? "Ro'yxatdan o'tish" : 'Kirish'}
              onPress={signup ? submitSignUp : submitLogin}
              style={styles.submit}
              trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
            />

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>yoki</Text>
              <View style={styles.orLine} />
            </View>

            <GhostButton
              label={signup ? 'Telegram bilan boshlash' : 'Telegram bilan kirish'}
              onPress={openTelegram}
              icon={<TelegramMark size={19} />}
            />
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>

      <TelegramAuthSheet
        visible={tgOpen}
        onClose={() => setTgOpen(false)}
        onDone={() => navigation.replace('Goal')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  fill: { flex: 1 },
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

  switch: { marginTop: 4, backgroundColor: '#F4F9EE' },
  title: { marginTop: 22, fontSize: 29, lineHeight: 34, letterSpacing: -0.7 },
  titleDim: { color: '#77947D', fontWeight: '400' },
  titleStrong: { color: C.ink, fontWeight: '700' },

  fields: { marginTop: 20, gap: 10 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, paddingHorizontal: 2 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E0D2',
  },
  checkboxOn: { borderColor: '#7ED321' },
  termsText: { flex: 1, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: C.ink2 },
  err: { marginTop: 8, paddingHorizontal: 2, fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: '#C2453D' },
  forgotRow: { alignItems: 'flex-end', marginTop: 10, paddingHorizontal: 4 },
  forgot: { fontSize: 12.5, lineHeight: 17, fontWeight: '600', color: C.brand },
  submit: { marginTop: 20 },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, marginBottom: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(28,50,20,0.09)' },
  orText: { fontSize: 11.5, fontWeight: '500', color: C.ink4 },
})

export default AuthScreen
