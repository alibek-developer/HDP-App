import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../store/useStore'
import { triggerHaptic } from '../lib/haptics'
import type { RootStackParamList } from '../navigation/types'
import { ABS_FILL, C, NUM } from '../theme/tokens'
import { CARD, GRAD_RAIL, LIME_BTN, LIME_TEXT, OUT_BTN, OUT_TEXT, SOLVER_BODY } from '../theme/solver'

/**
 * 7-qadam: Natija — nechta to'g'ri, qancha coin, va har bir xato uchun
 * «qanday to'g'rilash kerak» tushuntirishi.
 */

type Nav = NativeStackNavigationProp<RootStackParamList>

const TICK = { ok: '#5FAF22', bad: '#D9534F', todo: '#E1E7DA' }
const SKIP_TONE = '#E8A33D'

const ResultScreen = () => {
  const navigation = useNavigation<Nav>()
  const insets = useSafeAreaInsets()

  const result = useApp(s => s.lastResult)
  const coin = useApp(s => s.coin)

  /**
   * Natijaga kelish yo'li test/to'plam ekrani edi — ular tarixda qolmasin:
   * dars testidan Lesson'gacha 2 qadam, to'plamdan Masalalargacha 1 qadam.
   */
  const backSteps = result?.kind === 'lesson-test' ? 2 : 1

  const exit = () => {
    triggerHaptic('medium')
    if (navigation.canGoBack()) navigation.pop(Math.min(backSteps, 2))
    else navigation.replace('Home')
  }

  if (!result) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.emptyTile}>
          <Ionicons name="book-outline" size={22} color="#5FAF22" />
        </View>
        <Text style={styles.emptyTitle}>Natija topilmadi</Text>
        <Text style={styles.emptyText}>Avval test yoki to'plamni yakunlang.</Text>
        <Pressable
          onPress={() => {
            triggerHaptic('light')
            navigation.navigate('Home')
          }}
          style={({ pressed }) => [LIME_BTN, styles.emptyCta, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />
          <Text style={[styles.emptyCtaText, LIME_TEXT]}>Bosh sahifaga</Text>
        </Pressable>
      </View>
    )
  }

  const total = result.answers.length
  const correct = result.answers.filter(a => a.ok).length
  const skipped = result.answers.filter(a => a.skipped)
  const wrong = result.answers.filter(a => !a.ok && !a.skipped)
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  const tone = percent >= 80 ? TICK.ok : percent >= 50 ? SKIP_TONE : TICK.bad
  const done = result.answers.filter(a => a.ok)

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 110 + insets.bottom }]}
      >
        {/* ── Natija varaqasi ── */}
        <View style={styles.sheet}>
          <View style={[styles.card, { borderRadius: 16 }]}>
            <View style={[styles.rail, { width: 6, backgroundColor: tone }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardHead}>
                <View style={styles.cardHeadText}>
                  <Text style={styles.kicker}>
                    {result.kind === 'problem-set' ? "To'plam natijasi" : 'Test natijasi'}
                  </Text>
                  <Text style={styles.cardTitle}>{result.title}</Text>
                </View>
                <View style={styles.scoreWrap}>
                  <Text style={[styles.score, NUM]}>{correct}</Text>
                  <Text style={[styles.scoreTotal, NUM]}>/{total}</Text>
                </View>
              </View>

              <View style={styles.tickRow}>
                {result.answers.map((a, i) => (
                  <View
                    key={i}
                    style={[styles.tick, { backgroundColor: a.ok ? TICK.ok : a.skipped ? SKIP_TONE : TICK.bad }]}
                  />
                ))}
              </View>

              <View style={styles.tickFoot}>
                <Text style={[styles.percent, NUM, { color: tone }]}>
                  {percent}% {percent >= 80 ? '· ajoyib' : percent >= 50 ? '· yaxshi' : '· takrorlash kerak'}
                </Text>
                <Text style={[styles.wrongCount, NUM]}>
                  {wrong.length} ta xato{skipped.length > 0 ? ` · ${skipped.length} o'tkazildi` : ''}
                </Text>
              </View>

              {/* Mukofot ledger */}
              <View style={styles.ledger}>
                {[
                  { v: `+${result.coinsEarned}`, u: 'coin', c: '#B87A22' },
                  { v: `+${result.xpEarned}`, u: 'XP', c: '#3560C4' },
                  { v: `${coin.toLocaleString('en-US')}`, u: 'hamyonda', c: '#0E1A12' },
                ].map((cell, i) => (
                  <View key={cell.u} style={styles.ledgerCell}>
                    {i > 0 && <View style={styles.ledgerDivider} />}
                    <View style={styles.ledgerInner}>
                      <Text style={[styles.ledgerValue, NUM, { color: cell.c }]}>{cell.v}</Text>
                      <Text style={styles.ledgerUnit}>{cell.u}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── Topilgan xatolar ── */}
        {wrong.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Topilgan xatolar</Text>
              <Text style={[styles.sectionCount, NUM]}>{wrong.length} ta</Text>
            </View>

            <View style={styles.stack}>
              {wrong.map((a, i) => (
                <View key={i} style={[styles.card, { borderRadius: 14 }]}>
                  <View style={[styles.rail, { width: 4, backgroundColor: TICK.bad }]} />
                  <View style={styles.cardBody}>
                    <Text style={styles.prompt}>{a.prompt}</Text>

                    <View style={styles.answerRows}>
                      <View style={styles.answerRow}>
                        <View style={[styles.mark, { backgroundColor: '#FBE9E7' }]}>
                          <Ionicons name="close" size={11} color={TICK.bad} />
                        </View>
                        <Text style={styles.answerLabel}>Sizning javobingiz:</Text>
                        <Text style={styles.answerMine}>{a.options[a.picked] ?? '—'}</Text>
                      </View>
                      <View style={styles.answerRow}>
                        <View style={[styles.mark, { backgroundColor: '#DDF3DC' }]}>
                          <Ionicons name="checkmark" size={11} color={TICK.ok} />
                        </View>
                        <Text style={styles.answerLabel}>To'g'ri javob:</Text>
                        <Text style={styles.answerRight}>{a.options[a.correct]}</Text>
                      </View>
                    </View>

                    <View style={styles.explainBox}>
                      <Text style={styles.explainKicker}>Qanday to'g'rilash kerak</Text>
                      <Text style={styles.explainText}>{a.explain}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── O'tkazilgan savollar (buyum sarflangan) ── */}
        {skipped.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>O'tkazilganlar</Text>
              <Text style={[styles.sectionCount, NUM, { color: '#B87A22' }]}>{skipped.length} ta</Text>
            </View>

            <View style={styles.stack}>
              {skipped.map((a, i) => (
                <View key={i} style={[styles.card, { borderRadius: 14 }]}>
                  <View style={[styles.rail, { width: 4, backgroundColor: SKIP_TONE }]} />
                  <View style={styles.cardBody}>
                    <Text style={styles.prompt}>{a.prompt}</Text>
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>To'g'ri javob:</Text>
                      <Text style={styles.answerRight}>{a.options[a.correct]}</Text>
                    </View>
                    <View style={styles.explainBox}>
                      <Text style={styles.explainKicker}>Nima yodda qolishi kerak</Text>
                      <Text style={styles.explainText}>{a.explain}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Bajarilganlar ── */}
        {correct > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Bajarilganlar</Text>
              <Text style={[styles.sectionCount, NUM]}>{correct} ta</Text>
            </View>

            <View style={[styles.card, { overflow: 'hidden' }]}>
              {done.map((a, i) => (
                <View key={i} style={[styles.doneRow, i > 0 && styles.doneRowBorder]}>
                  <Ionicons name="checkmark" size={14} color={TICK.ok} />
                  <Text style={styles.donePrompt}>{a.prompt}</Text>
                  <Text style={[styles.doneAnswer, NUM]}>{a.options[a.correct]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {wrong.length === 0 && skipped.length === 0 && (
          <View style={styles.section}>
            <View style={styles.perfect}>
              <LinearGradient
                colors={GRAD_RAIL}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.rail, { width: 5 }]}
              />
              <View style={styles.perfectBody}>
                <Text style={styles.perfectTitle}>Xatosiz yakunladingiz</Text>
                <Text style={styles.perfectText}>
                  {result.kind === 'problem-set'
                    ? "To'plam to'liq yechildi."
                    : "Barcha savollarga to'g'ri javob berdingiz."}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Pastki harakat paneli ── */}
      <View style={[styles.dock, { paddingBottom: insets.bottom + 20 }]} pointerEvents="box-none">
        <View style={styles.dockInner} pointerEvents="auto">
          <View style={styles.dockRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('light')
                navigation.navigate('Home')
              }}
              style={({ pressed }) => [OUT_BTN, styles.dockBtn, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <Ionicons name="home-outline" size={15} color={C.ink2} />
              <Text style={[styles.dockBtnText, OUT_TEXT]}>Bosh sahifa</Text>
            </Pressable>

            <Pressable
              onPress={exit}
              style={({ pressed }) => [LIME_BTN, styles.dockBtn, { overflow: 'hidden' }, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient colors={GRAD_RAIL} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={ABS_FILL} />
              <Ionicons
                name={result.kind === 'lesson-test' ? 'book-outline' : 'refresh'}
                size={15}
                color="#1C3214"
              />
              <Text style={[styles.dockBtnText, LIME_TEXT]}>
                {result.kind === 'lesson-test' ? 'Davom etish' : 'Yana ishlash'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: SOLVER_BODY },
  content: {},
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },

  emptyTile: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF7DE',
    borderColor: '#CFD9C6',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: C.ink },
  emptyText: { fontSize: 12.5, fontWeight: '500', color: '#6B7C66', textAlign: 'center' },
  emptyCta: { marginTop: 8, height: 46, paddingHorizontal: 24, overflow: 'hidden' },
  emptyCtaText: { fontSize: 13.5 },

  sheet: { paddingHorizontal: 16 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 17, lineHeight: 22, fontWeight: '800', color: C.ink },
  sectionCount: { fontSize: 11.5, fontWeight: '700', color: '#6B7C66' },
  stack: { gap: 12 },

  card: { ...CARD, position: 'relative', flexDirection: 'row', overflow: 'hidden' },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  cardBody: { flex: 1, paddingLeft: 15, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },

  cardHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardHeadText: { flex: 1 },
  kicker: { fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66' },
  cardTitle: { marginTop: 8, fontSize: 14, fontWeight: '800', color: C.ink },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontSize: 34, lineHeight: 34, fontWeight: '800', color: C.ink },
  scoreTotal: { fontSize: 18, fontWeight: '800', color: '#9AA995' },

  tickRow: { marginTop: 16, flexDirection: 'row', gap: 6 },
  tick: { flex: 1, height: 6, borderRadius: 3 },
  tickFoot: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  percent: { fontSize: 11.5, fontWeight: '800' },
  wrongCount: { fontSize: 11.5, fontWeight: '700', color: '#9AA995' },

  ledger: { marginTop: 16, flexDirection: 'row', alignItems: 'stretch', borderTopWidth: 1, borderTopColor: '#EDF1E7', paddingTop: 14 },
  ledgerCell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  ledgerDivider: { width: 1, backgroundColor: '#EDF1E7' },
  ledgerInner: { flex: 1, alignItems: 'center' },
  ledgerValue: { fontSize: 17, lineHeight: 17, fontWeight: '800' },
  ledgerUnit: { marginTop: 6, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: '#9AA995' },

  prompt: { fontSize: 14, lineHeight: 20, fontWeight: '800', color: C.ink },
  answerRows: { marginTop: 12, gap: 6 },
  answerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  mark: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  answerLabel: { fontSize: 12.5, fontWeight: '500', color: '#6B7C66' },
  answerMine: { fontSize: 12.5, fontWeight: '800', color: '#8C2F2C' },
  answerRight: { fontSize: 12.5, fontWeight: '800', color: '#0B6E4F' },

  explainBox: { marginTop: 12, paddingLeft: 12, paddingTop: 10, paddingBottom: 10, paddingRight: 12, backgroundColor: '#FBFCF8', borderLeftWidth: 2, borderLeftColor: '#E1E7DA' },
  explainKicker: { fontSize: 10.5, letterSpacing: 1.26, textTransform: 'uppercase', fontWeight: '800', color: '#6B7C66', marginBottom: 4 },
  explainText: { fontSize: 13, lineHeight: 19, color: C.ink2 },

  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  doneRowBorder: { borderTopWidth: 1, borderTopColor: '#EDF1E7' } as ViewStyle,
  donePrompt: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '600', color: C.ink2 },
  doneAnswer: { fontSize: 12, fontWeight: '800', color: '#0B6E4F' },

  perfect: { backgroundColor: '#0E1A12', borderRadius: 14, overflow: 'hidden', flexDirection: 'row' },
  perfectBody: { flex: 1, paddingLeft: 15, paddingRight: 14, paddingTop: 14, paddingBottom: 14 },
  perfectTitle: { fontSize: 15, fontWeight: '800', color: '#9BE04B' },
  perfectText: { marginTop: 4, fontSize: 12.5, fontWeight: '500', color: 'rgba(205,233,174,0.6)' },

  dock: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  dockInner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(243,247,238,0.94)',
    borderTopWidth: 1,
    borderTopColor: '#E1E7DA',
  },
  dockRow: { flexDirection: 'row', gap: 10 },
  dockBtn: { flex: 1, height: 50, gap: 6 },
  dockBtnText: { fontSize: 13.5 },
})

export default ResultScreen
