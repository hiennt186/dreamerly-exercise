// ** MUI Imports
import { Box, Button, Menu, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Plus from 'mdi-material-ui/Plus'
import { useCallback, useEffect, useState } from 'react'
import { useAuthContext } from 'src/@core/context/authContext'
import { useAppDispatch, useAppSelector } from 'src/@core/hooks/redux'
import userService from 'src/@core/services/user.service'
import { getUsersForChat, setMessageList, setSelectedConvention, setUserList } from 'src/@core/slices/chat'

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
    if (currentUser?.id) {
      dispatch(getUsersForChat(currentUser?.id))
    }
    setAnchorEl(event.currentTarget)
  }

  const handleSelectUser = (userId: string) => async () => {
    if (currentUser?.id) {
      dispatch(
        setSelectedConvention({
          user_ids: [currentUser?.id, userId],
          chatUser: await userService.get(userId)
        })
      )
      dispatch(setMessageList([]))
      setAnchorEl(null)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
    dispatch(setUserList([]))
  }

  return (
    <>
      <Button startIcon={<Plus />} variant='outlined' sx={{ width: '100%' }} onClick={handleClickNewChat}>
        New chat
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {users.map(user => (
          <MenuItem onClick={handleSelectUser(user.id)} key={user.id}>
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
