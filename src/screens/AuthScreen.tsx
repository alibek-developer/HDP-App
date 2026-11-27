import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Reveal } from '../components/Reveal'
import TelegramAuthSheet, { TelegramMark } from '../components/TelegramAuthSheet'
import { AuthSwitch, Field, LimeButton } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { needsProfileName } from '../lib/onboardingDemo'
import type { RootStackParamList } from '../navigation/types'
import { useApp } from '../store/useStore'
import { R, T, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

type AuthMode = 'login' | 'signup'

type Props<RouteName extends 'Login' | 'SignUp'> = {
  initialMode: AuthMode
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName>
}

const USERNAME_RE = /^[a-z0-9_]{3,20}$/
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1)

const autoHandle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’'`ʻ‘]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20)

function AuthScreen<RouteName extends 'Login' | 'SignUp'>({ initialMode, navigation }: Props<RouteName>) {
  const C = useColors()
  const styles = makeStyles(C)
  const insets = useSafeAreaInsets()
  const signInWithUsername = useApp(s => s.signInWithUsername)
  const setProfile = useApp(s => s.setProfile)
  const savedUsername = useApp(s => s.username)

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [profileStep, setProfileStep] = useState(false)
  const [demoLogin, setDemoLogin] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState(initialMode === 'login' ? savedUsername : '')
  const [terms, setTerms] = useState(false)
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [userErr, setUserErr] = useState<string | null>(null)
  const [termsErr, setTermsErr] = useState<string | null>(null)
  const [tgOpen, setTgOpen] = useState(false)

  const signup = mode === 'signup'
  const [handleSeed] = useState(() => Math.floor(1000 + Math.random() * 9000))
  const fallback = `hdp_${handleSeed}`
  const handle = autoHandle(name)
  const shownHandle = USERNAME_RE.test(handle) ? handle : fallback

  const tgScale = useRef(new Animated.Value(1)).current
  const tgShine = useRef(new Animated.Value(0)).current
  const checkScale = useRef(new Animated.Value(1)).current
  const demoChevron = useRef(new Animated.Value(0)).current
  const orbit = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const shine = Animated.loop(
      Animated.timing(tgShine, {
        toValue: 1,
        duration: 3600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    const rotation = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    shine.start()
    rotation.start()
    return () => {
      shine.stop()
      rotation.stop()
    }
  }, [orbit, tgShine])

  useEffect(() => {
    Animated.timing(demoChevron, {
      toValue: demoLogin ? 1 : 0,
      duration: 220,
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start()
  }, [demoChevron, demoLogin])

  const animateTg = (toValue: number) => {
    Animated.spring(tgScale, {
      toValue,
      friction: 8,
      tension: 170,
      useNativeDriver: true,
    }).start()
  }

  const toggleTerms = () => {
    triggerHaptic('light')
    setTerms(value => !value)
    setTermsErr(null)
    Animated.sequence([
      Animated.timing(checkScale, {
        toValue: 0.86,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const changeMode = (next: AuthMode) => {
    triggerHaptic('light')
    setMode(next)
    setProfileStep(false)
    setDemoLogin(false)
    setNameErr(null)
    setUserErr(null)
    setTermsErr(null)
  }

  const submitLogin = () => {
    const err = USERNAME_RE.test(username) ? null : 'Foydalanuvchi nomi 3–20 belgi: a-z, 0-9, _'
    setUserErr(err)
    if (err) {
      triggerHaptic('warning')
      return
    }
    signInWithUsername(username)
    triggerHaptic('success')
    navigation.replace('Goal')
  }

  const afterTelegram = () => {
    const telegramName = useApp.getState().name.trim()
    if (mode === 'signup' && needsProfileName(telegramName)) {
      setName(telegramName)
      setNameErr(null)
      setProfileStep(true)
    } else {
      navigation.replace('Goal')
    }
    triggerHaptic('success')
  }

  const submitProfile = () => {
    const clean = name.trim()
    const message = needsProfileName(clean) ? 'Ism familiyangizni to‘liq kiriting.' : null
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

  const back = () => {
    triggerHaptic('light')
    if (navigation.canGoBack()) navigation.goBack()
    else navigation.replace('Onboarding')
  }

  const heading = profileStep
    ? { dim: 'Tasdiqlandi, endi ', strong: 'tanishamiz' }
    : signup
      ? { dim: 'Progressni ', strong: 'saqlang.' }
      : { dim: 'Xush ', strong: 'kelibsiz' }

  const lead = profileStep
    ? 'Telegram profilingizda ism yetarli emas. Ilovada ko‘rinadigan ismingizni kiriting.'
    : signup
      ? 'Telegram hisobingiz bilan davom eting. Ism Telegram profilingizdan olinadi.'
      : 'Telegram bilan kiring va qolgan savollarni davom ettiring.'

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[C.leafTint, C.surface]}
        locations={[0, 0.42]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View pointerEvents="none" style={styles.ambient}>
        <View style={styles.orbitInner} />
        <Animated.View
          style={[
            styles.orbit,
            { transform: [{ rotate: orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
          ]}
        >
          <View style={styles.orbitDot} />
        </Animated.View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 18 },
          ]}
        >
          <Reveal y={-8} duration={300} style={styles.topBar}>
            {profileStep ? (
              <View style={styles.topBarSide} />
            ) : (
              <Pressable
                onPress={back}
                hitSlop={10}
                style={({ pressed }) => [styles.back, pressed && { opacity: 0.55, transform: [{ scale: 0.94 }] }]}
                accessibilityLabel="Orqaga"
              >
                <Ionicons name="chevron-back" size={21} color={C.ink2} />
              </Pressable>
            )}

            <View style={styles.brandRow} pointerEvents="none">
              <BrandMark size={29} />
              <Wordmark size={17} />
            </View>
            <View style={styles.topBarSide} />
          </Reveal>

          {!profileStep && (
            <Reveal delay={40} y={8} duration={280} style={styles.switchWrap}>
              <AuthSwitch active={mode} onSwitch={changeMode} />
            </Reveal>
          )}

          <View style={styles.main}>
            <Reveal key={`copy-${mode}-${profileStep}`} delay={60} y={12} duration={340}>
              <Text style={styles.kicker}>{profileStep ? 'PROFIL' : signup ? 'YANGI HISOB' : 'KIRISH'}</Text>
              <Text style={styles.title}>
                <Text style={styles.titleDim}>{heading.dim}</Text>
                <Text style={styles.titleStrong}>{heading.strong}</Text>
              </Text>
              <Text style={styles.lead}>{lead}</Text>

              <View style={styles.trustRow}>
                <View style={styles.trustIcon}>
                  <Ionicons
                    name={profileStep ? 'checkmark-circle-outline' : 'shield-checkmark-outline'}
                    size={17}
                    color={C.brand}
                  />
                </View>
                <Text style={styles.trustText}>
                  {profileStep
                    ? 'Telegram profilingiz tasdiqlandi.'
                    : 'Parolsiz kirish · profilingiz Telegram orqali tasdiqlanadi.'}
                </Text>
              </View>
            </Reveal>

            {profileStep ? (
              <Reveal key="profile" delay={120} y={12} duration={340} style={styles.profileSection}>
                <Field
                  label="Ism familiya"
                  icon={<Ionicons name="person-outline" size={17} color={C.ink4} />}
                  value={name}
                  onChangeText={value => { setName(value); setNameErr(null) }}
                  placeholder="Masalan: Aziza Karimova"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={submitProfile}
                  error={nameErr}
                />
                <View style={styles.handleRow}>
                  <Ionicons name="at-outline" size={15} color={C.ink4} />
                  <Text style={styles.handleText} numberOfLines={1}>{shownHandle}</Text>
                  <Text style={styles.handleTag}>avtomatik</Text>
                </View>
                <LimeButton
                  label="Davom etish"
                  onPress={submitProfile}
                  style={styles.submit}
                  trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
                />
              </Reveal>
            ) : (
              <Reveal key={`actions-${mode}`} delay={120} y={14} duration={360} style={styles.actionSection}>
                {signup && (
                  <>
                    <Pressable
                      onPress={toggleTerms}
                      hitSlop={10}
                      style={styles.terms}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: terms }}
                    >
                      <Animated.View style={[styles.checkbox, terms && styles.checkboxOn, { transform: [{ scale: checkScale }] }]}>
                        {terms && (
                          <LinearGradient
                            colors={['#A6EA55', C.lime]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[StyleSheet.absoluteFill, { borderRadius: 7 }]}
                          />
                        )}
                        {terms && <Ionicons name="checkmark" size={13} color={C.inkOnLime} />}
                      </Animated.View>
                      <Text style={styles.termsText}>Foydalanish shartlariga roziman</Text>
                    </Pressable>
                    {!!termsErr && <Text style={styles.err}>{termsErr}</Text>}
                  </>
                )}

                <Animated.View style={{ transform: [{ scale: tgScale }] }}>
                  <Pressable
                    onPress={openTelegram}
                    onPressIn={() => animateTg(0.97)}
                    onPressOut={() => animateTg(1)}
                    accessibilityRole="button"
                    style={styles.tgPrimary}
                  >
                    <LinearGradient
                      colors={['#3EB8F5', '#1E8FD1']}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 0.8, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Animated.View
                      style={[
                        styles.tgShine,
                        {
                          transform: [
                            { translateX: tgShine.interpolate({ inputRange: [0, 1], outputRange: [-90, 430] }) },
                            { rotate: '18deg' },
                          ],
                        },
                      ]}
                    />
                    <View style={styles.tgLogo}><TelegramMark size={19} /></View>
                    <View style={styles.tgCopy}>
                      <Text style={styles.tgPrimaryText}>{signup ? 'Telegram bilan boshlash' : 'Telegram bilan kirish'}</Text>
                      <Text style={styles.tgSub}>Parolsiz · 1 bosishda</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                  </Pressable>
                </Animated.View>

                {!signup && (
                  <>
                    <Pressable
                      onPress={() => { triggerHaptic('light'); setDemoLogin(value => !value); setUserErr(null) }}
                      style={({ pressed }) => [styles.demoToggle, pressed && { opacity: 0.55 }]}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: demoLogin }}
                    >
                      <Text style={styles.demoToggleText}>Demo rejim: username bilan kirish</Text>
                      <Animated.View
                        style={{
                          transform: [{ rotate: demoChevron.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
                        }}
                      >
                        <Ionicons name="chevron-down" size={15} color={C.ink3} />
                      </Animated.View>
                    </Pressable>
                    {demoLogin && (
                      <Reveal key="demo" y={8} duration={220} style={styles.demoBox}>
                        <Text style={styles.demoLabel}>Demo rejim</Text>
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
                        <Text style={styles.demoNote}>Bu rejim faqat demo; server hisobi yaratilmaydi.</Text>
                        <LimeButton label="Demo kirish" onPress={submitLogin} height={50} />
                      </Reveal>
                    )}
                  </>
                )}
              </Reveal>
            )}
          </View>

          <Reveal delay={190} y={6} duration={280} style={styles.footerNote}>
            <Ionicons name="lock-closed-outline" size={12} color={C.ink3} />
            <Text style={styles.footerNoteText}>Telegram hisabingiz ilova serverida tasdiqlanadi.</Text>
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

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface, overflow: 'hidden' },
  fill: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  ambient: { position: 'absolute', width: 230, height: 230, right: -86, top: 54, opacity: 0.32 },
  orbit: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1,
    borderColor: C.leaf,
    alignItems: 'center',
  },
  orbitInner: {
    position: 'absolute',
    width: 158,
    height: 158,
    borderRadius: 79,
    top: 36,
    left: 36,
    borderWidth: 1,
    borderColor: C.leaf,
    opacity: 0.55,
  },
  orbitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.leaf,
    position: 'absolute',
    top: 28,
    right: 27,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topBarSide: { width: 44, height: 44 },
  switchWrap: { marginTop: 8 },
  main: { flex: 1, justifyContent: 'center', paddingVertical: 24 },
  kicker: { ...T.tiny, color: C.brand, marginBottom: 10 },
  title: { fontSize: 34, lineHeight: 40, letterSpacing: -0.9 },
  titleDim: { color: C.ink3, fontWeight: '500' },
  titleStrong: { color: C.ink, fontWeight: '700' },
  lead: { ...T.bodyLg, color: C.ink2, marginTop: 10, maxWidth: 340 },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  trustIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  trustText: { flex: 1, ...T.bodySm, color: C.ink3 },
  actionSection: { marginTop: 28, gap: 12 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 2, paddingVertical: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  checkboxOn: { borderColor: C.lime },
  termsText: { flex: 1, ...T.bodySm, color: C.ink2 },
  err: { paddingHorizontal: 2, ...T.bodySm, color: C.danger },
  tgPrimary: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    borderRadius: R.lg,
    paddingHorizontal: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    shadowColor: '#1E8FD1',
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 10,
  },
  tgShine: {
    position: 'absolute',
    width: 46,
    top: -30,
    bottom: -30,
    backgroundColor: 'rgba(255,255,255,0.17)',
  },
  tgLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tgCopy: { flex: 1, alignItems: 'flex-start' },
  tgPrimaryText: { ...T.bodyMd, fontWeight: '700', color: '#FFFFFF' },
  tgSub: { ...T.label, color: 'rgba(255,255,255,0.82)', marginTop: 2 },
  demoToggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  demoToggleText: { ...T.bodySm, color: C.ink3, textDecorationLine: 'underline' },
  demoBox: {
    borderRadius: R.lg,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
    padding: 16,
    gap: 10,
  },
  demoLabel: { ...T.label, color: C.brand, fontWeight: '700' },
  demoNote: { ...T.bodySm, color: C.ink3 },
  profileSection: { marginTop: 30 },
  handleRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: R.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  handleText: { flex: 1, minWidth: 0, ...T.bodySm, fontWeight: '600', color: C.ink2 },
  handleTag: { ...T.label, color: C.ink4 },
  submit: { marginTop: 22 },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
  },
  footerNoteText: { ...T.label, color: C.ink3 },
})

export default AuthScreen
