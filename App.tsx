import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useApp } from './src/store/useStore'
import { BrandMark } from './src/components/Brand'
import OnboardingScreen from './src/screens/OnboardingScreen'
import GoalScreen from './src/screens/GoalScreen'
import BirthDateScreen from './src/screens/BirthDateScreen'
import LoginScreen from './src/screens/LoginScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen'
import FormulasScreen from './src/screens/FormulasScreen'
import SubjectScreen from './src/screens/SubjectScreen'
import TopicScreen from './src/screens/TopicScreen'
import TopicLessonScreen from './src/screens/TopicLessonScreen'
import TopicTestScreen from './src/screens/TopicTestScreen'
import ProductScreen from './src/screens/ProductScreen'
import ProScreen from './src/screens/ProScreen'
import BlitzScreen from './src/screens/BlitzScreen'
import ProblemSetScreen from './src/screens/ProblemSetScreen'
import ResultScreen from './src/screens/ResultScreen'
import MainTabs from './src/navigation/MainTabs'
import type { RootStackParamList } from './src/navigation/types'
import { C } from './src/theme/tokens'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * O'tish animatsiyasi — native `slide_from_right`. Ilgari bu yerda `none`
 * turardi va ilova «animatsiyasiz» ko'rinardi; `fade` esa Android'da oq
 * ekranga olib kelgan. Slide — react-native-screens'ning barqaror yo'li.
 */
const App = () => {
  /** AsyncStorage'dan holat kelguncha kutamiz — aks holda kirgan foydalanuvchi
   *  har safar onboarding'ga qaytariladi. */
  const [hydrated, setHydrated] = useState(() => useApp.persist.hasHydrated())
  const [fontsLoaded, fontError] = useFonts({
    STIXTwoMath: require('./src/assets/fonts/STIXTwoMath-Regular.ttf'),
  })

  useEffect(() => {
    if (useApp.persist.hasHydrated()) {
      setHydrated(true)
      return undefined
    }
    return useApp.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  if (!hydrated || (!fontsLoaded && !fontError))
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.mintSoft }}>
        <BrandMark size={76} hero />
      </View>
    )

  const startRoute: keyof RootStackParamList = useApp.getState().onboarded
    ? 'Main'
    : useApp.getState().authed
      ? 'Goal'
      : 'Onboarding'

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: C.canvas } }}>
        <Stack.Navigator
          initialRouteName={startRoute}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 280,
            animationTypeForReplace: 'push',
            gestureEnabled: true,
            contentStyle: { backgroundColor: C.canvas },
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Goal" component={GoalScreen} />
          <Stack.Screen name="BirthDate" component={BirthDateScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProblemSet" component={ProblemSetScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Formulas" component={FormulasScreen} />
          <Stack.Screen name="Subject" component={SubjectScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
          <Stack.Screen name="TopicLesson" component={TopicLessonScreen} />
          <Stack.Screen name="TopicTest" component={TopicTestScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="Pro" component={ProScreen} />
          <Stack.Screen name="Blitz" component={BlitzScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
