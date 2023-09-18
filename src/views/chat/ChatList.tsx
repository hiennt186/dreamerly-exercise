// ** MUI Imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import { getConventonsByUserId, setSelectedConvention } from 'src/@core/slices/chat'
import { Convention } from 'src/@core/types/Chat'
import { formatDate } from 'src/@core/utils/date'
import NewChatButton from './NewChatButton'

const ChatList = () => {
  const { currentUser } = useAuthContext()
  const dispatch = useAppDispatch()
  const conventionList = useAppSelector(state => state.chat.conventionList)
  const selectedConvention = useAppSelector(state => state.chat.selectedConvention)

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getConventonsByUserId(currentUser.id))
    }
  }, [currentUser?.id, dispatch])

  const handleSelectConvention = (convention: Convention) => async () => {
    dispatch(setSelectedConvention(convention))
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
        {conventionList.map(item => {
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
                bgcolor: item.id === selectedConvention?.id ? 'grey.100' : 'white',
                transition: 0.5,
                px: 4,
                py: 2
              }}
              onClick={handleSelectConvention(item)}
            >
              <Typography variant='body1'>{item.chatUser?.name}</Typography>
              <Typography
                variant='body2'
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflowX: 'hidden'
                }}
              >
                {item.lastMessage?.content}
              </Typography>
              <Typography variant='overline'>{formatDate(dayjs(item.lastMessage?.timestamp))}</Typography>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ChatList
