import { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { triggerHaptic } from './haptics'
import { SUBJECTS } from '../data/subjects'
import { TAB_ROUTE } from '../navigation/types'
import type { NoParamRoute, RootStackParamList } from '../navigation/types'
import type { TabKey } from '../components/BottomNav'

/**
 * Yagona chiqish mexanizmi.
 *
 * Web'dagi `useBack` tarixni qo'shmaslik uchun qadamlarni o'zi kuzatardi.
 * React Native'da buni navigatsiya stack'ining o'zi beradi: `goBack()`
 * tarixga yozuv qo'shmaydi, pastdagi sahifani ochadi. Tarix bo'sh bo'lib
 * qolsa (masalan ochiq havoladan kirilganda) ota sahifani `replace` qilamiz
 * — shunda «orqaga» tugmasi yana shu yopiq sahifaga qaytmaydi.
 *
 * `Topic` param bilan ochiladi, shuning uchun mavzu raqamini ham berish kerak.
 */
export function useExit(fallback: NoParamRoute): () => void
export function useExit(fallback: 'Topic', topicNum: number): () => void
export function useExit(fallback: NoParamRoute | 'Topic', topicNum?: number) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return useCallback(() => {
    triggerHaptic('light')
    if (navigation.canGoBack()) {
      navigation.goBack()
      return
    }
    if (fallback === 'Topic') navigation.replace('Topic', { topicNum: topicNum ?? 1 })
    else navigation.replace(fallback)
  }, [navigation, fallback, topicNum])
}

/** Tab ichidan ochilgan ekranlarning chiqishi: stack bo'sh bo'lsa — o'sha tab. */
export function useExitToTab(tab: TabKey) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return useCallback(() => {
    triggerHaptic('light')
    if (navigation.canGoBack()) {
      navigation.goBack()
      return
    }
    navigation.replace('Main', { screen: TAB_ROUTE[tab] })
  }, [navigation, tab])
}

/** Mavzu zanjiridagi chiqish: dars/test/natijadan qat'i nazar — «Mavzular» ro'yxati. */
export function useExitToTopics(topicNum: number) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return useCallback(() => {
    triggerHaptic('light')
    resetToTopics(navigation, topicNum)
  }, [navigation, topicNum])
}

export function resetToTopics(
  navigation: NativeStackNavigationProp<RootStackParamList>,
  topicNum: number,
) {
  const subjectId = SUBJECTS.find(s => s.topics.some(t => t.num === topicNum))?.id ?? SUBJECTS[0].id
  navigation.reset({
    index: 1,
    routes: [
      { name: 'Main' },
      { name: 'Subject', params: { subjectId } },
    ],
  })
}
