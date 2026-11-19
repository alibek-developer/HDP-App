import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Reveal } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { AuthSwitch, Field, GhostButton, LimeButton } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { useApp } from '../store/useStore'
import { C } from '../theme/tokens'

type AuthMode = 'login' | 'signup'

type Props<RouteName extends 'Login' | 'SignUp'> = {
  initialMode: AuthMode
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName>
}

const USERNAME_RE = /^[a-z0-9_]{3,20}$/

/** «Ali Karimov» → ali_karimov — username ilova tomonidan shu tarzda tanlanadi */
const autoHandle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’'`ʻ‘]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20)

function AuthScreen<RouteName extends 'Login' | 'SignUp'>({ initialMode, navigation }: Props<RouteName>) {
  const insets = useSafeAreaInsets()
  const signInWithUsername = useApp(s => s.signInWithUsername)
  const setProfile = useApp(s => s.setProfile)
  const savedUsername = useApp(s => s.username)

  const [mode, setMode] = useState<AuthMode>(initialMode)
  /** Ro'yxatdan o'tish: avval Telegram tasdiqlanadi, keyin ism familiya so'raladi */
  const [profileStep, setProfileStep] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState(initialMode === 'login' ? savedUsername : '')
  const [terms, setTerms] = useState(false)
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [userErr, setUserErr] = useState<string | null>(null)
  const [termsErr, setTermsErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const signup = mode === 'signup'
  /** Ism lotin harflarida yozilmagan bo'lsa — barqaror zaxira nom */
  const [handleSeed] = useState(() => Math.floor(1000 + Math.random() * 9000))
  const fallback = `hdp_${handleSeed}`
  const handle = autoHandle(name)
  const shownHandle = USERNAME_RE.test(handle) ? handle : fallback

  const changeMode = (next: AuthMode) => {
    triggerHaptic('light')
    setMode(next)
    setProfileStep(false)
    setNameErr(null)
    setUserErr(null)
    setTermsErr(null)
  }

  const submitLogin = () => {
    const err = USERNAME_RE.test(username) ? null : "Foydalanuvchi nomi 3–20 belgi: a-z, 0-9, _"
    setUserErr(err)
    if (err) {
      triggerHaptic('warning')
      return
    }
    signInWithUsername(username)
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  /** Telegram tasdiqlagach: ro'yxatdan o'tishda ism so'raladi, kirishda darhol davom etadi */
  const afterTelegram = () => {
    if (mode !== 'signup') {
      navigation.replace('Goal')
      return
    }
    setName(useApp.getState().name.trim())
    setNameErr(null)
    setProfileStep(true)
    triggerHaptic('success')
  }

  const submitProfile = () => {
    const clean = name.trim()
    const message = clean.length >= 3 ? null : "Ism familiyangizni to'liq kiriting."
    setNameErr(message)
    if (message) {
      triggerHaptic('warning')
      return
    }
    setProfile(clean, shownHandle)
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  const openTelegram = () => {
    if (signup && !terms) {
      setTermsErr('Telegram bilan boshlash uchun shartlarga rozilik bering.')
      triggerHaptic('warning')
      return
    }
    triggerHaptic('light')
    setTgOpen(true)
  }

  const heading = profileStep
    ? { dim: 'Tasdiqlandi, endi ', strong: 'tanishamiz' }
    : signup
      ? { dim: 'Hisob ', strong: 'ochish' }
      : { dim: 'Xush ', strong: 'kelibsiz' }

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
            {profileStep ? (
              <View style={styles.topBarSide} />
            ) : (
              <Pressable
                onPress={() => { triggerHaptic('light'); navigation.replace('Onboarding') }}
                hitSlop={10}
                style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.95 }] }]}
                accessibilityLabel="Orqaga"
              >
                <Ionicons name="chevron-back" size={19} color={C.ink2} />
              </Pressable>
            )}

            <View style={styles.brandRow} pointerEvents="none">
              <BrandMark size={30} />
              <Wordmark size={18} />
            </View>

            <View style={styles.topBarSide} />
          </View>

          {!profileStep && <AuthSwitch active={mode} onSwitch={changeMode} style={styles.switch} />}

          <Reveal key={`${mode}-${profileStep}`} y={12} duration={300}>
            <Text style={styles.title}>
              <Text style={styles.titleDim}>{heading.dim}</Text>
              <Text style={styles.titleStrong}>{heading.strong}</Text>
            </Text>

            {profileStep ? (
              <>
                <Text style={styles.lead}>
                  Ismingiz ilovada ko'rinadi. Foydalanuvchi nomini tizim o'zi tanlaydi.
                </Text>

                <View style={styles.fields}>
                  <Field
                    icon={<Ionicons name="person-outline" size={17} color={C.ink4} />}
                    value={name}
                    onChangeText={value => { setName(value); setNameErr(null) }}
                    placeholder="Ism familiya"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={submitProfile}
                    error={nameErr}
                  />
                </View>

                <View style={styles.handleRow}>
                  <Ionicons name="at-outline" size={15} color={C.ink4} />
                  <Text style={styles.handleText} numberOfLines={1}>
                    {shownHandle}
                  </Text>
                  <Text style={styles.handleTag}>avtomatik</Text>
                </View>

                <LimeButton
                  label="Davom etish"
                  onPress={submitProfile}
                  style={styles.submit}
                  trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
                />
              </>
            ) : signup ? (
              <>
                <Text style={styles.lead}>
                  Hisob Telegram orqali tasdiqlanadi. Tasdiqdan so'ng ismingizni kiritasiz.
                </Text>

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

                <Pressable
                  onPress={openTelegram}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.tgPrimary, pressed && { transform: [{ scale: 0.985 }] }]}
                >
                  <LinearGradient
                    colors={['#3EB8F5', '#1E8FD1']}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <TelegramMark size={19} />
                  <Text style={styles.tgPrimaryText}>Telegram bilan boshlash</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.fields}>
                  <Field
                    icon={<Ionicons name="at-outline" size={17} color={C.ink4} />}
                    value={username}
                    onChangeText={value => {
                      setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))
                      setUserErr(null)
                    }}
                    placeholder="username"
                    autoComplete="username"
                    autoCorrect={false}
                    maxLength={20}
                    returnKeyType="done"
                    onSubmitEditing={submitLogin}
                    error={userErr}
                  />
                </View>

                <LimeButton
                  label="Kirish"
                  onPress={submitLogin}
                  style={styles.submit}
                  trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
                />

                <View style={styles.orRow}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>yoki</Text>
                  <View style={styles.orLine} />
                </View>

                <GhostButton
                  label="Telegram bilan kirish"
                  onPress={openTelegram}
                  icon={<TelegramMark size={19} />}
                />
              </>
            )}
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>

      <TelegramAuthSheet
        visible={tgOpen}
        onClose={() => setTgOpen(false)}
        onDone={afterTelegram}
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
  lead: { marginTop: 10, fontSize: 13, lineHeight: 19, fontWeight: '500', color: C.ink3 },

  fields: { marginTop: 20, gap: 10 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18, paddingHorizontal: 2 },
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
  submit: { marginTop: 20 },
  tgPrimary: {
    marginTop: 20,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#1E8FD1',
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  tgPrimaryText: { fontSize: 14.5, fontWeight: '600', color: '#FFFFFF' },

  handleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#F4F9EE',
  },
  handleText: { flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 18, fontWeight: '600', color: C.ink2 },
  handleTag: { fontSize: 11, lineHeight: 15, fontWeight: '600', color: C.ink4 },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, marginBottom: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(28,50,20,0.09)' },
  orText: { fontSize: 11.5, fontWeight: '500', color: C.ink4 },
})

export default AuthScreen
