import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LESSONS, PROBLEM_SETS, findLesson, findProblemSet, dailyProblem } from '../data/content'

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
  /** 'lesson-test' | 'problem-set' | 'daily' */
  kind: 'lesson-test' | 'problem-set' | 'daily'
  refId: string
  title: string
  /** foydalanuvchi javoblari, tartib saqlanadi */
  answers: { prompt: string; picked: number; correct: number; options: string[]; explain: string; ok: boolean }[]
  coinsEarned: number
  xpEarned: number
}

interface AppState {
  /* ── Profil ── */
  name: string
  username: string
  publicId: string
  level: number
  xp: number
  coin: number
  streak: number
  solvedCount: number
  isPro: boolean
  proExpires: string | null

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

  /* ── Actions ── */
  setOnboarded: () => void
  /** Login/ro'yxatdan o'tishda profil ma'lumotlari */
  setProfile: (name: string, username: string) => void
  startLesson: (id: number) => void
  markVideoWatched: (id: number) => void
  markExampleDone: (id: number) => void
  /** testni yakunlash: coin/XP yig'ish va natijani saqlash */
  finishLessonTest: (lessonId: number, result: SessionResult) => void
  finishProblemSet: (setId: string, result: SessionResult) => void
  finishDaily: (result: SessionResult) => void
  subscribePro: (months: number) => void
  cancelPro: () => void
  spendCoins: (amount: number) => boolean
  /** to'plamni coin evaziga ochish */
  unlockSet: (id: string, price: number) => boolean
  /** sana o'zgarganda kunlik hisoblagichlarni nollash */
  rollDay: () => void
  claimMission: (key: string, reward: number) => void
  resetAll: () => void

  /* ── Derived ── */
  lessonStage: (id: number) => Stage
  canOpenLesson: (id: number) => boolean
  canEnterExample: (id: number) => boolean
  canEnterTest: (id: number) => boolean
  canOpenSet: (id: string) => boolean
  xpForNext: () => number
}

const todayKey = () => new Date().toISOString().slice(0, 10)

const XP_STEP = 1000

/** Kunlik mega masala bonusi — bir marta, kuniga */
export const DAILY_BONUS = { coin: 50, xp: 80 }

/** Daraja har 1000 XP da ko'tariladi */
function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_STEP) + 1
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      name: 'Sardor Aliyev',
      username: 'sardor_hdp',
      publicId: 'HDP-84219',
      level: 1,
      xp: 0,
      coin: 0,
      streak: 0,
      solvedCount: 0,
      isPro: false,
      proExpires: null,

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

      setOnboarded: () => set({ onboarded: true }),

      setProfile: (name, username) =>
        set({ name, username, publicId: 'HDP-' + Math.floor(10000 + Math.random() * 89999) }),

      startLesson: (id) => set({ activeLessonId: id }),

      markVideoWatched: (id) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [id]: { ...emptyProgress(), ...s.lessons[id], videoWatched: true },
          },
        })),

      markExampleDone: (id) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [id]: { ...emptyProgress(), ...s.lessons[id], exampleDone: true },
          },
        })),

      finishLessonTest: (lessonId, result) =>
        set((s) => {
          const ok = result.answers.filter((a) => a.ok).length
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
            coin: s.coin + result.coinsEarned,
            xp: s.xp + result.xpEarned,
            level: levelFromXp(s.xp + result.xpEarned),
            solvedCount: s.solvedCount + ok,
            streak: s.streak + 1,
            lastResult: result,
            activeLessonId: lessonId,
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
          return {
            solvedQuestions: { ...s.solvedQuestions, [setId]: [...new Set([...prev, ...now])] },
            coin: s.coin + result.coinsEarned + extraCoin,
            xp: s.xp + result.xpEarned + extraXp,
            level: levelFromXp(s.xp + result.xpEarned + extraXp),
            solvedCount: s.solvedCount + newly,
            day,
            solvedToday: (rolled ? 0 : s.solvedToday) + newly,
            olympToday: (rolled ? 0 : s.olympToday) + (solved?.topic === 'Olimpiada' ? newly : 0),
            claimedMissions: rolled ? [] : s.claimedMissions,
            dailyBonusOn: dailyHit ? day : s.dailyBonusOn,
            lastResult: result,
          }
        }),

      finishDaily: (result) =>
        set((s) => ({
          coin: s.coin + result.coinsEarned,
          xp: s.xp + result.xpEarned,
          level: levelFromXp(s.xp + result.xpEarned),
          solvedCount: s.solvedCount + result.answers.filter((a) => a.ok).length,
          lastResult: result,
        })),

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
        set((s) => ({ coin: s.coin - price, unlocked: [...s.unlocked, id] }))
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

      resetAll: () =>
        set({
          xp: 0,
          coin: 0,
          level: 1,
          streak: 0,
          solvedCount: 0,
          isPro: false,
          proExpires: null,
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
    }),
    {
      name: 'hdp_progress_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        name: s.name,
        username: s.username,
        publicId: s.publicId,
        xp: s.xp,
        coin: s.coin,
        level: s.level,
        streak: s.streak,
        solvedCount: s.solvedCount,
        isPro: s.isPro,
        proExpires: s.proExpires,
        lessons: s.lessons,
        solvedQuestions: s.solvedQuestions,
        unlocked: s.unlocked,
        day: s.day,
        solvedToday: s.solvedToday,
        olympToday: s.olympToday,
        claimedMissions: s.claimedMissions,
        dailyBonusOn: s.dailyBonusOn,
        onboarded: s.onboarded,
      }),
    }
  )
)

/* ── Statik ko'rsatkichlar ── */

export const totalLessonCount = LESSONS.length
export const freeLessonCount = LESSONS.filter((l) => l.free).length
export const totalProblemCount = PROBLEM_SETS.reduce((n, s) => n + s.questions.length, 0)
