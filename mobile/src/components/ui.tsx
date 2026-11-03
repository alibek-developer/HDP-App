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

/** Ikkilamachi tanlov — och kulcha fon, siyoh yozuv */
export const SoftButton = ({ label, onPress, height = 56, style }: BtnProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.soft,
      { height },
      pressed && { transform: [{ scale: 0.985 }] },
      style,
    ]}
  >
    <Text style={styles.softText}>{label}</Text>
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

/** Ijtimoiy tugma katakchasi (Telegram/Google) — tepada «Tez orada» belgisi */
export const SocialTile = ({
  children,
  onPress,
  soon,
  disabled,
  dashed,
}: {
  children: React.ReactNode
  onPress: () => void
  soon?: boolean
  disabled?: boolean
  dashed?: boolean
}) => (
  <View style={styles.socialWrap}>
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.social,
        dashed && { borderStyle: 'dashed', borderColor: '#C6D0BE' },
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.55 },
      ]}
    >
      {children}
    </Pressable>
    {soon && (
      <View style={styles.soon}>
        <Text style={styles.soonText}>TEZ ORADA</Text>
      </View>
    )}
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
  <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
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
  limeText: { ...T.h3, fontSize: 16, fontWeight: '800', color: C.inkOnLime },
  soft: {
    borderRadius: R.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F4EC',
    borderWidth: 1,
    borderColor: '#E4E9DD',
  },
  softText: { fontSize: 16, fontWeight: '700', color: C.ink },
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
    fontSize: 15,
    fontWeight: '600',
    color: C.ink,
    paddingVertical: 0,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.line },
  dividerText: { ...T.tiny, color: C.ink4 },
  socialWrap: { flex: 1 },
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
  soon: {
    position: 'absolute',
    top: -8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFF3D6',
    borderColor: '#F0DCA5',
    borderWidth: 1,
    borderRadius: R.full,
    zIndex: 2,
  },
  soonText: { fontSize: 9.5, fontWeight: '900', letterSpacing: 0.7, color: '#8A6116' },
})
