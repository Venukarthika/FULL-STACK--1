import { useState } from 'react'
import { useProjects } from '../../contexts/ProjectsContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function NewProjectForm({ onClose }) {
  const { createProject } = useProjects()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createProject({
      title: title.trim(),
      course: course.trim(),
      description: description.trim(),
      studentName: user?.name || 'You',
      status: 'Draft',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    onClose()
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Create a new project</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Project title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Smart Waste Segregation System"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Course / module</span>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="E.g. CS401 - IoT Systems"
          />
        </label>

        <label className="field field-full">
          <span className="field-label">Short description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the goal and scope of your project."
          />
        </label>

        <label className="field field-full">
          <span className="field-label">Tags (comma separated)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="E.g. AI, IoT, Web"
          />
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save draft
          </button>
        </div>
      </form>
    </section>
  )
}
