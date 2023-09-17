import Pusher from 'pusher-js'

Pusher.logToConsole = true

export const pusher = new Pusher('03ac3f88e2e8a04a08dc', {
  cluster: 'ap1',
  authEndpoint: '/api/pusher/auth'
})
