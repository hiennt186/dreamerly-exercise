// ** MUI Imports
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, or, orderBy, query, where } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { auth, db } from 'src/firebase'
import { Message } from 'src/types/Message'
import { User } from 'src/types/User'
import ChatContent from './ChatContent'
import ChatList from './ChatList'

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [conventions, setConventions] = useState<Message[]>([])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid

        // ...
        console.log('uid', uid)

        const res = await getDocs(query(collection(db, 'users'), where('firebase_id', '==', uid))).then(
          querySnapshot => {
            querySnapshot.forEach(doc => {
              // Access the document data
              const data = doc.data()
              console.log(data)
              setUser({
                id: doc.id,
                name: data.name,
                email: data.email,
                firebase_id: data.firebase_id
              })
            })
          }
        )
        console.log('res', res)
      } else {
        // User is signed out
        // ...
        console.log('user is logged out')
      }
    })
  }, [])

  const fetchConventions = useCallback(async () => {
    const conventions: Message[] = []
    const useId = user?.id

    const q = query(
      collection(db, 'messages'),
      or(where('sender_id', '==', useId), where('receiver_id', '==', useId)),
      orderBy('timestamp', 'desc')
    )
    await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(async doc2 => {
        const data = doc2.data()
        if (!conventions.some(convention => convention.receiver_id === data.receiver_id)) {
          conventions.push({
            id: doc2.id,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            content: data.content,
            timestamp: data.timestamp,
            read: data.read
          })
        }
      })
    })

    for (const key in conventions) {
      if (Object.prototype.hasOwnProperty.call(conventions, key)) {
        const receiver = await getDoc(doc(db, 'users', conventions[key].receiver_id))
        const sender = await getDoc(doc(db, 'users', conventions[key].sender_id))
        if (receiver.exists()) {
          const data = receiver.data()
          conventions[key].receiver = {
            id: receiver.id,
            name: data?.name,
            email: data?.email,
            firebase_id: data?.firebase_id
          }
          const senderData = sender.data()
          conventions[key].sender = {
            id: sender.id,
            name: senderData?.name,
            email: senderData?.email,
            firebase_id: senderData?.firebase_id
          }
        }
      }
    }
    console.log('conventions', conventions)
    setConventions(conventions)
  }, [user?.id])

  const handleSendMessage = () => {
    fetchConventions()
  }

  useEffect(() => {
    fetchConventions()
  }, [fetchConventions])

  return (
    <Card sx={{ height: 'calc(100vh - 64px - 56px - 3rem)' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ width: 360 }}>
          <ChatList onSelectUser={handleSelectUser} conventions={conventions} selectedUser={selectedUser} />
        </Box>
        <Box sx={{ width: '100%' }}>
          {selectedUser && <ChatContent selectedUser={selectedUser} onSendMessage={handleSendMessage} />}
        </Box>
      </Box>
    </Card>
  )
}

export default Chat
