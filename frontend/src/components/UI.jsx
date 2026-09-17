import { humanize } from '../data/format'
export function Icon({ name, className = '' }) {
  return <i aria-hidden="true" className={`bi bi-${name} ${className}`} />
}
export function LoadingSpinner() {
  return (
    <div className="p-5 text-center" role="status">
      <span className="spinner-border spinner-border-sm me-2" />
      Loading…
    </div>
  )
}
export function ErrorMessage({ message, retry }) {
  return (
    message && (
      <div className="alert alert-danger" role="alert">
        {message}
        {retry && (
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={retry}
          >
            Try again
          </button>
        )}
      </div>
    )
  )
}
export function EmptyState({
  title = 'No records yet',
  description = 'New records will appear here.',
}) {
  return (
    <div className="empty-state">
      <Icon name="inbox" />
      <h3 className="h6 mt-3">{title}</h3>
      <p className="text-secondary mb-0">{description}</p>
    </div>
  )
}
export function PageHeading({
  eyebrow = 'PEOPLE & OPERATIONS',
  title,
  description,
  children,
}) {
  return (
    <div className="page-heading d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p className="text-secondary mb-0">{description}</p>}
      </div>
      <div className="d-flex gap-2 flex-wrap">{children}</div>
    </div>
  )
}
export function StatusBadge({ status }) {
  return (
    <span
      className={`badge rounded-pill ${status === 'ACTIVE' ? 'text-bg-success' : 'text-bg-secondary'}`}
    >
      {humanize(status || 'Unknown')}
    </span>
  )
}
