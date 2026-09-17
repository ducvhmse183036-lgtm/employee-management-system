// A single trusted backend origin for JSON APIs and authenticated employee photos.
// Empty in development means the existing Vite proxy handles both paths.
export function resolveApiUrl(
  path,
  baseUrl = '',
  { production = false, mode = '' } = {},
) {
  if (
    typeof path !== 'string' ||
    !/^\/(api|uploads)\//.test(path) ||
    /[\\\s]/.test(path)
  ) {
    throw new Error('Unsupported resource URL.')
  }

  const configured = baseUrl.trim()
  if (!configured && production) {
    throw new Error(
      'The service connection is not configured. Please contact your administrator.',
    )
  }

  let origin = 'http://vite-proxy.invalid'
  if (configured) {
    let backend
    try {
      backend = new URL(configured)
    } catch {
      throw new Error(
        'The service connection is not configured correctly. Please contact your administrator.',
      )
    }
    if (
      !['http:', 'https:'].includes(backend.protocol) ||
      (production && mode !== 'mobile' && backend.protocol !== 'https:') ||
      backend.username ||
      backend.password ||
      backend.search ||
      backend.hash ||
      backend.pathname !== '/' ||
      backend.hostname.endsWith('.example.com')
    ) {
      throw new Error(
        'The service connection is not configured correctly. Please contact your administrator.',
      )
    }
    origin = backend.origin
  }

  const url = new URL(path, origin)
  if (url.origin !== origin || !/^\/(api|uploads)\//.test(url.pathname)) {
    throw new Error('Unsupported resource URL.')
  }
  return configured ? url.href : url.pathname + url.search
}

export function apiUrl(path) {
  return resolveApiUrl(path, import.meta.env.VITE_API_BASE_URL || '', {
    production: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  })
}
