import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import CoursesScreen from './screens/CoursesScreen'
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
import BlitzScreen from './screens/BlitzScreen'
import BottomNav from './components/BottomNav'

/**
 * Oqim xaritasi (majburiy ketma-ketlik):
 *
 *  /            Splash        — brend + [Boshlash] / [Kirish]
 *  /login       Login         — tanlangan rejim bilan, keyin /home
 *  /home        Home          — kurs, 10 bepul dars, progress
 *  /courses     Kurslar       — barcha darslar (qulf mantiqi shu yerda)
 *  /lesson/:id            Video dars  — "Misolga o'tish" video tugagach ochiladi
 *  /lesson/:id/example    Misol       — video tugamagan bo'lsa kiritilmaydi
 *  /lesson/:id/test       Testlar     — misol yechilmagan bo'lsa kiritilmaydi
 *  /result                Natija      — xatolar + to'g'rilash + qopgan coin
 *  /problems              Masalalar   — to'plamlar, har yechim coin keltiradi
 *  /problems/:setId       To'plam ichida yechish
 *  /formulas              Formulalar
 *  /pro                   Pro obuna
 *  /shop                  Do'kon
 *  /profile               Profil
 *  /blitz                 Blitz Duel
 */

const TAB_ROUTES = ['/home', '/formulas', '/shop', '/profile']

const AppContent = () => {
  const location = useLocation()
  const showNav = TAB_ROUTES.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />

        <Route path="/courses" element={<CoursesScreen />} />
        <Route path="/lesson/:id" element={<LessonScreen />} />
        <Route path="/lesson/:id/example" element={<ExampleScreen />} />
        <Route path="/lesson/:id/test" element={<TestScreen />} />
        <Route path="/result" element={<ResultScreen />} />

        <Route path="/problems" element={<ProblemsScreen />} />
        <Route path="/problems/:setId" element={<ProblemSetScreen />} />
        <Route path="/formulas" element={<FormulasScreen />} />

        <Route path="/pro" element={<ProScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/blitz" element={<BlitzScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
