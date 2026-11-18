import { useMemo, useState } from 'react'
import {
  Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions,
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
import { TOPICS, shortTitle } from '../data/curriculum'
import { triggerHaptic } from '../lib/haptics'
import { ensurePushToken, sendTestPush, syncPushTokenToBackend } from '../lib/push'
import { useApp } from '../store/useStore'
import { navBottomSpace } from '../components/BottomNav'
import { TopScrim } from '../components/ui'
import Sheet from '../components/Sheet'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { ABS_FILL, C, LIME_BTN_GRAD, NUM, SHADOW, shadow } from '../theme/tokens'

/**
 * Profil — shaxsiy kabinet. Barcha raqamlar store'dan keladi:
 * zanjir, XP, tangalar, aniqlik, o'qish daqiqalari, ochilgan nishonlar.
 */

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const INK = C.ink
const GRAY = C.ink3
const FAINT = C.ink4
const SOFT = C.surface2
const GREEN = C.brand
const DANGER = C.danger
const HAIR = '#F1F4EF'
const AMBER_BG = '#FFE9D6'
const AMBER_INK = '#B4530A'

/** Qahramon panel — to'q marjon gradient */
const PRO_DARK: readonly [string, string, string] = ['#16382A', '#0E241B', '#0A1B14']

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

const MEDAL_TINT: Record<AchIcon, { bg: string; ink: string }> = {
  bolt: { bg: C.mintSoft, ink: GREEN },
  trophy: { bg: C.coinSoft, ink: '#B87A22' },
  grid: { bg: C.xpSoft, ink: C.xp },
  cap: { bg: C.leafSoft, ink: GREEN },
  books: { bg: C.xpSoft, ink: C.xp },
  check: { bg: C.leafSoft, ink: GREEN },
  medal: { bg: C.coinSoft, ink: '#B87A22' },
  star: { bg: C.coinSoft, ink: '#B87A22' },
  gem: { bg: C.violetSoft, ink: C.violet },
  target: { bg: C.dangerSoft, ink: DANGER },
  flame: { bg: AMBER_BG, ink: AMBER_INK },
  brain: { bg: C.xpSoft, ink: C.xp },
  bag: { bg: C.leafSoft, ink: GREEN },
  heart: { bg: C.dangerSoft, ink: DANGER },
  pen: { bg: C.xpSoft, ink: C.xp },
  rocket: { bg: C.coinSoft, ink: '#B87A22' },
  moon: { bg: '#EDEFF5', ink: '#4B5570' },
  compass: { bg: C.leafSoft, ink: GREEN },
  sigma: { bg: C.mintSoft, ink: GREEN },
  crown: { bg: C.coinSoft, ink: '#B87A22' },
}

const LOCKED_TINT = { bg: '#EFF3EC', ink: '#A9B7A3' }

const fmtUz = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()}-${MONTHS_UZ[d.getMonth()]}, ${d.getFullYear()}`
}

const num = (n: number) => n.toLocaleString('en-US')

/** Rangga mos yumshoq soyali karta — Dribbble'dagi gradient karta uslubi */
const glow = (color: string) => ({
  ...SHADOW.card,
  shadowColor: color,
  shadowOpacity: 0.26,
  shadowRadius: 14,
})

const GRAD_AVATAR: readonly [string, string] = ['#1FA35F', '#0B6E4F']

const CH = 100

/** Haftalik daqiqalar chizig'i — barcha nuqtalar haqiqiy `studyMinutes` dan */
const WeekChart = ({ mins, width, todayIdx }: { mins: number[]; width: number; todayIdx: number }) => {
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
          stroke="#EAF0E5" strokeWidth={1}
        />
      ))}
      {!!area && <Path d={area} fill={GREEN} fillOpacity={0.09} />}
      <Polyline
        points={line} fill="none" stroke={GREEN} strokeWidth={2.5}
        strokeLinejoin="round" strokeLinecap="round"
      />
      {mins.map((m, i) => (
        <Circle
          key={i}
          cx={xAt(i)} cy={yAt(m)} r={i === todayIdx ? 5.5 : 4.5}
          fill="#FFFFFF" stroke={GREEN} strokeWidth={2.5}
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
  const [certOpen, setCertOpen] = useState(false)
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
  const topicTests = useApp(s => s.topicTests)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const answeredTotal = useApp(s => s.answeredTotal)
  const answeredCorrect = useApp(s => s.answeredCorrect)
  const xp = useApp(s => s.xp)
  const level = useApp(s => s.level)
  const coin = useApp(s => s.coin)
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

  /** Marralar — mavzu yakuniy testlari (haqiqiy natijalar) */
  const marbles = TOPICS.slice(0, 4).map(t => ({ num: t.meta.num, test: topicTests[t.meta.num] }))

  const totalStudyMin = Object.values(studyMinutes).reduce((a, b) => a + b, 0)

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
              ink={INK}
              onPress={() => { triggerHaptic('light'); setBellOpen(true) }}
            />
            <HeadBtn
              icon="cog-outline"
              label="Sozlamalar"
              tint="#FFFFFF"
              ink={INK}
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
                <MCI name="pencil-outline" size={12} color={GRAY} />
              </Pressable>
              <Text numberOfLines={1} style={p.heroHandle}>
                {identity || "Profil to'ldirilmagan"}
              </Text>
            </View>
          </View>

          <View style={p.xpBlock}>
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

          <View style={p.statRow}>
            <View style={p.statCell}>
              <View style={[p.statIcon, { backgroundColor: C.xpSoft }]}>
                <MCI name="lightning-bolt" size={16} color={C.xp} />
              </View>
              <Text numberOfLines={1} style={[p.statValue, NUM]}>{num(xp)}</Text>
              <Text style={p.statLabel}>XP</Text>
            </View>
            <View style={p.statSep} />
            <View style={p.statCell}>
              <View style={[p.statIcon, { backgroundColor: C.coinSoft }]}>
                <MCI name="circle-multiple-outline" size={16} color="#B87A22" />
              </View>
              <Text numberOfLines={1} style={[p.statValue, NUM]}>{num(coin)}</Text>
              <Text style={p.statLabel}>Tangalar</Text>
            </View>
            <View style={p.statSep} />
            <View style={p.statCell}>
              <View style={[p.statIcon, { backgroundColor: C.leafSoft }]}>
                <MCI name="bullseye-arrow" size={16} color={GREEN} />
              </View>
              <Text numberOfLines={1} style={[p.statValue, NUM]}>
                {answeredTotal > 0 ? `${accuracy}%` : '—'}
              </Text>
              <Text style={p.statLabel}>Aniqlik</Text>
            </View>
          </View>
        </View>

        {/* ── 3. Pro banner — to'q premium ── */}
        <Pressable
          onPress={() => {
            triggerHaptic(proActive ? 'light' : 'medium')
            navigation.navigate('Pro')
          }}
          style={({ pressed }) => [p.proWrap, pressed && { opacity: 0.92 }]}
        >
          <LinearGradient
            colors={PRO_DARK}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={p.proBanner}
          >
            <View style={p.proGlow} />
            <View style={p.proShine} />
            <View style={p.proIcon}>
              <MCI name="crown-outline" size={19} color={C.inkOnLime} />
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
                  ? `${planLabel}${proExpires ? ` · ${fmtUz(proExpires)}` : ''}`
                  : "Barcha mashq to'plamlari ochiq"}
              </Text>
            </View>
            <View style={p.proGo}>
              <MCI name="chevron-right" size={16} color={C.inkOnLime} />
            </View>
          </LinearGradient>
        </Pressable>

        {/* ── 4. Katta kafellar ── */}
        <View style={p.bigRow}>
          <BigTile
            icon="puzzle-outline"
            tint={C.leafSoft}
            ink={GREEN}
            glowC={GREEN}
            value={`${solvedCount}`}
            label="Yechildi masalalar"
          />
          <BigTile
            icon="book-open-variant"
            tint={AMBER_BG}
            ink={AMBER_INK}
            glowC="#E8A33D"
            value={`${lessonsDone}`}
            label="Yakunlangan darslar"
          />
        </View>

        {/* ── 5. Ko'rsatkichlar ── */}
        <View style={p.metricRow}>
          <Metric icon="clock-outline" tint={C.xpSoft} ink={C.xp} glowC={C.xp} value={`${totalStudyMin} min`} label="O'qish vaqti" />
          <Metric icon="fire" tint={C.dangerSoft} ink={DANGER} glowC={DANGER} value={`${streak} kun`} label="Joriy seriya" />
        </View>
        <View style={p.metricRow}>
          <Metric icon="fire" tint={C.violetSoft} ink={C.violet} glowC={C.violet} value={`${best} kun`} label="Eng uzun seriya" />
          <Metric icon="head-lightbulb-outline" tint={C.mintSoft} ink={GREEN} glowC={GREEN} value={`${solvedToday}`} label="Kunlik masala" />
        </View>

        {/* ── 6. Haftalik faollik ── */}
        <View style={[p.card, p.chartCard]}>
          <View style={p.secHead}>
            <View style={p.secMid}>
              <Text style={p.cardTitle}>Haftalik faollik</Text>
              <Text style={p.cardSub}>Hafta davomidagi o&apos;qish vaqti</Text>
            </View>
            <View style={p.chartIcon}>
              <MCI name="chart-line" size={16} color={GREEN} />
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

        {/* ── 7. Nishonlar ── */}
        <View style={p.card}>
          <View style={p.secHead}>
            <Text style={p.cardTitle}>Nishonlar</Text>
            <Pressable
              onPress={() => { triggerHaptic('light'); setAllOpen(true) }}
              hitSlop={12}
              style={({ pressed }) => [p.allBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={p.secAction}>Barchasi</Text>
              <MCI name="chevron-right" size={13} color={GRAY} />
            </Pressable>
          </View>

          <View style={p.badgeRow}>
            {badges.map(m => {
              const on = unlockedIds.has(m.id)
              const tint = on ? MEDAL_TINT[m.icon] : LOCKED_TINT
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

        {/* ── 8. Marralar ── */}
        <View style={p.card}>
          <View style={p.secHead}>
            <Text style={p.cardTitle}>Marralar</Text>
            <Pressable
              onPress={() => { triggerHaptic('light'); setCertOpen(true) }}
              hitSlop={12}
              style={({ pressed }) => [p.allBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={p.secAction}>Barchasi</Text>
              <MCI name="chevron-right" size={13} color={GRAY} />
            </Pressable>
          </View>

          <View style={p.badgeRow}>
            {marbles.map(({ num: n, test }) => {
              const on = !!test
              return (
                <View key={n} style={p.badgeCol}>
                  <View
                    style={[
                      p.marble,
                      {
                        borderColor: on ? GREEN : '#E4EAE0',
                        backgroundColor: on ? C.leafSoft : '#F4F7F1',
                      },
                      on && glow(GREEN),
                    ]}
                  >
                    {test ? (
                      <Text style={[p.marbleScore, NUM]}>{test.score}/{test.total}</Text>
                    ) : (
                      <MCI name="lock-outline" size={15} color="#A9B7A3" />
                    )}
                  </View>
                  <Text style={p.marbleLabel}>{n}-mavzu</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* ── 9. Pastki izoh ── */}
        <View style={p.footer}>
          <Text style={p.footerTitle}>HDP Academy 1.0.0</Text>
          <Text style={p.footerSub}>Matematika o&apos;quv platformasi</Text>
        </View>
      </ScrollView>

      {/* Status bar zonasi — kontent shu chegara ostidan o'tadi */}
      <TopScrim height={insets.top} colors={['#FFFFFF', '#FFFFFF']} line="rgba(14,26,18,0.06)" />

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

      {/* ── Varaqa: natijalar ── */}
      <Sheet
        open={certOpen}
        onClose={() => setCertOpen(false)}
        title="Natijalar"
        subtitle="Har bir mavzu yakuniy testining natijasi shu yerda saqlanadi."
      >
        {TOPICS.every(t => !topicTests[t.meta.num]) ? (
          <Text style={p.sheetText}>
            Hozircha natija yo&apos;q. Har mavzu oxiridagi yakuniy testni tugating —
            natija shu yerda paydo bo&apos;ladi.
          </Text>
        ) : (
          TOPICS.filter(t => topicTests[t.meta.num]).map(t => {
            const test = topicTests[t.meta.num]
            return (
              <View key={t.meta.num} style={p.certRow}>
                <View style={p.certTile}>
                  <MCI name="school-outline" size={16} color={GREEN} />
                </View>
                <View style={p.certMid}>
                  <Text numberOfLines={1} style={p.certTitle}>
                    Mavzu {t.meta.num} · {shortTitle(t.meta.title)}
                  </Text>
                  <Text style={p.certScore}>
                    {test.score}/{test.total} to&apos;g&apos;ri
                  </Text>
                </View>
                <MCI name="check-circle-outline" size={19} color={GREEN} />
              </View>
            )
          })
        )}
        <Text style={p.sheetFoot}>
          Natijalar shu qurilmadagi profilingizda saqlanadi.
        </Text>
      </Sheet>

      {/* ── Varaqa: sozlamalar ── */}
      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Sozlamalar">
        <Text style={p.sheetText}>Ko&apos;rinish va ilova qoidalari.</Text>
        <View style={p.themeList}>
          {([
            { key: 'light' as const, label: "Yorug' (Toza Oq rejim)", icon: 'weather-sunny' as const, ready: true },
            { key: 'dark' as const, label: "Qorong'u (Tun rejimi)", icon: 'moon-waning-crescent' as const, ready: false },
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
                  pressed && o.ready && { backgroundColor: '#FAFCF8' },
                ]}
              >
                <MCI name={o.icon} size={17} color={active ? GREEN : GRAY} />
                <Text style={p.themeLabel}>{o.label}</Text>
                {!o.ready && <Pill label="Tez orada" bg="#EDEFF5" ink={GRAY} />}
                {o.ready && (
                  <MCI
                    name={active ? 'radiobox-marked' : 'radiobox-blank'}
                    size={18}
                    color={active ? GREEN : '#C9D3C4'}
                  />
                )}
              </Pressable>
            )
          })}
        </View>

        {/* ── Bildirishnomalar ── */}
        <View style={p.themeList}>
          <Pressable onPress={() => void toggleNotif()} style={({ pressed }) => [p.themeRow, pressed && { backgroundColor: '#FAFCF8' }]}>
            <MCI name={notifOn ? 'bell-ring-outline' : 'bell-off-outline'} size={17} color={notifOn ? GREEN : GRAY} />
            <Text style={p.themeLabel}>Push bildirishnomalar</Text>
            <MCI
              name={notifOn ? 'radiobox-marked' : 'radiobox-blank'}
              size={18}
              color={notifOn ? GREEN : '#C9D3C4'}
            />
          </Pressable>
          <Pressable
            onPress={() => void testPush()}
            disabled={pushBusy}
            style={({ pressed }) => [p.themeRow, (pressed || pushBusy) && { opacity: 0.6 }]}
          >
            <MCI name="send-outline" size={17} color={GREEN} />
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
            const tint = on ? MEDAL_TINT[a.icon] : LOCKED_TINT
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
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityLabel={label}
    style={({ pressed }) => [st.headBtn, { backgroundColor: tint }, pressed && { opacity: 0.6 }]}
  >
    <MCI name={icon} size={17} color={ink} />
  </Pressable>
)

const BigTile = ({
  icon, tint, ink, glowC, value, label,
}: {
  icon: keyof typeof MCI.glyphMap
  tint: string
  ink: string
  glowC: string
  value: string
  label: string
}) => (
  <View style={[st.bigTile, glow(glowC)]}>
    <View style={[st.bigIcon, { backgroundColor: tint }]}>
      <MCI name={icon} size={19} color={ink} />
    </View>
    <View style={st.bigMid}>
      <Text numberOfLines={1} style={[st.bigValue, NUM]}>{value}</Text>
      <Text numberOfLines={2} style={st.bigLabel}>{label}</Text>
    </View>
  </View>
)

const Metric = ({
  icon, tint, ink, glowC, value, label,
}: {
  icon: keyof typeof MCI.glyphMap
  tint: string
  ink: string
  glowC: string
  value: string
  label: string
}) => (
  <View style={[st.metric, glow(glowC)]}>
    <View style={[st.metricIcon, { backgroundColor: tint }]}>
      <MCI name={icon} size={16} color={ink} />
    </View>
    <View style={st.metricMid}>
      <Text numberOfLines={1} style={[st.metricValue, NUM]}>{value}</Text>
      <Text numberOfLines={1} style={st.metricLabel}>{label}</Text>
    </View>
  </View>
)

const Pill = ({ label, bg, ink }: { label: string; bg: string; ink: string }) => (
  <View style={[st.pill, { backgroundColor: bg }]}>
    <Text style={[st.pillText, { color: ink }]}>{label}</Text>
  </View>
)

const Note = ({ label, value }: { label: string; value: string }) => (
  <View style={st.noteRow}>
    <Text style={st.noteLabel}>{label}</Text>
    <Text style={st.noteValue}>{value}</Text>
  </View>
)

const Field = ({
  label, value, onChange, placeholder, prefix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  prefix?: string
}) => (
  <View style={st.fieldWrap}>
    <Text style={st.fieldLabel}>{label}</Text>
    <View style={st.fieldBox}>
      {!!prefix && <Text style={st.fieldPrefix}>{prefix}</Text>}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={FAINT}
        style={st.fieldInput}
      />
    </View>
  </View>
)

const p = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 16 },

  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h1: { fontSize: 22, lineHeight: 28, fontWeight: '600', letterSpacing: -0.5, color: INK },
  headBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  heroCard: {
    marginTop: 22, backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: 16, ...SHADOW.card,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 76, height: 76, borderRadius: 100, backgroundColor: SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInner: { width: 68, height: 68, borderRadius: 100, overflow: 'hidden' },
  avatarImg: { width: 68, height: 68 },
  avatarText: { fontSize: 24, fontWeight: '600', color: '#FFFFFF', letterSpacing: -0.6 },
  lvlDot: {
    position: 'absolute', right: -2, bottom: -2, minWidth: 22, height: 22,
    paddingHorizontal: 5, borderRadius: 100, backgroundColor: C.lime,
    borderWidth: 2.5, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    ...shadow('#5FAF22', 4, 2, 0.35),
  },
  lvlDotText: { fontSize: 10, fontWeight: '700', color: C.inkOnLime },
  heroMid: { flex: 1, minWidth: 0 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroName: { fontSize: 19, lineHeight: 24, fontWeight: '600', letterSpacing: -0.3, color: INK, flexShrink: 1 },
  heroHandle: { marginTop: 3, fontSize: 11.5, fontWeight: '500', color: GRAY },

  xpBlock: {
    marginTop: 16, backgroundColor: SOFT, borderRadius: 16, padding: 12,
  },
  xpHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  xpTitle: { fontSize: 12.5, fontWeight: '600', color: INK, letterSpacing: -0.2 },
  xpNums: { fontSize: 11, fontWeight: '500', color: GRAY },
  xpNow: { fontWeight: '700', color: GREEN },
  xpTrack2: {
    marginTop: 8, height: 8, borderRadius: 100,
    backgroundColor: 'rgba(11,110,79,0.12)', overflow: 'hidden',
  },
  xpFill2: { height: '100%', borderRadius: 100, overflow: 'hidden' },
  xpHint: { marginTop: 7, fontSize: 10, fontWeight: '500', color: FAINT },

  statRow: {
    marginTop: 14, flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: HAIR, paddingTop: 14,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: {
    width: 34, height: 34, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: 15, lineHeight: 18, fontWeight: '600', color: INK, letterSpacing: -0.2 },
  statLabel: { fontSize: 10, fontWeight: '500', color: GRAY },
  statSep: { width: 1, height: 40, backgroundColor: HAIR },

  proWrap: { marginTop: 12, borderRadius: 20, ...glow('#0B6E4F') },
  proBanner: {
    height: 64, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 11,
    overflow: 'hidden', borderRadius: 20,
  },
  proGlow: {
    position: 'absolute', top: -45, right: 30, width: 130, height: 130,
    borderRadius: 100, backgroundColor: 'rgba(126,211,33,0.22)',
  },
  proShine: {
    position: 'absolute', bottom: -55, left: 60, width: 120, height: 120,
    borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)',
  },
  proIcon: {
    width: 38, height: 38, borderRadius: 100, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
    ...shadow('#7ED321', 8, 3, 0.45),
  },
  proMid: { flex: 1, minWidth: 0 },
  proTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  proTitle: { fontSize: 14.5, lineHeight: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 },
  proPill: {
    backgroundColor: 'rgba(126,211,33,0.2)', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  proPillText: { fontSize: 8.5, fontWeight: '800', color: C.lime, letterSpacing: 0.6 },
  proLive: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(126,211,33,0.18)', borderRadius: 100,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  proLiveDot: { width: 5, height: 5, borderRadius: 100, backgroundColor: C.lime },
  proLiveText: { fontSize: 8.5, fontWeight: '700', color: C.lime, letterSpacing: 0.4 },
  proSub: { marginTop: 3, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: 'rgba(205,233,174,0.78)' },
  proGo: {
    width: 28, height: 28, borderRadius: 100, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
    ...shadow('#7ED321', 6, 2, 0.4),
  },

  bigRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
  metricRow: { marginTop: 10, flexDirection: 'row', gap: 10 },

  card: {
    marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 14, ...SHADOW.card,
  },
  chartCard: { marginTop: 12 },

  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  secMid: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 15, lineHeight: 19, fontWeight: '600', color: INK, letterSpacing: -0.2 },
  cardSub: { marginTop: 2, fontSize: 11, fontWeight: '500', color: GRAY },
  chartIcon: {
    width: 32, height: 32, borderRadius: 100, backgroundColor: C.leafSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  secAction: { fontSize: 11.5, fontWeight: '600', color: GRAY },
  allBtn: { flexDirection: 'row', alignItems: 'center', gap: 1 },

  chartRow: { marginTop: 14, flexDirection: 'row', alignItems: 'flex-start' },
  yAxis: {
    width: 26, height: CH, justifyContent: 'space-between',
    paddingVertical: 5, marginRight: 2,
  },
  yLabel: { fontSize: 9.5, lineHeight: 12, fontWeight: '500', color: FAINT, textAlign: 'right' },
  xAxis: { marginTop: 6, flexDirection: 'row' },
  xLabel: { flex: 1, fontSize: 10.5, fontWeight: '500', color: GRAY, textAlign: 'center' },
  xLabelToday: { color: INK, fontWeight: '600' },

  legend: {
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEF2EA',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  legendDot: { width: 8, height: 8, borderRadius: 100, backgroundColor: GREEN },
  legendName: { flex: 1, fontSize: 11.5, fontWeight: '600', color: GRAY },
  legendValue: { fontSize: 12, fontWeight: '600', color: GREEN },

  badgeRow: { marginTop: 14, flexDirection: 'row' },
  badgeCol: { flex: 1, alignItems: 'center' },
  badge: { width: 54, height: 54, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  badgeTitle: { marginTop: 8, fontSize: 10.5, lineHeight: 14, fontWeight: '600', color: INK, textAlign: 'center' },
  marble: { width: 54, height: 54, borderRadius: 100, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  marbleScore: { fontSize: 12, fontWeight: '600', color: GREEN },
  marbleLabel: { marginTop: 8, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: GRAY, textAlign: 'center' },

  footer: { marginTop: 24, alignItems: 'center', paddingBottom: 4 },
  footerTitle: { fontSize: 11.5, fontWeight: '500', color: GRAY, textAlign: 'center' },
  footerSub: { marginTop: 2, fontSize: 10.5, fontWeight: '500', color: FAINT, textAlign: 'center' },

  btnLime: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  btnLimeText: { fontSize: 13, fontWeight: '600', color: C.inkOnLime },
  btnInk: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: INK,
    alignItems: 'center', justifyContent: 'center',
  },
  btnInkText: { fontSize: 13, fontWeight: '600', color: C.mint },
  btnDanger: {
    marginTop: 16, height: 46, borderRadius: 14, backgroundColor: DANGER,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDangerText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  btnSoft: {
    marginTop: 8, height: 44, borderRadius: 14, backgroundColor: SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  btnSoftText: { fontSize: 13, fontWeight: '600', color: INK },

  sheetText: { fontSize: 13, lineHeight: 20, color: GRAY },
  sheetFoot: { marginTop: 12, fontSize: 11.5, lineHeight: 17, color: FAINT },
  certRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  certTile: { width: 34, height: 34, borderRadius: 100, backgroundColor: SOFT, alignItems: 'center', justifyContent: 'center' },
  certMid: { flex: 1, minWidth: 0 },
  certTitle: { fontSize: 13, fontWeight: '600', color: INK },
  certScore: { marginTop: 2, fontSize: 11, fontWeight: '500', color: GRAY },

  themeList: { marginTop: 4 },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  themeLabel: { flex: 1, fontSize: 13.5, fontWeight: '600', color: INK },
  pushMsg: { marginTop: 2, fontSize: 11, fontWeight: '500', color: GRAY },

  helpList: { marginTop: 4 },
  helpRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    paddingVertical: 10, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  helpKey: { fontSize: 12.5, fontWeight: '600', color: INK },
  helpValue: { flex: 1, fontSize: 11.5, fontWeight: '500', color: GRAY, textAlign: 'right' },

  medalGrid: { marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  medalCell: {
    width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: SOFT, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10,
  },
  medalCellIcon: { width: 30, height: 30, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  medalCellMid: { flex: 1, minWidth: 0 },
  medalCellTitle: { fontSize: 12, fontWeight: '600', color: INK },
  medalCellHint: { marginTop: 1, fontSize: 11, fontWeight: '500', color: GRAY },
})

const st = StyleSheet.create({
  headBtn: {
    width: 36, height: 36, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.card,
  },

  bigTile: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14,
  },
  bigIcon: { width: 42, height: 42, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  bigMid: { flex: 1, minWidth: 0 },
  bigValue: { fontSize: 22, lineHeight: 26, fontWeight: '600', color: INK, letterSpacing: -0.5 },
  bigLabel: { marginTop: 2, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: GRAY },

  metric: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12,
  },
  metricIcon: { width: 36, height: 36, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  metricMid: { flex: 1, minWidth: 0 },
  metricValue: { fontSize: 15.5, lineHeight: 19, fontWeight: '600', color: INK, letterSpacing: -0.2 },
  metricLabel: { marginTop: 1, fontSize: 10, fontWeight: '500', color: GRAY },

  pill: { height: 20, paddingHorizontal: 8, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontSize: 10, fontWeight: '600' },

  noteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    paddingVertical: 11, paddingHorizontal: 2,
    borderBottomWidth: 1, borderBottomColor: HAIR,
  },
  noteLabel: { fontSize: 12.5, fontWeight: '500', color: GRAY },
  noteValue: { flex: 1, fontSize: 12.5, fontWeight: '600', color: INK, textAlign: 'right' },

  fieldWrap: { marginTop: 10 },
  fieldLabel: { fontSize: 11.5, fontWeight: '600', color: GRAY },
  fieldBox: {
    marginTop: 6, height: 46, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    backgroundColor: SOFT, borderRadius: 12,
  },
  fieldPrefix: { fontSize: 14, fontWeight: '600', color: GRAY, marginRight: 2 },
  fieldInput: { flex: 1, fontSize: 14, fontWeight: '600', color: INK, padding: 0 },
})

export default ProfileScreen
