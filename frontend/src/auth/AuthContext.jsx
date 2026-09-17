import { useEffect, useState } from 'react'
import {
  AUTH_EVENT,
  clearSession,
  readSession,
  saveSession,
  tokenExpiry,
} from './authStorage'

import { AuthContext } from './useAuth'
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    const sync = (event) => {
      setSession(readSession())
      setNotice(event.detail || '')
    }
    window.addEventListener(AUTH_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(AUTH_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  useEffect(() => {
    if (!session) return
    let timer
    const checkExpiry = () => {
      const remaining = tokenExpiry(session.token) - Date.now()
      if (remaining <= 0)
        clearSession('Your session has expired. Please sign in again.')
      else timer = setTimeout(checkExpiry, Math.min(remaining, 2147483647))
    }
    checkExpiry()
    return () => clearTimeout(timer)
  }, [session])
  return (
    <AuthContext.Provider
      value={{
        session,
        notice,
        login: saveSession,
        logout: clearSession,
        canEdit: ['ADMIN', 'HR'].includes(session?.role),
        isAdmin: session?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
