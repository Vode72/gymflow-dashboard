import Card from '../components/Card'
import { useState } from 'react'

export default function Program({ program, exercises }) {
  const [notice, setNotice] = useState('')
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]))
  const programNotice = 'Ohjelman muokkaus lisätään myöhemmässä vaiheessa.'
  const bankNotice = 'Liikepankin muokkaus lisätään myöhemmässä vaiheessa.'
  const dayNotice = 'Treenipäivän muokkaus lisätään myöhemmässä vaiheessa.'

  return (
    <div className="page-stack">
      <Card tone="accent">
        <span className="card__eyebrow">Käyttäjän ohjelma</span>
        <h2>{program.name}</h2>
        <p>Treenipäivät ovat muokattava lista. Ohjelma ei ole sidottu neljään päivään.</p>
        <p>Demo-ohjelma sisältää neljä treenipäivää. Voit myöhemmin lisätä, poistaa ja nimetä treenipäivät vapaasti.</p>
        <p>Muokkaustoiminnot ovat tulossa. Nykyinen näkymä näyttää demo-ohjelman rakenteen.</p>
        {notice ? <div className="inline-notice" role="status">{notice}</div> : null}
        <div className="button-row">
          <button className="btn btn--primary" onClick={() => setNotice(programNotice)} type="button">Lisää treenipäivä</button>
          <button className="btn btn--ghost" onClick={() => setNotice(bankNotice)} type="button">Liikepankki</button>
        </div>
      </Card>

      {program.workoutDays.map((day) => (
        <Card className="program-day" key={day.id}>
          <span className="card__eyebrow">Järjestys {day.order}</span>
          <h3>{day.name}</h3>
          <p>{day.description}</p>
          <div className="tag-list">
            {day.exerciseIds.map((id) => (
              <span className="tag" key={id}>{exerciseMap.get(id)?.name ?? id}</span>
            ))}
          </div>
          <div className="button-row">
            <button className="btn" onClick={() => setNotice(dayNotice)} type="button">Muokkaa</button>
            <button className="btn btn--ghost" onClick={() => setNotice(dayNotice)} type="button">Lisää liike</button>
          </div>
        </Card>
      ))}

      <Card>
        <span className="card__eyebrow">Liikepankki</span>
        <p>{exercises.length} aktiivista liikettä. Korvaavat liikkeet ja muistiinpanot ovat valmiina mallissa.</p>
      </Card>
    </div>
  )
}
