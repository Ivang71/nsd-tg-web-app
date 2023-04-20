import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const webAppUrl = 'https://succub.serveo.net'
const token = process.env.TG_BOT_TOKEN
const webHookUrl = process.env.WEBHOOK_URL
const port = process.env.LOCAL_PORT

const bot = new TelegramBot(token)

await bot.setWebHook(`${webHookUrl}/bot${token}`)

const app = express()

app.use(cors())
app.use(express.json())
app.disable('x-powered-by')

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})

app.post('api/order', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`,
            },
        })
        return res.status(200).json({})
    } catch (e) {
        return res.status(500).json({})
    }
})

app.listen(port, () => {
    console.log(`Bot is listening on port ${port}`)
})

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    if (text === '/start') {
        await bot.sendMessage(chatId, `Привет 👋
Рады видеть вас в No Smoke Division!
Хотите заказать снюс? Просто нажмите на кнопку ниже!

Если у вас есть какие-либо вопросы, не стесняйтесь обращаться к нам. Мы всегда готовы помочь! `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}],
                ],
            },
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате')
            }, 3000)
        } catch (e) {
            console.log(e)
        }
    }
})