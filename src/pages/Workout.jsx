import { useEffect, useMemo, useRef, useState } from 'react'
import Card from '../components/Card'
import CompletionSummary from '../components/CompletionSummary'
import ExerciseLogCard from '../components/ExerciseLogCard'
import WorkoutDayPicker from '../components/WorkoutDayPicker'
import { getExerciseImage } from '../data/exerciseImages'
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
const durationPresets = [30, 45, 60, 75, 90, 105, 120]
const exerciseDurationPresets = [5, 10, 15, 20, 25, 30]
const exerciseDurationStep = 1
const minExerciseDurationMinutes = 5
const maxExerciseDurationMinutes = 30

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

function ExerciseImageFallback({ exercise, large = false }) {
  return (
    <span
      aria-label={`${getExerciseDisplayName(exercise)} exercise illustration`}
      className={large ? 'exercise-detail-fallback' : 'exercise-card-fallback'}
    >
      {getExerciseInitials(exercise)}
    </span>
  )
}

function ExerciseImage({ className, exercise, fallbackLarge = false, src }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const hasError = src && failedSrc === src

  if (!src || hasError) {
    return <ExerciseImageFallback exercise={exercise} large={fallbackLarge} />
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      src={src}
    />
  )
}

function DurationControls({
  ariaLabel = 'Treenin keston pikavalinnat',
  onAdjust,
  onSelectPreset,
  presets = durationPresets,
  value,
}) {
  return (
    <div className="duration-control">
      <div className="duration-stepper">
        <button onClick={() => onAdjust(-1)} type="button">-</button>
        <strong>{formatDuration(value)}</strong>
        <button onClick={() => onAdjust(1)} type="button">+</button>
      </div>
      <div aria-label={ariaLabel} className="duration-presets">
        {presets.map((preset) => (
          <button
            aria-pressed={value === preset}
            key={preset}
            onClick={() => onSelectPreset(preset)}
            type="button"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  )
}

function normalizeExerciseDuration(value) {
  const duration = Number(value)
  if (!Number.isFinite(duration) || duration <= 0) return 10

  return Math.min(maxExerciseDurationMinutes, Math.max(minExerciseDurationMinutes, duration))
}

function WorkoutExerciseListItem({ exercise, log, onSelect, sessions }) {
  const trackingType = log?.trackingType ?? getExerciseTrackingType(exercise)
  const typeLabel = getExerciseLogTypeLabel({ trackingType })
  const status = hasLoggedExercise(log) ? 'Kirjattu' : 'Ei kirjattu'
  const lastResult = getLastExerciseResult(sessions, exercise.id)
  const exerciseImage = getExerciseImage(exercise.imageKey)

  return (
    <button
      className={`workout-exercise-row ${status === 'Kirjattu' ? 'is-logged' : ''}`}
      data-workout-exercise-id={exercise.id}
      onClick={onSelect}
      type="button"
    >
      <span className="exercise-card-media" aria-hidden={exerciseImage ? undefined : 'true'}>
        <ExerciseImage
          className="exercise-card-thumb"
          exercise={exercise}
          src={exerciseImage}
        />
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
  onNavigate,
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
  const [selectedDayId, setSelectedDayId] = useState(activeDraft?.workoutDayId ?? suggestedDay?.id ?? activeDays[0]?.id)
  const [selectedExerciseState, setSelectedExerciseState] = useState({ dayId: null, exerciseId: null })
  const [showConfirm, setShowConfirm] = useState(false)
  const [completedSummary, setCompletedSummary] = useState(null)
  const [customExerciseNotice, setCustomExerciseNotice] = useState('')
  const [targetedWarmupPopupOpen, setTargetedWarmupPopupOpen] = useState(false)
  const [targetedWarmupPopupMode, setTargetedWarmupPopupMode] = useState('first')
  const pendingExerciseScrollRef = useRef(null)
  const effectiveSelectedDayId = selectedWorkoutDayId ?? activeDraft?.workoutDayId ?? selectedDayId
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
  const selectedExerciseImage = getExerciseImage(selectedExercise?.imageKey)
  const selectedExerciseDurationMinutes = normalizeExerciseDuration(selectedExerciseLog?.durationMinutes)
  const draftSummary = getDraftSummary(currentDraft)
  const workoutDurationMinutes = Number(currentDraft?.durationMinutes) || 0

  useEffect(() => {
    if (selectedExercise || !pendingExerciseScrollRef.current) return undefined

    const targetId = pendingExerciseScrollRef.current
    pendingExerciseScrollRef.current = null
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(`[data-workout-exercise-id="${targetId}"]`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [selectedExercise])

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

  function updateExerciseComment(exerciseId, exerciseComment) {
    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => (
        exercise.exerciseId === exerciseId
          ? { ...exercise, exerciseComment }
          : exercise
      )),
    }))
  }

  function updateExerciseDuration(exerciseId, durationMinutes) {
    updateDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => (
        exercise.exerciseId === exerciseId
          ? { ...exercise, durationMinutes: normalizeExerciseDuration(durationMinutes) }
          : exercise
      )),
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
    const nextDuration = Math.max(0, current + change)

    updateDraftField('durationMinutes', nextDuration)
  }

  function setWorkoutDuration(durationMinutes) {
    updateDraftField('durationMinutes', Math.max(0, Number(durationMinutes) || 0))
  }

  function adjustExerciseDuration(change) {
    if (!selectedExercise) return

    updateExerciseDuration(
      selectedExercise.id,
      selectedExerciseDurationMinutes + change,
    )
  }

  function setExerciseDuration(durationMinutes) {
    if (!selectedExercise) return

    updateExerciseDuration(selectedExercise.id, durationMinutes)
  }

  function finishSelectedExercise() {
    if (!selectedExercise || !selectedDay) return

    const selectedIndex = exerciseList.findIndex((exercise) => exercise.id === selectedExercise.id)
    const nextUnfinishedExercise = exerciseList
      .slice(selectedIndex + 1)
      .find((exercise) => !hasLoggedExercise(currentDraft?.exercises.find((item) => item.exerciseId === exercise.id)))

    pendingExerciseScrollRef.current = nextUnfinishedExercise?.id ?? selectedExercise.id ?? exerciseList[0]?.id ?? null
    setSelectedExerciseState({ dayId: selectedDay.id, exerciseId: null })
  }

  function confirmCompletion() {
    const completed = completeWorkout(currentDraft)
    setShowConfirm(false)
    setCompletedSummary(completed)
    if (completed) {
      onNavigate('history')
    }
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
                <span className="muted-label">Liikkeen kesto</span>
                <DurationControls
                  ariaLabel="Liikkeen keston pikavalinnat"
                  onAdjust={(direction) => adjustExerciseDuration(direction * exerciseDurationStep)}
                  onSelectPreset={setExerciseDuration}
                  presets={exerciseDurationPresets}
                  value={selectedExerciseDurationMinutes}
                />
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
              <div className="exercise-detail-image-wrap">
                <ExerciseImage
                  className="exercise-detail-image"
                  exercise={selectedExercise}
                  fallbackLarge
                  src={selectedExerciseImage}
                />
              </div>
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
            <label className="field exercise-comment-field">
              <span className="muted-label">Liikkeen kommentti</span>
              <textarea
                onChange={(event) => updateExerciseComment(selectedExercise.id, event.target.value)}
                placeholder="esim. hyvä tuntuma, seuraavalla kerralla +2,5 kg"
                rows="3"
                value={selectedExerciseLog?.exerciseComment ?? ''}
              />
            </label>
          </div>

          <div className="workout-detail-card__footer">
            <button
              className="btn btn--success"
              onClick={finishSelectedExercise}
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
            <DurationControls
              onAdjust={adjustWorkoutDuration}
              onSelectPreset={setWorkoutDuration}
              value={workoutDurationMinutes}
            />
            <span className="hint">Säädä 1 minuutin askelilla. Oletus 45 min.</span>
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
