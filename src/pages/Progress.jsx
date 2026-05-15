import Card from '../components/Card'
import StatCard from '../components/StatCard'
import { calculatePersonalRecords } from '../utils/progressLogic'

export default function Progress({ sessions }) {
  const records = calculatePersonalRecords(sessions)
  const latestRecord = records[0]

  return (
    <div className="page-stack">
      <Card tone="accent">
        <span className="card__eyebrow">Yksi liike kerrallaan</span>
        <h2>{latestRecord?.name ?? 'Valitse liike'}</h2>
        <p>Kehitysnäkymä pidetään rauhallisena: ennätykset, arvioitu 1RM ja myöhemmin yksinkertainen voimakäyrä.</p>
      </Card>
      <div className="stat-grid">
        <StatCard label="Paras sarja" value={latestRecord ? `${latestRecord.topSet.reps}/${latestRecord.topSet.weight}` : '-'} detail="toistot/kg" />
        <StatCard label="Arvioitu 1RM" value={latestRecord ? `${latestRecord.estimatedOneRepMax} kg` : '-'} detail="Epley-kaava" />
      </div>
      <Card>
        <span className="card__eyebrow">Viimeisin PR</span>
        <h3>{latestRecord?.name ?? 'Ei ennätyksiä vielä'}</h3>
        <p>{latestRecord ? `${latestRecord.date} · ${latestRecord.topSet.reps} toistoa · ${latestRecord.topSet.weight} kg` : 'Kun treenejä valmistuu, parhaat sarjat nostetaan tähän.'}</p>
      </Card>
      <Card>
        <span className="card__eyebrow">Voimakäyrä</span>
        <p>Kevyt chart-paikka. Varsinaiset kaaviot lisätään myöhemmin ilman raskaita riippuvuuksia.</p>
      </Card>
    </div>
  )
}
