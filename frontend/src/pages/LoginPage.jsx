import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/apiClient'
import { useAuth } from '../auth/useAuth'
import { ErrorMessage, Icon } from '../components/UI'

export default function LoginPage() {
  const { session, notice, login } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  if (session) return <Navigate to="/employees" replace />
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    try {
      login(
        await api('/api/auth/login', {
          method: 'POST',
          publicRequest: true,
          body: {
            userId: form.get('userId').trim(),
            password: form.get('password'),
          },
        }),
      )
      navigate('/employees', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-intro">
          <span className="brand-mark mb-4">
            <Icon name="people-fill" />
          </span>
          <div className="eyebrow">YOUR PEOPLE. ONE PLACE.</div>
          <h1>Employee Management System</h1>
          <p>
            Thoughtfully organized.
            <br />
            Seamlessly connected.
          </p>
          <div className="login-decoration" aria-hidden="true">
            <Icon name="diagram-3" />
          </div>
          <small>A workspace built around your people.</small>
        </div>
        <div className="login-form">
          <h2 className="h3">Welcome back</h2>
          <p className="text-secondary mb-4">
            Sign in to your workspace to continue.
          </p>
          {notice && (
            <div className="alert alert-info" role="status">
              {notice}
            </div>
          )}
          <ErrorMessage message={error} />
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="userId">
                User ID
              </label>
              <input
                id="userId"
                name="userId"
                className="form-control"
                autoComplete="username"
                required
                autoFocus
                disabled={busy}
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={visible ? 'text' : 'password'}
                  className="form-control"
                  autoComplete="current-password"
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  onClick={() => setVisible(!visible)}
                >
                  <Icon name={visible ? 'eye-slash' : 'eye'} />
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-100 py-3" disabled={busy}>
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <Icon name="arrow-right" className="ms-2" />
                </>
              )}
            </button>
          </form>
          <p className="small text-secondary mt-4 mb-0">
            <Icon name="shield-lock" className="me-2" />
            Use the account provided by your administrator.
          </p>
        </div>
      </div>
    </main>
  )
}
