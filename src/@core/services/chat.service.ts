import { addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from 'src/firebase'
import { Chat, CreateChat, CreateMessage, Message } from '../types/Chat'

class ChatService {
  COLLECTION_NAME = 'chats'
  MESSAGE_COLLECTION_NAME = 'messages'

  async create(createChat: CreateChat) {
    const docRef = await addDoc(collection(db, this.COLLECTION_NAME), createChat)

    return docRef.id
  }

  async createMessage(chatId: string, createMessage: CreateMessage) {
    const collectionRef = collection(db, `${this.COLLECTION_NAME}/${chatId}/${this.MESSAGE_COLLECTION_NAME}`)
    const docRef = await addDoc(collectionRef, createMessage)

    return docRef.id
  }

  async getByParticipantId(participantId: string) {
    const chats: Chat[] = []

    const collectionRef = collection(db, this.COLLECTION_NAME)
    const q = query(collectionRef, where('participant_ids', 'array-contains', participantId))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      chats.push({
        id: doc.id,
        ...doc.data()
      } as Chat)
    })

    return chats
  }

  async getMessagesByChatId(chatId: string) {
    const messages: Message[] = []

    const collectionRef = collection(db, `${this.COLLECTION_NAME}/${chatId}/${this.MESSAGE_COLLECTION_NAME}`)
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })

    return messages
  }

  async getLastMessagesByChatId(chatId: string) {
    const messages: Message[] = []

    const collectionRef = collection(db, `${this.COLLECTION_NAME}/${chatId}/${this.MESSAGE_COLLECTION_NAME}`)
    const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })

    return messages
  }
}

const chatService = new ChatService()
export default chatService
