// ** MUI Imports
import { Box, Button, Menu, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Plus from 'mdi-material-ui/Plus'
import { useCallback, useEffect, useState } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import { createNewChat, getUsersForChat, setMessageList } from 'src/@core/slices/chat'

const NewChatButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { currentUser } = useAuthContext()
  const dispatch = useAppDispatch()
  const users = useAppSelector(state => state.chat.userList)

  const open = Boolean(anchorEl)

  const fetchUsers = useCallback(async () => {
    if (currentUser) {
      dispatch(getUsersForChat(currentUser.id))
    }
  }, [currentUser, dispatch])

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [fetchUsers, open])

  const handleClickNewChat = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    if (currentUser?.id) {
      dispatch(getUsersForChat(currentUser?.id))
    }
  }
  const handleCreateChat = (userId: string) => async () => {
    if (currentUser) {
      dispatch(
        createNewChat({
          participant_ids: [currentUser.id, userId]
        })
      )
      dispatch(setMessageList([]))
      setAnchorEl(null)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button startIcon={<Plus />} variant='outlined' sx={{ width: '100%' }} onClick={handleClickNewChat}>
        New chat
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {users.map(user => (
          <MenuItem onClick={handleCreateChat(user.id)} key={user.id}>
            <Box>
              <Typography variant='body1'>{user.name}</Typography>
              <Typography variant='body2'>{user.email}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default NewChatButton
