const TelegramBot = require('node-telegram-bot-api')

const token = '6164900810:AAGOK1leHXBamx-LWvz6sT7VmXWpgU6BoDU'
const webAppUrl = 'https://example.com'
const bot = new TelegramBot(token, {polling: true})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Ниже будет кнопка', {
      reply_markup: {
        keyboard: [
          [{text: 'Заполнить форму', web_app: {url: webAppUrl}}]
        ]
      }
    })

    await bot.sendMessage(chatId, 'Заходи в наш магазин по кнопке ниже', {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
        ]
      }
    })

  }

});