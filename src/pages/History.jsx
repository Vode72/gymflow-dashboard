import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import { formatFinnishDate } from '../utils/dateUtils'

export default function History({ sessions }) {
  const completed = [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (!completed.length) {
    return <EmptyState title="Historia on tyhjä">Valmiiksi merkityt treenit näkyvät täällä kortteina.</EmptyState>
  }

  return (
    <div className="page-stack">
      <Card>
        <span className="card__eyebrow">Suodattimet</span>
        <p>Treenipäivä- ja liikesuodattimet lisätään tähän ilman taulukkomaisuutta.</p>
      </Card>
      {completed.map((session) => (
        <Card key={session.id}>
          <span className="card__eyebrow">{formatFinnishDate(session.date)} · {session.startTime}</span>
          <h3>{session.workoutName}</h3>
          <p>{session.durationMinutes} min · Tuntemus: {session.feeling}</p>
          <div className="tag-list">
            {session.exercises.map((exercise) => (
              <span className="tag" key={exercise.exerciseId}>{exercise.name}</span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
