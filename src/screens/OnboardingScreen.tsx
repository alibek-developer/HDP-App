import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { BrandMark, Wordmark } from '../components/Brand'
import { Fade, Reveal } from '../components/Reveal'
import { LimeButton, ScreenBg } from '../components/ui'
import { triggerHaptic } from '../lib/haptics'
import { DAILY_BONUS, MISSION_REWARDS, TEST_REWARD } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { C, CARD, NUM, R, T } from '../theme/tokens'

type Slide = { key: string; renderArt: () => ReactNode; title: ReactNode; sub: string }

/** Zanjir: video → misol → test */
const Chain = () => (
  <View style={styles.chain}>
    {([
      { icon: 'play' as const, label: 'Video' },
      { icon: 'bulb-outline' as const, label: 'Misol' },
      { icon: 'checkmark' as const, label: 'Test' },
    ]).map((n, i) => (
      <View key={n.label} style={styles.chainItem}>
        <View style={[styles.chainNode, i === 2 && styles.chainNodeOn]}>
          <Ionicons name={n.icon} size={13} color={i === 2 ? C.inkOnLime : C.brand} />
        </View>
        <Text style={styles.chainLabel}>{n.label}</Text>
        {i < 2 && <Ionicons name="chevron-forward" size={11} color={C.ink4} style={styles.chainArrow} />}
      </View>
    ))}
  </View>
)

const FormulaArt = () => (
  <View style={[CARD, styles.artCard]}>
    <Text style={styles.artKicker}>MATEMATIKA</Text>
    <Text style={styles.formula}>ax² + bx + c = 0</Text>
    <View style={styles.artLine} />
    <Chain />
  </View>
)

const CoinArt = () => {
  const rewards = [
    { icon: 'play-circle' as const, label: 'Dars testi', coin: TEST_REWARD.coin },
    { icon: 'flame' as const, label: 'Kunlik masala', coin: DAILY_BONUS.coin },
    { icon: 'checkmark-done' as const, label: '5 ta masala', coin: MISSION_REWARDS.solve5 },
  ]
  return (
    <View style={[CARD, styles.artCard]}>
      <View style={styles.rewardHead}>
        <View style={styles.rewardCoin}>
          <Ionicons name="cash" size={17} color={C.coin} />
        </View>
        <View style={styles.rewardHeadText}>
          <Text style={styles.artKicker}>COIN JAMG'ARMA</Text>
          <Text style={styles.rewardTitle}>Har harakat uchun coin</Text>
        </View>
      </View>

      <View style={styles.rewardList}>
        {rewards.map(r => (
          <View key={r.label} style={styles.rewardRow}>
            <View style={styles.rewardIcon}>
              <Ionicons name={r.icon} size={14} color={C.brand} />
            </View>
            <Text style={styles.rewardLabel}>{r.label}</Text>
            <View style={styles.rewardValue}>
              <Text style={[styles.rewardValueText, NUM]}>+{r.coin}</Text>
              <Text style={styles.rewardUnit}>coin</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.rewardFoot}>
        <Ionicons name="gift" size={15} color={C.limeDeep} />
        <Text style={styles.rewardFootText}>
          Coinlarni do'konda haqiqiy sovg'alarga almashtirasiz
        </Text>
      </View>
    </View>
  )
}

const SLIDES: Slide[] = [
  {
    key: 'path',
    renderArt: () => <FormulaArt />,
    title: (
      <>
        <Text style={{ color: C.ink4, fontWeight: '400' }}>Matematika </Text>
        <Text style={{ color: C.ink, fontWeight: '800' }}>cho'qqilarini{'\n'}zabt et</Text>
      </>
    ),
    sub: "Video dars, misol va test — biri ikkinchisiga olib kiradigan izchil yo'l.",
  },
  {
    key: 'coins',
    renderArt: () => <CoinArt />,
    title: (
      <>
        <Text style={{ color: C.ink4, fontWeight: '400' }}>O'rgan — </Text>
        <Text style={{ color: C.ink, fontWeight: '800' }}>coin yig',{'\n'}sovg'a ol</Text>
      </>
    ),
    sub: "Har dars va har test uchun coin beriladi. Coinlarni do'konda sovg'alarga almashtiring.",
  },
]

const OnboardingScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) => {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const list = useRef<FlatList<Slide>>(null)
  const [index, setIndex] = useState(0)
  const last = index === SLIDES.length - 1

  const goLogin = () => {
    triggerHaptic('light')
    navigation.replace('Login')
  }

  const next = () => {
    if (last) {
      goLogin()
      return
    }
    triggerHaptic('medium')
    list.current?.scrollToIndex({ index: index + 1, animated: true })
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width)
    if (i !== index && i >= 0 && i < SLIDES.length) setIndex(i)
  }

  return (
    <Fade>
      <View style={styles.root}>
        <ScreenBg />

        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <View style={styles.brandRow}>
            <BrandMark size={34} />
            <Wordmark size={22} />
          </View>
          <Pressable onPress={goLogin} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <Text style={styles.skip}>O&apos;tkazib yuborish</Text>
          </Pressable>
        </View>

        <FlatList
          ref={list}
          data={SLIDES}
          keyExtractor={s => s.key}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          style={styles.list}
          renderItem={({ item, index: i }) => (
            <View style={[styles.slide, { width }]}>
              <Reveal key={`art-${item.key}-${index === i}`} y={26} duration={460} style={styles.art}>
                {item.renderArt()}
              </Reveal>
              <Reveal key={`title-${item.key}-${index === i}`} y={18} delay={90} duration={400}>
                <Text style={styles.title}>{item.title}</Text>
              </Reveal>
              <Reveal key={`sub-${item.key}-${index === i}`} y={14} delay={160} duration={380}>
                <Text style={styles.sub}>{item.sub}</Text>
              </Reveal>
            </View>
          )}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.dots}>
            {SLIDES.map((s, i) => (
              <View key={s.key} style={[styles.dot, i === index && styles.dotOn]} />
            ))}
          </View>
          <LimeButton label={last ? 'Boshlash' : 'Keyingi'} onPress={next} />
        </View>
      </View>
    </Fade>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  skip: { ...T.bodySm, fontWeight: '700', color: C.ink4 },
  slide: { flex: 1, paddingHorizontal: 24, paddingTop: 4 },
  list: { flex: 1 },
  art: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 240 },
  artCard: { width: '100%', maxWidth: 340, padding: 22, borderRadius: R.xl },
  artKicker: { ...T.tiny, color: C.limeDeep, letterSpacing: 1.1 },
  formula: {
    marginTop: 10,
    fontFamily: 'Georgia',
    fontSize: 32,
    letterSpacing: -0.4,
    color: C.brandDeep,
  },
  artLine: { height: 1, backgroundColor: C.lineSoft, marginVertical: 18 },
  chain: { flexDirection: 'row', alignItems: 'center' },
  chainItem: { flex: 1, alignItems: 'center', position: 'relative' },
  chainNode: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.leafTint,
    borderWidth: 1,
    borderColor: '#DDEBD6',
  },
  chainNodeOn: { backgroundColor: C.limeBright, borderColor: '#8BD63F' },
  chainLabel: { marginTop: 7, fontSize: 11, fontWeight: '700', color: C.ink3 },
  chainArrow: { position: 'absolute', right: -6, top: 11 },
  rewardHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  rewardHeadText: { flex: 1, minWidth: 0 },
  rewardCoin: {
    width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.coinSoft, borderWidth: 1, borderColor: '#F3E2C4',
  },
  rewardTitle: { marginTop: 3, fontSize: 14.5, fontWeight: '800', color: C.ink },
  rewardList: {
    marginTop: 16, borderTopWidth: 1, borderTopColor: C.lineSoft,
  },
  rewardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.lineSoft,
  },
  rewardIcon: {
    width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.leafTint, borderWidth: 1, borderColor: '#DDEBD6',
  },
  rewardLabel: { flex: 1, fontSize: 12.5, fontWeight: '700', color: C.ink2 },
  rewardValue: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  rewardValueText: { fontSize: 15, fontWeight: '800', color: C.limeDeep },
  rewardUnit: { fontSize: 10.5, fontWeight: '700', color: C.ink4 },
  rewardFoot: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14,
    padding: 11, borderRadius: R.sm, backgroundColor: C.surface2,
    borderWidth: 1, borderColor: C.lineSoft,
  },
  rewardFootText: { flex: 1, fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: C.ink3 },
  title: { ...T.h1, marginTop: 22, textAlign: 'center', color: C.ink },
  sub: { ...T.bodyMd, marginTop: 10, marginHorizontal: 12, textAlign: 'center', lineHeight: 21, color: C.ink3 },
  footer: { paddingHorizontal: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginBottom: 18 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#C9D3C3' },
  dotOn: { width: 22, backgroundColor: C.limeDeep },
})

export default OnboardingScreen
