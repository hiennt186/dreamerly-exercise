import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
  useTLS: true
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const socketId = req.body.socket_id
    const channelName = req.body.channel_name

    try {
      const auth = pusher.authorizeChannel(socketId, channelName)
      res.status(200).json(auth)
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' })
    }
  } else {
    res.status(405).end()
  }
}
