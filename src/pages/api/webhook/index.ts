import type {NextApiRequest, NextApiResponse} from 'next'
import TelegramBot from 'node-telegram-bot-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bot = new TelegramBot(process.env.TG_BOT_TOKEN as string)

    const {body} = req

    if (body.message) {
      const {chat: {id}} = body.message
      let message = 'По любым вопросам, пожалуйста, обращайстесь к менеджеру @NoSmokeDivision'

      if (body.message.text === '/start') {
        message = `Привет! Я бот No Smoke Division, и я здесь, чтобы помочь тебе получить любимый снюс быстро и легко. Нажми на кнопку "Заказать" внизу клавиатуры, чтобы сделать свой заказ. Ждем твоего заказа!`
      }
      await bot.sendMessage(id, message)
    }
  } catch (error: any) {
    console.error(error.toString())
  }

  res.send('ok')
}
