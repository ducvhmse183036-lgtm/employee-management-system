import { clearSession, readSession } from '../auth/authStorage'
import { apiUrl } from '../config/apiConfig'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(
  path,
  { body, publicRequest = false, blob = false, ...options } = {},
) {
  const url = apiUrl(path)
  const headers = new Headers(options.headers)
  if (!publicRequest) {
    const session = readSession()
    if (!session) {
      clearSession('Please sign in to continue.')
      throw new ApiError('Please sign in to continue.', 401)
    }
    headers.set('Authorization', `Bearer ${session.token}`)
  }
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(body)
  }
  let response
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
      redirect: 'error',
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(
      'Cannot reach the server. Check your connection and try again.',
      0,
    )
  }
  if (!response.ok) {
    const messages = {
      400: 'Please check the entered information.',
      401: publicRequest
        ? 'Incorrect user ID or password.'
        : 'Your session has expired. Please sign in again.',
      403: publicRequest
        ? 'Unable to sign in. Check your user ID and password.'
        : 'You do not have permission for this action. If your session expired, sign out and sign in again.',
      404: 'The requested record was not found.',
      409: 'This record conflicts with existing information.',
    }
    let message =
      messages[response.status] ||
      'The server could not complete the request. Please try again.'
    if (response.status === 400) {
      const data = await response.json().catch(() => null)
      if (data && !data.trace && !data.error && !data.timestamp) {
        const details = Object.values(data).filter(
          (v) => typeof v === 'string' && v.length < 200,
        )
        if (details.length) message = details.join(' ')
      }
    }
    if (response.status === 401 && !publicRequest) clearSession(message)
    throw new ApiError(message, response.status)
  }
  if (blob) return response.blob()
  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}
