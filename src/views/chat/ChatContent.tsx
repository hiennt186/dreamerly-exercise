// ** MUI Imports
import { Box, IconButton, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, and, collection, getDocs, or, orderBy, query, where } from 'firebase/firestore'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { Send } from 'mdi-material-ui'
import { useCallback, useEffect, useState } from 'react'
import { auth, db } from 'src/firebase'
import { CreateMessage, Message } from 'src/types/Message'
import { User } from 'src/types/User'

interface ChatFormValues {
  content: string
}

const initialValues = {
  content: ''
}

interface ChatContentProps {
  selectedUser: User | null
  onSendMessage: () => void
}

const ChatContent = (props: ChatContentProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState<User | null>(null)

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

  const fetchMessages = useCallback(async () => {
    try {
      const selectedUserId = props.selectedUser?.id
      const useId = user?.id

      console.log({ selectedUserId, useId })

      const q = query(
        collection(db, 'messages'),
        or(
          and(where('sender_id', '==', selectedUserId), where('receiver_id', '==', useId)),
          and(where('sender_id', '==', useId), where('receiver_id', '==', selectedUserId))
        ),
        orderBy('timestamp', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const messages: Message[] = querySnapshot.docs.map(doc => {
        const data = doc.data()

        return {
          id: doc.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          timestamp: data.timestamp,
          read: data.read
        }
      })

      console.log('messages', messages)
      setMessages(messages)
      props.onSendMessage();
    } catch (error) {
      console.log({ error })
    }
  }, [props.selectedUser?.id, user?.id])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleSubmit = async (values: ChatFormValues, actions: FormikHelpers<ChatFormValues>) => {
    try {
      if (!user?.id || !props.selectedUser?.id) {
        return
      }
      const message: CreateMessage = {
        content: values.content,
        sender_id: user?.id,
        receiver_id: props.selectedUser?.id,
        timestamp: new Date().toISOString(),
        read: false
      }
      await addDoc(collection(db, 'messages'), message)
      actions.resetForm()
      fetchMessages()
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 4, borderBottom: 1, borderColor: 'grey.300' }}>
        <Typography variant='h6'>{props.selectedUser?.name}</Typography>
        <Typography variant='subtitle2'>{props.selectedUser?.email}</Typography>
      </Box>
      <Grid
        container
        sx={{ flex: 1, p: 4, flexDirection: 'column-reverse', flexWrap: 'nowrap', overflowY: 'auto' }}
        gap={2}
      >
        {messages.map((item) => {
          const isSender = item.sender_id === user?.id

          return (
            <Grid
              item
              sx={{
                bgcolor: isSender ? 'primary.main' : 'grey.A100',
                p: 2,
                borderRadius: 1,
                alignSelf: isSender ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
              key={item.id}
            >
              <Typography
                variant='body2'
                sx={{
                  color: isSender ? 'white' : 'black'
                }}
              >
                {item.content}
              </Typography>
              <Typography
                variant='overline'
                sx={{
                  color: isSender ? 'white' : 'black'
                }}
              >
                {item.timestamp}
              </Typography>
            </Grid>
          )
        })}
      </Grid>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.300' }}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(props: FormikProps<ChatFormValues>) => {
            return (
              <Form>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    autoFocus
                    fullWidth
                    name='content'
                    value={props.values.content}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  <IconButton size='large' sx={{ ml: 4 }} type='submit'>
                    <Send fontSize='large' color='primary' />
                  </IconButton>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Box>
  )
}

export default ChatContent
