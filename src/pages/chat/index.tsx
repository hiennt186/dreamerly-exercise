// ** MUI Imports

// ** Demo Components Imports
import { Box, Card } from '@mui/material'
import { withAuth } from 'src/@core/context/authContext'
import { useAppSelector } from 'src/@core/hooks/redux'
import ChatContent from 'src/views/chat/ChatContent'
import ChatList from 'src/views/chat/ChatList'

const ChatPage = () => {
  const selectedChat = useAppSelector(state => state.chat.selectedChat)

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
}

export default withAuth(ChatPage)
