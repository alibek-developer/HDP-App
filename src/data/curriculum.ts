import { TOPIC_1_LESSONS, TOPIC_1_META, TOPIC_1_PASS, TOPIC_1_TEST } from './topic1'
import { TOPIC_2_LESSONS, TOPIC_2_META, TOPIC_2_PASS, TOPIC_2_TEST } from './topic2'
import { TOPIC_3_LESSONS, TOPIC_3_META, TOPIC_3_PASS, TOPIC_3_TEST } from './topic3'
import { TOPIC_4_LESSONS, TOPIC_4_META, TOPIC_4_PASS, TOPIC_4_TEST } from './topic4'
import { TOPIC_5_LESSONS, TOPIC_5_META, TOPIC_5_PASS, TOPIC_5_TEST } from './topic5'
import { TOPIC_6_LESSONS, TOPIC_6_META, TOPIC_6_PASS, TOPIC_6_TEST } from './topic6'
import { TOPIC_7_LESSONS, TOPIC_7_META, TOPIC_7_PASS, TOPIC_7_TEST } from './topic7'
import { TOPIC_8_LESSONS, TOPIC_8_META, TOPIC_8_PASS, TOPIC_8_TEST } from './topic8'
import { TOPIC_9_LESSONS, TOPIC_9_META, TOPIC_9_PASS, TOPIC_9_TEST } from './topic9'
import { TOPIC_10_LESSONS, TOPIC_10_META, TOPIC_10_PASS, TOPIC_10_TEST } from './topic10'
import type { TopicLesson, TopicMeta, TopicTest } from './topicTypes'

/**
 * Darslikning barcha 10 mavzusi yagona ro'yxatda. Ekranlar mavzu raqami
 * bo'yicha shu yerdan mazmun oladi — hech qaysi ekran bitta mavzuga
 * bog'lanmagan.
 */

export interface TopicEntry {
  meta: TopicMeta
  lessons: TopicLesson[]
  test: TopicTest
  /** yakuniy testdan o'tish chegarasi (to'g'ri javoblar soni) */
  pass: number
}

export const TOPICS: TopicEntry[] = [
  { meta: TOPIC_1_META, lessons: TOPIC_1_LESSONS, test: TOPIC_1_TEST, pass: TOPIC_1_PASS },
  { meta: TOPIC_2_META, lessons: TOPIC_2_LESSONS, test: TOPIC_2_TEST, pass: TOPIC_2_PASS },
  { meta: TOPIC_3_META, lessons: TOPIC_3_LESSONS, test: TOPIC_3_TEST, pass: TOPIC_3_PASS },
  { meta: TOPIC_4_META, lessons: TOPIC_4_LESSONS, test: TOPIC_4_TEST, pass: TOPIC_4_PASS },
  { meta: TOPIC_5_META, lessons: TOPIC_5_LESSONS, test: TOPIC_5_TEST, pass: TOPIC_5_PASS },
  { meta: TOPIC_6_META, lessons: TOPIC_6_LESSONS, test: TOPIC_6_TEST, pass: TOPIC_6_PASS },
  { meta: TOPIC_7_META, lessons: TOPIC_7_LESSONS, test: TOPIC_7_TEST, pass: TOPIC_7_PASS },
  { meta: TOPIC_8_META, lessons: TOPIC_8_LESSONS, test: TOPIC_8_TEST, pass: TOPIC_8_PASS },
  { meta: TOPIC_9_META, lessons: TOPIC_9_LESSONS, test: TOPIC_9_TEST, pass: TOPIC_9_PASS },
  { meta: TOPIC_10_META, lessons: TOPIC_10_LESSONS, test: TOPIC_10_TEST, pass: TOPIC_10_PASS },
]

/** «Mavzu 3. Kasrlarni qo'shish» → «Kasrlarni qo'shish» */
export const shortTitle = (title: string) => title.replace(/^Mavzu\s+\d+\.\s*/, '')

export const findTopic = (num: number) => TOPICS.find(t => t.meta.num === num)

export const topicLessonsOf = (num: number) => findTopic(num)?.lessons ?? []

export const topicTestOf = (num: number) => findTopic(num)?.test

export const topicPassOf = (num: number) => findTopic(num)?.pass ?? 0

export const findTopicByLesson = (lessonId: string) =>
  TOPICS.find(t => t.lessons.some(l => l.id === lessonId))

export const findTopicLesson = (lessonId: string) =>
  TOPICS.flatMap(t => t.lessons).find(l => l.id === lessonId)

export const topicLessonIds = (num: number) => topicLessonsOf(num).map(l => l.id)

export const topicVideoCount = (num: number) =>
  topicLessonsOf(num).reduce((n, l) => n + l.videos.length, 0)

export const topicTestCount = (num: number) => topicTestOf(num)?.questions.length ?? 0
