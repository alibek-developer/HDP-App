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

export const initTelegram = () => {
  const tg = getTelegram()
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor('#006C49')
    tg.setBackgroundColor('#FAF8FF')
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

export const showBack = (cb: () => void) => {
  const tg = getTelegram()
  if (tg?.BackButton) {
    tg.BackButton.show()
    tg.BackButton.onClick(cb)
  }
}

export const hideBack = () => {
  const tg = getTelegram()
  if (tg?.BackButton) {
    tg.BackButton.hide()
  }
}
