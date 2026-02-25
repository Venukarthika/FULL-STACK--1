import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useProjects } from '../contexts/ProjectsContext.jsx'
import ProjectCard from '../components/projects/ProjectCard.jsx'
import NewProjectForm from '../components/projects/NewProjectForm.jsx'
import ProjectDetailModal from '../components/projects/ProjectDetailModal.jsx'
import { STATUS_OPTIONS } from '../constants/projectStatus.js'

const ALL = 'All'

export default function StudentProjectsPage() {
  const { projects } = useProjects()
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL)

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.course.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === ALL || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="page">
      <section className="page-header with-actions">
        <div>
          <h1>My projects</h1>
          <p>Create, track, and refine your academic projects.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Close form' : '+ New project'}
        </button>
      </section>

      {showForm && <NewProjectForm onClose={() => setShowForm(false)} />}

      {/* Search + filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <FaSearch className="search-input-icon" />
          <input
            className="search-input"
            placeholder="Search by title or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {[ALL, ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              className={`filter-chip ${statusFilter === s ? 'filter-chip-active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="grid-2">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <p>No projects match your filter.</p>
          </div>
        )}
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
