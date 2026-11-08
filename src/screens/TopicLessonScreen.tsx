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
import { useExitToTopics } from '../lib/nav'
import { LessonVideo } from '../components/LessonVideo'
import { Reveal } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { C, MATH_FONT, NUM, shadow } from '../theme/tokens'
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

/** Ma'lumot turi — katta harflar o'rniga oddiy gap ko'rinishida */
const LABEL_TEXT: Record<string, string> = {
  "TA'RIF": "Ta'rif",
  "MA'LUMOT": "Ma'lumot",
  MASALAN: 'Masalan',
  ESLATISH: 'Eslatish',
  SAVOL: 'Savol',
  YECHISH: 'Yechish',
  MAQSAD: 'Maqsad',
  XULOSA: 'Xulosa',
}

const labelText = (kind: string) => LABEL_TEXT[kind] ?? 'Eslatish'

/**
 * Uzun nazariy matnni ekranda o'qish mumkin bo'lgan paragraflarga ajratadi.
 * Gap chegarasi qat'iy: `.` faqat bo'sh joy va katta harf/raqamdan keyin
 * hisoblanadi — shunda «3.14», «1.1» kabi sonlar bo'linmaydi.
 * Ma'lumot faylida matn bitta xatboshida saqlanadi — bu faqat ko'rinish qatlami.
 */
const splitSentences = (text: string): string[] => {
  const out: string[] = []
  let start = 0

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const hard = ch === '!' || ch === '?' || ch === '…'
    if (!hard && ch !== '.') continue
    if (ch === '.' && !(text[i + 1] === undefined || /\s/.test(text[i + 1]))) continue

    let j = i + 1
    while (j < text.length && /\s/.test(text[j])) j++
    if (ch === '.' && j < text.length && !/[A-ZА-ЯЎҒҚҲOʻ“"'(0-9]/.test(text[j])) continue

    out.push(text.slice(start, j).trim())
    start = j
    i = j - 1
  }

  if (start < text.length) out.push(text.slice(start).trim())
  return out.filter(Boolean)
}

const paragraphs = (text: string): string[] =>
  text.split(/\n{2,}/).flatMap(chunk => {
    const parts: string[] = []
    let buffer = ''
    for (const sentence of splitSentences(chunk)) {
      if (buffer && buffer.length + sentence.length > 260) {
        parts.push(buffer)
        buffer = sentence
      } else {
        buffer = buffer ? `${buffer} ${sentence}` : sentence
      }
    }
    if (buffer) parts.push(buffer)
    return parts
  })

/** «1.3 Son va raqamning farqi (Amaliy qism)» → «Son va raqamning farqi (Amaliy qism)» */
const partTitle = (lessonId: string, title: string) => {
  const prefix = `${lessonId} `
  return title.startsWith(prefix) ? title.slice(prefix.length) : title
}

const partKind = (title: string) => {
  const kind = title.match(/\((Naz[^)]*|Amal[^)]*)\)/i)?.[1]
  if (!kind) return 'Qism'
  return /^naz/i.test(kind) ? 'Nazariy' : 'Amaliy'
}

const kicker: TextStyle = {
  fontSize: 12,
  lineHeight: 15,
  fontWeight: '500',
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
  const exit = useExitToTopics(topicNum)

  const stateOf = useApp(s => s.topicLessonState)
  const markVideoSeen = useApp(s => s.markTopicVideoSeen)
  const complete = useApp(s => s.completeTopicLesson)
  const beginSession = useApp(s => s.beginSession)

  /** Har bir videoni 95% ko'rish holati — shu mount ichida yashaydi,
   *  store'ga faqat barcha videolar tugagach yoziladi */
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [unavailable, setUnavailable] = useState<Record<string, boolean>>({})
  const [activePart, setActivePart] = useState(0)
  const [open, setOpen] = useState<number[]>([])
  const [openEx, setOpenEx] = useState<number[]>([])
  const lessons = topic?.lessons ?? []
  const idx = lessons.findIndex(l => l.id === route.params.lessonId)
  const nextId = idx >= 0 ? lessons[idx + 1]?.id : undefined

  useEffect(() => {
    beginSession()
  }, [beginSession])

  /** Keyingi bo'lim «replace» bilan ochiladi — ekran qayta mount bo'lmasligi
   *  mumkin, shuning uchun holat bo'lim identifikatori bo'yicha tozalanadi */
  useEffect(() => {
    setSeen({})
    setUnavailable({})
    setActivePart(0)
    setOpen([])
    setOpenEx([])
  }, [route.params.lessonId])

  if (!lesson) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.missing}>
          <Pressable onPress={exit} style={({ pressed }) => [CARD, styles.missingBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.missingText}>Mavzularga qaytish</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const st = stateOf(lesson.id)
  /** Bir vaqtda faqat bitta pleyer ochiladi — qismlar ro'yxatdan tanlanadi */
  const active = lesson.videos[activePart] ?? lesson.videos[0]
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
            hitSlop={10}
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={18} color="#33452F" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={kicker}>
              {st.done ? `Bo'lim ${lesson.id} · yakunlangan` : `Bo'lim ${lesson.id} · ${idx + 1}/${lessons.length}`}
            </Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {lesson.title}
            </Text>
          </View>

          <View style={[styles.headerCount, st.done && styles.headerCountDone]}>
            {st.done && <Ionicons name="checkmark-circle" size={13} color="#5FAF22" />}
            <Text style={[styles.headerCountText, NUM, st.done && { color: '#0B6E4F' }]}>
              {idx + 1}/{lessons.length}
            </Text>
          </View>
        </View>

        {/* ── Maqsad ── */}
        <View style={[CARD, styles.goal]}>
          <View style={styles.goalIconWrap}>
            <Ionicons name="compass" size={14} color="#5FAF22" />
          </View>
          <Text style={styles.goalText}>{lesson.goal}</Text>
        </View>

        {/* ── Video dars ── */}
        {active && (
          <View style={styles.videoSection}>
            <View style={styles.videoHead}>
              <Text style={kicker}>Video dars</Text>
              <Text style={[styles.videoCount, NUM]}>{lesson.videos.length} qism</Text>
            </View>

            {lesson.videos.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.partRow}
              >
                {lesson.videos.map((v, i) => {
                  const on = i === activePart
                  const watchedPart = st.videoSeen || Boolean(seen[v.id])
                  return (
                    <Pressable
                      key={v.id}
                      onPress={() => {
                        if (i !== activePart) triggerHaptic('selection')
                        setActivePart(i)
                      }}
                      accessibilityLabel={`${i + 1}-qism: ${partTitle(lesson.id, v.title)}`}
                      style={({ pressed }) => [
                        styles.partChip,
                        on ? styles.partChipOn : null,
                        pressed && { transform: [{ scale: 0.98 }] },
                      ]}
                    >
                      <View style={[styles.partIndex, on ? styles.partIndexOn : null]}>
                        <Text style={[styles.partIndexText, NUM, on ? styles.partIndexTextOn : null]}>
                          {i + 1}
                        </Text>
                      </View>
                      <View style={styles.partBody}>
                        <Text style={[styles.partKind, on ? styles.partKindOn : null]}>{partKind(v.title)}</Text>
                        <Text
                          numberOfLines={1}
                          style={[styles.partName, on ? styles.partNameOn : null]}
                        >
                          {partTitle(lesson.id, v.title)}
                        </Text>
                      </View>
                      {watchedPart && (
                        <Ionicons name="checkmark" size={14} color={on ? '#9BE04B' : '#5FAF22'} />
                      )}
                    </Pressable>
                  )
                })}
              </ScrollView>
            )}

            <View style={styles.videoWrap}>
              <LessonVideo
                key={active.id}
                videoId={active.id}
                title={partTitle(lesson.id, active.title)}
                watched={st.videoSeen || Boolean(seen[active.id])}
                onWatched={() => markWatched(active.id)}
                onUnavailable={() => markUnavailable(active.id)}
              />
            </View>
          </View>
        )}

        {lesson.videoOnly && (
          <Text style={styles.videoOnlyNote}>Bu bo&apos;limning nazariy qismi video darsda berilgan.</Text>
        )}

        {/* ── Nazariya ── */}
        {lesson.theory.length > 0 && (
          <View style={styles.blockHead}>
            <Text style={styles.blockHeadTitle}>Nazariya</Text>
            <View style={styles.blockHeadLine} />
          </View>
        )}

        {lesson.theory.map((b, i) => {
          const tone = labelStyle(b.kind)
          return (
            <Reveal key={i} delay={i * 40}>
              <View style={[CARD, styles.block]}>
                <View style={[styles.blockRail, { backgroundColor: tone.fg }]} />
                <View style={styles.blockBody}>
                  <View style={[styles.tag, { backgroundColor: tone.bg }]}>
                    <Text style={[styles.tagText, { color: tone.fg }]}>{labelText(b.kind)}</Text>
                  </View>
                  {paragraphs(b.text).map((p, pi) => (
                    <Text key={pi} style={[styles.blockText, pi > 0 && styles.blockTextGap]}>
                      {p}
                    </Text>
                  ))}
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

        {/* ── Kitobda mashq bo'lmagan bo'lim ── */}
        {lesson.practice.length === 0 && !(lesson.exercises && lesson.exercises.length > 0) && (
          <View style={[CARD, styles.noPractice]}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7C66" />
            <Text style={styles.noPracticeText}>
              Bu bo&apos;limda kitobda amaliy mashq berilmagan — nazariyani o&apos;zlashtirib, bo&apos;limni yakunlang.
            </Text>
          </View>
        )}

        {/* ── Keyingi bo'limga o'tish ── */}
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
              <Text style={[styles.dockBtnText, { color: '#1C3214' }]}>
                {nextId ? "Keyingi bo'lim" : 'Mavzu yakuniy testi'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#1C3214" />
            </>
          ) : canFinish ? (
            <>
              <Text style={[styles.dockBtnText, { color: '#CDE9AE' }]}>Bo&apos;limni yakunlash</Text>
              <Ionicons name="checkmark" size={16} color="#9BE04B" />
            </>
          ) : (
            <>
              <Text style={[styles.dockBtnText, { color: '#6B7C66' }]}>Avval video darsni to&apos;liq ko&apos;ring</Text>
              <Ionicons name="film" size={16} color="#8A9984" />
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
            <Text style={styles.dockListText}>Mavzular ro&apos;yxati</Text>
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

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA', borderRadius: 12 },
  headerText: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: C.ink, marginTop: 2 },
  headerCount: {
    height: 28,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7DA',
  },
  headerCountDone: { backgroundColor: '#EFF8EC', borderColor: '#CDE9AE' },
  headerCountText: { fontSize: 11.5, fontWeight: '600', color: '#6B7C66' },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingBtn: { height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  missingText: { fontSize: 13, fontWeight: '600', color: '#0E1A12' },

  goal: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#F7FBEF',
    borderColor: '#DCEBC6',
  },
  goalIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF6D8',
  },
  goalText: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '500', color: C.ink2 },

  videoSection: { marginTop: 16 },
  videoHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  videoCount: { fontSize: 11.5, fontWeight: '500', color: '#6B7C66' },
  partRow: { gap: 8, paddingTop: 10, paddingBottom: 2, paddingRight: 16 },
  partChip: { minHeight: 48, maxWidth: 236, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 10, paddingRight: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA' },
  partChipOn: { backgroundColor: '#0E1A12', borderColor: '#0E1A12' },
  partIndex: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#F1F4EE' },
  partIndexOn: { backgroundColor: 'rgba(155,224,75,0.16)' },
  partIndexText: { fontSize: 11.5, fontWeight: '900', color: '#6B7C66' },
  partIndexTextOn: { color: '#9BE04B' },
  partBody: { flexShrink: 1, minWidth: 0 },
  partKind: { fontSize: 10.5, fontWeight: '600', color: '#5FAF22' },
  partKindOn: { color: '#9BE04B' },
  partName: { marginTop: 2, fontSize: 12, fontWeight: '500', color: '#33452F' },
  partNameOn: { color: '#FFFFFF' },
  videoWrap: { marginTop: 12 },
  videoOnlyNote: { marginTop: 12, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: '#6B7C66' },

  blockHead: { marginTop: 24, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  blockHeadTitle: { fontSize: 13, fontWeight: '600', color: '#33452F' },
  blockHeadLine: { flex: 1, height: 1, backgroundColor: '#DDE5D4' },

  block: { borderRadius: 14, marginTop: 12, flexDirection: 'row', overflow: 'hidden' },
  blockRail: { ...cardRail, width: 4 },
  blockBody: { flex: 1, paddingLeft: 16, paddingRight: 15, paddingVertical: 15 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.1 },
  blockText: { marginTop: 10, fontSize: 15, lineHeight: 25, fontWeight: '400', color: '#33452F' },
  blockTextGap: { marginTop: 12 },

  listCard: { borderRadius: 14, marginTop: 16, overflow: 'hidden' },
  listCaption: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8, fontSize: 13, lineHeight: 19, fontWeight: '600', color: C.ink },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 14, paddingVertical: 8 },
  divided: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  listNum: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF7DE', borderRadius: 6 },
  listNumText: { fontSize: 10.5, fontWeight: '900', color: '#33452F' },
  listItemText: { flex: 1, fontSize: 13.5, lineHeight: 20, fontWeight: '500', color: C.ink2 },

  props: { borderRadius: 14, marginTop: 16, overflow: 'hidden' },
  propsHead: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 12.5, fontWeight: '600', color: '#6B7C66', borderBottomWidth: 1, borderBottomColor: '#EDF1E7' },
  propRow: { paddingHorizontal: 14, paddingVertical: 12 },
  propTop: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  propName: { fontSize: 12.5, fontWeight: '600', color: '#5FAF22' },
  propDetail: { flex: 1, fontSize: 13.5, lineHeight: 20, fontWeight: '500', color: C.ink },
  propExample: { marginTop: 8, fontSize: 13.5, fontWeight: '400', color: '#0B6E4F', fontFamily: MATH_FONT },

  example: { marginTop: 20, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#0E1A12', borderRadius: 16 },
  exampleRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  exampleBody: { flex: 1, paddingLeft: 20, paddingRight: 16, paddingVertical: 16 },
  examplePrompt: { marginTop: 8, fontFamily: MATH_FONT, fontWeight: '400', fontSize: 14.5, lineHeight: 23, color: '#FFFFFF' },
  stackBox: { marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10 },
  steps: { marginTop: 12, gap: 6 },
  stepRow: { flexDirection: 'row', gap: 10 },
  stepNum: { fontSize: 11.5, fontWeight: '900', color: '#9BE04B', width: 18 },
  stepText: { flex: 1, fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.82)' },
  answerRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(205,233,174,0.16)', paddingTop: 12 },
  answerLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(205,233,174,0.7)' },
  answerValue: { fontSize: 16, fontWeight: '600', color: '#9BE04B' },

  stack: { paddingLeft: 12, marginTop: 8 },
  stackDark: {},
  stackRow: { fontSize: 17, lineHeight: 30, fontWeight: '400', color: C.ink, textAlign: 'right', fontFamily: MATH_FONT },
  stackRowDark: { color: '#FFFFFF' },
  stackRule: { fontSize: 15, lineHeight: 24, textAlign: 'right', color: '#9AA995', fontFamily: MATH_FONT },
  stackRuleDark: { color: 'rgba(205,233,174,0.5)', fontSize: 13, lineHeight: 24 },
  stackResult: { fontSize: 18, lineHeight: 30, fontWeight: '400', textAlign: 'right', color: '#0B6E4F', fontFamily: MATH_FONT },

  practiceSection: { marginTop: 24 },
  practiceHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 10 },
  practiceTitle: { fontSize: 15.5, fontWeight: '600', color: C.ink },
  practiceCount: { fontSize: 11.5, fontWeight: '500', color: '#6B7C66' },
  practiceList: { gap: 10 },
  practiceCard: { borderRadius: 14, overflow: 'hidden' },
  practicePrompt: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12, fontFamily: MATH_FONT, fontWeight: '400', fontSize: 14, lineHeight: 21, color: C.ink },
  solution: { marginHorizontal: 14, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', borderRadius: 10, backgroundColor: '#FBFCF8' },
  solutionRail: { width: 2, backgroundColor: '#5FAF22' },
  solutionBody: { flex: 1, paddingLeft: 12, paddingRight: 12, paddingVertical: 12, gap: 4 },
  solutionStep: { fontSize: 13, lineHeight: 20, color: C.ink2 },
  solutionAnswer: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#0B6E4F' },
  toggleBtn: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  toggleText: { fontSize: 12, fontWeight: '600' },

  noPractice: { marginTop: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 14 },
  noPracticeText: { flex: 1, fontSize: 12.5, lineHeight: 19, fontWeight: '500', color: '#6B7C66' },

  dockSpace: { height: 118 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: SOLVER_BODY,
    borderTopWidth: 1,
    borderTopColor: '#E1E7DA',
    ...shadow(C.ink, 18, 2, 0.07),
  },
  dockBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12 },
  dockBtnLocked: { backgroundColor: '#E9EDE2', borderRadius: 12 },
  dockBtnText: { fontSize: 14.5, fontWeight: '600' },
  dockReward: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  dockRewardText: { fontSize: 11.5, fontWeight: '500', color: '#7C8B77' },
  dockList: { marginTop: 6, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dockListText: { fontSize: 11.5, fontWeight: '600', color: '#6B7C66' },
})

export default TopicLessonScreen
