import * as Haptics from 'expo-haptics'

/**
 * Web versiyasida tebranishni Telegram SDK beradi. Ilovada uning o'rne
 * `expo-haptics` — shu sabi `triggerHaptic` nomi saqlanib qoldi, sahifalar
 * bir xil kod bilan yozilaveradi.
 */
export type HapticKind =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'

export const triggerHaptic = (type: HapticKind = 'light') => {
  if (type === 'selection') {
    void Haptics.selectionAsync()
    return
  }
  if (type === 'success') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    return
  }
  if (type === 'warning' || type === 'error') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    return
  }
  const style =
    type === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy
    : type === 'medium' ? Haptics.ImpactFeedbackStyle.Medium
    : Haptics.ImpactFeedbackStyle.Light
  void Haptics.impactAsync(style)
}
