import Card from './Card'

export default function CompletionSummary({
  duration = 0,
  exerciseCount = 0,
  status = 'Luonnos',
  totalSets = 0,
  topHighlight = '',
  workoutName = 'Valittu treeni',
}) {
  return (
    <Card tone="flat">
      <span className="card__eyebrow">Yhteenveto</span>
      <h3>{status === 'Valmis' ? 'Treeni valmis' : workoutName}</h3>
      <div className="summary-grid">
        <p>{workoutName} · {duration || 0} min</p>
        <p>{exerciseCount} liikettä · {totalSets} sarjaa</p>
        <p>Tila: {status}</p>
        {topHighlight ? <p>{topHighlight}</p> : null}
      </div>
    </Card>
  )
}
