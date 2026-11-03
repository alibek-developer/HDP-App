import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line } from 'react-native-svg'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { findLesson } from '../data/content'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM, TICK, shadow } from '../theme/tokens'
import {
  AMBER_BTN, AMBER_TEXT, CARD, INK_BTN, INK_TEXT, LIME_BTN, OUT_BTN, SOLVER_BODY,
} from '../theme/solver'

/**
 * 4-qadam: Video dars.
 * MUHOIM LOGIKA: «Misolga o'tish» tugmasi faqat video OXIRIGACHA
 * ko'rilgandan keyin aktiv bo'ladi.
 */

/** Demo tezligi: real dars davomiyligi ~10 soniyada tugadi hisoblanadi */
const DEMO_MS = 10000

type Nav = NativeStackNavigationProp<RootStackParamList>

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const kicker: TextStyle = {
  fontSize: 10,
  lineHeight: 13,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  fontWeight: '800',
  color: '#6B7C66',
}

const LessonScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const exit = useExit('Courses')
  const route = useRoute<RouteProp<RootStackParamList, 'Lesson'>>()
  const lesson = findLesson(Number(route.params.id))

  const lessonId = Number(route.params.id)
  const videoWatched = useApp(s => !!s.lessons[lessonId]?.videoWatched)
  const canOpenLesson = useApp(s => s.canOpenLesson)
  const markVideoWatched = useApp(s => s.markVideoWatched)
  const startLesson = useApp(s => s.startLesson)
  const beginSession = useApp(s => s.beginSession)

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(videoWatched ? 100 : 0)
  const [askOpen, setAskOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(false)
  const raf = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (lesson) {
      startLesson(lesson.id)
      beginSession()
    }
  }, [lesson, startLesson, beginSession])

  /* Simulyatsiya: play holatida progress oldinga suriladi */
  useEffect(() => {
    if (!playing || videoWatched) return undefined
    const started = Date.now()
    const base = progress
    raf.current = setInterval(() => {
      const pct = base + ((Date.now() - started) / DEMO_MS) * 100
      if (pct >= 100) {
        if (raf.current) clearInterval(raf.current)
        setProgress(100)
        setPlaying(false)
        if (lesson) markVideoWatched(lesson.id)
        triggerHaptic('success')
      } else {
        setProgress(pct)
      }
    }, 100)
    return () => {
      if (raf.current) clearInterval(raf.current)
    }
  }, [playing, videoWatched, progress, lesson, markVideoWatched])

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIconNotFound}>
            <Text style={styles.gateQuestion}>?</Text>
          </View>
          <Text style={styles.gateTitle}>Bunday dars topilmadi</Text>
          <Pressable
            onPress={exit}
            style={({ pressed }) => [styles.gateBtn, styles.inkBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={[styles.inkBtnText, INK_TEXT]}>Kurslarga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  // Zanjir qoidasi: Pro dars faqat obunachilarga
  if (!canOpenLesson(lesson.id)) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.gate}>
          <View style={styles.gateIconLock}>
            <Ionicons name="lock-closed" size={22} color="#B87A22" />
          </View>
          <Text style={styles.gateTitle}>Bu dars Pro uchun</Text>
          <Text style={styles.gateSub}>
            10 ta bepul darsni tugating yoki Pro obuna bilan barchasini oching.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Pro', { reason: 'lesson' })}
            style={({ pressed }) => [styles.gateBtn, styles.amberBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={[styles.amberBtnText, AMBER_TEXT]}>{"Pro ni ko'rish"}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const watched = videoWatched || progress >= 100
  const totalSec = lesson.duration * 60
  const cur = Math.floor((progress / 100) * totalSec)

  const togglePlay = () => {
    if (watched) return
    triggerHaptic('light')
    setPlaying(p => !p)
  }

  const toExample = () => {
    triggerHaptic('medium')
    navigation.navigate('LessonExample', { id: String(lesson.id) })
  }

  const closeAsk = () => {
    setAskOpen(false)
    setSent(false)
    setDraft('')
  }

  const chain = [
    { u: 'Video', on: watched },
    { u: 'Misol', on: false },
    { u: 'Test', on: false },
  ]

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>

          <View style={styles.headerTitle}>
            <Text style={styles.headerKicker}>
              Dars {String(lesson.id).padStart(2, '0')} · {lesson.topic}
            </Text>
            <Text style={styles.headerName} numberOfLines={1}>
              {lesson.title}
            </Text>
          </View>

          <View style={styles.headerNum}>
            <Text style={[styles.headerNumText, NUM]}>{String(lesson.id).padStart(2, '0')}</Text>
          </View>
        </View>

        {/* ── Player: siyoh varaq ── */}
        <LinearGradient
          colors={GRAD_PLAYER}
          locations={[0, 0.72, 1]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={styles.player}
        >
          <Stripes />

          <View style={styles.teacherChip}>
            <View style={[styles.teacherDot, { backgroundColor: watched ? '#9BE04B' : '#E8A33D' }]} />
            <Text style={[styles.teacherChipText, NUM]}>Ustoz Azamat</Text>
          </View>

          <View style={styles.qCountChip}>
            <Text style={[styles.qCountText, NUM]}>{lesson.questions.length} savol</Text>
          </View>

          <View style={styles.playerCenter}>
            <View style={styles.captionBox}>
              <Text style={[styles.captionText, NUM]}>
                {lesson.example.steps[0] ?? lesson.summary}
              </Text>
            </View>

            <Pressable
              onPress={togglePlay}
              accessibilityLabel={watched ? "Ko'rildi" : playing ? 'Pauza' : 'Boshlash'}
              style={({ pressed }) => [
                styles.playBtn,
                watched ? styles.playBtnWatched : styles.playBtnLime,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              {watched ? (
                <Ionicons name="checkmark" size={24} color="#9BE04B" />
              ) : playing ? (
                <Ionicons name="pause" size={22} color="#1C3214" />
              ) : (
                <Ionicons name="play" size={22} color="#1C3214" style={{ marginLeft: 2 }} />
              )}
            </Pressable>

            {watched && (
              <Text style={[styles.watchedLabel, NUM]}>Video ko&apos;rildi</Text>
            )}
          </View>

          {/* Scrubber */}
          <View style={styles.scrubTrack}>
            <View style={{ width: `${Math.min(100, progress)}%`, height: '100%', overflow: 'hidden', borderRadius: 2 }}>
              <LinearGradient colors={['#9BE04B', '#5FAF22']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={ABS_FILL} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.timeRow}>
          <Text style={[styles.timeNow, NUM]}>{fmt(cur)}</Text>
          <Text style={styles.timeHint}>{lesson.duration} daq · demo tezlashtirilgan</Text>
          <Text style={[styles.timeEnd, NUM]}>{fmt(totalSec)}</Text>
        </View>

        {/* ── Zanjir holati: Video → Misol → Test ── */}
        <View style={[CARD, styles.chain]}>
          {chain.map((cell, i) => (
            <View key={cell.u} style={styles.chainCell}>
              {i > 0 && <View style={styles.chainDiv} />}
              <View style={styles.chainInner}>
                <View style={[styles.chainBar, { backgroundColor: cell.on ? TICK.ok : '#EAEEE3' }]} />
                <Text style={[styles.chainLabel, { color: cell.on ? '#0B6E4F' : '#9AA995' }]}>{cell.u}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Mavzu haqida ── */}
        <View style={[CARD, styles.about]}>
          <View style={styles.aboutRail} />
          <View style={styles.aboutBody}>
            <Text style={kicker}>Mavzu haqida</Text>
            <Text style={styles.aboutText}>{lesson.summary}</Text>
          </View>
        </View>

        {/* ── Ustozga savol ── */}
        <Pressable
          onPress={() => {
            triggerHaptic('light')
            setAskOpen(true)
          }}
          style={({ pressed }) => [CARD, styles.askRow, pressed && { transform: [{ scale: 0.99 }] }]}
        >
          <View style={styles.askIcon}>
            <Ionicons name="chatbubble-outline" size={17} color="#0B6E4F" />
          </View>
          <View style={styles.askBody}>
            <Text style={styles.askTitle}>Ustozga savol berish</Text>
            <Text style={styles.askSub}>Tushunmagan joyingizni yozing — javob qaytaramiz</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9AA995" />
        </Pressable>

        {/* ── Gated CTA — video tugagachina aktiv ── */}
        <Pressable
          disabled={!watched}
          onPress={toExample}
          style={({ pressed }) => [
            styles.cta,
            watched ? LIME_BTN : styles.ctaLocked,
            pressed && watched && { transform: [{ scale: 0.985 }] },
          ]}
        >
          {!watched && <Ionicons name="lock-closed" size={15} color="#9AA995" />}
          <Text style={[styles.ctaText, { color: watched ? '#1C3214' : '#9AA995' }]}>
            {watched ? "Misolga o'tish" : "Avval videoni oxirigacha ko'ring"}
          </Text>
          {watched && <Ionicons name="chevron-forward" size={16} color="#1C3214" />}
        </Pressable>
      </ScrollView>

      {/* ── Savol yuborish modali — faqat bosish orqali ochiladi ── */}
      <Modal visible={askOpen} transparent animationType="slide" onRequestClose={closeAsk}>
        <Pressable style={styles.backdrop} onPress={closeAsk} />
        <View style={[styles.sheet, { paddingBottom: 24 + insets.bottom }]}>
          <View style={styles.sheetHandle} />
          <Text style={kicker}>Ustozga savol</Text>
          <Text style={styles.sheetTitle}>{lesson.title}</Text>
          <Text style={[styles.sheetMeta, NUM]}>
            {lesson.topic} · dars {String(lesson.id).padStart(2, '0')}
          </Text>

          {sent ? (
            <View style={styles.sentCard}>
              <View style={styles.sentRail} />
              <View style={styles.sentBody}>
                <Text style={styles.sentTitle}>Savolingiz yuborildi</Text>
                <Text style={styles.sentSub}>Ustoz 24 soat ichida javob beradi.</Text>
              </View>
            </View>
          ) : (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              numberOfLines={4}
              placeholder="Masalan: diskriminant nima uchun manfiy bo'lsa ildiz chiqmaydi?"
              placeholderTextColor="#9AA995"
              style={styles.draft}
            />
          )}

          {!sent && (
            <Pressable
              disabled={!draft.trim()}
              onPress={() => {
                triggerHaptic('success')
                setSent(true)
              }}
              style={({ pressed }) => [
                styles.sendBtn,
                draft.trim() ? LIME_BTN : styles.ctaLocked,
                pressed && draft.trim() && { transform: [{ scale: 0.985 }] },
              ]}
            >
              <Ionicons name="send" size={15} color={draft.trim() ? '#1C3214' : '#9AA995'} />
              <Text style={[styles.sendText, { color: draft.trim() ? '#1C3214' : '#9AA995' }]}>Yuborish</Text>
            </Pressable>
          )}

          <Pressable
            onPress={closeAsk}
            style={({ pressed }) => [styles.closeBtn, OUT_BTN, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.closeText}>Yopish</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}

/** web: repeating-linear-gradient(90deg, transparent 0 22px, rgba(205,233,174,.5) 22px 23px) */
const STRIPE_GAP = 22
const STRIPE_LINE = 'rgba(205,233,174,0.5)'

const Stripes = ({ style }: { style?: ViewStyle }) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const cols = Math.ceil(size.width / STRIPE_GAP)

  return (
    <View pointerEvents="none" style={[ABS_FILL, { opacity: 0.07 }, style]} onLayout={e => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
      {size.width > 0 && (
        <Svg width={size.width} height={size.height}>
          {Array.from({ length: cols }, (_, i) => (
            <Line
              key={i}
              x1={(i + 1) * STRIPE_GAP}
              y1={0}
              x2={(i + 1) * STRIPE_GAP}
              y2={size.height}
              stroke={STRIPE_LINE}
              strokeWidth={1}
            />
          ))}
        </Svg>
      )}
    </View>
  )
}

/** web: linear-gradient(165deg, #0E1A12 0%, #123B24 72%, #164A2C 100%) */
const GRAD_PLAYER = ['#0E1A12', '#123B24', '#164A2C'] as const

const playerShadow = shadow('#0E1A12', 13, 10, 0.22)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 14 },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 12,
  },
  headerTitle: { flex: 1, minWidth: 0, alignItems: 'center', paddingTop: 2 },
  headerKicker: { fontSize: 10, lineHeight: 13, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', textAlign: 'center' },
  headerName: { fontSize: 15, lineHeight: 19, fontWeight: '800', color: C.ink, marginTop: 4, textAlign: 'center' },
  headerNum: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8F3',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 12,
  },
  headerNumText: { fontSize: 13, fontWeight: '800', color: '#33452F' },

  player: {
    borderRadius: 18,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    ...playerShadow,
  },
  teacherChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(155,224,75,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(155,224,75,0.32)',
    borderRadius: 8,
  },
  teacherDot: { width: 6, height: 6, borderRadius: 2 },
  teacherChipText: { fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800', color: '#CDE9AE' },
  qCountChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(205,233,174,0.10)',
    borderRadius: 8,
  },
  qCountText: { fontSize: 10, textTransform: 'uppercase', fontWeight: '800', color: 'rgba(205,233,174,0.65)' },

  playerCenter: { ...ABS_FILL, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, gap: 12 },
  captionBox: {
    alignSelf: 'center',
    maxWidth: 300,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14,26,18,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.18)',
    borderRadius: 10,
  },
  captionText: { fontSize: 11.5, lineHeight: 17, fontWeight: '700', color: '#CDE9AE', textAlign: 'center', fontFamily: 'monospace' },
  playBtn: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  playBtnLime: { ...LIME_BTN, width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  playBtnWatched: {
    backgroundColor: 'rgba(155,224,75,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(155,224,75,0.4)',
    borderRadius: 18,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchedLabel: { fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '800', color: '#9BE04B', marginTop: 4 },
  scrubTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: 'rgba(205,233,174,0.12)' },

  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 8, marginBottom: 16 },
  timeNow: { fontSize: 11.5, fontWeight: '800', color: '#33452F' },
  timeHint: { fontSize: 10.5, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700', color: '#9AA995' },
  timeEnd: { fontSize: 11.5, fontWeight: '800', color: '#9AA995' },

  chain: { borderRadius: 14, flexDirection: 'row', alignItems: 'stretch', paddingHorizontal: 8, paddingVertical: 10, marginBottom: 16 },
  chainCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chainDiv: { width: 1, alignSelf: 'stretch', backgroundColor: '#EDF1E7' },
  chainInner: { flex: 1, paddingHorizontal: 8 },
  chainBar: { height: 5, borderRadius: 3 },
  chainLabel: { fontSize: 10, textTransform: 'uppercase', fontWeight: '800', textAlign: 'center', marginTop: 8 },

  about: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 },
  aboutRail: { width: 4, backgroundColor: '#5FAF22' },
  aboutBody: { flex: 1, paddingLeft: 16, paddingRight: 16, paddingVertical: 16 },
  aboutText: { fontSize: 13.5, lineHeight: 22, fontWeight: '500', color: '#33452F', marginTop: 8 },

  askRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 14, paddingRight: 14, paddingVertical: 14, marginBottom: 16 },
  askIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 12 },
  askBody: { flex: 1, minWidth: 0 },
  askTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink },
  askSub: { fontSize: 11.5, lineHeight: 16, fontWeight: '600', color: '#6B7C66', marginTop: 2 },

  cta: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  ctaLocked: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  ctaText: { fontSize: 14.5, fontWeight: '800' },

  gate: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  gateIconNotFound: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 16 },
  gateQuestion: { fontSize: 22, fontWeight: '800', color: '#0B6E4F' },
  gateIconLock: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF1DC',
    borderWidth: 1,
    borderColor: '#E8A33D',
    borderRadius: 16,
  },
  gateTitle: { fontSize: 16, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: 4 },
  gateSub: { fontSize: 12.5, lineHeight: 18, textAlign: 'center', maxWidth: 260, color: '#6B7C66' },
  gateBtn: { width: '100%', maxWidth: 240, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 12, marginTop: 8 },
  inkBtn: INK_BTN,
  inkBtnText: { fontSize: 13.5, fontWeight: '800' },
  amberBtn: AMBER_BTN,
  amberBtnText: { fontSize: 14, fontWeight: '800' },

  backdrop: { ...ABS_FILL, backgroundColor: 'rgba(14,26,18,0.55)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E1E7DA', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 14, lineHeight: 19, fontWeight: '800', color: C.ink, marginTop: 6 },
  sheetMeta: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', color: '#9AA995', marginTop: 2 },
  draft: {
    marginTop: 16,
    minHeight: 104,
    padding: 14,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
    color: '#0E1A12',
    backgroundColor: '#FBFCF8',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 14,
    textAlignVertical: 'top',
  },
  sentCard: { marginTop: 16, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#DDF3DC', borderWidth: 1, borderColor: '#A7D8A0', borderRadius: 14 },
  sentRail: { width: 4, backgroundColor: '#5FAF22' },
  sentBody: { flex: 1, paddingLeft: 16, paddingRight: 16, paddingVertical: 16 },
  sentTitle: { fontSize: 13.5, fontWeight: '800', color: '#0B4A34' },
  sentSub: { fontSize: 12, lineHeight: 17, fontWeight: '500', color: '#0B6E4F', marginTop: 4 },
  sendBtn: { marginTop: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  sendText: { fontSize: 14, fontWeight: '800' },
  closeBtn: { marginTop: 10, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  closeText: { fontSize: 13.5, fontWeight: '800', color: '#33452F' },
})

export default LessonScreen
