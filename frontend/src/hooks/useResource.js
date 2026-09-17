// Synchronize request loading state when the resource URL changes.
/* eslint-disable react/set-state-in-effect */
import { useEffect, useState } from 'react'
import { api } from '../api/apiClient'

export function useResource(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [version, setVersion] = useState(0)
  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    setState({ data: null, loading: true, error: '' })
    api(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: '' })
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ data: null, loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [path, version])
  return { ...state, reload: () => setVersion((v) => v + 1) }
}
