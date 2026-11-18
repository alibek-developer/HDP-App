import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MCI from '@expo/vector-icons/MaterialCommunityIcons'
import Svg, { Circle, Path } from 'react-native-svg'
import type { ProblemLevel, ProblemSubject } from '../data/problems'
import { CARD_LIFT } from '../theme/solver'
import { ABS_FILL, C, NUM } from '../theme/tokens'

/**
 * Fan kartasi — bilet ostidagi yagona navigatsiya birligi.
 * Chapda «jonli» duotone glif (rang fanga xos), o'ngda uch daraja
 * yulduz pipslari: darajaga bir bosishda kirish mumkin.
 */

const ART: Record<string, { from: string; to: string; ink: string; soft: string; line: string; star: string }> = {
  algebra: {
    from: '#0E6B4B', to: '#17A06F', ink: '#C6F29B',
    soft: '#F0F9EA', line: 'rgba(11,110,79,0.26)', star: '#5FAF22',
  },
  geometriya: {
    from: '#28489B', to: '#4478E4', ink: '#D3E2FF',
    soft: '#F0F4FE', line: 'rgba(68,120,228,0.28)', star: '#3560C4',
  },
  stereometriya: {
    from: '#93540F', to: '#E8A33D', ink: '#FFE7C2',
    soft: '#FDF5E8', line: 'rgba(232,163,61,0.4)', star: '#B87A22',
  },
}

const Glyph = ({ id, ink }: { id: string; ink: string }) => {
  if (id === 'geometriya') {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M12 4.2 L20.6 19.6 H3.4 Z" fill={ink} fillOpacity={0.14} stroke={ink} strokeWidth={1.6} strokeLinejoin="round" />
        <Circle cx={12} cy={14.6} r={3} stroke={ink} strokeWidth={1.4} fill="none" />
      </Svg>
    )
  }
  if (id === 'stereometriya') {
    return (
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M12 3.2 L20 7.6 V16.4 L12 20.8 L4 16.4 V7.6 Z" fill={ink} fillOpacity={0.14} stroke={ink} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M4 7.6 L12 12 L20 7.6 M12 12 V20.8" stroke={ink} strokeWidth={1.4} strokeLinejoin="round" fill="none" />
      </Svg>
    )
  }
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path d="M3.4 19 C7.4 6.2 16.6 6.2 20.6 19" stroke={ink} strokeWidth={1.7} strokeLinecap="round" fill="none" />
      <Path d="M3 19.4 H21" stroke={ink} strokeWidth={1.2} strokeLinecap="round" opacity={0.45} />
      <Circle cx={12} cy={12.9} r={1.8} fill={ink} />
    </Svg>
  )
}

interface Props {
  subject: ProblemSubject
  levels: ProblemLevel[]
  starsByLevel: Record<string, number>
  solved: number
  total: number
  index: number
  onOpen: () => void
  onLevel: (setId: string) => void
}

const ProblemSubjectCard = ({
  subject, levels, starsByLevel, solved, total, index, onOpen, onLevel,
}: Props) => {
  const art = ART[subject.id] ?? ART.algebra
  const lift = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(lift, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(lift, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    )
    const timer = setTimeout(() => loop.start(), index * 350)
    return () => {
      clearTimeout(timer)
      loop.stop()
    }
  }, [lift, index])

  const float = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -1.6] })
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100)

  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [CARD_LIFT, styles.card, pressed && { transform: [{ scale: 0.99 }] }]}
    >
      <View style={styles.head}>
        <LinearGradient
          colors={[art.from, art.to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tile}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0.9 }}
            style={ABS_FILL}
          />
          <Animated.View style={{ transform: [{ translateY: float }] }}>
            <Glyph id={subject.id} ink={art.ink} />
          </Animated.View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={[styles.note, NUM]}>
            {subject.note} · {solved}/{total} masala
          </Text>
        </View>

        <View style={[styles.go, { backgroundColor: art.soft }]}>
          <MCI name="chevron-right" size={15} color={art.from} />
        </View>
      </View>

      <View style={styles.levelRow}>
        {levels.map(lvl => {
          const got = starsByLevel[lvl.id] ?? 0
          return (
            <Pressable
              key={lvl.id}
              onPress={() => onLevel(lvl.id)}
              hitSlop={4}
              style={({ pressed }) => [
                styles.levelChip,
                got > 0 && { backgroundColor: art.soft, borderColor: art.line },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={[styles.levelLabel, got > 0 && { color: art.from }]}>{lvl.label}</Text>
              <View style={styles.pips}>
                {[0, 1, 2].map(k => (
                  <MCI
                    key={k}
                    name={k < got ? 'star' : 'star-outline'}
                    size={9}
                    color={k < got ? art.star : '#C7D2BE'}
                  />
                ))}
              </View>
            </Pressable>
          )
        })}
      </View>

      {solved > 0 && (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: art.from }]} />
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 20 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 15.5, lineHeight: 19, fontWeight: '600', color: C.ink },
  note: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: '#7D8C77' },
  go: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  levelRow: { marginTop: 10, flexDirection: 'row', gap: 6 },
  levelChip: {
    flex: 1,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E6ECE0',
    backgroundColor: '#FAFBF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  levelLabel: { fontSize: 11, fontWeight: '600', color: '#5E6E58' },
  pips: { flexDirection: 'row', gap: 1 },

  track: { marginTop: 9, height: 4, borderRadius: 2, backgroundColor: C.lineSoft, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
})

export default ProblemSubjectCard
