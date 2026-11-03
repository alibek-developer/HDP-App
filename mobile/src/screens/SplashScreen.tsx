import { Image, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { PopIn, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg, SoftButton } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { C, R, T } from '../theme/tokens'
import type { RootStackParamList } from '../navigation/types'

const PHOTOS = [
  require('../assets/student-left.webp'),
  require('../assets/student-center.webp'),
  require('../assets/student-right.webp'),
]

/**
 * 1-qadam: Ilova ochilganda.
 * Avtomatik o'tish YO'Q — foydalanuvchi ikki yo'ldan birini tanlaydi.
 */
const SplashScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) => {
  const insets = useSafeAreaInsets()

  const go = (screen: 'SignUp' | 'Login') => {
    triggerHaptic('medium')
    navigation.navigate(screen)
  }

  return (
    <View style={styles.root}>
      <ScreenBg />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Wordmark size={25} style={styles.wordmarkCenter} />
      </View>

      <Reveal delay={0} y={20} duration={260} style={styles.photos}>
        <View style={styles.sideFrame}>
          <Image source={PHOTOS[0]} style={styles.sideImage} resizeMode="cover" />
        </View>
        <View style={styles.centerFrame}>
          <Image source={PHOTOS[1]} style={styles.centerImage} resizeMode="cover" />
        </View>
        <View style={styles.sideFrame}>
          <Image source={PHOTOS[2]} style={styles.sideImage} resizeMode="cover" />
        </View>
      </Reveal>

      <PopIn delay={60} style={styles.markRow}>
        <BrandMark size={68} hero />
      </PopIn>

      <View style={styles.dots}>
        <View style={[styles.dot, { opacity: 0.8 }]} />
        <View style={[styles.dot, { opacity: 0.2 }]} />
      </View>

      <View style={styles.copy}>
        <Reveal delay={90} y={16} duration={260}>
          <Text style={styles.title}>
            <Text style={{ color: C.ink4, fontWeight: '400' }}>Sizning </Text>
            <Text style={{ color: C.ink, fontWeight: '800' }}>shaxsiy</Text>
            {'\n'}
            <Text style={{ color: C.ink4, fontWeight: '400' }}>matematika </Text>
            <Text style={{ color: C.ink, fontWeight: '800' }}>ustozingiz</Text>
          </Text>
        </Reveal>
        <Reveal delay={110} y={12} duration={240}>
          <Text style={styles.sub}>
            Video dars, misol va test — bittasi ikkinchisiga olib kiradigan izchil yo'l.
          </Text>
        </Reveal>
      </View>

      <Reveal delay={140} y={16} duration={240} style={styles.actions}>
        <LimeButton label="Boshlash" onPress={() => go('SignUp')} />
        <SoftButton label="Kirish" onPress={() => go('Login')} style={styles.kirish} />
      </Reveal>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas, overflow: 'hidden' },
  header: { alignItems: 'center' },
  wordmarkCenter: { alignItems: 'center' },
  photos: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  sideFrame: {
    width: 96,
    height: 122,
    borderRadius: R.xl,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    ...{ shadowColor: '#1C3214', shadowOpacity: 0.14, shadowRadius: 13, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  },
  sideImage: { width: '100%', height: '100%' },
  centerFrame: {
    width: 140,
    height: 170,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginHorizontal: -16,
    zIndex: 10,
    ...{ shadowColor: '#1C3214', shadowOpacity: 0.22, shadowRadius: 22, shadowOffset: { width: 0, height: 18 }, elevation: 14 },
  },
  centerImage: { width: '100%', height: '100%' },
  markRow: { alignItems: 'center', marginTop: -34, zIndex: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 34, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: R.full, backgroundColor: C.inkOnLime },
  copy: { paddingHorizontal: 28 },
  title: { ...T.display, fontSize: 31, lineHeight: 36, letterSpacing: -0.99, fontWeight: '800', color: C.ink },
  sub: { ...T.bodyMd, color: C.ink3, marginTop: 12, lineHeight: 23, maxWidth: 318 },
  actions: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, marginTop: 'auto' },
  kirish: { marginTop: 12 },
})

export default SplashScreen
