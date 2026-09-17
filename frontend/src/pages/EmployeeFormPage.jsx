// Synchronize loading and records with remote API requests.
/* eslint-disable react/set-state-in-effect */
import { payloadFor } from '../data/payload'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/apiClient'
import Fields from '../components/Fields'
import { ErrorMessage, LoadingSpinner, PageHeading } from '../components/UI'

export default function EmployeeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState({ status: 'ACTIVE' })
  const [corporations, setCorporations] = useState([])
  const [corporation, setCorporation] = useState('')
  const [departments, setDepartments] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [lookupError, setLookupError] = useState('')
  const [departmentLoading, setDepartmentLoading] = useState(false)
  const [unitsLoading, setUnitsLoading] = useState(false)
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }
    setLoading(true)
    setError('')
    Promise.all([
      api('/api/corporations', options),
      api('/api/organization-tree', options),
      id ? api(`/api/employees/${id}`, options) : null,
    ])
      .then(([corps, tree, employee]) => {
        if (controller.signal.aborted) return
        setCorporations(corps)
        if (employee) {
          setValues(employee)
          const parent = tree.find((c) =>
            c.departments?.some((d) => d.id === employee.departmentId),
          )
          setCorporation(parent ? String(parent.id) : '')
        }
        setLoading(false)
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(e.message)
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [id, version])
  useEffect(() => {
    const controller = new AbortController()
    setDepartments([])
    setLookupError('')
    if (corporation) {
      setDepartmentLoading(true)
      api(`/api/departments/corporation/${corporation}`, {
        signal: controller.signal,
      })
        .then((data) => {
          if (!controller.signal.aborted) setDepartments(data)
        })
        .catch((e) => {
          if (!controller.signal.aborted) setLookupError(e.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setDepartmentLoading(false)
        })
    } else setDepartmentLoading(false)
    return () => controller.abort()
  }, [corporation, version])
  useEffect(() => {
    const controller = new AbortController()
    setUnits([])
    if (values.departmentId) {
      setUnitsLoading(true)
      api(`/api/organization-units/department/${values.departmentId}`, {
        signal: controller.signal,
      })
        .then((data) => {
          if (!controller.signal.aborted) setUnits(data)
        })
        .catch((e) => {
          if (!controller.signal.aborted) setLookupError(e.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setUnitsLoading(false)
        })
    } else setUnitsLoading(false)
    return () => controller.abort()
  }, [values.departmentId, version])
  const fields = [
    {
      name: 'employeeCode',
      label: 'Employee code',
      required: true,
      readOnly: Boolean(id),
      help: id ? 'Employee codes cannot be changed.' : undefined,
    },
    { name: 'surname', label: 'Surname', required: true },
    { name: 'middleName', label: 'Middle name' },
    { name: 'givenName', label: 'Given name', required: true },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['MALE', 'FEMALE', 'OTHER'],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        ...new Set(['ACTIVE', 'INACTIVE', values.status].filter(Boolean)),
      ],
    },
    { name: 'identityCard', label: 'Identity card' },
    { name: 'identityCardIssuePlace', label: 'Identity card issue place' },
    {
      name: 'identityCardIssueDate',
      label: 'Identity card issue date',
      type: 'date',
    },
    { name: 'positionTitle', label: 'Position title' },
    { name: 'hireDate', label: 'Hire date', type: 'date' },
    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      required: true,
      numeric: true,
      options: departments.map((d) => ({ value: d.id, label: d.name })),
    },
    {
      name: 'organizationUnitId',
      label: 'Organization unit',
      type: 'select',
      numeric: true,
      options: units.map((u) => ({
        value: u.id,
        label: `${u.name}${u.unitType ? ` (${u.unitType})` : ''}`,
      })),
    },
  ]
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const body = {
        ...payloadFor(fields, values),
        photoUrl: values.photoUrl || null,
      }
      const employee = await api(
        id ? `/api/employees/${id}` : '/api/employees',
        { method: id ? 'PUT' : 'POST', body },
      )
      navigate(`/employees/${employee.id}`, {
        replace: true,
        state: {
          message: id
            ? 'Employee updated successfully.'
            : 'Employee created. You can now add a photo and complete their profile.',
        },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <Link className="back-link" to={id ? `/employees/${id}` : '/employees'}>
        ← Back to {id ? 'profile' : 'employees'}
      </Link>
      <PageHeading
        title={id ? 'Edit employee' : 'Add employee'}
        description="Build a clear, complete employee record."
      />
      <section className="card p-3 p-md-4 form-card">
        <ErrorMessage message={error} retry={() => setVersion((v) => v + 1)} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={submit}>
            <p className="small text-secondary">
              Fields marked <span className="text-danger">*</span> are required.
              Employee photos can be uploaded from the profile.
            </p>
            <ErrorMessage
              message={lookupError}
              retry={() => setVersion((v) => v + 1)}
            />
            <div className="mb-4">
              <label className="form-label" htmlFor="corporation">
                Corporation <span className="text-danger">*</span>
              </label>
              <select
                id="corporation"
                className="form-select"
                required
                value={corporation}
                disabled={busy}
                onChange={(e) => {
                  setCorporation(e.target.value)
                  setValues((v) => ({
                    ...v,
                    departmentId: '',
                    organizationUnitId: '',
                  }))
                }}
              >
                <option value="">Select corporation</option>
                {corporations.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Fields
              fields={fields}
              value={values}
              disabled={busy || departmentLoading || unitsLoading}
              onChange={(name, value) =>
                setValues((v) => ({
                  ...v,
                  [name]: value,
                  ...(name === 'departmentId'
                    ? { organizationUnitId: '' }
                    : {}),
                }))
              }
            />
            <div className="form-actions">
              <Link
                className="btn btn-light"
                to={id ? `/employees/${id}` : '/employees'}
              >
                Cancel
              </Link>
              <button
                className="btn btn-primary"
                disabled={
                  busy ||
                  departmentLoading ||
                  unitsLoading ||
                  Boolean(lookupError) ||
                  !corporations.length
                }
              >
                {busy ? 'Saving…' : 'Save employee'}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
