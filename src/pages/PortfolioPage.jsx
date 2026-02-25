import { useProjects } from '../contexts/ProjectsContext.jsx'

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #7b5cff, #3f2deb, #e46dff)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #f97316, #ec4899)',
  'linear-gradient(135deg, #10b981, #3b82f6)',
  'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
]

function getGradient(index) {
  return THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]
}

function getInitials(title) {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function PortfolioPage() {
  const { projects } = useProjects()

  return (
    <div className="page">
      <section className="page-header">
        <h1>Portfolio gallery</h1>
        <p>Explore finished and in-progress work as a visual portfolio.</p>
      </section>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼️</div>
          <p>No projects yet. Create one in My Projects.</p>
        </div>
      ) : (
        <section className="portfolio-grid">
          {projects.map((project, i) => (
            <div key={project.id} className="portfolio-card">
              <div
                className="portfolio-thumb"
                style={{ background: getGradient(i) }}
              >
                <span className="portfolio-initials">{getInitials(project.title)}</span>
              </div>
              <div className="portfolio-body">
                <h2>{project.title}</h2>
                <p className="muted">{project.studentName}</p>
                {project.tags?.length > 0 && (
                  <div className="tag-row" style={{ marginTop: '0.1rem' }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.description && (
                  <p className="portfolio-snippet">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
