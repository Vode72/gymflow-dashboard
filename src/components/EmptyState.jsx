import Card from './Card'

export default function EmptyState({ title, children, action }) {
  return (
    <Card className="empty-state">
      <h2>{title}</h2>
      <p>{children}</p>
      {action ? <div className="button-row">{action}</div> : null}
    </Card>
  )
}
