import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GridPaper } from './GridPaper'
import { ABS_FILL, MATH_FONT, NUM, shadow, type ThemeColors } from '../theme/tokens'
import { useColors } from '../theme/useTheme'
import { GRAD_LIME, GRAD_RAIL } from '../theme/solver'

/**
 * Yechish ekranlarining savol qurilmasi — daraja sessiyasi, mavzu testi,
 * kunlik masala va blitz shu to'rt qismdan yig'iladi. Naqshlar ochiq manba
 * dizayn tizimlaridan (Duolingo DESIGN.md, barmoq zonasi bo'yicha NN/g
 * tavsiyalari) olingan:
 * — progress: pill bo'linmalar + tabular hisob (9999 radius, 8 px);
 * — variant: 2 px chegara, 16 radius, 32 px harf chipi, tanlovda lime halqa;
 * — harakat: pastga 4 px botadigan «chuqur» tugma;
 * — asosiy tugma ekran tubida qotiriladi — barmoq zonasida, 48+ px nishon.
 */


/* ── Progress: sarlavha + hisob + bo'linmalar ── */

export const SolveProgress = ({
  total,
  current,
  label,
  columns = 0,
  style,
}: {
  total: number
  current: number
  label?: string
  /** 0 dan katta bo'lsa bo'linmalar shu ustunlar bilan qatorlarga bo'linadi (30 savolli test) */
  columns?: number
  style?: StyleProp<ViewStyle>
}) => {
  const C = useColors()
  const s = makeS(C)
  return (
  <View style={[s.progress, style]}>
    <View style={s.progressTop}>
      {label ? (
        <Text style={s.progressLabel} numberOfLines={1}>
          {label}
        </Text>
      ) : (
        <View style={s.progressGap} />
      )}
      <View style={s.counter}>
        <Text style={[s.counterNow, NUM]}>{Math.min(current + 1, total)}</Text>
        <Text style={[s.counterRest, NUM]}>/{total}</Text>
      </View>
    </View>

    {columns > 0 ? (
      <View style={s.grid}>
        {Array.from({ length: Math.ceil(total / columns) }, (_, r) => (
          <View key={r} style={s.gridRow}>
            {Array.from({ length: columns }, (_, j) => {
              const i = r * columns + j
              return (
                <View
                  key={j}
                  style={[
                    s.gridCell,
                    i < current && s.cellDone,
                    i === current && s.cellNow,
                    i >= total && s.gridCellGhost,
                  ]}
                />
              )
            })}
          </View>
        ))}
      </View>
    ) : (
      <View style={s.segRow}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[s.segment, i < current && s.cellDone, i === current && s.cellNow]}
          />
        ))}
      </View>
    )}
  </View>
  )
}

/* ── Savol: katak qog'ozli karta ── */

export const QuestionStage = ({
  prompt,
  badge,
  size = 'lg',
  style,
}: {
  prompt: string
  badge?: ReactNode
  size?: 'lg' | 'md'
  style?: StyleProp<ViewStyle>
}) => {
  const C = useColors()
  const s = makeS(C)
  return (
  <View style={[s.stage, style]}>
    <GridPaper band={520} />
    <LinearGradient
      colors={GRAD_RAIL}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={s.stageRail}
    />
    <View style={s.stageBody}>
      {badge}
      <Text style={[s.stagePrompt, size === 'md' && s.stagePromptMd]}>{prompt}</Text>
    </View>
  </View>
  )
}

/* ── Variant ── */

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim'

export const AnswerOption = ({
  letter,
  label,
  state = 'idle',
  onPress,
  disabled,
  compact,
  style,
}: {
  letter: string
  label: string
  state?: OptionState
  onPress: () => void
  disabled?: boolean
  /** Blitz kabi 2×2 to'rlarda — chip tepada, matn pastda */
  compact?: boolean
  style?: StyleProp<ViewStyle>
}) => {
  const C = useColors()
  const s = makeS(C)
  const lit = state === 'selected' || state === 'correct'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || state === 'dim'}
      accessibilityRole="radio"
      accessibilityLabel={`${letter}. ${label}`}
      aria-checked={state === 'selected' || state === 'correct'}
      accessibilityState={{ disabled: !!disabled || state === 'dim' }}
      style={({ pressed }) => [
        s.option,
        compact && s.optionCompact,
        state === 'idle' && s.optionIdle,
        state === 'selected' && s.optionSelected,
        state === 'correct' && s.optionCorrect,
        state === 'wrong' && s.optionWrong,
        state === 'dim' && s.optionDim,
        pressed && !disabled && state !== 'dim' && s.optionPressed,
        style,
      ]}
    >
      <View
        style={[
          s.chip,
          compact && s.chipCompact,
          lit && s.chipLit,
          state === 'correct' && s.chipCorrect,
          state === 'wrong' && s.chipWrong,
        ]}
      >
        {lit && (
          <LinearGradient
            colors={GRAD_LIME}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[ABS_FILL, { borderRadius: compact ? 8 : 10 }]}
          />
        )}
        <Text
          style={[
            s.chipText,
            compact && s.chipTextCompact,
            lit && s.chipTextLit,
            state === 'wrong' && { color: C.danger },
          ]}
        >
          {letter}
        </Text>
      </View>

      <Text
        style={[
          s.optionLabel,
          compact && s.optionLabelCompact,
          (state === 'selected' || state === 'correct') && s.optionLabelLit,
          state === 'wrong' && { color: '#8C2F26' },
        ]}
        numberOfLines={compact ? 2 : 3}
      >
        {label}
      </Text>

      {!compact && state === 'selected' && (
        <Ionicons name="checkmark-circle" size={19} color={C.limeDeep} />
      )}
      {!compact && state === 'correct' && (
        <Ionicons name="checkmark-circle" size={19} color="#4E9420" />
      )}
      {!compact && state === 'wrong' && (
        <Ionicons name="close-circle" size={19} color={C.danger} />
      )}
    </Pressable>
  )
}

/* ── Harakat ── */

export const SolveAction = ({
  label,
  onPress,
  disabled,
  tone = 'lime',
  icon = 'next',
  style,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  tone?: 'lime' | 'ink'
  icon?: 'next' | 'check' | 'none'
  style?: StyleProp<ViewStyle>
}) => {
  const C = useColors()
  const s = makeS(C)
  const ink = tone === 'ink'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[s.actionWrap, style]}
    >
      {({ pressed }) => (
        <>
          {!disabled && (
            <View style={[s.actionEdge, { backgroundColor: ink ? '#0A140E' : C.brand }]} />
          )}
          <View
            style={[
              s.actionFace,
              disabled && s.actionFaceOff,
              !disabled && { transform: [{ translateY: pressed ? 4 : 0 }] },
            ]}
          >
            {!disabled && (
              <LinearGradient
                colors={ink ? [C.brandDeep, C.brand] : GRAD_LIME}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[ABS_FILL, { borderRadius: 14 }]}
              />
            )}
            <Text
              style={[
                s.actionLabel,
                disabled
                  ? { color: C.ink4 }
                  : ink
                    ? { color: C.mint }
                    : { color: '#123B24' },
              ]}
            >
              {label}
            </Text>
            {!disabled && icon !== 'none' && (
              <Ionicons
                name={icon === 'check' ? 'checkmark' : 'chevron-forward'}
                size={18}
                color={ink ? C.mint : C.inkOnLime}
              />
            )}
          </View>
        </>
      )}
    </Pressable>
  )
}

/** Ekran tubida qotirilgan harakat zonasi — scroll kontenti ostida turadi */
export const SolveActionBar = ({
  note,
  bottom = 0,
  children,
}: {
  note?: string
  bottom?: number
  children: ReactNode
}) => {
  const C = useColors()
  const s = makeS(C)
  return (
  <View style={[s.bar, { paddingBottom: Math.max(bottom, 10) + 10 }]}>
    {note ? (
      <Text style={[s.barNote, NUM]} numberOfLines={2}>
        {note}
      </Text>
    ) : null}
    {children}
  </View>
  )
}

/** Ekran tepasida qotirilgan zona — savollar shu chegara ostidan siljiydi */
export const SolveTopBar = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>
  children: ReactNode
}) => {
  const C = useColors()
  const s = makeS(C)
  return <View style={[s.topBar, style]}>{children}</View>
}

const makeS = (C: ThemeColors) => StyleSheet.create({
  progress: { paddingHorizontal: 16 },
  progressTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressGap: { flex: 1 },
  progressLabel: { flex: 1, fontSize: 12, fontWeight: '600', color: C.ink3 },
  counter: {
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: C.surface,
    borderColor: C.line,
    borderWidth: 1,
  },
  counterNow: { fontSize: 13, fontWeight: '600', color: C.ink },
  counterRest: { fontSize: 11.5, fontWeight: '600', color: C.ink4 },

  segRow: { marginTop: 10, flexDirection: 'row', gap: 5 },
  segment: { flex: 1, height: 7, borderRadius: 9999, backgroundColor: C.lineSoft },
  cellDone: { backgroundColor: C.limeDeep },
  cellNow: { backgroundColor: C.ink },

  grid: { marginTop: 10, gap: 4 },
  gridRow: { flexDirection: 'row', gap: 4 },
  gridCell: { flex: 1, height: 6, borderRadius: 9999, backgroundColor: C.lineSoft },
  gridCellGhost: { backgroundColor: 'transparent' },

  stage: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 18,
    ...shadow(C.ink, 12, 5, 0.05),
  },
  stageRail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  stageBody: { paddingLeft: 18, paddingRight: 16, paddingVertical: 18 },
  stagePrompt: {
    fontFamily: MATH_FONT,
    fontSize: 20,
    lineHeight: 29,
    color: C.ink,
  },
  stagePromptMd: { fontSize: 17.5, lineHeight: 26 },

  option: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E9E0',
    backgroundColor: C.surface,
  },
  optionCompact: {
    minHeight: 82,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
  },
  optionIdle: {},
  optionSelected: {
    borderColor: C.lime,
    backgroundColor: '#F7FDEE',
    ...shadow(C.limeDeep, 8, 3, 0.14),
  },
  optionCorrect: { borderColor: C.limeDeep, backgroundColor: C.surface2 },
  optionWrong: { borderColor: C.danger, backgroundColor: '#FDF2F0' },
  optionDim: { opacity: 0.5 },
  optionPressed: { backgroundColor: '#F4F7EF' },

  chip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F5EF',
    borderColor: C.line,
    borderWidth: 1,
  },
  chipCompact: { width: 26, height: 26, borderRadius: 8 },
  chipLit: { backgroundColor: C.lime, borderColor: C.lime, overflow: 'hidden' },
  chipCorrect: { backgroundColor: C.limeDeep, borderColor: C.limeDeep },
  chipWrong: { backgroundColor: C.dangerSoft, borderColor: '#EFC9C4' },
  chipText: { fontSize: 13, fontWeight: '600', color: C.ink3 },
  chipTextCompact: { fontSize: 11 },
  chipTextLit: { color: C.inkOnLime },

  optionLabel: { flex: 1, fontSize: 15, lineHeight: 21, fontWeight: '600', color: C.ink },
  optionLabelCompact: { flex: 0, fontSize: 14, lineHeight: 19 },
  optionLabelLit: { color: C.inkOnLime },

  actionWrap: { height: 56, borderRadius: 16 },
  actionEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 4,
    bottom: 0,
    borderRadius: 16,
  },
  actionFace: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 4,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.lime,
    ...shadow(C.limeDeep, 7, 4, 0.28),
  },
  actionFaceOff: {
    backgroundColor: '#EAEEE3',
    borderColor: '#DFE5D8',
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionLabel: { fontSize: 15, fontWeight: '600', letterSpacing: 0.1 },

  topBar: {
    paddingBottom: 12,
    backgroundColor: C.solverBody,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  bar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: C.solverBody,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  barNote: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: C.ink4,
  },
})
