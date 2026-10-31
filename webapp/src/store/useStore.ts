import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LESSONS, PROBLEM_SETS, findLesson } from '../data/content'

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
  resetAll: () => void

  /* ── Derived ── */
  lessonStage: (id: number) => Stage
  canOpenLesson: (id: number) => boolean
  canEnterExample: (id: number) => boolean
  canEnterTest: (id: number) => boolean
  xpForNext: () => number
}

const XP_STEP = 1000

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
          const newly = result.answers.filter((a) => a.ok).length
          const prev = s.solvedQuestions[setId] ?? []
          const now = result.answers
            .map((a, i) => (a.ok ? result.refId + '#' + i : null))
            .filter(Boolean) as string[]
          return {
            solvedQuestions: { ...s.solvedQuestions, [setId]: [...new Set([...prev, ...now])] },
            coin: s.coin + result.coinsEarned,
            xp: s.xp + result.xpEarned,
            level: levelFromXp(s.xp + result.xpEarned),
            solvedCount: s.solvedCount + newly,
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
        onboarded: s.onboarded,
      }),
    }
  )
)

/* ── Statik ko'rsatkichlar ── */

export const totalLessonCount = LESSONS.length
export const freeLessonCount = LESSONS.filter((l) => l.free).length
export const totalProblemCount = PROBLEM_SETS.reduce((n, s) => n + s.questions.length, 0)
