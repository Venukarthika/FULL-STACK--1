export default function StatCard({ label, value, accent }) {
  return (
    <article className={`stat-card stat-accent-${accent}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </article>
  )
}
