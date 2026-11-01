import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import HomeScreen from './screens/HomeScreen'
import CoursesScreen from './screens/CoursesScreen'
import SubjectScreen from './screens/SubjectScreen'
import LessonScreen from './screens/LessonScreen'
import ExampleScreen from './screens/ExampleScreen'
import TestScreen from './screens/TestScreen'
import ResultScreen from './screens/ResultScreen'
import FormulasScreen from './screens/FormulasScreen'
import ProblemsScreen from './screens/ProblemsScreen'
import ProblemSetScreen from './screens/ProblemSetScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProScreen from './screens/ProScreen'
import ShopScreen from './screens/ShopScreen'
import ProductScreen from './screens/ProductScreen'
import BlitzScreen from './screens/BlitzScreen'
import TopicScreen from './screens/TopicScreen'
import TopicLessonScreen from './screens/TopicLessonScreen'
import TopicTestScreen from './screens/TopicTestScreen'
import BottomNav from './components/BottomNav'
import { useApp } from './store/useStore'
import { initTelegram } from './lib/telegram'
import { useNavTracker, useTelegramBackSync } from './lib/nav'

/**
 * Oqim xaritasi (majburiy ketma-ketlik):
 *
 *  /            Splash        — brend + [Boshlash] / [Kirish]
 *  /signup      Ro'yxatdan    — yangi hisob ([Boshlash] shu yerga)
 *  /login       Login         — mavjud hisobga kirish ([Kirish] shu yerga)
 *  /forgot      Parolni tiklash — emailga havola
 *  /home        Home          — kurs, 10 bepul dars, progress
 *  /courses     Kurslar       — barcha darslar (qulf mantiqi shu yerda)
 *  /lesson/:id            Video dars  — "Misolga o'tish" video tugagach ochiladi
 *  /lesson/:id/example    Misol       — video tugamagan bo'lsa kiritilmaydi
 *  /lesson/:id/test       Testlar     — misol yechilmagan bo'lsa kiritilmaydi
 *  /result                Natija      — xatolar + to'g'rilash + qopgan coin
 *  /problems              Masalalar   — to'plamlar, har yechim coin keltiradi
 *  /problems/:setId       To'plam ichida yechish
 *  /topic/1               Mavzu 1     — 10 bo'lim + yakuniy 30 savol
 *  /topic/1/:lessonId     Bo'lim      — video dars → nazariya → amaliyot
 *  /topic/1/test          Yakuniy test — barcha bo'limlar tugasa ochiladi
 *  /formulas              Formulalar
 *  /pro                   Pro obuna
 *  /shop                  Do'kon
 *  /profile               Profil
 *  /blitz                 Blitz Duel
 */

const TAB_ROUTES = ['/home', '/problems', '/shop', '/profile']

const AppContent = () => {
  const location = useLocation()
  const onboarded = useApp(s => s.onboarded)
  const showNav = TAB_ROUTES.includes(location.pathname)
  useNavTracker()
  useTelegramBackSync()

  return (
    <>
      <Routes>
        {/* Hisobga kirilgan bo'lsa, splash va login ko'rsatilmaydi */}
        <Route path="/" element={onboarded ? <Navigate to="/home" replace /> : <SplashScreen />} />
        <Route path="/login" element={onboarded ? <Navigate to="/home" replace /> : <LoginScreen />} />
        <Route path="/signup" element={onboarded ? <Navigate to="/home" replace /> : <SignUpScreen />} />
        <Route path="/forgot" element={<ForgotPasswordScreen />} />
        <Route path="/home" element={<HomeScreen />} />

        <Route path="/courses" element={<CoursesScreen />} />
        <Route path="/subject/:subjectId" element={<SubjectScreen />} />
        <Route path="/lesson/:id" element={<LessonScreen />} />
        <Route path="/lesson/:id/example" element={<ExampleScreen />} />
        <Route path="/lesson/:id/test" element={<TestScreen />} />
        <Route path="/result" element={<ResultScreen />} />

        <Route path="/problems" element={<ProblemsScreen />} />
        <Route path="/problems/:setId" element={<ProblemSetScreen />} />

        <Route path="/topic/1" element={<TopicScreen />} />
        <Route path="/topic/1/test" element={<TopicTestScreen />} />
        <Route path="/topic/1/:lessonId" element={<TopicLessonScreen />} />

        <Route path="/formulas" element={<FormulasScreen />} />

        <Route path="/pro" element={<ProScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/shop/:id" element={<ProductScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/blitz" element={<BlitzScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

function App() {
  useEffect(() => {
    initTelegram()
  }, [])

  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
