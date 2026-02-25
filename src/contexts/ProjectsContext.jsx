import { createContext, useContext, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ProjectsContext = createContext(null)

const seedProjects = [
  {
    id: 'p-1',
    title: 'AI-Powered Attendance Tracker',
    studentName: 'Alex Johnson',
    course: 'CS302 - Machine Learning',
    status: 'In Progress',
    progress: 62,
    tags: ['AI', 'Computer Vision'],
    description:
      'A camera-based attendance system that detects faces in the classroom and logs attendance securely.',
    lastUpdated: '2026-02-20',
    milestones: [
      {
        id: 'm-1',
        title: 'Collect sample dataset',
        dueDate: '2026-02-10',
        completed: true,
      },
      {
        id: 'm-2',
        title: 'Train first detection model',
        dueDate: '2026-02-18',
        completed: true,
      },
      {
        id: 'm-3',
        title: 'Deploy prototype to lab',
        dueDate: '2026-03-01',
        completed: false,
      },
    ],
    feedback: [
      {
        id: 'f-1',
        from: 'Prof. Lee',
        createdAt: '2026-02-19',
        text: 'Great start—next, focus on improving accuracy for profile faces.',
      },
    ],
  },
  {
    id: 'p-2',
    title: 'Campus Event Discovery App',
    studentName: 'Priya Singh',
    course: 'IT215 - Web Engineering',
    status: 'Submitted',
    progress: 100,
    tags: ['Web', 'Mobile'],
    description:
      'A responsive web app that helps students discover events, workshops, and club activities on campus.',
    lastUpdated: '2026-02-16',
    milestones: [
      {
        id: 'm-4',
        title: 'Design event cards',
        dueDate: '2026-01-28',
        completed: true,
      },
      {
        id: 'm-5',
        title: 'Implement search & filters',
        dueDate: '2026-02-05',
        completed: true,
      },
      {
        id: 'm-6',
        title: 'User testing round 1',
        dueDate: '2026-02-12',
        completed: true,
      },
    ],
    feedback: [
      {
        id: 'f-2',
        from: 'Dr. Martinez',
        createdAt: '2026-02-17',
        text: 'UI is polished. Consider adding RSVP analytics for organizers.',
      },
    ],
  },
]

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(seedProjects)

  const createProject = (payload) => {
    const now = new Date().toISOString().slice(0, 10)
    const project = {
      id: uuidv4(),
      status: 'Draft',
      progress: 0,
      tags: [],
      milestones: [],
      feedback: [],
      lastUpdated: now,
      ...payload,
    }
    setProjects((prev) => [project, ...prev])
  }

  const updateProject = (id, patch) => {
    const now = new Date().toISOString().slice(0, 10)
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch, lastUpdated: now } : p)),
    )
  }

  const addMilestone = (projectId, milestone) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              milestones: [
                ...p.milestones,
                { id: uuidv4(), completed: false, ...milestone },
              ],
            }
          : p,
      ),
    )
  }

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m,
              ),
            }
          : p,
      ),
    )
  }

  const addFeedback = (projectId, feedback) => {
    const now = new Date().toISOString().slice(0, 10)
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              feedback: [
                {
                  id: uuidv4(),
                  createdAt: now,
                  ...feedback,
                },
                ...p.feedback,
              ],
            }
          : p,
      ),
    )
  }

  const stats = useMemo(() => {
    const total = projects.length
    const inProgress = projects.filter((p) => p.status === 'In Progress').length
    const submitted = projects.filter((p) => p.status === 'Submitted').length
    const approved = projects.filter((p) => p.status === 'Approved').length
    const draft = projects.filter((p) => p.status === 'Draft').length

    return { total, inProgress, submitted, approved, draft }
  }, [projects])

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        stats,
        createProject,
        updateProject,
        addMilestone,
        toggleMilestone,
        addFeedback,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return ctx
}

