/**
 * Kunlik AI masala — server (relay) orqali OpenRouter'ga murojaat.
 * API kaliti ilovada emas, serverda turadi.
 */

const API =
  process.env.EXPO_PUBLIC_API_BASE ||
  process.env.EXPO_PUBLIC_TELEGRAM_RELAY ||
  'https://hdp-academy-auth.netlify.app'

export type AiDifficulty = 'oson' | "o'rta" | 'qiyin'

export type AiTopic = { num: number; title: string }

export type AiQuestion = {
  prompt: string
  options: string[]
  correct: number
  explain: string
  topic: string
}

const valid = (value: unknown): value is AiQuestion => {
  if (!value || typeof value !== 'object') return false
  const q = value as Record<string, unknown>
  return (
    typeof q.prompt === 'string' &&
    q.prompt.length > 0 &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every(o => typeof o === 'string' && o.length > 0) &&
    typeof q.correct === 'number' &&
    Number.isInteger(q.correct) &&
    q.correct >= 0 &&
    q.correct <= 3 &&
    typeof q.explain === 'string'
  )
}

export async function askAiQuestion(
  input: {
    topics: AiTopic[]
    difficulty: AiDifficulty
    avoid?: string[]
  },
  opts?: { timeoutMs?: number },
): Promise<AiQuestion> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), opts?.timeoutMs ?? 35_000)
  try {
    const res = await fetch(`${API}/api/ai-question`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error(`ai ${res.status}`)
    const data = (await res.json()) as { question?: unknown }
    if (!valid(data.question)) throw new Error('ai shape')
    return {
      prompt: data.question.prompt,
      options: data.question.options,
      correct: data.question.correct,
      explain: data.question.explain,
      topic: typeof data.question.topic === 'string' ? data.question.topic : '',
    }
  } finally {
    clearTimeout(timer)
  }
}
