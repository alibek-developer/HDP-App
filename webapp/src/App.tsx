import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import FormulasScreen from './screens/FormulasScreen'
import ProfileScreen from './screens/ProfileScreen'
import CoursesScreen from './screens/CoursesScreen'
import VideoScreen from './screens/VideoScreen'
import SolveScreen from './screens/SolveScreen'
import ShopScreen from './screens/ShopScreen'
import ProScreen from './screens/ProScreen'
import BlitzScreen from './screens/BlitzScreen'
import BottomNav from './components/BottomNav'

const AppContent = () => {
  const location = useLocation()
  const showBottomNav = ['/home', '/formulas', '/profile'].includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/formulas" element={<FormulasScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/courses" element={<CoursesScreen />} />
        <Route path="/video" element={<VideoScreen />} />
        <Route path="/solve" element={<SolveScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/pro" element={<ProScreen />} />
        <Route path="/blitz" element={<BlitzScreen />} />
      </Routes>
      {showBottomNav && <BottomNav />}
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
