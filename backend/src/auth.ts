import type { Env } from './env'
import { hex, json, sha256 } from './http'

export type TelegramProfile = { id: number; name: string; username: string }

export type SessionUser = {
  id: string
  name: string
  username: string
  telegramId: number
}

const NONCE_TTL_S = 600
const SESSION_TTL_S = 60 * 60 * 24 * 30
const NONCE_RE = /^[a-f0-9]{32}$/

type NonceEntry = { createdAt: number; user?: TelegramProfile }

const api = (env: Env, method: string) => `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`

const sendMessage = async (env: Env, chatId: number, text: string) => {
  if (!env.BOT_TOKEN) return
  try {
    await fetch(api(env, 'sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    })
  } catch {
    /* Telegram javob bermasa ham kirish oqimi to'xtamaydi */
  }
}

/** Bot webhook'i boshqa joyga ko'chib qolmasligi uchun har urinishda qayta tasdiqlanadi. */
const ensureWebhook = async (env: Env, origin: string) => {
  if (!env.BOT_TOKEN) return
  try {
    await fetch(api(env, 'setWebhook'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `${origin}/api/telegram`,
        ...(env.TELEGRAM_WEBHOOK_SECRET ? { secret_token: env.TELEGRAM_WEBHOOK_SECRET } : {}),
        allowed_updates: ['message'],
        drop_pending_updates: false,
      }),
    })
  } catch {
    /* webhook allaqachon turgan bo'lishi mumkin */
  }
}

const saveUser = async (env: Env, profile: TelegramProfile) => {
  const id = `tg:${profile.id}`
  const now = Date.now()
  await env.DB.prepare(
    `insert into users (id, telegram_id, name, username, created_at, last_seen_at)
     values (?, ?, ?, ?, ?, ?)
     on conflict(id) do update set
       name = excluded.name,
       username = excluded.username,
       last_seen_at = excluded.last_seen_at`
  )
    .bind(id, profile.id, profile.name, profile.username, now, now)
    .run()
  return id
}

const createSession = async (env: Env, userId: string) => {
  const token = hex(32)
  const now = Date.now()
  await env.DB.prepare('delete from sessions where expires_at <= ?').bind(now).run()
  await env.DB.prepare('insert into sessions (token_hash, user_id, created_at, expires_at) values (?, ?, ?, ?)')
    .bind(await sha256(token), userId, now, now + SESSION_TTL_S * 1000)
    .run()
  return token
}

export const authenticate = async (request: Request, env: Env): Promise<SessionUser | null> => {
  const header = request.headers.get('authorization') || ''
  if (!header.toLowerCase().startsWith('bearer ')) return null
  const token = header.slice(7).trim()
  if (token.length !== 64) return null

  const row = await env.DB.prepare(
    `select u.id, u.name, u.username, u.telegram_id, s.expires_at
     from sessions s join users u on u.id = s.user_id
     where s.token_hash = ?`
  )
    .bind(await sha256(token))
    .first<{ id: string; name: string; username: string; telegram_id: number; expires_at: number }>()

  if (!row || row.expires_at <= Date.now()) return null
  return { id: row.id, name: row.name, username: row.username, telegramId: row.telegram_id }
}

export const revokeSession = async (request: Request, env: Env) => {
  const header = request.headers.get('authorization') || ''
  if (!header.toLowerCase().startsWith('bearer ')) return false
  const token = header.slice(7).trim()
  if (token.length !== 64) return false
  const result = await env.DB.prepare('delete from sessions where token_hash = ?').bind(await sha256(token)).run()
  return (result.meta.changes ?? 0) > 0
}

export const startLogin = async (request: Request, env: Env) => {
  await ensureWebhook(env, new URL(request.url).origin)

  const nonce = hex(16)
  await env.AUTH.put(`auth/${nonce}`, JSON.stringify({ createdAt: Date.now() } satisfies NonceEntry), {
    expirationTtl: NONCE_TTL_S,
  })

  return json({
    nonce,
    url: `https://t.me/${env.TELEGRAM_BOT_USERNAME}?start=${nonce}`,
    expiresIn: NONCE_TTL_S,
  })
}

export const pollLogin = async (request: Request, env: Env) => {
  const nonce = new URL(request.url).searchParams.get('nonce') || ''
  if (!NONCE_RE.test(nonce)) return json({ status: 'invalid' }, 400)

  const raw = await env.AUTH.get(`auth/${nonce}`)
  if (!raw) return json({ status: 'expired' })

  const entry = JSON.parse(raw) as NonceEntry
  if (!entry.user) return json({ status: 'pending' })

  await env.AUTH.delete(`auth/${nonce}`)
  const userId = await saveUser(env, entry.user)
  const token = await createSession(env, userId)

  return json({ status: 'ready', user: entry.user, token, expiresIn: SESSION_TTL_S })
}

const HOW_TO =
  "Bu bot faqat HDP Academy hisobini tasdiqlaydi.\n\nKirish uchun ilovadagi «Telegram bilan kirish» tugmasini bosing."

export const telegramWebhook = async (request: Request, env: Env) => {
  if (env.TELEGRAM_WEBHOOK_SECRET && request.headers.get('x-telegram-bot-api-secret-token') !== env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('forbidden', { status: 403 })
  }

  let update: { message?: { text?: unknown; chat?: { id?: number }; from?: { id?: number; first_name?: string; last_name?: string; username?: string; is_bot?: boolean } } }
  try {
    update = await request.json()
  } catch {
    return new Response('ok')
  }

  const msg = update?.message
  const chatId = msg?.chat?.id
  const from = msg?.from
  if (!chatId || !from || from.is_bot) return new Response('ok')

  const text = typeof msg?.text === 'string' ? msg.text.trim() : ''
  const [command, payload] = text.split(/\s+/)

  if (command === '/start' && payload) {
    const nonce = payload.replace(/[^a-z0-9]/gi, '').slice(0, 64)
    const key = `auth/${nonce}`
    const raw = NONCE_RE.test(nonce) ? await env.AUTH.get(key) : null

    if (!raw) {
      await sendMessage(env, chatId, 'Havola eskirgan. Ilovaga qaytib, «Telegram bilan kirish»ni qaytadan bosing.')
      return new Response('ok')
    }

    const entry = JSON.parse(raw) as NonceEntry
    if (Date.now() - entry.createdAt > NONCE_TTL_S * 1000) {
      await sendMessage(env, chatId, 'Havola eskirgan. Ilovaga qaytib, «Telegram bilan kirish»ni qaytadan bosing.')
      return new Response('ok')
    }

    const name = [from.first_name, from.last_name].filter(Boolean).join(' ').trim()
    const user: TelegramProfile = {
      id: from.id as number,
      name: name || from.username || 'Telegram foydalanuvchisi',
      username: from.username || '',
    }

    await env.AUTH.put(key, JSON.stringify({ ...entry, user } satisfies NonceEntry), {
      expirationTtl: NONCE_TTL_S,
    })
    await sendMessage(env, chatId, `✅ ${user.name}, hisob tasdiqlandi.\n\nHDP Academy ilovasiga qayting — kirish avtomatik yakunlanadi.`)
    return new Response('ok')
  }

  await sendMessage(env, chatId, HOW_TO)
  return new Response('ok')
}
