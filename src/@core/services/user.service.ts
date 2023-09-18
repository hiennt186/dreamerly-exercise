import { addDoc, collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore'
import { User } from 'src/@core/types/User'
import { db } from 'src/firebase'
import { collections } from '../constants/firestore'

class UserService {
  async create(user: Partial<User>) {
    const docRef = await addDoc(collection(db, collections.USERS), user)

    return docRef.id
  }

  async getByFirebaseId(firebaseId: string) {
    const collectionRef = collection(db, collections.USERS)
    const q = query(collectionRef, where('firebase_id', '==', firebaseId), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.docs.length) {
      return null
    }

    const docRef = querySnapshot.docs[0]

    return {
      id: docRef.id,
      ...docRef.data()
    } as User
  }

  async get(userId: string) {
    const docRef = await getDoc(doc(db, collections.USERS, userId))

    if (!docRef.exists()) {
      return null
    }

    return {
      id: docRef.id,
      ...docRef.data()
    } as User
  }

  async getList() {
    const users: User[] = []

    const querySnapshot = await getDocs(collection(db, collections.USERS))

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
