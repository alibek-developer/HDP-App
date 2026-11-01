import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award, BadgeCheck, Bell, Brain, CalendarDays, Check, CheckCircle2, ChevronRight,
  ClipboardList, Compass, Crown, ExternalLink, FileText, Flame, Gem, GraduationCap,
  Heart, HelpCircle, LayoutGrid, Library, LogOut, Menu, Moon, PenLine, Pencil, Rocket,
  ShoppingBag, Sigma, Star, Sun, Target, TrendingUp, Trophy, Zap,
} from 'lucide-react'
import {
  ALL_SETS, ACHIEVEMENTS, LESSONS, WEEK_LABELS, currentWeekKeys, leagueRank,
  unlockedAchievements,
  type AchIcon, type AchStats,
} from '../data/content'
import { triggerHaptic } from '../lib/telegram'
import { useApp, freeLessonCount } from '../store/useStore'
import Sheet from '../components/Sheet'

/**
 * Profil — shaxsiy kabinet. Bu yerdagi har bir raqam store'dan keladi:
 * zanjir, XP, aniqlik, haftalik daqiqalar, ochilgan medallar, buyurtmalar.
 */

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

const CARD = {
  background: '#FFFFFF',
  border: `1px solid ${HAIR}`,
  borderRadius: 14,
  boxShadow: '0 8px 22px rgba(14,26,18,0.05)',
} as const

const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

const ICONS: Record<AchIcon, typeof Award> = {
  bolt: Zap, trophy: Trophy, grid: LayoutGrid, cap: GraduationCap, books: Library,
  check: CheckCircle2, medal: Award, star: Star, gem: Gem, target: Target,
  flame: Flame, brain: Brain, bag: ShoppingBag, heart: Heart, pen: PenLine,
  rocket: Rocket, moon: Moon, compass: Compass, sigma: Sigma, crown: Crown,
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

const ProfileScreen = () => {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [allOpen, setAllOpen] = useState(false)
  const [outOpen, setOutOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftUser, setDraftUser] = useState('')

  const s = useApp(st => st)
  const setProfile = useApp(st => st.setProfile)
  const setNotif = useApp(st => st.setNotif)
  const setTheme = useApp(st => st.setTheme)
  const signOut = useApp(st => st.signOut)

  /* ── Haqiqiy ko'rsatkichlar ── */

  const lessonsDone = LESSONS.filter(l => s.lessons[l.id]?.testScore != null).length
  const freeDone = LESSONS.filter(l => l.free && s.lessons[l.id]?.testScore != null).length

  const topic = useMemo(() => {
    const t: Record<string, number> = {}
    for (const set of ALL_SETS) {
      const n = Math.min((s.solvedQuestions[set.id] ?? []).length, set.questions.length)
      if (n > 0) t[set.topic] = (t[set.topic] ?? 0) + n
    }
    return t
  }, [s.solvedQuestions])

  const accuracy = s.answeredTotal > 0 ? Math.round((s.answeredCorrect / s.answeredTotal) * 100) : 0
  const rank = leagueRank(s.xp)
  const nextXp = s.xp + s.xpForNext()
  /** `bestStreak` maydoni qo'shilgandan oldingi zanjirlar ham hisobga olinadi */
  const best = Math.max(s.bestStreak, s.streak)

  const stats: AchStats = {
    lessonsDone, freeDone, solved: s.solvedCount, streak: s.streak,
    bestStreak: best, level: s.level, accuracy, solvedToday: s.solvedToday,
    orders: s.orders.length, reviews: s.reviews.length, favs: s.favs.length, topic,
  }
  const unlocked = unlockedAchievements(stats)
  const unlockedIds = new Set(unlocked.map(a => a.id))
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)
  const medals = ACHIEVEMENTS.slice(0, 3)

  const week = currentWeekKeys()
  const mins = week.map(k => s.studyMinutes[k] ?? 0)
  const totalMin = mins.reduce((a, b) => a + b, 0)
  const todayIdx = (new Date().getDay() + 6) % 7
  const peakIdx = mins.indexOf(Math.max(...mins))
  const hasPeak = peakIdx >= 0 && mins[peakIdx] > 0
  const barMax = Math.max(...mins, 1)

  const proDays = s.proExpires
    ? Math.ceil((Date.parse(s.proExpires + 'T00:00:00') - Date.now()) / 86_400_000)
    : 0
  const plan = proDays >= 300 ? 'YILLIK' : proDays >= 25 ? 'OYLIK' : 'SINOV'

  const initials = s.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'HA'
  const olymp = topic['Olimpiada'] ?? 0
  const statusLabel = olymp > 0 ? 'Olimpiada ishtirokchisi' : 'Faol o\'quvchi'

  const openEdit = () => {
    setDraftName(s.name)
    setDraftUser(s.username)
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
    document.getElementById('settings-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen pb-28 select-none font-sans" style={{ background: CANVAS }}>

      {/* ── 1. Header ── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: CANVAS, borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="px-4 h-[54px] flex items-center">
          <span
            className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(150deg, #9BE04B 0%, #7ED321 60%, #5FAF22 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
            }}
          >
            <span className="font-serif text-[15px] leading-none" style={{ color: '#0E1A12' }}>Σ</span>
          </span>

          <div className="flex-1 text-center min-w-0">
            <p className="text-[16px] font-extrabold leading-tight truncate" style={{ color: INK }}>
              Mening Profilim
            </p>
            <p className="text-[11px] font-bold leading-tight" style={{ color: GRAY }}>
              HDP Shaxsiy Kabinet
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => { triggerHaptic('light'); setBellOpen(true) }}
              className="relative w-[34px] h-[34px] rounded-full flex items-center justify-center"
              style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
              aria-label="Bildirishnomalar"
            >
              <Bell size={16} strokeWidth={2.1} color={INK} />
              {s.notifOn && s.solvedToday === 0 && (
                <span
                  className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full"
                  style={{ background: '#E23B2B', border: '1.5px solid #FFFFFF' }}
                />
              )}
            </button>
            <button
              onClick={() => { triggerHaptic('light'); scrollToSettings() }}
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
              style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
              aria-label="Sozlamalar"
            >
              <Menu size={16} strokeWidth={2.3} color={INK} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4">

        {/* ── 2. Profil kartasi ── */}
        <section className="mt-4" style={{ ...CARD, borderRadius: 16, padding: 16 }}>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-extrabold"
                style={{
                  background: 'linear-gradient(150deg, #16A34A 0%, #006C49 100%)',
                  fontSize: 24, color: '#FFFFFF', letterSpacing: '-0.02em',
                }}
              >
                {initials}
              </div>
              <button
                onClick={() => { triggerHaptic('light'); openEdit() }}
                className="absolute -bottom-0.5 -right-0.5 w-[26px] h-[26px] rounded-full flex items-center justify-center"
                style={{ background: '#FFFFFF', border: `1px solid ${HAIR}`, boxShadow: '0 3px 8px rgba(14,26,18,0.14)' }}
                aria-label="Profilni tahrirlash"
              >
                <Pencil size={12} strokeWidth={2.4} color={INK} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[18px] font-extrabold leading-tight truncate" style={{ color: INK }}>
                  {s.name}
                </h2>
                {s.username && <BadgeCheck size={17} strokeWidth={2.2} color={GREEN} fill={GREEN_SOFT} />}
              </div>
              <p className="text-[12px] font-bold mt-0.5 truncate" style={{ color: GRAY }}>
                @{s.username} · #{s.publicId}
              </p>
              <span
                className="inline-flex items-center gap-1 mt-2.5 px-2.5 h-[26px] rounded-full text-[12px] font-extrabold"
                style={{ background: GREEN_SOFT, color: GREEN }}
              >
                <Trophy size={12} strokeWidth={2.4} />
                {statusLabel} · Lv.{s.level}
              </span>
            </div>
          </div>
        </section>

        {/* ── 3. Pro kartasi ── */}
        <section className="mt-3" style={{ background: PRO_BG, borderRadius: 14, padding: 14 }}>
          {s.isPro && proDays > 0 ? (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Gem size={15} strokeWidth={2.3} color="#FFFFFF" />
                  <p className="text-[14px] font-extrabold" style={{ color: '#FFFFFF' }}>HDP Pro</p>
                  <span className="text-[10px] font-extrabold px-1.5 py-[3px] rounded-full" style={{ background: '#FEF3C7', color: GOLD }}>
                    {plan}
                  </span>
                  <span className="text-[12px] font-extrabold" style={{ color: '#8CE6B0' }}>Faol</span>
                </div>
                <p className="text-[12px] font-semibold mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Barcha maxsus darslar va IMO tahlili ochiq.
                </p>
                <p className="text-[11px] font-bold mt-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <CalendarDays size={12} strokeWidth={2.2} />
                  Muddati: {fmtUz(s.proExpires!)}
                </p>
              </div>
              <button
                onClick={() => { triggerHaptic('light'); navigate('/pro') }}
                className="shrink-0 h-[32px] px-3.5 rounded-full text-[12px] font-extrabold"
                style={{ border: '1px solid rgba(255,255,255,0.55)', color: '#FFFFFF' }}
              >
                Boshqarish
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Gem size={15} strokeWidth={2.3} color="rgba(255,255,255,0.55)" />
                  <p className="text-[14px] font-extrabold" style={{ color: '#FFFFFF' }}>HDP Pro</p>
                  <span className="text-[10px] font-extrabold px-1.5 py-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.7)' }}>
                    YO'Q
                  </span>
                </div>
                <p className="text-[12px] font-semibold mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {s.isPro ? 'Obuna muddati tugagan.' : `${freeLessonCount} ta bepul dars ochiq, qolgani Pro bilan.`}
                </p>
              </div>
              <button
                onClick={() => { triggerHaptic('medium'); navigate('/pro') }}
                className="shrink-0 h-[32px] px-3.5 rounded-full text-[12px] font-extrabold"
                style={{ background: '#7ED321', color: '#0E1A12' }}
              >
                Olish
              </button>
            </div>
          )}
        </section>

        {/* ── 4. Statistika 2x2 ── */}
        <section className="mt-3 grid grid-cols-2 gap-3">
          <StatCard
            icon={<Flame size={15} strokeWidth={2.3} color="#B4530A" />}
            tint={{ background: '#FFE9D6' }}
            label="Olov Streak"
            value={`${s.streak} kun`}
            note={s.streak > 0 && s.streak === best ? 'Shaxsiy rekord!' : `Rekord: ${best} kun`}
            noteUp={s.streak > 0 && s.streak === best}
          />
          <StatCard
            icon={<Zap size={15} strokeWidth={2.3} color={BLUE} />}
            tint={{ background: BLUE_SOFT }}
            label="XP Jam'armasi"
            value={`${s.xp.toLocaleString()} XP`}
            note={`Keyingi: ${nextXp.toLocaleString()} XP (+${s.xpForNext().toLocaleString()})`}
          />
          <StatCard
            icon={<ClipboardList size={15} strokeWidth={2.3} color={GREEN} />}
            tint={{ background: GREEN_SOFT }}
            label="Yechilgan Masalalar"
            value={`${s.solvedCount} ta`}
            note={s.answeredTotal > 0 ? `${accuracy}% aniqlik` : "Aniqlik hisoblanmagan"}
            noteGood={accuracy >= 80}
          />
          <StatCard
            icon={<Trophy size={15} strokeWidth={2.3} color={GOLD} />}
            tint={{ background: '#FEF3C7' }}
            label="Reyting O'rni"
            value={`#${rank}`}
            note={rank <= 100 ? 'Respublika Top-100' : 'Respublika ligasi'}
          />
        </section>

        {/* ── 5. Haftalik faollik ── */}
        <section className="mt-3" style={{ ...CARD, padding: 14 }}>
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-extrabold" style={{ color: INK }}>Haftalik Faollik</p>
            <span className="text-[11px] font-extrabold px-2.5 h-[24px] inline-flex items-center rounded-full" style={{ background: GREEN_SOFT, color: GREEN }}>
              Jami {(totalMin / 60).toFixed(1)} soat
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between" style={{ height: 96 }}>
            {mins.map((m, i) => {
              const isPeak = hasPeak && i === peakIdx
              const bg = m > 0 ? (isPeak ? GREEN : GREEN_SOFT) : '#F5F5F5'
              const h = m > 0 ? 16 + Math.round((m / barMax) * 62) : 10
              return (
                <div key={week[i]} className="flex flex-col items-center justify-end" style={{ width: 32 }}>
                  {isPeak && (
                    <span className="num text-[11px] font-extrabold mb-1" style={{ color: GREEN }}>{m}m</span>
                  )}
                  {!isPeak && <span className="text-[11px] mb-1">&nbsp;</span>}
                  <span
                    style={{
                      width: 28, height: h, background: bg,
                      borderRadius: '4px 4px 2px 2px',
                      border: i === todayIdx && m === 0 ? `1px dashed #C9D3C4` : undefined,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold mt-2"
                    style={{ color: i === todayIdx ? INK : GRAY }}
                  >
                    {WEEK_LABELS[i]}
                  </span>
                </div>
              )
            })}
          </div>

          {totalMin === 0 && (
            <p className="mt-3 text-[11.5px] font-bold text-center" style={{ color: '#9AA995' }}>
              Bu hafta hali dars tugallanmagan — ustunlar seansda o'tirilgan daqiqalarni yig'adi.
            </p>
          )}
        </section>

        {/* ── 6. Yutuqlar va medallar ── */}
        <section className="mt-3" style={{ ...CARD, padding: 14 }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-extrabold" style={{ color: INK }}>Yutuqlar &amp; Medallar</p>
              <p className="text-[12px] font-semibold mt-0.5" style={{ color: GRAY }}>
                {ACHIEVEMENTS.length} tadan {unlocked.length} tasi ochilgan ({pct}%)
              </p>
            </div>
            <button
              onClick={() => { triggerHaptic('light'); setAllOpen(true) }}
              className="shrink-0 text-[12px] font-extrabold inline-flex items-center gap-0.5"
              style={{ color: GREEN }}
            >
              Barchasi <ChevronRight size={14} strokeWidth={2.6} />
            </button>
          </div>

          <div className="mt-3.5 flex gap-2">
            {medals.map(m => {
              const on = unlockedIds.has(m.id)
              const Icon = ICONS[m.icon]
              const tint = MEDAL_TINT[m.icon]
              return (
                <div key={m.id} className="flex-1 flex flex-col items-center text-center py-3 px-1.5 rounded-[12px]"
                  style={{ background: '#FAFCF8', border: `1px solid ${HAIR}`, opacity: on ? 1 : 0.35, filter: on ? undefined : 'grayscale(1)' }}>
                  <span className="w-[38px] h-[38px] rounded-full flex items-center justify-center" style={{ background: tint.bg }}>
                    <Icon size={18} strokeWidth={2.2} color={tint.ink} />
                  </span>
                  <p className="text-[11px] font-extrabold mt-2 leading-tight" style={{ color: INK }}>{m.title}</p>
                  <p className="text-[10px] font-bold mt-0.5 leading-tight" style={{ color: GRAY }}>{m.hint}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 7. Sozlamalar ro'yxati ── */}
        <section id="settings-card" className="mt-3 overflow-hidden" style={{ ...CARD, borderRadius: 14 }}>
          <Row
            icon={<FileText size={17} strokeWidth={2.2} color={GREEN} />}
            tint={GREEN_SOFT}
            title="Mening Sertifikatlarim"
            sub={lessonsDone > 0 ? `${lessonsDone} ta rasmiy tasdiqlangan hujjat` : 'Darsni tugatgach birinchi sertifikat'}
            right={<><Pill label="PDF" bg={BLUE_SOFT} ink={BLUE} /><ChevronRight size={16} strokeWidth={2.4} color="#C9D3C4" /></>}
            onClick={() => { triggerHaptic('light'); setCertOpen(true) }}
          />
          <Row
            icon={<Bell size={17} strokeWidth={2.2} color={GOLD} />}
            tint="#FEF3C7"
            title="Bildirishnomalar"
            sub="Har kuni soat 20:00 da dars"
            right={
              <button
                onClick={() => { triggerHaptic('selection'); setNotif(!s.notifOn) }}
                className="relative w-[44px] h-[26px] rounded-full transition-colors"
                style={{ background: s.notifOn ? GREEN : '#E4E9DD' }}
                aria-label="Bildirishnomalarni almashtirish"
              >
                <span
                  className="absolute top-[3px] w-[20px] h-[20px] rounded-full transition-all"
                  style={{ left: s.notifOn ? 21 : 3, background: '#FFFFFF', boxShadow: '0 1px 4px rgba(14,26,18,0.24)' }}
                />
              </button>
            }
          />
          <Row
            icon={<Sun size={17} strokeWidth={2.2} color={GRAY} />}
            tint="#EDEFF5"
            title="Ilova Mavzusi"
            sub={s.theme === 'light' ? "Yorug' (Toza Oq rejim)" : "Qorong'u (Tun rejimi)"}
            right={<><Pill label="Faol" bg={GREEN_SOFT} ink={GREEN} /><ChevronRight size={16} strokeWidth={2.4} color="#C9D3C4" /></>}
            onClick={() => { triggerHaptic('light'); setThemeOpen(true) }}
          />
          <Row
            icon={<HelpCircle size={17} strokeWidth={2.2} color={BLUE} />}
            tint={BLUE_SOFT}
            title="Yordam va Qo'llab-quvvatlash"
            sub="24/7 Telegram kurator"
            right={<ExternalLink size={15} strokeWidth={2.3} color={GRAY} />}
            onClick={() => { triggerHaptic('light'); setHelpOpen(true) }}
          />
          <Row
            last
            icon={<LogOut size={17} strokeWidth={2.3} color={RED} />}
            tint={RED_SOFT}
            title="Tizimdan chiqish"
            titleColor={RED}
            sub="Hisobdan xavfsiz chiqish"
            subColor="rgba(186,26,26,0.6)"
            onClick={() => { triggerHaptic('warning'); setOutOpen(true) }}
          />
        </section>

        {/* ── 8. Footer ── */}
        <footer className="mt-6 text-center" style={{ marginBottom: 24 }}>
          <p className="text-[11px] font-bold" style={{ color: GRAY }}>
            HDP Academy v2.4.0 (Build 892)
          </p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#9AA995' }}>
            Matematika &amp; Fizika ixtisoslashtirilgan maktabi
          </p>
        </footer>
      </div>

      {/* ── Varaqa: profilni tahrirlash ── */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="PROFILNI TAHRIRLASH">
        <Field label="Ism familiya" value={draftName} onChange={setDraftName} placeholder="Aliyev Sardor" />
        <Field label="Telegram foydalanuvchi nomi" value={draftUser} onChange={setDraftUser} placeholder="sardor_hdp" prefix="@" />
        <button
          onClick={saveProfile}
          disabled={!draftName.trim()}
          className="mt-4 w-full h-[48px] text-[13.5px] font-extrabold disabled:opacity-40"
          style={{ background: '#7ED321', color: '#0E1A12', borderRadius: 100 }}
        >
          Saqlash
        </button>
      </Sheet>

      {/* ── Varaqa: bildirishnomalar ── */}
      <Sheet open={bellOpen} onClose={() => setBellOpen(false)} title="BILDIRISHNOMALAR"
        subtitle={s.notifOn ? 'Har kuni 20:00 da eslatma yoqilgan.' : 'Eslatmalar o\'chirilgan.'}>
        <Note label="Bugungi faollik" value={s.solvedToday > 0 ? `${s.solvedToday} ta masala yechildi` : 'Hali birorta masala yechilmadi'} />
        <Note label="Zanjir" value={`${s.streak} kun · rekord ${s.bestStreak} kun`} />
        <Note label="Pro muddati" value={s.isPro && proDays > 0 ? fmtUz(s.proExpires!) : 'Pro yoqilmagan'} />
        <Note label="Buyurtmalar" value={s.orders.length > 0 ? `${s.orders.length} ta sovg'a buyurtma qilingan` : 'Hali buyurtma yo\'q'} />
        <button
          onClick={() => { triggerHaptic('selection'); setBellOpen(false); navigate('/problems') }}
          className="mt-4 w-full h-[48px] text-[13.5px] font-extrabold"
          style={{ background: INK, color: '#CDE9AE', borderRadius: 100 }}
        >
          Kunlik masalaga o'tish
        </button>
      </Sheet>

      {/* ── Varaqa: sertifikatlar ── */}
      <Sheet open={certOpen} onClose={() => setCertOpen(false)} title="SERTIFIKATLAR"
        subtitle="Har bir tugatilgan dars testi uchun bitta hujjat beriladi.">
        {lessonsDone === 0 ? (
          <p className="text-[13px] leading-relaxed" style={{ color: GRAY }}>
            Hozircha sertifikat yo'q. Bepul ro'yxatdagi {freeLessonCount} darsdan birinchi testini yakunlang — hujjat shu yerda paydo bo'ladi.
          </p>
        ) : (
          LESSONS.filter(l => s.lessons[l.id]?.testScore != null).map(l => (
            <div key={l.id} className="flex items-center gap-3" style={{ padding: '12px 2px', borderBottom: `1px solid ${ROW_HAIR}` }}>
              <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0" style={{ background: GREEN_SOFT }}>
                <GraduationCap size={16} strokeWidth={2.2} color={GREEN} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-extrabold truncate" style={{ color: INK }}>{l.title}</p>
                <p className="text-[11px] font-bold" style={{ color: GRAY }}>
                  {s.lessons[l.id]?.testScore}/{s.lessons[l.id]?.testTotal} to'g'ri
                </p>
              </div>
              <Pill label="PDF" bg={BLUE_SOFT} ink={BLUE} />
            </div>
          ))
        )}
        <p className="mt-3 text-[11.5px] leading-relaxed" style={{ color: '#9AA995' }}>
          Tasdiqlangan nusxani akedemiya kuratori beradi — quyidagi «Yordam» bo'limidan so'rang.
        </p>
      </Sheet>

      {/* ── Varaqa: mavzu ── */}
      <Sheet open={themeOpen} onClose={() => setThemeOpen(false)} title="ILOVA MAVZUSI">
        {([
          { key: 'light', label: "Yorug' (Toza Oq rejim)", icon: Sun, ready: true },
          { key: 'dark', label: "Qorong'u (Tun rejimi)", icon: Moon, ready: false },
        ] as const).map(o => {
          const Icon = o.icon
          const active = s.theme === o.key
          return (
            <button
              key={o.key}
              disabled={!o.ready}
              onClick={() => { triggerHaptic('selection'); setTheme(o.key); setThemeOpen(false) }}
              className="w-full flex items-center gap-3 text-left disabled:opacity-45"
              style={{ padding: '14px 2px', borderBottom: `1px solid ${ROW_HAIR}` }}
            >
              <Icon size={17} strokeWidth={2.2} color={active ? GREEN : GRAY} />
              <span className="flex-1 text-[14px] font-extrabold" style={{ color: INK }}>{o.label}</span>
              {!o.ready && <Pill label="Tez orada" bg="#EDEFF5" ink={GRAY} />}
              {active && o.ready && <Check size={17} strokeWidth={3} color={GREEN} />}
            </button>
          )
        })}
      </Sheet>

      {/* ── Varaqa: yordam ── */}
      <Sheet open={helpOpen} onClose={() => setHelpOpen(false)} title="YORDAM VA QO'LLAB-QUVVATLASH">
        <p className="text-[13px] leading-relaxed" style={{ color: GRAY }}>
          Shaxsiy kurator ish vaqtidan tashqarida ham javob beradi. Savol yuborish ilova ochilgan
          Telegram bot menyusi orqali amalga oshiriladi.
        </p>
        <div className="mt-3 space-y-2">
          {[
            ['Kurator javobi', 'Odatda 1 soat ichida'],
            ['Dars jadvali', 'Har kuni 20:00 da eslatma'],
            ['Sertifikat nusxasi', 'Tugatilgan darsdan keyin so\'raladi'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between" style={{ padding: '10px 2px', borderBottom: `1px solid ${ROW_HAIR}` }}>
              <span className="text-[13px] font-extrabold" style={{ color: INK }}>{k}</span>
              <span className="text-[12px] font-bold" style={{ color: GRAY }}>{v}</span>
            </div>
          ))}
        </div>
      </Sheet>

      {/* ── Varaqa: barcha medallar ── */}
      <Sheet open={allOpen} onClose={() => setAllOpen(false)} title="BARCHA MEDALLAR"
        subtitle={`${unlocked.length} / ${ACHIEVEMENTS.length} ochilgan`}>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {ACHIEVEMENTS.map(a => {
            const on = unlockedIds.has(a.id)
            const Icon = ICONS[a.icon]
            const tint = MEDAL_TINT[a.icon]
            return (
              <div key={a.id} className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5"
                style={{ background: '#FAFCF8', border: `1px solid ${HAIR}`, opacity: on ? 1 : 0.4, filter: on ? undefined : 'grayscale(1)' }}>
                <span className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0" style={{ background: tint.bg }}>
                  <Icon size={15} strokeWidth={2.2} color={tint.ink} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold truncate" style={{ color: INK }}>{a.title}</p>
                  <p className="text-[10.5px] font-bold truncate" style={{ color: GRAY }}>{a.hint}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Sheet>

      {/* ── Varaqa: chiqish ── */}
      <Sheet open={outOpen} onClose={() => setOutOpen(false)} title="TIZIMDAN CHIQISH">
        <p className="text-[13px] leading-relaxed" style={{ color: GRAY }}>
          Sessiya yopiladi va boshlang'ich ekranga qaytasiz. Progress — darslar, coin, zanjir va
          buyurtmalar — o'rnida qoladi.
        </p>
        <button
          onClick={() => { triggerHaptic('warning'); setOutOpen(false); signOut(); navigate('/', { replace: true }) }}
          className="mt-4 w-full h-[48px] text-[13.5px] font-extrabold"
          style={{ background: RED, color: '#FFFFFF', borderRadius: 100 }}
        >
          Ha, chiqaman
        </button>
        <button
          onClick={() => { triggerHaptic('light'); setOutOpen(false) }}
          className="mt-2 w-full h-[44px] text-[13px] font-extrabold"
          style={{ background: '#F1F4EC', color: INK, borderRadius: 100 }}
        >
          Bekor qilish
        </button>
      </Sheet>
    </div>
  )
}

/* ── kichik bloklar ── */

const StatCard = ({ icon, tint, label, value, note, noteUp, noteGood }: {
  icon: React.ReactNode
  tint: { background: string }
  label: string
  value: string
  note: string
  noteUp?: boolean
  noteGood?: boolean
}) => (
  <div style={{ ...CARD, borderRadius: 12, padding: 12 }}>
    <div className="flex items-center gap-2">
      <span className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center shrink-0" style={tint}>
        {icon}
      </span>
      <p className="text-[11px] font-bold leading-tight" style={{ color: GRAY }}>{label}</p>
    </div>
    <p className="num text-[22px] font-extrabold mt-2 leading-none" style={{ color: INK, letterSpacing: '-0.02em' }}>
      {value}
    </p>
    <p className="text-[11px] font-bold mt-1.5 flex items-center gap-1"
      style={{ color: noteUp || noteGood ? GREEN : GRAY }}>
      {noteUp && <TrendingUp size={11} strokeWidth={2.8} />}
      {note}
    </p>
  </div>
)

const Pill = ({ label, bg, ink }: { label: string; bg: string; ink: string }) => (
  <span className="text-[10px] font-extrabold px-2 h-[20px] inline-flex items-center rounded-full mr-1.5"
    style={{ background: bg, color: ink }}>
    {label}
  </span>
)

const Row = ({ icon, tint, title, sub, right, onClick, last, titleColor, subColor }: {
  icon: React.ReactNode
  tint: string
  title: string
  sub: string
  right?: React.ReactNode
  onClick?: () => void
  last?: boolean
  titleColor?: string
  subColor?: string
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 text-left active:bg-[#FAFCF8] transition-colors"
    style={{ padding: '14px 16px', borderBottom: last ? undefined : `1px solid ${ROW_HAIR}` }}
  >
    <span className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0" style={{ background: tint }}>
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[13.5px] font-extrabold truncate" style={{ color: titleColor ?? INK }}>{title}</span>
      <span className="block text-[11px] font-bold mt-0.5 truncate" style={{ color: subColor ?? GRAY }}>{sub}</span>
    </span>
    {right && <span className="shrink-0 flex items-center">{right}</span>}
  </button>
)

const Note = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between" style={{ padding: '11px 2px', borderBottom: `1px solid ${ROW_HAIR}` }}>
    <span className="text-[12.5px] font-bold" style={{ color: GRAY }}>{label}</span>
    <span className="text-[12.5px] font-extrabold" style={{ color: INK }}>{value}</span>
  </div>
)

const Field = ({ label, value, onChange, placeholder, prefix }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  prefix?: string
}) => (
  <label className="block mt-2">
    <span className="text-[11px] font-extrabold" style={{ color: GRAY }}>{label}</span>
    <span
      className="mt-1.5 flex items-center h-[48px] px-3.5"
      style={{ background: '#F7FAF4', border: `1px solid ${HAIR}`, borderRadius: 12 }}
    >
      {prefix && <span className="text-[14px] font-extrabold mr-0.5" style={{ color: GRAY }}>{prefix}</span>}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-[14px] font-extrabold"
        style={{ color: INK }}
      />
    </span>
  </label>
)

export default ProfileScreen
