import { useEffect, useState } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { BrandMark } from '../components/Brand'
import { GridPaper } from '../components/GridPaper'
import { Reveal } from '../components/Reveal'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import type { TabKey } from '../components/BottomNav'
import type { NoParamRoute, RootStackParamList } from '../navigation/types'
import { C, NUM, R, T, shadow } from '../theme/tokens'

type Nav = NativeStackNavigationProp<RootStackParamList>

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' }) as string

const sectionTitle: TextStyle = { ...T.h3, color: C.ink }

const WHITE_CARD: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderColor: '#E3E8DE',
  borderWidth: 1,
  ...shadow('#1C3214', 5, 2, 0.04),
}

/* Kurslar — palitramizning ton zinapoyasi: emerald → siyoh → leaf → lime */
type Grad = readonly [string, string, ...string[]]

const COURSES: { name: string; colors: Grad; fg: string; sh: string }[] = [
  { name: 'Algebra-1', colors: ['#1B9A6B', '#0B6E4F'], fg: '#FFFFFF', sh: 'rgba(11,110,79,0.16)' },
  { name: 'Geometriya', colors: ['#33452F', '#0E1A12'], fg: '#FFFFFF', sh: 'rgba(14,26,18,0.16)' },
  { name: 'Algebra-2', colors: ['#4CC16F', '#1B9A6B'], fg: '#FFFFFF', sh: 'rgba(76,193,111,0.18)' },
  { name: 'Stereometriya', colors: ['#9BE04B', '#5FAF22'], fg: '#1C3214', sh: 'rgba(95,175,34,0.26)' },
]

const GRAD_PRIMARY: Grad = ['#9BE04B', '#5FAF22']
const GRAD_LOCKED: Grad = ['#F6D8A6', '#E8A33D']
const GRAD_WHITE: Grad = ['#FFFFFF', '#FFFFFF']

const QUICK = [
  {
    icon: 'game-controller' as const,
    iconBg: '#DDF3DC',
    iconFg: '#0B6E4F',
    name: 'Blitz Duel',
    desc: '1v1 · 3 daqiqa',
    coin: 30,
    route: 'Blitz' as const,
  },
  {
    icon: 'flame' as const,
    iconBg: '#FCF1DC',
    iconFg: '#E8A33D',
    name: 'Streak Seriya',
    desc: '2x bonus · 10 ta',
    coin: 100,
    route: 'Problems' as const,
  },
]

type CtaKind = 'primary' | 'ghost' | 'locked'

type Row = {
  icon: keyof typeof Ionicons.glyphMap
  iconBg: string
  iconFg: string
  title: string
  level: string
  cat: string
  coin: number
  xp: number | null
  cta: string
  route: NoParamRoute
  kind: CtaKind
}

const PROBLEMS: Row[] = [
  {
    icon: 'calculator',
    iconBg: '#DDF3DC',
    iconFg: '#0B6E4F',
    title: 'Viyet teoremasi',
    level: 'Oson',
    cat: 'Algebra',
    coin: 15,
    xp: 25,
    cta: 'Yechish',
    route: 'Problems',
    kind: 'primary',
  },
  {
    icon: 'triangle',
    iconBg: '#EFF2EC',
    iconFg: '#6B7C66',
    title: 'Uchburchak medianasi',
    level: "O'rta",
    cat: 'Geometriya',
    coin: 25,
    xp: 40,
    cta: "Ko'rish",
    route: 'Problems',
    kind: 'ghost',
  },
  {
    icon: 'lock-closed',
    iconBg: '#FCF1DC',
    iconFg: '#E8A33D',
    title: 'Trigonometrik tengsizliklar',
    level: 'Qiyin',
    cat: 'IMO',
    coin: 60,
    xp: null,
    cta: '200 coin',
    route: 'Shop',
    kind: 'locked',
  },
]

/** Kunlik masala — yarim tungi yangilanishgacha qolgan vaqt */
const leftUntilMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

const pad = (n: number) => String(n).padStart(2, '0')

const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

const num = (n: number) => n.toLocaleString('en-US')

/** Kichik gradient pill (asosiy/locked CTA) — ichki oq chiziq bilan hajm beriladi */
const GradPill = ({
  children,
  colors,
  height = 34,
  onPress,
  glow,
}: {
  children: React.ReactNode
  colors?: Grad
  height?: number
  onPress?: () => void
  glow?: string
}) => {
  const body = (
    <LinearGradient
      colors={colors ?? GRAD_WHITE}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.pill,
        { height, backgroundColor: colors ? undefined : '#FFFFFF' },
        !colors && { borderColor: '#E4E9DD', borderWidth: 1 },
        glow ? shadow(glow, 7, 6, 0.32) : null,
      ]}
    >
      {children}
    </LinearGradient>
  )
  if (!onPress) return body
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}>
      {body}
    </Pressable>
  )
}

const HomeScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()

  const name = useApp(s => s.name)
  const coin = useApp(s => s.coin)
  const xp = useApp(s => s.xp)

  const [remain, setRemain] = useState(leftUntilMidnight)
  useEffect(() => {
    const t = setInterval(() => setRemain(leftUntilMidnight()), 1000)
    return () => clearInterval(t)
  }, [])

  const go = (route: NoParamRoute) => {
    triggerHaptic('medium')
    navigation.navigate(route)
  }

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const onTab = (key: TabKey) => {
    if (key === 'home') return
    navigation.navigate(key === 'problems' ? 'Problems' : key === 'shop' ? 'Shop' : 'Profile')
  }

  return (
    <LinearGradient
      colors={['#CDE9AE', '#E6F5D2', '#F7FCED']}
      locations={[0, 0.4, 0.76]}
      style={styles.screen}
    >
      <GridPaper band={300} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── 1. Header ── */}
        <Reveal delay={0} y={12} duration={240}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Profile')
              }}
              style={({ pressed }) => [styles.brandRow, pressed && { opacity: 0.7 }]}
            >
              <BrandMark size={30} />
              <Text style={styles.brandText}>HDP Academy</Text>
            </Pressable>

            <View style={styles.headerRight}>
              <Pressable
                onPress={() => triggerHaptic('light')}
                accessibilityLabel="Bildirishnomalar"
                style={({ pressed }) => [styles.bell, pressed && { transform: [{ scale: 0.95 }] }]}
              >
                <Ionicons name="notifications-outline" size={18} color={C.ink2} />
              </Pressable>

              <Pressable
                onPress={() => go('Profile')}
                accessibilityLabel="Profil"
                style={({ pressed }) => [styles.avatarWrap, pressed && { transform: [{ scale: 0.95 }] }]}
              >
                <LinearGradient
                  colors={['#9BE04B', '#5FAF22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* ── Demo holat — ko'rinib turadigan joyda ── */}
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={13} color="#A9741A" style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Bu ilova bir kunda qilindi — shuning uchun xatolari bor, dizayni yaxshi emas va real
              appdan farqi katta. <Text style={styles.noticeStrong}>Real appda bu muammolar bo'lmaydi.</Text>
            </Text>
          </View>

          {/* Coin / XP pill'lari */}
          <View style={styles.walletRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Shop')
              }}
              style={({ pressed }) => [styles.coinPill, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <Ionicons name="cash" size={14} color="#E8A33D" />
              <Text style={[styles.coinText, NUM]}>{num(coin)} Coin</Text>
            </Pressable>

            <View style={styles.xpPill}>
              <Ionicons name="flash" size={14} color="#4C7DF0" />
              <Text style={[styles.xpText, NUM]}>{num(xp)} XP</Text>
            </View>
          </View>
        </Reveal>

        {/* ── 2. Kunlik mega masala ── */}
        <Reveal delay={40} y={12} duration={240} style={styles.section}>
          <LinearGradient
            colors={['#063F2E', '#0B6E4F', '#1B9A6B']}
            locations={[0, 0.58, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.72, y: 1 }}
            style={[styles.daily, shadow('#063F2E', 16, 14, 0.26)]}
          >
            <View style={styles.dailyTop}>
              <View style={styles.dailyBadge}>
                <Text style={styles.dailyBadgeText}>KUNLIK MASALA</Text>
              </View>
              <Text style={[styles.dailyClock, NUM]}>{clock(remain)}</Text>
            </View>

            <Text style={styles.dailyCat}>DTM / IMO</Text>
            <Text style={styles.dailyTitle}>Parametrli tenglama</Text>
            <Text style={[styles.dailyFormula, { fontFamily: MONO }]}>f(x) = x² − 2ax + a + 6 = 0</Text>

            <View style={styles.dailyBottom}>
              <View style={styles.dailyRewards}>
                <View style={styles.dailyCoin}>
                  <Ionicons name="cash" size={12} color="#F3C88A" />
                  <Text style={[styles.dailyCoinText, NUM]}>+50 coin</Text>
                </View>
                <View style={styles.dailyXp}>
                  <Ionicons name="flash" size={12} color="#AEEA5C" />
                  <Text style={[styles.dailyXpText, NUM]}>+80 XP</Text>
                </View>
              </View>

              <Pressable
                onPress={() => go('Problems')}
                style={({ pressed }) => [styles.dailyCta, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                <Text style={styles.dailyCtaText}>Yechish</Text>
                <Ionicons name="chevron-forward" size={15} color={C.ink} />
              </Pressable>
            </View>
          </LinearGradient>
        </Reveal>

        {/* ── 3. Kurslar (2x2) ── */}
        <Reveal delay={80} y={12} duration={240} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={sectionTitle}>Kurslar</Text>
            <Pressable
              onPress={() => go('Courses')}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.seeAllText}>Hammasi</Text>
              <Ionicons name="chevron-forward" size={13} color={C.brand} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {COURSES.map(c => (
              <Pressable
                key={c.name}
                onPress={() => go('Courses')}
                style={({ pressed }) => [
                  styles.courseCard,
                  shadow(c.sh, 10, 8, 0.16),
                  pressed && { transform: [{ scale: 0.975 }] },
                ]}
              >
                <LinearGradient
                  colors={c.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.courseHead}
                >
                  <Text style={[styles.courseName, { color: c.fg }]}>{c.name}</Text>
                </LinearGradient>
                <View style={styles.courseBody}>
                  <Text style={styles.courseSub} numberOfLines={1}>
                    {c.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Reveal>

        {/* ── 4. Tezkor mashqlar ── */}
        <Reveal delay={110} y={12} duration={240} style={styles.section}>
          <Text style={[sectionTitle, styles.quickTitle]}>Tezkor Mashqlar</Text>

          <View style={styles.grid}>
            {QUICK.map(q => (
              <Pressable
                key={q.name}
                onPress={() => go(q.route)}
                style={({ pressed }) => [WHITE_CARD, styles.quickCard, pressed && { transform: [{ scale: 0.975 }] }]}
              >
                <View style={[styles.quickIcon, { backgroundColor: q.iconBg }]}>
                  <Ionicons name={q.icon} size={18} color={q.iconFg} />
                </View>
                <Text style={styles.quickName}>{q.name}</Text>
                <Text style={styles.quickDesc}>{q.desc}</Text>

                <View style={styles.quickBottom}>
                  <View style={styles.quickReward}>
                    <Ionicons name="cash" size={12} color="#E8A33D" />
                    <Text style={[styles.quickCoin, NUM]}>+{q.coin} coin</Text>
                  </View>
                  <LinearGradient
                    colors={['#9BE04B', '#5FAF22']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.6, y: 1 }}
                    style={[styles.playDot, shadow('#5FAF22', 7, 6, 0.34)]}
                  >
                    <Ionicons name="play" size={13} color="#1C3214" />
                  </LinearGradient>
                </View>
              </Pressable>
            ))}
          </View>
        </Reveal>

        {/* ── 5. Mavzuli masalalar ── */}
        <Reveal delay={140} y={12} duration={240} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={sectionTitle}>Masalalar</Text>
            <Pressable
              onPress={() => go('Problems')}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.seeAllText}>Hammasi</Text>
              <Ionicons name="chevron-forward" size={13} color={C.brand} />
            </Pressable>
          </View>

          <View style={styles.rows}>
            {PROBLEMS.map(p => (
              <View key={p.title} style={[WHITE_CARD, styles.problemRow]}>
                <View style={[styles.problemIcon, { backgroundColor: p.iconBg }]}>
                  <Ionicons name={p.icon} size={p.icon === 'lock-closed' ? 16 : 17} color={p.iconFg} />
                </View>

                <View style={styles.problemBody}>
                  <Text style={styles.problemTitle}>{p.title}</Text>
                  <Text style={styles.problemMeta}>
                    <Text style={styles.metaLevel}>{p.level}</Text>
                    <Text style={styles.metaDim}>{' · ' + p.cat + ' · '}</Text>
                    <Text style={[styles.metaCoin, NUM]}>+{p.coin} coin</Text>
                    {p.xp !== null && (
                      <>
                        <Text style={styles.metaDim}> · </Text>
                        <Text style={[styles.metaXp, NUM]}>+{p.xp} XP</Text>
                      </>
                    )}
                  </Text>
                </View>

                <GradPill
                  height={34}
                  onPress={() => go(p.route)}
                  colors={p.kind === 'primary' ? GRAD_PRIMARY : p.kind === 'locked' ? GRAD_LOCKED : undefined}
                  glow={p.kind === 'ghost' ? undefined : p.kind === 'locked' ? '#E8A33D' : '#5FAF22'}
                >
                  {p.kind === 'locked' && <Ionicons name="lock-closed" size={11} color={C.ink} />}
                  <Text style={[styles.ctaText, { color: p.kind === 'ghost' ? '#33452F' : p.kind === 'locked' ? C.ink : C.inkOnLime }, NUM]}>
                    {p.cta}
                  </Text>
                </GradPill>
              </View>
            ))}
          </View>
        </Reveal>
      </ScrollView>

      <BottomNav active="home" onSelect={onTab} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { fontFamily: 'Georgia', fontSize: 19, color: C.brandDeep, lineHeight: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
  },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, ...shadow('#5FAF22', 8, 6, 0.32) },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: C.inkOnLime },

  notice: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFF6E0',
    borderColor: '#F0DCA5',
    borderWidth: 1,
    borderRadius: R.sm,
  },
  noticeIcon: { marginTop: 2 },
  noticeText: { flex: 1, fontSize: 11.5, lineHeight: 15, fontWeight: '700', color: '#7A5410' },
  noticeStrong: { fontWeight: '800', color: '#A9741A' },

  walletRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: R.full,
    backgroundColor: '#FCF1DC',
    borderColor: 'rgba(232,163,61,0.38)',
    borderWidth: 1,
  },
  coinText: { fontSize: 12.5, fontWeight: '800', color: '#B87A22' },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: R.full,
    backgroundColor: '#E5ECFE',
    borderColor: 'rgba(76,125,240,0.30)',
    borderWidth: 1,
  },
  xpText: { fontSize: 12.5, fontWeight: '800', color: '#3560C4' },

  section: { marginTop: 20 },

  daily: { borderRadius: 20, padding: 16, overflow: 'hidden' },
  dailyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dailyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: R.full,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(205,233,174,0.22)',
    borderWidth: 1,
  },
  dailyBadgeText: { fontSize: 10.5, letterSpacing: 0.74, fontWeight: '800', color: '#CDE9AE' },
  dailyClock: { fontSize: 12.5, fontWeight: '800', color: '#CDE9AE' },
  dailyCat: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
  },
  dailyTitle: { marginTop: 4, fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#FFFFFF' },
  dailyFormula: { marginTop: 6, fontSize: 13, color: '#CDE9AE' },
  dailyBottom: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  dailyRewards: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dailyCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: R.full,
    backgroundColor: 'rgba(232,163,61,0.18)',
    borderColor: 'rgba(232,163,61,0.42)',
    borderWidth: 1,
  },
  dailyCoinText: { fontSize: 11.5, fontWeight: '800', color: '#F3C88A' },
  dailyXp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: R.full,
    backgroundColor: 'rgba(126,211,33,0.16)',
    borderColor: 'rgba(126,211,33,0.40)',
    borderWidth: 1,
  },
  dailyXpText: { fontSize: 11.5, fontWeight: '800', color: '#AEEA5C' },
  dailyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: R.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    ...shadow('#063F2E', 9, 8, 0.3),
  },
  dailyCtaText: { fontSize: 13, fontWeight: '800', color: C.ink },

  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 12, fontWeight: '800', color: C.brand },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  courseCard: {
    width: '47.5%',
    flexGrow: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E8DE',
    borderWidth: 1,
  },
  courseHead: { height: 68, paddingHorizontal: 12, justifyContent: 'flex-end', paddingBottom: 8 },
  courseName: { fontSize: 17, lineHeight: 17, fontWeight: '800' },
  courseBody: { paddingHorizontal: 12, paddingVertical: 10 },
  courseSub: { ...T.bodySm, fontWeight: '600', color: C.ink },

  quickTitle: { marginBottom: 12 },
  quickCard: { borderRadius: 16, padding: 14, width: '47.5%', flexGrow: 1 },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickName: { marginTop: 12, fontSize: 14, fontWeight: '800', color: C.ink },
  quickDesc: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: C.ink3 },
  quickBottom: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quickReward: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quickCoin: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },
  playDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },

  rows: { gap: 10 },
  problemRow: { borderRadius: R.md, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  problemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  problemBody: { flex: 1, minWidth: 0 },
  problemTitle: { fontSize: 14, fontWeight: '800', color: C.ink, lineHeight: 18 },
  problemMeta: { marginTop: 4, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.4, fontWeight: '700' },
  metaLevel: { fontWeight: '800', color: C.ink3 },
  metaDim: { color: C.ink4, fontWeight: '500' },
  metaCoin: { fontWeight: '800', color: '#B87A22' },
  metaXp: { fontWeight: '800', color: '#3560C4' },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    borderRadius: R.full,
  },
  ctaText: { fontSize: 12, fontWeight: '800' },
})

export default HomeScreen
