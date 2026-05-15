export default function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span className="muted-label">{label}</span>
      <strong>{value}</strong>
      {detail ? <p>{detail}</p> : null}
    </div>
  )
}
