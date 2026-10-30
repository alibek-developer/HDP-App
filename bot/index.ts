import { Bot } from 'grammy'

const BOT_TOKEN = '9262718967:AAFH7At-oxEstKDA6GIh-yhTz6jeIfYGY54'
const WEBAPP_URL = 'https://hdpapp-topaz.vercel.app'

console.log('Starting bot with token:', BOT_TOKEN.substring(0, 10) + '...')

const bot = new Bot(BOT_TOKEN)

// Handle /start command
bot.command('start', async (ctx) => {
  try {
    await ctx.reply(
      'HDP Academy Math — Telegram WebApp platformasiga xush kelibsiz! 🎓\n\nQuyidagi tugma orqali ilovani to\'liq ekranda ochishingiz mumkin:',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 HDP Mathni ochish',
                web_app: { url: WEBAPP_URL },
              },
            ],
          ],
        },
      }
    )
  } catch (err) {
    console.error('Error replying to /start:', err)
  }
})

// Handle /help command
bot.command('help', async (ctx) => {
  try {
    await ctx.reply(
      'HDP Math Bot:\n\n/start — Ilovani ochish\n/help — Yordam olish'
    )
  } catch (err) {
    console.error('Error replying to /help:', err)
  }
})

// Fallback message handler
bot.on('message:text', async (ctx) => {
  try {
    await ctx.reply(
      'Ilovani ishga tushirish uchun quyidagi tugmani bosing:',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 HDP Mathni ochish',
                web_app: { url: WEBAPP_URL },
              },
            ],
          ],
        },
      }
    )
  } catch (err) {
    console.error('Error in message handler:', err)
  }
})

// Error handling
bot.catch((err) => {
  console.error('Bot catch error:', err)
})

// Start the bot with polling
bot.start({
  onStart: () => console.log('✅ Bot started successfully!'),
  drop_pending_updates: true,
})
