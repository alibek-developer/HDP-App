import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  LESSONS, PROBLEM_SETS, findLesson, findProblemSet,
  CONSUMABLES, PRO_TRIAL, BOOST_CARD, DAILY_BONUS, findProduct, streakReward,
  type ConsumableKind,
} from '../data/content'
import {
  findTopic, findTopicLesson, topicLessonIds as lessonIdsOf, topicTestOf,
} from '../data/curriculum'
import { PROBLEM_LEVELS, starsForLevel, weekStartKey } from '../data/problems'
import { isFreeLessonId } from '../data/paywall'

/**
 * Ilovaning yagona holat manbai.
 * Bu yerda oqim qoidalari yashaydi:
 *  - 10 ta dars bepul, qolgani faqat Pro
 *  - video tugamasa -> misolga o'tish yopiq
 *  - misol yechilmasa -> testga o'tish yopiq
 *  - har to'g'ri javob coin/XP keltiradi
 */

export type Stage = 'new' | 'video' | 'example' | 'test' | 'done'

/** Hisob raqami — faqat hisob ochilganda bir marta yaratiladi */
const makePublicId = () => `HDP-${Math.floor(100000 + Math.random() * 900000)}`

/** Ism familiyadan Telegram uslubidagi username: «Ali Karimov» → ali_karimov */
const handleOf = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')

export interface LessonProgress {
  videoWatched: boolean
  exampleDone: boolean
  testScore: number | null
  testTotal: number | null
}

const emptyProgress = (): LessonProgress => ({
  videoWatched: false,
  exampleDone: false,
  testScore: null,
  testTotal: null,
})

export interface SessionResult {
  /** 'lesson-test' | 'problem-set' | 'daily' | 'topic-test' */
  kind: 'lesson-test' | 'problem-set' | 'daily' | 'topic-test'
  refId: string
  title: string
  /** foydalanuvchi javoblari, tartib saqlanadi. `skipped` — o'tkazilgan, xato emas */
  answers: { qid?: string; prompt: string; picked: number; correct: number; options: string[]; explain: string; ok: boolean; skipped?: boolean }[]
  coinsEarned: number
  xpEarned: number
  /** daraja sessiyasida qo'lga kiritilgan yulduz (0..3) */
  stars?: number
}

/** Kunlik AI masala — kuniga bitta, javobdan keyin qulflanadi */
export interface DailyQuestion {
  /** qaysi kunga tegishli (YYYY-MM-DD) */
  day: string
  topic: string
  topicNum: number
  difficulty: string
  prompt: string
  options: string[]
  correct: number
  explain: string
  /** 'ai' — serverdan (tekshirilgan); 'gen' — ilovada tuzilgan; 'bank' — mavzu testidan */
  source: 'ai' | 'gen' | 'bank'
  /** tanlangan variant; null — hali javob berilmagan */
  picked: number | null
}

/** Do'kon xarid tarixi yozuvi */
export interface TxEntry {
  title: string
  cost: number
  /** ISO sana */
  at: string
}

/** Haqiqiy sovg'a buyurtmasi */
export interface OrderEntry {
  productId: string
  title: string
  price: number
  at: string
}

/** Mahsulotga yozilgan izoh */
export interface ReviewEntry {
  id: string
  productId: string
  name: string
  rating: number
  text: string
  at: string
}

/** Mavzu bo'limini yakunlash mukofoti */
export const TOPIC_LESSON_REWARD = { coin: 5, xp: 20 }

/** Bitta mavzu bo'limi holati */
export interface TopicLessonState {
  /** video dars ochilgan (bosilgan) */
  videoSeen: boolean
  /** bo'lim yakunlangan */
  done: boolean
}

/** Mavzu yakuniy testi yozuvi */
export interface TopicTestEntry {
  score: number
  total: number
  /** ISO sana */
  at: string
}

interface AppState {
  /* ── Profil ── */
  name: string
  username: string
  publicId: string
  /** Email hisobi bilan kirganda saqlanadi (hozircha lokal — server tekshiruvi yo'q) */
  email: string | null
  /** Telegram tasdiqlagan foydalanuvchi ID'si (bot orqali keladi) */
  telegramId: number | null
  /** Onboardingda tanlangan maqsad (masalan «DTM 100 ball») */
  studyGoal: string | null
  /** Onboardingda kiritilgan tug'ilgan sana (KK.OO.YYYY) */
  birthDate: string | null
  /** Profil rasmi */
  photoUrl: string | null
  level: number
  xp: number
  coin: number
  streak: number
  /** eng uzun ketma-ket kun zanjiri */
  bestStreak: number
  /** Blitz sprintdagi eng yaxshi ball */
  blitzBest: number
  /** Blitz sprint necha marta o'ynalgan */
  blitzPlays: number
  /** mini-o'yin eng yaxshi yulduzi: `balance:easy` -> 0..3 */
  gameStars: Record<string, number>
  /** mini-o'yin sessiyalari: `balance` -> o'ynalgan soni */
  gamePlays: Record<string, number>
  /** zanjir uzilmagan oxirgi kun */
  lastActiveDay: string | null
  solvedCount: number
  /** javob berilgan savollar (o'tkazib yuborilganlar sansiz) */
  answeredTotal: number
  answeredCorrect: number
  isPro: boolean
  proExpires: string | null
  /** kun -> shu kunda o'qilgan daqiqa */
  studyMinutes: Record<string, number>
  /** ochilgan seans boshlanish vaqti (ms); daqiqa hisobi shundan */
  sessionStartedAt: number | null
  notifOn: boolean
  theme: 'light' | 'dark'

  /* ── Progressiya ── */
  lessons: Record<number, LessonProgress>
  /** to'plamda yechilgan savol id'lari */
  solvedQuestions: Record<string, string[]>
  /** Masalalar darajalari: `algebra-oson` -> eng yaxshi yulduz (0..3) */
  levelStars: Record<string, number>
  /** haftalik yulduz maqsadi: joriy hafta kaliti (dushanba) */
  starWeek: string
  /** shu haftada yangi olingan yulduzlar */
  starsThisWeek: number
  /** coin evaziga ochilgan to'plamlar */
  unlocked: string[]
  /** kunlik hisoblagichlar kaliti (sana) — o'zgarsa nollanadi */
  day: string
  solvedToday: number
  olympToday: number
  claimedMissions: string[]
  /** kunlik mega masala bonusi olingan sana */
  dailyBonusOn: string | null
  /** kunlik streak bonusi olingan sana */
  streakBonusClaimed: string | null
  /** ochilishda taklif qilingan zanjir bonusi (modal olinguncha) — saqlanmaydi */
  streakGift: number
  /** endigina olingan bonus — sarlavha animatsiyasi uchun, saqlanmaydi */
  streakBurst: number
  /** bugungi AI masala (kun yarim tunda almashadi) */
  dailyQuestion: DailyQuestion | null
  /** oxirgi natija ekrani ma'lumoti */
  lastResult: SessionResult | null
  /** zanjir davomida ochib turadigan dars id'si */
  activeLessonId: number | null
  /** Hisob ochilgan — keyingi ochilishda ro'yxatdan o'tkazmaymiz */
  authed: boolean
  onboarded: boolean
  /** mavzu bo'limi: '1.1'…'10.8' -> yakunlangan */
  topicLessons: Record<string, TopicLessonState>
  /** mavzu raqami -> yakuniy test natijasi (eng yaxshi urinish) */
  topicTests: Record<number, TopicTestEntry>

  /* ── Do'kon ── */
  /** sotib olingan, hali ishlatilmagan buyumlar: buyum id -> soni */
  inventory: Record<string, number>
  /** oxirgi xaridlar (yangisi boshida) */
  txLog: TxEntry[]
  /** foydalanuvchi «nega yig'ayapman» deb tanlagan buyum/to'plam id'si */
  goalId: string | null
  /** coin evaziga Pro sinovi olingan oy (YYYY-MM) */
  proTrialMonth: string | null
  /** 2x bonus kartasi faolmi — keyingi seansda sarflanadi */
  boostActive: boolean
  /** berilgan buyurtmalar: haqiqiy sovg'alar */
  orders: OrderEntry[]
  /** ombordan olingan donalar: mahsulot id -> soni */
  stockTaken: Record<string, number>
  /** foydalanuvchining own izohlari */
  reviews: ReviewEntry[]
  /** «keyin olaman» deb belgilangan mahsulotlar */
  favs: string[]

  /* ── Actions ── */
  setOnboarded: () => void
  /** Onboarding yakuni: maqsad + tug'ilgan sana saqlanadi va `onboarded` yonadi */
  saveStudyProfile: (goal: string, birthDate: string) => void
  /** Kirish — saqlangan qurilmadagi hisobga username bilan */
  signInWithUsername: (username: string) => void
  /** Telegram bot tasdiqlagan haqiqiy profil bilan kirish */
  signInWithTelegram: (name: string, username: string, telegramId: number) => void
  /** Login/ro'yxatdan o'tishda profil ma'lumotlari */
  setProfile: (name: string, username: string) => void
  /** Seans boshlandi — daqiqa hisobi shu nuqtadan yuriladi */
  beginSession: () => void
  startLesson: (id: number) => void
  markVideoWatched: (id: number) => void
  markExampleDone: (id: number) => void
  /** testni yakunlash: coin/XP yig'ish va natijani saqlash */
  finishLessonTest: (lessonId: number, result: SessionResult) => void
  finishProblemSet: (setId: string, result: SessionResult) => void
  finishDaily: (result: SessionResult) => void
  /** bugungi savolni saqlash (AI yoki zaxira) */
  setDailyQuestion: (question: DailyQuestion) => void
  /** javobni qayd etish — to'g'ri bo'lsa kunlik bonus, keyin qulflanadi */
  answerDailyQuestion: (picked: number) => void
  /** Blitz sprint yakuni: ball, coin/XP (sessiya va zanjir hisobi bilan) */
  creditBlitz: (coins: number, xp: number, score: number) => void
  /** Mini-o'yin yakuni: daraja rekordi + coin/XP */
  creditGame: (gameId: string, levelId: string, stars: number, coins: number, xp: number) => void
  /** Mavzu bo'limida video dars ochildi */
  markTopicVideoSeen: (id: string) => void
  /** Mavzu bo'limini yakunlash — bir marta mukofot beradi */
  completeTopicLesson: (id: string) => void
  /** Mavzu yakuniy testini yozish (eng yaxshi urinish saqlanadi) */
  finishTopicTest: (topicNum: number, result: SessionResult) => void
  subscribePro: (months: number) => void
  cancelPro: () => void
  spendCoins: (amount: number) => boolean
  /** to'plamni coin evaziga ochish */
  unlockSet: (id: string, price: number) => boolean
  /** sana o'zgarganda kunlik hisoblagichlarni nollash */
  rollDay: () => void
  /** ilova ochildi: kunni aylantiradi, zanjirni belgilaydi va bonusni taklif qiladi */
  enterApp: () => void
  claimMission: (key: string, reward: number) => void
  /** zanjir bonusini olish — tanga shu yerda qo'shiladi */
  claimStreakGift: () => void
  /** modal olinmasdan yopildi — bonus berilmaydi */
  dismissStreakGift: () => void
  /** sarlavha animatsiyasi ko'rsatildi */
  clearStreakBurst: () => void
  resetAll: () => void

  /* ── Do'kon actions ── */
  buyConsumable: (id: string) => boolean
  buyProTrial: () => 'ok' | 'poor' | 'used'
  /** Pro muddatini kunlarga cho'zish (sana hisobi shu yerda) */
  grantProDays: (days: number) => void
  setGoal: (id: string | null) => void
  /** buyumni ishlatish: soni 1 ga kamayadi */
  useConsumable: (kind: ConsumableKind) => boolean
  /** holdagi buyum soni */
  heldCount: (id: string) => number
  /** haqiqiy sovg'a buyurtmasi: coin yechiladi, ombor kamayadi */
  buyProduct: (id: string) => 'ok' | 'poor' | 'out'
  /** ombordagi qolgan dona (buyurtmalar bilan kamaygan) */
  stockLeft: (id: string) => number
  /** mahsulot buyurtma qilinganmi */
  ordered: (id: string) => boolean
  addReview: (productId: string, rating: number, text: string) => boolean
  /** mahsulot izohlari (o'nikisi boshida) */
  reviewsFor: (productId: string) => ReviewEntry[]
  toggleFav: (id: string) => void

  /* ── Sozlamalar ── */
  setNotif: (on: boolean) => void
  setTheme: (t: 'light' | 'dark') => void
  /** Hisobdan chiqish — progress saqlanadi, faqat sessiya yopiladi */
  signOut: () => void

  /* ── Derived ── */
  lessonStage: (id: number) => Stage
  canOpenLesson: (id: number) => boolean
  canEnterExample: (id: number) => boolean
  canEnterTest: (id: number) => boolean
  canOpenSet: (id: string) => boolean
  xpForNext: () => number
  /** mavzu bo'limi holati */
  topicLessonState: (id: string) => TopicLessonState
  /** bo'lim ochiladimi — yakunlangan, bepul yoki Pro */
  canOpenTopicLesson: (id: string) => boolean
  /** necha bo'lim yakunlangan */
  topicLessonsDone: (topicNum: number) => number
  /** yakuniy test ochilganmi — barcha bo'limlar tugasa */
  canEnterTopicTest: (topicNum: number) => boolean
  /** mavzu to'liq yopilmiganmi (test o'tish chegarasi bilan) */
  topicFinished: (topicNum: number) => boolean
}

/** Kun kaliti — foydalanuvchining mahalliy vaqti bo'yicha (YYYY-MM-DD) */
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const todayKey = () => dayKey(new Date())

const XP_STEP = 1000

/** Daraja har 1000 XP da ko'tariladi */
function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_STEP) + 1
}

/** 2x kartasi faol bo'lsa seans coinlarini ikkilantiradi (natija ekrani ham shuni ko'rsatadi) */
function applyBoost(s: { boostActive: boolean }, result: SessionResult): SessionResult {
  if (!s.boostActive) return result
  return { ...result, coinsEarned: result.coinsEarned * 2 }
}

/** Seans yakunida kartani sarflash */
function boostConsume(s: { boostActive: boolean }): Partial<AppState> {
  return s.boostActive ? { boostActive: false } : {}
}

/** Xaridni tarixga yozish (eng yangi boshida, 20 tagacha) */
function tx(entry: TxEntry, log: TxEntry[]): TxEntry[] {
  return [entry, ...log].slice(0, 20)
}

/**
 * Zanjir — ketma-ket kunlarda faol bo'lish.
 * Bugun allaqachon qayd bo'lsa o'zgarmaydi; kecha bo'lsa +1; aks holda 1 dan boshlanadi.
 */
function bumpStreak(
  s: { streak: number; bestStreak: number; lastActiveDay: string | null },
  day: string,
): Partial<AppState> {
  if (s.lastActiveDay === day) return {}
  const yesterday = dayKey(new Date(Date.now() - 86_400_000))
  const streak = s.lastActiveDay === yesterday ? s.streak + 1 : 1
  return { streak, lastActiveDay: day, bestStreak: Math.max(s.bestStreak, streak) }
}

/** Kun o'zgarganda nollanadigan kunlik hisoblagichlar */
function dayReset(day: string): Partial<AppState> {
  return { day, solvedToday: 0, olympToday: 0, claimedMissions: [], streakBonusClaimed: null }
}

/** Seans davomiyligini kunlik o'qilgan daqiqalarga qo'shish */
function creditMinutes(
  s: { sessionStartedAt: number | null; studyMinutes: Record<string, number> },
  day: string,
): Partial<AppState> {
  if (s.sessionStartedAt === null) return {}
  const mins = Math.min(120, Math.round((Date.now() - s.sessionStartedAt) / 60_000))
  const started: Partial<AppState> = { sessionStartedAt: null }
  if (mins <= 0) return started
  return {
    ...started,
    studyMinutes: { ...s.studyMinutes, [day]: (s.studyMinutes[day] ?? 0) + mins },
  }
}

/** Javob berilgan savollar va to'g'rilari — aniqlik foizi shundan */
function creditAnswers(
  s: { answeredTotal: number; answeredCorrect: number },
  result: SessionResult,
): Partial<AppState> {
  const answered = result.answers.filter(a => !a.skipped).length
  const ok = result.answers.filter(a => a.ok).length
  return { answeredTotal: s.answeredTotal + answered, answeredCorrect: s.answeredCorrect + ok }
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      name: '',
      username: '',
      publicId: '',
      email: null,
      telegramId: null,
      studyGoal: null,
      birthDate: null,
      photoUrl: null,
      level: 1,
      xp: 0,
      coin: 0,
      streak: 0,
      bestStreak: 0,
      blitzBest: 0,
      blitzPlays: 0,
      gameStars: {},
      gamePlays: {},
      lastActiveDay: null,
      solvedCount: 0,
      answeredTotal: 0,
      answeredCorrect: 0,
      isPro: false,
      proExpires: null,
      studyMinutes: {},
      sessionStartedAt: null,
      notifOn: true,
      theme: 'light',

      lessons: {},
      solvedQuestions: {},
      levelStars: {},
      starWeek: weekStartKey(),
      starsThisWeek: 0,
      unlocked: [],
      day: todayKey(),
      solvedToday: 0,
      olympToday: 0,
      claimedMissions: [],
      dailyBonusOn: null,
      streakBonusClaimed: null,
      streakGift: 0,
      streakBurst: 0,
      dailyQuestion: null,
      lastResult: null,
      activeLessonId: null,
      authed: false,
      onboarded: false,
      topicLessons: {},
      topicTests: {},

      inventory: {},
      txLog: [],
      goalId: null,
      proTrialMonth: null,
      boostActive: false,
      orders: [],
      stockTaken: {},
      reviews: [],
      favs: [],

      setOnboarded: () => set({ onboarded: true }),

      saveStudyProfile: (goal, birthDate) => set({ studyGoal: goal, birthDate, onboarded: true }),

      signInWithUsername: (username) =>
        set((s) => {
          const handle = handleOf(username)
          return {
            username: handle,
            name: s.name.trim() || handle,
            email: null,
            publicId: s.publicId || makePublicId(),
            authed: true,
          }
        }),

      signInWithTelegram: (name, username, telegramId) =>
        set((s) => {
          const clean = name.trim()
          return {
            name: clean,
            username: handleOf(username) || s.username || handleOf(clean),
            email: null,
            telegramId,
            publicId: s.publicId || makePublicId(),
            authed: true,
          }
        }),

      /** Profil tahriri — hisob raqami (publicId) o'zgarmaydi */
      setProfile: (name, username) =>
        set((s) => ({ name, username, publicId: s.publicId || makePublicId() })),

      beginSession: () => {
        if (get().sessionStartedAt !== null) return
        set({ sessionStartedAt: Date.now() })
      },

      startLesson: (id) => set({ activeLessonId: id }),

      markVideoWatched: (id) =>
        set((s) => {
          const day = todayKey()
          return {
            lessons: {
              ...s.lessons,
              [id]: { ...emptyProgress(), ...s.lessons[id], videoWatched: true },
            },
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
          }
        }),

      markExampleDone: (id) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [id]: { ...emptyProgress(), ...s.lessons[id], exampleDone: true },
          },
        })),

      finishLessonTest: (lessonId, result) =>
        set((s) => {
          const day = todayKey()
          const ok = result.answers.filter((a) => a.ok).length
          const prev = s.lessons[lessonId]
          /** Test faqat birinchi topshirilganda to'lanadi — qayta yechish mashq */
          const firstPass = !prev || prev.testScore === null
          const credited = firstPass ? applyBoost(s, result) : { ...result, coinsEarned: 0, xpEarned: 0 }
          return {
            lessons: {
              ...s.lessons,
              [lessonId]: {
                ...emptyProgress(),
                ...prev,
                videoWatched: true,
                exampleDone: true,
                testScore: Math.max(prev?.testScore ?? 0, ok),
                testTotal: result.answers.length,
              },
            },
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + credited.xpEarned,
            level: levelFromXp(s.xp + credited.xpEarned),
            solvedCount: s.solvedCount + (firstPass ? ok : 0),
            lastResult: credited,
            activeLessonId: lessonId,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...(firstPass ? creditAnswers(s, result) : {}),
            ...(firstPass ? boostConsume(s) : {}),
          }
        }),

      finishProblemSet: (setId, result) =>
        set((s) => {
          const day = todayKey()
          const rolled = s.day !== day
          const prev = s.solvedQuestions[setId] ?? []
          /** Savol id bo'yicha hisoblanadi — sessiyada tartib har safar boshqacha */
          const now = result.answers
            .map((a, i) => (a.ok ? a.qid ?? result.refId + '#' + i : null))
            .filter(Boolean) as string[]
          /** Faqat shu urinishda birinchi marta to'g'ri yechilgan savollar to'lanadi */
          const newly = now.filter(id => !prev.includes(id)).length
          const solved = findProblemSet(setId)
          const credited = applyBoost(s, result)
          /**
           * Daraja sessiyasi: yulduz eng yaxshi natijadan pastga tushmaydi,
           * haftalik maqsadga faqat yangi (yaxshilangan) yulduz qo'shiladi —
           * bir darajani takrorlab yulduz yig'ib bo'lmaydi.
           */
          const isLevel = !!solved?.levelSet
          const stars = isLevel
            ? starsForLevel(result.answers.filter((a) => a.ok).length, result.answers.length)
            : 0
          const prevStars = s.levelStars[setId] ?? 0
          const week = weekStartKey()
          const weekSame = s.starWeek === week
          return {
            solvedQuestions: { ...s.solvedQuestions, [setId]: [...new Set([...prev, ...now])] },
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + credited.xpEarned,
            level: levelFromXp(s.xp + credited.xpEarned),
            solvedCount: s.solvedCount + newly,
            day,
            solvedToday: (rolled ? 0 : s.solvedToday) + newly,
            olympToday: (rolled ? 0 : s.olympToday) + (solved?.topic === 'Olimpiada' ? newly : 0),
            claimedMissions: rolled ? [] : s.claimedMissions,
            lastResult: isLevel ? { ...credited, stars } : credited,
            ...(isLevel
              ? {
                  levelStars: { ...s.levelStars, [setId]: Math.max(prevStars, stars) },
                  starWeek: week,
                  starsThisWeek: (weekSame ? s.starsThisWeek : 0) + Math.max(0, stars - prevStars),
                }
              : {}),
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...(newly > 0 ? creditAnswers(s, result) : {}),
            ...(newly > 0 ? boostConsume(s) : {}),
          }
        }),

      /** Blits — savol natijalari saqlanmaydi, faqat yakuniy coin/XP qayd etiladi */
      creditBlitz: (coins, xp, score) =>
        set((s) => {
          const base = {
            blitzBest: Math.max(s.blitzBest, score),
            blitzPlays: s.blitzPlays + 1,
          }
          if (coins <= 0 && xp <= 0) return base
          const day = todayKey()
          return {
            ...base,
            coin: s.coin + coins,
            xp: s.xp + xp,
            level: levelFromXp(s.xp + xp),
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
          }
        }),

      /** Mini-o'yin yakuni — daraja rekordi pasaymaydi, coin/XP har sessiyada yoziladi */
      creditGame: (gameId, levelId, stars, coins, xp) =>
        set((s) => {
          const key = `${gameId}:${levelId}`
          const day = todayKey()
          return {
            gameStars: { ...s.gameStars, [key]: Math.max(s.gameStars[key] ?? 0, stars) },
            gamePlays: { ...s.gamePlays, [gameId]: (s.gamePlays[gameId] ?? 0) + 1 },
            coin: s.coin + coins,
            xp: s.xp + xp,
            level: levelFromXp(s.xp + xp),
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
          }
        }),

      finishDaily: (result) =>
        set((s) => {
          const day = todayKey()
          return {
            coin: s.coin + result.coinsEarned,
            xp: s.xp + result.xpEarned,
            level: levelFromXp(s.xp + result.xpEarned),
            solvedCount: s.solvedCount + result.answers.filter((a) => a.ok).length,
            lastResult: result,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...creditAnswers(s, result),
          }
        }),

      /** Bugungi savolni saqlash — ekran va Home kartasi bitta nusxani o'qiydi */
      setDailyQuestion: (question) => set({ dailyQuestion: question }),

      /** Javob: to'g'ri bo'lsa DAILY_BONUS, xato bo'lsa faqat qayd etiladi */
      answerDailyQuestion: (picked) =>
        set((s) => {
          const q = s.dailyQuestion
          const day = todayKey()
          if (!q || q.day !== day || q.picked !== null) return {}
          const ok = picked === q.correct
          const coin = ok ? DAILY_BONUS.coin : 0
          const xp = ok ? DAILY_BONUS.xp : 0
          const result: SessionResult = {
            kind: 'daily',
            refId: `daily-${q.topicNum}`,
            title: q.topic || 'Kunlik masala',
            answers: [
              {
                prompt: q.prompt,
                picked,
                correct: q.correct,
                options: q.options,
                explain: q.explain,
                ok,
              },
            ],
            coinsEarned: coin,
            xpEarned: xp,
          }
          const credited = applyBoost(s, result)
          const rolled = s.day !== day
          return {
            dailyQuestion: { ...q, picked },
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + credited.xpEarned,
            level: levelFromXp(s.xp + credited.xpEarned),
            solvedCount: s.solvedCount + (ok ? 1 : 0),
            day,
            solvedToday: (rolled ? 0 : s.solvedToday) + (ok ? 1 : 0),
            claimedMissions: rolled ? [] : s.claimedMissions,
            dailyBonusOn: ok ? day : s.dailyBonusOn,
            lastResult: credited,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...creditAnswers(s, result),
            ...boostConsume(s),
          }
        }),

      /** Mavzu bo'limining videolari 95% ko'rildi — videosi bor bo'lim faqat shundagina yakunlanadi */
      markTopicVideoSeen: (id) =>
        set((s) => ({
          topicLessons: {
            ...s.topicLessons,
            [id]: { videoSeen: true, done: s.topicLessons[id]?.done ?? false },
          },
        })),

      /** Bo'lim yakunlandi: coin/XP bir marta, keyingi urinishda berilmaydi */
      completeTopicLesson: (id) =>
        set((s) => {
          const lesson = findTopicLesson(id)
          if (!lesson) return {}
          const prev = s.topicLessons[id] ?? { videoSeen: false, done: false }
          if (prev.done) return {}
          const day = todayKey()
          return {
            topicLessons: { ...s.topicLessons, [id]: { ...prev, done: true } },
            coin: s.coin + TOPIC_LESSON_REWARD.coin,
            xp: s.xp + TOPIC_LESSON_REWARD.xp,
            level: levelFromXp(s.xp + TOPIC_LESSON_REWARD.xp),
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
          }
        }),

      /** Yakuniy test — eng yaxshi natija saqlanadi, faqat oshgan qismi to'lanadi */
      finishTopicTest: (topicNum, result) =>
        set((s) => {
          const test = topicTestOf(topicNum)
          if (!test) return {}
          const day = todayKey()
          const ok = result.answers.filter((a) => a.ok).length
          const prev = s.topicTests[topicNum]
          /** Qayta yechishda faqat oldingi eng yaxshi natijadan oshgan savollar to'lanadi */
          const gained = Math.max(0, ok - (prev?.score ?? 0))
          const credited = applyBoost(s, {
            ...result,
            coinsEarned: gained * test.coinPerSolve,
            xpEarned: gained * test.xpPerSolve,
          })
          const best = !prev || ok > prev.score ? { score: ok, total: result.answers.length, at: new Date().toISOString() } : prev
          return {
            topicTests: { ...s.topicTests, [topicNum]: best },
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + credited.xpEarned,
            level: levelFromXp(s.xp + credited.xpEarned),
            solvedCount: s.solvedCount + gained,
            lastResult: credited,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...(gained > 0 ? creditAnswers(s, result) : {}),
            ...(gained > 0 ? boostConsume(s) : {}),
          }
        }),

      subscribePro: (months) => {
        const until = new Date()
        until.setMonth(until.getMonth() + months)
        set({ isPro: true, proExpires: until.toISOString().slice(0, 10) })
      },

      cancelPro: () => set({ isPro: false, proExpires: null }),

      spendCoins: (amount) => {
        if (get().coin < amount) return false
        set((s) => ({ coin: s.coin - amount }))
        return true
      },

      /** To'plamni coin evaziga ochish — bir marta, abadiy */
      unlockSet: (id, price) => {
        if (get().unlocked.includes(id)) return true
        if (get().coin < price) return false
        const setItem = findProblemSet(id)
        set((s) => ({
          coin: s.coin - price,
          unlocked: [...s.unlocked, id],
          txLog: tx({ title: setItem?.title ?? id, cost: price, at: new Date().toISOString() }, s.txLog),
        }))
        return true
      },

      /** Sana o'zgarsa kunlik hisoblagichlarni nollash */
      rollDay: () => {
        const day = todayKey()
        if (get().day === day) return
        set(dayReset(day))
      },

      /**
       * Ilova ochildi: kun aylanadi, zanjir bugun uchun qayd bo'ladi va
       * kunlik bonus taklif qilinadi. Tanga modalda «olish» bosilganda qo'shiladi.
       * Hozircha har kirishda taklif etiladi — vaqtga bog'lash keyingi bosqichda.
       */
      enterApp: () => {
        const s = get()
        if (!s.onboarded) return
        const day = todayKey()
        const patch: Partial<AppState> = {
          ...(s.day !== day ? dayReset(day) : {}),
          ...bumpStreak(s, day),
        }
        const streak = patch.streak ?? s.streak
        if (streak > 0) patch.streakGift = streakReward(streak)
        if (Object.keys(patch).length === 0) return
        set(patch)
      },

      claimMission: (key, reward) => {
        const s = get()
        if (s.claimedMissions.includes(key)) return
        set({ coin: s.coin + reward, claimedMissions: [...s.claimedMissions, key] })
      },

      claimStreakGift: () => {
        const s = get()
        if (s.streakGift <= 0) return
        set({
          coin: s.coin + s.streakGift,
          streakBonusClaimed: todayKey(),
          streakBurst: s.streakGift,
          streakGift: 0,
        })
      },

      dismissStreakGift: () => {
        if (get().streakGift === 0) return
        set({ streakGift: 0 })
      },

      clearStreakBurst: () => {
        if (get().streakBurst === 0) return
        set({ streakBurst: 0 })
      },

      /* ── Do'kon ── */

      /** Buyum sotib olish: coin kamayadi, inventory ko'payadi (2x karta darhol faol) */
      buyConsumable: (id) => {
        const s = get()
        const item = id === BOOST_CARD.id ? null : CONSUMABLES.find(c => c.id === id)
        const cost = item ? item.cost : id === BOOST_CARD.id ? BOOST_CARD.cost : 0
        if (!cost || s.coin < cost) return false

        if (!item) {
          if (s.boostActive) return false
          set({
            coin: s.coin - cost,
            boostActive: true,
            txLog: tx({ title: BOOST_CARD.title, cost, at: new Date().toISOString() }, s.txLog),
          })
          return true
        }

        const held = s.inventory[item.id] ?? 0
        if (held >= item.maxHold) return false
        set({
          coin: s.coin - cost,
          inventory: { ...s.inventory, [item.id]: held + 1 },
          txLog: tx({ title: item.title, cost, at: new Date().toISOString() }, s.txLog),
        })
        return true
      },

      /** Coin evaziga 7 kunlik Pro — oyiga bir marta */
      buyProTrial: () => {
        const s = get()
        const month = todayKey().slice(0, 7)
        if (s.proTrialMonth === month) return 'used'
        if (s.coin < PRO_TRIAL.coin) return 'poor'
        set({
          coin: s.coin - PRO_TRIAL.coin,
          proTrialMonth: month,
          txLog: tx({ title: PRO_TRIAL.title, cost: PRO_TRIAL.coin, at: new Date().toISOString() }, s.txLog),
        })
        get().grantProDays(PRO_TRIAL.days)
        return 'ok'
      },

      /** Pro muddati: mavjud sana oxiridan qo'shiladi, tugagan bo'lsa bugundan */
      grantProDays: (days) => {
        const s = get()
        const current = s.isPro && s.proExpires ? Date.parse(s.proExpires + 'T00:00:00') : 0
        const from = Math.max(current, Date.now())
        const until = new Date(from + days * 86400000)
        set({ isPro: true, proExpires: until.toISOString().slice(0, 10) })
      },

      setGoal: (id) => set({ goalId: id }),

      useConsumable: (kind) => {
        const s = get()
        const item = CONSUMABLES.find(c => c.kind === kind)
        if (!item) return false
        const held = s.inventory[item.id] ?? 0
        if (held <= 0) return false
        set({ inventory: { ...s.inventory, [item.id]: held - 1 } })
        return true
      },

      heldCount: (id) => get().inventory[id] ?? 0,

      /** Sovg'a buyurtmasi — coin yechiladi, ombor dona kamayadi, tarixga yoziladi */
      buyProduct: (id) => {
        const s = get()
        const product = findProduct(id)
        if (!product) return 'out'
        const left = product.stock - (s.stockTaken[id] ?? 0)
        if (left <= 0) return 'out'
        if (s.coin < product.price) return 'poor'
        const at = new Date().toISOString()
        set({
          coin: s.coin - product.price,
          stockTaken: { ...s.stockTaken, [id]: (s.stockTaken[id] ?? 0) + 1 },
          orders: [{ productId: id, title: product.title, price: product.price, at }, ...s.orders].slice(0, 30),
          txLog: tx({ title: product.title, cost: product.price, at }, s.txLog),
        })
        return 'ok'
      },

      stockLeft: (id) => {
        const product = findProduct(id)
        if (!product) return 0
        return Math.max(0, product.stock - (get().stockTaken[id] ?? 0))
      },

      ordered: (id) => get().orders.some(o => o.productId === id),

      addReview: (productId, rating, text) => {
        const s = get()
        const clean = text.trim()
        if (!findProduct(productId) || clean.length < 3) return false
        const entry: ReviewEntry = {
          id: 'r' + Date.now().toString(36),
          productId,
          name: s.name.split(' ')[0] || 'Siz',
          rating: Math.min(5, Math.max(1, rating)),
          text: clean.slice(0, 300),
          at: new Date().toISOString(),
        }
        set({ reviews: [entry, ...s.reviews] })
        return true
      },

      reviewsFor: (productId) => get().reviews.filter(r => r.productId === productId),

      toggleFav: (id) =>
        set((s) => ({
          favs: s.favs.includes(id) ? s.favs.filter(f => f !== id) : [...s.favs, id],
        })),

      /* ── Sozlamalar ── */

      setNotif: (on) => set({ notifOn: on }),

      setTheme: (t) => set({ theme: t }),

      signOut: () =>
        set({
          authed: false,
          onboarded: false,
          sessionStartedAt: null,
          photoUrl: null,
          email: null,
          telegramId: null,
          name: '',
          username: '',
          publicId: '',
          studyGoal: null,
          birthDate: null,
        }),

      resetAll: () =>
        set({
          xp: 0,
          coin: 0,
          level: 1,
          streak: 0,
          bestStreak: 0,
          blitzBest: 0,
          blitzPlays: 0,
          gameStars: {},
          gamePlays: {},
          lastActiveDay: null,
          photoUrl: null,
          name: '',
          username: '',
          publicId: '',
          email: null,
          telegramId: null,
          studyGoal: null,
          birthDate: null,
          solvedCount: 0,
          answeredTotal: 0,
          answeredCorrect: 0,
          isPro: false,
          proExpires: null,
          studyMinutes: {},
          sessionStartedAt: null,
          lessons: {},
          solvedQuestions: {},
          levelStars: {},
          starWeek: weekStartKey(),
          starsThisWeek: 0,
          unlocked: [],
          solvedToday: 0,
          olympToday: 0,
          claimedMissions: [],
          dailyBonusOn: null,
          streakBonusClaimed: null,
          streakGift: 0,
          streakBurst: 0,
          dailyQuestion: null,
          lastResult: null,
          activeLessonId: null,
          authed: false,
          onboarded: false,
          topicLessons: {},
          topicTests: {},
          inventory: {},
          txLog: [],
          goalId: null,
          proTrialMonth: null,
          boostActive: false,
          orders: [],
          stockTaken: {},
          reviews: [],
          favs: [],
        }),

      lessonStage: (id) => {
        const p = get().lessons[id] ?? emptyProgress()
        if (p.testScore !== null) return 'done'
        if (p.exampleDone) return 'test'
        if (p.videoWatched) return 'example'
        return 'new'
      },

      /** Bepul darslar — hammanyaga; qolgani faqat Pro */
      canOpenLesson: (id) => {
        const lesson = findLesson(id)
        if (!lesson) return false
        return lesson.free || get().isPro
      },

      /** Video tugamagan bo'lsa — misolga kirib bo'lmaydi */
      canEnterExample: (id) => !!get().lessons[id]?.videoWatched,

      /** Misol yechilmagan bo'lsa — testga kirib bo'lmaydi */
      canEnterTest: (id) => !!get().lessons[id]?.exampleDone,

      /** Bepul to'plam hammaga; Pro yoki ochilganlar qolganiga ham kiradi */
      canOpenSet: (id) => {
        const set = findProblemSet(id)
        if (!set) return false
        return set.free || get().isPro || get().unlocked.includes(id)
      },

      xpForNext: () => {
        const { xp } = get()
        return (Math.floor(xp / XP_STEP) + 1) * XP_STEP - xp
      },

      topicLessonState: (id) => get().topicLessons[id] ?? { videoSeen: false, done: false },

      /** To'lov qoidasi: har fandagi boshidagi 10 dars bepul, qolgani Pro.
       *  Allaqachon yakunlangan bo'limni qayta ochishga ruxsat beriladi. */
      canOpenTopicLesson: (id) => {
        if (get().topicLessons[id]?.done) return true
        return get().isPro || isFreeLessonId(id)
      },

      topicLessonsDone: (topicNum) =>
        lessonIdsOf(topicNum).filter(id => get().topicLessons[id]?.done).length,

      /** Zanjir qoidasi: barcha bo'limlar tugamagan bo'lsa yakuniy test yopiq */
      canEnterTopicTest: (topicNum) =>
        lessonIdsOf(topicNum).every(id => !!get().topicLessons[id]?.done),

      topicFinished: (topicNum) => {
        const entry = findTopic(topicNum)
        const t = get().topicTests[topicNum]
        return !!entry && !!t && t.score >= entry.pass && t.total === entry.test.total
      },
    }),
    {
      name: 'hdp_progress_v1',
      storage: createJSONStorage(() => AsyncStorage),
      /**
       * v2 — test natijalari mavzu raqami bo'yicha (`topicTest` → `topicTests`)
       * v3 — daraja savollari id bo'yicha (`algebra-oson#3` → `a-oson-4`)
       */
      version: 3,
      migrate: (persisted, version) => {
        let state = (persisted ?? {}) as Record<string, unknown>
        if (version < 1) {
          const stale =
            state.name === 'Sardor Aliyev' ||
            state.username === 'sardor_hdp' ||
            state.publicId === 'HDP-84219'
          if (stale) {
            state = {
              ...state,
              name: '',
              username: '',
              publicId: '',
              email: null,
              photoUrl: null,
              authed: false,
              onboarded: false,
            }
          }
        }
        if (version < 2 && 'topicTest' in state) {
          const old = state.topicTest as TopicTestEntry | null
          const { topicTest: _drop, ...rest } = state
          state = { ...rest, topicTests: old ? { 1: old } : {} }
        }
        if (version < 3 && state.solvedQuestions) {
          /** Eski yozuvlar indeks bo'yicha edi; daraja savollari endi id bilan yuritiladi */
          const byIndex = new Map<string, string[]>()
          for (const level of PROBLEM_LEVELS) {
            byIndex.set(level.id, level.questions.map(q => q.id))
          }
          const old = state.solvedQuestions as Record<string, string[]>
          const next: Record<string, string[]> = {}
          for (const [setId, ids] of Object.entries(old)) {
            const table = byIndex.get(setId)
            if (!table) {
              next[setId] = ids
              continue
            }
            const mapped = ids.map(id => {
              const [prefix, idx] = id.split('#')
              if (prefix !== setId || idx === undefined) return id
              return table[Number(idx)] ?? id
            })
            next[setId] = [...new Set(mapped)]
          }
          state = { ...state, solvedQuestions: next }
        }
        return state
      },
      partialize: (s) => ({
        name: s.name,
        username: s.username,
        publicId: s.publicId,
        email: s.email,
        telegramId: s.telegramId,
        studyGoal: s.studyGoal,
        birthDate: s.birthDate,
        photoUrl: s.photoUrl,
        xp: s.xp,
        coin: s.coin,
        level: s.level,
        streak: s.streak,
        bestStreak: s.bestStreak,
        blitzBest: s.blitzBest,
        blitzPlays: s.blitzPlays,
        gameStars: s.gameStars,
        gamePlays: s.gamePlays,
        lastActiveDay: s.lastActiveDay,
        solvedCount: s.solvedCount,
        answeredTotal: s.answeredTotal,
        answeredCorrect: s.answeredCorrect,
        isPro: s.isPro,
        proExpires: s.proExpires,
        studyMinutes: s.studyMinutes,
        notifOn: s.notifOn,
        theme: s.theme,
        lessons: s.lessons,
        solvedQuestions: s.solvedQuestions,
        levelStars: s.levelStars,
        starWeek: s.starWeek,
        starsThisWeek: s.starsThisWeek,
        unlocked: s.unlocked,
        day: s.day,
        solvedToday: s.solvedToday,
        olympToday: s.olympToday,
        claimedMissions: s.claimedMissions,
        dailyBonusOn: s.dailyBonusOn,
        streakBonusClaimed: s.streakBonusClaimed,
        dailyQuestion: s.dailyQuestion,
        authed: s.authed,
        onboarded: s.onboarded,
        topicLessons: s.topicLessons,
        topicTests: s.topicTests,
        inventory: s.inventory,
        txLog: s.txLog,
        goalId: s.goalId,
        proTrialMonth: s.proTrialMonth,
        boostActive: s.boostActive,
        orders: s.orders,
        stockTaken: s.stockTaken,
        reviews: s.reviews,
        favs: s.favs,
      }),
    }
  )
)

/* ── Statik ko'rsatkichlar ── */

export const totalLessonCount = LESSONS.length
export const freeLessonCount = LESSONS.filter((l) => l.free).length
export const totalProblemCount = PROBLEM_SETS.reduce((n, s) => n + s.questions.length, 0)
