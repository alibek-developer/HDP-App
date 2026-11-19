import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, StepHeader } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { NUM, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

const ROW_H = 44
const ROWS = 5
const WHEEL_H = ROW_H * ROWS
const BAND_H = 54
const NATIVE = Platform.OS !== 'web'

const MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]

const pad = (n: number) => String(n).padStart(2, '0')

const daysInMonth = (year: number, monthIdx: number) => new Date(year, monthIdx + 1, 0).getDate()

type WheelColumnProps = {
  items: string[]
  index: number
  onIndexChange: (i: number) => void
  flex: number
  label: string
}

/**
 * Bitta baraban ustuni. Markazdagi qator silliq kattalashadi, chetdagilar
 * xiralashadi — chegara va chiziqlarsiz, faqat yumshoq fon lentasi bilan.
 */
const WheelColumn = ({ items, index, onIndexChange, flex, label }: WheelColumnProps) => {
  const C = useColors()
  const styles = makeStyles(C)
  const ref = useRef<ScrollViewInstance>(null)
  const initial = useRef(index * ROW_H).current
  const scrollY = useRef(new Animated.Value(initial)).current
  const current = useRef(index)
  const inited = useRef(false)

  useEffect(() => {
    if (current.current === index) return
    current.current = index
    ref.current?.scrollTo({ y: index * ROW_H, animated: true })
    Animated.timing(scrollY, {
      toValue: index * ROW_H,
      duration: 220,
      useNativeDriver: NATIVE,
    }).start()
  }, [index, scrollY])

  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const raw = e.nativeEvent.contentOffset.y
    const next = Math.max(0, Math.min(items.length - 1, Math.round(raw / ROW_H)))
    if (next === current.current) return
    current.current = next
    triggerHaptic('selection')
    onIndexChange(next)
  }

  const pick = (i: number) => {
    if (i === current.current) return
    current.current = i
    triggerHaptic('selection')
    onIndexChange(i)
    ref.current?.scrollTo({ y: i * ROW_H, animated: true })
    Animated.timing(scrollY, {
      toValue: i * ROW_H,
      duration: 200,
      useNativeDriver: NATIVE,
    }).start()
  }

  return (
    <View style={[styles.column, { flex }]} accessibilityLabel={label}>
      <Animated.ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={ROW_H}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        contentOffset={{ x: 0, y: initial }}
        contentContainerStyle={{ paddingVertical: ROW_H * Math.floor(ROWS / 2) }}
        onContentSizeChange={() => {
          if (inited.current) return
          inited.current = true
          ref.current?.scrollTo({ y: initial, animated: false })
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: NATIVE,
        })}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={settle}
      >
        {items.map((item, i) => {
          const opacity = scrollY.interpolate({
            inputRange: [(i - 2) * ROW_H, (i - 1) * ROW_H, i * ROW_H, (i + 1) * ROW_H, (i + 2) * ROW_H],
            outputRange: [0.1, 0.36, 1, 0.36, 0.1],
            extrapolate: 'clamp',
          })
          const scale = scrollY.interpolate({
            inputRange: [(i - 2) * ROW_H, (i - 1) * ROW_H, i * ROW_H, (i + 1) * ROW_H, (i + 2) * ROW_H],
            outputRange: [0.74, 0.86, 1, 0.86, 0.74],
            extrapolate: 'clamp',
          })
          return (
            <Animated.View key={item} style={[styles.row, { opacity, transform: [{ scale }] }]}>
              <Pressable
                onPress={() => pick(i)}
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${item}`}
                style={styles.rowPress}
              >
                <Text style={[styles.rowText, NUM]} numberOfLines={1}>
                  {item}
                </Text>
              </Pressable>
            </Animated.View>
          )
        })}
      </Animated.ScrollView>
    </View>
  )
}

/** 2-savol — tug'ilgan sana. Uch ustunli baraban: kun, oy, yil. */
const BirthDateScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'BirthDate'>) => {
  const C = useColors()
  const styles = makeStyles(C)
  const insets = useSafeAreaInsets()
  const { goal } = route.params
  const saveStudyProfile = useApp(s => s.saveStudyProfile)

  const today = new Date()
  const yearNow = today.getFullYear()
  const minYear = 1900

  const [day, setDay] = useState(today.getDate())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(yearNow - 12)

  const years = Array.from({ length: yearNow - minYear + 1 }, (_, i) => String(yearNow - i))
  const maxDay = daysInMonth(year, month - 1)
  const dayItems = Array.from({ length: maxDay }, (_, i) => String(i + 1))

  useEffect(() => {
    if (day > maxDay) setDay(maxDay)
  }, [day, maxDay])

  const birthDate = `${pad(day)}.${pad(month)}.${year}`

  const back = () => {
    triggerHaptic('light')
    navigation.goBack()
  }

  const done = () => {
    triggerHaptic('success')
    saveStudyProfile(goal, birthDate)
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
  }

  return (
    <Fade>
      <View style={styles.root}>
        <LinearGradient
          colors={[C.leafTint, C.surface]}
          locations={[0, 0.38]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={[styles.page, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.topBar}>
            <Pressable
              onPress={back}
              hitSlop={10}
              accessibilityLabel="Orqaga"
              style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.94 }] }]}
            >
              <Ionicons name="chevron-back" size={19} color={C.ink2} />
            </Pressable>

            <View style={styles.brandRow} pointerEvents="none">
              <BrandMark size={30} />
              <Wordmark size={18} />
            </View>

            <View style={styles.topBarSide} />
          </View>

          <StepHeader step={2} />

          <Reveal y={14} duration={340}>
            <Text style={styles.title}>
              <Text style={styles.titleDim}>Qachon </Text>
              <Text style={styles.titleStrong}>tug&apos;ilgansiz?</Text>
            </Text>
            <Text style={styles.sub}>Yoshingizga mos darslar tanlanadi.</Text>
          </Reveal>

          <Reveal y={20} delay={80} duration={380} style={styles.wheelWrap}>
            <View style={styles.band} pointerEvents="none" />
            <View style={styles.columns}>
              <WheelColumn
                items={dayItems}
                index={day - 1}
                onIndexChange={i => setDay(i + 1)}
                flex={0.85}
                label="Kun"
              />
              <WheelColumn
                items={MONTHS}
                index={month - 1}
                onIndexChange={i => setMonth(i + 1)}
                flex={1.5}
                label="Oy"
              />
              <WheelColumn
                items={years}
                index={Math.max(0, years.indexOf(String(year)))}
                onIndexChange={i => setYear(Number(years[i]))}
                flex={1.1}
                label="Yil"
              />
            </View>
            <LinearGradient
              colors={[C.surface, 'rgba(255,255,255,0)']}
              style={styles.fadeTop}
              pointerEvents="none"
            />
            <LinearGradient
              colors={['rgba(255,255,255,0)', C.surface]}
              style={styles.fadeBottom}
              pointerEvents="none"
            />
          </Reveal>

          <Text style={styles.helper}>Tug&apos;ilgan kun, oy va yilni aylantirib tanlang</Text>

          <View style={styles.spacer} />

          <LimeButton
            label="Boshlash"
            onPress={done}
            trailing={<Ionicons name="arrow-forward" size={16} color={C.inkOnLime} />}
          />
        </View>
      </View>
    </Fade>
  )
}

const makeStyles = (C: ThemeColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  page: { flex: 1, paddingHorizontal: 20 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface2,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topBarSide: { width: 44, height: 44 },

  title: { marginTop: 18, fontSize: 29, lineHeight: 35, letterSpacing: -0.7 },
  titleDim: { color: C.ink3, fontWeight: '400' },
  titleStrong: { color: C.ink, fontWeight: '700' },
  sub: { marginTop: 7, fontSize: 13.5, lineHeight: 19, fontWeight: '500', color: C.ink3 },

  wheelWrap: {
    marginTop: 18,
    height: WHEEL_H,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (WHEEL_H - BAND_H) / 2,
    height: BAND_H,
    borderRadius: 18,
    backgroundColor: C.surface2,
  },
  columns: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  column: { height: WHEEL_H },
  row: { height: ROW_H },
  rowPress: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowText: { fontSize: 22, lineHeight: 27, fontWeight: '600', letterSpacing: -0.2, color: C.ink },

  fadeTop: { position: 'absolute', left: 0, right: 0, top: 0, height: 62 },
  fadeBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 62 },

  helper: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '500',
    color: C.ink3,
  },

  spacer: { flex: 1, minHeight: 18 },
})

export default BirthDateScreen
