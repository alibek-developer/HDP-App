import { useEffect, useRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Reveal } from '../components/Reveal'
import { navBottomSpace } from '../components/BottomNav'
import { C, R, shadow } from '../theme/tokens'

/**
 * HomeScreen Pro — Pinterest/Dribbble minimal uslubida.
 * 
 * Design principles:
 * - Clean white background (#FFFFFF)
 * - Generous whitespace (8-point grid)
 * - Subtle shadows (no harsh glows)
 * - PRO badge with subtle star shimmer animation
 * - Streak row with clear states (done, today, future)
 * - Consistent card radius (16px)
 * - Typography hierarchy (bold headers, light meta)
 */

const WeekLabels = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

/** PRO badge'ga subtle star shimmer animation */
const ProBadge = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current
  const starAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Shimmer effect
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    )
    shimmerLoop.start()

    // Star pulse
    const starLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    starLoop.start()

    return () => {
      shimmerLoop.stop()
      starLoop.stop()
    }
  }, [])

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  })

  const starScale = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  })

  const starRotate = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  })

  return (
    <View style={styles.proBadgeWrap}>
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FFD700']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.proBadge}
      >
        {/* Shimmer overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.proShimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Animated star */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.proStar,
            {
              transform: [
                { scale: starScale },
                { rotate: starRotate },
              ],
            },
          ]}
        >
          <Ionicons name="star" size={14} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.proText}>PRO</Text>
      </LinearGradient>
    </View>
  )
}

/** Streak row — 7 days with clear states */
const StreakRow = () => {
  const todayIdx = 2 // Simulated: Wednesday (Pa)
  const streakData = [
    { done: true }, // Du
    { done: true }, // Se
    { done: false, today: true }, // Ch (today)
    { done: false }, // Pa
    { done: false }, // Ju
    { done: false }, // Sh
    { done: false }, // Ya
  ]

  return (
    <View style={styles.streakWrap}>
      <View style={styles.streakHeader}>
        <View style={styles.streakScore}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.streakScoreText}>698</Text>
        </View>
        <Text style={styles.streakLabel}>Kunlik seriya</Text>
      </View>

      <View style={styles.streakRow}>
        {streakData.map((day, i) => (
          <View key={i} style={styles.streakDay}>
            <View
              style={[
                styles.streakDot,
                day.done && styles.streakDotDone,
                day.today && styles.streakDotToday,
              ]}
            >
              {day.done ? (
                <Ionicons name="close" size={10} color="#E74C3C" />
              ) : day.today ? (
                <View style={styles.streakDotInner} />
              ) : null}
            </View>
            <Text style={[styles.streakDayLabel, day.today && styles.streakDayLabelToday]}>
              {WeekLabels[i]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.streakFooter}>
        <Text style={styles.streakBroken}>Streak uzildi</Text>
        <Pressable style={styles.streakRestart}>
          <Text style={styles.streakRestartText}>Qayta boshlang</Text>
        </Pressable>
      </View>
    </View>
  )
}

const HomeScreenPro = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: navBottomSpace(insets.bottom) },
        ]}
      >
        {/* ── Header ── */}
        <Reveal y={10} duration={320}>
          <View style={styles.header}>
            {/* Language selector */}
            <Pressable style={styles.langSelector}>
              <View style={styles.langFlag}>
                <Text style={styles.langFlagText}>🇬🇧</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color={C.ink3} />
            </Pressable>

            {/* PRO badge */}
            <ProBadge />

            {/* Score */}
            <View style={styles.scoreWrap}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.scoreText}>698</Text>
            </View>
          </View>
        </Reveal>

        {/* ── Streak row ── */}
        <Reveal delay={40} y={14} duration={380}>
          <StreakRow />
        </Reveal>

        {/* ── User avatar card ── */}
        <Reveal delay={70} y={14} duration={380}>
          <View style={styles.avatarCard}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color={C.ink3} />
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>60</Text>
            </View>
          </View>
        </Reveal>

        {/* ── Courses section ── */}
        <Reveal delay={100} y={14} duration={380}>
          <View style={styles.coursesRow}>
            <Pressable style={styles.courseCard}>
              <View style={[styles.courseIcon, { backgroundColor: '#E8EAF6' }]}>
                <Ionicons name="book" size={20} color="#5C6BC0" />
              </View>
              <Text style={styles.courseTitle}>Bepul kurslar</Text>
              <Ionicons name="chevron-forward" size={16} color={C.ink3} />
            </Pressable>

            <Pressable style={styles.courseCard}>
              <View style={[styles.courseIcon, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="ribbon" size={20} color="#FFA000" />
              </View>
              <Text style={styles.courseTitle}>Pro kurslar</Text>
              <Ionicons name="chevron-forward" size={16} color={C.ink3} />
            </Pressable>
          </View>
        </Reveal>

        {/* ── Missions section ── */}
        <Reveal delay={130} y={14} duration={380}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missiyalar</Text>
            <Pressable>
              <Text style={styles.sectionMore}>Barchasi &gt;</Text>
            </Pressable>
          </View>

          <Pressable style={styles.missionCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' }}
              style={styles.missionImage}
              resizeMode="cover"
            />
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
              style={styles.missionVeil}
            />
            <View style={styles.missionContent}>
              <View style={styles.missionLogo}>
                <Text style={styles.missionLogoText}>IELTS™</Text>
              </View>
              <Text style={styles.missionTitle} numberOfLines={2}>
                Why Learners Stop at Band 5.0 and How to Fix It
              </Text>
              <Text style={styles.missionSubtitle}>
                1 The Six Habits of Band 5.0
              </Text>
            </View>
            <View style={styles.missionDots}>
              <View style={[styles.missionDot, styles.missionDotActive]} />
              <View style={styles.missionDot} />
              <View style={styles.missionDot} />
            </View>
          </Pressable>
        </Reveal>

        {/* ── Feature cards grid ── */}
        <Reveal delay={160} y={14} duration={380}>
          <View style={styles.featureGrid}>
            <Pressable style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#FCE4EC' }]}>
                <Ionicons name="chatbubble" size={22} color="#EC407A" />
              </View>
              <Text style={styles.featureTitle}>Speaking</Text>
            </Pressable>

            <Pressable style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="book" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>Kutubxona</Text>
            </Pressable>

            <Pressable style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.featureIconText}>Aa</Text>
              </View>
              <Text style={styles.featureTitle}>Lug'at</Text>
            </Pressable>

            <Pressable style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="checkbox" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.featureTitle}>Ro'yxat</Text>
            </Pressable>

            <Pressable style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.featureIconText}>2+6</Text>
              </View>
              <Text style={styles.featureTitle}>Raqamlar</Text>
            </Pressable>
          </View>
        </Reveal>
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.navItem}>
          <Ionicons name="home" size={22} color="#FF6B35" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Asosiy</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="book-outline" size={22} color={C.ink3} />
          <Text style={styles.navLabel}>O'rganish</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="flag-outline" size={22} color={C.ink3} />
          <Text style={styles.navLabel}>Missiya</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="game-controller-outline" size={22} color={C.ink3} />
          <Text style={styles.navLabel}>O'yinlar</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="person-outline" size={22} color={C.ink3} />
          <Text style={styles.navLabel}>Profil</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16 },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  langFlag: {
    width: 24,
    height: 18,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  langFlagText: { fontSize: 12 },

  /* ── PRO badge ── */
  proBadgeWrap: {},
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadow('#FFA500', 12, 4, 0.3),
  },
  proShimmer: {
    position: 'absolute',
    left: -30,
    top: 0,
    bottom: 0,
    width: 60,
  },
  proStar: {
    position: 'absolute',
    right: -6,
    top: -4,
  },
  proText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },

  /* ── Score ── */
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
  },

  /* ── Streak row ── */
  streakWrap: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakScoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.ink3,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakDay: {
    alignItems: 'center',
    gap: 6,
  },
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  streakDotDone: {
    backgroundColor: '#FFF',
    borderColor: '#E74C3C',
  },
  streakDotToday: {
    backgroundColor: '#FFF',
    borderColor: '#4CAF50',
  },
  streakDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  streakDayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: C.ink3,
  },
  streakDayLabelToday: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  streakFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  streakBroken: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E74C3C',
  },
  streakRestart: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
  },
  streakRestartText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },

  /* ── Avatar card ── */
  avatarCard: {
    marginTop: 16,
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...shadow(C.ink, 8, 2, 0.08),
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
  },
  avatarBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },

  /* ── Courses row ── */
  coursesRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  courseCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...shadow(C.ink, 8, 2, 0.06),
  },
  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
  },

  /* ── Section header ── */
  sectionHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.ink,
  },
  sectionMore: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF6B35',
  },

  /* ── Mission card ── */
  missionCard: {
    marginTop: 12,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadow(C.ink, 12, 4, 0.1),
  },
  missionImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  missionVeil: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  missionContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  missionLogo: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  missionLogoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  missionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  missionDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  missionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  missionDotActive: {
    backgroundColor: '#FFF',
    width: 18,
  },

  /* ── Feature grid ── */
  featureGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: 0,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    gap: 10,
    ...shadow(C.ink, 8, 2, 0.06),
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
  },

  /* ── Bottom nav ── */
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: C.ink3,
  },
  navLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
})

export default HomeScreenPro
