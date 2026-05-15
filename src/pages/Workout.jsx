import { useMemo, useState } from 'react'
import Card from '../components/Card'
import CompletionSummary from '../components/CompletionSummary'
import ExerciseLogCard from '../components/ExerciseLogCard'
import WorkoutDayPicker from '../components/WorkoutDayPicker'
import { getActiveWorkoutDays, getNextWorkoutDay } from '../utils/workoutLogic'

export default function Workout({ program, exercises, sessions, saveDraft, completeWorkout }) {
  const activeDays = getActiveWorkoutDays(program)
  const suggestedDay = getNextWorkoutDay(program, sessions)
  const [selectedDayId, setSelectedDayId] = useState(suggestedDay?.id ?? activeDays[0]?.id)
  const selectedDay = activeDays.find((day) => day.id === selectedDayId) ?? activeDays[0]

  const selectedExercises = useMemo(() => {
    const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]))
    return selectedDay?.exerciseIds.map((id) => bank.get(id)).filter(Boolean) ?? []
  }, [exercises, selectedDay])

  return (
    <div className="page-stack">
      <Card tone="accent">
        <span className="card__eyebrow">Valittu treeni</span>
        <h2>{selectedDay?.name ?? 'Ei aktiivisia treenipäiviä'}</h2>
        <p>{selectedDay?.description ?? 'Lisää ohjelmaan treenipäivä myöhemmin Ohjelma-näkymässä.'}</p>
      </Card>

      <WorkoutDayPicker days={activeDays} selectedId={selectedDay?.id} onSelect={setSelectedDayId} />

      <Card>
        <span className="card__eyebrow">Kirjaustila</span>
        <h3>Autosave luonnos</h3>
        <p>Luonnos tallennetaan myöhemmin aktiivisena treeninä samalla kun muokkaat sarjoja.</p>
        <div className="button-row">
          <button className="btn" onClick={saveDraft} type="button">Tallenna luonnos</button>
          <button className="btn btn--primary" onClick={completeWorkout} type="button">Merkitse valmiiksi</button>
        </div>
      </Card>

      {selectedExercises.map((exercise) => (
        <ExerciseLogCard exercise={exercise} key={exercise.id} />
      ))}

      <Card>
        <span className="card__eyebrow">Lisätiedot</span>
        <p>Tuntemus, kesto ja “Käytä viimeisintä pohjana” tuodaan tähän seuraavissa vaiheissa.</p>
      </Card>

      <CompletionSummary workoutName={selectedDay?.name} />
    </div>
  )
}
