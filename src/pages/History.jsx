import { useState } from 'react'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import { formatFinnishDate } from '../utils/dateUtils'
import { formatDuration } from '../utils/durationUtils'
import { calculateExerciseLogStats } from '../utils/progressLogic'
import { hasLoggedExercise, isGeneralWarmup, isTargetedWarmup } from '../utils/workoutLogUtils'

function formatSets(sets = []) {
  return sets.map((set) => `${set.reps}x${set.weight}`).join(' / ')
}

function getQualityLabel(value) {
  if (!value) return ''
  if (typeof value === 'string') return value

  const labels = {
    1: 'Kevyt',
    2: 'Ok',
    3: 'Hyva',
    4: 'Vahva',
    5: 'Maksimi',
  }

  return labels[Math.round(value)] ?? ''
}

function getSessionExerciseItems(session, program, exercises) {
  const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]))
  const logs = new Map(session.exercises.map((exercise) => [exercise.exerciseId, exercise]))
  const workoutDay = program?.workoutDays?.find((day) => day.id === session.workoutDayId)
  const ids = workoutDay?.exerciseIds ?? []
  const items = ids.map((exerciseId) => ({
    exercise: bank.get(exerciseId),
    exerciseId,
    log: logs.get(exerciseId),
  }))

  session.exercises.forEach((log) => {
    if (ids.includes(log.exerciseId)) return
    items.push({
      exercise: bank.get(log.exerciseId),
      exerciseId: log.exerciseId,
      log,
    })
  })

  return items
}

function getExerciseName(item) {
  return item.log?.exerciseName ?? item.log?.name ?? item.exercise?.name ?? 'Liike'
}

function getBestExercise(items) {
  return items
    .filter((item) => hasLoggedExercise(item.log) && item.log?.sets?.length)
    .map((item) => ({
      ...item,
      stats: {
        ...calculateExerciseLogStats(item.log.sets),
        topKg: item.log.topKg ?? calculateExerciseLogStats(item.log.sets).topKg,
        topReps: item.log.topReps ?? calculateExerciseLogStats(item.log.sets).topReps,
        estimatedOneRepMax: item.log.estimatedOneRepMax ?? calculateExerciseLogStats(item.log.sets).estimatedOneRepMax,
      },
    }))
    .sort((a, b) => (b.stats.estimatedOneRepMax ?? 0) - (a.stats.estimatedOneRepMax ?? 0))[0]
}

function HistoryExerciseDetail({ item, session }) {
  const log = item.log
  const name = getExerciseName(item)

  if (!hasLoggedExercise(log)) {
    return (
      <div className="history-exercise-detail">
        <strong>{name}</strong>
        <p>Ei kirjattu tässä treenissä.</p>
      </div>
    )
  }

  if (isGeneralWarmup(log) || isTargetedWarmup(log)) {
    const parts = []
    if (log.warmupType) parts.push(log.customWarmupName || log.warmupType)
    if (log.durationMinutes) parts.push(formatDuration(log.durationMinutes))
    if (log.note) parts.push(log.note)
    if (log.completed) parts.push('Tehty')

    return (
      <div className="history-exercise-detail">
        <strong>{name}</strong>
        <p>{parts.join(' · ') || 'Merkintä tallennettu'}</p>
      </div>
    )
  }

  const stats = calculateExerciseLogStats(log.sets ?? [])
  const quality = getQualityLabel(log.quality ?? log.sets?.find((set) => set.quality)?.quality ?? session.feeling)

  return (
    <div className="history-exercise-detail">
      <strong>{name}</strong>
      <p>{formatSets(log.sets)}{quality ? ` · Laatu: ${quality}` : ''}</p>
      <div className="history-exercise-detail__stats">
        <span>Top kg: {log.topKg ?? stats.topKg ?? '-'}</span>
        <span>Top reps: {log.topReps ?? stats.topReps ?? '-'}</span>
        <span>1RM: {log.estimatedOneRepMax ?? stats.estimatedOneRepMax ?? '-'} kg</span>
      </div>
    </div>
  )
}

function HistorySessionCard({ exercises, program, session }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const items = getSessionExerciseItems(session, program, exercises)
  const doneItems = items.filter((item) => hasLoggedExercise(item.log))
  const totalSets = doneItems.reduce((sum, item) => sum + (item.log?.sets?.length ?? 0), 0)
  const best = getBestExercise(items)
  const selectedItem = items.find((item) => item.exerciseId === selectedExerciseId)
  const bestId = best?.exerciseId

  return (
    <Card>
      <span className="card__eyebrow">{formatFinnishDate(session.date)} · {session.startTime}</span>
      <h3>{session.workoutName}</h3>
      <p>{formatDuration(session.durationMinutes)} · Tuntemus: {session.feeling} · Tila: completed</p>
      <div className="history-session-summary">
        <span>Tehty: {doneItems.length} / {items.length} liikettä</span>
        <span>{totalSets} sarjaa</span>
        {best ? <span>Paras: {getExerciseName(best)} · {best.stats.topKg} kg · 1RM {best.stats.estimatedOneRepMax} kg</span> : null}
      </div>
      <div className="tag-list">
        {items.map((item) => {
          const isDone = hasLoggedExercise(item.log)
          const isBest = item.exerciseId === bestId
          const chipClass = [
            'history-exercise-chip',
            isDone ? 'history-exercise-chip--done' : 'history-exercise-chip--missed',
            isBest ? 'history-exercise-chip--best' : '',
          ].filter(Boolean).join(' ')

          return (
            <button
              className={chipClass}
              key={item.exerciseId}
              onClick={() => setSelectedExerciseId(selectedExerciseId === item.exerciseId ? null : item.exerciseId)}
              type="button"
            >
              {getExerciseName(item)}
            </button>
          )
        })}
      </div>
      {selectedItem ? <HistoryExerciseDetail item={selectedItem} session={session} /> : null}
      <div className="button-row">
        <button className="btn btn--secondary" disabled type="button">Muokkaa myöhemmin</button>
      </div>
      <p>Valmiin treenin uudelleenavaus lisätään seuraavassa vaiheessa.</p>
    </Card>
  )
}

export default function History({ exercises, program, sessions }) {
  const completed = [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (!completed.length) {
    return <EmptyState title="Historia on tyhjä">Valmiiksi merkityt treenit näkyvät täällä kortteina.</EmptyState>
  }

  return (
    <div className="page-stack">
      <Card>
        <span className="card__eyebrow">Mitä tein viimeksi?</span>
        <p>Avaa liike nähdäksesi sarjat, top kg:n ja 1RM-arvion ilman erillistä taulukkoa.</p>
      </Card>
      {completed.map((session) => (
        <HistorySessionCard
          exercises={exercises}
          key={session.id}
          program={program}
          session={session}
        />
      ))}
    </div>
  )
}
