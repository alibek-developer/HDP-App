/**
 * Root stack — web'dagi `webapp/src/App.tsx` yo'llarining React Native
 * ekvivalenti. Parametr nomlar web'dagi `:id`'lar bilan bir xil.
 */
export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  SignUp: undefined
  Forgot: undefined

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

  // Mavzu 1 zanjiri
  Topic: undefined
  TopicLesson: { lessonId: string }
  TopicTest: undefined

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
