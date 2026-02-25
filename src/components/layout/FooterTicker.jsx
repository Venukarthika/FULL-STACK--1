import { useProjects } from '../../contexts/ProjectsContext.jsx'

export default function FooterTicker() {
  const { projects } = useProjects()
  const upcoming = projects
    .flatMap((p) => p.milestones)
    .filter((m) => !m.completed)
    .slice(0, 6)

  if (upcoming.length === 0) return null

  return (
    <div className="footer-ticker">
      <span className="ticker-label">Upcoming</span>
      <div className="ticker-strip">
        {upcoming.map((m) => (
          <span key={m.id} className="ticker-item">
            {m.title} • due {m.dueDate}
          </span>
        ))}
      </div>
    </div>
  )
}
