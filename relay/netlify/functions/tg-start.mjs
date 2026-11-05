import { randomBytes } from 'node:crypto'
import { getStore } from '@netlify/blobs'

/**
 * Telegram kirish boshlanishi: ilova nonce oladi va Telegram'dagi bot
 * havolasini ochadi. Bot `/start <nonce>` xabarini olganda webhook shu
 * nonce ostiga haqiqiy Telegram profilini yozadi.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'hdpappbot'
const BOT_TOKEN = process.env.BOT_TOKEN
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET
const TTL_MS = 10 * 60 * 1000

/** Render'dagi eski bot polling'i webhook'ni o'chirib qo'yishi mumkin —
 *  har kirish urinishida manzilni qayta tasdiqlaymiz. Xato kirishni to'xtatmaydi. */
const ensureWebhook = async (origin) => {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `${origin}/api/telegram`,
        ...(WEBHOOK_SECRET ? { secret_token: WEBHOOK_SECRET } : {}),
        allowed_updates: ['message'],
        drop_pending_updates: false,
      }),
    })
  } catch {
    /* webhook allaqachon turgan bo'lishi mumkin */
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method' }), { status: 405, headers: CORS })
  }

  const origin = new URL(req.url).origin
  await ensureWebhook(origin)

  const nonce = randomBytes(16).toString('hex')
  const store = getStore('hdp-auth')
  await store.setJSON(`auth/${nonce}`, { createdAt: Date.now(), ttl: TTL_MS })

  return new Response(
    JSON.stringify({
      nonce,
      url: `https://t.me/${BOT_USERNAME}?start=${nonce}`,
      expiresIn: Math.round(TTL_MS / 1000),
    }),
    { status: 200, headers: CORS }
  )
}

export const config = { path: '/api/tg-start' }
