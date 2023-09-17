// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { Send } from 'mdi-material-ui'
import { Channel } from 'pusher-js'
import { useEffect, useState } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import chatService from 'src/@core/services/chat.service'
import { getChatsByParticipantId, getMessagesByChatId, setSelectedChat } from 'src/@core/slices/chat'
import { handleError } from 'src/@core/utils/error'
import { pusher } from 'src/pusher'

interface ChatFormValues {
  content: string
}

const initialValues = {
  content: ''
}

const ChatBox = () => {
  const { currentUser } = useAuthContext()
  const selectedChat = useAppSelector(state => state.chat.selectedChat)
  const dispatch = useAppDispatch()
  const [channel, setChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (currentUser?.id) {
      const chatUser = selectedChat?.participants?.find(participant => participant.id !== currentUser?.id)
      const channelName = `private-user-${chatUser?.id}`
      const channel = pusher.subscribe(channelName)

      if (channel) {
        setChannel(channel)

        return () => {
          pusher.unsubscribe(channelName)
        }
      }
    }
  }, [currentUser?.id, dispatch, selectedChat?.id, selectedChat?.participants])

  const handleSubmit = async (values: ChatFormValues, actions: FormikHelpers<ChatFormValues>) => {
    console.log('handleSubmit')
    try {
      if (selectedChat?.participant_ids && currentUser) {
        let chatId = selectedChat.id
        if (!chatId) {
          chatId = await chatService.create({
            participant_ids: selectedChat.participant_ids
          })
          dispatch(
            setSelectedChat({
              ...selectedChat,
              id: chatId
            })
          )
        }

        await chatService.createMessage(chatId, {
          sender_id: currentUser?.id,
          content: values.content,
          timestamp: new Date().toISOString(),
          read: false
        })

        actions.resetForm()

        dispatch(getMessagesByChatId(chatId))
        dispatch(getChatsByParticipantId(currentUser.id))

        if (channel) {
          channel.trigger('client-new-message', {})
        }
      }
    } catch (error: any) {
      handleError(error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
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
  )
}

export default ChatBox
