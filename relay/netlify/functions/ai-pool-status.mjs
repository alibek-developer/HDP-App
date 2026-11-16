/** Pool holati: har mavzu/daraja bo'yicha nechta tekshirilgan savol bor (diagnostika) */

import { getStore } from '@netlify/blobs'
import { LEVEL_KEYS, POOL_STORE, TOPICS, poolKey } from '../lib/ai-core.mjs'

export default async () => {
  const out = {}
  let blobs
  try {
    blobs = getStore(POOL_STORE)
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  for (const topic of TOPICS) {
    for (const level of LEVEL_KEYS) {
      const items = await blobs.get(poolKey(topic.num, level), { type: 'json' }).catch(() => null)
      out[`${topic.num}/${level}`] = Array.isArray(items) ? items.length : 0
    }
  }

  return new Response(JSON.stringify(out), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/ai-pool' }
