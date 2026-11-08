import type { TextStyle, ViewStyle } from 'react-native'
import { shadow } from './tokens'

/**
 * Yechish oilasi (Masalalar hub, to'plam, test, misol, natija, blitz) —
 * burchakli «davotar» tili. Home doira/pill tilida, bu ekranlar emas.
 * Web'dagi `webapp/src/styles/solver.ts`ning React Native ekvivalenti.
 */

export const SOLVER_BODY = '#F3F7EE'

/** Gradient'li tugmalar uchun rang juftlari (LinearGradient `colors` talabi) */
export const GRAD_LIME: readonly [string, string] = ['#9BE04B', '#7ED321']
export const GRAD_AMBER: readonly [string, string] = ['#F6D8A6', '#E8A33D']
export const GRAD_RAIL: readonly [string, string] = ['#9BE04B', '#5FAF22']
export const GRAD_HEADER: readonly [string, string, string] = ['#0E1A12', '#123B24', '#164A2C']

export const CARD: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderColor: '#E1E7DA',
  borderWidth: 1,
  borderRadius: 14,
}

export const CARD_LIFT: ViewStyle = { ...CARD, ...shadow('#0E1A12', 11, 8, 0.08) }

/** Burchakli 12 px tugma asosi — rangi/gradienti chaqiruvchi qo'yadi */
export const BTN_BASE: ViewStyle = {
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
}

export const LIME_BTN: ViewStyle = {
  ...BTN_BASE,
  backgroundColor: '#7ED321',
  ...shadow('#5FAF22', 6, 5, 0.32),
}
export const LIME_TEXT: TextStyle = { color: '#1C3214', fontWeight: '600' }

export const AMBER_BTN: ViewStyle = {
  ...BTN_BASE,
  backgroundColor: '#E8A33D',
  ...shadow('#E8A33D', 6, 5, 0.26),
}
export const AMBER_TEXT: TextStyle = { color: '#0E1A12', fontWeight: '600' }

export const INK_BTN: ViewStyle = { ...BTN_BASE, backgroundColor: '#0E1A12' }
export const INK_TEXT: TextStyle = { color: '#CDE9AE', fontWeight: '600' }

export const OUT_BTN: ViewStyle = {
  ...BTN_BASE,
  backgroundColor: '#FFFFFF',
  borderColor: '#E1E7DA',
  borderWidth: 1,
}
export const OUT_TEXT: TextStyle = { color: '#33452F', fontWeight: '600' }

/** Ikkilamachi matn (11.5 px) va mayda yozuv — davotar ekranlar uchun */
export const META: TextStyle = { fontSize: 11.5, lineHeight: 15, fontWeight: '500', color: '#6B7C66' }
export const SECTION_TITLE: TextStyle = { fontSize: 17, lineHeight: 22, fontWeight: '600', color: '#0E1A12' }
