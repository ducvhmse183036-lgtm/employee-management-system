// Synchronize loading and records with remote API requests.
/* eslint-disable react/set-state-in-effect */
import { fullName } from '../data/format'
import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { api } from '../api/apiClient'
import { useAuth } from '../auth/useAuth'
import AuthenticatedImage from '../components/AuthenticatedImage'
import OrganizationTree from '../components/OrganizationTree'
import {
  EmptyState,
  ErrorMessage,
  Icon,
  LoadingSpinner,
  PageHeading,
  StatusBadge,
} from '../components/UI'

export default function EmployeesPage() {
  const { canEdit } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const type = params.get('type'),
    id = params.get('id')
  const selected =
    ['department', 'organization-unit'].includes(type) && /^\d+$/.test(id || '')
      ? { type, id, name: params.get('name') || 'Selected organization' }
      : null
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({ loading: true, data: [], error: '' })
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setQuery(keyword.trim()), 300)
    return () => clearTimeout(timer)
  }, [keyword])
  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, data: [], error: '' })
    const hasSelection =
      ['department', 'organization-unit'].includes(type) &&
      /^\d+$/.test(id || '')
    const filterPath = hasSelection
      ? `/api/employees/${type}/${id}`
      : '/api/employees'
    // Search remains server-side; intersect IDs when an organization is also selected.
    const requests = query
      ? [
          api(`/api/employees/search?keyword=${encodeURIComponent(query)}`, {
            signal: controller.signal,
          }),
          ...(hasSelection
            ? [api(filterPath, { signal: controller.signal })]
            : []),
        ]
      : [api(filterPath, { signal: controller.signal })]
    Promise.all(requests)
      .then(([employees, scoped]) => {
        const ids = scoped && new Set(scoped.map((e) => e.id))
        if (!controller.signal.aborted)
          setState({
            loading: false,
            data: ids ? employees.filter((e) => ids.has(e.id)) : employees,
            error: '',
          })
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({ loading: false, data: [], error: e.message })
      })
    return () => controller.abort()
  }, [query, type, id, version])
  const employees = state.data.filter((e) => !status || e.status === status)
  return (
    <>
      <PageHeading
        title="Employees"
        description="Your people, organized and connected."
      >
        {canEdit && (
          <Link to="/employees/new" className="btn btn-primary">
            <Icon name="plus-lg" className="me-2" />
            Add employee
          </Link>
        )}
      </PageHeading>
      {location.state?.message && (
        <div className="alert alert-success" role="status">
          {location.state.message}
        </div>
      )}
      <div className="row g-4">
        <div className="col-12 col-xxl-3">
          <button
            className="btn btn-outline-secondary d-xxl-none w-100 mb-2"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="organization-filters"
          >
            <Icon name="diagram-3" className="me-2" />
            Organization filters
          </button>
          <section
            id="organization-filters"
            className={`card p-3 p-md-4 organization-panel ${open ? '' : 'd-none d-xxl-block'}`}
          >
            <OrganizationTree
              selected={selected}
              onSelect={(node) => {
                setParams(
                  node ? { type: node.type, id: node.id, name: node.name } : {},
                )
                setOpen(false)
              }}
            />
          </section>
        </div>
        <div className="col-12 col-xxl-9">
          <section className="card">
            <div className="p-3 p-md-4 border-bottom">
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                <h2 className="h5 mb-0">
                  {selected?.name || 'Employee directory'}
                </h2>
                <span className="text-secondary small">
                  {!state.loading && `${employees.length} employees`}
                </span>
              </div>
              <div className="row g-2">
                <div className="col-12 col-md-8">
                  <label htmlFor="employee-search" className="visually-hidden">
                    Search employees
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Icon name="search" />
                    </span>
                    <input
                      id="employee-search"
                      className="form-control border-start-0"
                      placeholder="Search by name or employee code…"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="status-filter" className="visually-hidden">
                    Employee status
                  </label>
                  <select
                    id="status-filter"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    {[
                      ...new Set([
                        'ACTIVE',
                        'INACTIVE',
                        ...state.data.map((e) => e.status).filter(Boolean),
                      ]),
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {selected && (
                <button
                  className="btn btn-sm btn-light mt-3"
                  onClick={() => setParams({})}
                >
                  Clear organization filter <Icon name="x" />
                </button>
              )}
            </div>
            {state.loading ? (
              <LoadingSpinner />
            ) : state.error ? (
              <div className="p-4">
                <ErrorMessage
                  message={state.error}
                  retry={() => setVersion((v) => v + 1)}
                />
              </div>
            ) : !employees.length ? (
              <EmptyState
                title="No employees found"
                description="Try a different search or organization filter."
              />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 employee-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Code</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>
                        <span className="visually-hidden">Open profile</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr
                        key={employee.id}
                        onClick={() => navigate(`/employees/${employee.id}`)}
                      >
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <AuthenticatedImage
                              src={employee.photoUrl}
                              name={fullName(employee)}
                            />
                            <Link
                              to={`/employees/${employee.id}`}
                              className="employee-name"
                            >
                              {fullName(employee)}
                            </Link>
                          </div>
                        </td>
                        <td className="text-secondary" data-label="Code">
                          {employee.employeeCode}
                        </td>
                        <td data-label="Position">{employee.positionTitle || '—'}</td>
                        <td data-label="Status">
                          <StatusBadge status={employee.status} />
                        </td>
                        <td className="employee-row-arrow">
                          <Icon name="chevron-right" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="card-note">
              Employee records · Select an employee to view their profile
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
