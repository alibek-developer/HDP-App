import { getStore } from '@netlify/blobs'

/**
 * Telegram bot webhook — faqat hisobni tasdiqlash uchun.
 * Ilova `/start <nonce>` havolasini ochadi; Telegram profili nonce ostiga
 * yoziladi va ilova uni olib ketadi. Boshqa hech qanday havola/ilova yo'q.
 */

const BOT_TOKEN = process.env.BOT_TOKEN
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET

const api = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`

const send = async (chatId, text) => {
  await fetch(api('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  })
}

const HOW_TO =
  "Bu bot faqat HDP Academy hisobini tasdiqlaydi.\n\nKirish uchun ilovadagi «Telegram bilan kirish» tugmasini bosing."

export default async (req) => {
  if (req.method !== 'POST') return new Response('ok')
  if (SECRET && req.headers.get('x-telegram-bot-api-secret-token') !== SECRET) {
    return new Response('forbidden', { status: 403 })
  }

  let update
  try {
    update = await req.json()
  } catch {
    return new Response('ok')
  }

  const msg = update?.message
  const text = typeof msg?.text === 'string' ? msg.text.trim() : ''
  const chatId = msg?.chat?.id
  const from = msg?.from

  if (!chatId || !from || from.is_bot) return new Response('ok')

  const [command, payload] = text.split(/\s+/)

  if (command === '/start' && payload) {
    const nonce = payload.replace(/[^a-z0-9]/gi, '').slice(0, 64)
    const store = getStore('hdp-auth')
    const key = `auth/${nonce}`
    const entry = await store.get(key, { type: 'json' })
    const fresh = entry && Date.now() - entry.createdAt <= (entry.ttl || 0)

    if (!fresh) {
      await send(chatId, "Havola eskirgan. Ilovaga qaytib, «Telegram bilan kirish»ni qaytadan bosing.")
      return new Response('ok')
    }

    const name = [from.first_name, from.last_name].filter(Boolean).join(' ').trim()
    const user = {
      id: from.id,
      name: name || from.username || 'Telegram foydalanuvchisi',
      username: from.username || '',
    }

    await store.setJSON(key, { ...entry, user })
    await send(
      chatId,
      `✅ ${user.name}, hisob tasdiqlandi.\n\nHDP Academy ilovasiga qayting — kirish avtomatik yakunlanadi.`
    )
    return new Response('ok')
  }

  await send(chatId, HOW_TO)
  return new Response('ok')
}

export const config = { path: '/api/telegram' }
