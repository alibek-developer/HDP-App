import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import type { ScrollViewInstance, TextStyle, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Clipboard from 'expo-clipboard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { triggerHaptic } from '../lib/haptics'
import { Reveal } from '../components/Reveal'
import type { RootStackParamList } from '../navigation/types'
import { PROBLEM_SETS } from '../data/content'
import { ABS_FILL, C, NUM, shadow } from '../theme/tokens'
import {
  CARD, GRAD_HEADER, GRAD_LIME, INK_BTN, INK_TEXT, LIME_BTN, LIME_TEXT, SOLVER_BODY,
} from '../theme/solver'

type Nav = NativeStackNavigationProp<RootStackParamList>

interface Formula {
  title: string
  formula: string
  desc: string
}
interface Group {
  cat: string
  rail: string
  tint: string
  ink: string
  items: Formula[]
}

/**
 * Formulalar qo'llanmasi — "davotar" varaq tilida.
 * Har mavzu o'z rengi (chap reys + tint) bilan belgilanadi.
 */
const FORMULAS: Group[] = [
  {
    cat: 'Algebra',
    rail: '#5FAF22', tint: '#DDF3DC', ink: '#0B4A34',
    items: [
      { title: 'Viyet Teoremasi', formula: 'x₁ + x₂ = −b/a  ·  x₁ · x₂ = c/a', desc: 'Kvadrat tenglama ildizlari xossasi' },
      { title: 'Qisqa ko\'paytirish (kub)', formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)', desc: 'Kublar yig\'indisi va ayirmasi' },
      { title: 'Arifmetik progressiya', formula: 'Sₙ = n(a₁ + aₙ)/2 = n(2a₁ + d(n−1))/2', desc: 'n ta hadning yig\'indisi' },
    ],
  },
  {
    cat: 'Trigonometriya',
    rail: '#4C7DF0', tint: '#E5ECFE', ink: '#3560C4',
    items: [
      { title: 'Asosiy tenglik', formula: 'sin²α + cos²α = 1', desc: 'Pythagorean identichlik' },
      { title: 'Ikkilangan burchak (sin)', formula: 'sin(2α) = 2 sin α · cos α', desc: 'Ikkilangan burchak formulasi' },
      { title: 'Keltirish formulasi', formula: 'sin(π/2 − α) = cos α  ·  cos(π/2 − α) = sin α', desc: 'π/2 bo\'yicha reduksiya' },
    ],
  },
  {
    cat: 'Analiz',
    rail: '#E8A33D', tint: '#FCF1DC', ink: '#B87A22',
    items: [
      { title: 'Zanjir qoidasi', formula: '(f(g(x)))′ = f′(g(x)) · g′(x)', desc: 'Murakkab funksiya hosilasi' },
      { title: 'Integratsiya qoidasi', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C, (n ≠ −1)', desc: 'Daraja funksiyasi integrali' },
    ],
  },
  {
    cat: 'Geometriya',
    rail: '#D9534F', tint: '#FBE9E7', ink: '#8C2F2C',
    items: [
      { title: 'Kosinuslar teoremasi', formula: 'a² = b² + c² − 2bc · cos(α)', desc: 'Ixtiyoriy uchburchak uchun' },
      { title: 'Aylana uzunligi / yuza', formula: 'C = 2πr  ·  S = πr²', desc: 'Radius orqali' },
    ],
  },
]

interface DetailState {
  cat: string
  rail: string
  tint: string
  ink: string
  title: string
  formula: string
  desc: string
}

const FormulasScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollViewInstance>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [detail, setDetail] = useState<DetailState | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleCopy = (text: string, id: string) => {
    Clipboard.setStringAsync(text).then(ok => {
      if (!ok) return
      triggerHaptic('success')
      setCopiedId(id)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedId(null), 1800)
    }).catch(() => {})
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return FORMULAS
      .filter(g => !activeCat || g.cat === activeCat)
      .map(g => ({
        ...g,
        items: g.items.filter(
          f => !query || f.title.toLowerCase().includes(query) || f.formula.toLowerCase().includes(query)
        ),
      }))
      .filter(g => g.items.length > 0)
  }, [search, activeCat])

  const total = FORMULAS.reduce((n, g) => n + g.items.length, 0)

  const openProblems = () => {
    triggerHaptic('medium')
    const setId = detail ? PROBLEM_SETS.find(s => s.topic === detail.cat)?.id : undefined
    setDetail(null)
    if (setId) navigation.navigate('ProblemSet', { setId })
    else navigation.navigate('Main', { screen: 'Problems' })
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 }]}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => { triggerHaptic('light'); navigation.goBack() }}
            style={({ pressed }) => [styles.backBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="chevron-back" size={17} color="#33452F" />
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>Qo'llanma</Text>
            <Text style={styles.h1}>Formulalar</Text>
          </View>

          <Pressable
            onPress={() => { triggerHaptic('medium'); navigation.navigate('Blitz') }}
            style={({ pressed }) => [styles.blitzBtn, pressed && { transform: [{ scale: 0.96 }] }]}
          >
            <Ionicons name="flash" size={15} color="#B87A22" />
            <Text style={[styles.blitzText, NUM]}>Blitz</Text>
          </Pressable>
        </View>

        {/* ── Qidiruv ── */}
        <View style={styles.searchWrap}>
          <View style={[CARD, styles.searchCard]}>
            <Ionicons name="search" size={16} color="#9AA995" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Formula yoki mavzu qidirish..."
              placeholderTextColor="#9AA995"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
                <Ionicons name="close" size={16} color="#9AA995" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Mavzu chiplari ── */}
        <View style={styles.chipsWrap}>
          <Pressable
            onPress={() => { triggerHaptic('selection'); setActiveCat(null) }}
            style={({ pressed }) => [
              styles.chipBase,
              styles.chipAll,
              !activeCat ? INK_BTN : styles.chipAllIdle,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={[styles.chipAllText, NUM, activeCat ? { color: '#6B7C66' } : INK_TEXT]}>
              Barchasi · {total}
            </Text>
          </Pressable>

          {FORMULAS.map(g => {
            const on = activeCat === g.cat
            const chipStyle: ViewStyle = on
              ? { backgroundColor: g.tint, borderColor: g.rail }
              : styles.chipIdle
            const labelStyle: TextStyle = { color: on ? g.ink : '#6B7C66' }
            return (
              <Pressable
                key={g.cat}
                onPress={() => { triggerHaptic('selection'); setActiveCat(on ? null : g.cat) }}
                style={({ pressed }) => [styles.chipBase, styles.chip, chipStyle, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                <View style={[styles.chipRail, { backgroundColor: g.rail }]} />
                <Text style={[styles.chipLabel, labelStyle]}>{g.cat}</Text>
              </Pressable>
            )
          })}
        </View>

        {/* ── Formulalar varaqlari ── */}
        {filtered.map(group => (
          <View key={group.cat} style={styles.group}>
            <View style={styles.groupHead}>
              <Text style={styles.groupTitle}>{group.cat}</Text>
              <View style={styles.groupLine} />
              <View style={[styles.groupCount, { backgroundColor: group.tint }]}>
                <Text style={[styles.groupCountText, NUM, { color: group.ink }]}>{group.items.length}</Text>
              </View>
            </View>

            <View style={[CARD, styles.panel]}>
              {group.items.map((f, i) => {
                const id = `${group.cat}-${i}`
                const copied = copiedId === id
                return (
                  <Pressable
                    key={i}
                    onPress={() => {
                      triggerHaptic('light')
                      setDetail({
                        cat: group.cat, rail: group.rail, tint: group.tint, ink: group.ink,
                        title: f.title, formula: f.formula, desc: f.desc,
                      })
                    }}
                    style={({ pressed }) => [
                      styles.row,
                      i > 0 && styles.rowBorder,
                      pressed && { backgroundColor: '#FBFCF8' },
                    ]}
                  >
                    <View style={[styles.rowRail, { backgroundColor: group.rail }]} />
                    <View style={styles.rowBody}>
                      <View style={styles.rowHead}>
                        <View style={styles.rowText}>
                          <Text style={styles.rowTitle}>{f.title}</Text>
                          <Text style={styles.rowDesc}>{f.desc}</Text>
                        </View>
                        <Pressable
                          onPress={() => handleCopy(f.formula, id)}
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.copyBtn,
                            { backgroundColor: copied ? '#DDF3DC' : group.tint },
                            pressed && { opacity: 0.7 },
                          ]}
                        >
                          <Ionicons
                            name={copied ? 'checkmark' : 'copy'}
                            size={copied ? 14 : 13}
                            color={copied ? '#0B6E4F' : group.ink}
                          />
                        </Pressable>
                      </View>

                      <View style={styles.formulaBox}>
                        <Text style={[styles.formulaText, { color: group.ink }]}>{f.formula}</Text>
                      </View>
                    </View>
                  </Pressable>
                )
              })}
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyTile}>
              <Ionicons name="search" size={20} color="#9AA995" />
            </View>
            <Text style={styles.emptyTitle}>Hech narsa topilmadi</Text>
            <Text style={styles.emptySub}>Boshqa mavzu yoki formula belgisini sinab ko'ring.</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Formula tafsilotlari ── */}
      <Modal visible={!!detail} transparent animationType="none" onRequestClose={() => setDetail(null)}>
        {detail && (
          <View style={styles.modalRoot}>
            <Pressable onPress={() => setDetail(null)} style={[ABS_FILL, styles.backdrop]} />
            <Reveal y={40} duration={260} style={styles.sheetOuter}>
              <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
                <View style={styles.handle} />

                <View style={[styles.sheetCat, { backgroundColor: detail.tint }]}>
                  <Text style={[styles.sheetCatText, NUM, { color: detail.ink }]}>{detail.cat}</Text>
                </View>
                <Text style={styles.sheetTitle}>{detail.title}</Text>
                <Text style={styles.sheetDesc}>{detail.desc}</Text>

                <View style={styles.detailBox}>
                  <LinearGradient colors={GRAD_HEADER} start={{ x: 0.15, y: 0 }} end={{ x: 0.6, y: 1 }} style={ABS_FILL} />
                  <View style={[styles.detailRail, { backgroundColor: detail.rail }]} />
                  <View style={styles.detailInner}>
                    <Text style={styles.detailKicker}>Formula</Text>
                    <Text style={styles.detailFormula}>{detail.formula}</Text>
                  </View>
                </View>

                <Pressable
                  onPress={openProblems}
                  style={({ pressed }) => [LIME_BTN, styles.solveBtn, pressed && { transform: [{ scale: 0.985 }] }]}
                >
                  <LinearGradient colors={GRAD_LIME} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ABS_FILL} />
                  <Ionicons name="calculator" size={16} color="#1C3214" style={styles.fg} />
                  <Text style={[styles.solveText, LIME_TEXT, styles.fg]}>Bu mavzuda masala yechish</Text>
                </Pressable>
              </View>
            </Reveal>
          </View>
        )}
      </Modal>

      {/* ── Toast ── */}
      {!!copiedId && (
        <View pointerEvents="none" style={styles.toastWrap}>
          <Reveal y={20} duration={220} style={styles.toast}>
            <Ionicons name="checkmark" size={14} color="#9BE04B" />
            <Text style={styles.toastText}>Formula nusxalandi</Text>
          </Reveal>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: { paddingHorizontal: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 },
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
  titleBlock: { flex: 1, minWidth: 0, paddingHorizontal: 12, alignItems: 'center' },
  kicker: { fontSize: 11.5, fontWeight: '700', color: '#6B7C66' },
  h1: { marginTop: 2, fontSize: 15, lineHeight: 18, fontWeight: '800', color: C.ink },
  blitzBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 10,
    backgroundColor: '#FCF1DC',
    borderWidth: 1,
    borderColor: '#E8A33D',
    borderRadius: 12,
  },
  blitzText: { fontSize: 11.5, fontWeight: '800', color: '#B87A22' },

  searchWrap: { marginBottom: 12 },
  searchCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#0E1A12', paddingVertical: 0 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chipBase: { height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chipAll: { paddingHorizontal: 12 },
  chipAllIdle: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E7DA' },
  chipAllText: { fontSize: 11.5, fontWeight: '800' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8, paddingRight: 12, borderWidth: 1 },
  chipIdle: { backgroundColor: '#FFFFFF', borderColor: '#E1E7DA' },
  chipRail: { width: 5, height: 16, borderRadius: 3 },
  chipLabel: { fontSize: 11.5, fontWeight: '800' },

  group: { marginBottom: 20 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, paddingHorizontal: 4 },
  groupTitle: { fontSize: 12.5, fontWeight: '800', color: '#33452F' },
  groupLine: { flex: 1, height: 1, backgroundColor: '#CFD9C6' },
  groupCount: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  groupCountText: { fontSize: 10, fontWeight: '800' },

  panel: { borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', backgroundColor: '#FFFFFF', overflow: 'hidden' },
  rowBorder: { borderTopWidth: 1, borderTopColor: '#EDF1E7' },
  rowRail: { width: 4 },
  rowBody: { flex: 1, paddingLeft: 16, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  rowHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 13.5, lineHeight: 18, fontWeight: '800', color: C.ink },
  rowDesc: { marginTop: 4, fontSize: 11.5, lineHeight: 15, fontWeight: '600', color: '#6B7C66' },
  copyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  formulaBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FBFCF8',
    borderWidth: 1,
    borderColor: '#E1E7DA',
    borderRadius: 10,
  },
  formulaText: { fontFamily: 'monospace', fontSize: 12.5, lineHeight: 19, fontWeight: '700', textAlign: 'center' },

  empty: { alignItems: 'center', paddingVertical: 56 },
  emptyTile: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF7DE',
    borderWidth: 1,
    borderColor: '#CFD9C6',
    borderRadius: 16,
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: C.ink },
  emptySub: { marginTop: 4, fontSize: 12, fontWeight: '500', color: '#6B7C66' },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: 'rgba(14,26,18,0.55)' },
  sheetOuter: { width: '100%', maxWidth: 430, alignSelf: 'center' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 12,
    ...shadow('#0E1A12', 32, -12, 0.18),
  },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E1E7DA', alignSelf: 'center', marginBottom: 16 },
  sheetCat: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, marginBottom: 8 },
  sheetCatText: { fontSize: 11, fontWeight: '800' },
  sheetTitle: { fontSize: 18, lineHeight: 23, fontWeight: '800', color: C.ink },
  sheetDesc: { marginTop: 6, fontSize: 12.5, fontWeight: '600', color: '#6B7C66' },

  detailBox: { marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  detailRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  detailInner: { paddingLeft: 20, paddingRight: 16, paddingTop: 20, paddingBottom: 20 },
  detailKicker: { fontSize: 11.5, fontWeight: '700', color: 'rgba(205,233,174,0.5)' },
  detailFormula: { marginTop: 10, fontFamily: 'monospace', fontSize: 15, lineHeight: 22, fontWeight: '700', textAlign: 'center', color: '#F7FCED' },

  solveBtn: { marginTop: 16, height: 52, gap: 8, overflow: 'hidden' },
  solveText: { fontSize: 14.5 },
  fg: { position: 'relative' },

  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: 96, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0E1A12',
    borderRadius: 12,
    ...shadow('#0E1A12', 24, 10, 0.28),
  },
  toastText: { fontSize: 12.5, fontWeight: '800', color: '#CDE9AE' },
})

export default FormulasScreen
