import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from './src/screens/SplashScreen'
import LoginScreen from './src/screens/LoginScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen'
import HomeScreen from './src/screens/HomeScreen'
import ProblemsScreen from './src/screens/ProblemsScreen'
import FormulasScreen from './src/screens/FormulasScreen'
import CoursesScreen from './src/screens/CoursesScreen'
import SubjectScreen from './src/screens/SubjectScreen'
import TopicScreen from './src/screens/TopicScreen'
import TopicLessonScreen from './src/screens/TopicLessonScreen'
import TopicTestScreen from './src/screens/TopicTestScreen'
import LessonScreen from './src/screens/LessonScreen'
import ShopScreen from './src/screens/ShopScreen'
import ProductScreen from './src/screens/ProductScreen'
import ProScreen from './src/screens/ProScreen'
import BlitzScreen from './src/screens/BlitzScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import ProblemSetScreen from './src/screens/ProblemSetScreen'
import TestScreen from './src/screens/TestScreen'
import ExampleScreen from './src/screens/ExampleScreen'
import ResultScreen from './src/screens/ResultScreen'
import type { RootStackParamList } from './src/navigation/types'
import { C } from './src/theme/tokens'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * `animation: 'none'` — o'tish animatsiyasi o'chirilgan: sahira darhol ochiladi
 * va Android'da `fade` + react-native-screens bilan uchraydigan «oq ekran» xatosi
 * bo'lmaydi.
 */
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: C.canvas } }}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Problems" component={ProblemsScreen} />
          <Stack.Screen name="ProblemSet" component={ProblemSetScreen} />
          <Stack.Screen name="LessonExample" component={ExampleScreen} />
          <Stack.Screen name="LessonTest" component={TestScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Formulas" component={FormulasScreen} />
          <Stack.Screen name="Courses" component={CoursesScreen} />
          <Stack.Screen name="Subject" component={SubjectScreen} />
          <Stack.Screen name="Lesson" component={LessonScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
          <Stack.Screen name="TopicLesson" component={TopicLessonScreen} />
          <Stack.Screen name="TopicTest" component={TopicTestScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="Pro" component={ProScreen} />
          <Stack.Screen name="Blitz" component={BlitzScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
