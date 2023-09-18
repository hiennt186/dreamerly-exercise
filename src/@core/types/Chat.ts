import { User } from './User'

export interface Chat {
  id: string
  participant_ids: string[]

  participants?: User[]
  lastMessage?: Message
}

export interface CreateChat {
  participant_ids: string[]
}

export interface Message {
  id: string
  sender_id: string
  content: string
  timestamp: string
  read: boolean

  chat?: Chat
  sender?: User
}

export interface CreateMessage {
  sender_id: string
  content: string
  timestamp: string
  read: boolean
}
