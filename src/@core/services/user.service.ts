import { addDoc, collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore'
import { CreateUser, User } from 'src/@core/types/User'
import { db } from 'src/firebase'

class UserService {
  COLLECTION_NAME = 'users'
  CHAT_COLLECTION_NAME = 'chats'

  async create(createUser: CreateUser) {
    const docRef = await addDoc(collection(db, this.COLLECTION_NAME), createUser)

    return docRef.id
  }

  async getByFirebaseId(firebaseId: string) {
    const users: User[] = []

    const collectionRef = collection(db, this.COLLECTION_NAME)
    const q = query(collectionRef, where('firebase_id', '==', firebaseId))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      } as User)
    })

    return users
  }

  async get(userId: string) {
    const docRef = await getDoc(doc(db, this.COLLECTION_NAME, userId))

    if (!docRef.exists()) {
      return null
    }

    return {
      id: docRef.id,
      ...docRef.data()
    } as User
  }

  async getForChat(currentUserId: string, participantIds: string[] = []) {
    const users: User[] = []

    const collectionRef = collection(db, this.COLLECTION_NAME)
    const q = query(collectionRef, where(documentId(), 'not-in', [currentUserId, ...participantIds]))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      } as User)
    })

    return users
  }
}

const userService = new UserService()
export default userService
