import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'

const resetMessages = {
  saved: 'Demo-ohjelma, liikepankki ja asetukset palautettiin.',
  blocked: 'Tallennettuja tietoja ei voitu tarkistaa turvallisesti. Palautus estettiin.',
  failed: 'Demodatan palautus epäonnistui. Palautuksen muutokset peruttiin.',
  partial: 'Demodatan palautus jäi kesken. Osa paikallisista tiedoista saattoi muuttua.',
}

export default function Settings({ profile, settings, updateProfile, setSettings, resetLocalData }) {
  const [confirmation, setConfirmation] = useState(null)
  const [result, setResult] = useState(null)
  const pending = useRef(null)
  const dialog = useRef(null)
  const cancelButton = useRef(null)

  useEffect(() => {
    if (confirmation) {
      if (!dialog.current.open) dialog.current.showModal()
      cancelButton.current.focus()
    }
  }, [confirmation])

  function requestReset() {
    if (pending.current) return
    const request = { status: 'confirm-reset' }
    pending.current = request
    setResult(null)
    setConfirmation(request)
  }

  function cancelReset() {
    pending.current = null
    setConfirmation(null)
  }

  function confirmReset() {
    const request = pending.current
    if (!request || request !== confirmation) return
    pending.current = null
    const outcome = resetLocalData(request.status === 'confirm-discard' ? request : undefined)
    if (outcome.status === 'confirm-discard') {
      pending.current = outcome
      setConfirmation(outcome)
      return
    }
    setConfirmation(null)
    setResult(outcome.status)
  }

  const discarding = confirmation?.status === 'confirm-discard'


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
        <p>Palauta demo-ohjelma, liikepankki ja oletusasetukset. Treenihistoria ja profiili säilyvät.</p>
        <div className="button-row">
          <button className="btn btn--secondary" onClick={requestReset} type="button">Palauta demodata</button>
        </div>
        {result && (
          <p className={result === 'saved' ? 'hint--success' : 'inline-notice'} role={result === 'saved' ? 'status' : 'alert'}>
            {resetMessages[result]}
          </p>
        )}
        {confirmation && (
          <dialog
            aria-describedby="demo-reset-description"
            aria-labelledby="demo-reset-title"
            className="modal-card"
            onCancel={cancelReset}
            ref={dialog}
          >
            <h3 id="demo-reset-title">{discarding ? 'Hylätäänkö keskeneräinen treeni?' : 'Palautetaanko demodata?'}</h3>
            <p id="demo-reset-description">
              {discarding
                ? 'Keskeneräinen treeni ei sovi demo-ohjelmaan. Jatkaminen hylkää luonnoksen ja sen kaikki kirjaukset, myös tallentamattomat muutokset.'
                : 'Nykyinen ohjelma, liikepankki ja asetukset korvataan demo-oletuksilla.'}
            </p>
            <div className="button-row">
              <button className="btn btn--secondary" onClick={cancelReset} ref={cancelButton} type="button">Peruuta</button>
              <button className="btn btn--danger" onClick={confirmReset} type="button">
                {discarding ? 'Hylkää luonnos ja palauta' : 'Vahvista palautus'}
              </button>
            </div>
          </dialog>
        )}
      </Card>
    </div>
  )
}
