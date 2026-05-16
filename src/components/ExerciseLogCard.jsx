import Card from './Card'
import SetInputRow from './SetInputRow'
import { formatDuration } from '../utils/durationUtils'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'

const generalWarmupOptions = ['Kävelymatto', 'Kuntopyörä', 'Soutulaite', 'Crosstrainer', 'Liikkuvuus', 'Muu']
const targetedWarmupOptions = [
  'Olkapäät',
  'Lonkka',
  'Polvi',
  'Muu',
]
const qualityOptions = [1, 2, 3, 4, 5]

function normalizeTargetedWarmupType(value) {
  if (!value) return 'Olkapäät'
  if (value.includes('Olkap')) return 'Olkapäät'
  if (value.includes('Kuminauha')) return 'Olkapäät'
  if (value.includes('Lonkka')) return 'Lonkka'
  if (value.includes('Polvi')) return 'Polvi'
  if (targetedWarmupOptions.includes(value)) return value
  return 'Muu'
}

function normalizeSet(set = {}) {
  return {
    reps: Number(set.reps) || 10,
    weight: Number(set.weight) || 20,
    quality: Number(set.quality) || 3,
  }
}

function buildWarmupSummary(log) {
  const parts = []
  const customName = log?.customWarmupName?.trim()
  const rawWarmupName = log?.warmupType === 'Muu' && customName ? customName : customName || log?.warmupType
  const warmupName = log?.trackingType === 'warmupNote' && !(log?.warmupType === 'Muu' && customName)
    ? normalizeTargetedWarmupType(rawWarmupName)
    : rawWarmupName

  if (warmupName) parts.push(warmupName)
  if (log?.durationMinutes) parts.push(formatDuration(log.durationMinutes))
  if (log?.note?.trim()) parts.push(log.note.trim())
  if (log?.completed) parts.push('Tehty')

  return parts.join(' · ')
}

export default function ExerciseLogCard({
  embedded = false,
  exercise,
  log,
  onSetsTextChange,
  onStructuredSetsChange,
  onRemoveWarmup,
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
  const structuredSets = log?.sets?.map(normalizeSet) ?? []
  const targetedWarmupDuration = Math.min(15, Math.max(0, Number(log?.durationMinutes ?? 5) || 0))
  const targetedWarmupType = normalizeTargetedWarmupType(log?.warmupType || defaultWarmupType)

  function updateStructuredSet(index, updates) {
    if (!onStructuredSetsChange) return

    const nextSets = structuredSets.map((set, setIndex) => (
      setIndex === index ? normalizeSet({ ...set, ...updates }) : set
    ))
    onStructuredSetsChange(nextSets)
  }

  function addStructuredSet() {
    if (!onStructuredSetsChange) return

    const previousSet = structuredSets.at(-1)
    onStructuredSetsChange([...structuredSets, normalizeSet(previousSet)])
  }

  function removeStructuredSet(index) {
    if (!onStructuredSetsChange) return

    onStructuredSetsChange(structuredSets.filter((_, setIndex) => setIndex !== index))
  }

  function adjustTargetedWarmupDuration(change) {
    if (!onWarmupChange) return

    onWarmupChange({
      durationMinutes: Math.min(15, Math.max(0, targetedWarmupDuration + change)),
    })
  }

  const Wrapper = embedded ? 'div' : Card

  return (
    <Wrapper className={`exercise-card ${embedded ? 'exercise-card--embedded' : ''} ${isWarmup ? 'exercise-card--warmup' : ''}`}>
      <div className="exercise-card__header">
        <div>
          <span className="card__eyebrow">{exercise.muscleGroup}</span>
          <h3>{title}</h3>
        </div>
        <span className="pill">{exercise.defaultReps}</span>
      </div>
      {isWarmup || embedded ? null : <p>{previousResult ?? 'Edellinen tulos lisätään tähän, kun historiaa kertyy.'}</p>}
      {isWarmup && previousResult && previousResult !== 'Ei aiempaa tulosta' ? (
        <p className="exercise-card__previous">{previousResult}</p>
      ) : null}

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
            {log?.completed ? '✓ Tehty' : 'Tehty'}
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
              value={targetedWarmupType}
            >
              {targetedWarmupOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {targetedWarmupType === 'Muu' ? (
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
          <div className="warmup-action-row">
            <label className="field">
              <span className="muted-label">Kesto</span>
              <div className="warmup-duration-stepper">
                <button onClick={() => adjustTargetedWarmupDuration(-1)} type="button">-</button>
                <strong>{targetedWarmupDuration} min</strong>
                <button onClick={() => adjustTargetedWarmupDuration(1)} type="button">+</button>
              </div>
            </label>
            <button
              aria-pressed={Boolean(log?.completed)}
              className="done-toggle"
              onClick={() => onWarmupChange({ completed: !log?.completed })}
              type="button"
            >
              {log?.completed ? '✓ Tehty' : 'Tehty'}
            </button>
            {onRemoveWarmup ? (
              <button className="btn btn--secondary warmup-remove-action" onClick={onRemoveWarmup} type="button">
                Poista
              </button>
            ) : null}
          </div>
          {warmupSummary ? <span className="hint hint--success">{warmupSummary}</span> : null}
        </div>
      ) : null}

      {trackingType === 'sets' ? (
        <>
          <SetInputRow
            error={hasError ? 'Tarkista sarjamuoto' : ''}
            hint="Muoto: toistot/paino"
            onChange={onSetsTextChange}
            placeholder="15/40 + 10/60 + 6/75"
            summary={setSummary}
            value={log?.setsText ?? ''}
          />
          <div className="parsed-set-chips">
            <span className="muted-label">Kirjatut sarjat</span>
            {structuredSets.length ? (
              <div className="parsed-set-chips__list">
                {structuredSets.map((set, index) => (
                  <span className="parsed-set-chip" key={`${index}-${set.reps}-${set.weight}`}>
                    {index + 1} · {set.reps} x {set.weight} kg
                  </span>
                ))}
              </div>
            ) : (
              <span className="hint">Ei kirjattuja sarjoja vielä.</span>
            )}
          </div>
          <div className="set-builder">
            <div className="set-builder__header">
              <span className="muted-label">Sarjakohtainen kirjaus</span>
              <button className="btn btn--accent" onClick={addStructuredSet} type="button">Lisää sarja</button>
            </div>
            {structuredSets.length ? (
              <div className="set-builder__list">
                {structuredSets.map((set, index) => (
                <div className="set-builder__row" key={`${index}-${set.reps}-${set.weight}`}>
                  <span className="set-builder__index">{index + 1}</span>
                  <div className="stepper-control">
                    <span className="muted-label">kg</span>
                    <div>
                      <button onClick={() => updateStructuredSet(index, { weight: Math.max(0, set.weight - 2.5) })} type="button">-</button>
                      <strong>{set.weight}</strong>
                      <button onClick={() => updateStructuredSet(index, { weight: set.weight + 2.5 })} type="button">+</button>
                    </div>
                  </div>
                  <div className="stepper-control">
                    <span className="muted-label">toistot</span>
                    <div>
                      <button onClick={() => updateStructuredSet(index, { reps: Math.max(0, set.reps - 1) })} type="button">-</button>
                      <strong>{set.reps}</strong>
                      <button onClick={() => updateStructuredSet(index, { reps: set.reps + 1 })} type="button">+</button>
                    </div>
                  </div>
                  <div className="quality-stars" aria-label="Laatu">
                    {qualityOptions.map((quality) => (
                      <button
                        aria-label={`Laatu ${quality}`}
                        aria-pressed={quality <= set.quality}
                        key={quality}
                        onClick={() => updateStructuredSet(index, { quality })}
                        type="button"
                      >
                        {quality <= set.quality ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                  <button
                    aria-label="Poista sarja"
                    className="set-builder__remove"
                    onClick={() => removeStructuredSet(index)}
                    type="button"
                  >
                    -
                  </button>
                </div>
                ))}
              </div>
            ) : (
              <p className="hint">Lisää ensimmäinen sarja tai kirjaa nopeasti yllä olevaan kenttään.</p>
            )}
          </div>
        </>
      ) : null}
    </Wrapper>
  )
}
