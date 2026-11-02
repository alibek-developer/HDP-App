import 'dotenv/config'
import { createServer } from 'node:http'
import { Bot } from 'grammy'

const BOT_TOKEN = process.env.BOT_TOKEN
const WEBAPP_URL = process.env.WEBAPP_URL ?? 'https://hdpapp-topaz.vercel.app'

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN topilmadi. `.env` fayliga yozing: BOT_TOKEN=... (BotFather → /newtoken)')
}

const bot = new Bot(BOT_TOKEN)

const START_TEXT =
  'HDP Academy Math — Telegram WebApp platformasiga xush kelibsiz! 🎓\n\n' +
  'Quyidagi tugma orqali ilovani to\'liq ekranda ochishingiz mumkin:'

const OPEN_BUTTON = { text: '🚀 HDP Mathni ochish', web_app: { url: WEBAPP_URL } }

bot.command('start', async (ctx) => {
  try {
    await ctx.reply(START_TEXT, { reply_markup: { inline_keyboard: [[OPEN_BUTTON]] } })
  } catch (err) {
    console.error('Error replying to /start:', err)
  }
})

bot.command('help', async (ctx) => {
  try {
    await ctx.reply('HDP Math Bot:\n\n/start — Ilovani ochish\n/help — Yordam olish')
  } catch (err) {
    console.error('Error replying to /help:', err)
  }
})

bot.on('message:text', async (ctx) => {
  try {
    await ctx.reply('Ilovani ishga tushirish uchun quyidagi tugmani bosing:', {
      reply_markup: { inline_keyboard: [[OPEN_BUTTON]] },
    })
  } catch (err) {
    console.error('Error in message handler:', err)
  }
})

bot.catch((err) => {
  console.error('Bot catch error:', err)
})

// Render Web Service turi kamida bitta ochiq port kutadi. Bot Telegram'ga o'zi
// chiqin ulanadi (long polling), shuning uchun bu server faqat «men tirikman»
// degan javob beradi; PORT bo'lmasa (Background Worker) um ishga tushmaydi.
if (process.env.PORT) {
  const port = Number(process.env.PORT)
  createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('HDP bot ishlab turibdi\n')
  }).listen(port, '0.0.0.0', () => console.log(`✅ Health server :${port} da turibdi`))
}

bot.start({
  onStart: () => console.log('✅ Bot started successfully!'),
  drop_pending_updates: true,
})
