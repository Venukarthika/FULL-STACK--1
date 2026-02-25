import { useState } from 'react'
import {
  FaTimes,
  FaCheckCircle,
  FaRegCircle,
  FaPlus,
  FaCommentAlt,
} from 'react-icons/fa'
import { useProjects } from '../../contexts/ProjectsContext.jsx'
import { STATUS_OPTIONS } from '../../constants/projectStatus.js'

export default function ProjectDetailModal({ project, onClose }) {
  const { updateProject, toggleMilestone, addFeedback, addMilestone } =
    useProjects()

  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackFrom, setFeedbackFrom] = useState('')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDue, setMilestoneDue] = useState('')
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  const statusClass = `status-${project.status.toLowerCase().replace(/\s+/g, '-')}`

  const handleStatus = (e) => {
    updateProject(project.id, { status: e.target.value })
  }

  const handleProgress = (e) => {
    updateProject(project.id, { progress: Number(e.target.value) })
  }

  const handleFeedback = (e) => {
    e.preventDefault()
    if (!feedbackText.trim()) return
    addFeedback(project.id, {
      from: feedbackFrom.trim() || 'Anonymous',
      text: feedbackText.trim(),
    })
    setFeedbackText('')
    setFeedbackFrom('')
    setShowFeedbackForm(false)
  }

  const handleAddMilestone = (e) => {
    e.preventDefault()
    if (!milestoneTitle.trim()) return
    addMilestone(project.id, {
      title: milestoneTitle.trim(),
      dueDate: milestoneDue,
    })
    setMilestoneTitle('')
    setMilestoneDue('')
    setShowMilestoneForm(false)
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-modal-header">
          <div>
            <h2 className="detail-modal-title">{project.title}</h2>
            <p className="muted">
              {project.course} • {project.studentName}
            </p>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ flexShrink: 0 }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="detail-modal-body">
          {/* ── Left column ── */}
          <div className="detail-left">
            {/* Description */}
            <section className="detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="project-description">
                {project.description || 'No description provided.'}
              </p>
            </section>

            {/* Tags */}
            {project.tags?.length > 0 && (
              <section className="detail-section">
                <h3 className="detail-section-title">Tags</h3>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Status + Progress */}
            <section className="detail-section">
              <h3 className="detail-section-title">Status & Progress</h3>
              <div className="detail-row">
                <select
                  className="status-select"
                  value={project.status}
                  onChange={handleStatus}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className={`status-pill ${statusClass}`}>
                  {project.status}
                </span>
              </div>
              <div className="detail-progress-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress}
                  onChange={handleProgress}
                  className="progress-slider"
                />
                <span className="progress-label">{project.progress}%</span>
              </div>
            </section>

            {/* Feedback */}
            <section className="detail-section">
              <div className="detail-section-header">
                <h3 className="detail-section-title">Feedback</h3>
                <button
                  className="ghost-btn sm-btn"
                  onClick={() => setShowFeedbackForm((v) => !v)}
                >
                  <FaCommentAlt />
                  {showFeedbackForm ? 'Cancel' : 'Add'}
                </button>
              </div>

              {showFeedbackForm && (
                <form className="feedback-form" onSubmit={handleFeedback}>
                  <input
                    placeholder="Your name (optional)"
                    value={feedbackFrom}
                    onChange={(e) => setFeedbackFrom(e.target.value)}
                  />
                  <textarea
                    placeholder="Write feedback…"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={2}
                    required
                  />
                  <div className="form-actions">
                    <button type="submit" className="primary-btn">
                      Submit
                    </button>
                  </div>
                </form>
              )}

              <div className="feedback-list">
                {project.feedback.length === 0 && (
                  <p className="muted">No feedback yet.</p>
                )}
                {project.feedback.map((f) => (
                  <div key={f.id} className="feedback-item">
                    <div className="feedback-meta">
                      <strong>{f.from}</strong>
                      <span className="muted">{f.createdAt}</span>
                    </div>
                    <p>{f.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right column — Milestones ── */}
          <div className="detail-right">
            <section className="detail-section">
              <div className="detail-section-header">
                <h3 className="detail-section-title">
                  Milestones ({project.milestones.filter((m) => m.completed).length}/
                  {project.milestones.length})
                </h3>
                <button
                  className="ghost-btn sm-btn"
                  onClick={() => setShowMilestoneForm((v) => !v)}
                >
                  <FaPlus />
                  Add
                </button>
              </div>

              {showMilestoneForm && (
                <form className="milestone-form" onSubmit={handleAddMilestone}>
                  <input
                    placeholder="Milestone title"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    value={milestoneDue}
                    onChange={(e) => setMilestoneDue(e.target.value)}
                  />
                  <button type="submit" className="primary-btn sm-btn">
                    Save
                  </button>
                </form>
              )}

              <div className="milestone-list">
                {project.milestones.length === 0 && (
                  <p className="muted">No milestones yet. Add one above.</p>
                )}
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`milestone-item ${m.completed ? 'milestone-done' : ''}`}
                    onClick={() => toggleMilestone(project.id, m.id)}
                    role="checkbox"
                    aria-checked={m.completed}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && toggleMilestone(project.id, m.id)
                    }
                  >
                    {m.completed ? (
                      <FaCheckCircle className="milestone-icon done" />
                    ) : (
                      <FaRegCircle className="milestone-icon" />
                    )}
                    <div className="milestone-info">
                      <span className="milestone-title">{m.title}</span>
                      {m.dueDate && (
                        <span className="muted">Due {m.dueDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
