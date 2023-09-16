// ** MUI Imports
import { Box, Button, Menu, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import Plus from 'mdi-material-ui/Plus'
import { useEffect, useState } from 'react'
import { auth, db } from 'src/firebase'
import { Message } from 'src/types/Message'
import { User } from 'src/types/User'

interface ChatListProps {
  onSelectUser: (user: User) => void
  selectedUser: User | null
  conventions: Message[]
}

const ChatList = (props: ChatListProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [user, setUser] = useState<User | null>(null)

  const open = Boolean(anchorEl)

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid

        // ...
        console.log('uid', uid)

        const res = await getDocs(query(collection(db, 'users'), where('firebase_id', '==', uid))).then(
          querySnapshot => {
            querySnapshot.forEach(doc => {
              // Access the document data
              const data = doc.data()
              console.log(data)
              setUser({
                id: doc.id,
                name: data.name,
                email: data.email,
                firebase_id: data.firebase_id
              })
            })
          }
        )
        console.log('res', res)
      } else {
        // User is signed out
        // ...
        console.log('user is logged out')
      }
    })
  }, [])

  const fetchUsers = async () => {
    const users: User[] = []
    const conventionUserIds = props.conventions.map(convention =>
      convention.sender_id === user?.id ? convention.receiver_id : convention.sender_id
    )
    console.log({conventionUserIds})
    const q = query(collection(db, 'users'), where(documentId(), 'not-in', [...conventionUserIds, user?.id]))
    await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(async doc2 => {
        const data = doc2.data()
        users.push({
          id: doc2.id,
          name: data.name,
          email: data.email,
          firebase_id: data.firebase_id
        })
      })
    })
    console.log({ users })
    setUsers(users)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleClickNewChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleSelectUser = (user: User) => () => {
    setAnchorEl(null)
    console.log({ user })
    props.onSelectUser(user)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
        <Button startIcon={<Plus />} variant='outlined' sx={{ width: '100%' }} onClick={handleClickNewChat}>
          New chat
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          {users.map(user => (
            <MenuItem onClick={handleSelectUser(user)} key={user.id}>
              {console.log({ user })}
              <Box>
                <Typography variant='body1'>{user.name}</Typography>
                <Typography variant='body2'>{user.email}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
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
        {props.conventions.map(item => {
          const partner = item.sender_id === user?.id ? item.receiver! : item.sender!

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
                bgcolor: partner.id === props.selectedUser?.id ? 'grey.100' : 'white',
                transition: 0.5,
                px: 4,
                py: 2
              }}
              onClick={handleSelectUser(partner)}
            >
              <Typography variant='body1'>{partner?.name}</Typography>
              <Typography
                variant='body2'
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflowX: 'hidden'
                }}
              >
                {item.content}
              </Typography>
              <Typography variant='overline'>{item.timestamp}</Typography>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ChatList
