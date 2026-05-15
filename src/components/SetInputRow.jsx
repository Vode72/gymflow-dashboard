export default function SetInputRow({ error, hint = 'Muoto: toistot/paino', onChange, placeholder, summary, value }) {
  return (
    <label className="set-input-row">
      <span className="muted-label">Sarjat</span>
      <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      <span className="hint">{hint}</span>
      {summary ? <span className="hint hint--success">{summary}</span> : null}
      {error ? <span className="hint hint--warning">{error}</span> : null}
    </label>
  )
}
