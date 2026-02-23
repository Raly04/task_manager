import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getApiErrorMessage, tokenStorage } from '../lib/api'
import type { AuthPayload, RegisterPayload, User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: AuthPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const USER_KEY = 'task_manager_user'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function parseStoredUser(rawUser: string | null): User | null {
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())
  const [user, setUser] = useState<User | null>(() =>
    parseStoredUser(localStorage.getItem(USER_KEY)),
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (token) {
      tokenStorage.set(token)
    } else {
      tokenStorage.clear()
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  const authenticate = useCallback((nextUser: User, nextToken: string) => {
    setUser(nextUser)
    setToken(nextToken)
  }, [])

  const login = useCallback(async (payload: AuthPayload) => {
    setIsLoading(true)

    try {
      const response = await api.post<{ user: User; token: string }>('/login', payload)
      authenticate(response.data.user, response.data.token)
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [authenticate])

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true)

    try {
      const response = await api.post<{ user: User; token: string }>('/register', payload)
      authenticate(response.data.user, response.data.token)
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [authenticate])

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      if (token) {
        await api.post('/logout')
      }
    } catch {
      // Ignore logout API failure and clear local auth state anyway.
    } finally {
      setUser(null)
      setToken(null)
      setIsLoading(false)
    }
  }, [token])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
    }
  }, [isLoading, login, logout, register, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
