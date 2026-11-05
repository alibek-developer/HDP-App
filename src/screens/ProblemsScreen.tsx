import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ScrollViewInstance } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import type { TabKey } from '../components/BottomNav'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { Bar } from '../components/Bar'
import { DAILY_BONUS, EXAM_SET, MISSION_REWARDS, PROBLEM_SETS, dailyProblem, type ProblemSet } from '../data/content'
import {
  AMBER_BTN, AMBER_TEXT, BTN_BASE, CARD, CARD_LIFT, GRAD_HEADER, GRAD_LIME, GRAD_RAIL,
  LIME_BTN, LIME_TEXT, OUT_BTN, OUT_TEXT, SOLVER_BODY,
} from '../theme/solver'

/**
 * Masalalar — mintaqaviy «davotar» tili (burchakli kvadrat chip, chap reysli
 * qatorlar, ledger ustunlari, ticket-karta). Home doira/pill morfologiyasida.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const DIFF_RAIL: Record<string, string> = {
  oson: '#7ED321',
  "o'rta": '#E8A33D',
  qiyin: '#D9534F',
}

const TOPIC_GLYPH: Record<string, keyof typeof Ionicons.glyphMap> = {
  Algebra: 'calculator',
  Geometriya: 'triangle',
  Trigonometriya: 'compass',
  Analiz: 'infinite',
  Olimpiada: 'trophy',
}

const TIERS = [
  { name: "Boshlang'ich", need: 0 },
  { name: "O'rta", need: 5 },
  { name: 'Qiyin', need: 12 },
  { name: 'Olimpiada', need: 20 },
]

const pad = (n: number) => String(n).padStart(2, '0')
const clock = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`
}
const msToMidnight = () => {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}
/** Store bilan bir xil mahalliy sana kaliti (UTC siljishi kunlik bonusni buzmasin) */
const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const num = (n: number) => n.toLocaleString('en-US')

const ProblemsScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollViewInstance>(null)
  const bodyY = useRef(0)
  const listY = useRef(0)

  const coin = useApp(s => s.coin)
  const streak = useApp(s => s.streak)
  const solvedCount = useApp(s => s.solvedCount)
  const solvedToday = useApp(s => s.solvedToday)
  const olympToday = useApp(s => s.olympToday)
  const claimedMissions = useApp(s => s.claimedMissions)
  const solvedQuestions = useApp(s => s.solvedQuestions)
  const unlocked = useApp(s => s.unlocked)
  const isPro = useApp(s => s.isPro)
  const rollDay = useApp(s => s.rollDay)
  const claimMission = useApp(s => s.claimMission)
  const unlockSet = useApp(s => s.unlockSet)
  const canOpenSet = useApp(s => s.canOpenSet)
  const dailyBonusOn = useApp(s => s.dailyBonusOn)

  const [cat, setCat] = useState('Barchasi')
  const [remain, setRemain] = useState(msToMidnight)
  /** Coin evaziga ochiladigan to'plam — avval tasdiqlash varag'i */
  const [unlockTarget, setUnlockTarget] = useState<ProblemSet | null>(null)

  useEffect(() => {
    rollDay()
    const t = setInterval(() => setRemain(msToMidnight()), 1000)
    return () => clearInterval(t)
  }, [rollDay])

  const daily = useMemo(() => dailyProblem(), [])
  const dailyClaimed = dailyBonusOn === todayKey()

  const categories = useMemo(
    () => ['Barchasi', ...Array.from(new Set(PROBLEM_SETS.map(s => s.topic)))],
    []
  )
  const list = useMemo(
    () => (cat === 'Barchasi' ? PROBLEM_SETS : PROBLEM_SETS.filter(s => s.topic === cat)),
    [cat]
  )

  const openSet = (set: ProblemSet) => {
    if (canOpenSet(set.id)) {
      triggerHaptic('medium')
      navigation.navigate('ProblemSet', { setId: set.id })
      return
    }
    if (set.unlockPrice) {
      triggerHaptic('light')
      setUnlockTarget(set)
      return
    }
    triggerHaptic('warning')
    navigation.navigate('Pro', { reason: 'problem-set', setId: set.id })
  }

  const confirmUnlock = () => {
    if (!unlockTarget) return
    const target = unlockTarget
    const ok = unlockSet(target.id, target.unlockPrice ?? 0)
    setUnlockTarget(null)
    triggerHaptic(ok ? 'success' : 'error')
    if (ok) navigation.navigate('ProblemSet', { setId: target.id })
  }

  const solvedIn = (set: ProblemSet) => (solvedQuestions[set.id] ?? []).length

  const missions = [
    {
      key: 'solve5',
      label: 'Bugun 5 ta masala yech',
      reward: MISSION_REWARDS.solve5,
      ratio: Math.min(solvedToday, 5) / 5,
      detail: `${Math.min(solvedToday, 5)}/5`,
    },
    {
      key: 'streak',
      label: "Streak'ni davom ettir",
      reward: MISSION_REWARDS.streak,
      ratio: streak > 0 ? 1 : 0,
      detail: streak > 0 ? `${streak} kun` : '0 kun',
    },
    {
      key: 'olymp',
      label: 'Bitta olimpiada masalasi yech',
      reward: MISSION_REWARDS.olymp,
      ratio: Math.min(olympToday, 1) / 1,
      detail: `${Math.min(olympToday, 1)}/1`,
    },
  ]

  const modes = [
    {
      key: 'blitz',
      icon: 'flash' as const,
      tile: '#FCF1DC',
      fg: '#B87A22',
      name: 'Tezkor Blitz',
      desc: '30 soniyada 5 ta savol',
      coin: 25,
      pro: false,
      run: () => {
        triggerHaptic('medium')
        navigation.navigate('Blitz')
      },
    },
    {
      key: 'streak',
      icon: 'flame' as const,
      tile: '#FDE8E4',
      fg: '#C2410C',
      name: 'Streak Seriya',
      desc: 'Ketma-ket 10 ta — 2x bonus',
      coin: 100,
      pro: false,
      run: () => {
        triggerHaptic('medium')
        navigation.navigate('ProblemSet', { setId: 'ps-streak' })
      },
    },
    {
      key: 'topic',
      icon: 'clipboard-outline' as const,
      tile: '#DDF3DC',
      fg: '#0B6E4F',
      name: "Mavzu bo'yicha",
      desc: "O'zingiz mavzuni tanlang",
      coin: 25,
      pro: false,
      run: () => {
        triggerHaptic('selection')
        setCat('Barchasi')
        scrollRef.current?.scrollTo({ y: Math.max(0, bodyY.current + listY.current - 12), animated: true })
      },
    },
    {
      key: 'exam',
      icon: 'trophy' as const,
      tile: '#E5ECFE',
      fg: '#3560C4',
      name: 'Sinov',
      desc: `${EXAM_SET.questions.length} ta savollik to'liq test`,
      coin: 150,
      pro: true,
      run: () => {
        if (!isPro) {
          triggerHaptic('warning')
          navigation.navigate('Pro', { reason: 'problem-set', setId: 'ps-exam' })
          return
        }
        triggerHaptic('medium')
        navigation.navigate('ProblemSet', { setId: 'ps-exam' })
      },
    },
  ]

  const onTab = (key: TabKey) => {
    if (key === 'problems') return
    navigation.navigate(key === 'home' ? 'Home' : key === 'shop' ? 'Shop' : 'Profile')
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: 0, paddingBottom: navBottomSpace(insets.bottom) }]}
      >
        {/* ── 1. Header: siyoh varaq + ledger ── */}
        <LinearGradient
          colors={GRAD_HEADER}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.55, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.titleRow}>
              <View style={styles.glyphTile}>
                <Ionicons name="calculator" size={18} color="#9BE04B" />
              </View>
              <View>
                <Text style={styles.h1}>Masalalar</Text>
                <Text style={styles.h1Sub}>YECH · MUSTAHKAMLA · COIN YIG'</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Shop')
              }}
              style={({ pressed }) => [styles.coinChip, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <Ionicons name="cash" size={14} color="#F3C88A" />
              <Text style={[styles.coinChipText, NUM]}>{num(coin)}</Text>
            </Pressable>
          </View>

          <View style={styles.ledger}>
            {[
              { v: `${streak}`, u: 'kunlik streak', icon: 'flame' as const, c: '#F3C88A' },
              { v: `${solvedCount}`, u: 'ta yechilgan', icon: 'checkmark' as const, c: '#9BE04B' },
              { v: `${solvedToday}`, u: 'bugun', icon: 'flash' as const, c: '#CDE9AE' },
            ].map((cell, i) => (
              <View key={cell.u} style={styles.ledgerCell}>
                {i > 0 && <View style={styles.ledgerDivider} />}
                <View style={styles.ledgerInner}>
                  <Text style={[styles.ledgerValue, NUM]}>{cell.v}</Text>
                  <View style={styles.ledgerLabelRow}>
                    <Ionicons name={cell.icon} size={12} color={cell.c} />
                    <Text style={styles.ledgerLabel}>{cell.u}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.headerTail} />
        </LinearGradient>

        <View
          style={styles.body}
          onLayout={e => {
            bodyY.current = e.nativeEvent.layout.y
          }}
        >
          {/* ── 2. Kunlik mega masala — ticket ── */}
          <View style={[CARD_LIFT, styles.ticket]}>
            <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.ticketRail} />
            <View style={styles.ticketBody}>
              <View style={styles.ticketHead}>
                <Text style={styles.ticketKicker}>KUNLIK MEGA MASALA</Text>
                <View style={styles.clockChip}>
                  <Ionicons name="time-outline" size={12} color="#9AA995" />
                  <Text style={[styles.clockText, NUM]}>{clock(remain)}</Text>
                </View>
              </View>

              <Text style={styles.ticketTitle}>{daily.set.title}</Text>
              <Text style={styles.ticketMeta}>
                {daily.set.topic} · {daily.set.grade} · har kuni yangilanadi
              </Text>

              <View style={styles.promptBox}>
                <Text style={styles.promptText}>{daily.question.prompt}</Text>
              </View>

              <View style={styles.perforation}>
                <View style={styles.punchLeft} />
                <View style={styles.punchRight} />
              </View>

              <View style={styles.ticketBottom}>
                <View style={styles.rewardLedger}>
                  <View style={styles.rewardCol}>
                    <Text style={[styles.rewardCoin, NUM]}>+{DAILY_BONUS.coin}</Text>
                    <Text style={styles.rewardUnit}>COIN</Text>
                  </View>
                  <View style={styles.rewardDivider} />
                  <View style={[styles.rewardCol, { paddingLeft: 12, paddingRight: 0 }]}>
                    <Text style={[styles.rewardXp, NUM]}>+{DAILY_BONUS.xp}</Text>
                    <Text style={styles.rewardUnit}>XP</Text>
                  </View>
                  {dailyClaimed && <Text style={styles.claimedNote}>bugun olindi</Text>}
                </View>

                <Pressable
                  onPress={() => openSet(daily.set)}
                  style={({ pressed }) => [LIME_BTN, styles.ticketCta, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                  <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                  <Text style={[styles.ticketCtaText, LIME_TEXT]}>Yechish</Text>
                  <Ionicons name="arrow-forward" size={15} color="#1C3214" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── 3. Kategoriyalar ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipRowInner}>
            {categories.map(c => {
              const active = cat === c
              const count = c === 'Barchasi' ? PROBLEM_SETS.length : PROBLEM_SETS.filter(s => s.topic === c).length
              return (
                <Pressable
                  key={c}
                  onPress={() => {
                    triggerHaptic('selection')
                    setCat(c)
                  }}
                  style={({ pressed }) => [
                    styles.chip,
                    active ? styles.chipActive : styles.chipIdle,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>{c}</Text>
                  <Text style={[styles.chipCount, NUM, { color: active ? '#CDE9AE' : '#9AA995' }]}>{count}</Text>
                </Pressable>
              )
            })}
          </ScrollView>

          {/* ── 4. Mashq rejimlari ── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Mashq rejimlari</Text>
              <Text style={styles.sectionHint}>4 ta</Text>
            </View>

            <View style={[CARD, styles.modesPanel]}>
              {modes.map((m, i) => {
                const proLocked = m.pro && !isPro
                return (
                  <Pressable
                    key={m.key}
                    onPress={m.run}
                    style={({ pressed }) => [
                      styles.modeCell,
                      i % 2 === 0 && styles.modeCellRightBorder,
                      i > 1 && styles.modeCellTopBorder,
                      proLocked && { backgroundColor: '#FBFCF8' },
                      pressed && { backgroundColor: '#F3F7EE' },
                    ]}
                  >
                    <View style={styles.modeTop}>
                      <View style={[styles.modeTile, { backgroundColor: m.tile }]}>
                        <Ionicons name={m.icon} size={17} color={m.fg} />
                      </View>
                      {proLocked && (
                        <View style={styles.proBadge}>
                          <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.modeName}>{m.name}</Text>
                    <Text style={styles.modeDesc}>{m.desc}</Text>
                    <Text style={[styles.modeCoin, NUM]}>+{m.coin} coin</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          {/* ── 5. O'sish yo'li ── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>O'sish yo'li</Text>
              <Text style={[styles.sectionCount, NUM]}>{solvedCount} ta yechildi</Text>
            </View>

            <View style={[CARD, styles.tiersCard]}>
              <View style={styles.tierBars}>
                {TIERS.map((t, i) => {
                  const done = solvedCount >= t.need
                  const current = !done && solvedCount >= (TIERS[i - 1]?.need ?? 0)
                  return (
                    <View key={t.name} style={styles.tierBarCell}>
                      {done ? (
                        <LinearGradient colors={GRAD_RAIL} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.tierBarFill} />
                      ) : (
                        <View style={[styles.tierBarFill, { backgroundColor: current ? '#E8A33D' : '#EAEEE3' }]} />
                      )}
                    </View>
                  )
                })}
              </View>
              <View style={styles.tierLabels}>
                {TIERS.map((t, i) => {
                  const done = solvedCount >= t.need
                  const current = !done && solvedCount >= (TIERS[i - 1]?.need ?? 0)
                  return (
                    <View key={t.name} style={styles.tierLabelCell}>
                      <Text style={[styles.tierName, { color: done ? '#0B6E4F' : current ? '#B87A22' : '#9AA995' }]}>
                        {t.name}
                      </Text>
                      <Text style={[styles.tierNeed, NUM]}>{done ? 'ochiq' : `${t.need}+ masala`}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>

          {/* ── 6. Kundalik vazifalar ── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Kundalik vazifalar</Text>
              <Text style={styles.sectionHint}>tungi 00:00 gacha</Text>
            </View>

            <View style={[CARD, styles.missionsPanel]}>
              {missions.map((m, i) => {
                const claimed = claimedMissions.includes(m.key)
                const done = m.ratio >= 1
                return (
                  <View key={m.key} style={[styles.missionRow, i > 0 && styles.missionRowBorder]}>
                    <View style={[styles.missionBox, done ? styles.missionBoxOn : styles.missionBoxOff]}>
                      {done && <Ionicons name="checkmark" size={13} color="#1C3214" />}
                    </View>

                    <View style={styles.missionBody}>
                      <Text style={styles.missionLabel}>{m.label}</Text>
                      <View style={styles.missionBarRow}>
                        <Bar ratio={m.ratio} color={done ? '#5FAF22' : '#E8A33D'} />
                        <Text style={[styles.missionDetail, NUM]}>{m.detail}</Text>
                        <Text style={[styles.missionReward, NUM]}>+{m.reward}</Text>
                      </View>
                    </View>

                    <Pressable
                      disabled={!done || claimed}
                      onPress={() => {
                        triggerHaptic('success')
                        claimMission(m.key, m.reward)
                      }}
                      style={({ pressed }) => [
                        styles.missionCta,
                        claimed
                          ? [OUT_BTN, { opacity: 1 }]
                          : done
                            ? [LIME_BTN, pressed && { transform: [{ scale: 0.97 }] }]
                            : [OUT_BTN, { opacity: 0.5 }],
                      ]}
                    >
                      <Text
                        style={[
                          styles.missionCtaText,
                          claimed ? OUT_TEXT : done ? LIME_TEXT : [OUT_TEXT, { color: '#9AA995' }],
                        ]}
                      >
                        {claimed ? 'Olindi' : 'Olish'}
                      </Text>
                    </Pressable>
                  </View>
                )
              })}
            </View>
          </View>

          {/* ── 7. Barcha masalalar ── */}
          <View
            style={styles.section}
            onLayout={e => {
              listY.current = e.nativeEvent.layout.y
            }}
          >
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Barcha Masalalar</Text>
              <Text style={[styles.sectionCount, NUM]}>{list.length} ta to'plam</Text>
            </View>

            <View style={styles.setList}>
              {list.map(set => {
                const open = set.free || isPro || unlocked.includes(set.id)
                const done = solvedIn(set)
                const partial = done > 0 && done < set.questions.length
                return (
                  <View key={set.id} style={[CARD_LIFT, styles.setRow]}>
                    <View style={[styles.setRail, { backgroundColor: DIFF_RAIL[set.difficulty] ?? '#7ED321' }]} />
                    <View style={styles.setBody}>
                      <View style={styles.setTop}>
                        <View style={styles.setText}>
                          <Text style={styles.setTitle}>{set.title}</Text>
                          <View style={styles.setMetaRow}>
                            <Ionicons name={TOPIC_GLYPH[set.topic] ?? 'help-circle-outline'} size={13} color="#9AA995" />
                            <Text style={styles.setMeta}>
                              {set.difficulty} · {set.topic} · {set.grade}
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          onPress={() => openSet(set)}
                          style={({ pressed }) => [
                            BTN_BASE,
                            styles.setCta,
                            !open
                              ? [AMBER_BTN, pressed && { transform: [{ scale: 0.96 }] }]
                              : done > 0 && !partial
                                ? [OUT_BTN, pressed && { transform: [{ scale: 0.96 }] }]
                                : [LIME_BTN, pressed && { transform: [{ scale: 0.96 }] }],
                          ]}
                        >
                          {(!open || (done > 0 && !partial)) && (
                            <LinearGradient
                              colors={!open ? (['#F6D8A6', '#E8A33D'] as const) : (['#FFFFFF', '#FFFFFF'] as const)}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={ABS_FILL}
                            />
                          )}
                          {open && !(done > 0 && !partial) && (
                            <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                          )}
                          <Text
                            style={[
                              styles.setCtaText,
                              NUM,
                              !open ? AMBER_TEXT : done > 0 && !partial ? OUT_TEXT : LIME_TEXT,
                            ]}
                          >
                            {!open ? (set.unlockPrice ? `${set.unlockPrice} coin` : 'Pro') : done ? "Ko'rish" : 'Yechish'}
                          </Text>
                        </Pressable>
                      </View>

                      <View style={styles.setBottom}>
                        <Text style={[styles.setCoin, NUM]}>+{set.coinPerSolve} coin</Text>
                        <Text style={[styles.setXp, NUM]}>+{set.xpPerSolve} XP</Text>
                        <View style={styles.setBarWrap}>
                          <Bar
                            ratio={done / set.questions.length}
                            color={done === set.questions.length ? '#5FAF22' : '#0B6E4F'}
                          />
                        </View>
                        <Text style={[styles.setCount, NUM, { color: open ? '#6B7C66' : '#B87A22' }]}>
                          {open ? `${done}/${set.questions.length}` : 'qulflangan'}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>

          {/* ── Formulalar qo'llanmasi ── */}
          <Pressable
            onPress={() => {
              triggerHaptic('light')
              navigation.navigate('Formulas')
            }}
            style={({ pressed }) => [
              styles.formulasCta,
              CARD,
              pressed && { transform: [{ scale: 0.985 }], backgroundColor: '#F6F8F3' },
            ]}
          >
            <View style={styles.formulasTile}>
              <Ionicons name="calculator" size={16} color="#0B6E4F" />
            </View>
            <View style={styles.formulasText}>
              <Text style={styles.formulasTitle}>Formulalar qo'llanmasi</Text>
              <Text style={styles.formulasSub}>Yechimda kerak bo'ladigan ifodalar — bir bosishda</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9AA995" />
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav active="problems" onSelect={onTab} />

      {/* ── Coin evaziga ochish — tasdiqlash varag'i ── */}
      <Modal
        visible={!!unlockTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setUnlockTarget(null)}
      >
        {unlockTarget && (() => {
          const price = unlockTarget.unlockPrice ?? 0
          const poor = coin < price
          return (
            <View style={styles.sheetRoot}>
              <Pressable style={ABS_FILL} onPress={() => setUnlockTarget(null)} accessibilityLabel="Yopish" />
              <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.sheetGrip} />
                <Text style={styles.sheetKicker}>TO&apos;PLAMNI OCHISH</Text>
                <Text style={styles.sheetTitle}>{unlockTarget.title}</Text>
                <Text style={styles.sheetMeta}>
                  {unlockTarget.difficulty} · {unlockTarget.topic} · {unlockTarget.questions.length} ta masala
                </Text>

                <View style={styles.sheetRows}>
                  {[
                    { k: 'Narxi', v: `${num(price)} coin` },
                    { k: 'Hamyonda', v: `${num(coin)} coin` },
                    { k: 'Ochilgach qoladi', v: `${num(Math.max(0, coin - price))} coin` },
                  ].map(r => (
                    <View key={r.k} style={styles.sheetRow}>
                      <Text style={styles.sheetK}>{r.k}</Text>
                      <Text style={[styles.sheetV, NUM]}>{r.v}</Text>
                    </View>
                  ))}
                </View>

                {poor && (
                  <Text style={styles.sheetPoor}>
                    Yana {num(price - coin)} coin kerak — bepul to&apos;plamlardan yig&apos;ing.
                  </Text>
                )}

                <View style={styles.sheetBtns}>
                  <Pressable
                    onPress={() => { triggerHaptic('light'); setUnlockTarget(null) }}
                    style={({ pressed }) => [styles.sheetCancel, pressed && { opacity: 0.9 }]}
                  >
                    <Text style={styles.sheetCancelText}>Bekor</Text>
                  </Pressable>
                  <Pressable
                    onPress={confirmUnlock}
                    disabled={poor}
                    style={({ pressed }) => [
                      styles.sheetOk,
                      poor && styles.sheetOkOff,
                      pressed && !poor && { transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    {!poor && (
                      <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                    )}
                    <Text style={[styles.sheetOkText, poor && styles.sheetOkTextOff, NUM]}>
                      {poor ? 'Coin yetmaydi' : `${num(price)} coin — ochish`}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )
        })()}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingBottom: 120 },
  body: { paddingHorizontal: 20 },

  header: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  glyphTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(205,233,174,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(205,233,174,0.22)',
  },
  h1: { fontSize: 21, lineHeight: 25, fontWeight: '800', letterSpacing: -0.6, color: '#F7FCED' },
  h1Sub: { marginTop: 2, fontSize: 10.5, letterSpacing: 1.26, fontWeight: '800', color: 'rgba(205,233,174,0.5)' },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(232,163,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.38)',
  },
  coinChipText: { fontSize: 13, fontWeight: '800', color: '#F3C88A' },

  ledger: { flexDirection: 'row', alignItems: 'stretch', marginTop: 16 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: 'rgba(205,233,174,0.14)' },
  ledgerInner: { flex: 1, paddingHorizontal: 12 },
  ledgerValue: { fontSize: 20, lineHeight: 20, fontWeight: '800', color: '#F7FCED' },
  ledgerLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ledgerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(205,233,174,0.55)',
  },
  headerTail: { height: 16 },

  ticket: { marginTop: -4, borderRadius: 16, overflow: 'hidden', flexDirection: 'row' },
  ticketRail: { width: 6 },
  ticketBody: { flex: 1, paddingLeft: 14, paddingRight: 16, paddingTop: 16, paddingBottom: 16 },
  ticketHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ticketKicker: { fontSize: 10.5, letterSpacing: 1.47, fontWeight: '800', color: '#6B7C66' },
  clockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F6F8F3',
    borderWidth: 1,
    borderColor: '#E1E7DA',
  },
  clockText: { fontSize: 12, fontWeight: '800', color: '#33452F' },
  ticketTitle: { marginTop: 12, fontSize: 15.5, lineHeight: 20, fontWeight: '800', color: C.ink },
  ticketMeta: { marginTop: 4, fontSize: 11.5, fontWeight: '600', color: '#9AA995' },
  promptBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F6F8F3',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CFD9C6',
    borderRadius: 10,
  },
  promptText: { fontFamily: 'monospace', fontSize: 13, lineHeight: 18, color: C.ink },
  perforation: { marginTop: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#CFD9C6' },
  punchLeft: {
    position: 'absolute',
    left: -22,
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: SOLVER_BODY,
  },
  punchRight: {
    position: 'absolute',
    right: -18,
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: SOLVER_BODY,
  },
  ticketBottom: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rewardLedger: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rewardCol: { paddingRight: 12 },
  rewardDivider: { width: 1, height: 26, backgroundColor: '#E1E7DA' },
  rewardCoin: { fontSize: 15, lineHeight: 15, fontWeight: '800', color: '#B87A22' },
  rewardXp: { fontSize: 15, lineHeight: 15, fontWeight: '800', color: '#3560C4' },
  rewardUnit: { marginTop: 4, fontSize: 10, fontWeight: '700', color: '#9AA995' },
  claimedNote: { marginLeft: 12, fontSize: 10.5, fontWeight: '700', color: '#9AA995' },
  ticketCta: { height: 42, paddingHorizontal: 16, gap: 6, overflow: 'hidden' },
  ticketCtaText: { fontSize: 13 },

  chipRow: { marginTop: 24, marginHorizontal: -20 },
  chipRowInner: { paddingHorizontal: 20, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  chipActive: { backgroundColor: '#0E1A12' },
  chipIdle: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA' },
  chipText: { fontSize: 12.5, fontWeight: '800' },
  chipTextActive: { color: '#CDE9AE' },
  chipTextIdle: { color: '#6B7C66' },
  chipCount: { fontSize: 10.5, fontWeight: '700' },

  section: { marginTop: 24 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: '800', color: C.ink },
  sectionHint: { fontSize: 11, fontWeight: '700', color: '#9AA995' },
  sectionCount: { fontSize: 11.5, fontWeight: '700', color: '#6B7C66' },

  modesPanel: { flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' },
  modeCell: { width: '50%', padding: 14 },
  modeCellRightBorder: { borderRightWidth: 1, borderRightColor: '#EDF1E7' },
  modeCellTopBorder: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  modeTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  modeTile: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  proBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FCF1DC',
    borderWidth: 1,
    borderColor: 'rgba(232,163,61,0.4)',
  },
  proBadgeText: { fontSize: 9.5, letterSpacing: 0.76, fontWeight: '900', color: '#B87A22' },
  modeName: { marginTop: 10, fontSize: 13.5, lineHeight: 17, fontWeight: '800', color: C.ink },
  modeDesc: { marginTop: 4, fontSize: 11, lineHeight: 15, fontWeight: '500', color: C.ink3 },
  modeCoin: { marginTop: 8, fontSize: 12, fontWeight: '800', color: '#B87A22' },

  tiersCard: { paddingHorizontal: 14, paddingVertical: 16 },
  tierBars: { flexDirection: 'row', gap: 6 },
  tierBarCell: { flex: 1, height: 7 },
  tierBarFill: { flex: 1, borderRadius: 4 },
  tierLabels: { flexDirection: 'row', gap: 6, marginTop: 12 },
  tierLabelCell: { flex: 1 },
  tierName: { fontSize: 11, lineHeight: 14, fontWeight: '800' },
  tierNeed: { marginTop: 2, fontSize: 10, fontWeight: '700', color: '#9AA995' },

  missionsPanel: { overflow: 'hidden' },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  missionRowBorder: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  missionBox: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  missionBoxOn: { backgroundColor: '#7ED321', borderWidth: 1, borderColor: '#7ED321' },
  missionBoxOff: { backgroundColor: '#F6F8F3', borderWidth: 1, borderColor: '#E1E7DA' },
  missionBody: { flex: 1, minWidth: 0 },
  missionLabel: { fontSize: 13, fontWeight: '800', color: C.ink },
  missionBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  missionDetail: { fontSize: 10.5, fontWeight: '700', color: '#6B7C66' },
  missionReward: { fontSize: 10.5, fontWeight: '800', color: '#B87A22' },
  missionCta: { height: 32, paddingHorizontal: 12, borderRadius: 12 },
  missionCtaText: { fontSize: 11.5 },

  setList: { gap: 12 },
  setRow: { borderRadius: 14, flexDirection: 'row', overflow: 'hidden' },
  setRail: { width: 4 },
  setBody: { flex: 1, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  setTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  setText: { flex: 1, minWidth: 0 },
  setTitle: { fontSize: 14.5, lineHeight: 19, fontWeight: '800', color: C.ink },
  setMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  setMeta: { fontSize: 11.5, fontWeight: '600', color: '#6B7C66' },
  setCta: { height: 36, paddingHorizontal: 14, borderRadius: 12, overflow: 'hidden' },
  setCtaText: { fontSize: 12 },
  setBottom: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  setCoin: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },
  setXp: { fontSize: 11.5, fontWeight: '800', color: '#3560C4' },
  setBarWrap: { flex: 1 },
  setCount: { fontSize: 11, fontWeight: '700' },

  barTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: '#EAEEE3', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },

  formulasCta: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderColor: '#CFD9C6',
  },
  formulasTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8F3',
    borderWidth: 1,
    borderColor: '#E1E7DA',
  },
  formulasText: { flex: 1 },
  formulasTitle: { fontSize: 13.5, fontWeight: '800', color: C.ink },
  formulasSub: { marginTop: 2, fontSize: 11.5, fontWeight: '500', color: '#6B7C66' },

  sheetRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(14,26,18,0.55)' },
  sheet: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sheetGrip: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E1E7DA', alignSelf: 'center', marginBottom: 14 },
  sheetKicker: { fontSize: 10.5, letterSpacing: 1.4, fontWeight: '800', color: '#6B7C66' },
  sheetTitle: { marginTop: 6, fontSize: 19, lineHeight: 24, fontWeight: '800', color: C.ink },
  sheetMeta: { marginTop: 4, fontSize: 12.5, lineHeight: 18, fontWeight: '600', color: '#6B7C66' },
  sheetRows: { marginTop: 14, backgroundColor: '#F7F9F6', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 14 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  sheetK: { fontSize: 12, fontWeight: '700', color: '#6B7C66' },
  sheetV: { fontSize: 13, fontWeight: '800', color: C.ink },
  sheetPoor: { marginTop: 10, fontSize: 12, lineHeight: 18, fontWeight: '700', color: '#B87A22' },
  sheetBtns: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetCancel: {
    flex: 1, height: 50, alignItems: 'center', justifyContent: 'center',
    borderRadius: 100, backgroundColor: '#F1F4F0',
  },
  sheetCancelText: { fontSize: 13, fontWeight: '800', color: '#6B7C66' },
  sheetOk: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: '#7ED321', overflow: 'hidden' },
  sheetOkOff: { backgroundColor: '#E9EEE8' },
  sheetOkText: { fontSize: 13, fontWeight: '800', color: '#1C3214' },
  sheetOkTextOff: { color: '#9AA995' },
})

export default ProblemsScreen
