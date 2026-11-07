import assert from 'node:assert/strict'

const BASE = process.env.API_BASE || 'http://127.0.0.1:8787'
const SECRET = process.env.WEBHOOK_SECRET || 'local-only-test-secret'

const call = async (path, init = {}) => {
  const res = await fetch(`${BASE}${path}`, init)
  if (res.status === 204) return { status: res.status, body: null }
  const text = await res.text()
  let body = text
  try {
    body = JSON.parse(text)
  } catch {
    /* matn javobi (masalan 'forbidden') */
  }
  return { status: res.status, body }
}

const health = await call('/api/health')
assert.equal(health.status, 200)
assert.equal(health.body.ok, true)

const start = await call('/api/tg-start')
assert.equal(start.status, 200)
assert.match(start.body.nonce, /^[a-f0-9]{32}$/)
assert.ok(start.body.url.includes(start.body.nonce))

const pending = await call(`/api/tg-status?nonce=${start.body.nonce}`)
assert.equal(pending.body.status, 'pending')

const denied = await call('/api/telegram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-telegram-bot-api-secret-token': 'wrong' },
  body: '{}',
})
assert.equal(denied.status, 403)

const hook = await fetch(`${BASE}/api/telegram`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-telegram-bot-api-secret-token': SECRET },
  body: JSON.stringify({
    message: {
      chat: { id: 777 },
      from: { id: 777, first_name: 'Test', last_name: "O'quvchi", username: 'testuser' },
      text: `/start ${start.body.nonce}`,
    },
  }),
})
assert.equal(hook.status, 200)

const ready = await call(`/api/tg-status?nonce=${start.body.nonce}`)
assert.equal(ready.body.status, 'ready')
assert.equal(ready.body.user.name, "Test O'quvchi")
assert.equal(ready.body.token.length, 64)

const reused = await call(`/api/tg-status?nonce=${start.body.nonce}`)
assert.equal(reused.body.status, 'expired')

const invalid = await call('/api/tg-status?nonce=zzz')
assert.equal(invalid.status, 400)

const auth = { Authorization: `Bearer ${ready.body.token}` }
const me = await call('/api/v1/me', { headers: auth })
assert.equal(me.status, 200)
assert.equal(me.body.user.telegramId, 777)

const noAuth = await call('/api/v1/me')
assert.equal(noAuth.status, 401)

const lessonId = 'mavzu-9/' + Date.now()

const save = await call('/api/v1/progress', {
  method: 'PUT',
  headers: { ...auth, 'Content-Type': 'application/json' },
  body: JSON.stringify({ lessonId, state: 'completed', score: 8 }),
})
assert.equal(save.status, 200)

const downgrade = await call('/api/v1/progress', {
  method: 'PUT',
  headers: { ...auth, 'Content-Type': 'application/json' },
  body: JSON.stringify({ lessonId, state: 'started' }),
})
assert.equal(downgrade.status, 200)

const badLesson = await call('/api/v1/progress', {
  method: 'PUT',
  headers: { ...auth, 'Content-Type': 'application/json' },
  body: JSON.stringify({ lessonId: '../../etc/passwd', state: 'completed' }),
})
assert.equal(badLesson.status, 400)

const list = await call('/api/v1/progress', { headers: auth })
assert.equal(list.status, 200)
const saved = list.body.items.find((item) => item.lessonId === lessonId)
assert.equal(saved.state, 'completed')
assert.equal(saved.score, 8)

const after = await call('/api/v1/me', { headers: auth })
assert.ok(after.body.progress.completed >= 1)

const logout = await call('/api/v1/session', { method: 'DELETE', headers: auth })
assert.equal(logout.status, 200)

const dead = await call('/api/v1/me', { headers: auth })
assert.equal(dead.status, 401)

console.log('smoke: ok')
