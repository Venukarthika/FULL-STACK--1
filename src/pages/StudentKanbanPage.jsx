import { useMemo, useRef, useState } from 'react'
import { useProjects } from '../contexts/ProjectsContext.jsx'
import { STATUS_OPTIONS } from '../constants/projectStatus.js'
import ProjectDetailModal from '../components/projects/ProjectDetailModal.jsx'

const statusClassName = (status) => `status-${status.toLowerCase().replace(/\s+/g, '-')}`

export default function StudentKanbanPage() {
  const { projects, updateProject } = useProjects()
  const [draggingProjectId, setDraggingProjectId] = useState(null)
  const [activeDropStatus, setActiveDropStatus] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const dragIntentRef = useRef(false)

  const grouped = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = projects.filter((project) => project.status === status)
      return acc
    }, {})
  }, [projects])

  const moveProject = (projectId, status) => {
    const project = projects.find((item) => item.id === projectId)
    if (!project || project.status === status) return
    updateProject(projectId, { status })
  }

  return (
    <div className="page">
      <section className="page-header">
        <h1>Kanban board</h1>
        <p>
          Drag projects between columns to keep your workflow updated in one view.
        </p>
      </section>

      <section className="kanban-board">
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            className={`kanban-column ${activeDropStatus === status ? 'kanban-column-active' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setActiveDropStatus(status)
            }}
            onDragLeave={() => {
              setActiveDropStatus((current) => (current === status ? null : current))
            }}
            onDrop={(event) => {
              event.preventDefault()
              moveProject(draggingProjectId, status)
              setDraggingProjectId(null)
              setActiveDropStatus(null)
            }}
          >
            <header className="kanban-column-header">
              <h2>{status}</h2>
              <span className="kanban-column-count">{grouped[status]?.length ?? 0}</span>
            </header>

            <div className="kanban-column-list">
              {(grouped[status] ?? []).map((project) => {
                const doneMilestones = project.milestones.filter((m) => m.completed).length

                return (
                  <article
                    key={project.id}
                    className="kanban-card"
                    draggable
                    onClick={() => {
                      if (dragIntentRef.current) return
                      setSelectedProject(project)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedProject(project)
                      }
                    }}
                    onDragStart={() => {
                      dragIntentRef.current = true
                      setDraggingProjectId(project.id)
                    }}
                    onDragEnd={() => {
                      setDraggingProjectId(null)
                      setActiveDropStatus(null)
                      setTimeout(() => {
                        dragIntentRef.current = false
                      }, 0)
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="kanban-card-top">
                      <h3>{project.title}</h3>
                      <span className={`status-pill ${statusClassName(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="muted">{project.course}</p>

                    <div className="project-progress-row">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="progress-label">{project.progress}%</span>
                    </div>

                    <div className="project-meta-row">
                      <span className="meta-item">{doneMilestones}/{project.milestones.length} milestones</span>
                      <span className="meta-item">{project.lastUpdated}</span>
                    </div>

                    <div className="kanban-card-actions">
                      <button
                        className="ghost-btn sm-btn"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedProject(project)
                        }}
                      >
                        View details
                      </button>
                    </div>
                  </article>
                )
              })}

              {(grouped[status]?.length ?? 0) === 0 && (
                <div className="kanban-empty">Drop a project here</div>
              )}
            </div>
          </div>
        ))}
      </section>

      {selectedProject && (
        <ProjectDetailModal
          project={projects.find((p) => p.id === selectedProject.id) ?? selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}
