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
import { BALANCE_LEVELS, GAME_CATALOG } from '../data/games'
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

/** Tayyor bo'lmagan o'yinlarning ohangi — yumshoq fon, to'yingan belgi */
const TINT: Record<GameMarkKey, { bg: string; fg: string }> = {
  scale: { bg: C.leafSoft, fg: C.limeDeep },
  memory: { bg: C.violetSoft, fg: C.violet },
  line: { bg: C.xpSoft, fg: C.xp },
  fight: { bg: C.coinSoft, fg: '#B87A22' },
}

/**
 * O'yinlar — pastki navigatsiyaning o'z tab'i. Barcha mini-o'yinlar bitta
 * navbatda: tayyori darhol ochiladi, qolganlari «Tez orada» belgisi bilan.
 */
const GamesScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)
  const xp = useApp(s => s.xp)

  const levels = BALANCE_LEVELS.length
  const earned = BALANCE_LEVELS.reduce((n, lvl) => n + (gameStars[`balance:${lvl.id}`] ?? 0), 0)
  const total = levels * 3
  const plays = gamePlays.balance ?? 0

  const ready = GAME_CATALOG.filter(g => g.route)
  const soon = GAME_CATALOG.filter(g => !g.route)

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
            <Text style={[styles.starText, NUM]}>{earned}/{total}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.body, { paddingBottom: navBottomSpace(insets.bottom) }]}>
        <Text style={styles.lede}>
          Qisqa sessiyalar: tanga, XP va yulduzlar progressga qo&apos;shiladi.
        </Text>

        <Reveal delay={60} y={20} duration={380}>
          {ready.map(g => {
            const Mark = MARKS[g.mark]
            return (
              <Pressable
                key={g.id}
                accessibilityRole="button"
                accessibilityLabel={`${g.title} o'yinini ochish`}
                onPress={() => {
                  triggerHaptic('medium')
                  if (g.route) navigation.navigate(g.route)
                }}
                style={({ pressed }) => [styles.heroWrap, pressed && { transform: [{ scale: 0.99 }] }]}
              >
                <LinearGradient
                  colors={['#14452A', '#0B2317']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.hero}
                >
                  <View style={styles.heroTop}>
                    <View style={styles.heroIcon}>
                      <Mark size={24} color={C.inkOnLime} />
                    </View>
                    <View style={styles.heroText}>
                      <Text style={styles.heroTitle}>{g.title}</Text>
                      <Text style={styles.heroSub} numberOfLines={1}>{g.sub}</Text>
                    </View>
                    <View style={styles.heroGo}>
                      <Ionicons name="arrow-forward" size={15} color={C.inkOnLime} />
                    </View>
                  </View>

                  <View style={styles.heroFoot}>
                    <View style={styles.heroMeta}>
                      <Ionicons name="layers-outline" size={13} color="rgba(205,233,174,0.7)" />
                      <Text style={styles.heroMetaText}>{levels} daraja</Text>
                    </View>
                    <View style={styles.heroDot} />
                    <View style={styles.heroMeta}>
                      <Ionicons name="play-circle-outline" size={13} color="rgba(205,233,174,0.7)" />
                      <Text style={[styles.heroMetaText, NUM]}>
                        {plays > 0 ? `${plays} ta urinish` : "Hali o'ynalmagan"}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            )
          })}
        </Reveal>

        <Reveal delay={120} y={24} duration={400} style={styles.soonList}>
          {soon.map(g => {
            const Mark = MARKS[g.mark]
            const tint = TINT[g.mark]
            return (
              <View key={g.id} style={[styles.soon, shadow(C.ink, 6, 2, 0.04)]}>
                <View style={[styles.soonIcon, { backgroundColor: tint.bg }]}>
                  <Mark size={19} color={tint.fg} />
                </View>
                <View style={styles.soonText}>
                  <Text style={styles.soonTitle}>{g.title}</Text>
                  <Text style={styles.soonSub} numberOfLines={1}>{g.sub}</Text>
                </View>
                <View style={styles.soonChip}>
                  <Text style={styles.soonChipText}>Tez orada</Text>
                </View>
              </View>
            )
          })}
        </Reveal>

        <Text style={styles.note}>Yangi o&apos;yinlar bosqichma-bosqich ochiladi.</Text>
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

  heroWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(11,110,79,0.22)',
    ...shadow('#0B2317', 12, 6, 0.18),
  },
  hero: { padding: 13 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.lime,
  },
  heroText: { flex: 1, minWidth: 0 },
  heroTitle: { fontSize: 17.5, lineHeight: 21, letterSpacing: -0.2, fontWeight: '600', color: '#FFFFFF' },
  heroSub: { marginTop: 3, fontSize: 11.5, lineHeight: 15, fontWeight: '500', color: 'rgba(220,240,205,0.78)' },
  heroGo: {
    width: 30,
    height: 30,
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.lime,
  },
  heroFoot: {
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 11, fontWeight: '600', color: 'rgba(205,233,174,0.74)' },
  heroDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.24)' },

  soonList: { marginTop: 10, gap: 8 },
  soon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
  },
  soonIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  soonText: { flex: 1, minWidth: 0 },
  soonTitle: { fontSize: 14, lineHeight: 18, fontWeight: '600', color: C.ink },
  soonSub: { marginTop: 2, fontSize: 11, lineHeight: 15, fontWeight: '500', color: C.ink3 },
  soonChip: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
  },
  soonChipText: { fontSize: 10.5, fontWeight: '600', color: C.ink4 },

  note: { marginTop: 'auto', paddingTop: 10, textAlign: 'center', fontSize: 11, color: C.ink4 },
})

export default GamesScreen
