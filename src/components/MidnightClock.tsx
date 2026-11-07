import { useEffect, useState } from 'react'
import { Text } from 'react-native'
import type { StyleProp, TextStyle } from 'react-native'

/**
 * Yarim tungacha qolgan vaqt. Ticker shu komponent ichida — butun ekran
 * har sekund qayta chizilmasligi uchun u alohida turadi.
 */

const pad = (n: number) => String(n).padStart(2, '0')

const leftUntilMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

export const MidnightClock = ({ style }: { style?: StyleProp<TextStyle> }) => {
  const [remain, setRemain] = useState(leftUntilMidnight)

  useEffect(() => {
    const t = setInterval(() => setRemain(leftUntilMidnight()), 1000)
    return () => clearInterval(t)
  }, [])

  return <Text style={style}>{clock(remain)}</Text>
}
