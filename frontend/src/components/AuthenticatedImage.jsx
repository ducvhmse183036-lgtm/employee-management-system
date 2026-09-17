import { useEffect, useState } from 'react'
import { api } from '../api/apiClient'
import { useAuth } from '../auth/useAuth'

export default function AuthenticatedImage({
  src,
  name = 'Employee',
  large = false,
}) {
  const [photo, setPhoto] = useState(null)
  const { session } = useAuth()
  useEffect(() => {
    const controller = new AbortController()
    let objectUrl
    if (src)
      api(src, { blob: true, signal: controller.signal })
        .then((blob) => {
          if (!controller.signal.aborted) {
            objectUrl = URL.createObjectURL(blob)
            setPhoto({ src, url: objectUrl })
          }
        })
        .catch(() => {})
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src, session?.token])
  const className = `employee-avatar ${large ? 'avatar-large' : ''}`
  return photo?.src === src && photo?.url ? (
    <img
      className={className}
      src={photo.url}
      alt={name}
      onError={() => setPhoto(null)}
    />
  ) : (
    <span className={className} aria-label={`${name} avatar`}>
      {name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?'}
    </span>
  )
}
