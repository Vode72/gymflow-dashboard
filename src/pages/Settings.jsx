import Card from '../components/Card'

export default function Settings({ profile, settings, updateProfile, setSettings, resetLocalData }) {
  return (
    <div className="page-stack">
      <Card tone="accent">
        <span className="card__eyebrow">Profiili</span>
        <h2>Asetukset</h2>
        <p>Pakollisia tavoitteita, mittoja tai kirjautumista ei tarvita ennen treenaamista.</p>
      </Card>
      <div className="settings-grid">
        <label className="field">
          <span className="muted-label">Nimi</span>
          <input value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} placeholder="Toni" />
        </label>
        <label className="field">
          <span className="muted-label">Kieli</span>
          <select value={settings.language} onChange={(event) => setSettings((current) => ({ ...current, language: event.target.value }))}>
            <option value="fi">Suomi</option>
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
        </label>
        <label className="field">
          <span className="muted-label">Teema</span>
          <select value={settings.theme} onChange={(event) => setSettings((current) => ({ ...current, theme: event.target.value }))}>
            <option value="light-beige">SAP Light Beige</option>
          </select>
        </label>
        <label className="field">
          <span className="muted-label">Yksiköt</span>
          <select value={settings.units} onChange={(event) => setSettings((current) => ({ ...current, units: event.target.value }))}>
            <option value="kg">kg</option>
          </select>
        </label>
        <label className="field">
          <span className="muted-label">Paino kg</span>
          <input value={profile.weightKg} onChange={(event) => updateProfile({ weightKg: event.target.value })} placeholder="Ei pakollinen" />
        </label>
        <label className="field">
          <span className="muted-label">Pituus cm</span>
          <input value={profile.heightCm} onChange={(event) => updateProfile({ heightCm: event.target.value })} placeholder="Ei pakollinen" />
        </label>
      </div>
      <Card>
        <span className="card__eyebrow">Paikallinen data</span>
        <p>Reset palauttaa demo-ohjelman, liikepankin ja demo-historian localStorageen.</p>
        <div className="button-row">
          <button className="btn btn--danger" onClick={resetLocalData} type="button">Nollaa paikallinen data</button>
        </div>
      </Card>
    </div>
  )
}
