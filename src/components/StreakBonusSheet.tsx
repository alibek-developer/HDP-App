import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import type { HostInstance } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { streakReward } from '../data/content'
import { triggerHaptic } from '../lib/haptics'
import { getCoinTarget } from '../lib/coinTarget'
import { CoinIcon } from './CoinIcon'
import { ABS_FILL, C, NUM, R, shadow } from '../theme/tokens'

/**
 * Kunlik zanjir bonusi — ochilishda pastdan chiqadigan oq varaq.
 * 7 kunlik to'r: qaysi kuni qancha tanga berilishini ko'rsatadi.
 * Mukofot: 1-kun 5, 2-kun 10, … 10-kundan keyin 50. «Olish»da sochilish animatsiyasi.
 */

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const

/** Sochiladigan tangalar: [dx, dy] — markazdan yoyilib uchadi */
const SPARKS = [
  [-40, -46],
  [-20, -62],
  [0, -68],
  [20, -62],
  [40, -46],
  [0, -32],
]

const GAP = 9

type Phase = 'idle' | 'collecting'

const StreakBonusSheet = () => {
  const insets = useSafeAreaInsets()
  const { width: winW } = useWindowDimensions()
  const gift = useApp(s => s.streakGift)
  const streak = useApp(s => s.streak)

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  const slide = useRef(new Animated.Value(0)).current
  const pop = useRef(new Animated.Value(0)).current
  const float = useRef(new Animated.Value(0)).current
  const fly = useRef(new Animated.Value(0)).current
  const coinBox = useRef<HostInstance>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  /** Uchayotgan tanga: oyna koordinatalaridagi boshlanish nuqtasi va hisoblagichgacha siljish */
  const [flight, setFlight] = useState<{ left: number; top: number; dx: number; dy: number } | null>(
    null,
  )

  /* Modal ochiq — tanga sekin suzadi */
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [float])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* Yangi taklif keldi — varaq pastdan chiqadi */
  useEffect(() => {
    if (gift <= 0) return
    setAmount(gift)
    setPhase('idle')
    setFlight(null)
    fly.setValue(0)
    pop.setValue(0)
    setOpen(true)
    slide.setValue(0)
    Animated.timing(slide, {
      toValue: 1,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [gift, pop, slide, fly])

  const hide = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setOpen(false))
  }

  /** Yopish — bonus olinmaydi, keyingi kirishda qayta taklif etiladi */
  const close = () => {
    if (phase !== 'idle') return
    useApp.getState().dismissStreakGift()
    hide()
  }

  const collect = () => {
    if (phase !== 'idle') return
    triggerHaptic('success')
    setPhase('collecting')

    /* Tanga hisoblagichga uchadi, yetib borganda tangalar hisoblanadi */
    const launch = (left: number, top: number, w: number, h: number) => {
      const t = getCoinTarget()
      const tx = t.x || winW - 43
      const ty = t.y || insets.top + 51
      setFlight({ left, top, dx: tx - (left + w / 2), dy: ty - (top + h / 2) })
      fly.setValue(0)
      Animated.timing(fly, {
        toValue: 1,
        duration: 620,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start()
    }
    if (coinBox.current) {
      coinBox.current.measureInWindow(launch)
    } else {
      launch(winW / 2 - 67, insets.top + 60, 134, 134)
    }

    Animated.timing(pop, {
      toValue: 1,
      duration: 950,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    timers.current.push(setTimeout(() => useApp.getState().claimStreakGift(), 600))
    timers.current.push(setTimeout(hide, 660))
  }

  if (!open) return null

  const backdrop = slide.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
  const lift = slide.interpolate({ inputRange: [0, 1], outputRange: [200, 0] })

  const prizeFade = pop.interpolate({
    inputRange: [0, 0.18, 0.72, 1],
    outputRange: [0, 1, 1, 0],
  })
  const prizeRise = pop.interpolate({ inputRange: [0, 1], outputRange: [0, -56] })

  /* Uchayotgan tanga: kichrayib hisoblagich ustiga qo'nadi va so'nadi */
  const flyX = fly.interpolate({ inputRange: [0, 1], outputRange: [0, flight?.dx ?? 0] })
  const flyY = fly.interpolate({ inputRange: [0, 1], outputRange: [0, flight?.dy ?? 0] })
  const flyScale = fly.interpolate({ inputRange: [0, 1], outputRange: [1, 0.18] })
  const flyFade = fly.interpolate({ inputRange: [0, 0.82, 1], outputRange: [1, 1, 0] })

  const today = Math.min(streak, DAYS.length)

  /* Kartalar to'ri: 4 ustun; o'ng chegara 430px varaq bilan cheklanadi */
  const contentW = Math.min(winW, 430) - 40
  const cardW = Math.floor((contentW - GAP * 3) / 4)
  const cardH = cardW - 8

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={s.root}>
        <Animated.View style={[ABS_FILL, s.backdrop, { opacity: backdrop }]} />
        <Pressable style={ABS_FILL} onPress={close} accessibilityLabel="Yopish" />

        <Animated.View style={[s.wrap, { transform: [{ translateY: lift }] }]}>
          <View style={[s.sheet, { paddingBottom: insets.bottom + 14 }]}>
            <View style={s.handle} />

            {/* ── 3D tanga ── */}
            <View style={s.hero}>
              {SPARKS.map(([dx, dy], i) => (
                <Animated.View
                  key={`${dx}:${dy}`}
                  pointerEvents="none"
                  style={[
                    s.spark,
                    {
                      opacity: pop.interpolate({
                        inputRange: [Math.min(i * 0.03, 0.9), Math.min(i * 0.03 + 0.14, 1), 0.9, 1],
                        outputRange: [0, 1, 1, 0],
                      }),
                      transform: [
                        { translateX: pop.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
                        { translateY: pop.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
                        {
                          scale: pop.interpolate({
                            inputRange: [0, 0.25, 1],
                            outputRange: [0.4, 1, 0.8],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <CoinIcon size={15} />
                </Animated.View>
              ))}

              <Animated.View
                ref={coinBox}
                style={{
                  opacity: phase === 'collecting' ? 0 : 1,
                  transform: [
                    {
                      translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
                    },
                  ],
                }}
              >
                <Image source={require('../assets/coin3d.png')} style={s.coin3d} resizeMode="contain" />
              </Animated.View>

              <Animated.View
                pointerEvents="none"
                style={[s.prize, { opacity: prizeFade, transform: [{ translateY: prizeRise }] }]}
              >
                <Text style={[s.prizeText, NUM]}>+{amount}</Text>
              </Animated.View>
            </View>

            <Text style={s.title}>Kunlik mukofot</Text>
            <Text style={s.sub}>
              Zanjiringizni saqlab qolish uchun har kuni qaytib keling — mukofot kun sayin oshadi.
            </Text>

            {/* ── 7 kunlik to'r ── */}
            <View style={s.grid}>
              {[DAYS.slice(0, 4), DAYS.slice(4)].map((row, r) => (
                <View key={r} style={s.gridRow}>
                  {row.map(day => {
                    const now = day === today
                    return (
                      <View key={day} style={{ width: cardW }}>
                        <View style={[s.dayCard, { height: cardH }]}>
                          <CoinIcon size={Math.max(20, Math.round(cardW * 0.28))} />
                          <Text style={[s.dayNum, NUM, !now && s.dayNumNext]}>{streakReward(day)}</Text>
                        </View>
                        <Text style={[s.dayLabel, now && s.dayLabelNow]}>
                          {now ? 'Bugun' : `${day}-kun`}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>

            {/* ── Olish ── */}
            <Pressable
              onPress={collect}
              disabled={phase !== 'idle'}
              accessibilityLabel={`${amount} tangani olish`}
              style={({ pressed }) => [
                s.cta,
                s.ctaShadow,
                (pressed || phase !== 'idle') && { opacity: 0.92 },
              ]}
            >
              <Text style={s.ctaText}>Mukofotni olish</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Hisoblagichga uchayotgan tanga */}
        {flight ? (
          <Animated.View
            pointerEvents="none"
            style={[
              s.flyCoin,
              {
                left: flight.left,
                top: flight.top,
                opacity: flyFade,
                transform: [{ translateX: flyX }, { translateY: flyY }, { scale: flyScale }],
              },
            ]}
          >
            <Image source={require('../assets/coin3d.png')} style={s.coin3d} resizeMode="contain" />
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: 'rgba(14,26,18,0.45)' },
  wrap: { width: '100%', maxWidth: 430, alignSelf: 'center' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: R['3xl'],
    borderTopRightRadius: R['3xl'],
    paddingHorizontal: 20,
    paddingTop: 9,
    ...shadow('#0E1A12', 28, -8, 0.16),
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E6EAE2',
    alignSelf: 'center',
    marginBottom: 2,
  },

  /* ── 3D tanga ── */
  hero: { height: 132, alignItems: 'center', justifyContent: 'center' },
  coin3d: { width: 134, height: 134 },
  flyCoin: { position: 'absolute', width: 134, height: 134 },
  spark: { position: 'absolute', left: '50%', top: '50%', marginLeft: -7, marginTop: -7 },
  prize: { position: 'absolute', top: 10 },
  prizeText: { fontSize: 15, fontWeight: '800', color: '#C9862A' },

  /* ── Sarlavha ── */
  title: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: -0.6,
    fontWeight: '800',
    color: C.ink,
  },
  sub: {
    marginTop: 6,
    alignSelf: 'center',
    maxWidth: 300,
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
    color: C.ink3,
  },

  /* ── 7 kunlik to'r ── */
  grid: { marginTop: 12, gap: 10 },
  gridRow: { flexDirection: 'row', gap: GAP },
  dayCard: {
    borderRadius: 17,
    backgroundColor: C.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dayNum: { fontSize: 17, letterSpacing: -0.4, fontWeight: '800', color: C.ink },
  dayNumNext: { color: '#A6B0A3' },
  dayLabel: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: C.ink4,
  },
  dayLabelNow: { color: C.ink, fontWeight: '700' },

  /* ── CTA ── */
  cta: {
    marginTop: 16,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.brand,
  },
  ctaShadow: shadow('#0B6E4F', 16, 7, 0.24),
  ctaText: { fontSize: 15.5, letterSpacing: 0.1, fontWeight: '800', color: '#FFFFFF' },
})

export default StreakBonusSheet
