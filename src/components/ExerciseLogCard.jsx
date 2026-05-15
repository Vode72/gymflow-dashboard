import Card from './Card'
import SetInputRow from './SetInputRow'

export default function ExerciseLogCard({ exercise }) {
  return (
    <Card className="exercise-card">
      <div className="exercise-card__header">
        <div>
          <span className="card__eyebrow">{exercise.muscleGroup}</span>
          <h3>{exercise.name}</h3>
        </div>
        <span className="pill">{exercise.defaultReps}</span>
      </div>
      <p>Edellinen tulos lisätään tähän, kun historiaa kertyy.</p>
      <SetInputRow placeholder="15/40 + 10/60 + 6/75" />
    </Card>
  )
}
