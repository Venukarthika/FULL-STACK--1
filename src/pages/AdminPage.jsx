import { Fragment, useMemo, useState } from 'react'
import {
  FaSearch,
  FaCommentAlt,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
} from 'react-icons/fa'
import { useProjects } from '../contexts/ProjectsContext.jsx'
import StatCard from '../components/StatCard.jsx'
import { STATUS_OPTIONS } from '../constants/projectStatus.js'

const ALL = 'All'
const ALL_COURSES = 'All courses'
const ALL_TAGS = 'All tags'
const SORT_UPDATED = 'updated_desc'
const SORT_PROGRESS = 'progress_desc'
const SORT_STUDENT = 'student_asc'

export default function AdminPage() {
  const { projects, stats, updateProject, addFeedback } = useProjects()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL)
  const [courseFilter, setCourseFilter] = useState(ALL_COURSES)
  const [tagFilter, setTagFilter] = useState(ALL_TAGS)
  const [sortBy, setSortBy] = useState(SORT_UPDATED)
  const [expandedRow, setExpandedRow] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackFrom, setFeedbackFrom] = useState('')

  const courseOptions = useMemo(
    () => [
      ALL_COURSES,
      ...Array.from(new Set(projects.map((p) => p.course).filter(Boolean))).sort(),
    ],
    [projects],
  )

  const tagOptions = useMemo(
    () => [
      ALL_TAGS,
      ...Array.from(
        new Set(
          projects
            .flatMap((p) => p.tags || [])
            .filter((tag) => typeof tag === 'string' && tag.trim() !== ''),
        ),
      ).sort(),
    ],
    [projects],
  )

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    const base = projects.filter((p) => {
      const matchesSearch =
        !normalizedSearch ||
        p.title.toLowerCase().includes(normalizedSearch) ||
        p.studentName.toLowerCase().includes(normalizedSearch) ||
        (p.course && p.course.toLowerCase().includes(normalizedSearch))

      const matchesStatus = statusFilter === ALL || p.status === statusFilter
      const matchesCourse =
        courseFilter === ALL_COURSES || (p.course && p.course === courseFilter)
      const matchesTag =
        tagFilter === ALL_TAGS ||
        (Array.isArray(p.tags) && p.tags.some((tag) => tag === tagFilter))

      return matchesSearch && matchesStatus && matchesCourse && matchesTag
    })

    const sorted = [...base]

    sorted.sort((a, b) => {
      if (sortBy === SORT_PROGRESS) {
        return b.progress - a.progress
      }

      if (sortBy === SORT_STUDENT) {
        return a.studentName.localeCompare(b.studentName)
      }

      // Default: last updated (newest first)
      return b.lastUpdated.localeCompare(a.lastUpdated)
    })

    return sorted
  }, [projects, search, statusFilter, courseFilter, tagFilter, sortBy])

  const handleStatusChange = (id, status) => {
    updateProject(id, { status })
  }

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id))
    setFeedbackText('')
    setFeedbackFrom('')
  }

  const handleFeedbackSubmit = (e, projectId) => {
    e.preventDefault()
    if (!feedbackText.trim()) return
    addFeedback(projectId, {
      from: feedbackFrom.trim() || 'Faculty',
      text: feedbackText.trim(),
    })
    setFeedbackText('')
    setFeedbackFrom('')
    setExpandedRow(null)
  }

  return (
    <div className="page">
      <section className="page-header">
        <h1>Admin workspace</h1>
        <p>
          Monitor cohort progress, review submissions, tune statuses, and capture faculty feedback
          in one place.
        </p>
      </section>

      {/* Status snapshot */}
      <section className="panel overview-panel">
        <h2 className="panel-title">Cohort snapshot</h2>
        <div className="overview-stats">
          <StatCard label="Total projects" value={stats.total} accent="a" />
          <StatCard label="In progress" value={stats.inProgress} accent="b" />
          <StatCard label="Submitted for review" value={stats.submitted} accent="c" />
          <StatCard label="Approved" value={stats.approved} accent="d" />
          <StatCard label="Drafts" value={stats.draft} accent="e" />
        </div>
      </section>

      {/* Search + filters + sorting */}
      <section className="panel" style={{ marginTop: '1.1rem' }}>
        <div className="search-filter-bar">
          <div className="search-input-wrap">
            <FaSearch className="search-input-icon" />
            <input
              className="search-input"
              placeholder="Search by project, student, or course…"
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
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="search-filter-bar" style={{ marginBottom: 0 }}>
          <div className="filter-chips">
            <select
              className="status-select-sm"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <select
              className="status-select-sm"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-chips">
            <FaSortAmountDown className="search-input-icon" />
            <select
              className="status-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value={SORT_UPDATED}>Last updated (newest)</option>
              <option value={SORT_PROGRESS}>Progress (high to low)</option>
              <option value={SORT_STUDENT}>Student name (A–Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="panel" style={{ marginTop: '1rem' }}>
        <h2 className="panel-title">Cohort overview</h2>
        <div className="admin-table-wrap">
          <div className="admin-table">
            <div className="admin-table-header">
              <span>Project</span>
              <span>Student</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>

            {filtered.length === 0 && (
              <div
                style={{ gridColumn: '1 / -1', padding: '1.5rem 0.4rem' }}
                className="muted"
              >
                No projects match your filter.
              </div>
            )}

            {filtered.map((p) => {
              const totalMilestones = Array.isArray(p.milestones) ? p.milestones.length : 0
              const completedMilestones = Array.isArray(p.milestones)
                ? p.milestones.filter((m) => m.completed).length
                : 0

              return (
                <Fragment key={p.id}>
                  <div className="admin-table-row">
                  <span className="admin-project-title">{p.title}</span>
                  <span className="muted">{p.studentName}</span>
                  <span>
                    <select
                      className="status-select-sm"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </span>
                  <span className="admin-progress-cell">
                    <div className="progress-track sm">
                      <div
                        className="progress-fill"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="progress-label">{p.progress}%</span>
                  </span>
                  <span className="muted">{p.lastUpdated}</span>
                  <span>
                    <button
                      className="ghost-btn sm-btn"
                      onClick={() => toggleRow(p.id)}
                      aria-expanded={expandedRow === p.id}
                    >
                      <FaCommentAlt />
                      {expandedRow === p.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </span>
                </div>

                  {expandedRow === p.id && (
                    <div className="admin-feedback-panel" style={{ gridColumn: '1 / -1' }}>
                      <div className="feedback-list">
                        {p.feedback.length === 0 ? (
                          <p className="muted">No feedback yet.</p>
                        ) : (
                          p.feedback.map((f) => (
                            <div key={f.id} className="feedback-item sm">
                              <div className="feedback-meta">
                                <strong>{f.from}</strong>
                                <span className="muted">{f.createdAt}</span>
                              </div>
                              <p>{f.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="search-filter-bar" style={{ marginBottom: '0.5rem' }}>
                        <div className="muted">
                          <strong>Course:</strong> {p.course}
                        </div>
                        {totalMilestones > 0 && (
                          <div className="muted">
                            <strong>Milestones:</strong> {completedMilestones}/{totalMilestones}{' '}
                            complete
                          </div>
                        )}
                        {Array.isArray(p.tags) && p.tags.length > 0 && (
                          <div className="tag-row">
                            {p.tags.map((tag) => (
                              <span key={tag} className="tag-chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <form
                        className="feedback-form"
                        onSubmit={(e) => handleFeedbackSubmit(e, p.id)}
                      >
                        <input
                          placeholder="Your name (e.g. Prof. Lee)"
                          value={feedbackFrom}
                          onChange={(e) => setFeedbackFrom(e.target.value)}
                        />
                        <textarea
                          placeholder="Add faculty feedback…"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={2}
                          required
                        />
                        <div className="form-actions">
                          <button type="submit" className="primary-btn">
                            Submit feedback
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
