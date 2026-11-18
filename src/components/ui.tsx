import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { C, R, T } from '../theme/tokens'

/**
 * Kirish ekranlarining umumiy qurilishi. Har ekran o'z element tiliga ega
 * (Masalalar/tub ekranlar burchakli), shuning uchun bu yerda faqat splash
 * va login/signup ishlatadigan yumaloq uslub turadi.
 */

export const ScreenBg = ({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <LinearGradient
    colors={['#D9EFC1', '#EBF7D9', '#F8FCEE']}
    locations={[0, 0.42, 0.82]}
    style={[StyleSheet.absoluteFill, style]}
  >
    {children}
  </LinearGradient>
)

/**
 * Android edge-to-edge: kontent status bar ostidan o'tadi. Bu qatlam o'sha
 * zonani ekran foni bilan yopadi — skroll paytida hech narsa ikonkalar tagida
 * ko'rinmaydi, pastdagi chiziq esa yuqori chegara hosil qiladi.
 */
export const TopScrim = ({
  height,
  colors = ['#F3F7EE', '#F3F7EE'],
  line,
}: {
  height: number
  colors?: readonly [string, string, ...string[]]
  line?: string
}) => (
  <View pointerEvents="none" style={[styles.topScrim, { height }]}>
    <LinearGradient
      colors={colors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {line ? <View style={[styles.topScrimLine, { backgroundColor: line }]} /> : null}
  </View>
)

type BtnProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  busy?: boolean
  busyLabel?: string
  height?: number
  trailing?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

/** Asosiy harakat — lime gradient, ichki oq chiziq bilan hajm beriladi */
export const LimeButton = ({
  label,
  onPress,
  disabled,
  busy,
  busyLabel = 'Kuting...',
  height = 56,
  trailing,
  style,
}: BtnProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || busy}
    accessibilityRole="button"
    accessibilityState={{ disabled: !!disabled || !!busy }}
    style={({ pressed }) => [
      { opacity: disabled ? 0.45 : 1, transform: [{ scale: pressed && !disabled ? 0.975 : 1 }] },
      style,
    ]}
  >
    <LinearGradient
      colors={['#A6EA55', '#7ED321']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.lime, { height }, !disabled && styles.limeShadow]}
    >
      {busy ? <ActivityIndicator size="small" color={C.inkOnLime} /> : null}
      <Text style={styles.limeText}>{busy ? busyLabel : label}</Text>
      {!busy && trailing}
    </LinearGradient>
  </Pressable>
)

/** Ikkinchi darajali harakat — oq yuza, siyoh matn */
export const GhostButton = ({
  label,
  onPress,
  height = 52,
  icon,
  style,
}: {
  label: string
  onPress: () => void
  height?: number
  icon?: React.ReactNode
  style?: StyleProp<ViewStyle>
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}
  >
    <View style={[styles.ghost, { height }]}>
      {icon}
      <Text style={styles.ghostText}>{label}</Text>
    </View>
  </Pressable>
)

/** Maydoncha: yorliq + ikon + input (+ o'ngda ko'z tugmasi) + xato matni */
export const Field = ({
  icon,
  right,
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...input
}: TextInputProps & {
  icon?: React.ReactNode
  right?: React.ReactNode
  label?: string
  error?: string | null
  style?: StyleProp<ViewStyle>
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <View style={style}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocus, !!error && styles.fieldBad]}>
        {icon}
        <TextInput
          {...input}
          onFocus={e => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={e => {
            setFocused(false)
            onBlur?.(e)
          }}
          placeholderTextColor={C.ink4}
          style={styles.fieldInput}
          autoCapitalize={input.autoCapitalize ?? 'none'}
        />
        {right}
      </View>
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  )
}

/** Kirish ↔ Ro'yxatdan o'tish — bitta qarashda tanlanadigan rejim */
export const AuthSwitch = ({
  active,
  onSwitch,
  style,
}: {
  active: 'login' | 'signup'
  onSwitch: (mode: 'login' | 'signup') => void
  style?: StyleProp<ViewStyle>
}) => (
  <View style={[styles.switch, style]}>
    {([
      { key: 'login' as const, label: 'Kirish' },
      { key: 'signup' as const, label: "Ro'yxatdan o'tish" },
    ]).map(tab => {
      const on = tab.key === active
      return (
        <Pressable
          key={tab.key}
          onPress={() => { if (!on) onSwitch(tab.key) }}
          accessibilityRole="tab"
          accessibilityState={{ selected: on }}
          style={styles.switchTab}
        >
          {on && (
            <LinearGradient
              colors={['#9BE04B', '#7ED321']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: R.full }]}
            />
          )}
          <Text style={[styles.switchText, on && styles.switchTextOn]}>{tab.label}</Text>
        </Pressable>
      )
    })}
  </View>
)

/** Onboarding savollari uchun qadam ko'rsatkichi — segmentlar + sanoq */
export const StepHeader = ({ step, total = 2 }: { step: number; total?: number }) => (
  <View style={styles.stepHead}>
    <View style={styles.stepSegs}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.stepSeg, i < step && styles.stepSegOn]} />
      ))}
    </View>
    <Text style={styles.stepText}>
      {step}
      <Text style={styles.stepTextDim}>/{total}</Text>
    </Text>
  </View>
)

export const TapText = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode
  onPress: () => void
  style?: StyleProp<TextStyle>
}) => (
  <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
    <Text style={style}>{children}</Text>
  </Pressable>
)

const styles = StyleSheet.create({
  topScrim: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 20 },
  topScrimLine: { position: 'absolute', left: 0, right: 0, bottom: 0, height: StyleSheet.hairlineWidth },
  lime: {
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  limeShadow: {
    shadowColor: '#5FAF22',
    shadowOpacity: 0.36,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
  limeText: { ...T.h3, fontSize: 15.5, fontWeight: '600', color: C.inkOnLime },
  ghost: {
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#F6FAF2',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.1)',
  },
  ghostText: { fontSize: 14.5, fontWeight: '600', color: C.ink2 },
  fieldLabel: {
    fontSize: 11.5,
    lineHeight: 15,
    letterSpacing: 0.3,
    fontWeight: '600',
    color: C.ink3,
    marginBottom: 7,
    marginLeft: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F8FBF3',
    borderWidth: 1,
    borderColor: '#E6EEDF',
  },
  fieldFocus: {
    backgroundColor: '#FFFFFF',
    borderColor: C.limeDeep,
    shadowColor: C.limeDeep,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  fieldBad: { borderColor: '#E4A6A0', backgroundColor: '#FFFBFA' },
  fieldErrorText: { marginTop: 6, marginLeft: 4, fontSize: 12.5, lineHeight: 17, fontWeight: '500', color: '#C2453D' },
  switch: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: R.full,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(28,50,20,0.08)',
  },
  switchTab: {
    flex: 1,
    height: 42,
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  switchText: { fontSize: 13.5, fontWeight: '600', color: C.ink3 },
  switchTextOn: { color: C.inkOnLime },
  stepHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepSegs: { flex: 1, flexDirection: 'row', gap: 6 },
  stepSeg: { flex: 1, height: 5, borderRadius: R.full, backgroundColor: '#D5E2CC' },
  stepSegOn: { backgroundColor: C.limeDeep },
  stepText: { ...T.label, fontSize: 12.5, fontWeight: '600', color: C.brand, fontVariant: ['tabular-nums'] },
  stepTextDim: { color: C.ink4, fontWeight: '500' },
  fieldInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: 15,
    fontWeight: '500',
    color: C.ink,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
})
