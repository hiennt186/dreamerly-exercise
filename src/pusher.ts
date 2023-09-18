import Pusher from 'pusher-js'
import { pusherConfig } from './configs/pusherConfig'

// Pusher.logToConsole = true

export const pusher = new Pusher(pusherConfig.appKey, {
  cluster: pusherConfig.cluster,
  authEndpoint: '/api/pusher/auth'
})
