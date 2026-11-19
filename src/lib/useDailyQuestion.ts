import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApp } from '../store/useStore'
import { askAiQuestion } from './ai'
import { bankQuestion, daySeed, studyPlan, todayKey } from './daily'
import { generateDaily } from './dailyGen'

/**
 * Bugungi savol: avval ilova ichida tuziladi (AI'siz, darhol), keyin AI
 * tayyor javobni tez qaytarsa — o'sha tekshirilgan savol bilan almashtiriladi.
 * Shunday qilib savol hech qachon yuklab bo'lmaslik holatiga tushmaydi.
 */

type Status = 'ready' | 'loading' | 'error'

/** Pool'dan javob ~1 s; jonli generatsiya 10 s+ — kunlik savol buncha kutmaydi */
const AI_BUDGET_MS = 2600
/** «Qayta so'rash» — foydalanuvchi kutishga tayyor */
const AI_RETRY_MS = 9000

/** Bir vaqtda faqat bitta AI so'rovi — Home, Masalalar va Kunlik bir kunda */
const inflight = { day: null as string | null }

export function useDailyQuestion() {
  const stored = useApp(s => s.dailyQuestion)
  const setDailyQuestion = useApp(s => s.setDailyQuestion)
  const topicLessons = useApp(s => s.topicLessons)
  const publicId = useApp(s => s.publicId)

  const plan = useMemo(() => studyPlan(topicLessons), [topicLessons])
  const day = todayKey()
  const question = stored && stored.day === day ? stored : null
  const [status, setStatus] = useState<Status>(question ? 'ready' : 'loading')

  const load = useCallback(
    async (fresh = false) => {
      const busy = inflight.day === day
      if (busy && !fresh) return

      /** Bugun allaqachon javob berilgan — savol almashtirilmaydi */
      const current = useApp.getState().dailyQuestion
      if (current?.day === day && current.picked !== null) return

      const local = generateDaily({ plan, day, publicId, nonce: fresh ? Date.now() : 0 })
      /** kutilayotgan savol matni; «Qayta so'rash» bosilsa — eski AI javobi tashlanadi */
      const expected = local?.prompt ?? null
      if (local) {
        setDailyQuestion({ ...local, day, difficulty: plan.difficulty, source: 'gen', picked: null })
        setStatus('ready')
      }
      if (busy) return
      inflight.day = day

      try {
        const answer = await askAiQuestion(
          { topics: plan.topics, difficulty: plan.difficulty },
          { timeoutMs: fresh ? AI_RETRY_MS : AI_BUDGET_MS },
        )
        const latest = useApp.getState().dailyQuestion
        if (!latest || latest.day !== day || latest.picked !== null) return
        if (expected && latest.prompt !== expected) return
        const last = plan.topics[plan.topics.length - 1]
        setDailyQuestion({
          day,
          topic: answer.topic || last.title,
          topicNum: last.num,
          difficulty: plan.difficulty,
          prompt: answer.prompt,
          options: answer.options,
          correct: answer.correct,
          explain: answer.explain,
          source: 'ai',
          picked: null,
        })
      } catch {
        /** AI javob bermadi — lokal savol qoladi; u ham bo'lmasa bankka tushamiz */
        if (local) return
        const fallback = bankQuestion(plan.nums, daySeed(day))
        if (fallback) {
          setDailyQuestion({ ...fallback, day, difficulty: plan.difficulty, source: 'bank', picked: null })
          setStatus('ready')
        } else {
          setStatus('error')
        }
      } finally {
        if (inflight.day === day) inflight.day = null
      }
    },
    [day, plan, publicId, setDailyQuestion],
  )

  useEffect(() => {
    if (!question) load()
  }, [question, load])

  return { question, status: question ? 'ready' : status, plan, reload: () => load(true) }
}
