import { TelegramWebApp } from '../types'

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

export const tg = window.Telegram?.WebApp

export const initTelegram = () => {
  if (typeof window !== 'undefined' && (window as any).Telegram) {
    const tg = (window as any).Telegram.WebApp
    tg.ready()
    tg.expand()
    tg.setHeaderColor("#006C49")
    tg.setBackgroundColor("#FAF8FF")
  }
}

export const setupBackButton = () => {
  if (typeof window !== 'undefined' && (window as any).Telegram) {
    const tg = (window as any).Telegram.WebApp
    if (tg.BackButton) {
      tg.BackButton.show()
      tg.BackButton.onClick(() => {
        window.history.back()
      })
    }
  }
}

export const showBack = (cb: () => void) => {
  tg?.BackButton.show()
  tg?.BackButton.onClick(cb)
}

export const hideBack = () => {
  tg?.BackButton.hide()
}
