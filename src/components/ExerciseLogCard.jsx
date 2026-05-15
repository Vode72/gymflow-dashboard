import Card from './Card'
import SetInputRow from './SetInputRow'
import { formatDuration } from '../utils/durationUtils'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'

const generalWarmupOptions = ['Kävelymatto', 'Kuntopyörä', 'Soutulaite', 'Crosstrainer', 'Liikkuvuus', 'Muu']
const targetedWarmupOptions = [
  'Olkapäiden lämmittely',
  'Kuminauhalämmittely',
  'Lonkka / pakara',
  'Polvi',
  'Selkä / rintaranka',
  'Lämmittelysarjat',
  'Muu',
]

function buildWarmupSummary(log) {
  const parts = []
  const warmupName = log?.customWarmupName?.trim() || log?.warmupType

  if (warmupName) parts.push(warmupName)
  if (log?.durationMinutes) parts.push(formatDuration(log.durationMinutes))
  if (log?.note?.trim()) parts.push(log.note.trim())
  if (log?.completed) parts.push('Tehty')

  return parts.join(' · ')
}

export default function ExerciseLogCard({
  exercise,
  log,
  onSetsTextChange,
  onWarmupChange,
  previousResult,
}) {
  const rawTrackingType = log?.trackingType ?? getExerciseTrackingType(exercise)
  const trackingType = rawTrackingType === 'duration'
    ? 'warmupDuration'
    : rawTrackingType === 'note'
      ? 'warmupNote'
      : rawTrackingType
  const defaultWarmupType = getDefaultWarmupType(exercise)
  const title = getExerciseDisplayName(exercise)
  const isWarmup = trackingType === 'warmupDuration' || trackingType === 'warmupNote'
  const hasInput = log?.setsText?.trim()
  const hasSets = log?.sets?.length > 0
  const hasError = trackingType === 'sets' && hasInput && log?.isValid === false
  const setSummary = hasSets
    ? `${log.sets.length} sarjaa · Top ${log.topKg} kg · ${log.topReps} toistoa · 1RM arvio ${log.estimatedOneRepMax} kg`
    : ''
  const warmupSummary = buildWarmupSummary(log)

  return (
    <Card className={`exercise-card ${isWarmup ? 'exercise-card--warmup' : ''}`}>
      <div className="exercise-card__header">
        <div>
          <span className="card__eyebrow">{exercise.muscleGroup}</span>
          <h3>{title}</h3>
        </div>
        <span className="pill">{exercise.defaultReps}</span>
      </div>
      {isWarmup ? null : <p>{previousResult ?? 'Edellinen tulos lisätään tähän, kun historiaa kertyy.'}</p>}

      {trackingType === 'warmupDuration' ? (
        <div className="warmup-form">
          <label className="field">
            <span className="muted-label">Tapa</span>
            <select
              onChange={(event) => onWarmupChange({ warmupType: event.target.value })}
              value={log?.warmupType || defaultWarmupType || 'Kävelymatto'}
            >
              {generalWarmupOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {(log?.warmupType || defaultWarmupType) === 'Muu' ? (
            <label className="field">
              <span className="muted-label">Kirjoita oma lämmittely</span>
              <input
                onChange={(event) => onWarmupChange({ customWarmupName: event.target.value })}
                placeholder="Keppijumppa + liikkuvuus"
                value={log?.customWarmupName ?? ''}
              />
            </label>
          ) : null}
          <label className="field">
            <span className="muted-label">Kesto</span>
            <div className="input-with-unit">
              <input
                min="0"
                onChange={(event) => onWarmupChange({ durationMinutes: Number(event.target.value) || null })}
                type="number"
                value={log?.durationMinutes ?? ''}
              />
              <span>min</span>
            </div>
          </label>
          <button
            aria-pressed={Boolean(log?.completed)}
            className="done-toggle"
            onClick={() => onWarmupChange({ completed: !log?.completed })}
            type="button"
          >
            Tehty
          </button>
          {warmupSummary ? <span className="hint hint--success">{warmupSummary}</span> : null}
        </div>
      ) : null}

      {trackingType === 'warmupNote' ? (
        <div className="warmup-form">
          <label className="field">
            <span className="muted-label">Tyyppi</span>
            <select
              onChange={(event) => onWarmupChange({ warmupType: event.target.value })}
              value={log?.warmupType || defaultWarmupType || 'Olkapäiden lämmittely'}
            >
              {targetedWarmupOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {(log?.warmupType || defaultWarmupType) === 'Muu' ? (
            <label className="field">
              <span className="muted-label">Kirjoita oma kohdennettu lämmittely</span>
              <input
                onChange={(event) => onWarmupChange({ customWarmupName: event.target.value })}
                placeholder="Rintaranka + lapatuet"
                value={log?.customWarmupName ?? ''}
              />
            </label>
          ) : null}
          <label className="field">
            <span className="muted-label">Merkintä</span>
            <input
              onChange={(event) => onWarmupChange({ note: event.target.value })}
              placeholder="2 kierrosta"
              value={log?.note ?? ''}
            />
          </label>
          <button
            aria-pressed={Boolean(log?.completed)}
            className="done-toggle"
            onClick={() => onWarmupChange({ completed: !log?.completed })}
            type="button"
          >
            Tehty
          </button>
          {warmupSummary ? <span className="hint hint--success">{warmupSummary}</span> : null}
        </div>
      ) : null}

      {trackingType === 'sets' ? (
        <SetInputRow
          error={hasError ? 'Tarkista sarjamuoto' : ''}
          hint="Muoto: toistot/paino"
          onChange={onSetsTextChange}
          placeholder="15/40 + 10/60 + 6/75"
          summary={setSummary}
          value={log?.setsText ?? ''}
        />
      ) : null}
    </Card>
  )
}
