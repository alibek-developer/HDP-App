/**
 * Pool isituvchi fon funksiyasi (Netlify background, 15 daqiqagacha).
 * Har mavzu × daraja uchun bir nechta tekshirilgan savol tayyorlab, Blobs'ga yozadi.
 * Shu tufayli onlayn so'rov bepul modelning sekin javobini kutmaydi.
 */

import { getStore } from '@netlify/blobs'
import {
  LEVEL_KEYS,
  POOL_MAX,
  POOL_STORE,
  TOPICS,
  generate,
  poolKey,
} from '../lib/ai-core.mjs'

const RUN_BUDGET_MS = 12 * 60 * 1000
/* Bepul model limiti daqiqasiga 20 so'rov — parallel ishni past tutamiz */
const CONCURRENCY = 2
/* OpenRouter bepul limiti kuniga 50 so'rov: 42 isitishga, 8 zaxira jonli so'rovlarga */
const REQUEST_BUDGET = 42

const readPool = async (blobs, key) => {
  try {
    const items = await blobs.get(key, { type: 'json' })
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

const fillKey = async (apiKey, blobs, topic, difficulty, want, deadline, budget) => {
  const key = poolKey(topic.num, difficulty)
  let items = await readPool(blobs, key)
  /* want — shu yurgizishda qo'shiladigan savol soni; mavjudlarini ustiga qo'shamiz */
  const target = Math.min(items.length + want, POOL_MAX)
  let attempts = 0

  while (
    items.length < target &&
    Date.now() < deadline &&
    attempts < want + 2 &&
    budget.used < budget.max
  ) {
    attempts += 1
    const result = await generate(apiKey, {
      topics: [topic],
      difficulty,
      avoid: items.map(i => i.prompt),
      left: () => deadline - Date.now(),
      spend: budget.spend,
    })
    if (!result) continue
    const entry = { ...result.question, topicNum: topic.num }
    if (items.some(i => i.prompt === entry.prompt)) continue
    items = [...items, entry].slice(-POOL_MAX)
    try {
      await blobs.setJSON(key, items)
    } catch {
      return
    }
  }
}

export default async (req) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return new Response('no key', { status: 503 })

  const body = await req.json().catch(() => ({}))
  const nums = Array.isArray(body?.nums) && body.nums.length ? body.nums.map(Number) : null
  const levels = Array.isArray(body?.levels) && body.levels.length ? body.levels : LEVEL_KEYS
  const want = Math.max(1, Math.min(Number(body?.count) || 2, POOL_MAX))

  const topics = (nums ? TOPICS.filter(t => nums.includes(t.num)) : TOPICS)
  const jobs = topics.flatMap(topic => levels.map(difficulty => ({ topic, difficulty })))

  const run = async () => {
    let blobs
    try {
      blobs = getStore(POOL_STORE)
    } catch {
      return
    }
    const deadline = Date.now() + RUN_BUDGET_MS
    const budget = {
      used: 0,
      max: REQUEST_BUDGET,
      spend: () => {
        if (budget.used >= budget.max) return false
        budget.used += 1
        return true
      },
    }
    let cursor = 0

    const worker = async () => {
      while (cursor < jobs.length && Date.now() < deadline && budget.used < budget.max) {
        const job = jobs[cursor++]
        await fillKey(apiKey, blobs, job.topic, job.difficulty, want, deadline, budget).catch(
          () => {},
        )
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  }

  /* Klient 202 ni darhol oladi, ish shu funksiya ichida davom etadi (15 daqiqagacha) */
  await run()
  return new Response(JSON.stringify({ queued: jobs.length }), { status: 202 })
}

export const config = { background: true }
