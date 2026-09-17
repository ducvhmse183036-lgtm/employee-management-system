import { useResource } from '../hooks/useResource'
import { EmptyState, ErrorMessage, Icon, LoadingSpinner } from './UI'

function Node({ node, type, onSelect, selected }) {
  const children =
    type === 'corporation'
      ? node.departments
      : type === 'department'
        ? node.organizationUnits
        : node.children
  const childType = type === 'corporation' ? 'department' : 'organization-unit'
  const label = (
    <>
      <Icon
        name={
          type === 'corporation'
            ? 'buildings'
            : type === 'department'
              ? 'building'
              : 'diagram-2'
        }
      />
      <span>{node.name}</span>
    </>
  )
  return (
    <li>
      <div className="tree-node">
        {type === 'corporation' ? (
          <span className="tree-corporation">{label}</span>
        ) : (
          <button
            className={`tree-button ${selected?.type === type && String(selected.id) === String(node.id) ? 'selected' : ''}`}
            onClick={() => onSelect?.({ type, id: node.id, name: node.name })}
          >
            {label}
          </button>
        )}
      </div>
      {children?.length > 0 && (
        <details open>
          <summary>
            Show / hide {children.length}{' '}
            {childType === 'department' ? 'departments' : 'units'}
          </summary>
          <ul>
            {children.map((child) => (
              <Node
                key={child.id}
                node={child}
                type={childType}
                onSelect={onSelect}
                selected={selected}
              />
            ))}
          </ul>
        </details>
      )}
    </li>
  )
}

export default function OrganizationTree({ onSelect, selected }) {
  const { data, loading, error, reload } = useResource('/api/organization-tree')
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h6 mb-0">Organization</h2>
        <Icon name="diagram-3" />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} retry={reload} />
      ) : !data?.length ? (
        <EmptyState title="No organization available" />
      ) : (
        <>
          <button
            className={`tree-button mb-2 ${!selected ? 'selected' : ''}`}
            onClick={() => onSelect?.(null)}
          >
            <Icon name="people" />
            All employees
          </button>
          <ul className="organization-tree">
            {data.map((node) => (
              <Node
                key={node.id}
                node={node}
                type="corporation"
                onSelect={onSelect}
                selected={selected}
              />
            ))}
          </ul>
          <p className="small text-secondary mt-4 mb-0">
            Selecting a unit shows employees assigned directly to that unit.
          </p>
        </>
      )}
    </>
  )
}
