import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function ProtectedRoute({ roles }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  if (roles && !roles.includes(session.role))
    return <Navigate to="/employees" replace />
  return <Outlet />
}
