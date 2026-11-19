import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import {
  Animated, Easing, Image, Pressable, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native'
import type { ImageSourcePropType, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { GAME_CATALOG, starsOf } from '../data/games'
import type { GameCatalogEntry, GameMarkKey } from '../data/games'
import { triggerHaptic } from '../lib/haptics'
import { navBottomSpace } from '../components/BottomNav'
import { Reveal } from '../components/Reveal'
import { CoinIcon } from '../components/CoinIcon'
import { ScaleMark } from '../components/ScaleMark'
import { FightersMark, MemoryMark, NumberLineMark } from '../components/GameMarks'
import type { RootStackParamList, TabParamList } from '../navigation/types'
import { C, NUM, shadow } from '../theme/tokens'

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

type GameId = GameCatalogEntry['id']

const MARKS: Record<GameMarkKey, ComponentType<{ size?: number; color?: string }>> = {
  scale: ScaleMark,
  memory: MemoryMark,
  line: NumberLineMark,
  fight: FightersMark,
}

/** O'yin belgisi ranglari — info qatoridagi plitka */
const TINT: Record<GameMarkKey, { bg: string; fg: string }> = {
  scale: { bg: C.leafSoft, fg: C.limeDeep },
  memory: { bg: C.violetSoft, fg: C.violet },
  line: { bg: C.xpSoft, fg: C.xp },
  fight: { bg: C.coinSoft, fg: '#B87A22' },
}

const ART: Record<GameId, ImageSourcePropType> = {
  balance: require('../assets/games/hub-balance.jpg'),
  memory: require('../assets/games/hub-memory.jpg'),
  numberline: require('../assets/games/hub-numberline.jpg'),
  fighters: require('../assets/games/hub-fighters.jpg'),
}

const TIPS = [
  "Kunda 10 daqiqa o'yin — diqqat va hisob tezligini oshiradi.",
  "Xato qilsangiz xafa bo'lmang: takrorlash — eng yaxshi o'rganish usuli.",
  "Ko'proq yulduz uchun qiyinroq darajani sinab ko'ring.",
]

/** Karusel kartasidagi chaqiriq sarlavhasi — o'yin nomi pastdagi info qatorda */
const HEADLINE: Record<GameId, string> = {
  balance: 'Tarozini tenglashtira olasizmi?',
  memory: 'Juftliklarni eslab qolasizmi?',
  numberline: 'Nishonni birinchi urasizmi?',
  fighters: "Qalqonni yorib o'tasizmi?",
}

const SIDE = 16
const GAP = 10
const PEEK = 26

/**
 * O'yinlar — katta illyustratsiyali karusel va eng ko'p o'ynalganlar relsi.
 * Karusel kartasi to'liq kartinka: pastda sarlavha, info qator va "O'ynash" pill.
 */
const GamesScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const gameStars = useApp(s => s.gameStars)
  const gamePlays = useApp(s => s.gamePlays)
  const xp = useApp(s => s.xp)
  const coin = useApp(s => s.coin)

  const cardW = Math.round(width - SIDE * 2 - PEEK)

  const [carH, setCarH] = useState(320)
  const carRef = useRef(0)
  const onCarLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height)
    if (h > 0 && h !== carRef.current) {
      carRef.current = h
      setCarH(h)
    }
  }

  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const raw = Math.round(e.nativeEvent.contentOffset.x / (cardW + GAP))
    const i = Math.max(0, Math.min(GAME_CATALOG.length - 1, raw))
    if (i !== activeRef.current) {
      activeRef.current = i
      setActive(i)
    }
  }

  const sheen = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(2600),
      Animated.timing(sheen, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(sheen, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [sheen])
  const sheenX = sheen.interpolate({ inputRange: [0, 1], outputRange: [-150, cardW + 60] })

  const [tip, setTip] = useState(TIPS[0])
  useEffect(() => {
    setTip(TIPS[Math.floor(Date.now() / 86400000) % TIPS.length])
  }, [])

  const open = (g: GameCatalogEntry) => {
    triggerHaptic('medium')
    navigation.navigate(g.route)
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.head, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>O&apos;yinlar</Text>

        <View style={styles.counters}>
          <View style={styles.counter} accessibilityLabel={`${xp} XP`}>
            <Ionicons name="flash" size={13} color={C.xp} />
            <Text style={[styles.counterText, NUM]}>{xp.toLocaleString('en-US')}</Text>
            <Text style={styles.counterUnit}>XP</Text>
          </View>
          <View style={styles.counter} accessibilityLabel={`${coin} tanga`}>
            <CoinIcon size={17} />
            <Text style={[styles.counterText, NUM]}>{coin}</Text>
          </View>
        </View>
      </View>

      <View style={styles.carWrap} onLayout={onCarLayout}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardW + GAP}
          snapToAlignment="start"
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={32}
          contentContainerStyle={{ paddingHorizontal: SIDE }}
          style={{ height: carH }}
        >
          {GAME_CATALOG.map(g => {
            const Mark = MARKS[g.mark]
            const tint = TINT[g.mark]
            const gStars = starsOf(gameStars, g.id, g.levels)
            const gTotal = g.levels.length * 3
            const gPlays = gamePlays[g.id] ?? 0
            const label = gPlays > 0 ? 'Davom etish' : "O'ynash"
            const meta = `${g.levels.length} daraja · ${gPlays > 0 ? `${gPlays} ta urinish` : 'yangi'}`
            return (
              <Pressable
                key={g.id}
                accessibilityRole="button"
                accessibilityLabel={`${g.title}. ${HEADLINE[g.id]} ${gStars} yulduz.`}
                onPress={() => open(g)}
                style={({ pressed }) => [
                  { width: cardW, marginRight: GAP },
                  pressed && { transform: [{ scale: 0.985 }] },
                ]}
              >
                <View style={[styles.card, { height: carH }]}>
                  <Image source={ART[g.id]} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  <LinearGradient
                    colors={['rgba(7,28,17,0)', 'rgba(6,24,14,0.20)', 'rgba(4,18,11,0.74)']}
                    locations={[0.3, 0.56, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Animated.View
                    pointerEvents="none"
                    style={[styles.sheen, { transform: [{ translateX: sheenX }, { rotate: '18deg' }] }]}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.20)', 'rgba(255,255,255,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardHeadline} numberOfLines={2}>{HEADLINE[g.id]}</Text>
                    <Text style={styles.cardSub} numberOfLines={1}>{g.sub}</Text>

                    {g.id === 'balance' ? (
                      <>
                        <View style={styles.seesaw}>
                          <View style={[styles.infoIcon, { backgroundColor: tint.bg }]}>
                            <Mark size={18} color={tint.fg} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.infoTitle, styles.inkTitle]} numberOfLines={1}>{g.title}</Text>
                            <Text style={[styles.infoMeta, styles.inkMeta, NUM]} numberOfLines={1}>{meta}</Text>
                          </View>
                          <Ionicons name="swap-horizontal" size={15} color={C.limeDeep} />
                        </View>
                        <View style={[styles.cta, styles.ctaLime]}>
                          <Text style={styles.ctaLimeText}>{label}</Text>
                          <Ionicons name="star" size={10} color="#3E5B1B" />
                          <Text style={[styles.ctaLimeCount, NUM]}>{gStars}/{gTotal}</Text>
                          <Ionicons name="chevron-forward" size={14} color={C.inkOnLime} />
                        </View>
                      </>
                    ) : g.id === 'memory' ? (
                      <>
                        <View style={styles.stackWrap}>
                          <View style={styles.stackBack} />
                          <View style={styles.stackPanel}>
                            <View style={[styles.infoIcon, { backgroundColor: tint.bg }]}>
                              <Mark size={18} color={tint.fg} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.infoTitle} numberOfLines={1}>{g.title}</Text>
                              <Text style={[styles.infoMeta, NUM]} numberOfLines={1}>{meta}</Text>
                            </View>
                            <Ionicons name="repeat" size={15} color="rgba(240,234,255,0.9)" />
                          </View>
                        </View>
                        <View style={[styles.cta, styles.ctaViolet]}>
                          <Text style={styles.ctaWhiteText}>{label}</Text>
                          <Ionicons name="star" size={10} color="#FFE8AD" />
                          <Text style={[styles.ctaWhiteCount, NUM]}>{gStars}/{gTotal}</Text>
                          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                        </View>
                      </>
                    ) : g.id === 'numberline' ? (
                      <View style={styles.railPanel}>
                        <View style={[styles.infoIcon, styles.trackIcon, { backgroundColor: tint.bg }]}>
                          <Mark size={18} color={tint.fg} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoTitle} numberOfLines={1}>{g.title}</Text>
                          <View style={styles.trackMeta}>
                            <Text style={[styles.infoMeta, NUM]} numberOfLines={1}>{meta}</Text>
                            <Ionicons name="star" size={9} color={C.coin} />
                            <Text style={[styles.infoMeta, NUM]} numberOfLines={1}>{gStars}/{gTotal}</Text>
                          </View>
                        </View>
                        <View style={styles.pod}>
                          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </View>
                      </View>
                    ) : (
                      <>
                        <View style={styles.duelPanel}>
                          <View style={[styles.infoIcon, { backgroundColor: tint.bg }]}>
                            <Mark size={18} color={tint.fg} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.infoTitle} numberOfLines={1}>{g.title}</Text>
                            <Text style={[styles.infoMeta, NUM]} numberOfLines={1}>{meta}</Text>
                          </View>
                          <View style={styles.vs}>
                            <Ionicons name="flash" size={10} color="#3B2A07" />
                            <Text style={styles.vsText}>VS</Text>
                          </View>
                        </View>
                        <View style={[styles.cta, styles.ctaAmber]}>
                          <Text style={styles.ctaAmberText}>{label}</Text>
                          <Ionicons name="star" size={10} color="#6B4A12" />
                          <Text style={[styles.ctaAmberCount, NUM]}>{gStars}/{gTotal}</Text>
                          <Ionicons name="chevron-forward" size={14} color="#3B2A07" />
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </Pressable>
            )
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.dots}>
        {GAME_CATALOG.map((g, i) => (
          <View key={g.id} style={[styles.dot, i === active && styles.dotOn]} />
        ))}
      </View>

      <Reveal
        delay={120}
        y={24}
        duration={380}
        style={{ ...styles.sheet, paddingBottom: navBottomSpace(insets.bottom) }}
      >
        <View style={styles.tipCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipKicker}>Kunlik maslahat</Text>
            <Text style={styles.tipText} numberOfLines={3}>{tip}</Text>
          </View>
          <Image
            source={require('../assets/games/muvozanat-lima.png')}
            style={styles.tipArt}
            resizeMode="contain"
          />
        </View>
      </Reveal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.canvas },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE,
    paddingBottom: 10,
  },
  title: { fontSize: 23, lineHeight: 27, letterSpacing: -0.5, fontWeight: '600', color: C.ink },

  counters: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  carWrap: { flex: 1 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  counterText: { fontSize: 12.5, fontWeight: '700', color: C.ink },
  counterUnit: { fontSize: 9.5, fontWeight: '600', color: C.ink4 },

  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.canvasDeep,
    ...shadow('#0B2317', 16, 8, 0.18),
  },
  sheen: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    width: 74,
  },
  cardBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
  },
  cardHeadline: {
    fontSize: 21,
    lineHeight: 25,
    letterSpacing: -0.35,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(4,18,11,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.86)',
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 12.5, lineHeight: 16, fontWeight: '700', color: '#FFFFFF' },
  infoMeta: { fontSize: 10.5, lineHeight: 13, fontWeight: '500', color: 'rgba(255,255,255,0.78)' },

  /* Muvozanat — qiyshaygan oq tarozi paneli + lime tugma */
  seesaw: {
    marginTop: 12,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    transform: [{ rotate: '-1.6deg' }],
    ...shadow('#04120B', 10, 4, 0.20),
  },
  inkTitle: { color: C.ink },
  inkMeta: { color: C.ink3 },

  /* Xotira — ustma-ust ikki karta */
  stackWrap: { marginTop: 12, marginRight: 10 },
  stackBack: {
    position: 'absolute',
    top: -7,
    left: 10,
    right: -10,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
    transform: [{ rotate: '2.2deg' }],
  },
  stackPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(40,26,88,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(205,188,255,0.55)',
  },

  /* Chiziq — rels paneli va yumaloq pod tugma */
  railPanel: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(6,28,48,0.52)',
    borderWidth: 1,
    borderColor: 'rgba(150,196,255,0.5)',
  },
  trackIcon: { borderRadius: 17 },
  trackMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  pod: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.xp,
    ...shadow('#0A1E33', 8, 3, 0.35),
  },

  /* Jangchilar — VS paneli */
  duelPanel: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(52,22,6,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(255,196,128,0.55)',
  },
  vs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: C.coin,
  },
  vsText: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4, color: '#3B2A07' },

  cta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    ...shadow('#04120B', 10, 4, 0.22),
  },
  ctaLime: { backgroundColor: C.lime },
  ctaLimeText: { fontSize: 13.5, fontWeight: '700', color: C.inkOnLime },
  ctaLimeCount: { fontSize: 11, fontWeight: '600', color: 'rgba(28,50,20,0.72)' },
  ctaViolet: { backgroundColor: C.violet },
  ctaWhiteText: { fontSize: 13.5, fontWeight: '700', color: '#FFFFFF' },
  ctaWhiteCount: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.82)' },
  ctaAmber: { backgroundColor: C.coin },
  ctaAmberText: { fontSize: 13.5, fontWeight: '700', color: '#3B2A07' },
  ctaAmberCount: { fontSize: 11, fontWeight: '600', color: 'rgba(59,42,7,0.72)' },

  dots: {
    height: 6,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C9D4C4' },
  dotOn: { width: 20, backgroundColor: C.brand },

  sheet: {
    marginTop: 12,
    paddingTop: 16,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: C.surface,
    ...shadow('#0B2317', 22, 12, 0.10),
  },
  tipCard: {
    marginTop: 2,
    marginHorizontal: SIDE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: C.leafSoft,
  },
  tipKicker: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.limeDeep,
  },
  tipText: { marginTop: 4, fontSize: 13, lineHeight: 18, fontWeight: '600', color: C.ink },
  tipArt: { width: 86, height: 86, marginVertical: -8 },
})

export default GamesScreen
