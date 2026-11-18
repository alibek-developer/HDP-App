/**
 * Push bildirishnomalar servisi.
 *
 * Qatlamlar:
 *  1. Lokal test — `scheduleNotificationAsync` darhol ko'rsatadi (Expo Go'da ham ishlaydi).
 *  2. Remote test — Expo Push Service'ga to'g'ridan-to'g'ri yuborish (`sendTestPush`).
 *     Backend'siz real push sinash uchun — token faqat shu quruvda.
 *  3. Backend sync — `EXPO_PUBLIC_API_BASE` berilsa token `POST /api/v1/push-token`
 *     ga yuboriladi. Hozircha backend tayyor bo'lmasa so'rov o'tkazib yuboriladi
 *     (token AsyncStorage'da saqlanib, keyin qayta urinadi).
 *
 * Backend kontrakti: docs/PUSH_NOTIFICATIONS.md
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { AndroidImportance } from 'expo-notifications'
import { Platform } from 'react-native'
import { navigationRef } from './navRef'
import { useApp } from '../store/useStore'

const API = process.env.EXPO_PUBLIC_API_BASE || ''
const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send'
const TOKEN_KEY = 'hdp.push.expoToken'

/** Bildirishnoma tapped/skrinida ko'rsatiladigan ssenariy — faqat shu nomlar */
const ALLOWED_SCREENS = new Set<string>([
  'Main', 'Daily', 'Blitz', 'Balance', 'Formulas',
  'SubjectLevels', 'Topic', 'ProblemSet',
])

export type PushStatus =
  | 'ready'        // ruxsat bor, token olindi
  | 'no-device'    // simulyator/emulator — remote push ishlamaydi
  | 'denied'       // foydalanuvchi ruxsat bermadi
  | 'no-project'   // EAS projectId yo'q — Expo push token olinmadi
  | 'unavailable'  // modul yo'q (Expo Go / web)

let configured = false
let pushToken: string | null = null

/** Ilova darhol ochilganda bir marta chaqiriladi */
export function configureNotifications(): void {
  if (configured) return
  configured = true

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    })
  } catch {
    // Expo Go'da handler moduli cheklangan — lokal bildirishnomalar baribir ishlaydi
  }

  // Bildirishnoma bosilganda — tegishli ekranni ochish
  try {
    Notifications.addNotificationResponseReceivedListener(response => {
      openNotificationTarget(response.notification.request.content.data)
    })

    // Ilova o'chirilgan holda kelgan bildirishnoma
    Notifications.getLastNotificationResponseAsync()
      .then(r => r && openNotificationTarget(r.notification.request.content.data))
      .catch(() => {})
  } catch {
    // tinglovchilar ro'yxatdan o'tmadi — muammo emas
  }
}

function openNotificationTarget(data: unknown): void {
  const d = (data ?? {}) as { screen?: string; params?: Record<string, unknown> }
  const screen = d.screen
  if (!screen || !ALLOWED_SCREENS.has(screen)) return
  const params = d.params
  const go = () => {
    if (!navigationRef.isReady()) return false
    ;(navigationRef.navigate as (name: string, params?: object) => void)(screen, params)
    return true
  }
  if (go()) return
  // Navigatsiya hali tayyor emas — biroz keyin qayta urin
  setTimeout(go, 800)
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return
  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Umumiy',
      importance: AndroidImportance.HIGH,
      lightColor: '#063F2E',
    })
  } catch {
    // Expo Go'da kanal moduli mavjud emas — lokal bildirishnomalar baribir ishlaydi
  }
}

function resolveProjectId(): string | null {
  const fromConfig =
    (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
    (Constants.easConfig?.projectId as string | undefined)
  return fromConfig ?? process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? null
}

async function ensurePushTokenInner(): Promise<{ status: PushStatus; token: string | null }> {
  await ensureAndroidChannel()

  let granted = false
  try {
    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') {
      granted = true
    } else {
      const { status } = await Notifications.requestPermissionsAsync()
      granted = status === 'granted'
    }
  } catch {
    return { status: 'unavailable', token: null }
  }
  if (!granted) return { status: 'denied', token: null }

  // Simulyatorda remote push token ishlamaydi — lekin lokal test ishlaydi
  try {
    const cached = await AsyncStorage.getItem(TOKEN_KEY)
    if (cached) pushToken = cached
  } catch {
    // saqlangan token o'qilmadi — davom etamiz
  }

  if (!Device.isDevice) {
    return { status: pushToken ? 'ready' : 'no-device', token: pushToken }
  }

  const projectId = resolveProjectId()
  if (!projectId) return { status: 'no-project', token: pushToken }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
    pushToken = token
    await AsyncStorage.setItem(TOKEN_KEY, token)
    return { status: 'ready', token }
  } catch {
    return { status: 'unavailable', token: pushToken }
  }
}

/** Hech qachon reject qilmaydi — Expo Go'da ham xavfsiz */
export async function ensurePushToken(): Promise<{ status: PushStatus; token: string | null }> {
  try {
    return await ensurePushTokenInner()
  } catch {
    return { status: 'unavailable', token: null }
  }
}

/** Tokenni backendga yuborish. API base yo'q bo'lsa jim o'tkazib yuboriladi. */
export async function syncPushTokenToBackend(): Promise<void> {
  if (!API || !pushToken) return
  const { telegramId, authed } = useApp.getState()
  if (!authed) return
  try {
    await fetch(`${API}/api/v1/push-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: pushToken,
        platform: Platform.OS,
        enabled: useApp.getState().notifOn,
        telegramId: telegramId ?? undefined,
      }),
    })
  } catch {
    // backend hali yo'q — keyingi urinishda qayta yuboramiz
  }
}

export function getCachedPushToken(): string | null {
  return pushToken
}

/**
 * Test: 1) darhol lokal bildirishnoma, 2) bor bo'lsa Expo Push orqali
 * remote push (backend'siz ham ishlaydi — faqat shu quruvga).
 */
export async function sendTestPush(): Promise<string> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'HDP Academy',
        body: "Test bildirishnomasi — ilova ishlayapti!",
        data: { screen: 'Daily' },
        sound: 'default',
      },
      trigger: null,
    })
  } catch {
    return 'Lokal bildirishnoma yuborilmadi'
  }

  if (!pushToken) {
    const { status } = await ensurePushToken()
    if (status !== 'ready' || !pushToken) {
      return status === 'no-device' || status === 'no-project'
        ? `Lokal test yuborildi. Remote uchun: ${status}`
        : 'Lokal test yuborildi'
    }
  }

  try {
    const res = await fetch(EXPO_PUSH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        to: pushToken,
        title: 'HDP Academy',
        body: 'Bu remote test push — backendsiz ishlayapti!',
        data: { screen: 'Daily' },
        sound: 'default',
        channelId: 'default',
      }),
    })
    const json = (await res.json()) as { data?: { status?: string; message?: string } }
    const ticket = json.data?.status ?? 'yuborildi'
    return `Lokal + remote (${ticket})`
  } catch {
    return 'Lokal test yuborildi; remote xato'
  }
}
