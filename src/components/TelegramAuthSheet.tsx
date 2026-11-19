import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, Animated, AppState, Easing, Linking, Modal, Pressable, StyleSheet, Text, View,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { checkTelegramLogin, startTelegramLogin } from '../lib/telegramAuth'
import { ABS_FILL, R, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

/**
 * Haqiqiy Telegram kirish. Ism kiritilmaydi: ilova botni ochadi, Telegram
 * «Start»ni bosgach profil webhook orqali qaytadi va kirish avtomatik yakunlanadi.
 */

export const TelegramMark = ({ size = 22 }: { size?: number }) => {
  return (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path
      fill="#229ED9"
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.259-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.891-.662 3.483-1.517 5.806-2.518 6.967-3.003 3.32-1.381 4.011-1.621 4.46-1.628z"
    />
  </Svg>
  )
}

type Props = {
  visible: boolean
  onClose: () => void
  onDone: () => void
}

type Phase = 'starting' | 'waiting' | 'error'

const POLL_MS = 1500
const MAX_WAIT_MS = 10 * 60 * 1000

const STEPS = [
  { n: '1', title: 'Telegram ochiladi', sub: '@hdpappbot bilan suhbat' },
  { n: '2', title: '«Start» tugmasini bosing', sub: "Bir marta bosish yetarli" },
  { n: '3', title: 'Ilovaga qayting', sub: 'Kirish avtomatik yakunlanadi' },
]

const TelegramAuthSheet = ({ visible, onClose, onDone }: Props) => {
  const C = useColors()
  const styles = makeStyles(C)
  const insets = useSafeAreaInsets()
  const signInWithTelegram = useApp(s => s.signInWithTelegram)

  const [phase, setPhase] = useState<Phase>('starting')
  const [detail, setDetail] = useState<string | null>(null)
  const [nonce, setNonce] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const alive = useRef(true)
  /** «Tasdiqladim» tugmasi va ilovaga qaytish — darhol tekshiradi */
  const recheck = useRef<() => void>(() => {})

  const openBot = useCallback(async (link: string, startNonce?: string) => {
    /** Avval Telegram ilovasining o'z sxemasi — u modal animatsiyasi
     *  tugamasdan ham ishonchli ochiladi; bo'lmasa https havola. */
    const targets = startNonce
      ? [`tg://resolve?domain=hdpappbot&start=${startNonce}`, link]
      : [link]

    for (const target of targets) {
      try {
        await Linking.openURL(target)
        return
      } catch {
        /* keyingi variantni sinaymiz */
      }
    }

    if (!alive.current) return
    setPhase('error')
    setDetail("Telegram ochilmadi. Play Store'dan Telegram o'rnatib, qayta urinib ko'ring.")
  }, [])

  const begin = useCallback(async () => {
    alive.current = true
    setPhase('starting')
    setDetail(null)
    setNonce(null)
    try {
      const start = await startTelegramLogin()
      if (!alive.current) return
      setUrl(start.url)
      setNonce(start.nonce)
      setPhase('waiting')
      /** Modal oynasi paydo bo'lgach ochamiz — Android ba'zan darhol
       *  ochilgan tashqi intentni e'tiborsiz qoldiradi. */
      setTimeout(() => { void openBot(start.url, start.nonce) }, 450)
    } catch {
      if (!alive.current) return
      setPhase('error')
      setDetail("Serverga ulanib bo'lmadi. Internetni tekshirib qayta urinib ko'ring.")
    }
  }, [openBot])

  useEffect(() => {
    if (!visible) {
      alive.current = false
      return undefined
    }
    void begin()
    return () => { alive.current = false }
  }, [visible, begin])

  useEffect(() => {
    if (!visible || phase !== 'waiting' || !nonce) return undefined
    let stop = false
    let finished = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const started = Date.now()

    const tick = async () => {
      if (stop || finished) return
      try {
        const res = await checkTelegramLogin(nonce)
        if (stop || finished) return
        if (res.status === 'ready') {
          finished = true
          triggerHaptic('success')
          signInWithTelegram(res.user.name, res.user.username, res.user.id)
          onClose()
          onDone()
          return
        }
        if (res.status === 'expired' || res.status === 'invalid') {
          finished = true
          setPhase('error')
          setDetail("Tasdiqlash muddati tugadi. Qaytadan urinib ko'ring.")
          return
        }
      } catch {
        /* tarmoq uzildi — keyingi urinishda davom etadi */
      }
      if (stop || finished) return
      if (Date.now() - started > MAX_WAIT_MS) {
        finished = true
        setPhase('error')
        setDetail("Tasdiq kutilmadi. «Qaytadan urinish»ni bosing.")
        return
      }
      timer = setTimeout(tick, POLL_MS)
    }

    recheck.current = () => {
      if (stop || finished) return
      if (timer) clearTimeout(timer)
      void tick()
    }

    /** Telegram'dan ilovaga qaytganda kutmasdan darhol so'raymiz */
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') recheck.current()
    })

    timer = setTimeout(tick, 500)
    return () => {
      stop = true
      sub.remove()
      recheck.current = () => {}
      if (timer) clearTimeout(timer)
    }
  }, [visible, phase, nonce, onClose, onDone, signInWithTelegram])

  /** Kutish indikatori: nuqta atrofida kengayib so'nuvchi halqa */
  const ring = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible || phase !== 'waiting') {
      ring.setValue(0)
      return undefined
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [visible, phase, ring])

  const waiting = phase === 'waiting'
  const activeStep = phase === 'starting' ? 0 : waiting ? 1 : -1

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={ABS_FILL} onPress={onClose} accessibilityLabel="Yopish" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.grip} />

          <View style={styles.hero}>
            <LinearGradient
              colors={['#0A1B26', '#0F3040']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ABS_FILL}
            />
            <LinearGradient
              colors={['rgba(42,171,238,0.22)', 'rgba(42,171,238,0)']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0.3, y: 0.95 }}
              style={ABS_FILL}
              pointerEvents="none"
            />

            <View style={styles.heroHead}>
              <View style={styles.logo}>
                <TelegramMark size={24} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Telegram bilan kirish</Text>
                <Text style={styles.heroSub}>Parolsiz va xavfsiz — bir bosishda</Text>
              </View>
            </View>

            <View style={[styles.status, phase === 'error' && styles.statusBad]}>
              {phase === 'starting' ? (
                <>
                  <ActivityIndicator size="small" color="#7FD6FF" />
                  <Text style={styles.statusText}>Telegram ochilmoqda…</Text>
                </>
              ) : waiting ? (
                <>
                  <View style={styles.dotWrap}>
                    <Animated.View
                      style={[
                        styles.dotRing,
                        {
                          opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
                          transform: [
                            { scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) },
                          ],
                        },
                      ]}
                    />
                    <View style={styles.dot} />
                    <View style={styles.dotCore} />
                  </View>
                  <View style={styles.statusMid}>
                    <Text style={styles.statusText}>Tasdiqlash kutilmoqda</Text>
                    <Text style={styles.statusHint}>Telegram'da «Start» tugmasini bosing</Text>
                  </View>
                  <Pressable
                    onPress={() => { triggerHaptic('light'); recheck.current() }}
                    hitSlop={10}
                    style={({ pressed }) => [styles.recheck, pressed && { opacity: 0.65 }]}
                  >
                    <Text style={styles.recheckText}>Tekshirish</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={[styles.dot, styles.dotBad]} />
                  <View style={styles.statusMid}>
                    <Text style={[styles.statusText, styles.statusTitleBad]}>Kirish yakunlanmadi</Text>
                    <Text style={styles.statusHint}>{detail}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={step.n} style={styles.stepRow}>
                <View style={styles.stepCol}>
                  <View style={[styles.stepN, i === activeStep && styles.stepNActive]}>
                    <Text style={[styles.stepNText, i === activeStep && styles.stepNTextActive]}>
                      {step.n}
                    </Text>
                  </View>
                  {i < STEPS.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepMid}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.trust}>
            <Ionicons name="shield-checkmark-outline" size={14} color={C.ink4} />
            <Text style={styles.trustText}>
              Parol kerak emas — hisob Telegram tasdiqlashi bilan ochiladi.
            </Text>
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic('medium')
              if (phase === 'error' || !url) { void begin(); return }
              void openBot(url, nonce ?? undefined)
            }}
            style={({ pressed }) => [styles.primary, pressed && { transform: [{ scale: 0.985 }] }]}
          >
            <LinearGradient colors={['#3EB8F5', '#1E8FD1']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={ABS_FILL} />
            <TelegramMark size={19} />
            <Text style={styles.primaryText}>
              {phase === 'error' ? 'Qaytadan urinish' : 'Telegramni ochish'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => { triggerHaptic('light'); onClose() }}
            hitSlop={6}
            style={({ pressed }) => [styles.cancel, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.cancelText}>Bekor qilish</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(9,17,13,0.6)' },
  sheet: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: C.surface,
    borderTopLeftRadius: R['3xl'],
    borderTopRightRadius: R['3xl'],
    paddingHorizontal: 16,
    paddingTop: 9,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: -8 },
    elevation: 18,
  },
  grip: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.line,
    alignSelf: 'center',
    marginBottom: 12,
  },

  hero: { borderRadius: R.lg + 2, padding: 16, overflow: 'hidden', backgroundColor: '#0A1B26' },
  heroHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
  },
  heroText: { flex: 1, minWidth: 0 },
  heroTitle: { fontSize: 17, lineHeight: 22, letterSpacing: -0.2, fontWeight: '600', color: '#FFFFFF' },
  heroSub: { marginTop: 2, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: 'rgba(255,255,255,0.62)' },

  status: {
    marginTop: 14,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: R.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusBad: { backgroundColor: 'rgba(217,72,59,0.14)', borderColor: 'rgba(255,140,128,0.3)' },
  statusMid: { flex: 1, minWidth: 0 },
  statusText: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: '#FFFFFF' },
  statusTitleBad: { color: '#FFC9C2' },
  statusHint: { marginTop: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: 'rgba(255,255,255,0.62)' },

  dotWrap: { width: 11, height: 11, alignItems: 'center', justifyContent: 'center' },
  dotRing: { position: 'absolute', width: 11, height: 11, borderRadius: 6, backgroundColor: '#7FD6FF' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(127,214,255,0.28)' },
  dotCore: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: '#BDEBFF' },
  dotBad: { backgroundColor: '#FF8C80' },
  recheck: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: 'rgba(127,214,255,0.14)',
  },
  recheckText: { fontSize: 11.5, lineHeight: 15, fontWeight: '600', color: '#8FDCFF' },

  steps: { marginTop: 16, paddingHorizontal: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  stepCol: { width: 24, alignItems: 'center' },
  stepN: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7F1',
    borderWidth: 1,
    borderColor: '#E3E9DE',
  },
  stepNActive: { backgroundColor: '#E8F6FE', borderColor: '#BFE4F7' },
  stepNText: { fontSize: 11, fontWeight: '600', color: C.ink3 },
  stepNTextActive: { color: '#1683B5' },
  stepLine: {
    flex: 1,
    width: 2,
    minHeight: 12,
    marginVertical: 3,
    borderRadius: 1,
    backgroundColor: C.surface2,
  },
  stepMid: { flex: 1, minWidth: 0, paddingBottom: 14 },
  stepTitle: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: C.ink2 },
  stepSub: { marginTop: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: C.ink4 },

  trust: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 2, paddingHorizontal: 2 },
  trustText: { flex: 1, fontSize: 11.5, lineHeight: 17, fontWeight: '500', color: C.ink3 },

  primary: {
    marginTop: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: R.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#1E8FD1',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  primaryText: { fontSize: 14.5, fontWeight: '600', color: '#FFFFFF' },

  cancel: { height: 44, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 12.5, fontWeight: '600', color: C.ink3 },
})

export default TelegramAuthSheet
