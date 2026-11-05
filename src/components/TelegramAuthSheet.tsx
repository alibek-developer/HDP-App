import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, AppState, Linking, Modal, Pressable, StyleSheet, Text, View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { checkTelegramLogin, startTelegramLogin } from '../lib/telegramAuth'
import { ABS_FILL, C, R, T } from '../theme/tokens'

/**
 * Haqiqiy Telegram kirish. Ism kiritilmaydi: ilova botni ochadi, Telegram
 * «Start»ni bosgach profil webhook orqali qaytadi va kirish avtomatik yakunlanadi.
 */

export const TelegramMark = ({ size = 22 }: { size?: number }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path
      fill="#229ED9"
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.259-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.891-.662 3.483-1.517 5.806-2.518 6.967-3.003 3.32-1.381 4.011-1.621 4.46-1.628z"
    />
  </Svg>
)

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

  const waiting = phase === 'waiting'

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={ABS_FILL} onPress={onClose} accessibilityLabel="Yopish" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grip} />

          <View style={styles.head}>
            <View style={styles.logoTile}>
              <TelegramMark size={26} />
            </View>
            <View style={styles.headText}>
              <Text style={styles.kicker}>TELEGRAM</Text>
              <Text style={styles.title}>Telegram bilan kirish</Text>
            </View>
            <Pressable
              onPress={() => { triggerHaptic('light'); onClose() }}
              accessibilityLabel="Yopish"
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={[styles.statusCard, phase === 'error' && styles.statusCardBad]}>
            {phase === 'starting' ? (
              <>
                <ActivityIndicator size="small" color={C.brand} />
                <Text style={styles.statusTitle}>Telegram ochilmoqda...</Text>
              </>
            ) : waiting ? (
              <>
                <ActivityIndicator size="small" color="#229ED9" />
                <View style={styles.statusMid}>
                  <Text style={styles.statusTitle}>Tasdiqlash kutilmoqda</Text>
                  <Text style={styles.statusSub}>Telegram'da «Start» tugmasini bosing</Text>
                  <Pressable
                    onPress={() => { triggerHaptic('light'); recheck.current() }}
                    hitSlop={8}
                    style={({ pressed }) => [styles.checkNow, pressed && { opacity: 0.6 }]}
                  >
                    <Text style={styles.checkNowText}>Tasdiqladim — tekshirish</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.statusMid}>
                <Text style={[styles.statusTitle, { color: '#B5403A' }]}>Kirish yakunlanmadi</Text>
                <Text style={styles.statusSub}>{detail}</Text>
              </View>
            )}
          </View>

          <View style={styles.steps}>
            {STEPS.map(step => (
              <View key={step.n} style={styles.stepRow}>
                <View style={styles.stepN}>
                  <Text style={styles.stepNText}>{step.n}</Text>
                </View>
                <View style={styles.stepMid}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.note}>
            Parol kerak emas — hisob Telegram tasdiqlashi bilan ochiladi.
          </Text>

          <View style={styles.btns}>
            <Pressable
              onPress={() => { triggerHaptic('light'); onClose() }}
              style={({ pressed }) => [styles.cancel, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.cancelText}>Bekor</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('medium')
                if (phase === 'error' || !url) { void begin(); return }
                void openBot(url, nonce ?? undefined)
              }}
              style={({ pressed }) => [styles.ok, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient colors={['#2AABEE', '#229ED9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
              <TelegramMark size={18} />
              <Text style={styles.okText}>
                {phase === 'error' ? 'Qaytadan urinish' : 'Telegramni ochish'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(14,26,18,0.55)' },
  sheet: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grip: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E1E7DA', alignSelf: 'center', marginBottom: 16 },

  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoTile: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF6FD',
    borderWidth: 1,
    borderColor: '#CBE8F8',
  },
  headText: { flex: 1, minWidth: 0 },
  kicker: { ...T.tiny, color: C.ink4, letterSpacing: 1.2 },
  title: { marginTop: 3, fontSize: 18, lineHeight: 23, fontWeight: '800', color: C.ink },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F1',
  },
  closeText: { fontSize: 15, fontWeight: '800', color: C.ink3 },

  statusCard: {
    marginTop: 16,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: R.md,
    backgroundColor: '#EDF8FD',
    borderWidth: 1,
    borderColor: '#CFEAF7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusCardBad: { backgroundColor: '#FBEEEC', borderColor: '#F2D3CE' },
  statusMid: { flex: 1, minWidth: 0 },
  statusTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink },
  statusSub: { marginTop: 2, fontSize: 12, lineHeight: 17, fontWeight: '600', color: C.ink3 },
  checkNow: { marginTop: 6, alignSelf: 'flex-start' },
  checkNowText: { fontSize: 12, lineHeight: 16, fontWeight: '800', color: '#1B87BE' },

  steps: { marginTop: 16, gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepN: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
    borderWidth: 1,
    borderColor: '#DDEBD6',
  },
  stepNText: { fontSize: 11.5, fontWeight: '800', color: C.brand },
  stepMid: { flex: 1, minWidth: 0 },
  stepTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink2 },
  stepSub: { marginTop: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: C.ink4 },

  note: { marginTop: 16, fontSize: 12, lineHeight: 18, fontWeight: '500', color: C.ink3 },

  btns: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancel: { width: 92, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: R.full, backgroundColor: '#F1F4F0' },
  cancelText: { fontSize: 13, fontWeight: '800', color: C.ink3 },
  ok: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: R.full,
    overflow: 'hidden',
  },
  okText: { fontSize: 13.5, fontWeight: '800', color: '#FFFFFF' },
})

export default TelegramAuthSheet
