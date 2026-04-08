import { useAuth } from '../contexts/AuthContext.jsx'
import { useProjects } from '../contexts/ProjectsContext.jsx'
import StatCard from '../components/StatCard.jsx'

export default function OverviewPage() {
  const { user } = useAuth()
  const { stats } = useProjects()

  return (
    <div className="page">
      <section className="panel overview-panel">
        <div className="page-header">
          <h1>
            {user
              ? `Welcome back, ${user.name.split(' ')[0]} 👋`
              : 'Welcome to Projectfolio'}
          </h1>
          <p>
            A clean, official workspace for tracking student projects,
            showcasing portfolios, and keeping mentors in the loop.
          </p>
        </div>

        {!user && (
          <div className="hero-login-banner">
            <p className="muted">
              Sign in as a student to start uploading projects, or as a faculty
              member to review and leave feedback. Your entire journey stays in
              one verified place.
            </p>
          </div>
        )}

        <div className="overview-stats">
          <StatCard label="Total projects" value={stats.total} accent="a" />
          <StatCard label="In progress" value={stats.inProgress} accent="b" />
          <StatCard label="Submitted" value={stats.submitted} accent="c" />
          <StatCard label="Approved" value={stats.approved} accent="d" />
          <StatCard label="Drafts" value={stats.draft} accent="e" />
        </div>
      </section>
    </div>
  )
}
