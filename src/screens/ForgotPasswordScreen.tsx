import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade } from '../components/Reveal'
import { Field, LimeButton, ScreenBg, TapText } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Parolni tiklash — email tekshiriladi va so'rov tasdiqlanadi.
 * Hisob shu qurilmada saqlanadi, shuning uchun havola emailga haqiqiy
 * yuborilmaydi — buni ekranda ochiq aytamiz.
 */
const ForgotPasswordScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Forgot'>) => {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!EMAIL_RE.test(email.trim())) {
      triggerHaptic('warning')
      setErr("Email manzili noto'g'ri ko'rinishda.")
      return
    }
    setErr(null)
    setSent(true)
    triggerHaptic('success')
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
              <Text style={{ color: C.ink4, fontWeight: '400' }}>{sent ? "So'rov " : 'Parolni '}</Text>
              <Text style={{ color: C.ink, fontWeight: '800' }}>{sent ? 'qabul qilindi' : 'tiklash'}</Text>
            </Text>

            {sent ? (
              <View style={styles.form}>
                <View style={styles.okCard}>
                  <View style={styles.okIcon}>
                    <Ionicons name="checkmark" size={22} color={C.inkOnLime} />
                  </View>
                  <Text style={styles.okText}>
                    So'rovingiz qabul qilindi. Parolni tiklash bo'yicha yo'riqnoma qo'llab-quvvatlash xizmati
                    orqali beriladi.
                  </Text>
                </View>

                <Text style={styles.note}>
                  Havola avtomatik yuborilmaydi. Hisobingiz shu qurilmada saqlanib qoladi.
                </Text>

                <LimeButton
                  label="Kirishga qaytish"
                  onPress={() => { triggerHaptic('light'); navigation.replace('Login') }}
                  style={styles.submit}
                />
              </View>
            ) : (
              <>
                <Text style={styles.sub}>
                  Emailingizni kiriting — parolni yangilash havolasini yuboramiz.
                </Text>

                <View style={styles.form}>
                  <Field
                    icon={<Ionicons name="mail-outline" size={17} color={C.ink4} />}
                    value={email}
                    onChangeText={v => { setEmail(v); if (err) setErr(null) }}
                    placeholder="Email kiriting"
                    keyboardType="email-address"
                  />

                  {!!err && <Text style={styles.err}>{err}</Text>}

                  <LimeButton label="Havola yuborish" onPress={send} style={styles.submit} />

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Esingizga tushdimi? </Text>
                    <TapText
                      onPress={() => { triggerHaptic('light'); navigation.replace('Login') }}
                      style={styles.footerLink}
                    >
                      Kirish
                    </TapText>
                  </View>
                </View>
              </>
            )}
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
  sub: { ...T.bodyMd, color: C.ink3, textAlign: 'center', marginTop: 8, marginHorizontal: 65 },
  form: { paddingHorizontal: 24, marginTop: 28 },
  err: { marginTop: 12, paddingHorizontal: 4, fontSize: 12.5, lineHeight: 18, fontWeight: '700', color: '#C2453D' },
  okCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
  },
  okIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7ED321',
  },
  okText: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '600', color: C.ink2 },
  note: { marginTop: 14, paddingHorizontal: 4, fontSize: 12, lineHeight: 17, fontWeight: '600', color: C.ink4 },
  submit: { marginTop: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { ...T.bodyMd, color: C.ink3 },
  footerLink: { ...T.bodyMd, color: C.brand, fontWeight: '800', textDecorationLine: 'underline' },
})

export default ForgotPasswordScreen
