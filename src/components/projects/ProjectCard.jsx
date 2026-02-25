export default function ProjectCard({ project, onClick }) {
  const statusClass = `status-${project.status.toLowerCase().replace(/\s+/g, '-')}`
  const doneMilestones = project.milestones.filter((m) => m.completed).length

  return (
    <article
      className="project-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <header className="project-card-header">
        <div>
          <h2>{project.title}</h2>
          <p className="muted">
            {project.course} • {project.studentName}
          </p>
        </div>
        <span className={`status-pill ${statusClass}`}>{project.status}</span>
      </header>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      {project.tags?.length > 0 && (
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="project-progress-row">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <span className="progress-label">{project.progress}%</span>
      </div>

      <div className="project-meta-row">
        <span className="meta-item">
          {doneMilestones}/{project.milestones.length} milestones
        </span>
        <span className="meta-item">Updated {project.lastUpdated}</span>
      </div>
    </article>
  )
}
