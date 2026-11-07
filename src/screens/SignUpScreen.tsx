import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
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
 * 1-qadam: Ro'yxatdan o'tish. Ism/email/parol/shart tekshiruvdan o'tmasa
 * hisob ochilmaydi. Telegram varianti ham shu qurilmada hisob yaratadi.
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
  const [tgOpen, setTgOpen] = useState(false)

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
    navigation.replace('Goal')
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
            <Text style={styles.sub}>Bir daqiqada ro&apos;yxatdan o&apos;ting — barcha mavzular ochiq.</Text>

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
                    hitSlop={13}
                    onPress={() => { triggerHaptic('light'); setShowPassword(v => !v) }}
                    accessibilityLabel={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                  >
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.ink4} />
                  </Pressable>
                }
              />

              <Pressable
                onPress={() => { triggerHaptic('light'); setTerms(v => !v) }}
                hitSlop={12}
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

              <SocialTile
                style={styles.telegramTile}
                onPress={() => {
                  if (!terms) {
                    triggerHaptic('warning')
                    setErr('Telegram bilan davom etish uchun shartlarga rozilik bering.')
                    return
                  }
                  setErr(null)
                  triggerHaptic('light')
                  setTgOpen(true)
                }}
              >
                <TelegramMark />
                <Text style={styles.socialText}>Telegram bilan kirish</Text>
                <View style={styles.socialTag}>
                  <Text style={styles.socialTagText}>Parolsiz</Text>
                </View>
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
  telegramTile: { backgroundColor: '#F2FAFE', borderColor: '#CFE8F7', justifyContent: 'flex-start', paddingHorizontal: 16 },
  socialTag: { marginLeft: 'auto', height: 24, paddingHorizontal: 9, borderRadius: R.full, backgroundColor: '#E1F3FC', alignItems: 'center', justifyContent: 'center' },
  socialTagText: { fontSize: 11, fontWeight: '800', color: '#1B87BE' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { ...T.bodyMd, color: C.ink3 },
  footerLink: { ...T.bodyMd, color: C.brand, fontWeight: '800', textDecorationLine: 'underline' },
})

export default SignUpScreen
