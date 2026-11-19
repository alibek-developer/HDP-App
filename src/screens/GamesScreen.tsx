import type { ComponentType } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { GAME_CATALOG, GAME_STARS_TOTAL, starsOf } from '../data/games'
import type { GameMarkKey } from '../data/games'
import { triggerHaptic } from '../lib/haptics'
import { navBottomSpace } from '../components/BottomNav'
import { Reveal } from '../components/Reveal'
import { ScaleMark } from '../components/ScaleMark'
import { FightersMark, MemoryMark, NumberLineMark } from '../components/GameMarks'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { C, NUM, R, shadow } from '../theme/tokens'

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const MARKS: Record<GameMarkKey, ComponentType<{ size?: number; color?: string }>> = {
  scale: ScaleMark,
  memory: MemoryMark,
  line: NumberLineMark,
  fight: FightersMark,
}

/** Har o'yin belgisi o'z rangida — kartalar bir xil, ikonka jihatidan farqlanadi */
const TINT: Record<GameMarkKey, { bg: string; fg: string }> = {
  scale: { bg: C.leafSoft, fg: C.limeDeep },
  memory: { bg: C.violetSoft, fg: C.violet },
  line: { bg: C.xpSoft, fg: C.xp },
  fight: { bg: C.coinSoft, fg: '#B87A22' },
}

/**
 * O'yinlar — pastki navigatsiyaning o'z tab'i. To'rttala o'yin ham tayyor:
 * 2×2 to'r, har kartada darajalar bo'yicha yig'ilgan yulduzlar.
 */
const GamesScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)
  const xp = useApp(s => s.xp)

  const earned = GAME_CATALOG.reduce((n, g) => n + starsOf(gameStars, g.id, g.levels), 0)
  const rows = [GAME_CATALOG.slice(0, 2), GAME_CATALOG.slice(2, 4)]

  return (
    <View style={styles.screen}>
      <View style={[styles.head, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.kicker}>O&apos;yin maydoni</Text>
          <Text style={styles.title}>O&apos;yinlar</Text>
        </View>

        <View style={styles.headPills}>
          <View style={styles.xpPill}>
            <Ionicons name="flash" size={12} color={C.xp} />
            <Text style={[styles.xpText, NUM]}>{xp.toLocaleString('en-US')}</Text>
            <Text style={styles.xpSuffix}>XP</Text>
          </View>

          <View style={styles.starPill}>
            <Ionicons name="star" size={12} color={C.coin} />
            <Text style={[styles.starText, NUM]}>{earned}/{GAME_STARS_TOTAL}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.body, { paddingBottom: navBottomSpace(insets.bottom) }]}>
        <Text style={styles.lede}>
          Qisqa sessiyalar: tanga, XP va yulduzlar progressga qo&apos;shiladi.
        </Text>

        <Reveal delay={60} y={20} duration={380} style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(g => {
                const Mark = MARKS[g.mark]
                const tint = TINT[g.mark]
                const gStars = starsOf(gameStars, g.id, g.levels)
                const gTotal = g.levels.length * 3
                const gPlays = gamePlays[g.id] ?? 0
                return (
                  <Pressable
                    key={g.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${g.title} o'yinini ochish`}
                    onPress={() => {
                      triggerHaptic('medium')
                      navigation.navigate(g.route)
                    }}
                    style={({ pressed }) => [{ flex: 1 }, pressed && { transform: [{ scale: 0.98 }] }]}
                  >
                    <LinearGradient
                      colors={['#17301F', '#0B1A12']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.card}
                    >
                      <View style={styles.cardTop}>
                        <View style={[styles.cardIcon, { backgroundColor: tint.bg }]}>
                          <Mark size={19} color={tint.fg} />
                        </View>
                        <View style={styles.cardGo}>
                          <Ionicons name="arrow-forward" size={12} color={C.inkOnLime} />
                        </View>
                      </View>

                      <Text style={styles.cardTitle} numberOfLines={1}>{g.title}</Text>
                      <Text style={styles.cardSub} numberOfLines={2}>{g.sub}</Text>

                      <View style={styles.cardFoot}>
                        <View style={styles.cardStars}>
                          <Ionicons name="star" size={11} color={C.coin} />
                          <Text style={[styles.cardStarText, NUM]}>{gStars}/{gTotal}</Text>
                        </View>
                        <Text style={[styles.cardPlays, NUM]}>
                          {gPlays > 0 ? `${gPlays} ta urinish` : 'yangi'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </Pressable>
                )
              })}
            </View>
          ))}
        </Reveal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F7EE' },

  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE0',
    backgroundColor: '#F3F7EE',
  },
  kicker: { fontSize: 11.5, fontWeight: '600', letterSpacing: 0.4, color: C.brand },
  title: { marginTop: 2, fontSize: 23, lineHeight: 27, letterSpacing: -0.5, fontWeight: '600', color: C.ink },

  headPills: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: R.full,
    backgroundColor: C.xpSoft,
    borderWidth: 1,
    borderColor: 'rgba(76,125,240,0.3)',
  },
  xpText: { fontSize: 11.5, fontWeight: '700', color: '#3560C4' },
  xpSuffix: { fontSize: 9.5, fontWeight: '600', color: 'rgba(53,96,196,0.7)' },

  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: R.full,
    backgroundColor: C.coinSoft,
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.34)',
  },
  starText: { fontSize: 11.5, fontWeight: '600', color: '#B87A22' },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  lede: { fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: C.ink3, marginBottom: 10 },

  grid: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  card: {
    height: 158,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.22)',
    overflow: 'hidden',
    ...shadow('#0B2317', 12, 6, 0.16),
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGo: {
    width: 24,
    height: 24,
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.lime,
  },
  cardTitle: { marginTop: 9, fontSize: 15, lineHeight: 19, letterSpacing: -0.2, fontWeight: '600', color: '#FFFFFF' },
  cardSub: { marginTop: 3, fontSize: 10.5, lineHeight: 14, fontWeight: '500', color: 'rgba(220,240,205,0.74)' },
  cardFoot: {
    marginTop: 'auto',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStars: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardStarText: { fontSize: 11, fontWeight: '600', color: 'rgba(205,233,174,0.9)' },
  cardPlays: { fontSize: 10, fontWeight: '500', color: 'rgba(205,233,174,0.55)' },
})

export default GamesScreen
