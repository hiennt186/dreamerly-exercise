// ** MUI Imports
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import ChatContent from './ChatContent'
import ChatList from './ChatList'

const Chat = () => {
  return (
    <Card sx={{ height: 'calc(100vh - 64px - 56px - 3rem)' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ width: 360 }}>
          <ChatList />
        </Box>
        <Box sx={{ width: '100%' }}>
          <ChatContent />
        </Box>
      </Box>
    </Card>
  )
}

export default Chat
