import { User } from './User'

export interface Convention {
  id: string
  user_ids: string[]

  chatUser?: User | null
  lastMessage?: Message | null
}

export interface Message {
  id: string
  convention_id: string
  sender_id: string
  content: string
  timestamp: string
}

export interface UnreadMessage {
  id: string
  user_id: string
  last_read_timestamp: string
  is_notified: boolean
}
