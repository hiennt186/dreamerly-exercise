import { User } from "./User"

export interface Message {
  id: string
  sender_id: string
  sender?: User
  receiver_id: string
  receiver?: User
  content: string
  timestamp: string
  read: boolean
}

export interface CreateMessage {
  sender_id: string
  receiver_id: string
  content: string
  timestamp: string
  read: boolean
}