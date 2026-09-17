import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Icon, PageHeading } from '../components/UI'
export default function HomePage() {
  const { session, isAdmin } = useAuth()
  return (
    <>
      <PageHeading
        title={`Welcome, ${session.userId}`}
        description="Everything you need to keep your people connected."
      />
      <div className="welcome-banner mb-4">
        <div className="eyebrow">YOUR HR WORKSPACE</div>
        <h2>Good work starts with people.</h2>
        <p className="mb-0">
          Find a colleague, maintain employee records, and explore your
          organization.
        </p>
      </div>
      <div className="row g-4">
        {[
          [
            'people',
            'Employee directory',
            'Find and manage employee profiles.',
            '/employees',
          ],
          [
            'diagram-3',
            'Organization',
            'Explore departments and teams.',
            '/organization',
          ],
          ...(isAdmin
            ? [
                [
                  'person-gear',
                  'User Management',
                  'Create accounts and assign roles.',
                  '/users',
                ],
              ]
            : []),
        ].map(([icon, title, description, to]) => (
          <div className="col-12 col-md-6 col-xl-4" key={to}>
            <Link className="card p-4 home-link h-100" to={to}>
              <Icon name={icon} />
              <h3 className="h5 mt-4">{title}</h3>
              <p className="text-secondary">{description}</p>
              <span>
                Open workspace <Icon name="arrow-right" />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
