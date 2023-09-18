import { addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from 'src/firebase'
import { collections } from '../constants/firestore'
import { Convention, Message } from '../types/Chat'

class ChatService {
  async createConvention(convention: Partial<Convention>) {
    const docRef = await addDoc(collection(db, collections.CONVENTIONS), convention)

    return docRef.id
  }

  async getConventionsByUserId(userId: string) {
    const conventions: Convention[] = []

    const collectionRef = collection(db, collections.CONVENTIONS)
    const q = query(collectionRef, where('user_ids', 'array-contains', userId))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      conventions.push({
        id: doc.id,
        ...doc.data()
      } as Convention)
    })

    return conventions
  }

  async createMessage(message: Partial<Message>) {
    const docRef = await addDoc(collection(db, collections.MESSAGES), message)

    return docRef.id
  }

  async getMessagesByConventionId(conventionId: string) {
    const messages: Message[] = []

    const collectionRef = collection(db, collections.MESSAGES)
    const q = query(collectionRef, where('convention_id', '==', conventionId), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as Message)
    })

    return messages
  }

  async getLastMessagesByConventionId(conventionId: string) {
    const collectionRef = collection(db, collections.MESSAGES)
    const q = query(collectionRef, where('convention_id', '==', conventionId), orderBy('timestamp', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.docs.length) {
      return null
    }

    const docRef = querySnapshot.docs[0]

    return {
      id: docRef.id,
      ...docRef.data()
    } as Message
  }
}

const chatService = new ChatService()
export default chatService
