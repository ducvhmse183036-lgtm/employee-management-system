const KEY = 'ems.session'
export const AUTH_EVENT = 'ems:session'

export function tokenExpiry(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(part)).exp * 1000
  } catch {
    return 0
  }
}

export function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(KEY))
    if (
      !session?.userId ||
      !['ADMIN', 'HR', 'VIEWER'].includes(session.role) ||
      !(tokenExpiry(session.token) > Date.now())
    )
      return null
    return session
  } catch {
    return null
  }
}

export function saveSession({ token, userId, role, employeeId }) {
  if (!(tokenExpiry(token) > Date.now()))
    throw new Error('The server returned an invalid or expired session.')
  localStorage.setItem(KEY, JSON.stringify({ token, userId, role, employeeId }))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function clearSession(reason = '') {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: reason }))
}
