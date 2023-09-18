import { onAuthStateChanged } from 'firebase/auth'
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { User } from 'src/@core/types/User'
import userService from '../services/user.service'
import { auth } from 'src/firebase'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

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
        const userDoc = await userService.getByFirebaseId(uid)
        setCurrentUser(userDoc)
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
