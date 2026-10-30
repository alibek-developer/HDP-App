import { User, DailyProblem, Problem, Formula, Lesson } from '../types'

export const mockUser: User = {
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
}

export const mockDailyProblem: DailyProblem = {
  id: 142,
  title: "Parametrli Tenglama",
  category: "DTM / IMO",
  formula: "f(x) = x² − 2ax + a + 6 = 0",
  description: "tenglama ikkita musbat ildizga ega bo'lsa, a ning barcha qiymatlar sohasini toping.",
  options: [14, 18, 21, 12],
  correct: 18,
  rewardCoin: 50,
  rewardXp: 80,
  timer: "04:22:15",
}

export const mockProblems: Problem[] = [
  { id: 1, icon: "Σ", title: "Viyet teoremasi va kvadratik tenglamalar", status: "new", difficulty: "easy", category: "Algebra", coin: 15, xp: 25 },
  { id: 2, icon: "△", title: "Uchburchak medianasi va bissektrisasi", status: "solved", difficulty: "medium", category: "Geometriya", coin: 25, xp: 40 },
  { id: 3, icon: "🔒", title: "Murakkab trigonometrik tengsizliklar (IMO)", status: "locked", difficulty: "hard", category: "Analiz", coin: 60, xp: 100, unlockCost: 200 },
]

export const mockFormulas: Formula[] = [
  { id: 1, cat: "Alg", title: "Viyet Teoremasi", desc: "Kvadrat tenglama ildizlari xossalari", formulas: ["x₁ + x₂ = −b / a", "x₁ · x₂ = c / a"], tags: ["8-sinf", "Tezkor usul"], saved: true },
  { id: 2, cat: "Geo", title: "Kosinuslar Teoremasi", desc: "Ixtiyoriy uchburchak tomonlari", formulas: ["a² = b² + c² − 2bc · cos(α)"], tags: ["Planimetriya", "DTM Blok"], saved: true },
  { id: 3, cat: "Mat", title: "Murakkab Funksiya Hosilasi", desc: "Zanjir qoidasi (Chain Rule)", formulas: ["(f(g(x)))' = f'(g(x)) · g'(x)"], tags: ["Hosila", "Olimpiada"], saved: true },
  { id: 4, cat: "Trig", title: "Keltirish Formulalari", desc: "π/2 va π burchaklar bo'yicha", formulas: ["sin(π/2 − α) = cos(α)", "tg(π/2 + α) = −ctg(α)"], tags: ["Trigonometriya", "Shpora"], saved: false },
]

export const mockLessons: Lesson[] = [
  { id: 1, title: "Matematik mantiq asoslari", duration: "18 daqiqa", status: "done", xp: 50 },
  { id: 2, title: "Haqiqiy sonlar to'plami", duration: "24 daqiqa", status: "done", xp: 50 },
  { id: 3, title: "Chiziqli tenglamalar va matritsalar", duration: "32 daqiqa", status: "active", xp: 50 },
  { id: 4, title: "Kvadrat tenglamalar va Viyet", duration: "22 daqiqa", status: "open", xp: 50 },
  { id: 5, title: "Modulli tenglamalar va grafiklar", duration: "26 daqiqa", status: "open", xp: 50 },
  { id: 6, title: "Funksiyalar va ularning grafigi", duration: "30 daqiqa", status: "open", xp: 50 },
]
