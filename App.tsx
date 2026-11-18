import { useEffect, useState } from 'react'
import { AppState, View } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { enableFreeze } from 'react-native-screens'
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
import FormulasScreen from './src/screens/FormulasScreen'
import SubjectScreen from './src/screens/SubjectScreen'
import TopicScreen from './src/screens/TopicScreen'
import TopicLessonScreen from './src/screens/TopicLessonScreen'
import TopicTestScreen from './src/screens/TopicTestScreen'
import ProductScreen from './src/screens/ProductScreen'
import ProScreen from './src/screens/ProScreen'
import BlitzScreen from './src/screens/BlitzScreen'
import BalanceScreen from './src/screens/BalanceScreen'
import ProblemSetScreen from './src/screens/ProblemSetScreen'
import SubjectLevelsScreen from './src/screens/SubjectLevelsScreen'
import DailyScreen from './src/screens/DailyScreen'
import ResultScreen from './src/screens/ResultScreen'
import MainTabs from './src/navigation/MainTabs'
import StreakBonusSheet from './src/components/StreakBonusSheet'
import type { RootStackParamList } from './src/navigation/types'
import { C } from './src/theme/tokens'
import { navigationRef } from './src/lib/navRef'
import { configureNotifications, ensurePushToken, syncPushTokenToBackend } from './src/lib/push'

const Stack = createNativeStackNavigator<RootStackParamList>()

/**
 * `freezeOnBlur`ni global yoqadi: fokusdan chiqqan ekran render qilmaydi.
 * Chiqish (back) paytida orqa ekran qayta chizilmaydi — shu sabab o'tish
 * bir tekis ketadi. Tab'lar ham shu bilan muzlaydi (bottom-tabs 7.18.8+).
 */
enableFreeze(true)

/**
 * O'tish animatsiyasi — `ios_from_right`: Android'da iOS uslubidagi siljish,
 * iOS'da esa tizimning o'z push'i. Ilgari bu yerda `none` turardi va ilova
 * «animatsiyasiz» ko'rinardi; `fade` esa Android'da oq ekranga olib kelgan.
 * `slide_from_right` Android'da qo'polroq ko'rinadi — iOS egri chizig'i
 * (egri boshlanish, yumshoq to'xtash) premium ilovalardagi effektni beradi.
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

  // Zanjir: ilova ochilganda (va fondan qaytganda) kun avtomatik qayd bo'ladi
  useEffect(() => {
    if (!hydrated) return undefined
    useApp.getState().enterApp()
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') useApp.getState().enterApp()
    })
    return () => sub.remove()
  }, [hydrated])

  // Push bildirishnomalar: ruxsat + token olish, backend'ga sync
  useEffect(() => {
    if (!hydrated) return undefined
    configureNotifications()
    const boot = async () => {
      if (!useApp.getState().notifOn) return
      const { token } = await ensurePushToken()
      if (token && useApp.getState().authed) void syncPushTokenToBackend()
    }
    void boot()
    const unsub = useApp.subscribe((s, prev) => {
      if (s.notifOn && !prev.notifOn) {
        void ensurePushToken().then(() => syncPushTokenToBackend())
      }
      if (s.authed && !prev.authed) void syncPushTokenToBackend()
    })
    return unsub
  }, [hydrated])

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
      <NavigationContainer
        ref={navigationRef}
        theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: C.canvas } }}
      >
        <Stack.Navigator
          initialRouteName={startRoute}
          screenOptions={{
            headerShown: false,
            /**
             * `animationDuration` ataylab yo'q: u faqat iOS'da ishlaydi va
             * `default` animatsiyaga ta'sir qilmaydi — qo'lda 280ms berish
             * iOS push'ini sun'iy tezlashtirib, «sakrab» ko'rsatardi.
             */
            animation: 'ios_from_right',
            animationTypeForReplace: 'push',
            gestureEnabled: true,
            /** Orqadagi ekran chizilishni to'xtatadi — chiqish (back) shu sabab yengil */
            freezeOnBlur: true,
            contentStyle: { backgroundColor: C.canvas },
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Goal" component={GoalScreen} />
          <Stack.Screen name="BirthDate" component={BirthDateScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProblemSet" component={ProblemSetScreen} />
          <Stack.Screen name="SubjectLevels" component={SubjectLevelsScreen} />
          <Stack.Screen name="Daily" component={DailyScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Formulas" component={FormulasScreen} />
          <Stack.Screen name="Subject" component={SubjectScreen} />
          <Stack.Screen name="Topic" component={TopicScreen} />
          <Stack.Screen name="TopicLesson" component={TopicLessonScreen} />
          <Stack.Screen name="TopicTest" component={TopicTestScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="Pro" component={ProScreen} />
          <Stack.Screen name="Blitz" component={BlitzScreen} />
          <Stack.Screen name="Balance" component={BalanceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StreakBonusSheet />
    </SafeAreaProvider>
  )
}

export default App
