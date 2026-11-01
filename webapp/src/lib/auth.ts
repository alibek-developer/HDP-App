import { getTelegramUser, TelegramProfile } from './telegram'

/** Brauzerda (Telegram tashqarisida) ko'rsatiladigan namunaviy profil */
export const DEMO_PROFILE: TelegramProfile = {
  id: 712345678,
  name: 'Sardor Aliyev',
  username: 'sardor_hdp',
  photoUrl: null,
  isPremium: false,
}

/**
 * Demo kirish: Telegram ichida haqiqiy foydalanuvchi ma'lumoti olinadi,
 * brauzerda esa namunaviy profil qaytadi.
 *
 * Eslatma: bu autentifikatsiya emas — haqiqiy tekshiruv (initData imzosini
 * serverda tasdiqlash) keyin qo'shiladi. Bu funksiya o'sha paytda API
 * chaqiruviga almashtiriladi.
 */
export const signInWithTelegram = async (): Promise<TelegramProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 650))
  return getTelegramUser() ?? DEMO_PROFILE
}
