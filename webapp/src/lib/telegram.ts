import { TelegramWebApp } from '../types'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp & {
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
      }
    }
  }
}

export const getTelegram = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return null
}

/**
 * Haqiqiy Telegram ichidamizmi. SDK skripti brauzerda va WebView'da ham
 * `window.Telegram.WebApp` yaratadi, lekin `initData` faqat Telegram ochganda
 * to'ladi — shu belgi Telegram tugmasini tashqarida yashirish uchun kerak.
 */
export const isInsideTelegram = (): boolean => Boolean(getTelegram()?.initData)

export interface TelegramProfile {
  id: number | null
  name: string
  username: string
  photoUrl: string | null
  isPremium: boolean
}

/**
 * Telegram ichida ochilganda foydalanuvchi ma'lumoti mavjud bo'ladi.
 * Demo uchun `initDataUnsafe` ishlatiladi — server tekshiruvi yo'q.
 */
export const getTelegramUser = (): TelegramProfile | null => {
  const tg = getTelegram()
  const u = tg?.initDataUnsafe?.user
  if (!u) return null
  return {
    id: u.id ?? null,
    name: [u.first_name, u.last_name].filter(Boolean).join(' '),
    username: u.username ?? '',
    photoUrl: u.photo_url ?? null,
    isPremium: Boolean(u.is_premium),
  }
}

export const initTelegram = () => {  const tg = getTelegram()
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor('#CDE9AE')
    tg.setBackgroundColor('#FFFFFF')
  }
}

export const triggerHaptic = (
  type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light'
) => {
  try {
    const tg = getTelegram()
    if (!tg?.HapticFeedback) return
    if (type === 'selection') {
      tg.HapticFeedback.selectionChanged()
    } else if (type === 'success' || type === 'warning' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type)
    } else {
      tg.HapticFeedback.impactOccurred(type)
    }
  } catch (e) {
    // ignore
  }
}
