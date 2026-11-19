import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions,
} from 'react-native'
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  ACHIEVEMENTS, ALL_SETS, WEEK_LABELS, currentWeekKeys,
  unlockedAchievements, type AchIcon, type AchStats,
} from '../data/content'
import { TOPICS } from '../data/curriculum'
import { triggerHaptic } from '../lib/haptics'
import { ensurePushToken, sendTestPush, syncPushTokenToBackend } from '../lib/push'
import { useApp } from '../store/useStore'
import { navBottomSpace } from '../components/BottomNav'
import { TopScrim } from '../components/ui'
import Sheet from '../components/Sheet'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { ABS_FILL, LIME_BTN_GRAD, NUM, SHADOW, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

/**
 * Profil — shaxsiy kabinet. Barcha raqamlar store'dan keladi:
 * zanjir, XP, tangalar, aniqlik, o'qish daqiqalari, ochilgan nishonlar.
 */

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>


/** Qahramon panel — to'q marjon gradient */
const PRO_DARK: readonly [string, string, string] = ['#16382A', '#0E241B', '#0A1B14']
/** Premium juftlik: zumrad fon + oltin metall badge (Duolingo/Spotify uslubi) */
const PRO_GOLD: readonly [string, string] = ['#FBE6B0', '#E8A33D']

const ALL_LESSONS = TOPICS.flatMap(t => t.lessons)

const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

const XP_STEP = 1000

const ICONS: Record<AchIcon, keyof typeof MCI.glyphMap> = {
  bolt: 'lightning-bolt',
  trophy: 'trophy-outline',
  grid: 'view-grid-outline',
  cap: 'school-outline',
  books: 'bookshelf',
  check: 'check-circle-outline',
  medal: 'medal-outline',
  star: 'star-outline',
  gem: 'diamond-stone',
  target: 'bullseye-arrow',
  flame: 'fire',
  brain: 'head-lightbulb-outline',
  bag: 'shopping-outline',
  heart: 'heart-outline',
  pen: 'pencil-outline',
  rocket: 'rocket-launch-outline',
  moon: 'moon-waning-crescent',
  compass: 'compass-outline',
  sigma: 'function-variant',
  crown: 'crown-outline',
}

const medalTints = (C: ThemeColors): Record<AchIcon, { bg: string; ink: string }> => ({
  bolt: { bg: C.mintSoft, ink: C.brand },
  trophy: { bg: C.coinSoft, ink: C.coin },
  grid: { bg: C.xpSoft, ink: C.xp },
  cap: { bg: C.leafSoft, ink: C.brand },
  books: { bg: C.xpSoft, ink: C.xp },
  check: { bg: C.leafSoft, ink: C.brand },
  medal: { bg: C.coinSoft, ink: C.coin },
  star: { bg: C.coinSoft, ink: C.coin },
  gem: { bg: C.violetSoft, ink: C.violet },
  target: { bg: C.dangerSoft, ink: C.danger },
  flame: { bg: C.coinSoft, ink: C.coin },
  brain: { bg: C.xpSoft, ink: C.xp },
  bag: { bg: C.leafSoft, ink: C.brand },
  heart: { bg: C.dangerSoft, ink: C.danger },
  pen: { bg: C.xpSoft, ink: C.xp },
  rocket: { bg: C.coinSoft, ink: C.coin },
  moon: { bg: C.surface2, ink: C.ink3 },
  compass: { bg: C.leafSoft, ink: C.brand },
  sigma: { bg: C.mintSoft, ink: C.brand },
  crown: { bg: C.coinSoft, ink: C.coin },
})

const lockedTint = (C: ThemeColors) => ({ bg: C.surface2, ink: C.ink4 })

const fmtUz = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()}-${MONTHS_UZ[d.getMonth()]}, ${d.getFullYear()}`
}

/** Rangga mos yumshoq soyali karta — Dribbble'dagi gradient karta uslubi */
const glow = (color: string) => ({
  ...SHADOW.card,
  shadowColor: color,
  shadowOpacity: 0.2,
  shadowRadius: 12,
})

const GRAD_AVATAR: readonly [string, string] = ['#1FA35F', '#0B6E4F']

const CH = 90

/** Haftalik daqiqalar chizig'i — barcha nuqtalar haqiqiy `studyMinutes` dan */
const WeekChart = ({ mins, width, todayIdx }: { mins: number[]; width: number; todayIdx: number }) => {
  const C = useColors()
  const max = Math.max(...mins)
  const top = max > 0 ? max : 1
  const xAt = (i: number) => 8 + (i * (width - 16)) / 6
  const yAt = (v: number) => CH - 12 - (v / top) * (CH - 26)
  const line = mins.map((m, i) => `${xAt(i)},${Math.round(yAt(m) * 10) / 10}`).join(' ')
  const area = mins.length
    ? `M ${mins.map((m, i) => `${xAt(i)} ${Math.round(yAt(m) * 10) / 10}`).join(' L ')}`
      + ` L ${xAt(6)} ${CH - 12} L ${xAt(0)} ${CH - 12} Z`
    : ''
  return (
    <Svg width={width} height={CH}>
      {[0, 0.5, 1].map(k => (
        <Line
          key={k}
          x1={0} y1={12 + (CH - 26) * k} x2={width} y2={12 + (CH - 26) * k}
          stroke={C.line} strokeWidth={1}
        />
      ))}
      {!!area && <Path d={area} fill={C.brand} fillOpacity={0.12} />}
      <Polyline
        points={line} fill="none" stroke={C.brand} strokeWidth={2.75}
        strokeLinejoin="round" strokeLinecap="round"
      />
      {mins.map((m, i) => (
        <Circle
          key={i}
          cx={xAt(i)} cy={yAt(m)} r={i === todayIdx ? 6 : 4}
          fill={C.surface} stroke={C.brand} strokeWidth={i === todayIdx ? 3 : 2.5}
        />
      ))}
    </Svg>
  )
}

const ProfileScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const [editOpen, setEditOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [allOpen, setAllOpen] = useState(false)
  const [outOpen, setOutOpen] = useState(false)
  const [pushMsg, setPushMsg] = useState<string | null>(null)
  const [pushBusy, setPushBusy] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftUser, setDraftUser] = useState('')

  const name = useApp(s => s.name)
  const username = useApp(s => s.username)
  const email = useApp(s => s.email)
  const publicId = useApp(s => s.publicId)
  const photoUrl = useApp(s => s.photoUrl)
  const theme = useApp(s => s.theme)
  const notifOn = useApp(s => s.notifOn)
  const setNotif = useApp(s => s.setNotif)
  const topicLessons = useApp(s => s.topicLessons)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const answeredTotal = useApp(s => s.answeredTotal)
  const answeredCorrect = useApp(s => s.answeredCorrect)
  const xp = useApp(s => s.xp)
  const level = useApp(s => s.level)
  const streak = useApp(s => s.streak)
  const bestStreak = useApp(s => s.bestStreak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const studyMinutes = useApp(s => s.studyMinutes)
  const orders = useApp(s => s.orders)
  const reviews = useApp(s => s.reviews)
  const favs = useApp(s => s.favs)
  const isPro = useApp(s => s.isPro)
  const proExpires = useApp(s => s.proExpires)
  const setProfile = useApp(s => s.setProfile)
  const setTheme = useApp(s => s.setTheme)
  const signOut = useApp(s => s.signOut)

  const C = useColors()
  const p = makeP(C)

  /* ── Haqiqiy ko'rsatkichlar ── */

  const lessonsDone = ALL_LESSONS.filter(l => topicLessons[l.id]?.done).length

  const topic = useMemo(() => {
    const t: Record<string, number> = {}
    for (const set of ALL_SETS) {
      const n = Math.min((solvedQuestions[set.id] ?? []).length, set.questions.length)
      if (n > 0) t[set.topic] = (t[set.topic] ?? 0) + n
    }
    return t
  }, [solvedQuestions])

  const accuracy = answeredTotal > 0 ? Math.round((answeredCorrect / answeredTotal) * 100) : 0
  /** `bestStreak` maydoni qo'shilgandan oldingi zanjirlar ham hisobga olinadi */
  const best = Math.max(bestStreak, streak)

  const stats: AchStats = {
    lessonsDone, totalLessons: ALL_LESSONS.length, solved: solvedCount, streak,
    bestStreak: best, level, accuracy, solvedToday,
    orders: orders.length, reviews: reviews.length, favs: favs.length, topic,
  }
  const unlocked = unlockedAchievements(stats)
  const unlockedIds = new Set(unlocked.map(a => a.id))
  /** Nishonlar lentasi — avval ochilganlari, keyin qolganlar */
  const badges = [
    ...unlocked,
    ...ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id)),
  ].slice(0, 4)

  const week = currentWeekKeys()
  const mins = week.map(k => studyMinutes[k] ?? 0)
  const totalMin = mins.reduce((a, b) => a + b, 0)
  const todayIdx = (new Date().getDay() + 6) % 7
  const peak = Math.max(...mins)

  const [now] = useState(() => Date.now())
  const proDays = proExpires
    ? Math.ceil((Date.parse(proExpires + 'T00:00:00') - now) / 86_400_000)
    : 0
  const planLabel = proDays >= 300 ? 'Yillik obuna' : proDays >= 25 ? 'Oylik obuna' : 'Sinov muddati'
  const proActive = isPro && proDays > 0

  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const identity = [username ? `@${username}` : email, publicId].filter(Boolean).join(' · ')

  /** Joriy daraja ichidagi XP — shkala shu nisbatda to'ladi */
  const withinXp = xp % XP_STEP
  const xpPct = Math.round((withinXp / XP_STEP) * 100)
  const xpLeft = XP_STEP - withinXp

  const chartW = Math.max(180, width - 88)

  /* ── Pro banner jonlanishi: sekin shimmer + yulduzcha pulsatsiyasi ── */
  const shimmer = useRef(new Animated.Value(0)).current
  const twinkle = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(shimmer, {
          toValue: 1, duration: 2400, easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    )
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
      ])
    )
    sweep.start()
    blink.start()
    return () => { sweep.stop(); blink.stop() }
  }, [shimmer, twinkle])
  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-90, 420] })

  const openEdit = () => {
    setDraftName(name)
    setDraftUser(username)
    setEditOpen(true)
  }

  const saveProfile = () => {
    const nm = draftName.trim()
    if (!nm) return
    triggerHaptic('success')
    setProfile(nm, draftUser.trim().replace(/^@/, ''))
    setEditOpen(false)
  }

  const toggleNotif = async () => {
    triggerHaptic('selection')
    const next = !notifOn
    setNotif(next)
    setPushMsg(null)
    if (next) {
      const { status } = await ensurePushToken()
      if (status !== 'ready') {
        setPushMsg(
          status === 'denied' ? 'Ruxsat berilmadi — tizim sozlamalaridan yoqing'
          : status === 'no-device' ? 'Simulyatorda remote push ishlamaydi'
          : status === 'no-project' ? 'EAS projectId topilmadi'
          : 'Token olinmadi',
        )
      }
    }
    void syncPushTokenToBackend()
  }

  const testPush = async () => {
    if (pushBusy) return
    triggerHaptic('light')
    setPushBusy(true)
    setPushMsg(null)
    try {
      setPushMsg(await sendTestPush())
    } finally {
      setPushBusy(false)
    }
  }

  return (
    <View style={p.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          p.scroll,
          { paddingTop: insets.top + 10, paddingBottom: navBottomSpace(insets.bottom) },
        ]}
      >
        {/* ── 1. Sarlavha ── */}
        <View style={p.head}>
          <Text style={p.h1}>Profil</Text>
          <View style={p.headBtns}>
            <HeadBtn
              icon="crown-outline"
              label="HDP Pro"
              tint={C.violetSoft}
              ink={C.violet}
              onPress={() => { triggerHaptic('light'); navigation.navigate('Pro') }}
            />
            <HeadBtn
              icon="bell-outline"
              label="Faollik hisoboti"
              tint="#FFFFFF"
              ink={C.ink}
              onPress={() => { triggerHaptic('light'); setBellOpen(true) }}
            />
            <HeadBtn
              icon="cog-outline"
              label="Sozlamalar"
              tint="#FFFFFF"
              ink={C.ink}
              onPress={() => { triggerHaptic('light'); setSettingsOpen(true) }}
            />
          </View>
        </View>

        {/* ── 2. Oq profil kartasi ── */}
        <View style={p.heroCard}>
          <View style={p.heroTop}>
            <View style={p.avatarWrap}>
              <Pressable
                onPress={() => { triggerHaptic('light'); openEdit() }}
                accessibilityLabel="Profilni tahrirlash"
                style={({ pressed }) => [p.avatarInner, pressed && { opacity: 0.85 }]}
              >
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={p.avatarImg} />
                ) : (
                  <LinearGradient
                    colors={GRAD_AVATAR}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[ABS_FILL, { alignItems: 'center', justifyContent: 'center' }]}
                  >
                    {initials
                      ? <Text style={p.avatarText}>{initials}</Text>
                      : <MCI name="account-outline" size={28} color="rgba(255,255,255,0.9)" />}
                  </LinearGradient>
                )}
              </Pressable>
              <View style={p.lvlDot}>
                <Text style={p.lvlDotText}>{level}</Text>
              </View>
            </View>

            <View style={p.heroMid}>
              <Pressable
                onPress={() => { triggerHaptic('light'); openEdit() }}
                accessibilityLabel="Profilni tahrirlash"
                style={({ pressed }) => [p.heroNameRow, pressed && { opacity: 0.6 }]}
              >
                <Text numberOfLines={1} style={p.heroName}>{name || 'Ismingizni kiriting'}</Text>
                <MCI name="pencil-outline" size={12} color={C.ink3} />
              </Pressable>
              <Text numberOfLines={1} style={p.heroHandle}>
                {identity || "Profil to'ldirilmagan"}
              </Text>
            </View>
          </View>

          <View style={p.xpBlock}>
            <LinearGradient
              colors={[C.leafTint, C.mintSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[ABS_FILL, { borderRadius: 16 }]}
              pointerEvents="none"
            />
            <View style={p.xpHead}>
              <Text style={p.xpTitle}>Daraja {level}</Text>
              <Text style={[p.xpNums, NUM]}>
                <Text style={p.xpNow}>{withinXp}</Text>{` / ${XP_STEP} XP`}
              </Text>
            </View>
            <View style={p.xpTrack2}>
              <View style={[p.xpFill2, { width: `${xpPct}%` }]}>
                <LinearGradient
                  colors={LIME_BTN_GRAD}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={ABS_FILL}
                />
              </View>
            </View>
            <Text style={p.xpHint}>{xpLeft} XP keyingi darajaga</Text>
          </View>
        </View>

        {/* ── 3. Pro banner — zumrad fon, oltin badge, jonli shimmer ── */}
        <Pressable
          onPress={() => {
            triggerHaptic(proActive ? 'light' : 'medium')
            navigation.navigate('Pro')
          }}
          accessibilityRole="button"
          accessibilityLabel={proActive ? 'HDP Pro obunasini boshqarish' : 'HDP Pro sahifasini ochish'}
          style={({ pressed }) => [p.proWrap, pressed && { opacity: 0.94, transform: [{ scale: 0.995 }] }]}
        >
          <LinearGradient
            colors={PRO_DARK}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={p.proBanner}
          >
            <View pointerEvents="none" style={p.proBloom} />
            <View pointerEvents="none" style={p.proRing} />
            <View pointerEvents="none" style={p.proEdge} />
            <Animated.View
              pointerEvents="none"
              style={[p.proSheen, { transform: [{ translateX: shimmerX }, { rotate: '16deg' }] }]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.13)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={ABS_FILL}
              />
            </Animated.View>

            <View style={p.proBadge}>
              <LinearGradient
                colors={PRO_GOLD}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[ABS_FILL, { borderRadius: 14 }]}
              />
              <MCI name="crown" size={21} color="#3B2A07" />
              <Animated.View
                style={[p.proSparkA, { opacity: twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }]}
              >
                <MCI name="star-four-points" size={9} color="#FBE6B0" />
              </Animated.View>
              <Animated.View
                style={[p.proSparkB, { opacity: twinkle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.25] }) }]}
              >
                <MCI name="star-four-points" size={7} color="#FBE6B0" />
              </Animated.View>
            </View>

            <View style={p.proMid}>
              <View style={p.proTitleRow}>
                <Text style={p.proTitle}>HDP Pro</Text>
                <View style={p.proPill}>
                  <Text style={p.proPillText}>PRO</Text>
                </View>
                {proActive && (
                  <View style={p.proLive}>
                    <View style={p.proLiveDot} />
                    <Text style={p.proLiveText}>FAOL</Text>
                  </View>
                )}
              </View>
              <Text numberOfLines={1} style={p.proSub}>
                {proActive
                  ? `${planLabel}${proDays > 0 ? ` · ${proDays} kun qoldi` : ''}`
                  : "Barcha mashq to'plamlari ochiq"}
              </Text>
            </View>

            <View style={p.proCta}>
              <LinearGradient
                colors={LIME_BTN_GRAD}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[ABS_FILL, { borderRadius: 11 }]}
              />
              <Text style={p.proCtaText}>{proActive ? 'Boshqarish' : 'Ochish'}</Text>
              <MCI name="arrow-right" size={12} color={C.inkOnLime} />
            </View>
          </LinearGradient>
        </Pressable>

        {/* ── 4. Katta kafellar ── */}
        <View style={p.bigRow}>
          <BigTile
            icon="puzzle-outline"
            tint={C.leafSoft}
            ink={C.brand}
            value={`${solvedCount}`}
            label="Yechildi masalalar"
          />
          <BigTile
            icon="book-open-variant"
            tint={C.coinSoft}
            ink={C.coin}
            value={`${lessonsDone}`}
            label="Yakunlangan darslar"
          />
        </View>

        {/* ── 5. Haftalik faollik ── */}
        <View style={[p.card, p.chartCard]}>
          <View style={p.secHead}>
            <View style={p.secMid}>
              <Text style={p.cardTitle}>Haftalik faollik</Text>
              <Text style={p.cardSub}>Hafta davomidagi o&apos;qish vaqti</Text>
            </View>
            <View style={p.chartIcon}>
              <MCI name="chart-line" size={16} color={C.brand} />
            </View>
          </View>

          <View style={p.chartRow}>
            <View style={p.yAxis}>
              <Text style={p.yLabel}>{peak > 0 ? `${peak}` : '0'}</Text>
              <Text style={p.yLabel}>{peak > 0 ? `${Math.round(peak / 2)}` : ''}</Text>
              <Text style={p.yLabel}>0</Text>
            </View>
            <WeekChart mins={mins} width={chartW} todayIdx={todayIdx} />
          </View>
          <View style={p.xAxis}>
            {WEEK_LABELS.map((l, i) => (
              <Text key={l} style={[p.xLabel, i === todayIdx && p.xLabelToday]}>{l}</Text>
            ))}
          </View>

          <View style={p.legend}>
            <View style={p.legendDot} />
            <Text numberOfLines={1} style={p.legendName}>{name || 'Siz'}</Text>
            <Text style={[p.legendValue, NUM]}>{totalMin} daq</Text>
          </View>
        </View>

        {/* ── 6. Nishonlar ── */}
        <View style={p.card}>
          <View style={p.secHead}>
            <Text style={p.cardTitle}>Nishonlar</Text>
            <Pressable
              onPress={() => { triggerHaptic('light'); setAllOpen(true) }}
              hitSlop={12}
              style={({ pressed }) => [p.allBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={p.secAction}>Barchasi</Text>
              <MCI name="chevron-right" size={13} color={C.brand} />
            </Pressable>
          </View>

          <View style={p.badgeRow}>
            {badges.map(m => {
              const on = unlockedIds.has(m.id)
              const tint = on ? medalTints(C)[m.icon] : lockedTint(C)
              return (
                <View key={m.id} style={p.badgeCol}>
                  <View
                    style={[
                      p.badge,
                      { backgroundColor: tint.bg, opacity: on ? 1 : 0.62 },
                      on && glow(tint.ink),
                    ]}
                  >
                    <MCI name={ICONS[m.icon]} size={23} color={tint.ink} />
                  </View>
                  <Text numberOfLines={2} style={p.badgeTitle}>{m.title}</Text>
                </View>
              )
            })}
          </View>
        </View>

      </ScrollView>

      {/* Status bar zonasi — kontent shu chegara ostidan o'tadi */}
      <TopScrim height={insets.top} colors={[C.surface2, C.surface2]} line="rgba(14,26,18,0.05)" />

      {/* ── Varaqa: profilni tahrirlash ── */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Profilni tahrirlash">
        <Field label="Ism familiya" value={draftName} onChange={setDraftName} placeholder="Ismingiz" />
        <Field label="Telegram foydalanuvchi nomi" value={draftUser} onChange={setDraftUser} placeholder="username" prefix="@" />
        <Pressable
          onPress={saveProfile}
          disabled={!draftName.trim()}
          style={({ pressed }) => [
            p.btnLime,
            !draftName.trim() ? { opacity: 0.4 } : pressed ? { opacity: 0.85 } : null,
          ]}
        >
          <Text style={p.btnLimeText}>Saqlash</Text>
        </Pressable>
      </Sheet>

      {/* ── Varaqa: faollik hisoboti ── */}
      <Sheet
        open={bellOpen}
        onClose={() => setBellOpen(false)}
        title="Faollik hisoboti"
        subtitle="Bugungi faollik va hisob ma'lumotlari."
      >
        <Note label="Bugungi faollik" value={solvedToday > 0 ? `${solvedToday} ta masala yechildi` : 'Hali birorta masala yechilmadi'} />
        <Note label="Aniqlik" value={answeredTotal > 0 ? `${accuracy}% · ${answeredCorrect}/${answeredTotal}` : 'Hali javob berilmagan'} />
        <Note label="Zanjir" value={`${streak} kun · rekord ${bestStreak} kun`} />
        <Note label="Pro muddati" value={proActive && proExpires ? fmtUz(proExpires) : 'Pro yoqilmagan'} />
        <Note label="Buyurtmalar" value={orders.length > 0 ? `${orders.length} ta sovg'a buyurtma qilingan` : "Hali buyurtma yo'q"} />
        <Pressable
          onPress={() => { triggerHaptic('selection'); setBellOpen(false); navigation.navigate('Problems') }}
          style={({ pressed }) => [p.btnInk, pressed && { opacity: 0.9 }]}
        >
          <Text style={p.btnInkText}>Kunlik masalaga o&apos;tish</Text>
        </Pressable>
      </Sheet>

      {/* ── Varaqa: sozlamalar ── */}
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Sozlamalar">
        <Text style={p.sheetText}>Ko&apos;rinish va ilova qoidalari.</Text>
        <View style={p.themeList}>
          {([
            { key: 'light' as const, label: "Yorug' (Toza Oq rejim)", icon: 'weather-sunny' as const, ready: true },
            { key: 'dark' as const, label: "Qorong'u (Tun rejimi)", icon: 'moon-waning-crescent' as const, ready: true },
          ]).map(o => {
            const active = theme === o.key
            return (
              <Pressable
                key={o.key}
                disabled={!o.ready}
                onPress={() => { triggerHaptic('selection'); setTheme(o.key) }}
                style={({ pressed }) => [
                  p.themeRow,
                  !o.ready && { opacity: 0.45 },
                  pressed && o.ready && { backgroundColor: C.surface2 },
                ]}
              >
                <MCI name={o.icon} size={17} color={active ? C.brand : C.ink3} />
                <Text style={p.themeLabel}>{o.label}</Text>
                {!o.ready && <Pill label="Tez orada" bg={C.surface2} ink={C.ink3} />}
                {o.ready && (
                  <MCI
                    name={active ? 'radiobox-marked' : 'radiobox-blank'}
                    size={18}
                    color={active ? C.brand : C.ink4}
                  />
                )}
              </Pressable>
            )
          })}
        </View>

        {/* ── Bildirishnomalar ── */}
        <View style={p.themeList}>
          <Pressable onPress={() => void toggleNotif()} style={({ pressed }) => [p.themeRow, pressed && { backgroundColor: C.surface2 }]}>
            <MCI name={notifOn ? 'bell-ring-outline' : 'bell-off-outline'} size={17} color={notifOn ? C.brand : C.ink3} />
            <Text style={p.themeLabel}>Push bildirishnomalar</Text>
            <MCI
              name={notifOn ? 'radiobox-marked' : 'radiobox-blank'}
              size={18}
              color={notifOn ? C.brand : C.ink4}
            />
          </Pressable>
          <Pressable
            onPress={() => void testPush()}
            disabled={pushBusy}
            style={({ pressed }) => [p.themeRow, (pressed || pushBusy) && { opacity: 0.6 }]}
          >
            <MCI name="send-outline" size={17} color={C.brand} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={p.themeLabel}>{pushBusy ? 'Yuborilmoqda…' : 'Test bildirishnomasi'}</Text>
              {!!pushMsg && <Text style={p.pushMsg}>{pushMsg}</Text>}
            </View>
            <MCI name="chevron-right" size={18} color="#C9D3C4" />
          </Pressable>
        </View>

        <View style={p.helpList}>
          {[
            ['Kunlik masala', 'Har kuni yangilanadi va coin beradi'],
            ['Natijalar', 'Shu qurilmada saqlanadi'],
            ['Do\'kon buyurtmasi', 'Buyurtma Profilingizda saqlanadi'],
          ].map(([k, v]) => (
            <View key={k} style={p.helpRow}>
              <Text style={p.helpKey}>{k}</Text>
              <Text style={p.helpValue}>{v}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => { triggerHaptic('warning'); setSettingsOpen(false); setOutOpen(true) }}
          style={({ pressed }) => [p.btnDanger, pressed && { opacity: 0.9 }]}
        >
          <Text style={p.btnDangerText}>Chiqish</Text>
        </Pressable>
      </Sheet>

      {/* ── Varaqa: barcha nishonlar ── */}
      <Sheet
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="Barcha nishonlar"
        subtitle={`${unlocked.length} / ${ACHIEVEMENTS.length} ochilgan`}
      >
        <View style={p.medalGrid}>
          {ACHIEVEMENTS.map(a => {
            const on = unlockedIds.has(a.id)
            const tint = on ? medalTints(C)[a.icon] : lockedTint(C)
            return (
              <View key={a.id} style={[p.medalCell, { opacity: on ? 1 : 0.5 }]}>
                <View style={[p.medalCellIcon, { backgroundColor: tint.bg }]}>
                  <MCI name={ICONS[a.icon]} size={16} color={tint.ink} />
                </View>
                <View style={p.medalCellMid}>
                  <Text numberOfLines={1} style={p.medalCellTitle}>{a.title}</Text>
                  <Text numberOfLines={1} style={p.medalCellHint}>{a.hint}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </Sheet>

      {/* ── Varaqa: chiqish ── */}
      <Sheet open={outOpen} onClose={() => setOutOpen(false)} title="Chiqish">
        <Text style={p.sheetText}>
          Sessiya yopiladi va boshlang&apos;ich ekranga qaytasiz. Progress — darslar, coin, zanjir va
          buyurtmalar — o&apos;rnida qoladi.
        </Text>
        <Pressable
          onPress={() => { triggerHaptic('warning'); setOutOpen(false); signOut(); navigation.replace('Onboarding') }}
          style={({ pressed }) => [p.btnDanger, pressed && { opacity: 0.9 }]}
        >
          <Text style={p.btnDangerText}>Ha, chiqaman</Text>
        </Pressable>
        <Pressable
          onPress={() => { triggerHaptic('light'); setOutOpen(false) }}
          style={({ pressed }) => [p.btnSoft, pressed && { opacity: 0.8 }]}
        >
          <Text style={p.btnSoftText}>Bekor qilish</Text>
        </Pressable>
      </Sheet>
    </View>
  )
}

/* ── kichik bloklar ── */

const HeadBtn = ({
  icon, label, tint, ink, onPress,
}: {
  icon: keyof typeof MCI.glyphMap
  label: string
  tint: string
  ink: string
  onPress: () => void
}) => {
  const C = useColors()
  const st = makeSt(C)
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={label}
      style={({ pressed }) => [st.headBtn, { backgroundColor: tint }, pressed && { opacity: 0.6 }]}
    >
      <MCI name={icon} size={17} color={ink} />
    </Pressable>
  )
}

const BigTile = ({
  icon, tint, ink, value, label,
}: {
  icon: keyof typeof MCI.glyphMap
  tint: string
  ink: string
  value: string
  label: string
}) => {
  const C = useColors()
  const st = makeSt(C)
  return (
  <View style={st.bigTile}>
    <View style={[st.bigIcon, { backgroundColor: tint }]}>
      <MCI name={icon} size={19} color={ink} />
    </View>
    <View style={st.bigMid}>
      <Text numberOfLines={1} style={[st.bigValue, NUM]}>{value}</Text>
      <Text numberOfLines={2} style={st.bigLabel}>{label}</Text>
    </View>
  </View>
  )
}

const Pill = ({ label, bg, ink }: { label: string; bg: string; ink: string }) => {
  const C = useColors()
  const st = makeSt(C)
  return (
    <View style={[st.pill, { backgroundColor: bg }]}>
      <Text style={[st.pillText, { color: ink }]}>{label}</Text>
    </View>
  )
}

const Note = ({ label, value }: { label: string; value: string }) => {
  const C = useColors()
  const st = makeSt(C)
  return (
    <View style={st.noteRow}>
      <Text style={st.noteLabel}>{label}</Text>
      <Text style={st.noteValue}>{value}</Text>
    </View>
  )
}

const Field = ({
  label, value, onChange, placeholder, prefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  prefix?: string
}) => {
  const C = useColors()
  const st = makeSt(C)
  return (
  <View style={st.fieldWrap}>
    <Text style={st.fieldLabel}>{label}</Text>
    <View style={st.fieldBox}>
      {!!prefix && <Text style={st.fieldPrefix}>{prefix}</Text>}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.ink4}
        style={st.fieldInput}
      />
    </View>
  </View>
  )
}

const makeP = (C: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.canvas },
  scroll: { paddingHorizontal: 16 },

  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h1: { fontSize: 23, lineHeight: 28, fontWeight: '700', letterSpacing: -0.6, color: C.ink },
  headBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  heroCard: {
    marginTop: 14, backgroundColor: C.surface, borderRadius: 24,
    padding: 14, borderWidth: 1, borderColor: C.surface2,
    ...shadow('#000', 18, 6, 0.07),
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 68, height: 68, borderRadius: 100, backgroundColor: '#EAF4E2',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#DCEDCE',
    ...shadow(C.brand, 10, 3, 0.12),
  },
  avatarInner: { width: 60, height: 60, borderRadius: 100, overflow: 'hidden' },
  avatarImg: { width: 60, height: 60 },
  avatarText: { fontSize: 22, fontWeight: '600', color: '#FFFFFF', letterSpacing: -0.6 },
  lvlDot: {
    position: 'absolute', right: -2, bottom: -2, minWidth: 21, height: 21,
    paddingHorizontal: 5, borderRadius: 100, backgroundColor: C.lime,
    borderWidth: 2.5, borderColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.limeDeep, 4, 2, 0.35),
  },
  lvlDotText: { fontSize: 10, fontWeight: '700', color: C.inkOnLime },
  heroMid: { flex: 1, minWidth: 0 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroName: { fontSize: 19, lineHeight: 24, fontWeight: '700', letterSpacing: -0.45, color: C.ink, flexShrink: 1 },
  heroHandle: { marginTop: 3, fontSize: 11.5, fontWeight: '500', color: C.ink3 },

  xpBlock: {
    marginTop: 12, backgroundColor: C.surface2, borderRadius: 16, padding: 12,
  },
  xpHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  xpTitle: { fontSize: 12.5, fontWeight: '600', color: C.ink, letterSpacing: -0.2 },
  xpNums: { fontSize: 11, fontWeight: '500', color: C.ink3 },
  xpNow: { fontWeight: '700', color: C.brand },
  xpTrack2: {
    marginTop: 8, height: 8, borderRadius: 100,
    backgroundColor: 'rgba(11,110,79,0.12)', overflow: 'hidden',
  },
  xpFill2: { height: '100%', borderRadius: 100, overflow: 'hidden' },
  xpHint: { marginTop: 7, fontSize: 10, fontWeight: '500', color: C.ink4 },

  proWrap: { marginTop: 10, borderRadius: 18, ...glow(C.brand) },
  proBanner: {
    height: 74, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 11,
    overflow: 'hidden', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(232,163,61,0.22)',
  },
  proBloom: {
    position: 'absolute', top: -58, right: -18, width: 150, height: 150,
    borderRadius: 100, backgroundColor: 'rgba(232,163,61,0.16)',
  },
  proRing: {
    position: 'absolute', right: -26, bottom: -64, width: 128, height: 128,
    borderRadius: 100, borderWidth: 1, borderColor: 'rgba(232,163,61,0.18)',
  },
  proEdge: {
    position: 'absolute', top: 0, left: 16, right: 16, height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  proSheen: { position: 'absolute', top: -40, bottom: -40, left: 0, width: 54 },
  proBadge: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.coin, 10, 4, 0.4),
  },
  proSparkA: { position: 'absolute', top: -5, right: -7 },
  proSparkB: { position: 'absolute', bottom: -4, left: -6 },
  proMid: { flex: 1, minWidth: 0 },
  proTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  proTitle: { fontSize: 15.5, lineHeight: 19, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.25 },
  proPill: {
    backgroundColor: 'rgba(232,163,61,0.18)', borderRadius: 7,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  proPillText: { fontSize: 8.5, lineHeight: 11, fontWeight: '800', color: '#F3CB84', letterSpacing: 0.7 },
  proLive: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(126,211,33,0.16)', borderRadius: 7,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  proLiveDot: { width: 5, height: 5, borderRadius: 100, backgroundColor: C.lime },
  proLiveText: { fontSize: 8.5, lineHeight: 11, fontWeight: '700', color: C.lime, letterSpacing: 0.4 },
  proSub: { marginTop: 3, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: 'rgba(223,240,208,0.72)' },
  proCta: {
    flexDirection: 'row', alignItems: 'center', gap: 3, height: 30, flexShrink: 0,
    paddingHorizontal: 10, borderRadius: 11, overflow: 'hidden',
    ...shadow(C.lime, 6, 2, 0.35),
  },
  proCtaText: {
    fontSize: 10.5, lineHeight: 13, fontWeight: '800',
    color: C.inkOnLime, letterSpacing: 0.1,
  },

  bigRow: { marginTop: 10, flexDirection: 'row', gap: 10 },

  card: {
    marginTop: 10, backgroundColor: C.surface, borderRadius: 20,
    padding: 13, borderWidth: 1, borderColor: C.surface2,
    ...shadow('#000', 14, 5, 0.05),
  },
  chartCard: { marginTop: 10 },

  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  secMid: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, lineHeight: 19, fontWeight: '600', color: C.ink, letterSpacing: -0.2 },
  cardSub: { marginTop: 2, fontSize: 11, fontWeight: '500', color: C.ink3 },
  chartIcon: {
    width: 32, height: 32, borderRadius: 100, backgroundColor: C.leafSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  secAction: { fontSize: 11.5, fontWeight: '700', color: C.brand },
  allBtn: { flexDirection: 'row', alignItems: 'center', gap: 1 },

  chartRow: { marginTop: 12, flexDirection: 'row', alignItems: 'flex-start' },
  yAxis: {
    width: 26, height: CH, justifyContent: 'space-between',
    paddingVertical: 5, marginRight: 2,
  },
  yLabel: { fontSize: 9.5, lineHeight: 12, fontWeight: '500', color: C.ink4, textAlign: 'right' },
  xAxis: { marginTop: 6, flexDirection: 'row' },
  xLabel: { flex: 1, fontSize: 10.5, fontWeight: '500', color: C.ink3, textAlign: 'center' },
  xLabelToday: { color: C.ink, fontWeight: '600' },

  legend: {
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEF2EA',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  legendDot: { width: 8, height: 8, borderRadius: 100, backgroundColor: C.brand },
  legendName: { flex: 1, fontSize: 11.5, fontWeight: '600', color: C.ink3 },
  legendValue: { fontSize: 12, fontWeight: '600', color: C.brand },

  badgeRow: { marginTop: 12, flexDirection: 'row' },
  badgeCol: { flex: 1, alignItems: 'center' },
  badge: { width: 50, height: 50, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  badgeTitle: { marginTop: 7, fontSize: 10.5, lineHeight: 14, fontWeight: '600', color: C.ink, textAlign: 'center' },

  btnLime: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  btnLimeText: { fontSize: 13, fontWeight: '600', color: C.inkOnLime },
  btnInk: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: C.brandDeep,
    alignItems: 'center', justifyContent: 'center',
  },
  btnInkText: { fontSize: 13, fontWeight: '600', color: C.mint },
  btnDanger: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: C.danger,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDangerText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  btnSoft: {
    marginTop: 8, height: 44, borderRadius: 14, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  btnSoftText: { fontSize: 13, fontWeight: '600', color: C.ink },

  sheetText: { fontSize: 13, lineHeight: 20, color: C.ink3 },

  themeList: { marginTop: 4 },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: C.line,
  },
  themeLabel: { flex: 1, fontSize: 13.5, fontWeight: '600', color: C.ink },
  pushMsg: { marginTop: 2, fontSize: 11, fontWeight: '500', color: C.ink3 },

  helpList: { marginTop: 4 },
  helpRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    paddingVertical: 10, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: C.line,
  },
  helpKey: { fontSize: 12.5, fontWeight: '600', color: C.ink },
  helpValue: { flex: 1, fontSize: 11.5, fontWeight: '500', color: C.ink3, textAlign: 'right' },

  medalGrid: { marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  medalCell: {
    width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.surface2, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10,
  },
  medalCellIcon: { width: 30, height: 30, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  medalCellMid: { flex: 1, minWidth: 0 },
  medalCellTitle: { fontSize: 12, fontWeight: '600', color: C.ink },
  medalCellHint: { marginTop: 1, fontSize: 11, fontWeight: '500', color: C.ink3 },
})

const makeSt = (C: ThemeColors) => StyleSheet.create({
  headBtn: {
    width: 36, height: 36, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.card,
  },

  bigTile: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.surface, borderRadius: 18, padding: 12,
    borderWidth: 1, borderColor: C.surface2,
    ...shadow('#000', 14, 5, 0.05),
  },
  bigIcon: { width: 38, height: 38, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  bigMid: { flex: 1, minWidth: 0 },
  bigValue: { fontSize: 21, lineHeight: 25, fontWeight: '700', color: C.ink, letterSpacing: -0.5 },
  bigLabel: { marginTop: 2, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: C.ink3 },

  pill: { height: 20, paddingHorizontal: 8, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontSize: 10, fontWeight: '600' },

  noteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    paddingVertical: 11, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: C.line,
  },
  noteLabel: { fontSize: 12.5, fontWeight: '500', color: C.ink3 },
  noteValue: { flex: 1, fontSize: 12.5, fontWeight: '600', color: C.ink, textAlign: 'right' },

  fieldWrap: { marginTop: 10 },
  fieldLabel: { fontSize: 11.5, fontWeight: '600', color: C.ink3 },
  fieldBox: {
    marginTop: 6, height: 46, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface2, borderRadius: 12,
  },
  fieldPrefix: { fontSize: 14, fontWeight: '600', color: C.ink3, marginRight: 2 },
  fieldInput: { flex: 1, fontSize: 14, fontWeight: '600', color: C.ink, padding: 0 },
})

export default ProfileScreen
