import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeFormPage from './pages/EmployeeFormPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import OrganizationPage from './pages/OrganizationPage'
import UserManagementPage from './pages/UserManagementPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route element={<ProtectedRoute roles={['ADMIN', 'HR']} />}>
                <Route path="employees/new" element={<EmployeeFormPage />} />
                <Route
                  path="employees/:id/edit"
                  element={<EmployeeFormPage />}
                />
              </Route>
              <Route path="employees/:id" element={<EmployeeDetailPage />} />
              <Route path="organization" element={<OrganizationPage />} />
              <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                <Route path="users" element={<UserManagementPage />} />
              </Route>
              <Route
                path="*"
                element={
                  <div className="card p-5 text-center">
                    <h1 className="h3">Page not found</h1>
                    <Link to="/employees">Return to employees</Link>
                  </div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
