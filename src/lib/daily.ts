import { findTopic, shortTitle, topicTestOf } from '../data/curriculum'
import type { TopicLessonState } from '../store/useStore'
import type { AiDifficulty, AiTopic } from './ai'

/**
 * Kunlik masala uchun mavzu tanlovi: faqat o'quvchi haqiqatan ochgan
 * mavzular. Hech biri ochilmagan bo'lsa — kurs boshi (1-mavzu).
 */

export const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export interface StudyPlan {
  /** haqiqatan ochilgan mavzular */
  studied: number[]
  /** savol manbai bo'ladigan mavzular (bo'sh bo'lsa — 1-mavzu) */
  nums: number[]
  topics: AiTopic[]
  difficulty: AiDifficulty
}

export const difficultyLabel = (value: string) =>
  value === 'oson' ? 'Oson' : value === 'qiyin' ? 'Qiyin' : "O'rta"

/** Kunlik savolning haqiqiy manbai — ekranlarda shu yozuv ko'rsatiladi */
export const sourceLabel = (source: 'ai' | 'gen' | 'bank') =>
  source === 'ai' ? 'AI' : source === 'gen' ? 'Kunlik mashq' : 'Mavzu testi'

export function studyPlan(topicLessons: Record<string, TopicLessonState>): StudyPlan {
  const studied = new Set<number>()
  Object.entries(topicLessons).forEach(([id, state]) => {
    if (!state.videoSeen && !state.done) return
    const num = Number(id.split('.')[0])
    if (Number.isInteger(num) && num > 0) studied.add(num)
  })

  const studiedNums = [...studied].sort((a, b) => a - b)
  const nums = studiedNums.length ? studiedNums : [1]
  const topics = nums.map(num => ({
    num,
    title: shortTitle(findTopic(num)?.meta.title ?? `Mavzu ${num}`),
  }))
  /** Mavzular qancha ko'p o'rganilgan bo'lsa — savol shuncha qiyin */
  const difficulty: AiDifficulty =
    nums.length >= 6 ? 'qiyin' : nums.length >= 3 ? "o'rta" : 'oson'

  return { studied: studiedNums, nums, topics, difficulty }
}

/** Kun raqami — zaxira savolni kunga qarab tanlash uchun */
export const daySeed = (day: string) => Number(day.replace(/-/g, '')) || 1

export interface BankQuestion {
  prompt: string
  options: string[]
  correct: number
  explain: string
  topic: string
  topicNum: number
}

/** Server javob bermasa — o'rgangan mavzu testidan haqiqiy savol */
export function bankQuestion(nums: number[], seed: number): BankQuestion | null {
  const pool = nums.flatMap(num => {
    const topic = findTopic(num)
    return (topicTestOf(num)?.questions ?? []).map(q => ({
      ...q,
      topic: shortTitle(topic?.meta.title ?? `Mavzu ${num}`),
      topicNum: num,
    }))
  })
  if (!pool.length) return null

  const q = pool[Math.abs(seed) % pool.length]
  return {
    prompt: q.prompt,
    options: q.options,
    correct: q.correct,
    explain: q.explain,
    topic: q.topic,
    topicNum: q.topicNum,
  }
}
