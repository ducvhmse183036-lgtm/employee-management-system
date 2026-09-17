import { useNavigate } from 'react-router-dom'
import OrganizationTree from '../components/OrganizationTree'
import { PageHeading } from '../components/UI'
export default function OrganizationPage() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeading
        title="Organization"
        description="Explore your structure, from corporations to individual teams."
      />
      <section className="card p-4">
        <OrganizationTree
          onSelect={(node) =>
            navigate(
              node
                ? `/employees?${new URLSearchParams({ type: node.type, id: node.id, name: node.name })}`
                : '/employees',
            )
          }
        />
      </section>
    </>
  )
}
