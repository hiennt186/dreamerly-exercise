// ** MUI Imports

// ** Demo Components Imports
import { Box, Card } from '@mui/material'
import { Channel } from 'pusher-js'
import { useEffect, useState } from 'react'
import { useAuthContext, withAuth } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import { getConventonsByUserId, getMessagesByConventionId } from 'src/@core/slices/chat'
import { handleError } from 'src/@core/utils/error'
import { pusher } from 'src/pusher'
import ChatContent from 'src/views/chat/ChatContent'
import ChatList from 'src/views/chat/ChatList'

const ChatPage = withAuth(() => {
  const selectedConvention = useAppSelector(state => state.chat.selectedConvention)
  const { currentUser } = useAuthContext()
  const dispatch = useAppDispatch()
  const error = useAppSelector(state => state.chat.error)
  const [channel, setChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (currentUser?.id) {
      const channelName = `private-user-${currentUser?.id}`
      const channel = pusher.subscribe(channelName)
      setChannel(channel)

      return () => {
        pusher.unsubscribe(channelName)
      }
    }
  }, [currentUser?.id, dispatch])

  useEffect(() => {
    if (currentUser?.id) {
      const eventName = 'client-new-message'

      if (channel) {
        channel.bind(eventName, function () {
          if (currentUser?.id) {
            dispatch(getConventonsByUserId(currentUser.id))
          }
          if (selectedConvention?.id) {
            dispatch(getMessagesByConventionId(selectedConvention.id))
          }
        })

        return () => {
          channel.unbind(eventName)
        }
      }
    }
  }, [channel, currentUser?.id, dispatch, selectedConvention?.id])

  useEffect(() => {
    if (error) {
      handleError(error)
    }
  }, [error])

  return (
    <Card sx={{ height: 'calc(100vh - 64px - 56px - 3rem)' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ width: 360 }}>
          <ChatList />
        </Box>
        <Box sx={{ width: '100%' }}>{selectedConvention && <ChatContent />}</Box>
      </Box>
    </Card>
  )
})

export default ChatPage
