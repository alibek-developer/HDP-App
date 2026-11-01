export interface User {
  name: string
  username: string
  id: string
  level: number
  rank: string
  streak: number
  xp: number
  xpNext: number
  coin: number
  solved: number
  accuracy: number
  rating: number
  isPro: boolean
  proExpires: string
  weeklyActivity: number[]
}

export interface DailyProblem {
  id: number
  title: string
  category: string
  formula: string
  description: string
  options: number[]
  correct: number
  rewardCoin: number
  rewardXp: number
  timer: string
}

export interface Problem {
  id: number
  icon: string
  title: string
  status: 'new' | 'solved' | 'locked'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  coin: number
  xp: number
  unlockCost?: number
}

export interface Formula {
  id: number
  cat: string
  title: string
  desc: string
  formulas: string[]
  tags: string[]
  saved: boolean
}

export interface Lesson {
  id: number
  title: string
  duration: string
  status: 'done' | 'active' | 'open'
  xp: number
}

export interface SolveState {
  selectedAnswer: number | null
  isChecked: boolean
  isCorrect: boolean
  setAnswer: (answer: number) => void
  checkAnswer: () => void
  reset: () => void
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    start_param?: string
  }
  BackButton: {
    visible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
}
