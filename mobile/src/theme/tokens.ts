import type { TextStyle, ViewStyle } from 'react-native'

/**
 * HDP Academy Math — dizayn tokenlari.
 * `webapp/tailwind.config.ts`dagi bir xil palitra: hereakatlanuvchi emerald
 * chuqurlik + o'suvchi lime. Bu fayl React Native uchun yozilgan, chunki
 * RN'da CSS o'rniga obyekt uslublar ishlaydi.
 */

export const C = {
  canvas: '#F1F4EE',
  canvasDeep: '#E6EBE2',
  surface: '#FFFFFF',
  surface2: '#F6F8F3',
  line: '#E3E8DE',
  lineSoft: '#EDF1E9',

  ink: '#0E1A12',
  ink2: '#33452F',
  ink3: '#6B7C66',
  ink4: '#9AA995',

  brand: '#0B6E4F',
  brandDeep: '#063F2E',
  brandMid: '#1B9A6B',
  leaf: '#4CC16F',
  leafBright: '#8CE86A',
  leafSoft: '#DDF3DC',
  leafTint: '#EFF8EC',

  mint: '#CDE9AE',
  mintSoft: '#E6F5D2',
  lime: '#7ED321',
  limeDeep: '#5FAF22',
  limeBright: '#9BE04B',
  inkOnLime: '#1C3214',

  coin: '#E8A33D',
  coinSoft: '#FCF1DC',
  xp: '#4C7DF0',
  xpSoft: '#E5ECFE',
  danger: '#D9483B',
  dangerSoft: '#FBE9E7',
  violet: '#7C5CE0',
  violetSoft: '#EDE7FC',
} as const

export const R = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
  full: 9999,
} as const

/** Yozuv shkalasi — Tailwind'dagi `fontSize` bilan bir xil raqamlar */export const T: Record<string, TextStyle> = {
  display: { fontSize: 34, lineHeight: 36, letterSpacing: -1.19, fontWeight: '800' },
  h1: { fontSize: 27, lineHeight: 31, letterSpacing: -0.76, fontWeight: '800' },
  h2: { fontSize: 21, lineHeight: 25, letterSpacing: -0.42, fontWeight: '800' },
  h3: { fontSize: 17, lineHeight: 22, letterSpacing: -0.2, fontWeight: '700' },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  bodyMd: { fontSize: 14.5, lineHeight: 22, fontWeight: '500' },
  bodySm: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.12, fontWeight: '700' },
  tiny: { fontSize: 10.5, lineHeight: 14, letterSpacing: 0.74, fontWeight: '800' },
}

/** Raqamli qatorlar (coin/XP/foiz) — tabular monospace */
export const NUM: TextStyle = {
  fontVariant: ['tabular-nums'],
}

/** Soya — CSS'dagi ko'p qatlamli soya RN'da bitta yumshoq qatlamga keltiriladi */export const shadow = (
  color: string,
  radius: number,
  y: number,
  opacity: number
): ViewStyle => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
  elevation: Math.max(1, Math.round(radius / 3)),
})

export const SHADOW = {
  card: shadow(C.ink, 9, 3, 0.05),
  lifted: shadow(C.ink, 16, 8, 0.09),
  float: shadow(C.ink, 10, 3, 0.1),
  glow: shadow(C.brandMid, 12, 5, 0.32),
  glowLeaf: shadow(C.leaf, 12, 5, 0.38),
  glowCoin: shadow(C.coin, 12, 5, 0.32),
} as const

/** Kartochka — oq yuza + sage chekkasi (barcha ekranlar shu usturda turadi) */
export const CARD: ViewStyle = {
  backgroundColor: C.surface,
  borderColor: C.line,
  borderWidth: 1,
  borderRadius: R.md,
  ...SHADOW.card,
}

/** Ekranlar ikki xil tilda: Home — doira/pill, yechish ekranlari — burchakli davotar */
export const SOLVER_BODY = '#F3F7EE'
export const SOLVER_CARD: ViewStyle = {
  backgroundColor: C.surface,
  borderColor: '#E1E7DA',
  borderWidth: 1,
  borderRadius: 14,
}

export const LIME_BTN_GRAD = ['#9BE04B', '#7ED321'] as const
export const AMBER_BTN_GRAD = ['#F6D8A6', '#E8A33D'] as const

export const TICK = {
  ok: '#5FAF22',
  bad: '#D9534F',
  current: '#0E1A12',
  todo: '#E1E7DA',
}

/**
 * RN 0.88 avlod generatsiyasida `StyleSheet.absoluteFillObject` yo'q,
 * shuning uchun to'liq toxtovchi obyekt shu yerda.
 */
export const ABS_FILL: ViewStyle = { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }

/** LinearGradient `colors` kamida bitta juftlikni talab qiladi */
export type Grad = readonly [string, string, ...string[]]

