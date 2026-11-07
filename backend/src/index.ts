import { pollLogin, revokeSession, startLogin, telegramWebhook } from './auth'
import type { Env } from './env'
import { json, preflight } from './http'
import { getProgress, me, putProgress } from './progress'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return preflight()

    switch (`${request.method} ${url.pathname}`) {
      case 'GET /api/health':
        return json({ ok: true, service: 'hdp-api' })

      case 'GET /api/tg-start':
        return startLogin(request, env)

      case 'GET /api/tg-status':
        return pollLogin(request, env)

      case 'POST /api/telegram':
        return telegramWebhook(request, env)

      case 'GET /api/v1/me':
        return me(request, env)

      case 'GET /api/v1/progress':
        return getProgress(request, env)

      case 'PUT /api/v1/progress':
        return putProgress(request, env)

      case 'DELETE /api/v1/session':
        return (await revokeSession(request, env)) ? json({ ok: true }) : json({ error: 'unauthorized' }, 401)

      default:
        return json({ error: 'not_found' }, 404)
    }
  },
}
