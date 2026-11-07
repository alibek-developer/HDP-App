import type { NavigatorScreenParams } from '@react-navigation/native'
import type { TabKey } from '../components/BottomNav'

/** Pastki tab'lar — `MainTabs` navigatorining marshrutlari */
export type TabParamList = {
  Home: undefined
  Problems: undefined
  Shop: undefined
  Profile: undefined
}

/** `BottomNav` tugmasi → tab marshruti nomi */
export const TAB_ROUTE: Record<TabKey, keyof TabParamList> = {
  home: 'Home',
  problems: 'Problems',
  shop: 'Shop',
  profile: 'Profile',
}

export const ROUTE_TAB: Record<keyof TabParamList, TabKey> = {
  Home: 'home',
  Problems: 'problems',
  Shop: 'shop',
  Profile: 'profile',
}

/**
 * Root stack — web'dagi `webapp/src/App.tsx` yo'llarining React Native
 * ekvivalenti. Parametr nomlari web'dagi `:id`'lar bilan bir xil.
 */
export type RootStackParamList = {
  Onboarding: undefined
  Login: undefined
  SignUp: undefined
  Forgot: undefined

  /* Onboarding savollari — javob keyingi ekranga parametr bilan o'tadi */
  Goal: undefined
  BirthDate: { goal: string }

  /** Pastki tab'lar shu bitta ekran ichida — stack to'rtta tab bilan to'lmaydi */
  Main: NavigatorScreenParams<TabParamList> | undefined

  // Kurs zanjiri
  Subject: { subjectId: string }
  Result: undefined

  // Masala zanjiri
  ProblemSet: { setId: string }

  // Mavzu zanjiri (1–10)
  Topic: { topicNum: number }
  TopicLesson: { lessonId: string }
  TopicTest: { topicNum: number }

  // Qolganlari
  Formulas: undefined
  Pro: { reason?: string; setId?: string } | undefined
  Product: { id: string }
  Blitz: undefined
}

/** Parametr talab qilmaydigan yo'lar — `navigate(route)` uchun xavfli variant */
export type NoParamRoute = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K] ? K : never
}[keyof RootStackParamList]
