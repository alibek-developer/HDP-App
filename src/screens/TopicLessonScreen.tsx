import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TOPIC_LESSON_REWARD, useApp } from '../store/useStore'
import { findTopicByLesson, findTopicLesson } from '../data/curriculum'
import type { Stack } from '../data/topicTypes'
import { triggerHaptic } from '../lib/haptics'
import { useExit } from '../lib/nav'
import { LessonVideo } from '../components/LessonVideo'
import { Reveal } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { C, NUM } from '../theme/tokens'
import { CARD, GRAD_RAIL, INK_BTN, LIME_BTN, SOLVER_BODY } from '../theme/solver'

/**
 * Mavzu bo'limi — video dars + nazariya + misol + «o'zingizni sinab ko'ring».
 * Zanjir: dars 95% ko'rilmasa bo'lim yakunlanmaydi; test faqat barcha
 * bo'limlar tugagach ochiladi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const LABEL_STYLE: Record<string, { bg: string; fg: string }> = {
  "TA'RIF": { bg: '#DDF3DC', fg: '#0B6E4F' },
  "MA'LUMOT": { bg: '#E5ECFE', fg: '#3560C4' },
  MASALAN: { bg: '#FCF1DC', fg: '#B87A22' },
  ESLATISH: { bg: '#F1F4EE', fg: '#33452F' },
  SAVOL: { bg: '#EDF7DE', fg: '#5FAF22' },
  YECHISH: { bg: '#EFF2EC', fg: '#6B7C66' },
  MAQSAD: { bg: '#DDF3DC', fg: '#0B6E4F' },
  XULOSA: { bg: '#E5ECFE', fg: '#3560C4' },
}

const labelStyle = (kind: string) => LABEL_STYLE[kind] ?? LABEL_STYLE.ESLATISH

const kicker: TextStyle = {
  fontSize: 10,
  lineHeight: 13,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  fontWeight: '800',
  color: '#6B7C66',
}

/** Ustun shaklidagi hisob: 8567 / +1129 / 9696 */
const StackView = ({ op, rows, result, dark }: Stack & { dark?: boolean }) => {
  const width = Math.max(...rows.map(r => r.length), result.length) + 1
  return (
    <View style={[styles.stack, dark ? styles.stackDark : null]}>
      {rows.map((r, i) => (
        <Text key={i} style={[styles.stackRow, NUM, dark ? styles.stackRowDark : null]}>
          {i === 0 ? r : `${op === '+' || op === '−' ? `${op} ` : ''}${r}`}
        </Text>
      ))}
      <Text style={[styles.stackRule, NUM, dark ? styles.stackRuleDark : { color: '#9AA995' }]}>{'─'.repeat(width)}</Text>
      <Text style={[styles.stackResult, NUM, dark ? { color: '#9BE04B' } : { color: '#0B6E4F' }]}>{result}</Text>
    </View>
  )
}

const TopicLessonScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'TopicLesson'>>()
  const lesson = findTopicLesson(route.params.lessonId)
  const topic = findTopicByLesson(route.params.lessonId)
  const topicNum = topic?.meta.num ?? 1
  const exit = useExit('Topic', topicNum)

  const stateOf = useApp(s => s.topicLessonState)
  const markVideoSeen = useApp(s => s.markTopicVideoSeen)
  const complete = useApp(s => s.completeTopicLesson)
  const beginSession = useApp(s => s.beginSession)

  /** Har bir videoni 95% ko'rish holati — shu mount ichida yashaydi,
   *  store'ga faqat barcha videolar tugagach yoziladi */
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [unavailable, setUnavailable] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState<number[]>([])
  const [openEx, setOpenEx] = useState<number[]>([])
  const lessons = topic?.lessons ?? []
  const idx = lessons.findIndex(l => l.id === route.params.lessonId)
  const nextId = idx >= 0 ? lessons[idx + 1]?.id : undefined

  useEffect(() => {
    beginSession()
  }, [beginSession])

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missing}>
          <Pressable onPress={exit} style={({ pressed }) => [CARD, styles.missingBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.missingText}>Mavzuga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const st = stateOf(lesson.id)
  /** Ochilmagan (bloklangan) video bo'lim sharti hisoblanmaydi — aks holda
   *  o'quvchi tashqi sabab bilan bo'limni tuza olmaydi */
  const watchable = lesson.videos.filter(v => !unavailable[v.id])
  const needsVideo = watchable.length > 0
  const canFinish = !needsVideo || st.videoSeen || st.done

  const markWatched = (videoId: string) => {
    const next = { ...seen, [videoId]: true }
    setSeen(next)
    if (!st.videoSeen && watchable.every(v => next[v.id])) markVideoSeen(lesson.id)
  }

  const markUnavailable = (videoId: string) =>
    setUnavailable(prev => (prev[videoId] ? prev : { ...prev, [videoId]: true }))

  /** Bo'limdan bo'limga o'tish — tarixni o'stirmaymiz */
  const goNext = () => {
    if (nextId) navigation.replace('TopicLesson', { lessonId: nextId })
    else navigation.replace('TopicTest', { topicNum })
  }

  const finish = () => {
    if (st.done) {
      goNext()
      return
    }
    if (!canFinish) {
      triggerHaptic('warning')
      return
    }
    triggerHaptic('success')
    complete(lesson.id)
    goNext()
  }

  const toggle = (i: number) => {
    triggerHaptic('selection')
    setOpen(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))
  }

  const toggleEx = (i: number) => {
    triggerHaptic('selection')
    setOpenEx(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Sarlavha ── */}
        <View style={styles.header}>
          <Pressable
            onPress={exit}
            accessibilityLabel="Orqaga"
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={kicker}>{st.done ? "Bo'lim yakunlangan" : `Bo'lim ${lesson.id}`}</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {lesson.title}
            </Text>
          </View>
        </View>

        {/* ── Maqsad ── */}
        <View style={[CARD, styles.goal]}>
          <Ionicons name="compass" size={15} color="#5FAF22" style={styles.goalIcon} />
          <Text style={styles.goalText}>{lesson.goal}</Text>
        </View>

        {/* ── Video dars ── */}
        {lesson.videos.map(v => (
          <View key={v.id} style={styles.videoWrap}>
            <LessonVideo
              videoId={v.id}
              title={v.title}
              watched={st.videoSeen || Boolean(seen[v.id])}
              onWatched={() => markWatched(v.id)}
              onUnavailable={() => markUnavailable(v.id)}
            />
          </View>
        ))}

        {lesson.videoOnly && (
          <Text style={styles.videoOnlyNote}>Bu bo&apos;limning nazariy qismi video darsda berilgan.</Text>
        )}

        {/* ── Nazariya ── */}
        {lesson.theory.map((b, i) => {
          const tone = labelStyle(b.kind)
          return (
            <Reveal key={i} delay={i * 40}>
              <View style={[CARD, styles.block]}>
                <View style={[styles.blockRail, { backgroundColor: tone.fg }]} />
                <View style={styles.blockBody}>
                  <View style={[styles.tag, { backgroundColor: tone.bg }]}>
                    <Text style={[styles.tagText, { color: tone.fg }]}>{b.kind}</Text>
                  </View>
                  <Text style={styles.blockText}>{b.text}</Text>
                </View>
              </View>
            </Reveal>
          )
        })}

        {/* ── Ro'yxatli bo'limlar ── */}
        {lesson.lists?.map((l, li) => (
          <View key={li} style={[CARD, styles.listCard]}>
            <Text style={styles.listCaption}>{l.caption}</Text>
            {l.items.map((it, i) => (
              <View key={i} style={[styles.listItem, i > 0 ? styles.divided : null]}>
                <View style={styles.listNum}>
                  <Text style={[styles.listNumText, NUM]}>{i + 1}</Text>
                </View>
                <Text style={styles.listItemText}>{it}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* ── Xossalar ── */}
        {lesson.properties && (
          <View style={[CARD, styles.props]}>
            <Text style={styles.propsHead}>Amal xossalari</Text>
            {lesson.properties.map((p, i) => (
              <View key={p.name} style={[styles.propRow, i > 0 ? styles.divided : null]}>
                <View style={styles.propTop}>
                  <Text style={[styles.propName, NUM]}>{p.name}</Text>
                  <Text style={styles.propDetail}>{p.detail}</Text>
                </View>
                <Text style={[styles.propExample, NUM]}>{p.example}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Yechilgan misol ── */}
        {lesson.example && (
          <View style={styles.example}>
            <LinearGradient colors={GRAD_RAIL} style={styles.exampleRail} />
            <View style={styles.exampleBody}>
              <Text style={[kicker, { color: '#9BE04B' }]}>Yechilgan misol</Text>
              <Text style={styles.examplePrompt}>{lesson.example.prompt}</Text>

              {lesson.example.stack && (
                <View style={styles.stackBox}>
                  <StackView
                    op={lesson.example.stack.op}
                    rows={lesson.example.stack.rows}
                    result={lesson.example.stack.result}
                    dark
                  />
                </View>
              )}

              {lesson.example.steps && (
                <View style={styles.steps}>
                  {lesson.example.steps.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                      <Text style={[styles.stepNum, NUM]}>{i + 1})</Text>
                      <Text style={styles.stepText}>{s}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Javob</Text>
                <Text style={[styles.answerValue, NUM]}>{lesson.example.answer}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── O'zingizni sinab ko'ring ── */}
        {lesson.practice.length > 0 && (
          <View style={styles.practiceSection}>
            <View style={styles.practiceHead}>
              <Text style={styles.practiceTitle}>O&apos;zingizni sinab ko&apos;ring</Text>
              <Text style={[styles.practiceCount, NUM]}>{lesson.practice.length} ta</Text>
            </View>

            <View style={styles.practiceList}>
              {lesson.practice.map((p, i) => {
                const shown = open.includes(i)
                return (
                  <View key={i} style={[CARD, styles.practiceCard]}>
                    <Text style={styles.practicePrompt}>{p.prompt}</Text>

                    {shown && (
                      <View style={styles.solution}>
                        <View style={styles.solutionRail} />
                        <View style={styles.solutionBody}>
                          {p.stack && <StackView op={p.stack.op} rows={p.stack.rows} result={p.stack.result} />}
                          {p.steps?.map((s, si) => (
                            <Text key={si} style={styles.solutionStep}>
                              {p.steps!.length > 1 ? `${si + 1}) ` : ''}
                              {s}
                            </Text>
                          ))}
                          <Text style={[styles.solutionAnswer, NUM]}>Javob: {p.answer}</Text>
                        </View>
                      </View>
                    )}

                    <Pressable
                      onPress={() => toggle(i)}
                      style={({ pressed }) => [styles.toggleBtn, pressed && { opacity: 0.7 }]}
                    >
                      <Ionicons
                        name={shown ? 'close' : 'checkmark'}
                        size={13}
                        color={shown ? '#6B7C66' : '#0B6E4F'}
                      />
                      <Text style={[styles.toggleText, { color: shown ? '#6B7C66' : '#0B6E4F' }]}>
                        {shown ? 'Yechimni yashirish' : "Yechimni ko'rish"}
                      </Text>
                    </Pressable>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* ── Amaliy mashqlar ── */}
        {lesson.exercises && lesson.exercises.length > 0 && (
          <View style={styles.practiceSection}>
            <View style={styles.practiceHead}>
              <Text style={styles.practiceTitle}>Amaliy mashqlar</Text>
              <Text style={[styles.practiceCount, NUM]}>{lesson.exercises.length} ta</Text>
            </View>

            <View style={styles.practiceList}>
              {lesson.exercises.map((p, i) => {
                const shown = openEx.includes(i)
                const revealable = !!p.answer || !!p.steps?.length
                return (
                  <View key={i} style={[CARD, styles.practiceCard]}>
                    <Text style={styles.practicePrompt}>{p.prompt}</Text>

                    {shown && (
                      <View style={styles.solution}>
                        <View style={styles.solutionRail} />
                        <View style={styles.solutionBody}>
                          {p.steps?.map((s, si) => (
                            <Text key={si} style={styles.solutionStep}>
                              {p.steps!.length > 1 ? `${si + 1}) ` : ''}
                              {s}
                            </Text>
                          ))}
                          {!!p.answer && <Text style={[styles.solutionAnswer, NUM]}>Javob: {p.answer}</Text>}
                        </View>
                      </View>
                    )}

                    {revealable && (
                      <Pressable
                        onPress={() => toggleEx(i)}
                        style={({ pressed }) => [styles.toggleBtn, pressed && { opacity: 0.7 }]}
                      >
                        <Ionicons
                          name={shown ? 'close' : 'checkmark'}
                          size={13}
                          color={shown ? '#6B7C66' : '#0B6E4F'}
                        />
                        <Text style={[styles.toggleText, { color: shown ? '#6B7C66' : '#0B6E4F' }]}>
                          {shown ? 'Javobni yashirish' : "Javobni ko'rish"}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* ── Keyingi bo'limga o'tish ── */}
        {st.done && (
          <Pressable
            onPress={finish}
            style={({ pressed }) => [CARD, styles.nextRow, pressed && { transform: [{ scale: 0.99 }] }]}
          >
            <View style={styles.nextIcon}>
              <Ionicons name={nextId ? 'chevron-forward' : 'compass'} size={16} color="#0B6E4F" />
            </View>
            <View style={styles.nextBody}>
              <Text style={styles.nextTitle}>{nextId ? `Keyingi bo'lim ${nextId}` : 'Mavzu yakuniy testi'}</Text>
              <Text style={styles.nextSub}>{nextId ? 'davom etamiz' : `${topic?.test.total ?? 0} savol — barcha bo'limlar tugadi`}</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.dockSpace} />
      </ScrollView>

      {/* ── Pastki CTA ── */}
      <View style={[styles.dock, { paddingBottom: 20 + insets.bottom }]}>
        <Pressable
          onPress={finish}
          disabled={!canFinish}
          style={({ pressed }) => [
            styles.dockBtn,
            st.done ? LIME_BTN : canFinish ? INK_BTN : styles.dockBtnLocked,
            pressed && canFinish && { transform: [{ scale: 0.985 }] },
          ]}
        >
          {st.done ? (
            <>
              <Text style={[styles.dockBtnText, { color: '#1C3214' }]}>Mavzuga qaytish</Text>
              <Ionicons name="chevron-forward" size={16} color="#1C3214" />
            </>
          ) : canFinish ? (
            <>
              <Text style={[styles.dockBtnText, { color: '#CDE9AE' }]}>Bo&apos;limni yakunlash</Text>
              <Ionicons name="checkmark" size={16} color="#9BE04B" />
            </>
          ) : (
            <>
              <Text style={[styles.dockBtnText, { color: '#9AA995' }]}>Avval video darsni to&apos;liq ko&apos;ring</Text>
              <Ionicons name="film" size={16} color="#9AA995" />
            </>
          )}
        </Pressable>

        {!st.done && (
          <View style={styles.dockReward}>
            <Text style={[styles.dockRewardText, NUM]}>
              Yakunlangach +{TOPIC_LESSON_REWARD.coin} coin · +{TOPIC_LESSON_REWARD.xp} XP
            </Text>
            <Ionicons name="cash" size={11} color="#E8A33D" />
          </View>
        )}

        {st.done && !!nextId && (
          <Pressable onPress={exit} style={({ pressed }) => [styles.dockList, pressed && { opacity: 0.7 }]}>
            <Ionicons name="refresh" size={12} color="#6B7C66" />
            <Text style={styles.dockListText}>Bo&apos;limlar ro&apos;yxati</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

const cardRail: ViewStyle = { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16, paddingBottom: 24 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 8 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 12 },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 14.5, lineHeight: 19, fontWeight: '800', color: C.ink, marginTop: 2 },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingBtn: { height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  missingText: { fontSize: 13, fontWeight: '800', color: '#0E1A12' },

  goal: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 },
  goalIcon: { flexShrink: 0 },
  goalText: { flex: 1, fontSize: 12.5, lineHeight: 18, fontWeight: '700', color: C.ink2 },

  videoWrap: { marginTop: 16 },
  videoOnlyNote: { marginTop: 12, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: '#6B7C66' },

  block: { borderRadius: 14, marginTop: 16, flexDirection: 'row', overflow: 'hidden' },
  blockRail: { ...cardRail, width: 4 },
  blockBody: { flex: 1, paddingLeft: 16, paddingRight: 14, paddingVertical: 14 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '900' },
  blockText: { marginTop: 10, fontSize: 14, lineHeight: 22, color: C.ink2 },

  listCard: { borderRadius: 14, marginTop: 16, overflow: 'hidden' },
  listCaption: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8, fontSize: 13, lineHeight: 19, fontWeight: '800', color: C.ink },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 14, paddingVertical: 8 },
  divided: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  listNum: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 6 },
  listNumText: { fontSize: 10.5, fontWeight: '900', color: '#33452F' },
  listItemText: { flex: 1, fontSize: 13.5, lineHeight: 20, fontWeight: '600', color: C.ink2 },

  props: { borderRadius: 14, marginTop: 16, overflow: 'hidden' },
  propsHead: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 12.5, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', borderBottomWidth: 1, borderBottomColor: '#EDF1E7' },
  propRow: { paddingHorizontal: 14, paddingVertical: 12 },
  propTop: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  propName: { fontSize: 11, textTransform: 'uppercase', fontWeight: '900', color: '#5FAF22' },
  propDetail: { flex: 1, fontSize: 13.5, lineHeight: 20, fontWeight: '600', color: C.ink },
  propExample: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#0B6E4F', fontFamily: 'monospace' },

  example: { marginTop: 20, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#0E1A12', borderRadius: 16 },
  exampleRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  exampleBody: { flex: 1, paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  examplePrompt: { marginTop: 8, fontSize: 14.5, lineHeight: 22, fontWeight: '600', color: '#FFFFFF' },
  stackBox: { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10 },
  steps: { marginTop: 12, gap: 6 },
  stepRow: { flexDirection: 'row', gap: 10 },
  stepNum: { fontSize: 11.5, fontWeight: '900', color: '#9BE04B', width: 18 },
  stepText: { flex: 1, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.82)' },
  answerRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(205,233,174,0.16)', paddingTop: 12 },
  answerLabel: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '800', color: 'rgba(205,233,174,0.6)' },
  answerValue: { fontSize: 16, fontWeight: '800', color: '#9BE04B' },

  stack: { paddingLeft: 12, marginTop: 8 },
  stackDark: {},
  stackRow: { fontSize: 16, lineHeight: 28, fontWeight: '800', color: C.ink, textAlign: 'right', fontFamily: 'monospace' },
  stackRowDark: { color: '#FFFFFF', fontWeight: '700' },
  stackRule: { fontSize: 15, lineHeight: 24, textAlign: 'right', fontFamily: 'monospace' },
  stackRuleDark: { color: 'rgba(205,233,174,0.5)', fontSize: 13, lineHeight: 24 },
  stackResult: { fontSize: 17, lineHeight: 28, fontWeight: '800', textAlign: 'right', fontFamily: 'monospace' },

  practiceSection: { marginTop: 24 },
  practiceHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 10 },
  practiceTitle: { fontSize: 15.5, fontWeight: '800', color: C.ink },
  practiceCount: { fontSize: 11.5, fontWeight: '700', color: '#6B7C66' },
  practiceList: { gap: 10 },
  practiceCard: { borderRadius: 14, overflow: 'hidden' },
  practicePrompt: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12, fontSize: 13.5, lineHeight: 20, fontWeight: '600', color: C.ink },
  solution: { marginHorizontal: 14, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', borderRadius: 10, backgroundColor: '#FBFCF8' },
  solutionRail: { width: 2, backgroundColor: '#5FAF22' },
  solutionBody: { flex: 1, paddingLeft: 12, paddingRight: 12, paddingVertical: 12, gap: 4 },
  solutionStep: { fontSize: 13, lineHeight: 20, color: C.ink2 },
  solutionAnswer: { marginTop: 8, fontSize: 14, fontWeight: '800', color: '#0B6E4F' },
  toggleBtn: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  toggleText: { fontSize: 11.5, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: '800' },

  nextRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 14 },
  nextIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF3DC', borderRadius: 10 },
  nextBody: { flex: 1 },
  nextTitle: { fontSize: 13, fontWeight: '800', color: C.ink },
  nextSub: { marginTop: 2, fontSize: 11.5, fontWeight: '600', color: '#6B7C66' },

  dockSpace: { height: 96 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(243,247,238,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#E1E7DA',
  },
  dockBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  dockBtnLocked: { backgroundColor: '#EAEEE3', borderRadius: 12 },
  dockBtnText: { fontSize: 14.5, fontWeight: '800' },
  dockReward: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  dockRewardText: { fontSize: 11.5, fontWeight: '700', color: '#9AA995' },
  dockList: { marginTop: 6, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dockListText: { fontSize: 11.5, fontWeight: '800', color: '#6B7C66' },
})

export default TopicLessonScreen
