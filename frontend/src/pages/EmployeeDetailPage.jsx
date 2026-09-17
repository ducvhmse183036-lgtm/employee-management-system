import { fullName } from '../data/format'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/apiClient'
import { useAuth } from '../auth/useAuth'
import { useResource } from '../hooks/useResource'
import AuthenticatedImage from '../components/AuthenticatedImage'
import Modal from '../components/Modal'
import ProfileSection from '../components/ProfileSection'
import {
  ErrorMessage,
  Icon,
  LoadingSpinner,
  PageHeading,
  StatusBadge,
} from '../components/UI'
import { profileSections } from '../data/profileFields'

export default function EmployeeDetailPage() {
  const { id } = useParams()
  return <EmployeeProfile key={id} id={id} />
}

function findUnit(units, id) {
  for (const unit of units || []) {
    if (unit.id === id) return unit
    const found = findUnit(unit.children, id)
    if (found) return found
  }
}

function EmployeeProfile({ id }) {
  const {
    data: employee,
    loading,
    error,
    reload,
  } = useResource(`/api/employees/${id}`)
  const { data: tree } = useResource('/api/organization-tree')
  const { canEdit, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('basic')
  const [visited, setVisited] = useState([])
  const [photoUrl, setPhotoUrl] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState(location.state?.message || '')
  const [deleting, setDeleting] = useState(false)

  async function upload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || busy) return
    setActionError('')
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setActionError('Choose a JPG, PNG, or WEBP image up to 5 MB.')
      return
    }
    setBusy(true)
    const body = new FormData()
    body.append('file', file)
    try {
      const result = await api(`/api/employees/${id}/photo`, {
        method: 'POST',
        body,
      })
      setPhotoUrl(result.photoUrl)
      setSuccess('Employee photo updated.')
    } catch (e) {
      setActionError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (busy) return
    setBusy(true)
    setActionError('')
    try {
      await api(`/api/employees/${id}`, { method: 'DELETE' })
      navigate('/employees', {
        replace: true,
        state: { message: 'Employee deactivated successfully (soft delete).' },
      })
    } catch (e) {
      setActionError(e.message)
    } finally {
      setBusy(false)
    }
  }

  function selectTab(key) {
    setTab(key)
    setVisited((v) => (v.includes(key) ? v : [...v, key]))
  }

  if (loading) return <LoadingSpinner />
  if (error)
    return (
      <>
        <Link className="back-link" to="/employees">
          ← Employees
        </Link>
        <ErrorMessage message={error} retry={reload} />
      </>
    )
  if (!employee) return null
  const department = tree
    ?.flatMap((c) => c.departments || [])
    .find((d) => d.id === employee.departmentId)
  const unit = findUnit(
    department?.organizationUnits,
    employee.organizationUnitId,
  )
  const basic = [
    ['Employee code', employee.employeeCode],
    ['Surname', employee.surname],
    ['Middle name', employee.middleName],
    ['Given name', employee.givenName],
    ['Gender', employee.gender],
    ['Identity card', employee.identityCard],
    ['Identity card issue place', employee.identityCardIssuePlace],
    ['Identity card issue date', employee.identityCardIssueDate],
    ['Department', department?.name || employee.departmentId],
    ['Organization unit', unit?.name || employee.organizationUnitId],
    ['Position', employee.positionTitle],
    ['Hire date', employee.hireDate],
    ['Created at', employee.createdAt],
    ['Updated at', employee.updatedAt],
  ]
  const tabs = [
    ['basic', 'Employee Basic Info'],
    ...Object.entries(profileSections).map(([key, config]) => [
      key,
      config.title,
    ]),
  ]

  return (
    <>
      <Link className="back-link" to="/employees">
        ← Back to employees
      </Link>
      <PageHeading
        title="Employee profile"
        description="A complete view of your employee’s information."
      />
      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}
      {!deleting && <ErrorMessage message={actionError} />}
      <section className="card profile-header p-3 p-md-4 mb-4">
        <div className="d-flex flex-wrap align-items-center gap-4">
          <AuthenticatedImage
            src={photoUrl || employee.photoUrl}
            name={fullName(employee)}
            large
          />
          <div className="flex-grow-1 profile-identity">
            <div className="small text-secondary mb-2">
              {employee.employeeCode}
            </div>
            <h2 className="h3 mb-2">{fullName(employee)}</h2>
            <div className="d-flex align-items-center flex-wrap gap-3">
              <span className="text-secondary">
                {employee.positionTitle || 'Position not specified'}
              </span>
              <StatusBadge status={employee.status} />
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap profile-actions">
            {canEdit && (
              <>
                <Link to={`/employees/${id}/edit`} className="btn btn-primary">
                  <Icon name="pencil" className="me-2" />
                  Edit employee
                </Link>
                <label
                  className={`btn btn-outline-primary mb-0 ${busy ? 'disabled' : ''}`}
                >
                  <Icon name="camera" className="me-2" />
                  {busy && !deleting ? 'Uploading…' : 'Change photo'}
                  <input
                    className="visually-hidden"
                    aria-label="Upload employee photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={busy}
                    onChange={upload}
                  />
                </label>
              </>
            )}
            {isAdmin && (
              <button
                className="btn btn-outline-danger"
                disabled={busy}
                onClick={() => {
                  setActionError('')
                  setDeleting(true)
                }}
              >
                <Icon name="trash" className="me-2" />
                Delete
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="card">
        <div
          className="profile-tabs nav nav-tabs"
          role="tablist"
          aria-label="Employee information"
        >
          {tabs.map(([key, title], index) => (
            <button
              id={`tab-${key}`}
              key={key}
              role="tab"
              aria-selected={tab === key}
              aria-controls={`panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              className={`nav-link ${tab === key ? 'active' : ''}`}
              onClick={() => selectTab(key)}
              onKeyDown={(event) => {
                if (
                  !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(
                    event.key,
                  )
                )
                  return
                event.preventDefault()
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? tabs.length - 1
                      : (index +
                          (event.key === 'ArrowRight' ? 1 : -1) +
                          tabs.length) %
                        tabs.length
                selectTab(tabs[next][0])
                document.getElementById(`tab-${tabs[next][0]}`).focus()
              }}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="p-3 p-md-4">
          <div
            id="panel-basic"
            role="tabpanel"
            aria-labelledby="tab-basic"
            hidden={tab !== 'basic'}
          >
            <h2 className="h5 mb-4">Employee Basic Info</h2>
            <dl className="row g-4 mb-0">
              {basic.map(([label, value]) => (
                <div className="col-12 col-sm-6 col-xl-4" key={label}>
                  <dt>{label}</dt>
                  <dd>{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
          {visited
            .filter((key) => key !== 'basic')
            .map((key) => (
              <div
                key={key}
                id={`panel-${key}`}
                role="tabpanel"
                aria-labelledby={`tab-${key}`}
                hidden={tab !== key}
              >
                <ProfileSection employeeId={id} section={key} />
              </div>
            ))}
        </div>
      </section>
      {deleting && (
        <Modal
          title="Delete employee?"
          busy={busy}
          onClose={() => !busy && setDeleting(false)}
        >
          <p>
            <strong>{fullName(employee)}</strong> will be marked inactive. Their
            record is retained by the system.
          </p>
          <ErrorMessage message={actionError} />
          <div className="form-actions">
            <button
              className="btn btn-light"
              disabled={busy}
              onClick={() => setDeleting(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" disabled={busy} onClick={remove}>
              {busy ? 'Deleting…' : 'Confirm delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
