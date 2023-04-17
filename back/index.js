import TelegramBot from "node-telegram-bot-api"
import express from "express"

const token = '6164900810:AAGOK1leHXBamx-LWvz6sT7VmXWpgU6BoDU'
const webAppUrl = 'https://example.com'
const webHookUrl = 'https://02f4-213-230-102-235.ngrok-free.app'
const port = 8000

const bot = new TelegramBot(token)

bot.setWebHook(`${webHookUrl}/bot${token}`)

const app = express()

app.use(express.json())

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Bot is listening on port ${port}`)
})

bot.on('message', async (msg) => {
  console.log('sa;ldjfk;aslkdjf;lsakdfj')

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
})