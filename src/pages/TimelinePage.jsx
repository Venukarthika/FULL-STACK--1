import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'
import { useProjects } from '../contexts/ProjectsContext.jsx'

export default function TimelinePage() {
  const { projects, toggleMilestone } = useProjects()

  const allMilestones = projects.flatMap((project) =>
    project.milestones.map((m) => ({
      ...m,
      projectId: project.id,
      projectTitle: project.title,
      studentName: project.studentName,
    })),
  )

  const sorted = [...allMilestones].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate) - new Date(b.dueDate)
  })

  return (
    <div className="page">
      <section className="page-header">
        <h1>Project timeline</h1>
        <p>
          See upcoming and completed milestones across all projects. Click any
          milestone to toggle its completion.
        </p>
      </section>

      <section className="timeline">
        {sorted.map((m) => (
          <div
            key={m.id}
            className={`timeline-item ${m.completed ? 'timeline-item-done' : ''}`}
            onClick={() => toggleMilestone(m.projectId, m.id)}
            title="Click to toggle completion"
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h3>{m.title}</h3>
              <p className="muted">
                {m.projectTitle} • {m.studentName}
              </p>
              {m.dueDate && <p className="muted">Due {m.dueDate}</p>}
              <span className="timeline-check">
                {m.completed ? (
                  <>
                    <FaCheckCircle /> Completed
                  </>
                ) : (
                  <>
                    <FaRegCircle /> Mark complete
                  </>
                )}
              </span>
            </div>
          </div>
        ))}

        {allMilestones.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🗓️</div>
            <p>No milestones yet. Add some from your projects.</p>
          </div>
        )}
      </section>
    </div>
  )
}
