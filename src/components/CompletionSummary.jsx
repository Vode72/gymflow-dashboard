import Card from './Card'

export default function CompletionSummary({ workoutName = 'Valittu treeni', duration = '45 min', status = 'Luonnos' }) {
  return (
    <Card tone="flat">
      <span className="card__eyebrow">Yhteenveto</span>
      <h3>{workoutName}</h3>
      <div className="summary-grid">
        <p>Kesto: {duration}</p>
        <p>Tila: {status}</p>
        <p>Valmiiksi merkintä avaa myöhemmin vahvistuksen ennen historiaan tallennusta.</p>
      </div>
    </Card>
  )
}
