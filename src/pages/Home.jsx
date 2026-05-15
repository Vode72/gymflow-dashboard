import { useState } from 'react'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import { formatFinnishDate } from '../utils/dateUtils'
import { formatDuration } from '../utils/durationUtils'
import { getLatestCompletedSession, getNextWorkoutDay, getTodaySessions, getWorkoutGapMessage } from '../utils/workoutLogic'

export default function Home({
  onNavigate,
  onSelectWorkoutDay,
  profile,
  program,
  selectedWorkoutDayId,
  sessions,
  updateProfile,
}) {
  const [showDayPicker, setShowDayPicker] = useState(false)
  const latestSession = getLatestCompletedSession(sessions)
  const suggestedWorkout = getNextWorkoutDay(program, sessions)
  const nextWorkout = program.workoutDays.find((day) => day.id === selectedWorkoutDayId) ?? suggestedWorkout
  const todaySessions = getTodaySessions(sessions)
  const latestThree = [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3)

  return (
    <div className="page-stack">
      {!profile.name ? (
        <Card tone="accent">
          <span className="card__eyebrow">Aloitus</span>
          <h2>Tervetuloa GymFlow’hun</h2>
          <p>Aloita nopeasti demo-ohjelmalla. Profiilin, teeman ja yksiköt voit muokata myöhemmin asetuksissa.</p>
          <div className="button-row">
            <button className="btn btn--primary" onClick={() => updateProfile({ name: 'Toni' })} type="button">
              Aloita demo-ohjelmalla
            </button>
            <button className="btn btn--ghost" onClick={() => onNavigate('settings')} type="button">
              Muokkaa asetuksissa
            </button>
          </div>
        </Card>
      ) : null}

      <Card tone="accent">
        <span className="card__eyebrow">Hei {profile.name || 'Toni'}</span>
        <h2>Seuraavaksi: {nextWorkout?.name ?? 'Valitse treeni'}</h2>
        <p>{getWorkoutGapMessage(latestSession)}</p>
        <div className="button-row">
          <button className="btn btn--primary" onClick={() => onNavigate('workout')} type="button">
            Aloita treeni
          </button>
          <button className="btn btn--ghost" onClick={() => setShowDayPicker(true)} type="button">
            Vaihda päivä
          </button>
        </div>
      </Card>

      {showDayPicker ? (
        <div className="modal-backdrop" role="presentation">
          <div aria-modal="true" className="modal-card" role="dialog">
            <span className="card__eyebrow">Treeni</span>
            <h3>Valitse treeni</h3>
            <p>Valitse, minkä treenin haluat tehdä seuraavaksi.</p>
            <div className="choice-list">
              {program.workoutDays.map((day) => (
                <button
                  aria-pressed={nextWorkout?.id === day.id}
                  key={day.id}
                  onClick={() => {
                    onSelectWorkoutDay(day.id)
                    setShowDayPicker(false)
                  }}
                  type="button"
                >
                  <strong>{day.name}</strong>
                  <span>{day.description}</span>
                </button>
              ))}
            </div>
            <div className="button-row">
              <button className="btn btn--ghost" onClick={() => setShowDayPicker(false)} type="button">Peruuta</button>
            </div>
          </div>
        </div>
      ) : null}

      {!latestSession ? (
        <EmptyState title="Ei treenejä vielä.">
          Aloita ensimmäinen treeni ja GymFlow alkaa näyttää historiaa, ennätyksiä ja kehitystä.
        </EmptyState>
      ) : (
        <div className="dashboard-grid dashboard-grid--two">
          <Card>
            <span className="card__eyebrow">Viimeksi</span>
            <h3>{latestSession.workoutName}</h3>
            <p>{formatFinnishDate(latestSession.date)} · {formatDuration(latestSession.durationMinutes)} · {latestSession.feeling}</p>
          </Card>
          <Card>
            <span className="card__eyebrow">Tänään</span>
            <h3>{todaySessions.length} valmista treeniä</h3>
            <p>Rakenne tukee useita treenejä samalle päivälle.</p>
          </Card>
        </div>
      )}

      <div className="stat-grid">
        <StatCard label="Treenejä" value={sessions.length} detail="Demo + paikallinen data" />
        <StatCard label="Päiviä ohjelmassa" value={program.workoutDays.length} detail="Muokattava myöhemmin" />
      </div>

      <Card>
        <span className="card__eyebrow">Viimeiset 3 treeniä</span>
        <div className="list">
          {latestThree.map((session) => (
            <div className="list-item" key={session.id}>
              <div>
                <strong>{session.workoutName}</strong>
                <p>{formatFinnishDate(session.date)}</p>
              </div>
              <span className="pill">{formatDuration(session.durationMinutes)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
