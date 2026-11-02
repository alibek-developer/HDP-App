import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  LESSONS, PROBLEM_SETS, findLesson, findProblemSet, dailyProblem,
  CONSUMABLES, PRO_TRIAL, BOOST_CARD, DAILY_BONUS, findProduct,
  type ConsumableKind,
} from '../data/content'
import {
  findTopicLesson, topicLessonIds, TOPIC_1_TEST, TOPIC_1_PASS,
} from '../data/topic1'

/**
 * Ilovaning yagona holat manbai.
 * Bu yerda oqim qoidalari yashaydi:
 *  - 10 ta dars bepul, qolgani faqat Pro
 *  - video tugamasa -> misolga o'tish yopiq
 *  - misol yechilmasa -> testga o'tish yopiq
 *  - har to'g'ri javob coin/XP keltiradi
 */

export type Stage = 'new' | 'video' | 'example' | 'test' | 'done'

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
  answers: { prompt: string; picked: number; correct: number; options: string[]; explain: string; ok: boolean; skipped?: boolean }[]
  coinsEarned: number
  xpEarned: number
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
  /** Telegram foydalanuvchi id'si (demo rejimda namunaviy) */
  telegramId: number | null
  /** Telegram profil rasmi */
  photoUrl: string | null
  level: number
  xp: number
  coin: number
  streak: number
  /** eng uzun ketma-ket kun zanjiri */
  bestStreak: number
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
  /** coin evaziga ochilgan to'plamlar */
  unlocked: string[]
  /** kunlik hisoblagichlar kaliti (sana) — o'zgarsa nollanadi */
  day: string
  solvedToday: number
  olympToday: number
  claimedMissions: string[]
  /** kunlik mega masala bonusi olingan sana */
  dailyBonusOn: string | null
  /** oxirgi natija ekrani ma'lumoti */
  lastResult: SessionResult | null
  /** zanjir davomida ochib turadigan dars id'si */
  activeLessonId: number | null
  onboarded: boolean
  /** mavzu bo'limi: '1.1'…'1.10' -> yakunlangan */
  topicLessons: Record<string, TopicLessonState>
  /** mavzu yakuniy testi natijasi (eng yaxshi urinish) */
  topicTest: TopicTestEntry | null

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
  /** Email + parol bilan kirish (lokal hisob — haqiqiy auth server keyin) */
  signInWithEmail: (email: string) => void
  /** Login/ro'yxatdan o'tishda profil ma'lumotlari */
  setProfile: (name: string, username: string) => void
  /** Telegram (yoki demo) hisobi bilan kirish */
  signInWithTelegram: (profile: {
    id: number | null
    name: string
    username: string
    photoUrl: string | null
  }) => void
  /** Seans boshlandi — daqiqa hisobi shu nuqtadan yuriladi */
  beginSession: () => void
  startLesson: (id: number) => void
  markVideoWatched: (id: number) => void
  markExampleDone: (id: number) => void
  /** testni yakunlash: coin/XP yig'ish va natijani saqlash */
  finishLessonTest: (lessonId: number, result: SessionResult) => void
  finishProblemSet: (setId: string, result: SessionResult) => void
  finishDaily: (result: SessionResult) => void
  /** Mavzu bo'limida video dars ochildi */
  markTopicVideoSeen: (id: string) => void
  /** Mavzu bo'limini yakunlash — bir marta mukofot beradi */
  completeTopicLesson: (id: string) => void
  /** Mavzu yakuniy testini yozish (eng yaxshi urinish saqlanadi) */
  finishTopicTest: (result: SessionResult) => void
  subscribePro: (months: number) => void
  cancelPro: () => void
  spendCoins: (amount: number) => boolean
  /** to'plamni coin evaziga ochish */
  unlockSet: (id: string, price: number) => boolean
  /** sana o'zgarganda kunlik hisoblagichlarni nollash */
  rollDay: () => void
  claimMission: (key: string, reward: number) => void
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
  /** necha bo'lim yakunlangan */
  topicLessonsDone: () => number
  /** yakuniy test ochilganmi — barcha bo'limlar tugasa */
  canEnterTopicTest: () => boolean
  /** mavzu to'liq yopilmiganmi (test o'tish chegarasi bilan) */
  topicFinished: () => boolean
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
      name: 'Sardor Aliyev',
      username: 'sardor_hdp',
      publicId: 'HDP-84219',
      email: null,
      telegramId: null,
      photoUrl: null,
      level: 1,
      xp: 0,
      coin: 0,
      streak: 0,
      bestStreak: 0,
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
      unlocked: [],
      day: todayKey(),
      solvedToday: 0,
      olympToday: 0,
      claimedMissions: [],
      dailyBonusOn: null,
      lastResult: null,
      activeLessonId: null,
      onboarded: false,
      topicLessons: {},
      topicTest: null,

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

      signInWithEmail: (email) => set({ email: email.toLowerCase(), onboarded: true }),

      /** Profil tahriri — hisob raqami (publicId) o'zgarmaydi */
      setProfile: (name, username) => set({ name, username }),

      signInWithTelegram: (profile) =>
        set({
          telegramId: profile.id,
          name: profile.name || get().name,
          username: profile.username,
          photoUrl: profile.photoUrl,
          onboarded: true,
        }),

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
          const credited = applyBoost(s, result)
          return {
            lessons: {
              ...s.lessons,
              [lessonId]: {
                ...emptyProgress(),
                ...s.lessons[lessonId],
                videoWatched: true,
                exampleDone: true,
                testScore: ok,
                testTotal: result.answers.length,
              },
            },
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + result.xpEarned,
            level: levelFromXp(s.xp + result.xpEarned),
            solvedCount: s.solvedCount + ok,
            lastResult: credited,
            activeLessonId: lessonId,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...creditAnswers(s, result),
            ...boostConsume(s),
          }
        }),

      finishProblemSet: (setId, result) =>
        set((s) => {
          const day = todayKey()
          const rolled = s.day !== day
          const newly = result.answers.filter((a) => a.ok).length
          const prev = s.solvedQuestions[setId] ?? []
          const now = result.answers
            .map((a, i) => (a.ok ? result.refId + '#' + i : null))
            .filter(Boolean) as string[]
          const solved = findProblemSet(setId)
          const dailyHit = dailyProblem().set.id === setId && s.dailyBonusOn !== day
          const extraCoin = dailyHit ? DAILY_BONUS.coin : 0
          const extraXp = dailyHit ? DAILY_BONUS.xp : 0
          const credited = applyBoost(s, result)
          return {
            solvedQuestions: { ...s.solvedQuestions, [setId]: [...new Set([...prev, ...now])] },
            coin: s.coin + credited.coinsEarned + extraCoin,
            xp: s.xp + result.xpEarned + extraXp,
            level: levelFromXp(s.xp + result.xpEarned + extraXp),
            solvedCount: s.solvedCount + newly,
            day,
            solvedToday: (rolled ? 0 : s.solvedToday) + newly,
            olympToday: (rolled ? 0 : s.olympToday) + (solved?.topic === 'Olimpiada' ? newly : 0),
            claimedMissions: rolled ? [] : s.claimedMissions,
            dailyBonusOn: dailyHit ? day : s.dailyBonusOn,
            lastResult: credited,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...creditAnswers(s, result),
            ...boostConsume(s),
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

      /** Yakuniy test — eng yaxshi urinish natijasi saqlanadi, har to'g'ri javob to'lanadi */
      finishTopicTest: (result) =>
        set((s) => {
          const day = todayKey()
          const ok = result.answers.filter((a) => a.ok).length
          const prev = s.topicTest
          const credited = applyBoost(s, result)
          return {
            topicTest: !prev || ok > prev.score ? { score: ok, total: result.answers.length, at: new Date().toISOString() } : prev,
            coin: s.coin + credited.coinsEarned,
            xp: s.xp + result.xpEarned,
            level: levelFromXp(s.xp + result.xpEarned),
            solvedCount: s.solvedCount + ok,
            lastResult: credited,
            ...bumpStreak(s, day),
            ...creditMinutes(s, day),
            ...creditAnswers(s, result),
            ...boostConsume(s),
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
        set({ day, solvedToday: 0, olympToday: 0, claimedMissions: [] })
      },

      claimMission: (key, reward) => {
        const s = get()
        if (s.claimedMissions.includes(key)) return
        set({ coin: s.coin + reward, claimedMissions: [...s.claimedMissions, key] })
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

      signOut: () => set({ onboarded: false, sessionStartedAt: null, telegramId: null, photoUrl: null, email: null }),

      resetAll: () =>
        set({
          xp: 0,
          coin: 0,
          level: 1,
          streak: 0,
          bestStreak: 0,
          lastActiveDay: null,
          telegramId: null,
          photoUrl: null,
          solvedCount: 0,
          answeredTotal: 0,
          answeredCorrect: 0,
          isPro: false,
          proExpires: null,
          studyMinutes: {},
          sessionStartedAt: null,
          lessons: {},
          solvedQuestions: {},
          unlocked: [],
          solvedToday: 0,
          olympToday: 0,
          claimedMissions: [],
          dailyBonusOn: null,
          lastResult: null,
          activeLessonId: null,
          onboarded: false,
          topicLessons: {},
          topicTest: null,
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

      topicLessonsDone: () => topicLessonIds.filter(id => get().topicLessons[id]?.done).length,

      /** Zanjir qoidasi: barcha bo'limlar tugamagan bo'lsa yakuniy test yopiq */
      canEnterTopicTest: () =>
        topicLessonIds.every(id => !!get().topicLessons[id]?.done),

      topicFinished: () => {
        const t = get().topicTest
        return !!t && t.score >= TOPIC_1_PASS && t.total === TOPIC_1_TEST.total
      },
    }),
    {
      name: 'hdp_progress_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        name: s.name,
        username: s.username,
        publicId: s.publicId,
        email: s.email,
        telegramId: s.telegramId,
        photoUrl: s.photoUrl,
        xp: s.xp,
        coin: s.coin,
        level: s.level,
        streak: s.streak,
        bestStreak: s.bestStreak,
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
        unlocked: s.unlocked,
        day: s.day,
        solvedToday: s.solvedToday,
        olympToday: s.olympToday,
        claimedMissions: s.claimedMissions,
        dailyBonusOn: s.dailyBonusOn,
        onboarded: s.onboarded,
        topicLessons: s.topicLessons,
        topicTest: s.topicTest,
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
