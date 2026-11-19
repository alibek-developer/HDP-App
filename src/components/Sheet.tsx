import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { triggerHaptic } from '../lib/haptics'
import { Reveal } from './Reveal'
import { ABS_FILL, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'

/**
 * Pastdan ochiladigan oq varaqa — do'konning standart «raskop» holati.
 * Web'dagi `Sheet`ning RN ekvivalenti: scrim bosilsa yopiladi, kontent
 * ScrollView ichida (maksimal balandlik ekranning 80 %i).
 */
const Sheet = ({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}) => {
  const C = useColors()
  const sh = makeSh(C)
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      {open && (
        <View style={sh.root}>
          <Pressable onPress={onClose} style={[ABS_FILL, sh.backdrop]} />
          <Reveal y={40} duration={260} style={sh.outer}>
            <View style={[sh.sheet, { paddingBottom: insets.bottom + 20 }]}>
              <View style={sh.handle} />
              <View style={sh.headRow}>
                <View style={sh.headText}>
                  <Text style={sh.title}>{title}</Text>
                  {!!subtitle && <Text style={sh.subtitle}>{subtitle}</Text>}
                </View>
                <Pressable
                  onPress={() => { triggerHaptic('light'); onClose() }}
                  hitSlop={10}
                  accessibilityLabel="Yopish"
                  style={({ pressed }) => [sh.closeBtn, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons name="close" size={17} color={C.ink3} />
                </Pressable>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={sh.body}>
                {children}
              </ScrollView>
            </View>
          </Reveal>
        </View>
      )}
    </Modal>
  )
}


const makeSh = (C: ThemeColors) => StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: 'rgba(14,26,18,0.55)' },
  outer: { width: '100%', maxWidth: 430, alignSelf: 'center' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 12,
    maxHeight: 560,
  },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: C.line, alignSelf: 'center', marginBottom: 12 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 },
  headText: { flex: 1, minWidth: 0, paddingRight: 8 },
  title: { fontSize: 11, fontWeight: '600', letterSpacing: 1.4, color: C.ink3 },
  subtitle: { marginTop: 4, fontSize: 12.5, color: C.ink3 },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  body: { flexGrow: 0 },
})

export default Sheet
