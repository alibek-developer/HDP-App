import type { Question } from './content'

/**
 * Mavzu bo'limlari uchun yagona tiplar. Har bir `topicN.ts` shu shaklda
 * yoziladi — kitobdagi bo'lim tartibi va matni o'zgartirilmaydi.
 */

export interface TopicVideo {
  /** YouTube video id (youtu.be/<id>) */
  id: string
  /** kitobdagi sarlavha + qism */
  title: string
}

export type TheoryKind =
  | "TA'RIF"
  | "MA'LUMOT"
  | 'MASALAN'
  | 'ESLATISH'
  | 'SAVOL'
  | 'YECHISH'
  | 'MAQSAD'
  | 'XULOSA'

export interface TheoryBlock {
  kind: TheoryKind
  text: string
}

export interface TheoryList {
  caption: string
  items: string[]
}

/** Ustun shaklidagi hisob: 8567 / + 1129 / 9696 */
export interface Stack {
  op: '+' | '−' | '·' | ':'
  rows: string[]
  result: string
}

export interface WorkedItem {
  prompt: string
  stack?: Stack
  steps?: string[]
  answer: string
}

/** Kitobdagi mashq — javob faqat kitobda aniq bo'lsa yoziladi */
export interface TopicExercise {
  prompt: string
  answer?: string
  steps?: string[]
}

export interface TopicProperty {
  name: string
  detail: string
  example: string
}

export interface TopicLesson {
  /** '2.1' … '2.11' */
  id: string
  n: number
  title: string
  goal: string
  /** taxminiy daqiqa */
  minutes: number
  /** nazariy va amaliy video */
  videos: TopicVideo[]
  theory: TheoryBlock[]
  lists?: TheoryList[]
  example?: WorkedItem
  properties?: TopicProperty[]
  practice: WorkedItem[]
  /** javobsiz mashqlar — kitobdagi «O'zingizni sinab ko'ring» va amaliy qism */
  exercises?: TopicExercise[]
  /** nazariya faqat video darsda (manbada matn bo'lmagan bo'lim) */
  videoOnly?: boolean
}

export interface TopicMeta {
  id: string
  num: number
  chapter: string
  title: string
  lessonCount: number
}

export interface TopicTest {
  id: string
  n: number
  title: string
  goal: string
  total: number
  coinPerSolve: number
  xpPerSolve: number
  questions: Question[]
}
