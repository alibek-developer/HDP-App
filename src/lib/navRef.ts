import { createNavigationContainerRef } from '@react-navigation/native'
import type { RootStackParamList } from '../navigation/types'

/** Bildirishnomadan ochiladigan ekranlar — root stack navigatori uchun */
export const navigationRef = createNavigationContainerRef<RootStackParamList>()
