import { humanize } from '../data/format'

export default function Fields({ fields, value, onChange, disabled = false }) {
  return (
    <div className="row g-3">
      {fields.map((field) => {
        const {
          name,
          label,
          type = 'text',
          required,
          options,
          readOnly,
        } = field
        const props = {
          id: name,
          name,
          required,
          disabled: disabled || readOnly,
          value: value[name] ?? '',
          onChange: (e) =>
            onChange(
              name,
              type === 'checkbox' ? e.target.checked : e.target.value,
            ),
        }
        return (
          <div className={field.wide ? 'col-12' : 'col-12 col-md-6'} key={name}>
            {type !== 'checkbox' && (
              <label className="form-label" htmlFor={name}>
                {label}
                {required && (
                  <span className="text-danger" aria-hidden="true">
                    {' '}
                    *
                  </span>
                )}
              </label>
            )}
            {type === 'select' ? (
              <select className="form-select" {...props}>
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                  <option
                    key={option.value ?? option}
                    value={option.value ?? option}
                  >
                    {option.label ?? humanize(option)}
                  </option>
                ))}
              </select>
            ) : type === 'textarea' ? (
              <textarea className="form-control" rows="3" {...props} />
            ) : type === 'checkbox' ? (
              <div className="form-check mt-3">
                <input
                  {...props}
                  value={undefined}
                  checked={Boolean(value[name])}
                  type="checkbox"
                  className="form-check-input"
                />
                <label className="form-check-label" htmlFor={name}>
                  {label}
                </label>
              </div>
            ) : (
              <input
                className="form-control"
                type={type}
                {...props}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' ? 'any' : undefined}
                autoComplete={type === 'password' ? 'new-password' : undefined}
              />
            )}
            {field.help && <div className="form-text">{field.help}</div>}
          </div>
        )
      })}
    </div>
  )
}
