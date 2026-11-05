/**
 * Root stack — web'dagi `webapp/src/App.tsx` yo'llarining React Native
 * ekvivalenti. Parametr nomlar web'dagi `:id`'lar bilan bir xil.
 */
export type RootStackParamList = {
  Onboarding: undefined
  Login: undefined
  SignUp: undefined
  Forgot: undefined

  /* Onboarding savollari — javob keyingi ekranga parametr bilan o'tadi */
  Goal: undefined
  BirthDate: { goal: string }

  // Tab'lar
  Home: undefined
  Problems: undefined
  Shop: undefined
  Profile: undefined

  // Kurs zanjiri
  Courses: undefined
  Subject: { subjectId: string }
  Lesson: { id: string }
  LessonExample: { id: string }
  LessonTest: { id: string }
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
  [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined ? K : never
}[keyof RootStackParamList]
