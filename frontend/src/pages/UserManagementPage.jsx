import { useState } from 'react'
import { api } from '../api/apiClient'
import Fields from '../components/Fields'
import { ErrorMessage, Icon, PageHeading } from '../components/UI'

const emptyUser = { userId: '', password: '', role: 'VIEWER', employeeId: '' }

export default function UserManagementPage() {
  const [values, setValues] = useState(emptyUser)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    if (
      values.employeeId &&
      (!Number.isSafeInteger(Number(values.employeeId)) ||
        Number(values.employeeId) < 1)
    ) {
      setError('Employee ID must be a positive whole number.')
      return
    }
    setBusy(true)
    setError('')
    setCreated(null)
    try {
      const result = await api('/api/users', {
        method: 'POST',
        body: {
          ...values,
          userId: values.userId.trim(),
          employeeId: values.employeeId ? Number(values.employeeId) : null,
        },
      })
      setCreated({ userId: result.userId, role: result.role })
      setValues({ ...emptyUser })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeading
        title="User Management"
        description="Give your team the right access to their workspace."
      />
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <section className="card p-3 p-md-4">
            <h2 className="h5 mb-4">Create a user</h2>
            {created && (
              <div className="alert alert-success" role="status">
                User <strong>{created.userId}</strong> created with the{' '}
                {created.role} role.
              </div>
            )}
            <ErrorMessage message={error} />
            <form onSubmit={submit}>
              <Fields
                fields={[
                  { name: 'userId', label: 'User ID', required: true },
                  {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    required: true,
                  },
                  {
                    name: 'role',
                    label: 'Role',
                    type: 'select',
                    required: true,
                    options: ['ADMIN', 'HR', 'VIEWER'],
                  },
                  {
                    name: 'employeeId',
                    label: 'Employee ID (optional)',
                    type: 'number',
                    help: 'Use the numeric ID of an existing employee, not their employee code.',
                  },
                ]}
                value={values}
                disabled={busy}
                onChange={(name, value) =>
                  setValues((v) => ({ ...v, [name]: value }))
                }
              />
              <div className="form-actions">
                <button className="btn btn-primary" disabled={busy}>
                  {busy ? 'Creating…' : 'Create user'}
                </button>
              </div>
            </form>
          </section>
        </div>
        <div className="col-12 col-xl-4">
          <aside className="card p-4">
            <Icon name="shield-check" className="fs-3 text-primary mb-3" />
            <h2 className="h5">Roles & permissions</h2>
            <dl className="mb-0">
              <dt className="mt-3">ADMIN</dt>
              <dd>
                Manage employee records, delete employees, and create user
                accounts.
              </dd>
              <dt className="mt-3">HR</dt>
              <dd>Create and update employee records and photos.</dd>
              <dt className="mt-3">VIEWER</dt>
              <dd>Read employee profiles and organization information.</dd>
            </dl>
          </aside>
        </div>
      </div>
    </>
  )
}
