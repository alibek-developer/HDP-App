import { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { triggerHaptic } from './haptics'
import type { NoParamRoute, RootStackParamList } from '../navigation/types'

/**
 * Yagona chiqish mexanizmi.
 *
 * Web'dagi `useBack` tarixni qo'shmaslik uchun qadamlarni o'zi kuzatardi.
 * React Native'da buni navigatsiya stack'ining o'zi beradi: `goBack()`
 * tarixga yozuv qo'shmaydi, pastdagi sahifani ochadi. Tarix bo'sh bo'lib
 * qolsa (masalan ochiq havoladan kirilganda) ota sahifani `replace` qilamiz
 * — shunda «orqaga» tugmasi yana shu yopiq sahifaga qaytmaydi.
 */
export const useExit = (fallback: NoParamRoute) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return useCallback(() => {
    triggerHaptic('light')
    if (navigation.canGoBack()) navigation.goBack()
    else navigation.replace(fallback)
  }, [navigation, fallback])
}
