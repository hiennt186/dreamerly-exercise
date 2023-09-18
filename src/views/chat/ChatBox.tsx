// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { Send } from 'mdi-material-ui'
import { Channel } from 'pusher-js'
import { useEffect, useState } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import chatService from 'src/@core/services/chat.service'
import { getConventonsByUserId, getMessagesByConventionId, setSelectedConvention } from 'src/@core/slices/chat'
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
  const selectedConvention = useAppSelector(state => state.chat.selectedConvention)
  const dispatch = useAppDispatch()
  const [channel, setChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (currentUser?.id) {
      const channelName = `private-user-${selectedConvention?.chatUser?.id}`
      const channel = pusher.subscribe(channelName)

      if (channel) {
        setChannel(channel)

        return () => {
          pusher.unsubscribe(channelName)
        }
      }
    }
  }, [currentUser?.id, selectedConvention?.chatUser?.id])

  const handleSubmit = async (values: ChatFormValues, actions: FormikHelpers<ChatFormValues>) => {
    try {
      if (currentUser?.id) {
        let conventionId = selectedConvention?.id
        if (!conventionId) {
          conventionId = await chatService.createConvention({
            user_ids: selectedConvention?.user_ids
          })
          dispatch(
            setSelectedConvention({
              ...selectedConvention,
              id: conventionId
            })
          )
        }

        await chatService.createMessage({
          convention_id: conventionId,
          sender_id: currentUser?.id,
          content: values.content,
          timestamp: dayjs().toISOString()
        })

        actions.resetForm()
        dispatch(getMessagesByConventionId(conventionId))
        dispatch(getConventonsByUserId(currentUser.id))
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
