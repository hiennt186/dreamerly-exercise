import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import chatService from '../services/chat.service'
import userService from '../services/user.service'
import { Convention, Message } from '../types/Chat'
import { User } from '../types/User'
import { RootState } from 'src/store'

export interface ChatState {
  selectedConvention: Partial<Convention> | null
  isLoadingConventionList: boolean
  conventionList: Convention[]
  isLoadingMessageList: boolean
  messageList: Message[]
  isLoadingUserList: boolean
  userList: User[]
  error: string
}

const initialState: ChatState = {
  selectedConvention: null,
  isLoadingConventionList: true,
  conventionList: [],
  isLoadingMessageList: true,
  messageList: [],
  isLoadingUserList: true,
  userList: [],
  error: ''
}

export const getConventonsByUserId = createAsyncThunk(
  'chats/getConventonsByUserId',
  async (userId: string, thunkAPI) => {
    try {
      const conventions = await chatService.getConventionsByUserId(userId)

      for (const key in conventions) {
        if (Object.prototype.hasOwnProperty.call(conventions, key)) {
          const element = conventions[key]

          const chatUserId = element.user_ids.find(id => id != userId)
          if (chatUserId) {
            element.chatUser = await userService.get(chatUserId)
          }

          const lastMessage = await chatService.getLastMessagesByConventionId(element.id)
          element.lastMessage = lastMessage
        }
      }

      return conventions
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getMessagesByConventionId = createAsyncThunk(
  'chats/getMessagesByConventionId',
  async (conventionId: string, thunkAPI) => {
    try {
      const messages = await chatService.getMessagesByConventionId(conventionId)

      return messages
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getUsersForChat = createAsyncThunk('chats/getUsersForChat', async (currentUserId: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState

    const userIds = state.chat.conventionList.map(item => item.chatUser?.id)

    const users = await userService.getList()

    return users.filter(user => user.id != currentUserId && !userIds.includes(user.id))
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSelectedConvention: (state, action: PayloadAction<Partial<Convention>>) => {
      state.selectedConvention = action.payload
    },
    setMessageList: (state, action: PayloadAction<Message[]>) => {
      state.messageList = action.payload
    },
    setUserList: (state, action: PayloadAction<User[]>) => {
      state.userList = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(getConventonsByUserId.pending, state => {
      state.isLoadingConventionList = true
      state.error = ''
    })
    builder.addCase(getConventonsByUserId.fulfilled, (state, action) => {
      state.conventionList = action.payload
      state.isLoadingConventionList = false
      state.error = ''
    })
    builder.addCase(getConventonsByUserId.rejected, (state, action) => {
      state.conventionList = []
      state.isLoadingConventionList = false
      state.error = action.payload as string
    })

    builder.addCase(getMessagesByConventionId.pending, state => {
      state.isLoadingMessageList = true
      state.error = ''
    })
    builder.addCase(getMessagesByConventionId.fulfilled, (state, action) => {
      state.messageList = action.payload
      state.isLoadingMessageList = false
      state.error = ''
    })
    builder.addCase(getMessagesByConventionId.rejected, (state, action) => {
      state.messageList = []
      state.isLoadingMessageList = false
      state.error = action.payload as string
    })

    builder.addCase(getUsersForChat.pending, state => {
      state.isLoadingUserList = true
      state.error = ''
    })
    builder.addCase(getUsersForChat.fulfilled, (state, action) => {
      state.userList = action.payload
      state.isLoadingUserList = false
      state.error = ''
    })
    builder.addCase(getUsersForChat.rejected, (state, action) => {
      state.userList = []
      state.isLoadingUserList = false
      state.error = action.payload as string
    })
  }
})

// Action creators are generated for each case reducer function
export const { setSelectedConvention, setMessageList, setUserList } = chatSlice.actions

export default chatSlice.reducer
