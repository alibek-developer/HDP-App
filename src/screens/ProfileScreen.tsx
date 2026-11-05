import { useMemo, useRef, useState } from 'react'
import {
  Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import type { ScrollViewInstance } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  ACHIEVEMENTS, ALL_SETS, LESSONS, WEEK_LABELS, currentWeekKeys, leagueRank,
  unlockedAchievements, type AchIcon, type AchStats,
} from '../data/content'
import { triggerHaptic } from '../lib/haptics'
import { ageOn, gradeFromBirthDate } from '../lib/profile'
import { useApp, freeLessonCount } from '../store/useStore'
import { BrandMark } from '../components/Brand'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import type { TabKey } from '../components/BottomNav'
import Sheet from '../components/Sheet'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, NUM } from '../theme/tokens'

/**
 * Profil — shaxsiy kabinet. Bu yerdagi har bir raqam store'dan keladi:
 * zanjir, XP, aniqlik, haftalik daqiqalar, ochilgan medallar, buyurtmalar.
 * Web'ning `ProfileScreen.tsx` ekvivalenti.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const INK = '#0E1A12'
const CANVAS = '#F3F7EE'
const HAIR = '#E7ECE4'
const GRAY = '#6B7C66'
const GREEN = '#006C49'
const GREEN_SOFT = '#DCFCE7'
const PRO_BG = '#00422B'
const GOLD = '#B87A22'
const BLUE = '#1D4ED8'
const BLUE_SOFT = '#E4EBFF'
const RED = '#BA1A1A'
const RED_SOFT = '#FEE2E2'
const ROW_HAIR = '#F0F0F0'
const FAINT = '#9AA995'

const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

const ICONS: Record<AchIcon, keyof typeof Ionicons.glyphMap> = {
  bolt: 'flash', trophy: 'trophy', grid: 'grid', cap: 'school', books: 'library',
  check: 'checkmark-circle', medal: 'ribbon', star: 'star', gem: 'diamond', target: 'compass',
  flame: 'flame', brain: 'bulb', bag: 'bag-handle', heart: 'heart', pen: 'create',
  rocket: 'rocket', moon: 'moon', compass: 'compass', sigma: 'calculator', crown: 'ribbon',
}

const MEDAL_TINT: Record<AchIcon, { bg: string; ink: string }> = {
  bolt: { bg: GREEN_SOFT, ink: GREEN },
  trophy: { bg: '#FEF3C7', ink: GOLD },
  grid: { bg: BLUE_SOFT, ink: BLUE },
  cap: { bg: GREEN_SOFT, ink: GREEN },
  books: { bg: '#E7F0FF', ink: BLUE },
  check: { bg: GREEN_SOFT, ink: GREEN },
  medal: { bg: '#FEF3C7', ink: GOLD },
  star: { bg: '#FEF3C7', ink: GOLD },
  gem: { bg: '#F0EAF8', ink: '#6B3FA0' },
  target: { bg: RED_SOFT, ink: RED },
  flame: { bg: '#FFE9D6', ink: '#B4530A' },
  brain: { bg: BLUE_SOFT, ink: BLUE },
  bag: { bg: GREEN_SOFT, ink: GREEN },
  heart: { bg: RED_SOFT, ink: RED },
  pen: { bg: '#E7F0FF', ink: BLUE },
  rocket: { bg: '#FEF3C7', ink: GOLD },
  moon: { bg: '#EDEFF5', ink: '#4B5570' },
  compass: { bg: GREEN_SOFT, ink: GREEN },
  sigma: { bg: GREEN_SOFT, ink: GREEN },
  crown: { bg: '#FEF3C7', ink: GOLD },
}

const fmtUz = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()}-${MONTHS_UZ[d.getMonth()]}, ${d.getFullYear()}`
}

const num = (n: number) => n.toLocaleString('en-US')

const GRAD_AVATAR: readonly [string, string] = ['#16A34A', '#006C49']

const CARD_BASE = { backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1, borderRadius: 14 }

const ProfileScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollViewInstance | null>(null)
  const settingsY = useRef(0)

  const [editOpen, setEditOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [allOpen, setAllOpen] = useState(false)
  const [outOpen, setOutOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftUser, setDraftUser] = useState('')

  const name = useApp(s => s.name)
  const username = useApp(s => s.username)
  const email = useApp(s => s.email)
  const publicId = useApp(s => s.publicId)
  const telegramId = useApp(s => s.telegramId)
  const photoUrl = useApp(s => s.photoUrl)
  const theme = useApp(s => s.theme)
  const lessons = useApp(s => s.lessons)
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
  const studyGoal = useApp(s => s.studyGoal)
  const birthDate = useApp(s => s.birthDate)
  const xpForNext = useApp(s => s.xpForNext)
  const setProfile = useApp(s => s.setProfile)
  const setTheme = useApp(s => s.setTheme)
  const signOut = useApp(s => s.signOut)

  /* ── Haqiqiy ko'rsatkichlar ── */

  const lessonsDone = LESSONS.filter(l => lessons[l.id]?.testScore != null).length
  const freeDone = LESSONS.filter(l => l.free && lessons[l.id]?.testScore != null).length

  const topic = useMemo(() => {
    const t: Record<string, number> = {}
    for (const set of ALL_SETS) {
      const n = Math.min((solvedQuestions[set.id] ?? []).length, set.questions.length)
      if (n > 0) t[set.topic] = (t[set.topic] ?? 0) + n
    }
    return t
  }, [solvedQuestions])

  const accuracy = answeredTotal > 0 ? Math.round((answeredCorrect / answeredTotal) * 100) : 0
  const rank = leagueRank(xp)
  const nextXp = xp + xpForNext()
  /** `bestStreak` maydoni qo'shilgandan oldingi zanjirlar ham hisobga olinadi */
  const best = Math.max(bestStreak, streak)

  const stats: AchStats = {
    lessonsDone, freeDone, solved: solvedCount, streak,
    bestStreak: best, level, accuracy, solvedToday,
    orders: orders.length, reviews: reviews.length, favs: favs.length, topic,
  }
  const unlocked = unlockedAchievements(stats)
  const unlockedIds = new Set(unlocked.map(a => a.id))
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)
  const medals = ACHIEVEMENTS.slice(0, 3)

  const week = currentWeekKeys()
  const mins = week.map(k => studyMinutes[k] ?? 0)
  const totalMin = mins.reduce((a, b) => a + b, 0)
  const todayIdx = (new Date().getDay() + 6) % 7
  const peakIdx = mins.indexOf(Math.max(...mins))
  const hasPeak = peakIdx >= 0 && mins[peakIdx] > 0
  const barMax = Math.max(...mins, 1)

  const [now] = useState(() => Date.now())
  const proDays = proExpires
    ? Math.ceil((Date.parse(proExpires + 'T00:00:00') - now) / 86_400_000)
    : 0
  const plan = proDays >= 300 ? 'YILLIK' : proDays >= 25 ? 'OYLIK' : 'SINOV'

  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const olymp = topic['Olimpiada'] ?? 0
  const statusLabel = olymp > 0 ? 'Olimpiada ishtirokchisi' : "Faol o'quvchi"

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

  const scrollToSettings = () => {
    scrollRef.current?.scrollTo({ y: Math.max(0, settingsY.current - 90), animated: true })
  }

  const onTab = (key: TabKey) => {
    if (key === 'profile') return
    navigation.navigate(key === 'home' ? 'Home' : key === 'problems' ? 'Problems' : 'Shop')
  }

  return (
    <View style={p.screen}>
      {/* ── 1. Header ── */}
      <View style={[p.header, { paddingTop: insets.top + 8 }]}>
        <View style={p.headerRow}>
          <BrandMark size={28} />
          <View style={p.headerMid}>
            <Text numberOfLines={1} style={p.headerTitle}>Mening Profilim</Text>
            <Text style={p.headerSub}>HDP Shaxsiy Kabinet</Text>
          </View>
          <View style={p.headerActions}>
            <Pressable
              onPress={() => { triggerHaptic('light'); setBellOpen(true) }}
              accessibilityLabel="Bildirishnomalar"
              style={({ pressed }) => [p.iconBtn, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="notifications-outline" size={16} color={INK} />
              {solvedToday === 0 && <View style={p.dot} />}
            </Pressable>
            <Pressable
              onPress={() => { triggerHaptic('light'); scrollToSettings() }}
              accessibilityLabel="Sozlamalar"
              style={({ pressed }) => [p.iconBtn, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="menu" size={16} color={INK} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[p.scroll, { paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── 2. Profil kartasi ── */}
        <View style={p.profileCard}>
          <View style={p.avatarWrap}>
            <View style={p.avatar}>
              <LinearGradient colors={GRAD_AVATAR} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[ABS_FILL, { borderRadius: 100 }]}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={p.avatarImg} />
                ) : null}
              </LinearGradient>
              {!photoUrl && (initials
                ? <Text style={p.avatarText}>{initials}</Text>
                : <Ionicons name="person" size={26} color="#1C3214" />)}
            </View>
            <Pressable
              onPress={() => { triggerHaptic('light'); openEdit() }}
              accessibilityLabel="Profilni tahrirlash"
              style={({ pressed }) => [p.editBtn, pressed && { opacity: 0.75 }]}
            >
              <Ionicons name="pencil" size={12} color={INK} />
            </Pressable>
          </View>

          <View style={p.identity}>
            <View style={p.nameRow}>
              <Text numberOfLines={1} style={p.name}>{name || 'Ismingizni kiriting'}</Text>
              {telegramId != null && <Ionicons name="checkmark-circle" size={17} color={'#229ED9'} />}
            </View>
            <Text numberOfLines={1} style={p.handle}>
              {email ?? (username ? `@${username}` : 'Profil to\'ldirilmagan')}
              {publicId ? ` · #${publicId}` : ''}
            </Text>
            {telegramId != null && (
              <View style={[p.statusPill, p.telegramPill]}>
                <Ionicons name="paper-plane" size={12} color={'#1B87BE'} />
                <Text style={[p.statusText, { color: '#1B87BE' }]}>Telegram tasdiqlangan</Text>
              </View>
            )}
            <View style={p.statusPill}>
              <Ionicons name="trophy" size={12} color={GREEN} />
              <Text style={p.statusText}>{`${statusLabel} · Lv.${level}`}</Text>
            </View>
            {!!birthDate && (
              <View style={[p.statusPill, p.goalPill]}>
                <Ionicons name="school" size={12} color={GREEN} />
                <Text style={p.statusText}>
                  {`${gradeFromBirthDate(birthDate)} · ${ageOn(birthDate)} yosh`}
                </Text>
              </View>
            )}
            {!!studyGoal && (
              <View style={[p.statusPill, p.goalPill]}>
                <Ionicons name="flag" size={12} color={GREEN} />
                <Text style={p.statusText}>{studyGoal}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── 3. Pro kartasi ── */}
        <View style={p.proCard}>
          {isPro && proDays > 0 ? (
            <View style={p.proRow}>
              <View style={p.proMid}>
                <View style={p.proHead}>
                  <Ionicons name="diamond" size={15} color="#FFFFFF" />
                  <Text style={p.proTitle}>HDP Pro</Text>
                  <View style={p.proPlanChip}><Text style={p.proPlanText}>{plan}</Text></View>
                  <Text style={p.proActive}>Faol</Text>
                </View>
                <Text style={p.proDesc}>Barcha maxsus darslar va IMO tahlili ochiq.</Text>
                {!!proExpires && (
                  <View style={p.proDateRow}>
                    <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.6)" />
                    <Text style={p.proDateText}>Muddati: {fmtUz(proExpires)}</Text>
                  </View>
                )}
              </View>
              <Pressable
                onPress={() => { triggerHaptic('light'); navigation.navigate('Pro') }}
                style={({ pressed }) => [p.proGhost, pressed && { opacity: 0.7 }]}
              >
                <Text style={p.proGhostText}>Boshqarish</Text>
              </Pressable>
            </View>
          ) : (
            <View style={p.proRow}>
              <View style={p.proMid}>
                <View style={p.proHead}>
                  <Ionicons name="diamond" size={15} color="rgba(255,255,255,0.55)" />
                  <Text style={p.proTitle}>HDP Pro</Text>
                  <View style={p.proOffChip}><Text style={p.proOffText}>YO&apos;Q</Text></View>
                </View>
                <Text style={p.proDesc}>
                  {isPro ? 'Obuna muddati tugagan.' : `${freeLessonCount} ta bepul dars ochiq, qolgani Pro bilan.`}
                </Text>
              </View>
              <Pressable
                onPress={() => { triggerHaptic('medium'); navigation.navigate('Pro') }}
                style={({ pressed }) => [p.proBuy, pressed && { opacity: 0.85 }]}
              >
                <Text style={p.proBuyText}>Olish</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── 4. Statistika 2x2 ── */}
        <View style={p.statsGrid}>
          <StatCard
            icon="flame"
            tint={{ background: '#FFE9D6', color: '#B4530A' }}
            label="Olov Streak"
            value={`${streak} kun`}
            note={streak > 0 && streak === best ? 'Shaxsiy rekord!' : `Rekord: ${best} kun`}
            noteUp={streak > 0 && streak === best}
          />
          <StatCard
            icon="flash"
            tint={{ background: BLUE_SOFT, color: BLUE }}
            label="XP Jam'armasi"
            value={`${num(xp)} XP`}
            note={`Keyingi: ${num(nextXp)} XP (+${num(xpForNext())})`}
          />
          <StatCard
            icon="document-text"
            tint={{ background: GREEN_SOFT, color: GREEN }}
            label="Yechilgan Masalalar"
            value={`${solvedCount} ta`}
            note={answeredTotal > 0 ? `${accuracy}% aniqlik` : 'Aniqlik hisoblanmagan'}
            noteGood={accuracy >= 80}
          />
          <StatCard
            icon="trophy"
            tint={{ background: '#FEF3C7', color: GOLD }}
            label="Reyting O'rni"
            value={`#${rank}`}
            note={rank <= 100 ? 'Respublika Top-100' : 'Respublika ligasi'}
          />
        </View>

        {/* ── 5. Haftalik faollik ── */}
        <View style={p.card}>
          <View style={p.cardHead}>
            <Text style={p.cardTitle}>Haftalik Faollik</Text>
            <View style={p.chipGreen}><Text style={p.chipGreenText}>{`Jami ${(totalMin / 60).toFixed(1)} soat`}</Text></View>
          </View>

          <View style={p.bars}>
            {mins.map((m, i) => {
              const isPeak = hasPeak && i === peakIdx
              const bg = m > 0 ? (isPeak ? GREEN : GREEN_SOFT) : '#F5F5F5'
              const h = m > 0 ? 16 + Math.round((m / barMax) * 62) : 10
              return (
                <View key={week[i]} style={p.barCol}>
                  <Text style={[p.barPeak, { color: isPeak ? GREEN : 'transparent' }]}>
                    {isPeak ? `${m}m` : ' '}
                  </Text>
                  <View
                    style={[
                      p.bar,
                      { height: h, backgroundColor: bg },
                      i === todayIdx && m === 0 ? { borderWidth: 1, borderColor: '#C9D3C4', borderStyle: 'dashed' } : null,
                    ]}
                  />
                  <Text style={[p.barLabel, { color: i === todayIdx ? INK : GRAY }]}>{WEEK_LABELS[i]}</Text>
                </View>
              )
            })}
          </View>

          {totalMin === 0 && (
            <Text style={p.barsNote}>
              Bu hafta hali dars tugallanmagan — ustunlar seansda o'tirilgan daqiqalarni yig'adi.
            </Text>
          )}
        </View>

        {/* ── 6. Yutuqlar va medallar ── */}
        <View style={p.card}>
          <View style={p.medalHead}>
            <View style={p.medalHeadMid}>
              <Text style={p.cardTitle}>Yutuqlar &amp; Medallar</Text>
              <Text style={p.cardSub}>
                {ACHIEVEMENTS.length} tadan {unlocked.length} tasi ochilgan ({pct}%)
              </Text>
            </View>
            <Pressable
              onPress={() => { triggerHaptic('light'); setAllOpen(true) }}
              hitSlop={8}
              style={({ pressed }) => [p.allBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={p.allBtnText}>Barchasi</Text>
              <Ionicons name="chevron-forward" size={14} color={GREEN} />
            </Pressable>
          </View>

          <View style={p.medalRow}>
            {medals.map(m => {
              const on = unlockedIds.has(m.id)
              const tint = MEDAL_TINT[m.icon]
              return (
                <View key={m.id} style={[p.medalTile, { opacity: on ? 1 : 0.35 }]}>
                  <View style={[p.medalIcon, { backgroundColor: tint.bg }]}>
                    <Ionicons name={ICONS[m.icon]} size={18} color={tint.ink} />
                  </View>
                  <Text style={p.medalTitle}>{m.title}</Text>
                  <Text style={p.medalHint}>{m.hint}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* ── 7. Sozlamalar ro'yxati ── */}
        <View
          style={p.settings}
          onLayout={e => { settingsY.current = e.nativeEvent.layout.y }}
        >
          <Row
            icon="document-text"
            tint={GREEN_SOFT}
            iconColor={GREEN}
            title="Mening natijalarim"
            sub={lessonsDone > 0 ? `${lessonsDone} ta dars testi yakunlangan` : 'Darsni tugatgach birinchi natija'}
            right={<Ionicons name="chevron-forward" size={16} color="#C9D3C4" />}
            onClick={() => { triggerHaptic('light'); setCertOpen(true) }}
          />
          <Row
            icon="notifications"
            tint="#FEF3C7"
            iconColor={GOLD}
            title="Faollik hisoboti"
            sub={solvedToday > 0 ? `Bugun ${solvedToday} ta masala yechildi` : "Bugungi faollikni ko'rish"}
            right={<Ionicons name="chevron-forward" size={16} color="#C9D3C4" />}
            onClick={() => { triggerHaptic('light'); setBellOpen(true) }}
          />
          <Row
            icon="sunny"
            tint="#EDEFF5"
            iconColor={GRAY}
            title="Ilova Mavzusi"
            sub={theme === 'light' ? "Yorug' (Toza Oq rejim)" : "Qorong'u (Tun rejimi)"}
            right={<><Pill label="Faol" bg={GREEN_SOFT} ink={GREEN} /><Ionicons name="chevron-forward" size={16} color="#C9D3C4" /></>}
            onClick={() => { triggerHaptic('light'); setThemeOpen(true) }}
          />
          <Row
            icon="help-circle"
            tint={BLUE_SOFT}
            iconColor={BLUE}
            title="Yordam va Qo'llab-quvvatlash"
            sub="Ilova qoidalari va ma'lumotlar"
            right={<Ionicons name="chevron-forward" size={16} color="#C9D3C4" />}
            onClick={() => { triggerHaptic('light'); setHelpOpen(true) }}
          />
          <Row
            last
            icon="log-out"
            tint={RED_SOFT}
            iconColor={RED}
            title="Tizimdan chiqish"
            titleColor={RED}
            sub="Hisobdan xavfsiz chiqish"
            subColor="rgba(186,26,26,0.6)"
            onClick={() => { triggerHaptic('warning'); setOutOpen(true) }}
          />
        </View>

        {/* ── 8. Footer ── */}
        <View style={p.footer}>
          <Text style={p.footerTitle}>HDP Academy 1.0.0</Text>
          <Text style={p.footerSub}>Matematika o'quv platformasi</Text>
        </View>
      </ScrollView>

      {/* ── Varaqa: profilni tahrirlash ── */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="PROFILNI TAHRIRLASH">
        <Field label="Ism familiya" value={draftName} onChange={setDraftName} placeholder="Ismingiz" />
        <Field label="Telegram foydalanuvchi nomi" value={draftUser} onChange={setDraftUser} placeholder="username" prefix="@" />
        <Pressable
          onPress={saveProfile}
          disabled={!draftName.trim()}
          style={({ pressed }) => [
            p.saveBtn,
            !draftName.trim() ? { opacity: 0.4 } : pressed ? { opacity: 0.85 } : null,
          ]}
        >
          <Text style={p.saveBtnText}>Saqlash</Text>
        </Pressable>
      </Sheet>

      {/* ── Varaqa: bildirishnomalar ── */}
      <Sheet
        open={bellOpen}
        onClose={() => setBellOpen(false)}
        title="BILDIRISHNOMALAR"
        subtitle="Bugungi faollik va hisob ma'lumotlari."
      >
        <Note label="Bugungi faollik" value={solvedToday > 0 ? `${solvedToday} ta masala yechildi` : 'Hali birorta masala yechilmadi'} />
        <Note label="Zanjir" value={`${streak} kun · rekord ${bestStreak} kun`} />
        <Note label="Pro muddati" value={isPro && proDays > 0 && proExpires ? fmtUz(proExpires) : 'Pro yoqilmagan'} />
        <Note label="Buyurtmalar" value={orders.length > 0 ? `${orders.length} ta sovg'a buyurtma qilingan` : "Hali buyurtma yo'q"} />
        <Pressable
          onPress={() => { triggerHaptic('selection'); setBellOpen(false); navigation.navigate('Problems') }}
          style={({ pressed }) => [p.inkBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={p.inkBtnText}>Kunlik masalaga o&apos;tish</Text>
        </Pressable>
      </Sheet>

      {/* ── Varaqa: natijalar ── */}
      <Sheet
        open={certOpen}
        onClose={() => setCertOpen(false)}
        title="NATIJALAR"
        subtitle="Har bir tugatilgan dars testining natijasi shu yerda saqlanadi."
      >
        {lessonsDone === 0 ? (
          <Text style={p.sheetText}>
            Hozircha natija yo&apos;q. Bepul ro&apos;yxatdagi {freeLessonCount} darsdan birinchi testini
            yakunlang — natija shu yerda paydo bo&apos;ladi.
          </Text>
        ) : (
          LESSONS.filter(l => lessons[l.id]?.testScore != null).map(l => (
            <View key={l.id} style={p.certRow}>
              <View style={p.certTile}>
                <Ionicons name="school" size={16} color={GREEN} />
              </View>
              <View style={p.certMid}>
                <Text numberOfLines={1} style={p.certTitle}>{l.title}</Text>
                <Text style={p.certScore}>
                  {lessons[l.id]?.testScore}/{lessons[l.id]?.testTotal} to&apos;g&apos;ri
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={19} color={GREEN} />
            </View>
          ))
        )}
        <Text style={p.sheetFoot}>
          Natijalar shu qurilmadagi profilingizda saqlanadi.
        </Text>
      </Sheet>

      {/* ── Varaqa: mavzu ── */}
      <Sheet open={themeOpen} onClose={() => setThemeOpen(false)} title="ILOVA MAVZUSI">
        {([
          { key: 'light' as const, label: "Yorug' (Toza Oq rejim)", icon: 'sunny' as const, ready: true },
          { key: 'dark' as const, label: "Qorong'u (Tun rejimi)", icon: 'moon' as const, ready: false },
        ]).map(o => {
          const active = theme === o.key
          return (
            <Pressable
              key={o.key}
              disabled={!o.ready}
              onPress={() => { triggerHaptic('selection'); setTheme(o.key); setThemeOpen(false) }}
              style={({ pressed }) => [
                p.themeRow,
                !o.ready && { opacity: 0.45 },
                pressed && o.ready && { backgroundColor: '#FAFCF8' },
              ]}
            >
              <Ionicons name={o.icon} size={17} color={active ? GREEN : GRAY} />
              <Text style={p.themeLabel}>{o.label}</Text>
              {!o.ready && <Pill label="Tez orada" bg="#EDEFF5" ink={GRAY} />}
              {active && o.ready && <Ionicons name="checkmark" size={17} color={GREEN} />}
            </Pressable>
          )
        })}
      </Sheet>

      {/* ── Varaqa: yordam ── */}
      <Sheet open={helpOpen} onClose={() => setHelpOpen(false)} title="YORDAM VA QO'LLAB-QUVVATLASH">
        <Text style={p.sheetText}>
          Ilova qanday ishlaydi — asosiy qoidalar shu yerda.
        </Text>
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
      </Sheet>

      {/* ── Varaqa: barcha medallar ── */}
      <Sheet
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="BARCHA MEDALLAR"
        subtitle={`${unlocked.length} / ${ACHIEVEMENTS.length} ochilgan`}
      >
        <View style={p.medalGrid}>
          {ACHIEVEMENTS.map(a => {
            const on = unlockedIds.has(a.id)
            const tint = MEDAL_TINT[a.icon]
            return (
              <View key={a.id} style={[p.medalCell, { opacity: on ? 1 : 0.4 }]}>
                <View style={[p.medalCellIcon, { backgroundColor: tint.bg }]}>
                  <Ionicons name={ICONS[a.icon]} size={15} color={tint.ink} />
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
      <Sheet open={outOpen} onClose={() => setOutOpen(false)} title="TIZIMDAN CHIQISH">
        <Text style={p.sheetText}>
          Sessiya yopiladi va boshlang&apos;ich ekranga qaytasiz. Progress — darslar, coin, zanjir va
          buyurtmalar — o&apos;rnida qoladi.
        </Text>
        <Pressable
          onPress={() => { triggerHaptic('warning'); setOutOpen(false); signOut(); navigation.replace('Onboarding') }}
          style={({ pressed }) => [p.dangerBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={p.dangerBtnText}>Ha, chiqaman</Text>
        </Pressable>
        <Pressable
          onPress={() => { triggerHaptic('light'); setOutOpen(false) }}
          style={({ pressed }) => [p.softBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={p.softBtnText}>Bekor qilish</Text>
        </Pressable>
      </Sheet>

      <BottomNav active="profile" onSelect={onTab} />
    </View>
  )
}

/* ── kichik bloklar ── */

const StatCard = ({
  icon, tint, label, value, note, noteUp, noteGood,
}: {
  icon: keyof typeof Ionicons.glyphMap
  tint: { background: string; color: string }
  label: string
  value: string
  note: string
  noteUp?: boolean
  noteGood?: boolean
}) => (
  <View style={st.statCard}>
    <View style={st.statHead}>
      <View style={[st.statTile, { backgroundColor: tint.background }]}>
        <Ionicons name={icon} size={15} color={tint.color} />
      </View>
      <Text style={st.statLabel}>{label}</Text>
    </View>
    <Text style={[st.statValue, NUM]}>{value}</Text>
    <View style={st.statNoteRow}>
      {noteUp && <Ionicons name="trending-up" size={11} color={GREEN} />}
      <Text style={[st.statNote, { color: noteUp || noteGood ? GREEN : GRAY }]}>{note}</Text>
    </View>
  </View>
)

const Pill = ({ label, bg, ink }: { label: string; bg: string; ink: string }) => (
  <View style={[st.pill, { backgroundColor: bg }]}>
    <Text style={[st.pillText, { color: ink }]}>{label}</Text>
  </View>
)

const Row = ({
  icon, tint, iconColor, title, sub, right, onClick, last, titleColor, subColor,
}: {
  icon: keyof typeof Ionicons.glyphMap
  tint: string
  iconColor: string
  title: string
  sub: string
  right?: React.ReactNode
  onClick?: () => void
  last?: boolean
  titleColor?: string
  subColor?: string
}) => {
  const inner = (
    <>
      <View style={[st.rowTile, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <View style={st.rowMid}>
        <Text numberOfLines={1} style={[st.rowTitle, { color: titleColor ?? INK }]}>{title}</Text>
        <Text numberOfLines={1} style={[st.rowSub, { color: subColor ?? GRAY }]}>{sub}</Text>
      </View>
      {right != null && <View style={st.rowRight}>{right}</View>}
    </>
  )
  return (
    <Pressable
      onPress={onClick}
      style={({ pressed }) => [
        st.row,
        !last && { borderBottomWidth: 1, borderBottomColor: ROW_HAIR },
        pressed && onClick ? { backgroundColor: '#FAFCF8' } : null,
      ]}
    >
      {inner}
    </Pressable>
  )
}

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
  screen: { flex: 1, backgroundColor: CANVAS },
  header: { backgroundColor: CANVAS, borderBottomWidth: 1, borderBottomColor: HAIR },
  headerRow: { height: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  headerMid: { flex: 1, minWidth: 0, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: INK },
  headerSub: { fontSize: 11, fontWeight: '700', color: GRAY, marginTop: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 100, backgroundColor: '#FFFFFF',
    borderColor: HAIR, borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: 100,
    backgroundColor: '#E23B2B', borderWidth: 1.5, borderColor: '#FFFFFF',
  },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  profileCard: {
    ...CARD_BASE, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  avatarWrap: { width: 78, height: 78 },
  avatar: {
    position: 'relative', width: 72, height: 72, borderRadius: 100, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#006C49',
  },
  avatarImg: { width: 72, height: 72, borderRadius: 100 },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  editBtn: {
    position: 'absolute', right: 0, bottom: 2, width: 26, height: 26, borderRadius: 100,
    backgroundColor: '#FFFFFF', borderColor: HAIR, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  identity: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 18, fontWeight: '800', color: INK, flexShrink: 1 },
  handle: { fontSize: 12, fontWeight: '700', color: GRAY, marginTop: 2 },
  statusPill: {
    marginTop: 10, alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 100,
    backgroundColor: GREEN_SOFT, flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  statusText: { fontSize: 12, fontWeight: '800', color: GREEN },
  goalPill: { marginTop: 6, backgroundColor: '#F3F7EE' },
  telegramPill: { marginTop: 6, backgroundColor: '#EAF6FD' },

  proCard: { marginTop: 12, backgroundColor: PRO_BG, borderRadius: 14, padding: 14 },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  proMid: { flex: 1, minWidth: 0 },
  proHead: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  proTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  proPlanChip: { backgroundColor: '#FEF3C7', borderRadius: 100, paddingHorizontal: 6, paddingVertical: 3 },
  proPlanText: { fontSize: 10, fontWeight: '800', color: GOLD },
  proActive: { fontSize: 12, fontWeight: '800', color: '#8CE6B0' },
  proDesc: { marginTop: 4, fontSize: 12, lineHeight: 17, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  proDateRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  proDateText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  proGhost: {
    height: 32, paddingHorizontal: 14, borderRadius: 100, borderColor: 'rgba(255,255,255,0.55)', borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  proGhostText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  proOffChip: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 100, paddingHorizontal: 6, paddingVertical: 3 },
  proOffText: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  proBuy: {
    height: 32, paddingHorizontal: 14, borderRadius: 100, backgroundColor: '#7ED321',
    alignItems: 'center', justifyContent: 'center',
  },
  proBuyText: { fontSize: 12, fontWeight: '800', color: INK },

  statsGrid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  card: { ...CARD_BASE, borderRadius: 14, padding: 14, marginTop: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: INK },
  cardSub: { marginTop: 2, fontSize: 12, fontWeight: '600', color: GRAY },
  chipGreen: {
    height: 24, paddingHorizontal: 10, borderRadius: 100, backgroundColor: GREEN_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  chipGreenText: { fontSize: 11, fontWeight: '800', color: GREEN },

  bars: { marginTop: 16, height: 114, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barCol: { width: 32, alignItems: 'center', justifyContent: 'flex-end' },
  barPeak: { fontSize: 11, fontWeight: '800', marginBottom: 4, fontVariant: ['tabular-nums'] },
  bar: { width: 28, borderRadius: 4, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 10, fontWeight: '700', marginTop: 8 },
  barsNote: { marginTop: 12, fontSize: 11.5, fontWeight: '700', color: FAINT, textAlign: 'center' },

  medalHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  medalHeadMid: { flex: 1, minWidth: 0 },
  allBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  allBtnText: { fontSize: 12, fontWeight: '800', color: GREEN },
  medalRow: { marginTop: 14, flexDirection: 'row', gap: 8 },
  medalTile: {
    flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 6, borderRadius: 12,
    backgroundColor: '#FAFCF8', borderColor: HAIR, borderWidth: 1,
  },
  medalIcon: { width: 38, height: 38, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  medalTitle: { marginTop: 8, fontSize: 11, fontWeight: '800', color: INK, textAlign: 'center', lineHeight: 14 },
  medalHint: { marginTop: 2, fontSize: 10, fontWeight: '700', color: GRAY, textAlign: 'center', lineHeight: 13 },

  settings: { ...CARD_BASE, borderRadius: 14, marginTop: 12, overflow: 'hidden' },
  switch: { width: 44, height: 26, borderRadius: 100 },
  switchKnob: {
    position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 100, backgroundColor: '#FFFFFF',
  },

  footer: { marginTop: 24, marginBottom: 24, alignItems: 'center' },
  footerTitle: { fontSize: 11, fontWeight: '700', color: GRAY, textAlign: 'center' },
  footerSub: { marginTop: 2, fontSize: 10, fontWeight: '600', color: FAINT, textAlign: 'center' },

  saveBtn: {
    marginTop: 16, height: 48, borderRadius: 100, backgroundColor: '#7ED321',
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontSize: 13.5, fontWeight: '800', color: INK },
  inkBtn: {
    marginTop: 16, height: 48, borderRadius: 100, backgroundColor: INK,
    alignItems: 'center', justifyContent: 'center',
  },
  inkBtnText: { fontSize: 13.5, fontWeight: '800', color: '#CDE9AE' },
  dangerBtn: {
    marginTop: 16, height: 48, borderRadius: 100, backgroundColor: RED,
    alignItems: 'center', justifyContent: 'center',
  },
  dangerBtnText: { fontSize: 13.5, fontWeight: '800', color: '#FFFFFF' },
  softBtn: {
    marginTop: 8, height: 44, borderRadius: 100, backgroundColor: '#F1F4EC',
    alignItems: 'center', justifyContent: 'center',
  },
  softBtnText: { fontSize: 13, fontWeight: '800', color: INK },

  sheetText: { fontSize: 13, lineHeight: 20, color: GRAY },
  sheetFoot: { marginTop: 12, fontSize: 11.5, lineHeight: 17, color: FAINT },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: ROW_HAIR },
  certTile: { width: 34, height: 34, borderRadius: 100, backgroundColor: GREEN_SOFT, alignItems: 'center', justifyContent: 'center' },
  certMid: { flex: 1, minWidth: 0 },
  certTitle: { fontSize: 13.5, fontWeight: '800', color: INK },
  certScore: { marginTop: 2, fontSize: 11, fontWeight: '700', color: GRAY },

  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 2, borderBottomWidth: 1, borderBottomColor: ROW_HAIR },
  themeLabel: { flex: 1, fontSize: 14, fontWeight: '800', color: INK },

  helpList: { marginTop: 12 },
  helpRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 2, borderBottomWidth: 1, borderBottomColor: ROW_HAIR,
  },
  helpKey: { fontSize: 13, fontWeight: '800', color: INK },
  helpValue: { fontSize: 12, fontWeight: '700', color: GRAY },

  medalGrid: { marginTop: 4, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  medalCell: {
    width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FAFCF8', borderColor: HAIR, borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  medalCellIcon: { width: 30, height: 30, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  medalCellMid: { flex: 1, minWidth: 0 },
  medalCellTitle: { fontSize: 12, fontWeight: '800', color: INK },
  medalCellHint: { marginTop: 1, fontSize: 10.5, fontWeight: '700', color: GRAY },
})

const st = StyleSheet.create({
  statCard: { ...CARD_BASE, width: '47%', borderRadius: 12, padding: 12 },
  statHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statTile: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 11, fontWeight: '700', lineHeight: 14, color: GRAY, flex: 1 },
  statValue: { marginTop: 8, fontSize: 22, lineHeight: 22, fontWeight: '800', color: INK, letterSpacing: -0.5 },
  statNoteRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  statNote: { fontSize: 11, fontWeight: '700' },

  pill: { height: 20, paddingHorizontal: 8, borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  pillText: { fontSize: 10, fontWeight: '800' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#FFFFFF' },
  rowTile: { width: 36, height: 36, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  rowMid: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13.5, fontWeight: '800' },
  rowSub: { marginTop: 2, fontSize: 11, fontWeight: '700' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },

  noteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 11, paddingHorizontal: 2, borderBottomWidth: 1, borderBottomColor: ROW_HAIR,
  },
  noteLabel: { fontSize: 12.5, fontWeight: '700', color: GRAY },
  noteValue: { fontSize: 12.5, fontWeight: '800', color: INK },

  fieldWrap: { marginTop: 8 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: GRAY },
  fieldBox: {
    marginTop: 6, height: 48, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7FAF4', borderColor: HAIR, borderWidth: 1, borderRadius: 12,
  },
  fieldPrefix: { fontSize: 14, fontWeight: '800', color: GRAY, marginRight: 2 },
  fieldInput: { flex: 1, fontSize: 14, fontWeight: '800', color: INK, padding: 0 },
})

export default ProfileScreen
