// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { Send } from 'mdi-material-ui'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import chatService from 'src/@core/services/chat.service'
import { getChatsByParticipantId, getMessagesByChatId, setSelectedChat } from 'src/@core/slices/chat'
import { handleError } from 'src/@core/utils/error'

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

  const handleSubmit = async (values: ChatFormValues, actions: FormikHelpers<ChatFormValues>) => {
    try {
      if (selectedChat?.id && selectedChat?.participant_ids && currentUser) {
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

        dispatch(getMessagesByChatId(selectedChat?.id))
        dispatch(getChatsByParticipantId(currentUser.id))
      }
    } catch (error: any) {
      handleError(error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
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
  )
}

export default ChatBox
