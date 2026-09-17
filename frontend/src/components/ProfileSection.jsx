// Synchronize loading and records with remote API requests.
/* eslint-disable react/set-state-in-effect */
import { payloadFor } from '../data/payload'
import { formatValue } from '../data/format'
import { useEffect, useState } from 'react'
import { api } from '../api/apiClient'
import { useAuth } from '../auth/useAuth'
import { profileSections } from '../data/profileFields'
import Fields from './Fields'
import Modal from './Modal'
import { EmptyState, ErrorMessage, Icon, LoadingSpinner } from './UI'

export default function ProfileSection({ employeeId, section }) {
  const config = profileSections[section]
  const { canEdit } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [success, setSuccess] = useState('')
  const path = `/api/employees/${employeeId}/${section}`
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    api(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setRecords(config.single ? (data ? [data] : []) : data)
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        if (config.single && e.status === 404) setRecords([])
        else setError(e.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [path, config.single, version])
  function edit(record) {
    setSaveError('')
    setEditing(record ? { ...record } : { status: 'ACTIVE', dependent: false })
  }
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const body = payloadFor(config.fields, editing)
    const start = body.startDate || body.effectiveFrom
    const end = body.endDate || body.effectiveTo
    if (start && end && end < start) {
      setSaveError('End date must be on or after the start date.')
      return
    }
    const existing = config.single ? records.length > 0 : editing.id != null
    setBusy(true)
    setSaveError('')
    try {
      await api(
        `${path}${existing && !config.single ? `/${editing.id}` : ''}`,
        { method: existing ? 'PUT' : 'POST', body },
      )
      setEditing(null)
      setSuccess(`${config.singular} saved successfully.`)
      setVersion((v) => v + 1)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="h5 mb-1">{config.title}</h2>
          <p className="small text-secondary mb-0">
            {config.single
              ? 'Personal and contact information.'
              : 'Keep employee records up to date.'}
          </p>
        </div>
        {canEdit &&
          !loading &&
          !error &&
          (!config.single || !records.length) && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => edit(null)}
            >
              <Icon name="plus-lg" className="me-2" />
              Add {config.singular}
            </button>
          )}
      </div>
      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} retry={() => setVersion((v) => v + 1)} />
      ) : !records.length ? (
        <EmptyState
          title={`No ${config.title.toLowerCase()} yet`}
          description={
            canEdit
              ? 'Add information to complete this employee’s profile.'
              : 'No information has been added for this employee.'
          }
        />
      ) : (
        <div className="d-grid gap-3">
          {records.map((record, index) => (
            <article className="record-card" key={record.id ?? index}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 mb-0">
                  {record.contractNumber ||
                    record.fullName ||
                    record.allowanceType ||
                    'Personal details'}
                </h3>
                {canEdit && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => edit(record)}
                  >
                    <Icon name="pencil" className="me-2" />
                    Edit
                  </button>
                )}
              </div>
              <dl className="row g-3 mb-0">
                {config.fields.map((f) => (
                  <div
                    key={f.name}
                    className={f.wide ? 'col-12' : 'col-12 col-sm-6 col-xl-4'}
                  >
                    <dt>{f.label}</dt>
                    <dd>{formatValue(record[f.name], f.type)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <Modal
          title={`${(config.single && records.length) || editing.id ? 'Edit' : 'Add'} ${config.singular}`}
          busy={busy}
          onClose={() => !busy && setEditing(null)}
        >
          <form onSubmit={submit}>
            <ErrorMessage message={saveError} />
            <Fields
              fields={config.fields}
              value={editing}
              disabled={busy}
              onChange={(name, value) =>
                setEditing((v) => ({ ...v, [name]: value }))
              }
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-light"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  )
}
