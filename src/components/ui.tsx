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
    colors={['#CDE9AE', '#E6F5D2', '#F7FCED']}
    locations={[0, 0.4, 0.76]}
    style={[StyleSheet.absoluteFill, style]}
  >
    {children}
  </LinearGradient>
)

type BtnProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  busy?: boolean
  busyLabel?: string
  height?: number
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
  style,
}: BtnProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || busy}
    style={({ pressed }) => [
      { opacity: disabled ? 0.8 : 1, transform: [{ scale: pressed ? 0.975 : 1 }] },
      style,
    ]}
  >
    <LinearGradient
      colors={['#9BE04B', '#7ED321']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.lime, { height }, styles.limeShadow]}
    >
      {busy ? <ActivityIndicator size="small" color={C.inkOnLime} /> : null}
      <Text style={styles.limeText}>{busy ? busyLabel : label}</Text>
    </LinearGradient>
  </Pressable>
)

/** Maydoncha: ikon + input (+ o'ngda ko'z tugmasi) */
export const Field = ({
  icon,
  right,
  style,
  ...input
}: TextInputProps & { icon?: React.ReactNode; right?: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[styles.field, style]}>
    {icon}
    <TextInput
      {...input}
      placeholderTextColor={C.ink4}
      style={styles.fieldInput}
      autoCapitalize={input.autoCapitalize ?? 'none'}
    />
    {right}
  </View>
)

/** «yoki quyidagilar orqali» — ikki tomonlama chiziq */
export const OrDivider = ({ label }: { label: string }) => (
  <View style={styles.divider}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{label.toUpperCase()}</Text>
    <View style={styles.dividerLine} />
  </View>
)

/** Ijtimoiy tugma katakchasi (Telegram) */
export const SocialTile = ({
  children,
  onPress,
  disabled,
  style,
}: {
  children: React.ReactNode
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.social,
      style,
      pressed && !disabled && { transform: [{ scale: 0.98 }] },
      disabled && { opacity: 0.55 },
    ]}
  >
    {children}
  </Pressable>
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
  limeText: { ...T.h3, fontSize: 16, fontWeight: '600', color: C.inkOnLime },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E9DD',
  },
  fieldInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: 15,
    fontWeight: '500',
    color: C.ink,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.line },
  dividerText: { ...T.tiny, color: C.ink4 },
  social: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E9DD',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
  },
})
