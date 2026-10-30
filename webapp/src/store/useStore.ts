import { create } from 'zustand'
import { SolveState } from '../types'
import { mockDailyProblem } from '../data/mockData'

export const useSolveStore = create<SolveState>((set) => ({
  selectedAnswer: null,
  isChecked: false,
  isCorrect: false,
  setAnswer: (answer: number) => set({ selectedAnswer: answer }),
  checkAnswer: () => set((state) => ({
    isChecked: true,
    isCorrect: state.selectedAnswer === mockDailyProblem.correct
  })),
  reset: () => set({
    selectedAnswer: null,
    isChecked: false,
    isCorrect: false
  })
}))

export const useUserStore = create((set) => ({
  user: {
    name: "Aliyev Sardor",
    username: "sardor_hdp",
    id: "HDP-84219",
    level: 4,
    rank: "Olimpiada Ishtirokchisi",
    streak: 12,
    xp: 3850,
    xpNext: 4000,
    coin: 1250,
    solved: 248,
    accuracy: 94,
    rating: 42,
    isPro: true,
    proExpires: "2025-12-31",
    weeklyActivity: [30, 25, 40, 35, 50, 45, 0],
  },
  addCoin: (amount: number) => set((state: any) => ({
    user: { ...state.user, coin: state.user.coin + amount }
  })),
  addXp: (amount: number) => set((state: any) => ({
    user: { ...state.user, xp: state.user.xp + amount }
  })),
}))
