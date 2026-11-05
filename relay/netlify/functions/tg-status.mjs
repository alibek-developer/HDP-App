import { getStore } from '@netlify/blobs'

/**
 * Ilova shu endpoint'ni so'rab turadi. Telegram tasdiqlagan bo'lsa —
 * haqiqiy profil bir marta qaytariladi va nonce o'chiriladi.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method' }), { status: 405, headers: CORS })
  }

  const nonce = new URL(req.url).searchParams.get('nonce') || ''
  if (!/^[a-f0-9]{32}$/.test(nonce)) {
    return new Response(JSON.stringify({ status: 'invalid' }), { status: 400, headers: CORS })
  }

  const store = getStore('hdp-auth')
  const key = `auth/${nonce}`
  const entry = await store.get(key, { type: 'json' })

  if (!entry) {
    return new Response(JSON.stringify({ status: 'expired' }), { status: 200, headers: CORS })
  }

  if (entry.user) {
    await store.delete(key)
    return new Response(JSON.stringify({ status: 'ready', user: entry.user }), { status: 200, headers: CORS })
  }

  if (Date.now() - entry.createdAt > (entry.ttl || 0)) {
    await store.delete(key)
    return new Response(JSON.stringify({ status: 'expired' }), { status: 200, headers: CORS })
  }

  return new Response(JSON.stringify({ status: 'pending' }), { status: 200, headers: CORS })
}

export const config = { path: '/api/tg-status' }
