import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userService from '../services/user.service'
import { Chat, CreateChat, Message } from '../types/Chat'
import { User } from '../types/User'
import chatService from '../services/chat.service'

export interface ChatState {
  selectedChat: Partial<Chat> | null
  isLoadingChatList: boolean
  chatList: Chat[]
  isLoadingMessageList: boolean
  messageList: Message[]
  isLoadingUserList: boolean
  userList: User[]
}

const initialState: ChatState = {
  selectedChat: null,
  isLoadingChatList: true,
  chatList: [],
  isLoadingMessageList: true,
  messageList: [],
  isLoadingUserList: true,
  userList: []
}

export const createNewChat = createAsyncThunk(
  'chats/createNewChat',
  async (createChat: CreateChat): Promise<Partial<Chat>> => {
    const participants = await Promise.all(createChat.participant_ids.map(id => userService.get(id)))

    return {
      participant_ids: createChat.participant_ids,
      participants: participants.filter(item => item !== null) as User[]
    }
  }
)

export const getChatsByParticipantId = createAsyncThunk(
  'chats/getChatsByParticipantId',
  async (participantId: string) => {
    const chats = await chatService.getByParticipantId(participantId)

    for (const key in chats) {
      if (Object.prototype.hasOwnProperty.call(chats, key)) {
        const element = chats[key]

        const participants = await Promise.all(element.participant_ids.map(id => userService.get(id)))
        element.participants = participants.filter(item => item !== null) as User[]

        const lastMessage = await chatService.getLastMessagesByChatId(element.id)
        element.lastMessage = lastMessage
      }
    }

    return chats
  }
)

export const getMessagesByChatId = createAsyncThunk('chats/getMessagesByChatId', async (chatId: string) => {
  const messages = await chatService.getMessagesByChatId(chatId)

  return messages
})

export const getUsersForChat = createAsyncThunk('chats/getUsersForChat', async (currentUserId: string, thunkAPI) => {
  const state = thunkAPI.getState() as ChatState
  const participantIds = state.chatList.reduce((result: string[], item) => {
    return result.concat(item.participant_ids)
  }, [])
  const users = await userService.getForChat(currentUserId, participantIds)

  return users
})

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<Partial<Chat>>) => {
      state.selectedChat = action.payload
    },
    setMessageList: (state, action: PayloadAction<Message[]>) => {
      state.messageList = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload
    })
    builder.addCase(getChatsByParticipantId.pending, state => {
      state.isLoadingChatList = true
    })
    builder.addCase(getChatsByParticipantId.fulfilled, (state, action) => {
      state.chatList = action.payload
      state.isLoadingChatList = false
    })
    builder.addCase(getMessagesByChatId.pending, state => {
      state.isLoadingMessageList = true
    })
    builder.addCase(getMessagesByChatId.fulfilled, (state, action) => {
      state.messageList = action.payload
      state.isLoadingMessageList = false
    })
    builder.addCase(getUsersForChat.pending, state => {
      state.isLoadingUserList = true
    })
    builder.addCase(getUsersForChat.fulfilled, (state, action) => {
      state.userList = action.payload
      state.isLoadingUserList = false
    })
  }
})

// Action creators are generated for each case reducer function
export const { setSelectedChat, setMessageList } = chatSlice.actions

export default chatSlice.reducer
