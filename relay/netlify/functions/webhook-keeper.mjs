/**
 * Webhook qo'riqchisi: Render'dagi eski bot uyg'onganda webhook'ni o'chirib
 * yuborishi mumkin. Har daqiqada tekshiramiz va kerak bo'lsa qayta o'rnatamiz,
 * shunda Telegram tasdig'i ilovaga darhol yetib boradi.
 */

const BOT_TOKEN = process.env.BOT_TOKEN
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET
const SITE = process.env.URL || 'https://hdp-academy-auth.netlify.app'
const TARGET = `${SITE}/api/telegram`

export default async () => {
  if (!BOT_TOKEN) return new Response('no token')
  try {
    const info = await (await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)).json()
    if (info?.result?.url === TARGET) return new Response('ok')
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: TARGET,
        ...(SECRET ? { secret_token: SECRET } : {}),
        allowed_updates: ['message'],
        drop_pending_updates: false,
      }),
    })
  } catch {
    /* keyingi daqiqada qayta uriniladi */
  }
  return new Response('ok')
}

export const config = { schedule: '*/1 * * * *' }
