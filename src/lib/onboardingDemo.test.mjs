import test from 'node:test'
import assert from 'node:assert/strict'
import { PROBLEM_LEVELS } from '../data/problems.ts'
import { DEMO_QUESTION, answerDemoQuestion, needsProfileName } from './onboardingDemo.ts'

test('demo savol real algebra bankidan birinchi savol bo\'ladi', () => {
  const source = PROBLEM_LEVELS.find(level => level.id === 'algebra-oson')?.questions[0]
  assert.ok(source)
  assert.equal(DEMO_QUESTION.id, source.id)
  assert.equal(DEMO_QUESTION.prompt, source.prompt)
  assert.deepEqual(DEMO_QUESTION.options, source.options)
  assert.equal(DEMO_QUESTION.options.length, 4)
  assert.ok(DEMO_QUESTION.correct >= 0 && DEMO_QUESTION.correct < DEMO_QUESTION.options.length)
})

test('to\'g\'ri variant tanlansa demo natijasi correct bo\'ladi', () => {
  const result = answerDemoQuestion(DEMO_QUESTION.correct)
  assert.equal(result.questionId, DEMO_QUESTION.id)
  assert.equal(result.picked, DEMO_QUESTION.correct)
  assert.equal(result.correct, true)
})

test('noto\'g\'ri variant tanlansa demo natijasi incorrect bo\'ladi', () => {
  const picked = (DEMO_QUESTION.correct + 1) % DEMO_QUESTION.options.length
  const result = answerDemoQuestion(picked)
  assert.equal(result.picked, picked)
  assert.equal(result.correct, false)
})

test('variant chegarasidan tashqari indeks incorrect bo\'ladi', () => {
  const result = answerDemoQuestion(DEMO_QUESTION.options.length + 1)
  assert.equal(result.correct, false)
})

test('Telegram ismi yetarli bo\'lsa profil qaytadan so\'ralmaydi', () => {
  assert.equal(needsProfileName('Alibek'), false)
  assert.equal(needsProfileName('  Ali Karimov  '), false)
})

test('Telegram ismi bo\'sh yoki qisqa bo\'lsa profil so\'raladi', () => {
  assert.equal(needsProfileName(''), true)
  assert.equal(needsProfileName('   '), true)
  assert.equal(needsProfileName('Al'), true)
})
