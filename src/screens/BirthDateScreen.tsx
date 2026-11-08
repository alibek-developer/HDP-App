import { useRef, useState } from 'react'
import type { ComponentRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg, StepHeader } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { gradeFromBirthDate } from '../lib/profile'
import { useApp } from '../store/useStore'
import type { RootStackParamList } from '../navigation/types'
import { C, R, T } from '../theme/tokens'

const pad = (n: number) => String(n).padStart(2, '0')

const daysInMonth = (year: number, monthIdx: number) => new Date(year, monthIdx + 1, 0).getDate()

const onlyDigits = (v: string) => v.replace(/[^0-9]/g, '')

/**
 * 2-savol — tug'ilgan sana. Uchta oddiy maydon: kun, oy, yil.
 * Yoshdan sinf o'zi hisoblanadi; sana to'liq va to'g'ri bo'lsa «Boshlash» ochiladi.
 */
const BirthDateScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'BirthDate'>) => {
  const insets = useSafeAreaInsets()
  const { goal } = route.params
  const saveStudyProfile = useApp(s => s.saveStudyProfile)

  const yearNow = new Date().getFullYear()
  const minYear = yearNow - 25
  const maxYear = yearNow - 8

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const monthRef = useRef<ComponentRef<typeof TextInput>>(null)
  const yearRef = useRef<ComponentRef<typeof TextInput>>(null)

  const d = Number(day)
  const m = Number(month)
  const y = Number(year)
  const filled = day !== '' && month !== '' && year !== ''
  const maxDay = m >= 1 && m <= 12 ? daysInMonth(y || yearNow, m - 1) : 31

  let error: string | null = null
  if (filled) {
    if (m < 1 || m > 12) error = "Oy 1–12 oralig'ida bo'lsin."
    else if (d < 1 || d > maxDay) error = `Bu oyda kunlar 1–${maxDay} oralig'ida bo'ladi.`
    else if (y < minYear || y > maxYear) error = `Yil ${minYear}–${maxYear} oralig'ida bo'lsin.`
  }
  const valid = filled && !error
  const birthDate = valid ? `${pad(d)}.${pad(m)}.${y}` : ''

  const back = () => {
    triggerHaptic('light')
    navigation.goBack()
  }

  const done = () => {
    if (!valid) return
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        >
          <StepHeader step={2} />

          <Reveal y={16} duration={340}>
            <Text style={styles.title}>Tug&apos;ilgan sanangiz?</Text>
            <Text style={styles.sub}>
              Yoshga mos darslar va test qiyinligini shu asosda tanlaymiz.
            </Text>
          </Reveal>

          <Reveal y={24} delay={80} duration={380} style={styles.pickerCard}>
            <View style={styles.col}>
              <Text style={styles.colHead}>KUN</Text>
              <TextInput
                style={[styles.input, filled && !!error && styles.inputBad]}
                value={day}
                onChangeText={v => {
                  const t = onlyDigits(v).slice(0, 2)
                  setDay(t)
                  if (t.length === 2) monthRef.current?.focus()
                }}
                onSubmitEditing={() => monthRef.current?.focus()}
                placeholder="KK"
                placeholderTextColor={C.ink4}
                keyboardType="number-pad"
                maxLength={2}
                accessibilityLabel="Tug'ilgan kun"
              />
            </View>
            <View style={[styles.col, styles.colMonth]}>
              <Text style={styles.colHead}>OY</Text>
              <TextInput
                ref={monthRef}
                style={[styles.input, !!error && filled && styles.inputBad]}
                value={month}
                onChangeText={v => {
                  const t = onlyDigits(v).slice(0, 2)
                  setMonth(t)
                  if (t.length === 2) yearRef.current?.focus()
                }}
                onSubmitEditing={() => yearRef.current?.focus()}
                placeholder="OO"
                placeholderTextColor={C.ink4}
                keyboardType="number-pad"
                maxLength={2}
                accessibilityLabel="Tug'ilgan oy"
              />
            </View>
            <View style={[styles.col, styles.colYear]}>
              <Text style={styles.colHead}>YIL</Text>
              <TextInput
                ref={yearRef}
                style={[styles.input, !!error && filled && styles.inputBad]}
                value={year}
                onChangeText={v => setYear(onlyDigits(v).slice(0, 4))}
                placeholder="YYYY"
                placeholderTextColor={C.ink4}
                keyboardType="number-pad"
                maxLength={4}
                accessibilityLabel="Tug'ilgan yil"
              />
            </View>
          </Reveal>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Reveal y={14} delay={140} duration={340}>
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Ionicons name="calendar" size={16} color={C.brand} />
              </View>
              <View style={styles.summaryMid}>
                <Text style={styles.summaryLabel}>Tanlangan sana</Text>
                <Text style={styles.summaryValue}>{valid ? birthDate : 'hali kiritilmagan'}</Text>
              </View>
              {valid && (
                <View style={styles.gradePill}>
                  <Text style={styles.gradePillText}>{gradeFromBirthDate(birthDate)}</Text>
                </View>
              )}
            </View>
          </Reveal>

          <View style={styles.spacer} />

          <LimeButton label="Boshlash" onPress={done} disabled={!valid} style={styles.submit} />
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
  title: { ...T.h1, marginTop: 20, color: C.ink },
  sub: { ...T.bodyMd, marginTop: 6, color: C.ink3 },

  pickerCard: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    padding: 16,
    borderRadius: R.xl,
    backgroundColor: '#FFFFFF',
    shadowColor: '#33502A',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  col: { flex: 0.8 },
  colMonth: { flex: 0.8 },
  colYear: { flex: 1.2 },
  colHead: { ...T.tiny, textAlign: 'center', color: C.ink4, marginBottom: 8 },
  input: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.line,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: C.ink,
    fontVariant: ['tabular-nums'],
    paddingVertical: 0,
  },
  inputBad: { borderColor: '#E4A6A0', backgroundColor: '#FFFBFA' },
  error: { marginTop: 10, textAlign: 'center', fontSize: 12.5, lineHeight: 18, fontWeight: '500', color: '#C2453D' },

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
