import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, ComponentRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import type { HostInstance } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { TOPICS } from '../data/curriculum'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { CoinIcon } from '../components/CoinIcon'
import { DAILY_BONUS, WEEK_LABELS, currentWeekKeys, leagueRank } from '../data/content'
import { difficultyLabel, sourceLabel, todayKey } from '../lib/daily'
import { SUBJECTS } from '../data/subjects'
import { BALANCE_LEVELS } from '../data/games'
import { PROBLEM_SUBJECTS, levelsOf } from '../data/problems'
import { useDailyQuestion } from '../lib/useDailyQuestion'
import { setCoinTarget } from '../lib/coinTarget'
import { triggerHaptic } from '../lib/haptics'
import { BrandMark } from '../components/Brand'
import { Reveal } from '../components/Reveal'
import { TopScrim } from '../components/ui'
import { MidnightClock } from '../components/MidnightClock'
import { navBottomSpace } from '../components/BottomNav'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { C, NUM, R, MATH_FONT, ABS_FILL } from '../theme/tokens'

/**
 * Home — «hozir nima qilaman?» ekrani.
 *
 * Toza oq fon: elementlar fon ustida suzmaydi. Sarlavhada profil, tanga,
 * zanjir va Pro; birinchi blok — reklama banneri, ostida ixcham «davom
 * etish» qatori. Barcha raqamlar store'dan.
 */

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const LESSONS = TOPICS.flatMap(t => t.lessons)
const COURSE = SUBJECTS[0]

/** Reklama karuseli — uch slayd, har biri real manzilga olib boradi. */
const AD_SLIDES = [
  {
    id: 'course',
    photo: require('../assets/study-center.webp'),
    title: 'Matematikani\nizchil o‘rganing',
    label: 'Algebra I kursi',
  },
  {
    id: 'blitz',
    photo: require('../assets/banner-blitz.webp'),
    title: 'Blitz — tezlikni\nsinab ko‘ring',
    label: 'Blitz mashqi',
  },
  {
    id: 'daily',
    photo: require('../assets/banner-daily.webp'),
    title: 'Har kuni\nbitta masala',
    label: 'Bugungi masala',
  },
] as const

const num = (n: number) => n.toLocaleString('en-US')
const todayIdx = () => (new Date().getDay() + 6) % 7

/** Zanjir bonusi: tangalar qanchalik yon tomonga sochiladi (px) */
const BURST_DRIFT = [-18, -9, 0, 9, 18]

/** Sekin "nafas" — 0→1→0; yangi masala belgisi shu ritmda jonlanadi. */
const useBreath = (period: number) => {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: period,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: period,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [v, period])
  return v
}

const SectionHead = ({ label, meta }: { label: string; meta?: string }) => (
  <View style={styles.secHead}>
    <Text style={styles.secLabel}>{label}</Text>
    {meta ? <Text style={styles.secMeta}>{meta}</Text> : null}
  </View>
)

/** Pro belgisi — iliq gradient va ustidan o'tuvchi yorug'lik. */
const PRO_GRAD = ['#FFC24B', '#FF8A1E'] as const

const ProPill = ({ onPress }: { onPress: () => void }) => {
  const sweep = useRef(new Animated.Value(0)).current
  const live = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const shine = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sweep, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    )
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(live, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(live, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )
    shine.start()
    breathe.start()
    return () => {
      shine.stop()
      breathe.stop()
    }
  }, [sweep, live])

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="HDP Pro"
      hitSlop={10}
      style={({ pressed }) => [styles.proWrap, pressed && { opacity: 0.88 }]}
    >
      <Animated.View
        style={[
          styles.proGlow,
          { opacity: live.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.26] }) },
        ]}
      />
      <View style={styles.proPill}>
        <LinearGradient colors={PRO_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
        <View pointerEvents="none" style={styles.proGloss}>
          <LinearGradient
            colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.proShine,
            {
              transform: [
                { translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-40, 96] }) },
                { rotate: '20deg' },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.62)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <MCI name="crown" size={13} color="#FFF9EE" />
        <Text style={styles.proText}>PRO</Text>
      </View>
    </Pressable>
  )
}

const HomeScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const pulse = useBreath(1500)

  /* ── Reklama karuseli ── */
  const { width: winW } = useWindowDimensions()
  const adW = winW - 32
  const adRef = useRef<ComponentRef<typeof ScrollView>>(null)
  const adIdxRef = useRef(0)
  const [adIdx, setAdIdx] = useState(0)
  const focused = useIsFocused()

  /* Karusel faqat ekran ko'rinib turganda aylanadi — dars ichida uxlab turadi */
  useEffect(() => {
    if (!focused) return undefined
    const t = setInterval(() => {
      const next = (adIdxRef.current + 1) % AD_SLIDES.length
      adRef.current?.scrollTo({ x: next * adW, animated: true })
      adIdxRef.current = next
      setAdIdx(next)
    }, 4500)
    return () => clearInterval(t)
  }, [adW, focused])

  const name = useApp(s => s.name)
  const photoUrl = useApp(s => s.photoUrl)
  const coin = useApp(s => s.coin)
  const xp = useApp(s => s.xp)
  const streak = useApp(s => s.streak)
  const streakBonusClaimed = useApp(s => s.streakBonusClaimed)
  const claimStreakBonus = useApp(s => s.claimStreakBonus)
  const streakBurst = useApp(s => s.streakBurst)
  const clearStreakBurst = useApp(s => s.clearStreakBurst)
  const enterApp = useApp(s => s.enterApp)
  const topicLessons = useApp(s => s.topicLessons)
  const studyMinutes = useApp(s => s.studyMinutes)
  const gameStars = useApp(s => s.gameStars)
  const blitzBest = useApp(s => s.blitzBest)
  const dailyBonusOn = useApp(s => s.dailyBonusOn)
  const { question: daily, status: dailyStatus, plan: dailyPlan } = useDailyQuestion()

  /** Kunlik masala faqat kamida bitta mavzu ochilgandan keyin chiqadi */
  const hasStudied = dailyPlan.studied.length > 0
  const dailyDone = daily ? daily.picked !== null : false
  /** Yechilgani — javob to'g'ri bo'lsa; xato ham qulflangan, lekin «yechildi» emas */
  const dailyOk = daily ? daily.picked === daily.correct : false
  const dailyClaimed = dailyBonusOn === todayKey()

  /* ── Zanjir bonusi ── */
  const burst = useRef(new Animated.Value(0)).current
  const [burstOn, setBurstOn] = useState(false)
  const [burstAmount, setBurstAmount] = useState(0)

  /** Tanga hisoblagich markazi — modal shu nuqtaga tangani uchirib boradi */
  const coinRef = useRef<HostInstance>(null)
  const measureCoin = () => {
    coinRef.current?.measureInWindow((x, y, w, h) => setCoinTarget(x + w / 2, y + h / 2))
  }

  /** Onboarding'dan keyin ochilganda ham zanjir darhol qayd bo'ladi */
  useEffect(() => {
    enterApp()
  }, [enterApp])

  /** Modalda olingan bonus tanga hisoblagichidan sochilish bilan ko'rsatiladi */
  useEffect(() => {
    if (streakBurst <= 0) return
    setBurstAmount(streakBurst)
    burst.setValue(0)
    setBurstOn(true)
    clearStreakBurst()
    Animated.timing(burst, {
      toValue: 1,
      duration: 1100,
      delay: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setBurstOn(false)
    })
  }, [streakBurst, burst, clearStreakBurst])

  /* ── Kurs ── */
  const doneLessons = LESSONS.filter(l => topicLessons[l.id]?.done).length
  const pct = Math.round((doneLessons / LESSONS.length) * 100)

  /* ── Hafta ── */
  const weekKeys = currentWeekKeys()
  const weekMins = weekKeys.map(k => studyMinutes[k] ?? 0)
  const weekTotal = weekMins.reduce((a, b) => a + b, 0)
  const weekDays = weekMins.filter(m => m > 0).length

  /* ── Amaliyot ── */
  const balStars = BALANCE_LEVELS.reduce((n, lvl) => n + (gameStars[`balance:${lvl.id}`] ?? 0), 0)
  const balTotal = BALANCE_LEVELS.length * 3
  const levelCount = PROBLEM_SUBJECTS.reduce((n, sub) => n + levelsOf(sub.id).length, 0)

  const minis: {
    id: string
    icon: ComponentProps<typeof MCI>['name']
    title: string
    sub: string
    tint: string
    ink: string
    open: () => void
  }[] = [
    {
      id: 'blitz',
      icon: 'lightning-bolt',
      title: 'Blitz',
      sub: blitzBest > 0 ? `rekord ${blitzBest}` : '30 soniya',
      tint: C.coinSoft,
      ink: C.coin,
      open: () => navigation.navigate('Blitz'),
    },
    {
      id: 'balance',
      icon: 'scale-balance',
      title: 'Muvozanat',
      sub: `${balStars}/${balTotal} yulduz`,
      tint: C.violetSoft,
      ink: C.violet,
      open: () => navigation.navigate('Balance'),
    },
    {
      id: 'formulas',
      icon: 'book-open-page-variant',
      title: 'Formulalar',
      sub: 'qo’llanma',
      tint: C.xpSoft,
      ink: C.xp,
      open: () => navigation.navigate('Formulas'),
    },
  ]

  const nameParts = name.trim().split(/\s+/)
  const firstName = nameParts[0]
  const restName = nameParts.slice(1).join(' ')
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const tap = (fn: () => void) => () => {
    triggerHaptic('light')
    fn()
  }
  const openCourse = tap(() => navigation.navigate('Subject', { subjectId: COURSE.id }))
  const openDaily = tap(() => navigation.navigate('Daily'))
  const openAd = (id: (typeof AD_SLIDES)[number]['id']) =>
    tap(() => {
      if (id === 'blitz') navigation.navigate('Blitz')
      else if (id === 'daily') navigation.navigate('Daily')
      else navigation.navigate('Subject', { subjectId: COURSE.id })
    })

  const dailyLine = daily
    ? `${sourceLabel(daily.source)} · ${difficultyLabel(daily.difficulty)}`
    : dailyStatus === 'error'
      ? 'Savol yuklanmadi'
      : 'O’rgangan mavzularingizdan tuzilyapti…'

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 22, paddingBottom: navBottomSpace(insets.bottom) },
        ]}
      >
        {/* ── Sarlavha: profil + hisob + Pro ── */}
        <Reveal y={8} duration={300}>
          <View style={styles.head}>
            <Pressable
              onPress={tap(() => navigation.navigate('Profile'))}
              accessibilityLabel="Profil"
              style={({ pressed }) => [styles.who, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.avatarRing}>
                <LinearGradient
                  colors={['#B7EE7E', '#0B6E4F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarRingFill}
                />
                <View style={styles.avatar}>
                  {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.avatarImg} />
                  ) : (
                    <LinearGradient
                      colors={['#F2FAE9', '#CFEBB2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarMonogram}
                    >
                      {initials
                        ? <Text style={styles.avatarText}>{initials}</Text>
                        : <MCI name="account" size={22} color={C.brand} />}
                    </LinearGradient>
                  )}
                </View>
              </View>
              <View style={styles.whoText}>
                <Text style={styles.helloName} numberOfLines={1}>
                  {firstName || "o'quvchi"}
                  {restName ? <Text style={styles.helloLast}> {restName}</Text> : null}
                </Text>
              </View>
            </Pressable>

            <View style={styles.headRight}>
              <View
                ref={coinRef}
                style={styles.coinWrap}
                onLayout={measureCoin}
              >
                <Pressable
                  onPress={tap(() => navigation.navigate('Shop'))}
                  accessibilityLabel="Tangalar, do'kon"
                  hitSlop={10}
                  style={({ pressed }) => [styles.statPill, pressed && { opacity: 0.7 }]}
                >
                  <CoinIcon size={22} />
                  <Text style={[styles.statText, NUM]}>{num(coin)}</Text>
                </Pressable>

                {burstOn ? (
                  <View pointerEvents="none" style={styles.burst}>
                    {BURST_DRIFT.map((dx, i) => {
                      const start = i * 0.06
                      const t = burst.interpolate({
                        inputRange: [start, Math.min(start + 0.55, 1)],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      })
                      return (
                        <Animated.View
                          key={dx}
                          style={[
                            styles.burstCoin,
                            {
                              opacity: t.interpolate({
                                inputRange: [0, 0.15, 0.7, 1],
                                outputRange: [0, 1, 1, 0],
                              }),
                              transform: [
                                { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
                                {
                                  translateY: t.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -22 - Math.abs(dx)],
                                  }),
                                },
                                {
                                  scale: t.interpolate({
                                    inputRange: [0, 0.2, 1],
                                    outputRange: [0.5, 1, 0.85],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          <CoinIcon size={13} />
                        </Animated.View>
                      )
                    })}
                    <Animated.View
                      style={[
                        styles.burstPrize,
                        {
                          opacity: burst.interpolate({
                            inputRange: [0, 0.2, 0.75, 1],
                            outputRange: [0, 1, 1, 0],
                          }),
                          transform: [
                            {
                              translateY: burst.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -30],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Text style={[styles.burstPrizeText, NUM]}>+{burstAmount}</Text>
                    </Animated.View>
                  </View>
                ) : null}
              </View>

              <Pressable
                onPress={() => {
                  if (streakBonusClaimed !== todayKey()) {
                    triggerHaptic('medium')
                    claimStreakBonus()
                  }
                }}
                style={({ pressed }) => [
                  styles.statPill,
                  streakBonusClaimed === todayKey() && styles.statPillClaimed,
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityLabel={`${streak} kunlik zanjir`}
              >
                <MCI name="fire" size={14} color={streakBonusClaimed === todayKey() ? '#9AA995' : '#E2652B'} />
                <Text style={[styles.statText, NUM]}>{streak}</Text>
              </Pressable>

              <ProPill onPress={tap(() => navigation.navigate('Pro'))} />
            </View>
          </View>
        </Reveal>

        {/* ── Reklama karuseli ── */}
        <Reveal delay={40} y={12} duration={360}>
          <View style={styles.adWrap}>
            <ScrollView
              ref={adRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={32}
              onScroll={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / adW)
                if (idx !== adIdxRef.current && idx >= 0 && idx < AD_SLIDES.length) {
                  adIdxRef.current = idx
                  setAdIdx(idx)
                }
              }}
            >
              {AD_SLIDES.map(s => (
                <Pressable
                  key={s.id}
                  onPress={openAd(s.id)}
                  accessibilityLabel={s.label}
                  style={({ pressed }) => [
                    styles.ad,
                    { width: adW },
                    pressed && { opacity: 0.96 },
                  ]}
                >
                  <Image source={s.photo} style={styles.adPhoto} resizeMode="cover" />
                  <LinearGradient
                    pointerEvents="none"
                    colors={['#07281B', '#07281B', 'rgba(7,40,27,0.92)', 'rgba(7,40,27,0.04)']}
                    locations={[0, 0.45, 0.7, 0.92]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                  />

                  <View style={styles.adInner}>
                    <View style={styles.adBrand}>
                      <BrandMark size={15} />
                      <Text style={styles.adBrandText}>HDP o‘quv markazi</Text>
                    </View>

                    <Text style={styles.adTitle}>{s.title}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <View pointerEvents="none" style={styles.adDots}>
              {AD_SLIDES.map((s, i) => (
                <View key={s.id} style={[styles.adDot, i === adIdx && styles.adDotOn]} />
              ))}
            </View>
          </View>
        </Reveal>

        {/* ── Bugungi masala — faqat mavzu ochilgandan keyin ── */}
        {hasStudied ? (
          <Reveal delay={100} y={12} duration={360}>
            {dailyDone ? (
            <Pressable
              onPress={openDaily}
              accessibilityLabel={dailyOk ? 'Bugungi masala yechildi' : 'Bugungi masala xato yakunlandi'}
              style={({ pressed }) => [styles.dailyDone, pressed && { opacity: 0.9 }]}
            >
              <View style={[styles.doneIcon, !dailyOk && styles.doneIconWrong]}>
                <MCI
                  name={dailyOk ? 'check-decagram' : 'close-circle'}
                  size={18}
                  color={dailyOk ? C.brand : '#B87A22'}
                />
              </View>
              <View style={styles.doneText}>
                <Text style={[styles.doneTitle, !dailyOk && styles.doneTitleWrong]}>
                  {dailyOk ? 'Bugungi masala yechildi' : 'Bu safar xato'}
                </Text>
                <Text style={[styles.doneSub, NUM]}>
                  {dailyOk && dailyClaimed
                    ? `+${DAILY_BONUS.coin} tanga · +${DAILY_BONUS.xp} XP`
                    : 'Javob berildi · ertaga yangi masala'}
                </Text>
              </View>
              <MidnightClock style={[styles.doneClock, NUM]} />
              <MCI name="chevron-right" size={16} color={C.ink4} />
            </Pressable>
          ) : (
            <Pressable
              onPress={openDaily}
              accessibilityLabel="Bugungi masalani yechish"
              style={({ pressed }) => [styles.dailyCard, pressed && { opacity: 0.94 }]}
            >
              <View style={styles.dailyTop}>
                <View style={styles.dailyIcon}>
                  <MCI name="calendar-star" size={16} color={C.brand} />
                </View>
                <Text style={styles.dailyTitle}>Bugungi masala</Text>
                <View style={styles.deadline}>
                  <MCI name="timer-outline" size={11} color={C.ink3} />
                  <MidnightClock style={[styles.deadlineClock, NUM]} />
                </View>
              </View>

              <View style={styles.dailyMeta}>
                <Animated.View
                  style={[
                    styles.liveDot,
                    {
                      opacity: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.25],
                      }),
                    },
                  ]}
                />
                <Text style={styles.dailyNudge}>Bugun hali javob bermadingiz</Text>
                <Text style={styles.dailySrc} numberOfLines={1}>{dailyLine}</Text>
              </View>

              <View style={styles.promptTicket}>
                <Text style={styles.promptText} numberOfLines={3}>
                  {daily
                    ? daily.prompt
                    : dailyStatus === 'error'
                      ? "Savolni yuklab bo'lmadi — qayta urinib ko'ring"
                      : 'O’rgangan mavzularingizdan savol tuzilyapti…'}
                </Text>
              </View>

              <View style={styles.dailyFoot}>
                <View style={styles.rewards}>
                  <View style={styles.rewardChip}>
                    <CoinIcon size={14} />
                    <Text style={[styles.rewardText, NUM]}>+{DAILY_BONUS.coin}</Text>
                  </View>
                  <View style={[styles.rewardChip, styles.rewardChipXp]}>
                    <MCI name="flash" size={12} color={C.xp} />
                    <Text style={[styles.rewardText, styles.rewardTextXp, NUM]}>
                      +{DAILY_BONUS.xp} XP
                    </Text>
                  </View>
                </View>
                <View style={styles.dailyCta}>
                  <Text style={styles.dailyCtaText}>Yechish</Text>
                  <MCI name="arrow-right" size={13} color={C.inkOnLime} />
                </View>
              </View>
            </Pressable>
            )}
          </Reveal>
        ) : null}

        {/* ── Kurslar ── */}
        <Reveal delay={130} y={12} duration={360}>
          <SectionHead label="KURSLAR" meta={`${SUBJECTS.length} fan`} />

          <Pressable
            onPress={openCourse}
            accessibilityLabel={`${COURSE.name} — mavzular`}
            style={({ pressed }) => [styles.courseShadow, pressed && { opacity: 0.94 }]}
          >
            <View style={styles.courseCard}>
              <Image source={COURSE.photo} style={styles.courseCover} resizeMode="cover" />
              <LinearGradient
                pointerEvents="none"
                colors={['rgba(11,44,30,0.15)', 'rgba(11,44,30,0.55)', 'rgba(11,44,30,0.88)']}
                locations={[0, 0.55, 1]}
                style={styles.courseVeil}
              />
              <View style={styles.courseTop}>
                <View style={styles.courseChip}>
                  <View style={styles.courseChipDot} />
                  <Text style={styles.courseChipText}>
                    {doneLessons === 0 ? 'BOSHLASH' : 'DAVOM ETMOQDA'}
                  </Text>
                </View>
                <View style={styles.courseGo}>
                  <MCI name="arrow-right" size={16} color={C.brandDeep} />
                </View>
              </View>

              <View style={styles.courseBody}>
                <Text style={styles.courseName}>{COURSE.name}</Text>
                <Text style={[styles.courseMeta, NUM]}>
                  {TOPICS.length} mavzu · {doneLessons}/{LESSONS.length} dars
                </Text>
                <View style={styles.courseBar}>
                  <View style={[styles.courseFill, { width: `${Math.max(1, pct)}%` }]} />
                </View>
              </View>
            </View>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.soonScroll}
          >
            {SUBJECTS.slice(1).map(s => (
              <Pressable
                key={s.id}
                onPress={tap(() => navigation.navigate('Subject', { subjectId: s.id }))}
                accessibilityLabel={`${s.name} — mavzular`}
                style={({ pressed }) => [styles.soonTile, pressed && { opacity: 0.88 }]}
              >
                <Image source={s.photo} style={styles.soonCover} resizeMode="cover" />
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(244,246,240,0.25)', 'rgba(244,246,240,0.94)']}
                  style={styles.soonVeil}
                />
                <View style={styles.soonGo}>
                  <MCI name="arrow-top-right" size={12} color={C.brandDeep} />
                </View>
                <Text style={styles.soonName} numberOfLines={1}>{s.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Reveal>

        {/* ── Mashq ── */}
        <Reveal delay={160} y={12} duration={360}>
          <SectionHead label="MASHQ" meta="Qisqa mashqlar" />

          <Pressable
            onPress={tap(() => navigation.navigate('Problems'))}
            accessibilityLabel="Masalalar"
            style={({ pressed }) => [styles.wide, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.wideIcon}>
              <MCI name="calculator-variant" size={20} color={C.brand} />
            </View>
            <View style={styles.wideBody}>
              <Text style={styles.wideTitle}>Masalalar</Text>
              <Text style={[styles.wideSub, NUM]}>
                {PROBLEM_SUBJECTS.length} fan · {levelCount} daraja
              </Text>
            </View>
            <View style={styles.wideGo}>
              <MCI name="chevron-right" size={15} color={C.brand} />
            </View>
          </Pressable>

          <View style={styles.miniRow}>
            {minis.map(m => (
              <Pressable
                key={m.id}
                onPress={() => {
                  triggerHaptic('medium')
                  m.open()
                }}
                accessibilityLabel={m.title}
                style={({ pressed }) => [
                  styles.mini,
                  { backgroundColor: m.tint },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.miniIcon}>
                  <MCI name={m.icon} size={17} color={m.ink} />
                </View>
                <Text style={styles.miniTitle} numberOfLines={1}>{m.title}</Text>
                <Text style={[styles.miniSub, NUM]} numberOfLines={1}>{m.sub}</Text>
              </Pressable>
            ))}
          </View>
        </Reveal>

        {/* ── Bu hafta ── */}
        <Reveal delay={190} y={12} duration={360}>
          <View style={styles.card}>
            <View style={styles.weekHead}>
              <Text style={styles.weekTitle}>BU HAFTA</Text>
              <Text style={[styles.weekMeta, NUM]}>
                {weekTotal > 0 ? `${weekTotal} daqiqa · ${weekDays} kun` : `liga #${leagueRank(xp)}`}
              </Text>
            </View>

            {weekTotal > 0 ? (
              <View style={styles.pebbles}>
                {WEEK_LABELS.map((label, i) => {
                  const on = weekMins[i] > 0
                  const today = i === todayIdx()
                  return (
                    <View key={label + i} style={styles.pebbleCol}>
                      <Animated.View
                        style={[
                          styles.pebble,
                          on && styles.pebbleOn,
                          today && styles.pebbleToday,
                          today && {
                            transform: [
                              {
                                scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }),
                              },
                            ],
                          },
                        ]}
                      >
                        {on ? (
                          <MCI name="check" size={14} color={today ? C.inkOnLime : '#FFFFFF'} />
                        ) : null}
                      </Animated.View>
                      <Text style={[styles.pebbleDay, today && styles.pebbleDayNow]}>{label}</Text>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View style={styles.weekStart}>
                <Animated.View
                  style={[
                    styles.weekStartOrb,
                    {
                      transform: [
                        { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] }) },
                      ],
                    },
                  ]}
                >
                  <MCI name="sprout" size={17} color={C.inkOnLime} />
                </Animated.View>
                <Text style={styles.weekHint}>
                  Bu hafta hali mashq yo‘q — birinchi darsdan keyin shu yerda haftalik ritm boshlanadi.
                </Text>
              </View>
            )}
          </View>
        </Reveal>
      </ScrollView>

      <TopScrim height={insets.top} colors={['#FFFFFF', '#FFFFFF']} line="rgba(14,26,18,0.06)" />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16 },

  /* ── Sarlavha ── */
  head: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  whoText: { flex: 1, justifyContent: 'center' },
  helloName: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.6,
    fontWeight: '700',
    color: C.ink,
  },
  helloLast: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.4,
    fontWeight: '500',
    color: '#55655C',
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.brand,
    shadowOpacity: 0.2,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatarRingFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  avatar: {
    width: 41,
    height: 41,
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2FAE9',
  },
  avatarMonogram: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.2, color: '#0B4A34' },

  headRight: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 0 },
  statPill: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statPillClaimed: { opacity: 0.5 },
  statText: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, color: C.ink },

  /* ── Tanga sochilishi ── */
  coinWrap: { position: 'relative' },
  burst: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: -34,
    height: 34,
    alignItems: 'center',
  },
  burstCoin: { position: 'absolute', bottom: 0 },
  burstPrize: { position: 'absolute', bottom: 1 },
  burstPrizeText: { fontSize: 12, fontWeight: '800', color: '#C97A16' },

  proWrap: {
    height: 30,
    borderRadius: 11,
    shadowColor: '#F4671F',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  proGlow: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 15,
    backgroundColor: '#FF9A2E',
  },
  proPill: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#FF8A1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  proGloss: { position: 'absolute', top: 0, left: 0, right: 0, height: 14 },
  proShine: { position: 'absolute', top: -16, bottom: -16, width: 18 },
  proText: { fontSize: 11.5, letterSpacing: 0.9, fontWeight: '800', color: '#FFFFFF' },

  /* ── Reklama karuseli ── */
  adWrap: { marginTop: 14, borderRadius: R['2xl'], overflow: 'hidden' },
  ad: {
    height: 124,
    justifyContent: 'center',
    backgroundColor: '#07281B',
  },
  adPhoto: { position: 'absolute', right: 0, top: 0, width: '62%', height: '100%' },
  adInner: { maxWidth: 220, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 26 },
  adBrand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adBrandText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.1, color: '#CDE9AE' },
  adTitle: {
    marginTop: 5,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  adDots: {
    position: 'absolute',
    left: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  adDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(230,245,220,0.34)' },
  adDotOn: { width: 14, backgroundColor: C.limeBright },

  /* ── Bugungi masala: yechilmagan ── */
  dailyCard: {
    marginTop: 12,
    borderRadius: R['2xl'],
    padding: 14,
    backgroundColor: '#F5FAEE',
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.18)',
  },
  dailyTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dailyIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.14)',
  },
  dailyTitle: {
    flex: 1,
    fontSize: 14.5,
    letterSpacing: -0.2,
    fontWeight: '700',
    color: C.ink,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 22,
    paddingHorizontal: 8,
    borderRadius: R.full,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.12)',
  },
  deadlineClock: { fontSize: 10.5, fontWeight: '600', color: C.ink3 },
  dailyMeta: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.limeDeep },
  dailyNudge: { fontSize: 11, fontWeight: '600', color: C.ink2 },
  dailySrc: { flex: 1, fontSize: 10.5, fontWeight: '500', color: C.ink4 },
  promptTicket: {
    marginTop: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: R.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.10)',
  },
  promptText: { fontFamily: MATH_FONT, fontSize: 14, lineHeight: 20, color: C.brandDeep },
  dailyFoot: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewards: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: R.full,
    backgroundColor: C.coinSoft,
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.3)',
  },
  rewardChipXp: { backgroundColor: C.xpSoft, borderColor: 'rgba(76,125,240,0.28)' },
  rewardText: { fontSize: 10.5, fontWeight: '700', color: '#B87A22' },
  rewardTextXp: { color: '#3560C4' },
  dailyCta: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: R.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.limeBright,
  },
  dailyCtaText: { fontSize: 12, fontWeight: '700', color: C.inkOnLime },

  /* ── Bugungi masala: yechilgan — ixcham ── */
  dailyDone: {
    marginTop: 12,
    height: 62,
    borderRadius: R.lg,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
  },
  doneIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  doneIconWrong: { backgroundColor: '#FCF1DC' },
  doneText: { flex: 1 },
  doneTitle: { fontSize: 13.5, letterSpacing: -0.2, fontWeight: '600', color: C.ink },
  doneTitleWrong: { color: '#B87A22' },
  doneSub: { marginTop: 1, fontSize: 10.5, fontWeight: '500', color: C.ink3 },
  doneClock: { fontSize: 10, fontWeight: '600', color: C.ink4 },

  /* ── Umumiy karta ── */
  card: {
    marginTop: 14,
    borderRadius: R['2xl'],
    padding: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.lineSoft,
  },

  /* ── Bo'lim sarlavhalari ── */
  secHead: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  secLabel: { fontSize: 10.5, letterSpacing: 1.3, fontWeight: '700', color: C.ink3 },
  secMeta: { fontSize: 11.5, fontWeight: '500', color: C.ink4 },

  /* ── Kurslar ── */
  courseShadow: { borderRadius: R.xl },
  courseCard: {
    height: 150,
    borderRadius: R.xl,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: C.brandDeep,
  },
  courseCover: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  courseVeil: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  courseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  courseChip: {
    height: 24,
    paddingHorizontal: 9,
    borderRadius: R.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  courseChipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.lime },
  courseChipText: { fontSize: 9.5, letterSpacing: 0.7, fontWeight: '700', color: C.brandDeep },
  courseGo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  courseBody: { gap: 2 },
  courseName: { fontSize: 19, letterSpacing: -0.4, fontWeight: '700', color: '#FFFFFF' },
  courseMeta: { fontSize: 11.5, fontWeight: '500', color: 'rgba(255,255,255,0.75)' },
  courseBar: {
    marginTop: 8,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  courseFill: { height: '100%', borderRadius: 3, backgroundColor: C.limeBright },

  soonScroll: { marginTop: 10, gap: 10, paddingRight: 4 },
  soonTile: {
    width: 108,
    height: 92,
    borderRadius: R.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
  },
  soonCover: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  soonVeil: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  soonGo: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  soonName: { fontSize: 12.5, letterSpacing: -0.2, fontWeight: '600', color: C.ink },

  /* ── Mashq ── */
  wide: {
    height: 76,
    borderRadius: R['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.lineSoft,
  },
  wideIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  wideBody: { flex: 1 },
  wideTitle: { fontSize: 15, letterSpacing: -0.2, fontWeight: '600', color: C.ink },
  wideSub: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: C.ink3 },
  wideGo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface2,
  },
  miniRow: { marginTop: 10, flexDirection: 'row', gap: 9 },
  mini: {
    flex: 1,
    height: 92,
    borderRadius: R.xl,
    padding: 12,
    justifyContent: 'space-between',
  },
  miniIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  miniTitle: { fontSize: 12.5, letterSpacing: -0.1, fontWeight: '600', color: C.ink },
  miniSub: { marginTop: 1, fontSize: 10.5, fontWeight: '500', color: C.ink3 },

  /* ── Hafta ── */
  weekHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weekTitle: { fontSize: 10.5, letterSpacing: 1.3, fontWeight: '700', color: C.ink3 },
  weekMeta: { fontSize: 11.5, fontWeight: '600', color: C.ink2 },
  pebbles: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  pebbleCol: { alignItems: 'center', gap: 5 },
  pebble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
  },
  pebbleOn: { backgroundColor: C.brand, borderColor: C.brand },
  pebbleToday: { backgroundColor: C.limeBright, borderColor: 'rgba(11,110,79,0.35)' },
  pebbleDay: { fontSize: 9.5, fontWeight: '500', color: C.ink4 },
  pebbleDayNow: { color: C.brand, fontWeight: '700' },
  weekHint: { flex: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '500', color: C.ink3 },
  weekStart: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  weekStartOrb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.limeBright,
  },
})

export default HomeScreen
