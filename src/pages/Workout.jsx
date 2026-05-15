import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import CompletionSummary from '../components/CompletionSummary'
import ExerciseLogCard from '../components/ExerciseLogCard'
import WorkoutDayPicker from '../components/WorkoutDayPicker'
import { formatDuration } from '../utils/durationUtils'
import { isValidSetsText, parseSetsText } from '../utils/parseSets'
import { calculateExerciseLogStats } from '../utils/progressLogic'
import { getActiveWorkoutDays, getNextWorkoutDay } from '../utils/workoutLogic'

const feelingOptions = ['Normaali', 'Hyvä', 'Vahva', 'Väsynyt']

function getDraftSummary(draft) {
  const loggedExercises = draft?.exercises.filter((exercise) => {
    if (exercise.trackingType === 'warmupDuration' || exercise.trackingType === 'duration') {
      return Boolean(
        exercise.durationMinutes ||
        exercise.completed ||
        exercise.customWarmupName?.trim(),
      )
    }
    if (exercise.trackingType === 'warmupNote' || exercise.trackingType === 'note') {
      return Boolean(
        exercise.note?.trim() ||
        exercise.completed ||
        exercise.customWarmupName?.trim(),
      )
    }
    return exercise.sets.length > 0
  }) ?? []
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

export default function Workout({
  activeDraft,
  completeWorkout,
  exercises,
  program,
  saveDraft,
  sessions,
  startDraft,
  updateDraft,
}) {
  const activeDays = getActiveWorkoutDays(program)
  const suggestedDay = getNextWorkoutDay(program, sessions)
  const [selectedDayId, setSelectedDayId] = useState(suggestedDay?.id ?? activeDays[0]?.id)
  const [showConfirm, setShowConfirm] = useState(false)
  const [completedSummary, setCompletedSummary] = useState(null)
  const selectedDay = activeDays.find((day) => day.id === selectedDayId) ?? activeDays[0]

  const selectedExercises = useMemo(() => {
    const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]))
    return selectedDay?.exerciseIds.map((id) => bank.get(id)).filter(Boolean) ?? []
  }, [exercises, selectedDay])

  useEffect(() => {
    if (!completedSummary && selectedDay && selectedExercises.length) {
      startDraft(selectedDay, selectedExercises)
    }
  }, [completedSummary, selectedDay, selectedExercises, startDraft])

  const previousResults = useMemo(() => {
    const results = new Map()
    const completed = [...sessions]
      .filter((session) => session.status === 'completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

    completed.forEach((session) => {
      session.exercises.forEach((exercise) => {
        if (results.has(exercise.exerciseId)) return
        const sets = exercise.sets ?? []
        if (!sets.length) return
        const topSet = [...sets].sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0]
        results.set(
          exercise.exerciseId,
          `Viimeksi: ${sets.length} sarjaa · Top ${topSet.weight} kg · ${topSet.reps} toistoa`,
        )
      })
    })

    return results
  }, [sessions])

  const draftSummary = getDraftSummary(activeDraft)
  const durationHours = Math.floor((Number(activeDraft?.durationMinutes) || 0) / 60)
  const durationMinutes = (Number(activeDraft?.durationMinutes) || 0) % 60

  function selectWorkoutDay(dayId) {
    setSelectedDayId(dayId)
    setCompletedSummary(null)
    setShowConfirm(false)
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

  function updateDraftField(field, value) {
    updateDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateWorkoutDuration(part, value) {
    const numericValue = Math.max(0, Number(value) || 0)
    const nextHours = part === 'hours' ? numericValue : durationHours
    const nextMinutes = part === 'minutes' ? numericValue : durationMinutes
    updateDraftField('durationMinutes', nextHours * 60 + nextMinutes)
  }

  function confirmCompletion() {
    const completed = completeWorkout(activeDraft)
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

      <Card>
        <span className="card__eyebrow">Kirjaustila</span>
        <h3>{activeDraft?.workoutName ?? selectedDay.name}</h3>
        <p>Luonnos tallennettu · {activeDraft?.updatedAt ? new Date(activeDraft.updatedAt).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) : 'Ei muutoksia'}</p>
        <div className="workout-meta-grid">
          <label className="field">
            <span className="muted-label">Treenin kesto</span>
            <div className="duration-inputs">
              <div className="input-with-unit">
                <input
                  min="0"
                  onChange={(event) => updateWorkoutDuration('hours', event.target.value)}
                  type="number"
                  value={durationHours || ''}
                />
                <span>h</span>
              </div>
              <div className="input-with-unit">
                <input
                  min="0"
                  onChange={(event) => updateWorkoutDuration('minutes', event.target.value)}
                  type="number"
                  value={durationMinutes || ''}
                />
                <span>min</span>
              </div>
            </div>
            <span className="hint">{formatDuration(activeDraft?.durationMinutes)}</span>
          </label>
          <label className="field">
            <span className="muted-label">Tuntemus</span>
            <select
              onChange={(event) => updateDraftField('feeling', event.target.value)}
              value={activeDraft?.feeling ?? 'Normaali'}
            >
              {feelingOptions.map((feeling) => (
                <option key={feeling} value={feeling}>{feeling}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="button-row">
          <button className="btn" onClick={saveDraft} type="button">Tallenna luonnos</button>
          <button className="btn btn--primary" onClick={() => setShowConfirm(true)} type="button">Merkitse valmiiksi</button>
        </div>
      </Card>

      {selectedExercises.map((exercise) => {
        const log = activeDraft?.exercises.find((item) => item.exerciseId === exercise.id)
        return (
          <ExerciseLogCard
            exercise={exercise}
            key={exercise.id}
            log={log}
            onSetsTextChange={(setsText) => updateExerciseSets(exercise.id, setsText)}
            onWarmupChange={(updates) => updateWarmupLog(exercise.id, updates)}
            previousResult={previousResults.get(exercise.id)}
          />
        )
      })}

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
              <button className="btn btn--primary" onClick={confirmCompletion} type="button">Kyllä, tallenna</button>
            </div>
          </div>
        </div>
      ) : null}

      <CompletionSummary
        duration={completedSummary?.durationMinutes ?? activeDraft?.durationMinutes}
        exerciseCount={completedSummary ? getDraftSummary(completedSummary).exerciseCount : draftSummary.exerciseCount}
        status={completedSummary ? 'Valmis' : 'Luonnos'}
        totalSets={completedSummary ? getDraftSummary(completedSummary).totalSets : draftSummary.totalSets}
        topHighlight={completedSummary ? getDraftSummary(completedSummary).topHighlight : draftSummary.topHighlight}
        workoutName={completedSummary?.workoutName ?? activeDraft?.workoutName ?? selectedDay.name}
      />
    </div>
  )
}
