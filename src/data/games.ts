/**
 * Mini-o'yinlar ma'lumoti. Har o'yin o'z darajalari bilan yashaydi:
 * savollar soni, vaqt, yuraklar va mukofot shu yerda belgilanadi.
 */

export type BalanceLevelId = 'easy' | 'mid' | 'hard'

export interface BalanceRound {
  /** chap panada turgan ma'lum og'irliklar */
  left: number[]
  /** o'ng panadagi og'irliklar */
  right: number[]
  /** pastdagi tanlov og'irliklari */
  chips: number[]
}

export interface BalanceLevel {
  id: BalanceLevelId
  title: string
  sub: string
  /** har bosqich uchun soniya */
  seconds: number
  hearts: number
  /** boshlovchida tenglama yozib ko'rsatiladi */
  showEquation: boolean
  rounds: BalanceRound[]
}

/** Sessiyada o'ynaladigan bosqichlar soni */
export const BALANCE_ROUNDS = 6

export const BALANCE_LEVELS: BalanceLevel[] = [
  {
    id: 'easy',
    title: 'Boshlovchi',
    sub: '30 soniya · tenglama ko‘rinadi',
    seconds: 30,
    hearts: 3,
    showEquation: true,
    rounds: [
      { left: [3], right: [7], chips: [4, 6, 2] },
      { left: [5], right: [9], chips: [4, 7, 3] },
      { left: [6], right: [10], chips: [4, 3, 8] },
      { left: [2, 3], right: [8], chips: [3, 4, 6] },
      { left: [4, 1], right: [9], chips: [4, 2, 6] },
      { left: [5], right: [12], chips: [7, 5, 9] },
      { left: [3, 2], right: [10], chips: [5, 4, 7] },
      { left: [6], right: [8], chips: [2, 6, 4] },
    ],
  },
  {
    id: 'mid',
    title: 'Oddiy',
    sub: '20 soniya · faqat tarozi',
    seconds: 20,
    hearts: 3,
    showEquation: false,
    rounds: [
      { left: [7, 4], right: [15], chips: [4, 2, 6, 8] },
      { left: [9], right: [17], chips: [8, 6, 9, 3] },
      { left: [12, 5], right: [21], chips: [4, 7, 2, 6] },
      { left: [8, 3, 2], right: [16], chips: [3, 5, 4, 7] },
      { left: [11], right: [19], chips: [8, 5, 9, 12] },
      { left: [6, 9], right: [20], chips: [5, 4, 8, 6] },
      { left: [13, 2], right: [22], chips: [7, 5, 9, 4] },
      { left: [4, 4, 7], right: [18], chips: [3, 5, 2, 6] },
    ],
  },
  {
    id: 'hard',
    title: 'Usta',
    sub: '12 soniya · 2 yurak',
    seconds: 12,
    hearts: 2,
    showEquation: false,
    rounds: [
      { left: [14, 6], right: [27], chips: [7, 3, 5, 9, 2] },
      { left: [15], right: [26], chips: [11, 4, 9, 6, 8] },
      { left: [18, 4], right: [30], chips: [8, 5, 3, 12, 7] },
      { left: [21, 3], right: [33], chips: [9, 6, 12, 4, 7] },
      { left: [16, 8], right: [31], chips: [7, 11, 3, 9, 5] },
      { left: [12, 5, 4], right: [28], chips: [7, 9, 3, 11, 6] },
      { left: [19, 6], right: [32], chips: [7, 9, 4, 12, 5] },
      { left: [23, 2], right: [34], chips: [9, 6, 11, 4, 7] },
    ],
  },
]

/** Sessiya uchun bosqichlarni aralashtirib tanlash */
export function pickBalanceRounds(level: BalanceLevel): BalanceRound[] {
  const pool = [...level.rounds]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = pool[i]
    const b = pool[j]
    pool[i] = b
    pool[j] = a
  }
  return pool.slice(0, BALANCE_ROUNDS)
}

export const BALANCE_REWARD = { coinPerRound: 5, xpPerRound: 10, perfectBonus: 10 }

export const sum = (list: number[]) => list.reduce((a, b) => a + b, 0)

/** Natija: yulduz va mukofot — hammasi yechilgan bosqichlardan */
export function balanceOutcome(solved: number, total: number) {
  const stars = solved >= total ? 3 : solved >= total - 2 ? 2 : solved >= 2 ? 1 : 0
  const coins = solved * BALANCE_REWARD.coinPerRound + (stars === 3 ? BALANCE_REWARD.perfectBonus : 0)
  const xp = solved * BALANCE_REWARD.xpPerRound
  return { stars, coins, xp }
}

/** O'yinlar ro'yxati — Home kartasi va keyingi ekranlar shu manbadan o'qiydi */
export const GAMES = [
  {
    id: 'balance',
    title: 'Muvozanat',
    sub: 'Tarozini tenglashtir, x ni top',
    icon: 'scale-outline' as const,
    route: 'Balance' as const,
  },
]

/** O'yinlar ekranining belgilari — har o'yin o'z shakli bilan taniladi */
export type GameMarkKey = 'scale' | 'memory' | 'line' | 'fight'

export interface GameCatalogEntry {
  id: string
  title: string
  sub: string
  mark: GameMarkKey
  /** marshrut yo'q bo'lsa — o'yin hali tayyor emas */
  route?: 'Balance'
}

/** To'rttalik katalog: Home javonidagi o'yin va navbatdagi uchtasi */
export const GAME_CATALOG: GameCatalogEntry[] = [
  {
    id: 'balance',
    title: 'Muvozanat',
    sub: "Og'irliklarni qo'yib, tarozini tenglashtiring",
    mark: 'scale',
    route: 'Balance',
  },
  {
    id: 'memory',
    title: 'Sonlar xotirasi',
    sub: 'Juftliklarni eslab qol, xotirani sinang',
    mark: 'memory',
  },
  {
    id: 'numberline',
    title: "Sonlar chizig'i",
    sub: "Sonni chiziqda top — sakrab yurib",
    mark: 'line',
  },
  {
    id: 'fighters',
    title: 'Raqam jangchilari',
    sub: 'Amallar bilan jangchilarni boshqaring',
    mark: 'fight',
  },
]
