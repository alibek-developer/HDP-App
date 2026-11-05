/**
 * Haqiqiy Telegram kirish: ilova serverdan bir martalik nonce oladi,
 * Telegram'dagi @hdpappbot'ni ochadi va bot tasdiqlagan profilni so'rab turadi.
 * Bot tokeni faqat serverda (Netlify Functions) turadi — ilovada emas.
 */

const RELAY = process.env.EXPO_PUBLIC_TELEGRAM_RELAY || 'https://hdp-academy-auth.netlify.app'

export type TelegramUser = {
  id: number
  name: string
  username: string
}

export type TelegramStart = {
  nonce: string
  url: string
  expiresIn: number
}

export type TelegramPoll =
  | { status: 'pending' }
  | { status: 'ready'; user: TelegramUser }
  | { status: 'expired' }
  | { status: 'invalid' }

const request = async (path: string) => {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 10_000)
  try {
    const res = await fetch(`${RELAY}${path}`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`telegram relay ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const startTelegramLogin = (): Promise<TelegramStart> => request('/api/tg-start')

export const checkTelegramLogin = (nonce: string): Promise<TelegramPoll> =>
  request(`/api/tg-status?nonce=${encodeURIComponent(nonce)}`)

export const TELEGRAM_BOT_URL = 'https://t.me/hdpappbot'
