// ** MUI Imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import { getChatsByParticipantId, setSelectedChat } from 'src/@core/slices/chat'
import { Chat } from 'src/@core/types/Chat'
import { formatDate } from 'src/@core/utils/date'
import NewChatButton from './NewChatButton'

const ChatList = () => {
  const { currentUser } = useAuthContext()
  const dispatch = useAppDispatch()
  const chatList = useAppSelector(state => state.chat.chatList)
  const selectedChat = useAppSelector(state => state.chat.selectedChat)

  const fetchChats = useCallback(async () => {
    if (currentUser) {
      dispatch(getChatsByParticipantId(currentUser.id))
    }
  }, [currentUser, dispatch])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const handleSelectChat = (chat: Chat) => async () => {
    dispatch(setSelectedChat(chat))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'grey.300',
        height: '100%'
      }}
    >
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <NewChatButton />
      </Box>
      <Grid
        container
        sx={{
          flex: 1,
          p: 4,
          flexDirection: 'column',
          flexWrap: 'nowrap',
          overflowY: 'auto'
        }}
        gap={2}
      >
        {chatList.map(item => {
          const chatUser = item?.participants?.find(participant => participant.id !== currentUser?.id)
          const isUnread = item.lastMessage?.sender_id !== currentUser?.id && !item.lastMessage?.read

          return (
            <Grid
              item
              key={item.id}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'grey.100'
                },
                bgcolor: item.id === selectedChat?.id ? 'grey.100' : 'white',
                transition: 0.5,
                px: 4,
                py: 2
              }}
              onClick={handleSelectChat(item)}
            >
              <Typography
                variant='body1'
                sx={{
                  fontWeight: isUnread ? 700 : 400
                }}
              >
                {chatUser?.name}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflowX: 'hidden',
                  fontWeight: isUnread ? 700 : 400
                }}
              >
                {item.lastMessage?.content}
              </Typography>
              <Typography
                variant='overline'
                sx={{
                  fontWeight: isUnread ? 700 : 400
                }}
              >
                {formatDate(dayjs(item.lastMessage?.timestamp))}
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ChatList
