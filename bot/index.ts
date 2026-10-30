import { Bot } from 'grammy'

const BOT_TOKEN = '9262718967:AAFH7At-oxEstKDA6GIh-yhTz6jeIfYGY54'
const WEBAPP_URL = 'https://hdpapp-topaz.vercel.app'

console.log('Starting bot with token:', BOT_TOKEN.substring(0, 10) + '...')

const bot = new Bot(BOT_TOKEN)

// Handle all messages
bot.on('message', (ctx) => {
  const text = ctx.message.text || ''
  console.log('Message received:', text)

  if (text === '/start') {
    ctx.reply(
      'HDP Math - Matematikani o\'rganing! 🎓\n\nQuyidagi tugmani bosing:',
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
      },
    )
  } else if (text === '/help') {
    ctx.reply('HDP Math Bot yordam:\n\n/start - WebAppni ochish\n/help - Yordam')
  } else {
    ctx.reply('Iltimos /start buyrug\'ini yuboring')
  }
})

// Error handling
bot.catch((err) => {
  console.error('Error in bot:', err)
})

// Start the bot with polling
bot.start({
  onStart: () => console.log('✅ Bot started successfully!'),
  onPollingError: (err) => console.error('Polling error:', err),
})


