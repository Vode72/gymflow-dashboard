import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import CompletionSummary from '../components/CompletionSummary'
import ExerciseLogCard from '../components/ExerciseLogCard'
import WorkoutDayPicker from '../components/WorkoutDayPicker'
import { formatDuration } from '../utils/durationUtils'
import { getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'
import { isValidSetsText, parseSetsText } from '../utils/parseSets'
import { calculateExerciseLogStats } from '../utils/progressLogic'
import {
  createTargetedWarmupLog,
  getExerciseLogTypeLabel,
  getLastExerciseResult,
  getLastTargetedWarmupResult,
  hasLoggedExercise,
  isGeneralWarmup,
  isTargetedWarmup,
  targetedWarmupExercise,
} from '../utils/workoutLogUtils'
import { getActiveWorkoutDays, getNextWorkoutDay } from '../utils/workoutLogic'

const feelingOptions = ['Normaali', 'Hyvä', 'Vahva', 'Väsynyt']

function getDraftSummary(draft) {
  const loggedExercises = draft?.exercises.filter(hasLoggedExercise) ?? []
  const totalSets = loggedExercises.reduce((sum, exercise) => sum + (exercise.sets?.length ?? 0), 0)
  const topExercise = loggedExercises
    .filter((exercise) => exercise.estimatedOneRepMax)
    .sort((a, b) => b.estimatedOneRepMax - a.estimatedOneRepMax)[0]

  return {
    exerciseCount: loggedExercises.length,
    totalSets,
    topHighlight: topExercise
      ? `Paras 1RM arvio: ${topExercise.exerciseName} ${topExercise.estimatedOneRepMax} kg`
      : '',
  }
}

function formatSetsText(sets) {
  return sets.map((set) => `${set.reps}/${set.weight}`).join(' + ')
}

function getExerciseInitials(exercise) {
  return getExerciseDisplayName(exercise)
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function WorkoutExerciseListItem({ exercise, log, onSelect, sessions }) {
  const trackingType = log?.trackingType ?? getExerciseTrackingType(exercise)
  const typeLabel = getExerciseLogTypeLabel({ trackingType })
  const status = hasLoggedExercise(log) ? 'Kirjattu' : 'Ei kirjattu'
  const lastResult = getLastExerciseResult(sessions, exercise.id)

  return (
    <button className={`workout-exercise-row ${status === 'Kirjattu' ? 'is-logged' : ''}`} onClick={onSelect} type="button">
      <span className="workout-exercise-row__badge" aria-hidden="true">
        {getExerciseInitials(exercise)}
      </span>
      <div className="workout-exercise-row__content">
        <span className="workout-exercise-row__meta">{typeLabel}</span>
        <h3>{getExerciseDisplayName(exercise)}</h3>
        <span className="workout-exercise-row__last">{lastResult}</span>
      </div>
      <span className={`workout-exercise-row__status ${status === 'Kirjattu' ? 'is-logged' : ''}`}>
        {status}
      </span>
      <span className="workout-exercise-row__chevron" aria-hidden="true">›</span>
    </button>
  )
}

export default function Workout({
  activeDraft,
  completeWorkout,
  exercises,
  onSelectWorkoutDay,
  program,
  saveDraft,
  selectedWorkoutDayId,
  sessions,
  startDraft,
  updateDraft,
}) {
  const activeDays = getActiveWorkoutDays(program)
  const suggestedDay = getNextWorkoutDay(program, sessions)
  const [selectedDayId, setSelectedDayId] = useState(suggestedDay?.id ?? activeDays[0]?.id)
  const [selectedExerciseState, setSelectedExerciseState] = useState({ dayId: null, exerciseId: null })
  const [showConfirm, setShowConfirm] = useState(false)
  const [completedSummary, setCompletedSummary] = useState(null)
  const [customExerciseNotice, setCustomExerciseNotice] = useState('')
  const [targetedWarmupPopupOpen, setTargetedWarmupPopupOpen] = useState(false)
  const [targetedWarmupPopupMode, setTargetedWarmupPopupMode] = useState('first')
  const effectiveSelectedDayId = selectedWorkoutDayId ?? selectedDayId
  const selectedDay = activeDays.find((day) => day.id === effectiveSelectedDayId) ?? activeDays[0]
  const currentDraft = activeDraft?.workoutDayId === selectedDay?.id ? activeDraft : null

  const selectedExercises = useMemo(() => {
    const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]))
    return selectedDay?.exerciseIds.map((id) => bank.get(id)).filter(Boolean) ?? []
  }, [exercises, selectedDay])

  const visibleExercises = useMemo(() => {
    const generalWarmups = selectedExercises.filter((exercise) => (
      isGeneralWarmup({ trackingType: getExerciseTrackingType(exercise) })
    ))
    const programTargetedWarmup = selectedExercises.find((exercise) => (
      isTargetedWarmup({ trackingType: getExerciseTrackingType(exercise) })
    ))
    const strengthExercises = selectedExercises.filter((exercise) => getExerciseTrackingType(exercise) === 'sets')

    return {
      generalWarmups,
      targetedWarmup: programTargetedWarmup ?? targetedWarmupExercise,
      strengthExercises,
    }
  }, [selectedExercises])

  useEffect(() => {
    if (!completedSummary && selectedDay && selectedExercises.length) {
      startDraft(selectedDay, selectedExercises)
    }
  }, [completedSummary, selectedDay, selectedExercises, startDraft])

  const targetedWarmupLogs = currentDraft?.exercises
    .filter((exercise) => isTargetedWarmup(exercise) && exercise.enabled !== false && exercise.enabledByUser)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) ?? []
  const targetedWarmupEnabled = targetedWarmupLogs.length > 0
  const exerciseList = [
    ...visibleExercises.generalWarmups,
    ...visibleExercises.strengthExercises,
  ]
  const selectedExerciseId = selectedExerciseState.dayId === selectedDay?.id ? selectedExerciseState.exerciseId : null
  const selectedExercise = exerciseList.find((exercise) => exercise.id === selectedExerciseId)
  const selectedExerciseLog = currentDraft?.exercises.find((item) => item.exerciseId === selectedExercise?.id)
  const draftSummary = getDraftSummary(currentDraft)
  const workoutDurationMinutes = Number(currentDraft?.durationMinutes) || 0

  function selectWorkoutDay(dayId) {
    setSelectedDayId(dayId)
    onSelectWorkoutDay(dayId)
    setSelectedExerciseState({ dayId: null, exerciseId: null })
    setCompletedSummary(null)
    setShowConfirm(false)
    setCustomExerciseNotice('')
    setTargetedWarmupPopupOpen(false)
    setTargetedWarmupPopupMode('first')
  }

  function updateExerciseSets(exerciseId, setsText) {
    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.exerciseId !== exerciseId) return exercise

        const sets = parseSetsText(setsText)
        return {
          ...exercise,
          trackingType: 'sets',
          isValid: isValidSetsText(setsText),
          setsText,
          sets,
          durationMinutes: null,
          completed: false,
          customWarmupName: '',
          note: '',
          ...calculateExerciseLogStats(sets),
        }
      }),
    }))
  }

  function updateExerciseStructuredSets(exerciseId, nextSets) {
    const sets = nextSets.map((set) => ({
      reps: Number(set.reps) || 0,
      weight: Number(set.weight) || 0,
      quality: Number(set.quality) || 3,
    }))

    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.exerciseId !== exerciseId) return exercise

        return {
          ...exercise,
          trackingType: 'sets',
          isValid: true,
          setsText: formatSetsText(sets),
          sets,
          durationMinutes: null,
          completed: false,
          customWarmupName: '',
          note: '',
          ...calculateExerciseLogStats(sets),
        }
      }),
    }))
  }

  function updateWarmupLog(exerciseId, updates) {
    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.exerciseId !== exerciseId) return exercise

        return {
          ...exercise,
          ...updates,
          sets: [],
          topKg: null,
          topReps: null,
          estimatedOneRepMax: null,
        }
      }),
    }))
  }

  function addTargetedWarmup({ useExisting = false } = {}) {
    updateDraft((current) => {
      const targetedWarmups = current.exercises.filter(isTargetedWarmup)
      const nextOrder = targetedWarmups.length + 1
      const reusableTargeted = useExisting
        ? targetedWarmups.find((exercise) => !exercise.enabledByUser || exercise.enabled === false)
        : null

      if (reusableTargeted) {
        return {
          ...current,
          exercises: current.exercises.map((exercise) => (
            exercise.exerciseId === reusableTargeted.exerciseId
              ? {
                  ...exercise,
                  order: exercise.order ?? nextOrder,
                  enabled: true,
                  enabledByUser: true,
                  durationMinutes: exercise.durationMinutes ?? 5,
                  warmupType: exercise.warmupType || targetedWarmupExercise.defaultWarmupType,
                  note: exercise.note ?? '',
                }
              : exercise
          )),
        }
      }

      return {
        ...current,
        exercises: [...current.exercises, createTargetedWarmupLog({ order: nextOrder })],
      }
    })
  }

  function requestTargetedWarmup() {
    // Popup confirmation: first card uses the original confirmation copy.
    setTargetedWarmupPopupMode('first')
    setTargetedWarmupPopupOpen(true)
  }

  function requestAdditionalTargetedWarmup() {
    // Popup confirmation: additional warmups require confirmation before mutating the draft.
    setTargetedWarmupPopupMode('additional')
    setTargetedWarmupPopupOpen(true)
  }

  function confirmTargetedWarmup() {
    // "Kyllä" creates or re-enables exactly one targeted warmup card.
    addTargetedWarmup({ useExisting: targetedWarmupPopupMode === 'first' })
    setTargetedWarmupPopupOpen(false)
    setTargetedWarmupPopupMode('first')
  }

  function cancelTargetedWarmupPopup() {
    // "Peruuta" only closes the dialog; existing inline cards and draft data stay unchanged.
    setTargetedWarmupPopupOpen(false)
    setTargetedWarmupPopupMode('first')
  }

  function disableTargetedWarmup(exerciseId) {
    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => (
        exercise.exerciseId === exerciseId
          ? { ...exercise, enabled: false, enabledByUser: false }
          : exercise
      )),
    }))
    setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: null })
    setTargetedWarmupPopupOpen(false)
  }

  function updateDraftField(field, value) {
    updateDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function adjustWorkoutDuration(change) {
    const current = Number(currentDraft?.durationMinutes) || 0
    const nextDuration = change > 0
      ? Math.ceil((current + 1) / 5) * 5
      : Math.max(0, Math.floor((current - 1) / 5) * 5)

    updateDraftField('durationMinutes', nextDuration)
  }

  function confirmCompletion() {
    const completed = completeWorkout(currentDraft)
    setShowConfirm(false)
    setCompletedSummary(completed)
  }

  if (!selectedDay) {
    return (
      <div className="page-stack">
        <Card tone="accent">
          <span className="card__eyebrow">Valittu treeni</span>
          <h2>Ei aktiivisia treenipäiviä</h2>
          <p>Lisää ohjelmaan treenipäivä myöhemmin Ohjelma-näkymässä.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <Card tone="accent">
        <span className="card__eyebrow">Valittu treeni</span>
        <h2>{selectedDay.name}</h2>
        <p>{selectedDay.description}</p>
      </Card>

      <WorkoutDayPicker days={activeDays} selectedId={selectedDay.id} onSelect={selectWorkoutDay} />

      {!selectedExercise ? (
        <>
          <Card className="workout-day-summary">
            <span className="card__eyebrow">Liikkeet</span>
            <h3>{selectedDay.name} — {selectedDay.description}</h3>
            <p>Valitse liike ja kirjaa se rauhassa. Luonnos tallentuu automaattisesti.</p>
          </Card>

          <div className="workout-exercise-list">
            <Card className="workout-section-card workout-section-card--warmup">
              <div className="workout-section-title">
                <span className="card__eyebrow">Lämmittely</span>
                <h3>Aloitus</h3>
              </div>
              <div className="workout-section-rows">
            {visibleExercises.generalWarmups.map((exercise) => (
              <WorkoutExerciseListItem
                exercise={exercise}
                key={exercise.id}
                log={currentDraft?.exercises.find((item) => item.exerciseId === exercise.id)}
                onSelect={() => setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: exercise.id })}
                sessions={sessions}
              />
            ))}

            {!targetedWarmupEnabled ? (
              <button className="workout-targeted-action" onClick={requestTargetedWarmup} type="button">
                <input aria-hidden="true" readOnly tabIndex="-1" type="checkbox" />
                <span>
                  <strong>Lisää kohdennettu lämmittely</strong>
                  <small>Esim. olkapäät, lonkka, polvi tai liikkuvuus.</small>
                </span>
              </button>
            ) : (
              <div className="targeted-warmup-list">
                {targetedWarmupLogs.map((warmupLog, index) => (
                  <div className="targeted-warmup-inline" key={warmupLog.exerciseId}>
                    <div className="targeted-warmup-active-row">
                      <label className="targeted-warmup-active-row__toggle">
                        <input checked onChange={() => disableTargetedWarmup(warmupLog.exerciseId)} type="checkbox" />
                        <span>Kohdennettu lämmittely {index + 1}</span>
                      </label>
                    </div>
                    <ExerciseLogCard
                      embedded
                      exercise={visibleExercises.targetedWarmup}
                      log={warmupLog}
                      onRemoveWarmup={() => disableTargetedWarmup(warmupLog.exerciseId)}
                      onWarmupChange={(updates) => updateWarmupLog(warmupLog.exerciseId, updates)}
                      previousResult={getLastTargetedWarmupResult(sessions, warmupLog)}
                    />
                  </div>
                ))}
                <button className="workout-targeted-action workout-targeted-action--add" onClick={requestAdditionalTargetedWarmup} type="button">
                  <input aria-hidden="true" readOnly tabIndex="-1" type="checkbox" />
                  <span>
                    <strong>+ Lisää kohdennettu lämmittely</strong>
                    <small>Lisää toinen kohdennettu warmup tähän treeniin.</small>
                  </span>
                </button>
              </div>
            )}
              </div>
            </Card>

            {targetedWarmupPopupOpen ? (
              <div className="modal-backdrop" role="presentation">
                <div aria-modal="true" className="modal-card workout-popup" role="dialog">
                  <span className="card__eyebrow">Kohdennettu lämmittely</span>
                  <h3>
                    {targetedWarmupPopupMode === 'additional'
                      ? 'Haluatko lisätä toisen kohdennetun lämmittelyn?'
                      : 'Haluatko lisätä kohdennetun lämmittelyn?'}
                  </h3>
                  <p>
                    {targetedWarmupPopupMode === 'additional'
                      ? 'Uusi kohdennettu lämmittely lisätään omaksi inline-kortikseen.'
                      : 'Voit lisätä sen inline-riviksi heti tähän treeniin.'}
                  </p>
                  <div className="button-row">
                    <button className="btn btn--secondary" onClick={cancelTargetedWarmupPopup} type="button">Peruuta</button>
                    <button className="btn btn--accent" onClick={confirmTargetedWarmup} type="button">
                      {targetedWarmupPopupMode === 'additional' ? 'Kyllä, lisää' : 'Kyllä, lisään'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <Card className="workout-section-card workout-section-card--main">
              <div className="workout-section-title">
                <span className="card__eyebrow">Päivän liikkeet</span>
                <h3>{visibleExercises.strengthExercises.length} voimaliikettä</h3>
              </div>
              <div className="workout-section-rows">
            {visibleExercises.strengthExercises.map((exercise) => (
              <WorkoutExerciseListItem
                exercise={exercise}
                key={exercise.id}
                log={currentDraft?.exercises.find((item) => item.exerciseId === exercise.id)}
                onSelect={() => setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: exercise.id })}
                sessions={sessions}
              />
            ))}
              </div>
            </Card>

            <Card className="workout-section-card workout-section-card--custom">
              <div className="workout-section-title">
                <span className="card__eyebrow">Mukautettu liike</span>
                <h3>Lisäliike</h3>
              </div>
              <p>Lisää tähän treeniin ylimääräinen liike myöhemmin.</p>
              <button
                className="btn btn--accent"
                onClick={() => setCustomExerciseNotice('Mukautettujen liikkeiden lisäys toteutetaan seuraavassa vaiheessa.')}
                type="button"
              >
                Mukautettu liike
              </button>
              {customExerciseNotice ? <p className="inline-notice">{customExerciseNotice}</p> : null}
            </Card>
          </div>
        </>
      ) : (
        <Card className="workout-detail-card">
          <div className="workout-detail-card__header">
            <button
              className="btn btn--ghost exercise-detail-back"
              onClick={() => setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: null })}
              type="button"
            >
              Takaisin liikelistaan
            </button>
            <div>
              <span className="card__eyebrow">{selectedDay.name}</span>
              <h3>{selectedDay.description}</h3>
              <p>Luonnos tallennettu · {currentDraft?.updatedAt ? new Date(currentDraft.updatedAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) : 'Ei muutoksia'}</p>
            </div>
            <div className="workout-detail-card__meta-row">
              <label className="field workout-detail-card__duration">
                <span className="muted-label">Treenin kesto</span>
                <div className="duration-stepper">
                  <button onClick={() => adjustWorkoutDuration(-5)} type="button">-</button>
                  <strong>{formatDuration(workoutDurationMinutes)}</strong>
                  <button onClick={() => adjustWorkoutDuration(5)} type="button">+</button>
                </div>
              </label>
              <label className="field workout-detail-card__feeling">
                <span className="muted-label">Tuntemus</span>
                <select
                  onChange={(event) => updateDraftField('feeling', event.target.value)}
                  value={currentDraft?.feeling ?? 'Normaali'}
                >
                  {feelingOptions.map((feeling) => (
                    <option key={feeling} value={feeling}>{feeling}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="workout-detail-card__body">
            <p className="exercise-detail-last">{getLastExerciseResult(sessions, selectedExercise.id)}</p>
          <ExerciseLogCard
            embedded
            exercise={selectedExercise}
            log={selectedExerciseLog}
            onSetsTextChange={(setsText) => updateExerciseSets(selectedExercise.id, setsText)}
            onStructuredSetsChange={(sets) => updateExerciseStructuredSets(selectedExercise.id, sets)}
            onWarmupChange={(updates) => updateWarmupLog(
              selectedExercise.id,
              updates,
            )}
            previousResult={getLastExerciseResult(sessions, selectedExercise.id)}
          />
          </div>

          <div className="workout-detail-card__footer">
            <button
              className="btn btn--success"
              onClick={() => setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: null })}
              type="button"
            >
              Liike valmis
            </button>
          </div>
        </Card>
      )}

      {!selectedExercise ? (
      <Card>
        <span className="card__eyebrow">Treenin tiedot</span>
        <h3>{currentDraft?.workoutName ?? selectedDay.name}</h3>
        <p>Luonnos tallennettu · {currentDraft?.updatedAt ? new Date(currentDraft.updatedAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) : 'Ei muutoksia'}</p>
        <div className="workout-meta-grid">
          <label className="field">
            <span className="muted-label">Treenin kesto</span>
            <div className="duration-stepper">
              <button onClick={() => adjustWorkoutDuration(-5)} type="button">-</button>
              <strong>{formatDuration(workoutDurationMinutes)}</strong>
              <button onClick={() => adjustWorkoutDuration(5)} type="button">+</button>
            </div>
            <span className="hint">Säädä 5 minuutin askelilla. Oletus 0 min.</span>
          </label>
          <label className="field">
            <span className="muted-label">Tuntemus</span>
            <select
              onChange={(event) => updateDraftField('feeling', event.target.value)}
              value={currentDraft?.feeling ?? 'Normaali'}
            >
              {feelingOptions.map((feeling) => (
                <option key={feeling} value={feeling}>{feeling}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="button-row">
          <button className="btn btn--secondary" onClick={saveDraft} type="button">Tallenna luonnos</button>
          <button className="btn btn--success" onClick={() => setShowConfirm(true)} type="button">Merkitse valmiiksi</button>
        </div>
      </Card>
      ) : null}

      <Card>
        <span className="card__eyebrow">Lisätiedot</span>
        <p>Kirjaa sarjat muodossa 15/40 + 10/60 + 6/75. Valmis treeni tallennetaan historiaan omana sessionaan.</p>
      </Card>

      {showConfirm ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <span className="card__eyebrow">Vahvistus</span>
            <h3>Merkitäänkö treeni valmiiksi?</h3>
            <p>Treeni tallennetaan historiaan. Voit avata treenin myöhemmin uudelleen muokattavaksi.</p>
            <div className="button-row">
              <button className="btn btn--ghost" onClick={() => setShowConfirm(false)} type="button">Peruuta</button>
              <button className="btn btn--success" onClick={confirmCompletion} type="button">Kyllä, tallenna</button>
            </div>
          </div>
        </div>
      ) : null}

      <CompletionSummary
        duration={completedSummary?.durationMinutes ?? workoutDurationMinutes}
        exerciseCount={completedSummary ? getDraftSummary(completedSummary).exerciseCount : draftSummary.exerciseCount}
        status={completedSummary ? 'Valmis' : 'Luonnos'}
        totalSets={completedSummary ? getDraftSummary(completedSummary).totalSets : draftSummary.totalSets}
        topHighlight={completedSummary ? getDraftSummary(completedSummary).topHighlight : draftSummary.topHighlight}
        workoutName={completedSummary?.workoutName ?? currentDraft?.workoutName ?? selectedDay.name}
      />
    </div>
  )
}
