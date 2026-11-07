export interface Env {
  DB: D1Database
  AUTH: KVNamespace
  TELEGRAM_BOT_USERNAME: string
  BOT_TOKEN?: string
  TELEGRAM_WEBHOOK_SECRET?: string
}
