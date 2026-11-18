import { SUBJECTS } from './subjects'
import { TOPICS, findTopic } from './curriculum'

/**
 * To'lov qoidasi: har bir fandagi boshidagi N ta dars bepul,
 * qolganlari faqat Pro. Fanlar `SUBJECTS` tartibida, darslar esa
 * mavzular → bo'limlar ketma-ketligi bo'yicha sanaladi.
 */
export const FREE_LESSONS_PER_SUBJECT = 10

let cache: Map<string, Set<string>> | null = null

function buildFreeMap(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const subject of SUBJECTS) {
    const ids = subject.topics
      .flatMap(t => TOPICS.find(x => x.meta.num === t.num)?.lessons.map(l => l.id) ?? [])
      .slice(0, FREE_LESSONS_PER_SUBJECT)
    map.set(subject.id, new Set(ids))
  }
  return map
}

function freeMap(): Map<string, Set<string>> {
  return (cache ??= buildFreeMap())
}

/** Dars id'si qaysi fandagi bepul ro'yxatda bormi */
export const isFreeLessonId = (lessonId: string): boolean => {
  for (const set of freeMap().values()) {
    if (set.has(lessonId)) return true
  }
  return false
}

/** Mavzuda Pro talab qilinadigan (pullik) bo'lim bor-yo'qligi */
export const topicHasPaidLessons = (topicNum: number): boolean =>
  (findTopic(topicNum)?.lessons ?? []).some(l => !isFreeLessonId(l.id))
