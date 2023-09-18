import { onAuthStateChanged } from 'firebase/auth'
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { User } from 'src/@core/types/User'
import userService from '../services/user.service'
import app, { auth } from 'src/firebase'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export type AuthContextValue = {
  isLoading: boolean
  currentUser: User | null
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ** State
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        setIsAuthenticated(true)
        setIsLoading(false)

        const uid = user.uid
        const users = await userService.getByFirebaseId(uid)

        if (users.length) {
          const user = users[0]
          const messaging = getMessaging(app)
          const token = await getToken(messaging, {
            vapidKey: 'BPUOPmBKMDeKW7EjQz8-CAEXV-xXuyjjS1h-lTP3wawMyuscfps7AWfDZMkc5sZ602Cv-Z1SaYqehweC1NoSvF0'
          })
          console.log({ token })
          onMessage(messaging, payload => {
            console.log('Message received. ', payload)
          })

          userService.update(user.id, {
            fcm_token: token
          })
          setCurrentUser(user)
        }
      } else {
        setIsAuthenticated(false)
        setIsLoading(false)
        setCurrentUser(null)
      }
    })
  }, [])

  return <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)

export const withAuth = (Component: FC): NextPage => {
  return (props: any) => {
    const { isAuthenticated, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/pages/login')
      }
    }, [isAuthenticated, isLoading, router])

    return <Component {...props} />
  }
}

export const withNonAuth = (Component: FC): NextPage => {
  return () => {
    const { isAuthenticated, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.push('/')
      }
    }, [isAuthenticated, isLoading, router])

    return <Component />
  }
}
