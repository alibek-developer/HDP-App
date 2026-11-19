import { C, DARK, setActiveColors } from './tokens'
import type { ThemeColors } from './tokens'
import { useApp } from '../store/useStore'

export type { ThemeColors }

/** Joriy theme ranglari — dark bo'lsa DARK, aks holda C */
export const useColors = (): ThemeColors => {
  const theme = useApp(s => s.theme)
  const colors = theme === 'dark' ? DARK : C
  setActiveColors(colors)
  return colors
}

export const useIsDark = () => useApp(s => s.theme === 'dark')
