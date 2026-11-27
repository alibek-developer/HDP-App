import type { Question } from '../data/content'
import { PROBLEM_LEVELS } from '../data/problems.ts'

const source = PROBLEM_LEVELS.find(level => level.id === 'algebra-oson')?.questions[0]
if (!source) throw new Error('Demo savol topilmadi')

export const DEMO_QUESTION: Question = source

export type DemoAnswer = {
  questionId: string
  picked: number
  correct: boolean
}

export const answerDemoQuestion = (picked: number): DemoAnswer => ({
  questionId: DEMO_QUESTION.id,
  picked,
  correct: picked === DEMO_QUESTION.correct,
})

export const needsProfileName = (name: string) => name.trim().length < 3
