import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApp } from '../store/useStore'
import type { DailyQuestion } from '../store/useStore'
import { bankQuestion, daySeed, studyPlan, todayKey } from './daily'
import { generateDaily } from './dailyGen'

/**
 * Bugungi kunlik to'plam: o'rgangan mavzular bo'ylab 10 ta savol.
 * Barchasi ilova ichida tuziladi (AI'siz, darhol) — har biri o'z mavzusidan.
 */

export const DAILY_SET_SIZE = 10

type Status = 'ready' | 'loading' | 'error'

/** Bir kunda bitta to'plam — Home, Masalalar va Kunlik ekran bitta nusxani o'qiydi */
const inflight = { day: null as string | null }

export function useDailySet() {
  const stored = useApp(s => s.dailySet)
  const setDailySet = useApp(s => s.setDailySet)
  const topicLessons = useApp(s => s.topicLessons)
  const publicId = useApp(s => s.publicId)

  const plan = useMemo(() => studyPlan(topicLessons), [topicLessons])
  const day = todayKey()
  const questions = useMemo(
    () => (stored.length ? stored.filter(q => q.day === day) : []),
    [stored, day],
  )
  const [status, setStatus] = useState<Status>(questions.length ? 'ready' : 'loading')

  const load = useCallback(() => {
    if (inflight.day === day) return

    /** Bugun allaqachon to'liq javob berilgan — to'plam almashtirilmaydi */
    const current = useApp.getState().dailySet.filter(q => q.day === day)
    if (current.length >= DAILY_SET_SIZE && current.every(q => q.picked !== null)) return
    if (current.length) {
      /** To'liq to'plam saqlanib qolgan — davom etiladi */
      setStatus('ready')
      return
    }

    inflight.day = day
    try {
      const seen = new Set<string>()
      const out: DailyQuestion[] = []

      for (let i = 0; i < DAILY_SET_SIZE; i += 1) {
        const num = plan.nums[i % plan.nums.length] ?? 1
        const subPlan = { ...plan, nums: [num] }
        const gen = generateDaily({ plan: subPlan, day, publicId, nonce: i * 31 + num })
        let q: DailyQuestion | null = gen
          ? {
              ...gen,
              day,
              difficulty: plan.difficulty,
              source: 'gen' as const,
              picked: null,
            }
          : null

        if (!q || seen.has(q.prompt)) {
          const bank = bankQuestion([num], daySeed(day) + i * 7)
          if (bank && !seen.has(bank.prompt)) {
            q = { ...bank, day, difficulty: plan.difficulty, source: 'bank' as const, picked: null }
          }
        }
        if (!q || seen.has(q.prompt)) continue
        seen.add(q.prompt)
        out.push(q)
      }

      if (out.length) {
        setDailySet(out)
        setStatus('ready')
      } else {
        setStatus('error')
      }
    } finally {
      if (inflight.day === day) inflight.day = null
    }
  }, [day, plan, publicId, setDailySet])

  useEffect(() => {
    if (questions.length < DAILY_SET_SIZE) load()
  }, [questions.length, load])

  return { questions, status: questions.length ? 'ready' : status, plan }
}
