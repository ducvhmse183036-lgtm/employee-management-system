export function humanize(value) {
  return String(value)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
export function fullName(employee) {
  return [employee.surname, employee.middleName, employee.givenName]
    .filter(Boolean)
    .join(' ')
}
export function formatValue(value, type) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (type === 'number')
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
      value,
    )
  if (type === 'select') return humanize(value)
  return String(value)
}
