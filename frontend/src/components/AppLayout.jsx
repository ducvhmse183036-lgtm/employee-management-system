import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Offcanvas from 'bootstrap/js/dist/offcanvas'
import { useAuth } from '../auth/useAuth'
import { Icon } from './UI'

export default function AppLayout() {
  const { session, isAdmin, logout } = useAuth()
  const panel = useRef(null)
  const instance = useRef(null)
  const location = useLocation()
  useEffect(() => {
    const element = panel.current
    const offcanvas = new Offcanvas(element)
    instance.current = offcanvas
    return () => {
      // Let Bootstrap finish hiding so its scroll lock and focus trap are released.
      if (
        element.classList.contains('show') ||
        element.classList.contains('showing') ||
        element.classList.contains('hiding')
      ) {
        element.addEventListener(
          'hidden.bs.offcanvas',
          () => offcanvas.dispose(),
          { once: true },
        )
        if (!element.classList.contains('hiding')) offcanvas.hide()
      } else offcanvas.dispose()
    }
  }, [])
  useEffect(() => {
    instance.current?.hide()
  }, [location.pathname])
  const items = [
    ['/', 'grid-1x2', 'Home'],
    ['/employees', 'people', 'Employees'],
    ['/organization', 'diagram-3', 'Organization'],
    ...(isAdmin ? [['/users', 'person-gear', 'User Management']] : []),
  ]
  return (
    <div className="app-shell">
      <aside
        className="sidebar offcanvas-lg offcanvas-start"
        tabIndex="-1"
        ref={panel}
        aria-labelledby="navigation-title"
      >
        <div className="sidebar-brand">
          <span className="brand-mark">
            <Icon name="people-fill" />
          </span>
          <div id="navigation-title">
            People<span>EMPLOYEE MANAGEMENT</span>
          </div>
          <button
            className="btn-close btn-close-white d-lg-none ms-auto"
            onClick={() => instance.current.hide()}
            aria-label="Close navigation"
          />
        </div>
        <div className="sidebar-content">
          <div className="sidebar-caption">WORKSPACE</div>
          <nav aria-label="Main navigation">
            {items.map(([path, icon, label]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon name={icon} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="small mb-3">A place for your people.</div>
            <button className="sidebar-link w-100" onClick={() => logout()}>
              <Icon name="box-arrow-right" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="app-header">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light d-lg-none"
              aria-label="Open navigation"
              onClick={() => instance.current.show()}
            >
              <Icon name="list" />
            </button>
            <span className="header-title">Employee Management System</span>
          </div>
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <span className="small fw-semibold user-id">{session.userId}</span>
            <span className="role-badge">{session.role}</span>
            <button
              className="btn btn-sm btn-light"
              onClick={() => logout()}
              aria-label="Sign out"
            >
              <Icon name="box-arrow-right" />
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          Employee Management System{' '}
          <span>People & operations, connected.</span>
        </footer>
      </div>
    </div>
  )
}
