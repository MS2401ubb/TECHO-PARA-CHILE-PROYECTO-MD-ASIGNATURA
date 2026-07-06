import { createContext, useContext, useMemo, useState } from 'react'
import cookies from 'js-cookie'
import { login as loginRequest } from '../services/auth.service'

const TOKEN_KEY = 'jwt-auth'
const USER_KEY = 'usuario'

function readInitialAuthState() {
  const savedToken = cookies.get(TOKEN_KEY, { path: '/' }) || null
  const savedUser = sessionStorage.getItem(USER_KEY)

  let parsedUser = null
  if (savedUser) {
    try {
      parsedUser = JSON.parse(savedUser)
    } catch {
      sessionStorage.removeItem(USER_KEY)
    }
  }

  return { savedToken, parsedUser }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { savedToken, parsedUser } = readInitialAuthState()
  const [token, setToken] = useState(savedToken)
  const [user, setUser] = useState(parsedUser)
  const [loading] = useState(false)

  const login = async (rut, password) => {
    const result = await loginRequest(rut, password)

    if (!result.success) return result

    setToken(result.token)
    setUser(result.user)
    cookies.set(TOKEN_KEY, result.token, { path: '/' })
    sessionStorage.setItem(USER_KEY, JSON.stringify(result.user))

    return result
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    cookies.remove(TOKEN_KEY, { path: '/' })
    sessionStorage.removeItem(USER_KEY)
  }

  const updateUser = (partialUser) => {
    setUser((current) => {
      const nextUser = { ...current, ...partialUser }
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      return nextUser
    })
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: Boolean(token && user),
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
