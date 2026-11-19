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

/** O'yinlar ekranining belgilari — har o'yin o'z shakli bilan taniladi */
export type GameMarkKey = 'scale' | 'memory' | 'line' | 'fight'

const shuffle = <T,>(list: T[]): T[] => {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = out[i]
    const b = out[j]
    out[i] = b
    out[j] = a
  }
  return out
}

const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

/* ───────────────────── Sonlar xotirasi ───────────────────── */

export type MemoryLevelId = 'easy' | 'mid' | 'hard'

export interface MemoryLevel {
  id: MemoryLevelId
  title: string
  sub: string
  /** juftliklar soni — kartalar ikki barobar ko'p */
  pairs: number
  seconds: number
  maxA: number
  maxB: number
  ops: ('+' | '×')[]
}

export const MEMORY_LEVELS: MemoryLevel[] = [
  { id: 'easy', title: 'Boshlovchi', sub: '6 juftlik · 70 soniya', pairs: 6, seconds: 70, maxA: 9, maxB: 9, ops: ['+'] },
  { id: 'mid', title: 'Oddiy', sub: '8 juftlik · 80 soniya', pairs: 8, seconds: 80, maxA: 9, maxB: 9, ops: ['+', '×'] },
  { id: 'hard', title: 'Usta', sub: '10 juftlik · 85 soniya', pairs: 10, seconds: 85, maxA: 12, maxB: 9, ops: ['×'] },
]

export interface MemoryCard {
  key: string
  /** qaysi juftlikka tegishli — mos kelish shu bo'yicha */
  pair: number
  face: 'expr' | 'ans'
  text: string
}

/** Har ifodaning natijasi yagona — kartalar orasida adashish bo'lmaydi */
export function buildMemoryDeck(level: MemoryLevel): MemoryCard[] {
  const cards: MemoryCard[] = []
  const seen = new Set<number>()
  let guard = 0
  while (cards.length < level.pairs * 2 && guard < 400) {
    guard += 1
    const op = level.ops[Math.floor(Math.random() * level.ops.length)]
    const a = rnd(2, level.maxA)
    const b = rnd(2, level.maxB)
    const result = op === '+' ? a + b : a * b
    if (seen.has(result)) continue
    seen.add(result)
    const pair = cards.length / 2
    cards.push({ key: `p${pair}e`, pair, face: 'expr', text: `${a} ${op} ${b}` })
    cards.push({ key: `p${pair}a`, pair, face: 'ans', text: String(result) })
  }
  return shuffle(cards)
}

/** 3 yulduz — vaqtning kamida 35%i qolganda; 2 — 15%; 1 — vaqtida tugatilgan */
export function memoryOutcome(matched: number, total: number, timeLeft: number, seconds: number) {
  const done = matched >= total
  const ratio = seconds > 0 ? timeLeft / seconds : 0
  const stars = !done ? 0 : ratio >= 0.35 ? 3 : ratio >= 0.15 ? 2 : 1
  return { stars, coins: matched * 5 + stars * 4, xp: matched * 8 }
}

/* ───────────────────── Sonlar chizig'i ───────────────────── */

export type NumberLineLevelId = 'easy' | 'mid' | 'hard'

export interface NumberLineLevel {
  id: NumberLineLevelId
  title: string
  sub: string
  min: number
  max: number
  step: number
  seconds: number
  hearts: number
}

export const NUMBERLINE_ROUNDS = 8

export const NUMBERLINE_LEVELS: NumberLineLevel[] = [
  { id: 'easy', title: 'Boshlovchi', sub: '0–20 · qadam 2 · 20 soniya', min: 0, max: 20, step: 2, seconds: 20, hearts: 3 },
  { id: 'mid', title: 'Oddiy', sub: '0–60 · qadam 5 · 16 soniya', min: 0, max: 60, step: 5, seconds: 16, hearts: 3 },
  { id: 'hard', title: 'Usta', sub: '−30–30 · qadam 5 · 12 soniya', min: -30, max: 30, step: 5, seconds: 12, hearts: 2 },
]

export const numberLineTicks = (level: NumberLineLevel): number[] => {
  const out: number[] = []
  for (let v = level.min; v <= level.max + 1e-9; v += level.step) out.push(Math.round(v * 100) / 100)
  return out
}

export function pickNumberLineTarget(level: NumberLineLevel, avoid: number | null): number {
  const ticks = numberLineTicks(level)
  const pool = ticks.filter(t => t !== avoid)
  return pool[rnd(0, pool.length - 1)]
}

export function numberLineOutcome(solved: number, total: number) {
  const stars = solved >= total ? 3 : solved >= total - 2 ? 2 : solved >= 3 ? 1 : 0
  return { stars, coins: solved * 5 + stars * 4, xp: solved * 9 }
}

/* ───────────────────── Raqam jangchilari ───────────────────── */

export type FighterLevelId = 'easy' | 'mid' | 'hard'
export type FighterOp = '+' | '−' | '×'

export interface FighterLevel {
  id: FighterLevelId
  title: string
  sub: string
  /** raqibning zarba ochkolari */
  hp: number
  /** foydalanuvchining zarba ochkolari */
  playerHp: number
  ops: FighterOp[]
  max: number
}

export const FIGHTER_LEVELS: FighterLevel[] = [
  { id: 'easy', title: 'Yangi boshlovchi', sub: "Qo'shish · raqib 4 · siz 5", hp: 4, playerHp: 5, ops: ['+'], max: 9 },
  { id: 'mid', title: 'Ishbilarmon', sub: 'Ayirish ham · raqib 5 · siz 5', hp: 5, playerHp: 5, ops: ['+', '−'], max: 12 },
  { id: 'hard', title: 'Algebra ustasi', sub: "Ko'paytirish · raqib 6 · siz 4", hp: 6, playerHp: 4, ops: ['×'], max: 9 },
]

export interface FighterHand {
  /** qalqon — shu sonni urish kerak */
  target: number
  chips: number[]
}

/** Qalqon har doim qo'ldagi ikki chipdan yasaladi — yechim borligi kafolatlanadi */
export function buildFighterHand(level: FighterLevel, avoid: number | null): FighterHand {
  for (let guard = 0; guard < 80; guard += 1) {
    const op = level.ops[Math.floor(Math.random() * level.ops.length)]
    let a: number
    let b: number
    let target: number
    if (op === '+') {
      a = rnd(2, level.max)
      b = rnd(2, level.max)
      target = a + b
    } else if (op === '−') {
      a = rnd(6, level.max + 2)
      b = rnd(1, a - 1)
      target = a - b
    } else {
      a = rnd(2, level.max)
      b = rnd(2, level.max)
      target = a * b
    }
    if (target === avoid) continue
    /* a va b bir xil bo'lsa, Set ikkalasini bitta chipga qo'shib yuboradi —
       qalqonni urish imkonsiz qoladi, shuning uchun qayta tanlanadi */
    if (a === b) continue
    const chips = new Set<number>([a, b])
    while (chips.size < 4) chips.add(rnd(2, level.max + 2))
    return { target, chips: shuffle([...chips]) }
  }
  return { target: 9, chips: shuffle([4, 5, 7, 8]) }
}

/** Amalni qo'llash — ayirishda katta sondan kichigi ayriladi */
export const applyFighterOp = (a: number, b: number, op: FighterOp): number => {
  if (op === '+') return a + b
  if (op === '×') return a * b
  return Math.abs(a - b)
}

export function fighterOutcome(hits: number, enemyHp: number, hpLeft: number, maxHp: number) {
  const won = hits >= enemyHp
  const stars = !won ? 0 : hpLeft >= maxHp ? 3 : hpLeft >= Math.ceil(maxHp / 2) ? 2 : 1
  return { stars, coins: hits * 4 + stars * 5, xp: hits * 8 }
}

/* ───────────────────── Katalog ───────────────────── */

export type GameRoute = 'Balance' | 'Memory' | 'NumberLine' | 'Fighters'

export interface GameCatalogEntry {
  id: 'balance' | 'memory' | 'numberline' | 'fighters'
  title: string
  sub: string
  mark: GameMarkKey
  route: GameRoute
  /** daraja id'lari — `gameStars[`${id}:${levelId}`]` shu yerdan yig'iladi */
  levels: string[]
}

export const GAME_CATALOG: GameCatalogEntry[] = [
  {
    id: 'balance',
    title: 'Muvozanat',
    sub: "Og'irliklarni qo'yib, tarozini tenglashtiring",
    mark: 'scale',
    route: 'Balance',
    levels: BALANCE_LEVELS.map(l => l.id),
  },
  {
    id: 'memory',
    title: 'Sonlar xotirasi',
    sub: 'Ifoda va natijani juftlashtiring',
    mark: 'memory',
    route: 'Memory',
    levels: MEMORY_LEVELS.map(l => l.id),
  },
  {
    id: 'numberline',
    title: "Sonlar chizig'i",
    sub: 'Nishon sonni relsda toping',
    mark: 'line',
    route: 'NumberLine',
    levels: NUMBERLINE_LEVELS.map(l => l.id),
  },
  {
    id: 'fighters',
    title: 'Raqam jangchilari',
    sub: "Qalqon sonini ikki chip bilan uring",
    mark: 'fight',
    route: 'Fighters',
    levels: FIGHTER_LEVELS.map(l => l.id),
  },
]

/** Barcha o'yinlar bo'yicha maksimal yulduz */
export const GAME_STARS_TOTAL = GAME_CATALOG.reduce((n, g) => n + g.levels.length * 3, 0)

export const starsOf = (gameStars: Record<string, number>, gameId: string, levels: string[]) =>
  levels.reduce((n, id) => n + (gameStars[`${gameId}:${id}`] ?? 0), 0)
