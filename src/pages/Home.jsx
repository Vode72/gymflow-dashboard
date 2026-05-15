import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import { formatFinnishDate } from '../utils/dateUtils'
import { getLatestCompletedSession, getNextWorkoutDay, getTodaySessions, getWorkoutGapMessage } from '../utils/workoutLogic'

export default function Home({ profile, program, sessions, updateProfile, onNavigate }) {
  const latestSession = getLatestCompletedSession(sessions)
  const nextWorkout = getNextWorkoutDay(program, sessions)
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
          <button className="btn btn--ghost" onClick={() => onNavigate('program')} type="button">
            Vaihda päivä
          </button>
        </div>
      </Card>

      {!latestSession ? (
        <EmptyState title="Ei treenejä vielä.">
          Aloita ensimmäinen treeni ja GymFlow alkaa näyttää historiaa, ennätyksiä ja kehitystä.
        </EmptyState>
      ) : (
        <div className="dashboard-grid dashboard-grid--two">
          <Card>
            <span className="card__eyebrow">Viimeksi</span>
            <h3>{latestSession.workoutName}</h3>
            <p>{formatFinnishDate(latestSession.date)} · {latestSession.durationMinutes} min · {latestSession.feeling}</p>
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
              <span className="pill">{session.durationMinutes} min</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
