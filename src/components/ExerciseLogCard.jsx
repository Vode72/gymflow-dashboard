import Card from './Card'
import SetInputRow from './SetInputRow'

export default function ExerciseLogCard({ exercise, log, onSetsTextChange, previousResult }) {
  const hasInput = log?.setsText?.trim()
  const hasSets = log?.sets?.length > 0
  const hasError = hasInput && log?.isValid === false
  const summary = hasSets
    ? `${log.sets.length} sarjaa · Top ${log.topKg} kg · ${log.topReps} toistoa · 1RM arvio ${log.estimatedOneRepMax} kg`
    : ''

  return (
    <Card className="exercise-card">
      <div className="exercise-card__header">
        <div>
          <span className="card__eyebrow">{exercise.muscleGroup}</span>
          <h3>{exercise.name}</h3>
        </div>
        <span className="pill">{exercise.defaultReps}</span>
      </div>
      <p>{previousResult ?? 'Edellinen tulos lisätään tähän, kun historiaa kertyy.'}</p>
      <SetInputRow
        error={hasError ? 'Tarkista sarjamuoto' : ''}
        hint="Muoto: toistot/paino"
        onChange={onSetsTextChange}
        placeholder="15/40 + 10/60 + 6/75"
        summary={summary}
        value={log?.setsText ?? ''}
      />
    </Card>
  )
}
