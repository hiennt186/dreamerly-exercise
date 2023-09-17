// ** MUI Imports
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useCallback, useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import { getMessagesByChatId } from 'src/@core/slices/chat'
import ChatBox from './ChatBox'

const ChatContent = () => {
  const { currentUser } = useAuthContext()
  const selectedChat = useAppSelector(state => state.chat.selectedChat)
  const messages = useAppSelector(state => state.chat.messageList)
  const dispatch = useAppDispatch()

  const fetchMessages = useCallback(async () => {
    if (selectedChat?.id) {
      dispatch(getMessagesByChatId(selectedChat.id))
    }
  }, [dispatch, selectedChat?.id])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const chatUser = selectedChat?.participants?.find(participant => participant.id !== currentUser?.id)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 4, borderBottom: 1, borderColor: 'grey.300' }}>
        <Typography variant='h6'>{chatUser?.name}</Typography>
        <Typography variant='subtitle2'>{chatUser?.email}</Typography>
      </Box>
      <Grid
        container
        sx={{ flex: 1, p: 4, flexDirection: 'column-reverse', flexWrap: 'nowrap', overflowY: 'auto' }}
        gap={2}
      >
        {messages.map(item => {
          const isSender = item.sender_id === currentUser?.id

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
        <ChatBox />
      </Box>
    </Box>
  )
}

export default ChatContent
