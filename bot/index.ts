import { Bot } from 'grammy'
import { autoRetry } from '@grammyjs/auto-retry'
import dotenv from 'dotenv'

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN || '')

// Enable auto-retry for network errors
bot.api.config.use(autoRetry())

// Handle /start command
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'https://your-webapp-url.com'
  ctx.reply(
    'HDP Math - Matematikani o\'rganing! 🎓\n\nQuyidagi tugmani bosing:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 HDP Mathni ochish',
              web_app: { url: webAppUrl },
            },
          ],
        ],
      },
    },
  )
})

// Handle /help command
bot.command('help', (ctx) => {
  ctx.reply(
    'HDP Math Bot yordam:\n\n' +
      '/start - WebAppni ochish\n' +
      '/help - Yordam\n' +
      '/profile - Profilingizni ko\'rish\n' +
      '/stats - Statistikangizni ko\'rish',
  )
})

// Handle callback queries
bot.on('callback_query', async (ctx) => {
  await ctx.answerCallbackQuery()
  // Handle inline button clicks here
})

// Error handling
bot.catch((err) => {
  console.error('Error in bot:', err)
})

// Start the bot
bot.start()
  .then(() => console.log('Bot started'))
  .catch((err) => console.error('Failed to start bot:', err))

