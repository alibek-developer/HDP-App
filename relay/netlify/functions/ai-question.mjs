/**
 * Kunlik AI masala — o'quvchi o'rgangan mavzular doirasida bitta test savoli.
 * Birinchi navbatda oldindan tayyorlangan pool'dan (Blobs) bir zumda qaytadi;
 * pool bo'sh bo'lsa — jonli generatsiya (cheklangan vaqt byudjeti bilan).
 * Javob bo'lmasa ilova mavzu testidan haqiqiy savolga qaytadi.
 */

import { getStore } from '@netlify/blobs'
import {
  CORS,
  POOL_MAX,
  POOL_STORE,
  clean,
  generate,
  poolKey,
  reply,
  LEVELS,
} from '../lib/ai-core.mjs'

/** Netlify sinxron funksiyasi ~10 s da uziladi */
const TOTAL_BUDGET_MS = 9000

const store = () => {
  try {
    return getStore(POOL_STORE)
  } catch {
    return null
  }
}

/** Barcha mos kalitlardan bitta savol tanlaydi va uni navbat oxiriga suradi */
const pickFromPool = async (blobs, nums, difficulty) => {
  if (!blobs) return null
  const candidates = []
  for (const num of nums) {
    try {
      const items = await blobs.get(poolKey(num, difficulty), { type: 'json' })
      if (Array.isArray(items)) {
        for (const item of items) candidates.push({ item, num })
      }
    } catch {
      /* Blobs mavjud bo'lmasa — jonli generatsiyaga tushamiz */
    }
  }
  if (!candidates.length) return null

  const picked = candidates[Math.floor(Math.random() * candidates.length)]
  try {
    const items = (await blobs.get(poolKey(picked.num, difficulty), { type: 'json' })) || []
    if (Array.isArray(items) && items.length > 1) {
      const rest = items.filter(i => i.prompt !== picked.item.prompt)
      await blobs.setJSON(poolKey(picked.num, difficulty), [...rest, picked.item])
    }
  } catch {
    /* navbatni yangilab bo'lmasa ham javob qaytadi */
  }
  return { ...picked.item, topicNum: picked.num }
}

const addToPool = async (blobs, num, difficulty, question) => {
  if (!blobs) return
  const key = poolKey(num, difficulty)
  try {
    const items = (await blobs.get(key, { type: 'json' })) || []
    if (!Array.isArray(items)) return
    if (items.some(i => i.prompt === question.prompt)) return
    await blobs.setJSON(key, [...items, { ...question, topicNum: num }].slice(-POOL_MAX))
  } catch {
    /* poolga yozib bo'lmasa ham javob qaytadi */
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (req.method !== 'POST') return reply({ error: 'method' }, 405)

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return reply({ error: 'ai_unavailable' }, 503)

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return reply({ error: 'bad_request' }, 400)

  const topics = Array.isArray(body.topics)
    ? body.topics
        .map(t => ({ num: Number(t?.num), title: clean(t?.title, 80) }))
        .filter(t => Number.isInteger(t.num) && t.num > 0 && t.title)
        .slice(0, 10)
    : []
  if (!topics.length) return reply({ error: 'topics_required' }, 400)

  const difficulty = body.difficulty in LEVELS ? body.difficulty : "o'rta"
  const avoid = Array.isArray(body.avoid)
    ? body.avoid.map(a => clean(a, 120)).filter(Boolean).slice(0, 5)
    : []

  const blobs = store()
  const pooled = await pickFromPool(blobs, topics.map(t => t.num), difficulty)
  if (pooled) return reply({ question: pooled, pool: true, verified: true })

  const started = Date.now()
  const trace = []
  const result = await generate(apiKey, {
    topics,
    difficulty,
    avoid,
    left: () => TOTAL_BUDGET_MS - (Date.now() - started),
    trace,
  })
  if (!result) return reply({ error: 'ai_failed', ...(body.debug ? { trace } : {}) }, 502)

  const target = topics.find(t => t.title === result.question.topic) ?? topics[topics.length - 1]
  await addToPool(blobs, target.num, difficulty, result.question)
  return reply({ question: result.question, model: result.model, verified: true })
}

export const config = { path: '/api/ai-question' }
