import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query_id, message } = req.body
    // if (!query_id) return res.status(400).json({ error: 'query_id is required' })
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        web_app_query_id: query_id,
        result: {
          type: 'article',
          id: query_id,
          title: 'Поздравляем с покупкой',
          input_message_content: {
            message_text: message
          }
        }
      })
    }
    await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/answerWebAppQuery`, options)
    res.status(200).send('ok')
  } else {
    // Handle any other HTTP method
  }
}
