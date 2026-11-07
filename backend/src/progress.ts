import { authenticate } from './auth'
import type { Env } from './env'
import { json } from './http'

// 'mavzu-1/1.1' — mavzu va dars identifikatorlari
const LESSON_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}\/[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/
const STATES = new Set(['started', 'completed'])

type ProgressRow = { lesson_id: string; state: string; score: number | null; updated_at: number }

export const me = async (request: Request, env: Env) => {
  const user = await authenticate(request, env)
  if (!user) return json({ error: 'unauthorized' }, 401)

  const counts = await env.DB.prepare(
    `select
       sum(case when state = 'completed' then 1 else 0 end) as completed,
       sum(case when state = 'started' then 1 else 0 end) as started
     from progress where user_id = ?`
  )
    .bind(user.id)
    .first<{ completed: number | null; started: number | null }>()

  return json({
    user: { name: user.name, username: user.username, telegramId: user.telegramId },
    progress: { completed: counts?.completed ?? 0, started: counts?.started ?? 0 },
  })
}

export const getProgress = async (request: Request, env: Env) => {
  const user = await authenticate(request, env)
  if (!user) return json({ error: 'unauthorized' }, 401)

  const { results } = await env.DB.prepare(
    'select lesson_id, state, score, updated_at from progress where user_id = ? order by updated_at desc'
  )
    .bind(user.id)
    .all<ProgressRow>()

  return json({
    items: results.map((row) => ({
      lessonId: row.lesson_id,
      state: row.state,
      score: row.score,
      updatedAt: row.updated_at,
    })),
  })
}

export const putProgress = async (request: Request, env: Env) => {
  const user = await authenticate(request, env)
  if (!user) return json({ error: 'unauthorized' }, 401)

  let body: { lessonId?: unknown; state?: unknown; score?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_body' }, 400)
  }

  const lessonId = typeof body.lessonId === 'string' ? body.lessonId : ''
  const state = typeof body.state === 'string' ? body.state : ''
  const score = body.score === undefined || body.score === null ? null : Number(body.score)

  if (!LESSON_ID.test(lessonId)) return json({ error: 'invalid_lesson' }, 400)
  if (!STATES.has(state)) return json({ error: 'invalid_state' }, 400)
  if (score !== null && (!Number.isInteger(score) || score < 0 || score > 1000)) {
    return json({ error: 'invalid_score' }, 400)
  }

  await env.DB.prepare(
    `insert into progress (user_id, lesson_id, state, score, updated_at)
     values (?, ?, ?, ?, ?)
     on conflict(user_id, lesson_id) do update set
       state = case when progress.state = 'completed' then 'completed' else excluded.state end,
       score = coalesce(excluded.score, progress.score),
       updated_at = excluded.updated_at`
  )
    .bind(user.id, lessonId, state, score, Date.now())
    .run()

  return json({ ok: true })
}
