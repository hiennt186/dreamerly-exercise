import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore'
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

  async updateReadMessagesByChatId(chatId: string, currentUserId: string) {
    const collectionRef = collection(db, `${this.COLLECTION_NAME}/${chatId}/${this.MESSAGE_COLLECTION_NAME}`)
    console.log('updateReadMessagesByChatId', chatId, currentUserId)
    const q = query(collectionRef, where('sender_id', '!=', currentUserId))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(snapshot => {
      console.log('updateReadMessagesByChatId', snapshot.data().sender_id)
      const docRef = doc(db, `${this.COLLECTION_NAME}/${chatId}/${this.MESSAGE_COLLECTION_NAME}`, snapshot.id)

      return updateDoc(docRef, {
        read: true
      })
    })
  }
}

const chatService = new ChatService()
export default chatService
