import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { gradeFromBirthDate } from '../lib/profile'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

const ITEM_H = 44
const VISIBLE_ROWS = 5
const WHEEL_H = ITEM_H * VISIBLE_ROWS

const pad = (n: number) => String(n).padStart(2, '0')

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

const Wheel = ({
  items,
  index,
  onChange,
  style,
}: {
  items: string[]
  index: number
  onChange: (i: number) => void
  style?: StyleProp<ViewStyle>
}) => {
  const ref = useRef<ScrollViewInstance>(null)
  /** Ekrandan turib o'rnatilgan qiymat — scroll hodisalari uni qaytarib yubormasin */
  const settled = useRef(index)
  const programmatic = useRef(false)
  const guard = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retry = useRef<ReturnType<typeof setTimeout> | null>(null)

  const jumpTo = (i: number) => {
    settled.current = i
    programmatic.current = true
    const apply = () => ref.current?.scrollTo({ y: i * ITEM_H, animated: false })
    apply()
    /* Web'da birinchi `scrollTo` kontent o'lchanguncha e'tiborsiz qolishi mumkin */
    if (retry.current) clearTimeout(retry.current)
    retry.current = setTimeout(apply, 100)
    if (guard.current) clearTimeout(guard.current)
    guard.current = setTimeout(() => { programmatic.current = false }, 260)
  }

  useEffect(() => {
    if (settled.current === index) return
    jumpTo(index)
  }, [index])

  useEffect(() => () => {
    if (guard.current) clearTimeout(guard.current)
    if (retry.current) clearTimeout(retry.current)
  }, [])

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (programmatic.current) return
    const raw = Math.round(e.nativeEvent.contentOffset.y / ITEM_H)
    const i = Math.max(0, Math.min(items.length - 1, raw))
    if (i === settled.current) return
    settled.current = i
    onChange(i)
  }

  return (
    <View style={[{ height: WHEEL_H }, style]}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        bounces={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: ITEM_H * ((VISIBLE_ROWS - 1) / 2) }}
        onScroll={onScroll}
        onLayout={() => jumpTo(index)}
        onContentSizeChange={() => jumpTo(index)}
      >
        {items.map((label, i) => {
          const on = i === index
          return (
            <Pressable
              key={`${label}-${i}`}
              onPress={() => {
                if (i !== index) {
                  triggerHaptic('selection')
                  jumpTo(i)
                  onChange(i)
                }
              }}
              style={styles.wheelItem}
            >
              <Text style={[styles.wheelText, on && styles.wheelTextOn]}>{label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

/**
 * 2-savol — tug'ilgan sana. Sinf so'ralmaydi: yoshdan sinf va mashq
 * qiyinligi o'zi hisoblanadi, shuning uchun savol ortiqcha bo'lmaydi.
 */
const BirthDateScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'BirthDate'>) => {
  const insets = useSafeAreaInsets()
  const { goal } = route.params
  const saveStudyProfile = useApp(s => s.saveStudyProfile)

  const yearNow = new Date().getFullYear()
  const years = useMemo(() => {
    const list: string[] = []
    for (let y = yearNow - 25; y <= yearNow - 8; y += 1) list.push(String(y))
    return list
  }, [yearNow])

  const defaultYear = Math.max(0, years.indexOf(String(yearNow - 15)))
  const [day, setDay] = useState(0)
  const [month, setMonth] = useState(0)
  const [yearIdx, setYearIdx] = useState(defaultYear)

  const year = Number(years[yearIdx])
  const total = daysInMonth(year, month)
  const maxDayIdx = total - 1

  /** Oy/yil o'zgarganda 31-fevral kabi sanalar 28/29 ga qisqaradi */
  useEffect(() => {
    if (day > maxDayIdx) setDay(maxDayIdx)
  }, [day, maxDayIdx])

  const birthDate = `${pad(Math.min(day, maxDayIdx) + 1)}.${pad(month + 1)}.${year}`
  const days = useMemo(() => Array.from({ length: total }, (_, i) => String(i + 1)), [total])

  const fill = useRef(new Animated.Value(0.5)).current
  useEffect(() => {
    Animated.timing(fill, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [fill])

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
        <ScreenBg />

        <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
          <Pressable
            onPress={back}
            hitSlop={10}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.back, pressed && { transform: [{ scale: 0.94 }] }]}
          >
            <Ionicons name="chevron-back" size={19} color={C.ink2} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        >
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>

          <Reveal y={16} duration={340}>
            <Text style={styles.kicker}>2-savol · 2 tadan</Text>
            <Text style={styles.title}>
              <Text style={{ color: C.ink4, fontWeight: '400' }}>Tug'ilgan </Text>
              <Text style={{ color: C.ink, fontWeight: '600' }}>sanangiz?</Text>
            </Text>
            <Text style={styles.sub}>
              Yoshga mos darslar va test qiyinligini shu asosda tanlaymiz.
            </Text>
          </Reveal>

          <Reveal y={26} delay={90} duration={400}>
            <View style={styles.pickerCard}>
              <View style={styles.headRow}>
                <Text style={[styles.colHead, styles.wheelDay]}>KUN</Text>
                <Text style={[styles.colHead, styles.wheelMonth]}>OY</Text>
                <Text style={[styles.colHead, styles.wheelYear]}>YIL</Text>
              </View>

              <View style={styles.wheelsWrap}>
                <View pointerEvents="none" style={styles.band} />
                <View style={styles.wheels}>
                  <Wheel items={days} index={Math.min(day, maxDayIdx)} onChange={setDay} style={styles.wheelDay} />
                  <Wheel items={MONTHS} index={month} onChange={setMonth} style={styles.wheelMonth} />
                  <Wheel items={years} index={yearIdx} onChange={setYearIdx} style={styles.wheelYear} />
                </View>
              </View>
            </View>
          </Reveal>

          <Reveal y={14} delay={170} duration={340}>
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Ionicons name="calendar" size={16} color={C.brand} />
              </View>
              <View style={styles.summaryMid}>
                <Text style={styles.summaryLabel}>Tanlangan sana</Text>
                <Text style={styles.summaryValue}>{birthDate}</Text>
              </View>
              <View style={styles.gradePill}>
                <Text style={styles.gradePillText}>{gradeFromBirthDate(birthDate)}</Text>
              </View>
            </View>
          </Reveal>

          <View style={styles.spacer} />

          <LimeButton label="Boshlash" onPress={done} style={styles.submit} />
          <Text style={styles.footNote}>Sana faqat qurilmada saqlanadi.</Text>
        </ScrollView>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas },
  topBar: { paddingHorizontal: 16, paddingBottom: 4 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  track: { height: 4, borderRadius: R.full, backgroundColor: '#DCE6D4', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: R.full, backgroundColor: C.limeDeep },
  kicker: { ...T.tiny, marginTop: 20, color: C.brand },
  title: { ...T.h1, marginTop: 8, color: C.ink },
  sub: { ...T.bodyMd, marginTop: 6, color: C.ink3 },

  pickerCard: {
    marginTop: 22,
    paddingTop: 14,
    paddingBottom: 10,
    borderRadius: R.xl,
    backgroundColor: '#FFFFFF',
    shadowColor: '#33502A',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: ITEM_H * 2,
    height: ITEM_H,
    borderRadius: 12,
    backgroundColor: '#EAF7DA',
  },
  headRow: { flexDirection: 'row', paddingHorizontal: 6, marginBottom: 2 },
  colHead: { ...T.tiny, fontSize: 11.5, textAlign: 'center', color: C.ink4 },
  wheelsWrap: { position: 'relative' },
  wheels: { flexDirection: 'row', alignItems: 'center' },
  wheelDay: { flex: 0.9 },
  wheelMonth: { flex: 1.5 },
  wheelYear: { flex: 1 },
  wheelItem: { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  wheelText: { fontSize: 17, fontWeight: '500', color: C.ink4 },
  wheelTextOn: { fontSize: 20, fontWeight: '600', color: C.ink },

  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: 16,
    padding: 12,
    borderRadius: R.md,
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
  },
  summaryMid: { flex: 1, minWidth: 0 },
  summaryLabel: { fontSize: 12, fontWeight: '500', color: C.ink3 },
  summaryValue: { fontSize: 16, fontWeight: '600', color: C.ink, marginTop: 1, fontVariant: ['tabular-nums'] },
  gradePill: { paddingHorizontal: 9, height: 24, borderRadius: R.full, backgroundColor: C.limeBright, alignItems: 'center', justifyContent: 'center' },
  gradePillText: { fontSize: 12, fontWeight: '600', color: C.inkOnLime },

  spacer: { flex: 1, minHeight: 22 },
  submit: { marginTop: 20 },
  footNote: { ...T.bodySm, textAlign: 'center', marginTop: 10, color: C.ink4 },
})

export default BirthDateScreen
