// ** MUI Imports

// ** Demo Components Imports
import { Box, Card } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useAuthContext, withAuth } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import chatService from 'src/@core/services/chat.service'
import { getChatsByParticipantId, getMessagesByChatId } from 'src/@core/slices/chat'
import { handleError } from 'src/@core/utils/error'
import { pusher } from 'src/pusher'
import ChatContent from 'src/views/chat/ChatContent'
import ChatList from 'src/views/chat/ChatList'

const ChatPage = withAuth(() => {
  const selectedChat = useAppSelector(state => state.chat.selectedChat)
  const { currentUser } = useAuthContext()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (currentUser?.id) {
      const channelName = `private-user-${currentUser?.id}`
      const eventName = 'client-new-message'
      const channel = pusher.subscribe(channelName)

      if (channel) {
        channel.bind(eventName, function () {
          dispatch(getChatsByParticipantId(currentUser.id))
          if (selectedChat?.id) {
            dispatch(getMessagesByChatId(selectedChat.id))
            chatService.updateReadMessagesByChatId(selectedChat.id, currentUser.id)
          }
        })

        return () => {
          channel.unbind(eventName)
          pusher.unsubscribe(channelName)
        }
      }
    }
  }, [currentUser?.id, dispatch, selectedChat?.id])

  const updateReadMessages = useCallback(async () => {
    try {
      if (selectedChat?.id && currentUser?.id) {
        await chatService.updateReadMessagesByChatId(selectedChat.id, currentUser.id)
        dispatch(getChatsByParticipantId(currentUser.id))
      }
    } catch (error: any) {
      handleError(error)
    }
  }, [currentUser?.id, dispatch, selectedChat?.id])

  useEffect(() => {
    updateReadMessages()
  }, [updateReadMessages])

  return (
    <Card sx={{ height: 'calc(100vh - 64px - 56px - 3rem)' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ width: 360 }}>
          <ChatList />
        </Box>
        <Box sx={{ width: '100%' }}>{selectedChat && <ChatContent />}</Box>
      </Box>
    </Card>
  )
})

export default ChatPage
