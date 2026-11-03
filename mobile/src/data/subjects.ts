import { TOPIC_1_LESSONS, TOPIC_1_TEST, type TopicLesson } from './topic1'

/**
 * Fanlar (kurs darajasi). Hozircha faqat Algebra I mazmuni yuklangan:
 * `topics` ro'yxati bo'sh bo'lgan fan ekranida «mavzular kiritilmagan» holati
 * chiziladi, shuning uchun yangi mavzu tushganda faqat shu fayl to'ldiriladi.
 */

/** Mavzu raqami → bo'limlari. Yangi `topic2.ts` shu yerga qo'shiladi. */
const TOPIC_DATA: Record<number, TopicLesson[]> = { 1: TOPIC_1_LESSONS }

/** Mavzu raqami → yakuniy testi */
const TOPIC_TESTS: Record<number, unknown[]> = { 1: TOPIC_1_TEST.questions }

export interface SubjectTopic {
  num: number
  title: string
}

export interface Subject {
  id: string
  name: string
  /** fan kartasidagi bitta harf */
  badge: string
  topics: SubjectTopic[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'algebra-1',
    name: 'Algebra I',
    badge: 'A',
    topics: [{ num: 1, title: 'Matematikaga kirish. Natural sonlar va amallar' }],
  },
  { id: 'geometriya', name: 'Geometriya', badge: 'G', topics: [] },
  { id: 'stereometriya', name: 'Stereometriya', badge: 'S', topics: [] },
]

export const findSubject = (id: string) => SUBJECTS.find(s => s.id === id)

/** Bo'lim kalitlari (`1.1`, `1.2`, ...) — store'dagi `topicLessons` shu kalitda turadi */
export const topicLessonIds = (num: number) => (TOPIC_DATA[num] ?? []).map(l => l.id)

export const topicVideoCount = (num: number) =>
  (TOPIC_DATA[num] ?? []).reduce((n, l) => n + l.videos.length, 0)

export const topicTestCount = (num: number) => (TOPIC_TESTS[num] ?? []).length
