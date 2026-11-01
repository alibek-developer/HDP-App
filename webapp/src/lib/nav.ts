import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { getTelegram, triggerHaptic } from './telegram'

/**
 * Yagona chiqish mexanizmi.
 *
 * "Orqaga" tugmasi `navigate('/ota')` bilan ishlatilganda tarixga yangi yozuv
 * qo'shiladi: testdan chiqib, so'ng telefon tugmasi bilan orqaga bossangiz,
 * yana test chiqadi. Shuning uchun tarixni o'zimiz kuzatamiz — ota sahifa
 * bizdan pastda turgan bo'lsa, uni bosamiz (navigate(-n)), qo'shmaymiz.
 */

let stack: string[] = []
let onBack: (() => void) | null = null
let bound = false

/** Telegram SDK kech yuklanishi mumkin — tugma birinchi marta topilganda ulanadi.
 *  Yagona chaqiruvchisi App — sahifalar har mountda tugmani qayta-qayta
 *  ko'rsatib/yashirib o'zaro kurashmasligi uchun. */
const syncTelegramBack = () => {
  const button = getTelegram()?.BackButton
  if (!button) return
  if (!bound) {
    bound = true
    button.onClick(() => onBack?.())
  }
  if (onBack) button.show()
  else button.hide()
}

/** Faqat App ichida chaqiriladi: bolalar effect'dan KEYIN ishlaydi,
 *  shuning uchun tugma har doim ochiq sahifaga mos bo'ladi */
export const useTelegramBackSync = () => {
  useEffect(syncTelegramBack)
}

/** Har yo'nalishdan keyin tarix yozuvini yangilaydi (App ichida bir marta).
 *  Render paytida qilinadi — sahifa ochilganda strelka tarixni to'g'ri ko'radi. */
export const useNavTracker = () => {
  const { pathname } = useLocation()
  const navType = useNavigationType()

  if (stack.length === 0) stack = [pathname]
  else if (stack[stack.length - 1] !== pathname) {
    if (navType === 'PUSH') stack.push(pathname)
    else if (navType === 'REPLACE') stack[stack.length - 1] = pathname
    else {
      const at = stack.lastIndexOf(pathname, stack.length - 2)
      // Yo'nalish biz kuzatmagan holatga (masalan brauzerning "oldinga" tugmasi)
      // qaytgan bo'lsa — zanjirni bilmaymiz, zaroq shu sahifani ildiz deb olamiz
      stack = at >= 0 ? stack.slice(0, at + 1) : [pathname]
    }
  }
}

/** Ota sahifa bizdan necha qadam pastda (0 — tarixda yo'q) */
const stepsBack = (parent: string) => {
  for (let i = stack.length - 2; i >= 0; i--) {
    if (stack[i] === parent) return stack.length - 1 - i
  }
  return 0
}

/**
 * Ota sahifaga chiqish: strelka uchun qaytariladi, Telegram tugmasi uchun
 * shu xatti-harakat avtomatik ulanadi.
 */
export const useBack = (parent: string) => {
  const navigate = useNavigate()

  const exit = () => {
    const n = stepsBack(parent)
    if (n > 0) navigate(-n)
    else navigate(parent, { replace: true })
  }
  const exitRef = useRef(exit)
  exitRef.current = exit

  useEffect(() => {
    onBack = () => {
      triggerHaptic('light')
      exitRef.current()
    }
    return () => {
      onBack = null
    }
  }, [parent])

  return exit
}

/** Ildiz sahifa: Telegramning "Orqaga" tugmasi yashirin */
export const useBackRoot = () => {
  useEffect(() => {
    onBack = null
    return () => {
      onBack = null
    }
  })
}

/** Ko'p joydan kiriladigan sahifalar (Pro, Formulalar, Blitz) — kelgan joyga qaytamiz */
export const useBackToSource = () =>
  useBack(stack.length > 1 ? stack[stack.length - 2] : '/home')
