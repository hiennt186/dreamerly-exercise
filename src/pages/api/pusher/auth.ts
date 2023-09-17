import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: '1671352',
  key: '03ac3f88e2e8a04a08dc',
  secret: '9b40a8a394ef85a2edf9',
  cluster: 'ap1',
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
