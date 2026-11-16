/**
 * Har kuni 00:05 (UTC) — bepul limit yangilangandan so'ng poolni isitadi.
 * Limit kuniga 50 so'rov: 10 mavzu × 1 daraja × 1 savol = 10 savol
 * (generatsiya + tekshiruv = 20 so'rov), qolgan 30 jonli urinishlar uchun.
 * Daraja pool holatiga qarab tanlanadi — hali savoli yo'q mavzular ko'p bo'lgan
 * daraja birinchi isitiladi, shunda barcha mavzu × daraja tez to'ladi.
 */

import { getStore } from '@netlify/blobs'
import { LEVEL_KEYS, POOL_STORE, TOPICS, poolKey } from '../lib/ai-core.mjs'

const CORS = { 'Content-Type': 'application/json' }

/* Yangi o'quvchilar ko'p — oson va o'rta daraja ustuvor */
const BIAS = { oson: 2, "o'rta": 1, qiyin: 0 }

const dayOfYear = () => {
  const start = Date.UTC(new Date().getUTCFullYear(), 0, 1)
  return Math.floor((Date.now() - start) / 86_400_000)
}

const chooseLevel = async () => {
  try {
    const blobs = getStore(POOL_STORE)
    const empties = {}
    for (const level of LEVEL_KEYS) {
      let empty = 0
      for (const topic of TOPICS) {
        const items = await blobs.get(poolKey(topic.num, level), { type: 'json' })
        if (!Array.isArray(items) || !items.length) empty += 1
      }
      empties[level] = empty
    }
    return LEVEL_KEYS.reduce((best, level) =>
      empties[level] + BIAS[level] > empties[best] + BIAS[best] ? level : best,
    )
  } catch {
    return LEVEL_KEYS[dayOfYear() % LEVEL_KEYS.length]
  }
}

export default async () => {
  const base = process.env.URL || 'https://hdp-academy-auth.netlify.app'
  const difficulty = await chooseLevel()
  try {
    const res = await fetch(`${base}/.netlify/functions/ai-pool-background`, {
      method: 'POST',
      headers: CORS,
      body: JSON.stringify({ levels: [difficulty], count: 1 }),
    })
    return new Response(JSON.stringify({ trigger: res.status, difficulty }), {
      status: 200,
      headers: CORS,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CORS })
  }
}

export const config = { schedule: '5 0 * * *' }
